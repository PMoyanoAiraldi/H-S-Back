import { QueryFailedError, Repository } from "typeorm";
import { Products } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ResponseProductDto } from "./dto/response-product.dto";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { LineaService } from "src/linea/linea.service";
import { Precio } from "src/precio/precio.entity";



@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        @InjectRepository(Precio)  
        private readonly precioRepository: Repository<Precio>,
        private readonly lineaService: LineaService,
        private readonly cloudinaryService: CloudinaryService
                
    ) { }

    async createProduct(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<ResponseProductDto> {
        try {
            console.log('Datos del DTO recibidos:', createProductDto);
            
            const normalizedName = createProductDto.nombre.trim().toLowerCase();
    
            const productExist = await this.productsRepository
                .createQueryBuilder('product')
                .where('LOWER(product.nombre) = :nombre', { nombre: normalizedName })
                .getOne();
    
            if (productExist) {
                throw new HttpException(
                    `El producto con el nombre "${createProductDto.nombre}" ya existe.`,
                    HttpStatus.BAD_REQUEST,
                );
            }
    
            const linea = await this.lineaService.findOne(createProductDto.lineaId);
            if (!linea) {
                throw new NotFoundException(`Linea con ID ${createProductDto.lineaId} no encontrada`);
            }
            console.log('Linea encontrada:', linea);
    
            //Validamos y obtenemos el precio si se proporciona
            let precio = null;
                    if (createProductDto.precioId) {
                        precio = await this.precioRepository.findOne({ 
                            where: { id: createProductDto.precioId } 
                        });
                        if (!precio) {
                            throw new NotFoundException(`Precio con ID ${createProductDto.precioId} no encontrado`);
                        }
                        console.log('Precio encontrado:', precio);
            }


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
                nombre: createProductDto.nombre,
                descripcion: createProductDto.descripcion,
                codigo: createProductDto.codigo,
                codigoAlternativo1: createProductDto.codigoAlternativo1,
                codigoAlternativo2: createProductDto.codigoAlternativo2,
                marca: { id: createProductDto.marcaId }, 
                linea: createProductDto.lineaId ? { id: createProductDto.lineaId } : undefined, 
                rubro: { id: createProductDto.rubroId }, 
                //subRubro: createProductDto.subrubroId ? { id: createProductDto.subrubroId } : undefined, 
                imgUrl: imageUrl || createProductDto.imgUrl || 'default-image-url.jpg',
                precios: precio ? [precio] : [] // Asociar el precio si existe
            });
    
            // Guardar la clase y esperar su confirmación
            const savedProduct = await this.productsRepository.save(newProduct);
    

            // Cargar las relaciones para el response
        const productWithRelations = await this.productsRepository.findOne({
            where: { id: savedProduct.id },
            relations: ['marca', 'linea', 'rubro', 'subRubro', 'precios']
        });

            return ResponseProductDto.fromEntity(productWithRelations);
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

    async getProductsClients(page: number, limit: number): Promise<Products[]> {
        return await this.productsRepository.find({
            take: limit,
            skip: (page - 1) * limit,
            relations: ['linea']
        });
    }


    async getProducts(page: number, limit: number): Promise<ResponseProductDto[]> {
    const products = await this.productsRepository.find({
        take: limit,
        skip: (page - 1) * limit,
        relations: ['linea', 'marca', 'rubro']
    });

    return products.map(product => ResponseProductDto.fromEntity(product));
}


    async findOne(productId: string): Promise<ResponseProductDto> {
        const product = await this.productsRepository.findOne({
            where: { id: productId },
            relations: ['linea', 'marca', 'rubro'],
        });

        console.log('Resultado de la consulta:', product);

        if (!product) {
            throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
        }

        return ResponseProductDto.fromEntity(product);
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
            relations: ['marca', 'linea', 'rubro', 'subRubro', 'precios'], 
        });

        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        // Verificar si el nombre ya existe en otro producto
        if (updateProductDto.nombre?.trim()) {
            const normalizedName = updateProductDto.nombre.trim().toLowerCase();

            const productExist = await this.productsRepository
                .createQueryBuilder('product')
                .where('LOWER(product.nombre) = :nombre', { nombre: normalizedName })
                .andWhere('product.id != :id', { id }) // IMPORTANTE: Excluir el producto actual
                .getOne();

            if (productExist) {
                throw new HttpException(
                    `Ya existe un producto con el nombre "${updateProductDto.nombre}".`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            product.nombre = normalizedName
        }

         // Actualizar otros campos
        if (updateProductDto.descripcion !== undefined) product.descripcion = updateProductDto.descripcion;
        if (updateProductDto.codigo !== undefined) product.codigo = updateProductDto.codigo;
        if (updateProductDto.codigoAlternativo1 !== undefined) product.codigoAlternativo1 = updateProductDto.codigoAlternativo1;
        if (updateProductDto.codigoAlternativo2 !== undefined) product.codigoAlternativo2 = updateProductDto.codigoAlternativo2;        
        if (updateProductDto.state !== undefined) product.state = updateProductDto.state;

        
        if (file) {
            
            if (product.imgUrl && product.imgUrl !== 'default-image-url.jpg') {// Eliminar la imagen anterior si se proporciona un archivo nuevo
            try {
                await this.cloudinaryService.deleteFile(product.imgUrl);
            } catch (error) {
                console.error('Error al eliminar la imagen anterior:', error);
            }
        }

        // Subir nueva imagen
        try {
            product.imgUrl = await this.cloudinaryService.uploadFile(
                file.buffer,
                'product',
                file.originalname
            );
        } catch (error) {
            console.error('Error al subir la nueva imagen:', error);
            throw new InternalServerErrorException('Error al subir la imagen');
        }
    }

        // // Subir nueva imagen si se proporciona un archivo
        // if (file) {
        //     const newImgUrl = await this.cloudinaryService.uploadFile(file.buffer, 'product', file.originalname);
        //     product.imgUrl = newImgUrl; // Reemplazar la URL de la imagen actual
        // }


        // Actualizar relaciones - OPTIMIZADO
    await this.updateRelations(product, updateProductDto);

    try {
        // Guardar el producto actualizado
        const updatedProduct = await this.productsRepository.save(product);

        // Cargar todas las relaciones para el response
        const productWithRelations = await this.productsRepository.findOne({
            where: { id: updatedProduct.id },
            relations: ['marca', 'linea', 'rubro', 'precios']
        });

        return ResponseProductDto.fromEntity(productWithRelations);
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

// Método privado para actualizar relaciones - EVITA CÓDIGO REPETITIVO
private async updateRelations(product: Products, updateDto: UpdateProductDto): Promise<void> {
        if (updateDto.lineaId) {
            const linea = await this.lineaService.findOne(
                updateDto.lineaId,
            );
            if (!linea) {
                throw new NotFoundException(`Linea con ID ${updateDto.lineaId} no encontrada`);
            }
            product.linea = linea;
        }

        // if (updateDto.marcaId) {
        //     const marca = await this.marcaService.findOne(
        //         updateDto.marcaId,
        //     );
        //     if (!marca) {
        //         throw new NotFoundException(`Categoría con ID ${updateDto.marcaId} no encontrada`);
        //     }
        //     product.marca = marca;
        // }

    //     if (updateDto.rubroId) {
    //     const rubro = await this.rubroService.findOne(updateDto.rubroId);
    //     if (!rubro) {
    //         throw new NotFoundException(`Rubro con ID ${updateDto.rubroId} no encontrado`);
    //     }
    //     product.rubro = rubro;
    // }

    // // Actualizar SubRubro
    // if (updateDto.subrubroId) {
    //     const subRubro = await this.subrubroService.findOne(updateDto.subrubroId);
    //     if (!subRubro) {
    //         throw new NotFoundException(`SubRubro con ID ${updateDto.subrubroId} no encontrado`);
    //     }
    //     product.subRubro = subRubro;
    // }

    // // Actualizar Precio
    // if (updateDto.precioId) {
    //     const precio = await this.precioRepository.findOne({
    //         where: { id: updateDto.precioId }
    //     });
    //     if (!precio) {
    //         throw new NotFoundException(`Precio con ID ${updateDto.precioId} no encontrado`);
    //     }
    //     // Si el precio ya está asociado, no hacer nada
    //     // Si no, agregarlo al array
    //     const precioExiste = product.precios?.some(p => p.id === precio.id);
    //     if (!precioExiste) {
    //         product.precios = product.precios ? [...product.precios, precio] : [precio];
    //     }
    // }
}

async findAllFiltered(filters: {
    linea?: string;
    rubro?: string;
    marca?: string;
    search?: string;
    page: number;
    limit: number;
}) {
    const query = this.productsRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.linea', 'linea')
        .leftJoinAndSelect('product.rubro', 'rubro')
        .leftJoinAndSelect('product.marca', 'marca')
        .where('product.state = :state', { state: true })
        .select([
            'product.id',
            'product.nombre',
            'product.descripcion',
            'product.codigo',
            'product.codigoAlternativo1',
            'product.codigoAlternativo2',
            'product.imgUrl',
            'product.state',
            'linea.id',
            'linea.nombre',
            'rubro.id',
            'rubro.nombre',
            'marca.id',
            'marca.nombre'
        ]);

    // Filtrar por línea
    if (filters.linea) {
        query.andWhere('linea.nombre = :linea', { linea: filters.linea });
    }

    // Filtrar por rubro
    if (filters.rubro) {
        query.andWhere('rubro.nombre = :rubro', { rubro: filters.rubro });
    }

    // Filtrar por marca
    if (filters.marca) {
        query.andWhere('marca.nombre = :marca', { marca: filters.marca });
    }

    // Búsqueda por texto
    if (filters.search) {
        query.andWhere(
            '(product.nombre ILIKE :search OR product.descripcion ILIKE :search OR CAST(product.codigo AS TEXT) LIKE :search)',
            { search: `%${filters.search}%` }
        );
    }

    // Paginación
    const skip = (filters.page - 1) * filters.limit;
    query.skip(skip).take(filters.limit);

    const [products, total] = await query.getManyAndCount();

    return {
        data: products,
        total,
        page: filters.page,
        lastPage: Math.ceil(total / filters.limit)
    };
}
}