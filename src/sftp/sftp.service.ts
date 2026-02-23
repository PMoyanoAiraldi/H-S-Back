import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as SftpClient from 'ssh2-sftp-client';
import { parse } from 'csv-parse/sync';
import * as bcrypt from 'bcrypt';
import { rolEnum, User } from 'src/user/users.entity';
import { Linea } from 'src/linea/linea.entity';
import { Marca } from 'src/marca/marca.entity';
import { Rubro } from 'src/rubro/rubro.entity';
import { Products } from 'src/product/product.entity';
import { Precio } from 'src/precio/precio.entity';

// ─────────────────────────────────────────────────────────────
// SFTP SERVICE
// ─────────────────────────────────────────────────────────────
// Este servicio se conecta una vez al día al servidor SFTP,
// descarga cada CSV y sincroniza los datos con la base de datos.
//
// ORDEN DE SINCRONIZACIÓN (importante por dependencias):
//   1. Clientes  → tabla users       (independiente)
//   2. Lineas    → tabla lineas      (independiente)
//   3. Marcas    → tabla marcas      (independiente)
//   4. Rubros    → tabla rubros      (independiente)
//   5. Articulos → tabla products    (depende de Lineas, Marcas, Rubros)
//   6. Precios   → tabla precios     (depende de Articulos/Products)


@Injectable()
export class SftpService {
    private readonly logger = new Logger(SftpService.name);

    // La carpeta base donde están todos los CSV en el SFTP
    private readonly SFTP_BASE = 'ExportacionAWeb';

    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,

    @InjectRepository(Marca)
    private readonly marcaRepository: Repository<Marca>,

    @InjectRepository(Rubro)
    private readonly rubroRepository: Repository<Rubro>,

    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,

    @InjectRepository(Precio)
    private readonly precioRepository: Repository<Precio>,
    ) {}

  // MÉTODO PRINCIPAL - Se ejecuta todos los días a las 2:00 AM
  // Abre UNA sola conexión y procesa todos los archivos en orden

    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async syncTodo() {
        this.logger.log('═══ Iniciando sincronización completa desde SFTP ═══');

        const sftp = new SftpClient();

        try {
        // 1. Conectar al servidor SFTP
        await sftp.connect({
            host: process.env.SFTP_HOST,        // ej: us-east-1.sftpcloud.io
            port: Number(process.env.SFTP_PORT) || 22,
            username: process.env.SFTP_USER,
            password: process.env.SFTP_PASSWORD,
        });

        this.logger.log('Conectado al SFTP');

         // Procesar cada CSV en orden (el orden importa por las dependencias)
            await this.procesarClientes(sftp);
            await this.procesarLineas(sftp);
            await this.procesarMarcas(sftp);
            await this.procesarRubros(sftp);
            await this.procesarArticulos(sftp);
            await this.procesarPrecios(sftp);

            this.logger.log('═══ Sincronización completa finalizada ═══');
            } catch (error) {
            this.logger.error('Error durante la sincronización SFTP:', error);
            } finally {
            // Siempre cierra la conexión, aunque haya error
            await sftp.end();
            }
        }
  // ─────────────────────────────────────────────────────────────
  // HELPER: descarga un CSV del SFTP y lo parsea
  // Recibe el cliente sftp y el nombre del archivo (ej: 'Clientes.csv')
  // Devuelve un array de objetos con las columnas como keys

    private async descargarYParsear(
        sftp: SftpClient,
        nombreArchivo: string,
    ): Promise<Record<string, string>[]> {
        const ruta = `${this.SFTP_BASE}/${nombreArchivo}`;
        this.logger.log(`Descargando ${ruta}...`);

        // 2. Leer el archivo CSV como buffer
        const fileBuffer = await sftp.get(ruta, undefined, { readStreamOptions: {} }) as Buffer; // ej: /ExportacionAWeb/Clientes.csv

        return parse(fileBuffer, {
            columns: true,         // usa la primera fila como cabeceras
            skip_empty_lines: true,
            delimiter: ';',        // cambiá a ',' si tu CSV usa coma
            trim: true,
            bom: true
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 1. CLIENTES → tabla users
    // Crea usuarios nuevos con contraseña temporal 'Cambiar*1'
    // Si ya existe por nombre, no lo toca (evita pisar la contraseña)
    // ─────────────────────────────────────────────────────────────

        private async procesarClientes(sftp: SftpClient) {
            const records = await this.descargarYParsear(sftp, 'Clientes.csv');
            this.logger.log(`Clientes.csv: ${records.length} registros.`);

        // 4. Procesar cada fila
        let creados = 0;
        let activados = 0;
        let desactivados = 0;

        // Obtenemos los nombres que vienen en el CSV
        const nombresEnCsv = records
            .map(row => row['Nombre']?.trim())
            .filter(Boolean);

        // 1. Crear o activar los que están en el CSV
        for (const nombre of nombresEnCsv) {
        // Buscar si ya existe el usuario por nombre
            const existe = await this.userRepository.findOne({ where: { nombre } });

            if (!existe) {
            // No existe → lo creamos
            const passwordTemporal = 'Cambiar*1'; // el usuario deberá cambiarla al primer login
            const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

            await this.userRepository.save(
                this.userRepository.create({
                    nombre,
                    password: hashedPassword,
                    rol: rolEnum.CLIENTE,
                    state: true,
                    mustChangePassword: true,
                }),
                );
                creados++;
            } else if (!existe.state) {
            // Existe pero estaba desactivado → lo reactivamos
            existe.state = true;
            await this.userRepository.save(existe);
            activados++;
            }
            // Si ya existe no lo tocamos: evitamos pisar contraseña u otros datos
        }

            // 2. Desactivar los que NO están en el CSV
        const clientesEnDb = await this.userRepository.find({
            where: { rol: rolEnum.CLIENTE, state: true },
        });

        for (const cliente of clientesEnDb) {
            if (!nombresEnCsv.includes(cliente.nombre)) {
                cliente.state = false;
                await this.userRepository.save(cliente);
                desactivados++;
            }
        }

        this.logger.log(
            `Clientes → Creados: ${creados} | Activados: ${activados} | Desactivados: ${desactivados}`,
        );
    }
         // ─────────────────────────────────────────────────────────────
        // 2. LINEAS → tabla lineas
        // Busca por codigo. Si no existe lo crea, si existe actualiza el nombre.
        // ─────────────────────────────────────────────────────────────

        private async procesarLineas(sftp: SftpClient) {
            const records = await this.descargarYParsear(sftp, 'Lineas.csv');
            this.logger.log(`Lineas.csv: ${records.length} registros`);

            let creados = 0;
            let actualizados = 0;

            for (const row of records) {
            const codigo = parseInt(row['Codigo']);
            const nombre = row['Nombre']?.trim();
            if (!nombre || isNaN(codigo)) continue;

        let linea = await this.lineaRepository.findOne({ where: { codigo } });

        if (!linea) {
            await this.lineaRepository.save(
            this.lineaRepository.create({ codigo, nombre, state: true }),
            );
            creados++;
        } else {
            linea.nombre = nombre;
            await this.lineaRepository.save(linea);
            actualizados++;
        }
        }

        this.logger.log(`Lineas → Creados: ${creados} | Actualizados: ${actualizados}`);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. MARCAS → tabla marcas
    // Misma lógica que Lineas: busca por codigo
    // ─────────────────────────────────────────────────────────────
    private async procesarMarcas(sftp: SftpClient) {
    const records = await this.descargarYParsear(sftp, 'Marcas.csv');
    this.logger.log(`Marcas.csv: ${records.length} registros`);

    let creados = 0;
    let actualizados = 0;

    for (const row of records) {
        const codigo = parseInt(row['Codigo']);
        const nombre = row['Nombre']?.trim();
        if (!nombre || isNaN(codigo)) continue;

        let marca = await this.marcaRepository.findOne({ where: { codigo } });

        if (!marca) {
            await this.marcaRepository.save(
            this.marcaRepository.create({ codigo, nombre, state: true }),
            );
            creados++;
        } else {
            marca.nombre = nombre;
            await this.marcaRepository.save(marca);
            actualizados++;
        }
        }

        this.logger.log(`Marcas → Creados: ${creados} | Actualizados: ${actualizados}`);
    }

    // ─────────────────────────────────────────────────────────────
    // 4. RUBROS → tabla rubros
    // El CSV tiene "Linea";"Codigo";"Nombre"
    // Busca por codigo. 
    // ─────────────────────────────────────────────────────────────
    private async procesarRubros(sftp: SftpClient) {
        const records = await this.descargarYParsear(sftp, 'Rubros.csv');
        this.logger.log(`Rubros.csv: ${records.length} registros`);

        let creados = 0;
        let actualizados = 0;

        for (const row of records) {
        const codigo = parseInt(row['Codigo']);
        const nombre = row['Nombre']?.trim();
        if (!nombre || isNaN(codigo)) continue;

        let rubro = await this.rubroRepository.findOne({ where: { codigo } });

        if (!rubro) {
            await this.rubroRepository.save(
            this.rubroRepository.create({ codigo, nombre, state: true }),
            );
            creados++;
        } else {
            rubro.nombre = nombre;
            await this.rubroRepository.save(rubro);
            actualizados++;
        }
        }

        this.logger.log(`Rubros → Creados: ${creados} | Actualizados: ${actualizados}`);
    }

    // ─────────────────────────────────────────────────────────────
    // 5. ARTICULOS → tabla products
    // Tiene relaciones con Linea, Marca y Rubro.
    // El CSV trae el CODIGO de cada relación, no el uuid de la DB.
    // Por eso primero buscamos cada entidad relacionada por su codigo,
    // y luego la asignamos al producto.
    // ─────────────────────────────────────────────────────────────
    private async procesarArticulos(sftp: SftpClient) {
        const records = await this.descargarYParsear(sftp, 'Articulos.csv');
        this.logger.log(`Articulos.csv: ${records.length} registros`);

        let creados = 0;
        let actualizados = 0;

        for (const row of records) {
        const codigo = parseInt(row['Codigo']);
        const nombre = row['Nombre']?.trim();
        if (!nombre || isNaN(codigo)) continue;

        // Buscar las entidades relacionadas por su codigo en la DB
        const marca = row['Marca']
            ? await this.marcaRepository.findOne({ where: { codigo: parseInt(row['Marca']) } })
            : null;

        const linea = row['Linea']
            ? await this.lineaRepository.findOne({ where: { codigo: parseInt(row['Linea']) } })
            : null;

        const rubro = row['Rubro']
            ? await this.rubroRepository.findOne({ where: { codigo: parseInt(row['Rubro']) } })
            : null;

        let product = await this.productRepository.findOne({ where: { codigo } });

        if (!product) {
            await this.productRepository.save(
            this.productRepository.create({
                codigo,
                nombre,
                descripcion: row['DescripcionAdicional']?.trim() || nombre,
                codigoAlternativo1: row['CodAlternativo1']?.trim() || null,
                codigoAlternativo2: row['CodAlternativo2']?.trim() || null,
                marca: marca ?? undefined,
                linea: linea ?? undefined,
                rubro: rubro ?? undefined,
                state: true,
            }),
            );
            creados++;
        } else {
            product.nombre = nombre;
            product.descripcion = row['DescripcionAdicional']?.trim() || nombre;
            product.codigoAlternativo1 = row['CodAlternativo1']?.trim() || null;
            product.codigoAlternativo2 = row['CodAlternativo2']?.trim() || null;
            product.marca = marca ?? product.marca;
            product.linea = linea ?? product.linea;
            product.rubro = rubro ?? product.rubro;
            await this.productRepository.save(product);
            actualizados++;
        }
        }

        this.logger.log(`Articulos → Creados: ${creados} | Actualizados: ${actualizados}`);
    }

        // ─────────────────────────────────────────────────────────────
        // 6. PRECIOS → tabla precios
        // El CSV tiene "Lista";"Articulo";"Moneda";"Valor"
        // "Articulo" es el codigo del producto.
        // Buscamos el producto por codigo y creamos/actualizamos
        // el precio para esa lista específica.
        // ─────────────────────────────────────────────────────────────
    private async procesarPrecios(sftp: SftpClient) {
        const records = await this.descargarYParsear(sftp, 'Precios.csv');
        this.logger.log(`Precios.csv: ${records.length} registros`);

        let creados = 0;
        let actualizados = 0;

        for (const row of records) {
        const listaPrecio = parseInt(row['Lista']);
        const codigoArticulo = parseInt(row['Articulo']);
        const valor = parseFloat(row['Valor']?.replace(',', '.'));

        if (isNaN(listaPrecio) || isNaN(codigoArticulo) || isNaN(valor)) continue;

        // Buscar el producto al que pertenece este precio
        const producto = await this.productRepository.findOne({
            where: { codigo: codigoArticulo },
        });

        if (!producto) continue;

        // Buscar si ya existe un precio para esta lista y este producto
        let precio = await this.precioRepository.findOne({
            where: { listaPrecio, producto: { id: producto.id } },
            relations: ['producto'],
        });

        if (!precio) {
            await this.precioRepository.save(
            this.precioRepository.create({ listaPrecio, precio: valor, producto }),
            );
            creados++;
        } else {
            precio.precio = valor;
            await this.precioRepository.save(precio);
            actualizados++;
        }
        }

        this.logger.log(`Precios → Creados: ${creados} | Actualizados: ${actualizados}`);
    }

    // Método para disparar la sincronización manualmente (útil para testing)
    async syncManual() {
        return this.syncTodo();
    }
}