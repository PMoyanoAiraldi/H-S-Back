import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { QueryFailedError, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ResponseCategoryDto } from "./dto/response-category.dto";

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
            imageUrl = await this.cloudinaryService.uploadFile(file.buffer, 'category', file.originalname);
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

        async update(id: string, updateCategoryDto: UpdateCategoryDto, file?: Express.Multer.File): Promise<Category> {
        
            const category = await this.categoryRepository.findOne({ where: { id } });
            if (!category) {
            throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
            } 
    
            // Si no se proporciona ningún dato válido, lanzar un error
            if (!updateCategoryDto.name && !file) {
                throw new BadRequestException('No se proporcionaron datos para actualizar la categoría.');
            }
            
            // Verificar si el nombre ya existe en otra categoría
            if (updateCategoryDto.name) {
                const normalizedName = updateCategoryDto.name.trim().toLowerCase();// Normaliza a minúsculas
                // Buscar si ya existe otra categoría con el mismo nombre (ignorando mayúsculas)
                const existingCategory = await this.categoryRepository.findOne({
                    where: { name: normalizedName},
                });
                if (existingCategory && existingCategory.id !== id) {
                    throw new BadRequestException(`El nombre de la categoría "${updateCategoryDto.name}" ya existe`);
                }
    
                // Verificar si el nombre propuesto es igual al actual al normalizarlo
                if (category.name.toLowerCase() === normalizedName) {
                    throw new BadRequestException(`El nombre de la categoría "${updateCategoryDto.name}" ya existe`);
                }
    
                // Asignar el nombre normalizado
                category.name = UpdateCategoryDto.name.trim();
            }
            
    
                if (file) {
                        // Eliminar la imagen anterior si existe
                        console.log('Archivo recibido en el servicio:', file);
                        if (category.image) {
                            try {
                            await this.cloudinaryService.deleteFile(category.image);
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
                        category.image = newImageUrl; // Asignar la nueva URL de la imagen
                    } catch (error) {
                        console.error('Error al subir la nueva imagen:', error);
                        throw new InternalServerErrorException('Error al subir la nueva imagen');
                    }
                }
    
            try {
                return await this.categoryRepository.save(category);
            } catch (error) {
                if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                    throw new HttpException(
                        'Ya existe una categoría con ese nombre.',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                throw error;
        }
    }
    

    async findProductByCategory(categoryId: string): Promise <any> {
        const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
        relations: ['products'],
        });

        if (!category.state) {
        throw new HttpException("Categoria no encontrada", HttpStatus.NOT_FOUND);
        }

        // Filtra los productos activos
        const productActives = category.products.filter(product => product.state); 

        // Devuelve la información de la categoría activa con sus productos activos
        return {
        id: category.id,
        name: category.name, 
        products: productActives,
    };

    }

}