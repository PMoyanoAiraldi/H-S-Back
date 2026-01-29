import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rubro } from "./rubro.entity";
import { QueryFailedError, Repository } from "typeorm";
import { CreateRubroDto } from "./dto/create-rubro.dto";
import { UpdateRubroDto } from "./dto/update-rubro.dto";
import { Products } from "src/product/product.entity";
import { ResponseProductDto } from "src/product/dto/response-product.dto";
import { ResponseRubroDto } from "./dto/response-rubro.dto";

@Injectable()
export class RubroService {
    constructor(
    @InjectRepository(Rubro)
        private readonly rubroRepository: Repository<Rubro>
    ) { }

    async createRubro(createRubroDto: CreateRubroDto): Promise<Rubro> {
            try{
            const normalizedName = createRubroDto.nombre.trim().toLowerCase();
        
            const existingRubro = await this.rubroRepository
            .createQueryBuilder('rubro')
            .where('LOWER(rubro.nombre) = :nombre', { nombre: normalizedName })
            .getOne();
        
            if (existingRubro) {
                throw new HttpException(`El rubro "${createRubroDto.nombre}" ya existe.`, HttpStatus.BAD_REQUEST);
            }   
            
            const rubro = this.rubroRepository.create({
                nombre: createRubroDto.nombre.trim(), // Guardar el nombre normalizado
                codigo: createRubroDto.codigo,
            });
        
            console.log("Rubro antes de ser guardado", rubro)
                return await this.rubroRepository.save(rubro);
            } catch (error) {
                if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                    // Error de unicidad detectado (código específico de PostgreSQL)
                    throw new HttpException(
                        'Ya existe un rubro con ese nombre.',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                // Si el error no es de unicidad, lánzalo tal como está
                throw error;
            }
                }
    async findAllRubro(): Promise<Rubro[]> {
            return await this.rubroRepository.find({
            order: { nombre: 'ASC' }
        });
    }

    async findAllActive(): Promise<Rubro[]> {
        return this.rubroRepository.find({
            where: { state: true },
            order: { nombre: 'ASC' }
        });
    }
            
    async findOneRubro(id: string): Promise<Rubro> {
        const rubro = await this.rubroRepository.findOne({ where: { id } });
            if (!rubro) {
                throw new NotFoundException(`Rubro con ID ${id} no encontrado`);
        }
            return rubro;
    }
    
    async findOneActiveRubro(id: string): Promise<Rubro> {
            const rubro = await this.rubroRepository.findOne({ where: { id } });
                if (!rubro.state) {
                    throw new NotFoundException(`Rubro con ID ${id} no encontrado`);
                }
                    return rubro;
                }
async update(id: string, updateRubroDto: UpdateRubroDto): Promise<Rubro> {
        const rubro = await this.rubroRepository.findOne({ where: { id } });
            if (!rubro) {
                throw new NotFoundException(`Rubro con ID ${id} no encontrado`);
            } 
            if (!updateRubroDto.nombre) {
                throw new BadRequestException('No se proporcionaron datos para actualizar el rubro.');
            }
                
            if (updateRubroDto.nombre) {
                const normalizedName = updateRubroDto.nombre.trim().toLowerCase();// Normaliza a minúsculas
        
            const existingRubro = await this.rubroRepository.findOne({
                where: { nombre: normalizedName},
            });
                
            if (existingRubro && existingRubro.id !== id) {
                    throw new BadRequestException(`El nombre del rubro "${updateRubroDto.nombre}" ya existe`);
            }
        
        // Verificar si el nombre propuesto es igual al actual al normalizarlo
        if (rubro.nombre.toLowerCase() === normalizedName) {
                    throw new BadRequestException(`El nombre del rubro "${updateRubroDto.nombre}" ya existe`);
            }
        
        // Asignar el nombre normalizado
        rubro.nombre = updateRubroDto.nombre.trim();
        }
                        
        try {
            return await this.rubroRepository.save(rubro);
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new HttpException(
                'Ya existe un rubro con ese nombre.',
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


        async updateState(id: string, state: boolean): Promise<Rubro> {
        const rubro = await this.rubroRepository.findOne({ where: { id } });
        rubro.state = state;
        return this.rubroRepository.save(rubro);
    }

        async findProductByRubro(rubroId: string): Promise <ResponseRubroDto> {
                    const rubro = await this.rubroRepository.findOne({
                            where: { id: rubroId },
                            relations: ['productos'],
                    });
                
                    if (!rubro || !rubro.state) {
                        throw new HttpException("Marca no encontrada", HttpStatus.NOT_FOUND);
                    }
                
                    // Filtra los productos activos
                    const productActives = rubro.productos
                    .filter(product => product.state)
                    .map(product => this.toProductResponseDto(product)) //función que convierte entidades en DTO
                
                        // Devuelve la información de la rubro activa con sus productos activos
                        return {
                        codigo: rubro.codigo,
                        nombre: rubro.nombre, 
                        productos: productActives
                    };
                
                    }
}