import { QueryFailedError, Repository } from "typeorm";
import { Products } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ResponseProductDto } from "./dto/response-product.dto";
import { CategoryService } from "src/categories/category.service";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ResponseCategoryDto } from "src/categories/dto/response-category.dto";


@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly categoryService: CategoryService,
        private readonly cloudinaryService: CloudinaryService
                
    ) { }

    async createProduct(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<ResponseProductDto> {
        try {
            console.log('Datos del DTO recibidos:', createProductDto);
            
            const normalizedName = createProductDto.name.trim().toLowerCase();
    
            const productExist = await this.productsRepository
                .createQueryBuilder('product')
                .where('LOWER(product.name) = :name', { name: normalizedName })
                .getOne();
    
            if (productExist) {
                throw new HttpException(
                    `El producto con el nombre "${createProductDto.name}" ya existe.`,
                    HttpStatus.BAD_REQUEST,
                );
            }
    
            const category = await this.categoryService.findOne(createProductDto.categoryId);
            if (!category) {
                throw new NotFoundException(`Categoría con ID ${createProductDto.categoryId} no encontrada`);
            }
            console.log('Categoría encontrada:', category);
    
            // Subir la imagen si existe un archivo
            let imageUrl: string | undefined;
            if (file) {
                try {
                    // Espera la carga de la imagen
                    imageUrl = await this.cloudinaryService.uploadFile(file.buffer, 'product', file.originalname);
                    console.log('Archivo subido a Cloudinary:', imageUrl);
                } catch (error) {
                    console.error('Error al subir la imagen a Cloudinary:', error);
                    throw new InternalServerErrorException('Error al subir la imagen');
                }
            }
    
            // Crear el producto directamente con la URL de la imagen si existe
            const newProduct = this.productsRepository.create({
                ...createProductDto,
                category,
                imgUrl: imageUrl,
            });
    
            // Guardar la clase y esperar su confirmación
            const savedProduct = await this.productsRepository.save(newProduct);
    
            return savedProduct;
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new HttpException(
                    'Ya existe un producto con ese nombre.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw error;
        }
    }

    async get(page: number, limit: number) {
        return await this.productsRepository.find({
            take: limit,
            skip: (page - 1) * limit,
        });
    }

    async findOne(productId: string): Promise<ResponseProductDto> {
        const product = await this.productsRepository.findOne({
            where: { id: productId },
            relations: ['category'],
        });

        console.log('Resultado de la consulta:', product);

        if (!product) {
            throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
        }

        return product
    }
    

    //Funcion para cambiar de estado activo o no de un producto
    async updateState(id: string, state: boolean): Promise<Products> {
        const product = await this.productsRepository.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        product.state = state;
        await this.productsRepository.save(product);

        return this.productsRepository.findOne({ where: { id } });
    }

    async update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<ResponseProductDto> {
        const product = await this.productsRepository.findOne({
            where: { id }, 
            relations: ['category'], // Cargar la relación de categoría
        });

        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        // Verificar si el nombre ya existe en otro producto
        if (updateProductDto.name && updateProductDto.name.trim()) {
            const normalizedName = updateProductDto.name.trim().toLowerCase();

            const productExist = await this.productsRepository
                .createQueryBuilder('product')
                .where('LOWER(product.name) = :name', { name: normalizedName })
                .getOne();

            if (productExist) {
                throw new HttpException(
                    `Ya existe un producto con el nombre "${updateProductDto.name}".`,
                    HttpStatus.BAD_REQUEST,
                );
            }
        }
        // Normalización del nombre antes de guardar
        if (updateProductDto.name) {
            product.name = updateProductDto.name.trim().toLowerCase();
        }

        // Eliminar la imagen anterior si se proporciona un archivo nuevo
        if (file && product.imgUrl) {
            try {
                await this.cloudinaryService.deleteFile(product.imgUrl);
            } catch (error) {
                console.error('Error al eliminar la imagen anterior:', error);
                throw new InternalServerErrorException('Error al eliminar la imagen anterior');
            }
        }

        // Subir nueva imagen si se proporciona un archivo
        if (file) {
            const newImgUrl = await this.cloudinaryService.uploadFile(file.buffer, file.originalname);
            product.imgUrl = newImgUrl; // Reemplazar la URL de la imagen actual
        }

        // Asignar las propiedades de updateProductDto al producto (sin necesidad de comprobar cada campo manualmente)
        Object.assign(product, updateProductDto);


        if (updateProductDto.categoryId) {
            const category = await this.categoryService.findOne(
                updateProductDto.categoryId,
            );
            if (!category) {
                throw new NotFoundException(`Categoría con ID ${updateProductDto.categoryId} no encontrada`);
            }
            product.category = category;
        }

        try {
            // Guardar el producto con las actualizaciones realizadas
            const updateProduct = await this.productsRepository.save({
                ...product, // Todos los datos existentes
            });

            // Crear el DTO de respuesta para la categoría
            const categoryDto = new ResponseCategoryDto(updateProduct.category.id, updateProduct.category.name);

            return new ResponseProductDto();
        } catch (error) {
            if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
                throw new HttpException(
                    'Ya existe una clase con ese nombre.',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw error;
        }
    }


}