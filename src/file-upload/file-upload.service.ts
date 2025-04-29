import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileUploadDto } from './dto/file-upload.dto';
import { CloudinaryService } from './cloudinary.service';
import { ProductService } from 'src/product/product.service';
import { CategoryService } from 'src/categories/category.service';



@Injectable()
export class FileUploadService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService
    ){}

    // async uploadFile(
    //     file: Express.Multer.File, 
    //     entityType: 'product' | 'category',
    //     entityId?: string
    // ): Promise<{ imgUrl: string }>{
    
    //     if (!file || !file.buffer || !file.originalname) {
    //         throw new Error('El archivo proporcionado no es válido');
    //     }

    //     if (!['product', 'category'].includes(entityType)) {
    //         throw new Error('El tipo de entidad proporcionado no es válido');
    //     }

    //     // Determinamos la carpeta según el tipo de entidad
    //     const folder = this.getFolderForEntityType(entityType);
    //     console.log(`Folder generado para ${entityType}: ${folder}`);


    //     const url = await this.cloudinaryService.uploadFile(
    //         file.buffer,
    //         folder,
    //         file.originalname
    //     );
    //     console.log(`Archivo subido a ${url}`);

    //     // Actualizar la URL de la imagen en la entidad correspondiente usando los servicios
    //     switch (entityType) {
    //         case 'product':
    //             // Primero obtenemos el producto actual para no sobrescribir las demás propiedades
    //             const product = await this.productService.findOne(entityId);  
    //         console.log("Producto guardado", product)

    //         if (!product) {
    //             throw new Error('Producto no encontrado');
    //         }
            
    //         if (!product.categoryId) {
    //             throw new Error('La categoría no existe');
    //         }
            
    //     // Actualizamos solo la propiedad imagen, manteniendo las demás propiedades intactas
    //     await this.productService.update(entityId, {
    //         ...clase,   // Propiedades existentes
    //         imagen: url, // Actualizamos solo la imagen
    //         categoriaId: clase.categoria ? clase.categoria.id : null,
    //         perfilProfesorId: perfilProfesorId
    //     });
    //         break;

    //     case 'usuario':
    //         // Valida si `entityId` está presente
    //             if (!entityId) {
    //                 throw new Error('No se proporcionó un ID de usuario para actualizar.');
    //             }

    //         // Llamar a `actualizarUsuarios` pasando la URL en el DTO
    //         await this.usuariosService.actualizarUsuarios(entityId, { imagen: url });
    //         break;

    //         case 'perfilProfesor':

    //     // Buscar el perfil del profesor en la base de datos
    //     const perfilProfesor = await this.perfilesProfesoresService.obtenerPerfilProfesorPorId(entityId);
    //     if (!perfilProfesor) {
    //         throw new Error('Perfil del profesor no encontrado');
    //     }

    //     // Actualizar solo la imagen del perfil
    //     await this.perfilesProfesoresService.modificarPerfilProfesor(entityId, {
    //         ...perfilProfesor, // Propiedades existentes
    //         imagen: url,       // Actualizamos solo el campo imagen
    //     });

    //     break;

    //     case 'categoria':
    //         // Valida si `entityId` está presente
    //             if (!entityId) {
    //                 throw new Error('No se proporcionó un ID de categoria para actualizar.');
    //             }

    //         // Llamar a `actualizarUsuarios` pasando la URL en el DTO
    //         await this.categoriesService.update(entityId, { imagen: url });
    //         break;

    //     default:
    //         throw new Error('Tipo de entidad no compatible');
    //     }
    //     //await this.productsRepository.updateProduct(productId, {imgUrl: url});
    //     return {imgUrl: url}
    // }

    // // Función para eliminar un archivo
    // async deleteFile(publicId: string): Promise<void> {
    //     try {
    //         await this.cloudinaryService.deleteFile(publicId);  // Utilizando el servicio de Cloudinary
    //     } catch (error) {
    //         console.error('Error al eliminar el archivo de Cloudinary:', error);
    //         throw new InternalServerErrorException('Error al eliminar el archivo de Cloudinary');
    //     }
    // }

    // private getFolderForEntityType(entityType: string): string {
    //     switch (entityType) {
    //         case 'clase':
    //             return 'clase';
    //         case 'usuario':
    //             return 'usuario';
    //         case 'perfilProfesor':
    //             return 'profesor';
    //         default:
    //             throw new Error('Tipo de entidad no compatible');
    //     }
    // }
}
