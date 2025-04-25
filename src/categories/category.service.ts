import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { QueryFailedError, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CloudinaryService } from "src/file-upload/cloudinary.service";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async create(createCategoryDto: CreateCategoryDto, file?: Express.Multer.File): Promise<Category> {
        try{
        // Normalizar el nombre a minúsculas
    const normalizedName = createCategoryDto.name.trim().toLowerCase();

    // Verificar si existe una categoría con el mismo nombre normalizado
    const existingCategory = await this.categoryRepository
    .createQueryBuilder('category')
    .where('LOWER(category.name) = :name', { name: normalizedName })
    .getOne();

    if (existingCategory) {
        // Lanza un error si ya existe una categoría con ese nombre
        throw new HttpException(`La categoría "${createCategoryDto.name}" ya existe.`, HttpStatus.BAD_REQUEST);
    }

    let imageUrl: string | undefined;
        if(file){
        try {
            // Subir la imagen a Cloudinary y obtener la URL
            imageUrl = await this.cloudinaryService.uploadFile(file.buffer, 'categoria', file.originalname);
            console.log('Archivo subido a URL:', imageUrl);
        } catch (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            throw new InternalServerErrorException('Error al subir la imagen');
        }
    }

    
    // Si no existe, crea y guarda la nueva categoría
    const category = this.categoryRepository.create({
        name: createCategoryDto.name.trim(), // Guardar el nombre normalizado
        image: imageUrl
    });

    console.log("Categoria antes de ser guardada", category)

        return await this.categoryRepository.save(category);
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

        async findAll(): Promise<Category[]> {
            return await this.categoryRepository.find();
        }

        async findOne(id: string): Promise<Category> {
            const category = await this.categoryRepository.findOne({ where: { id } });
            if (!category) {
                throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
            }
            return category;
        }

        async findOneActiv(id: string): Promise<Category> {
            const category = await this.categoryRepository.findOne({ where: { id } });
            if (!category.state) {
                throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
            }
            return category;
        }


}