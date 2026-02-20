import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as SftpClient from 'ssh2-sftp-client';
import { parse } from 'csv-parse/sync';
import * as bcrypt from 'bcrypt';
import { rolEnum, User } from 'src/user/users.entity';


@Injectable()
export class SftpService {
    private readonly logger = new Logger(SftpService.name);

    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ) {}

  // Se ejecuta todos los días a las 2:00 AM
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async syncClientes() {
        this.logger.log('Iniciando sincronización de Clientes.csv desde SFTP...');

        const sftp = new SftpClient();

        try {
        // 1. Conectar al servidor SFTP
        await sftp.connect({
            host: process.env.SFTP_HOST,        // ej: us-east-1.sftpcloud.io
            port: Number(process.env.SFTP_PORT) || 22,
            username: process.env.SFTP_USER,
            password: process.env.SFTP_PASSWORD,
        });

        this.logger.log('Conectado al SFTP. Descargando archivo...');

        const list = await sftp.list('/');
        this.logger.log('Archivos en raíz: ' + JSON.stringify(list.map(f => f.name)));

        const list2 = await sftp.list('.');
        this.logger.log('Archivos en ./: ' + JSON.stringify(list2.map(f => f.name)));



        // 2. Leer el archivo CSV como buffer
        const fileBuffer = await sftp.get(process.env.SFTP_CSV_PATH, undefined, { readStreamOptions: {} }) as Buffer; // ej: /ExportacionAWeb/Clientes.csv

        // 3. Parsear el CSV (separador por punto y coma o coma, ajustá según tu CSV)
        const records: Record<string, string>[] = parse(fileBuffer, {
            columns: true,         // usa la primera fila como cabeceras
            skip_empty_lines: true,
            delimiter: ';',        // cambiá a ',' si tu CSV usa coma
            trim: true,
            bom: true
        });

        this.logger.log(`CSV parseado. ${records.length} clientes encontrados.`);

        // 4. Procesar cada fila
        let creados = 0;
        let actualizados = 0;

        for (const row of records) {
            const nombre = row['Nombre']?.trim();

            if (!nombre) continue; // saltar filas sin nombre

            // Buscar si ya existe el usuario por nombre
            let user = await this.userRepository.findOne({ where: { nombre } });

            if (!user) {
            // Crear nuevo usuario con contraseña temporal hasheada
            const passwordTemporal = 'Cambiar*1'; // el usuario deberá cambiarla al primer login
            const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

            user = this.userRepository.create({
                nombre,
                password: hashedPassword,
                rol: rolEnum.CLIENTE,
                state: true,
                mustChangePassword: true,
            });

            await this.userRepository.save(user);
            creados++;
            } else {
            // Si ya existe, actualizamos el nombre por si cambió capitalización u otro dato
            user.nombre = nombre;
            await this.userRepository.save(user);
            actualizados++;
            }
        }

        this.logger.log(
            `Sincronización completada. Creados: ${creados} | Actualizados: ${actualizados}`,
        );
        } catch (error) {
        this.logger.error('Error durante la sincronización SFTP:', error);
        } finally {
        await sftp.end();
        }
    }

    // Método para disparar la sincronización manualmente (útil para testing)
    async syncManual() {
        return this.syncClientes();
    }
}