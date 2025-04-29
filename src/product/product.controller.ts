import { Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";

import { RolesGuard } from "src/guard/roles.guard";
import { ResponseProductDto } from "./dto/response-product.dto";
import { Roles } from "src/decorators/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./dto/create-product.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { Products } from "./product.entity";
import { UpdateStateDto } from "./dto/update-state.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

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

    @Get()
    @ApiOperation({ summary: 'Obtener todos los productos' })
    @ApiResponse({ status: 200, description: 'Productos obtenidos', type: [Products] })
    @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados por página', example: 5 })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async getClases(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.productsService.get(page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto obtenida', type: Products })
    @ApiResponse({ status: 404, description: 'Producto no encontrada' })
    async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        const product = await this.productsService.findOne(id);
        if (!product) {
            throw new NotFoundException("Producto no encontrado");
        }
        return product;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Modificar el estado de un producto' })
    @ApiResponse({ status: 201, description: 'Estado del producto modificado exitosamente', type: [Products] })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 500, description: 'Error inesperado al modificar el estado del producto' })
    @ApiBody({ description: 'Cuerpo para modificar el estado de un producto', type: UpdateStateDto })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async updateStateProduct(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateStateDto: UpdateStateDto
    ): Promise<Products> {
        return this.productsService.updateState(id, updateStateDto.state);
    }


    @Put(':id')
    @UseInterceptors(FileInterceptor('imgUrl'), ) // FileInterceptor maneja la subida del archivo
    @ApiOperation({ summary: 'Actualizar un producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto actualizado', type: UpdateProductDto })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' }) 
    @HttpCode(HttpStatus.OK)
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
    async updateProduct(
        @Param('id') id: string,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true })) updateProductDto: UpdateProductDto, 
        @UploadedFile() img?: Express.Multer.File
    ): Promise<ResponseProductDto> {
        try {
            const updateProduct = await this.productsService.update(id, updateProductDto, img);
            if (!updateProduct) {
                throw new NotFoundException('Producto no encontrado');
            }
            return updateProduct;  
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw new InternalServerErrorException('Error inesperado al actualizar el producto');
        }
    }

}