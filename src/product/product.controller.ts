import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";

import { RolesGuard } from "src/guard/roles.guard";
import { ResponseProductDto } from "./dto/response-product.dto";
import { Roles } from "src/decorators/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dto/create-product.dto";
import { AuthGuard } from "src/guard/auth.guard";

@ApiTags("Products")
@Controller("products")
export class ProductsController {
    constructor(
        private readonly productsService: ProductService,
    ) { }


    @Post()
    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: ResponseProductDto })
    @ApiResponse({ status: 400, description: 'El producto ya existe.' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos para actualizar el producto, incluyendo la opción de subir una imagen',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'number' },
                categoryId: { type: 'string' },
                imgUrl: { type: 'string', format: 'binary' },

            },
        },
    })
    @UseInterceptors(FileInterceptor('imgUrl', { limits: { fileSize: 10 * 1024 * 1024 } }))
    async create(@Body() createProductDto: CreateProductDto, @UploadedFile() file?: Express.Multer.File): Promise<ResponseProductDto> {

        // Llamar al servicio para crear el product
        const newProduct = await this.productsService.createProduct(createProductDto, file);

        return newProduct;
    }



}