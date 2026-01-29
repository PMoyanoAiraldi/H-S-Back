import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { Marca } from "./marca.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { CreateMarcaDto } from "./dto/create-marca.dto";
import { UpdateMarcaDto } from "./dto/update-marca.dto";
import { Products } from "src/product/product.entity";
import { ResponseProductDto } from "src/product/dto/response-product.dto";
import { ResponseMarcaDto } from "./dto/response-marca.dto";

@Injectable()
export class MarcaService {
    constructor(
    @InjectRepository(Marca)
        private readonly marcaRepository: Repository<Marca>,
                
    ) { }

    async createMarca(createMarcaDto: CreateMarcaDto): Promise<Marca> {
        try{
            // Normalizar el nombre a minúsculas
        const normalizedName = createMarcaDto.nombre.trim().toLowerCase();
    
        // Verificar si existe una marca con el mismo nombre normalizado
        const existingMarca = await this.marcaRepository
        .createQueryBuilder('marca')
        .where('LOWER(marca.nombre) = :nombre', { nombre: normalizedName })
        .getOne();
    
        if (existingMarca) {
            // Lanza un error si ya existe una marca con ese nombre
            throw new HttpException(`La marca "${createMarcaDto.nombre}" ya existe.`, HttpStatus.BAD_REQUEST);
        }   
        
        // Si no existe, crea y guarda la nueva marca
        const marca = this.marcaRepository.create({
            nombre: createMarcaDto.nombre.trim(), // Guardar el nombre normalizado
            codigo: createMarcaDto.codigo,
        });
    
        console.log("Marca antes de ser guardada", marca)
    
            return await this.marcaRepository.save(marca);
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                // Error de unicidad detectado (código específico de PostgreSQL)
                throw new HttpException(
                    'Ya existe una marca con ese nombre.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            // Si el error no es de unicidad, lánzalo tal como está
            throw error;
        }
            }
    
            // Obtener todas para admin
    async findAll(): Promise<Marca[]> {
        return await this.marcaRepository.find();
    }

    // Obtener solo activas (para público)
    async findAllActive(): Promise<Marca[]> {
        return this.marcaRepository.find({
            where: { state: true },
            order: { nombre: 'ASC' }
        });
    }
        
    async findOne(id: string): Promise<Marca> {
        const marca = await this.marcaRepository.findOne({ where: { id } });
            if (!marca) {
                throw new NotFoundException(`Marca con ID ${id} no encontrada`);
        }
            return marca;
        }

    async findOneActiv(id: string): Promise<Marca> {
        const marca = await this.marcaRepository.findOne({ where: { id } });
            if (!marca.state) {
                throw new NotFoundException(`Marca con ID ${id} no encontrada`);
            }
                return marca;
            }

    async updateState(id: string, state: boolean): Promise<Marca> {
        const marca = await this.findOne(id);
        marca.state = state;
        return this.marcaRepository.save(marca);
    }        
    
    async update(id: string, updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
        const marca = await this.marcaRepository.findOne({ where: { id } });
            if (!marca) {
                throw new NotFoundException(`Marca con ID ${id} no encontrada`);
            } 
        
        // Si no se proporciona ningún dato válido, lanzar un error
            if (!updateMarcaDto.nombre) {
                throw new BadRequestException('No se proporcionaron datos para actualizar la marca.');
            }
                
        // Verificar si el nombre ya existe en otra marca
            if (updateMarcaDto.nombre) {
                const normalizedName = updateMarcaDto.nombre.trim().toLowerCase();// Normaliza a minúsculas
        // Buscar si ya existe otra marca con el mismo nombre (ignorando mayúsculas)
            const existingMarca = await this.marcaRepository.findOne({
                where: { nombre: normalizedName},
            });
                if (existingMarca && existingMarca.id !== id) {
                    throw new BadRequestException(`El nombre de la marca "${updateMarcaDto.nombre}" ya existe`);
            }
        
        // Verificar si el nombre propuesto es igual al actual al normalizarlo
        if (marca.nombre.toLowerCase() === normalizedName) {
                    throw new BadRequestException(`El nombre de la marca "${updateMarcaDto.nombre}" ya existe`);
            }
        
        // Asignar el nombre normalizado
        marca.nombre = updateMarcaDto.nombre.trim();
        }
                        
        try {
            return await this.marcaRepository.save(marca);
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new HttpException(
                'Ya existe una marca con ese nombre.',
                    HttpStatus.BAD_REQUEST,
            );
            }
                throw error;
            }
        }
        
        private toProductResponseDto(product: Products): ResponseProductDto {
            return {
                id: product.id,
                nombre: product.nombre,
                codigo: product.codigo,
                descripcion: product.descripcion,
                codigoAlternativo1: product.codigoAlternativo1,
                codigoAlternativo2: product.codigoAlternativo2,
                imgUrl: product.imgUrl || 'default-image-url.jpg',
                state: product.state,
                marcaNombre: product.marca?.nombre,
                lineaNombre: product.linea?.nombre,
                rubroNombre: product.rubro?.nombre,
                //subRubroNombre: product.subRubro?.nombre,
            };
        }

    async findProductByMarca(marcaId: string): Promise <ResponseMarcaDto> {
            const marca = await this.marcaRepository.findOne({
                    where: { id: marcaId },
                    relations: ['productos'],
            });
        
            if (!marca || !marca.state) {
                throw new HttpException("Marca no encontrada", HttpStatus.NOT_FOUND);
            }
        
            // Filtra los productos activos
            const productActives = marca.productos
            .filter(product => product.state)
            .map(product => this.toProductResponseDto(product)) //función que convierte entidades en DTO
        
                // Devuelve la información de la marca activa con sus productos activos
                return {
                codigo: marca.codigo,
                nombre: marca.nombre, 
                productos: productActives
            };
        
            }
    


}