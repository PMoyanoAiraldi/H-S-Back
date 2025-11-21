import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileUploadDto } from './dto/file-upload.dto';
import { CloudinaryService } from './cloudinary.service';
import { ProductService } from 'src/product/product.service';
import { CategoryService } from 'src/linea/linea.service';



@Injectable()
export class FileUploadService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService
    ){}

    async uploadFile(
        file: Express.Multer.File, 
        entityType: 'product' | 'category',
        entityId?: string
    ): Promise<{ imgUrl: string }>{
    
        if (!file || !file.buffer || !file.originalname) {
            throw new Error('El archivo proporcionado no es válido');
        }

        if (!['product', 'category'].includes(entityType)) {
            throw new Error('El tipo de entidad proporcionado no es válido');
        }

        // Determinamos la carpeta según el tipo de entidad
        const folder = this.getFolderForEntityType(entityType);
        console.log(`Folder generado para ${entityType}: ${folder}`);


        const url = await this.cloudinaryService.uploadFile(
            file.buffer,
            folder,
            file.originalname
        );
        console.log(`Archivo subido a ${url}`);

        // Actualizar la URL de la imagen en la entidad correspondiente usando los servicios
        switch (entityType) {
            case 'product':
                // Primero obtenemos el producto actual para no sobrescribir las demás propiedades
                const product = await this.productService.findOne(entityId);  
            console.log("Producto guardado", product)

            if (!product) {
                throw new Error('Producto no encontrado');
            }
            
            if (!product.categoryId) {
                throw new Error('La categoría no existe');
            }
            
        // Actualizamos solo la propiedad imagen, manteniendo las demás propiedades intactas
        await this.productService.update(entityId, {
            ...product,   // Propiedades existentes
            imgUrl: url, // Actualizamos solo la imagen
            categoryId: product.categoryId,
        });
            break;

        case 'category':
            // Valida si `entityId` está presente
                if (!entityId) {
                    throw new Error('No se proporcionó un ID de categoria para actualizar.');
                }

            // Llamar a `actualizarUsuarios` pasando la URL en el DTO
            await this.categoryService.update(entityId, { image: url });
            break;

        default:
            throw new Error('Tipo de entidad no compatible');
        }
        //await this.productsRepository.updateProduct(productId, {imgUrl: url});
        return {imgUrl: url}
    }

    // Función para eliminar un archivo
    async deleteFile(publicId: string): Promise<void> {
        try {
            await this.cloudinaryService.deleteFile(publicId);  // Utilizando el servicio de Cloudinary
        } catch (error) {
            console.error('Error al eliminar el archivo de Cloudinary:', error);
            throw new InternalServerErrorException('Error al eliminar el archivo de Cloudinary');
        }
    }

    private getFolderForEntityType(entityType: string): string {
        switch (entityType) {
            case 'product':
                return 'product';
            case 'category':
                return 'category';
            default:
                throw new Error('Tipo de entidad no compatible');
        }
    }
}
