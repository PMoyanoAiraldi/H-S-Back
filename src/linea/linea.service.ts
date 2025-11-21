import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import { Linea } from "src/linea/linea.entity";
import { CreateLineaDto } from "./dto/create-linea.dto";
import { UpdateLineaDto } from "./dto/update-linea.dto";
import { ResponseLineaDto } from "./dto/response-linea.dto";
import { Products } from "src/product/product.entity";
import { ResponseProductDto } from "src/product/dto/response-product.dto";

@Injectable()
export class LineaService {
    constructor(
        @InjectRepository(Linea)
        private readonly lineaRepository: Repository<Linea>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async create(createLineaDto: CreateLineaDto, file?: Express.Multer.File): Promise<Linea> {
        try{
        // Normalizar el nombre a minúsculas
    const normalizedName = createLineaDto.nombre.trim().toLowerCase();

    // Verificar si existe una linea con el mismo nombre normalizado
    const existingLinea = await this.lineaRepository
    .createQueryBuilder('linea')
    .where('LOWER(linea.nombre) = :nombre', { nombre: normalizedName })
    .getOne();

    if (existingLinea) {
        // Lanza un error si ya existe una linea con ese nombre
        throw new HttpException(`La linea "${createLineaDto.nombre}" ya existe.`, HttpStatus.BAD_REQUEST);
    }

    let imageUrl: string | undefined;
        if(file){
        try {
            // Subir la imagen a Cloudinary y obtener la URL
            imageUrl = await this.cloudinaryService.uploadFile(file.buffer, 'linea', file.originalname);
            console.log('Archivo subido a URL:', imageUrl);
        } catch (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            throw new InternalServerErrorException('Error al subir la imagen');
        }
    }

    
    // Si no existe, crea y guarda la nueva linea
    const linea = this.lineaRepository.create({
        nombre: createLineaDto.nombre.trim(), // Guardar el nombre normalizado
        codigo: createLineaDto.codigo,
        // image: imageUrl
    });

    console.log("Linea antes de ser guardada", linea)

        return await this.lineaRepository.save(linea);
    } catch (error) {
        if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
            // Error de unicidad detectado (código específico de PostgreSQL)
            throw new HttpException(
                'Ya existe una categoría con ese nombre.',
                HttpStatus.BAD_REQUEST,
            );
        }
        // Si el error no es de unicidad, lánzalo tal como está
        throw error;
    }
        }

        async findAll(): Promise<Linea[]> {
            return await this.lineaRepository.find();
        }

        async findOne(id: string): Promise<Linea> {
            const linea = await this.lineaRepository.findOne({ where: { id } });
            if (!linea) {
                throw new NotFoundException(`Linea con ID ${id} no encontrada`);
            }
            return linea;
        }

        async findOneActiv(id: string): Promise<Linea> {
            const linea = await this.lineaRepository.findOne({ where: { id } });
            if (!linea.state) {
                throw new NotFoundException(`Linea con ID ${id} no encontrada`);
            }
            return linea;
        }

        async update(id: string, updateLineaDto: UpdateLineaDto, file?: Express.Multer.File): Promise<Linea> {
        
            const linea = await this.lineaRepository.findOne({ where: { id } });
            if (!linea) {
            throw new NotFoundException(`Linea con ID ${id} no encontrada`);
            } 
    
            // Si no se proporciona ningún dato válido, lanzar un error
            if (!updateLineaDto.nombre && !file) {
                throw new BadRequestException('No se proporcionaron datos para actualizar la linea.');
            }
            
            // Verificar si el nombre ya existe en otra linea
            if (updateLineaDto.nombre) {
                const normalizedName = updateLineaDto.nombre.trim().toLowerCase();// Normaliza a minúsculas
                // Buscar si ya existe otra linea con el mismo nombre (ignorando mayúsculas)
                const existingLinea = await this.lineaRepository.findOne({
                    where: { nombre: normalizedName},
                });
                if (existingLinea && existingLinea.id !== id) {
                    throw new BadRequestException(`El nombre de la linea "${updateLineaDto.nombre}" ya existe`);
                }
    
                // Verificar si el nombre propuesto es igual al actual al normalizarlo
                if (linea.nombre.toLowerCase() === normalizedName) {
                    throw new BadRequestException(`El nombre de la linea "${updateLineaDto.nombre}" ya existe`);
                }
    
                // Asignar el nombre normalizado
                linea.nombre = UpdateLineaDto.name.trim();
            }
            
    
                if (file) {
                        // Eliminar la imagen anterior si existe
                        console.log('Archivo recibido en el servicio:', file);
                        if (linea.imgUrl) {
                            try {
                            await this.cloudinaryService.deleteFile(linea.imgUrl);
                        } catch (error) {
                        console.error('Error al manejar la imagen:', error);
                        throw new InternalServerErrorException('Error al manejar la imagen');
                    }
                }
    
                    try{
                        // Subir la nueva imagen
                        const newImageUrl = await this.cloudinaryService.uploadFile(
                            file.buffer,
                            'category',
                            file.originalname,
                        );
                        linea.imgUrl = newImageUrl; // Asignar la nueva URL de la imagen
                    } catch (error) {
                        console.error('Error al subir la nueva imagen:', error);
                        throw new InternalServerErrorException('Error al subir la nueva imagen');
                    }
                }
    
            try {
                return await this.lineaRepository.save(linea);
            } catch (error) {
                if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                    throw new HttpException(
                        'Ya existe una linea con ese nombre.',
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
            imgUrl: product.imgUrl,
            state: product.state,
            marcaNombre: product.marca?.nombre,
            lineaNombre: product.linea?.nombre,
            rubroNombre: product.rubro?.nombre,
            subRubroNombre: product.subRubro?.nombre,
        };
    }

    async findProductByLinea(lineaId: string): Promise <ResponseLineaDto> {
        const linea = await this.lineaRepository.findOne({
            where: { id: lineaId },
            relations: ['productos'],
        });

        if (!linea || !linea.state) {
        throw new HttpException("Linea no encontrada", HttpStatus.NOT_FOUND);
        }

        // Filtra los productos activos
        const productActives = linea.productos
        .filter(product => product.state)
        .map(product => this.toProductResponseDto(product)) //función que convierte entidades en DTO

        // Devuelve la información de la linea activa con sus productos activos
        return {
        codigo: linea.codigo,
        nombre: linea.nombre, 
        productos: productActives
    };

    }

}