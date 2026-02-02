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
import { Precio } from "src/precio/precio.entity";

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
        description: 'Datos para crear un nuevo producto, incluyendo la opción de subir una imagen',
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                descripcion: { type: 'string' },
                codigo: {type: 'number'},
                codigoAlternativo1: {type: 'string'},
                codigoAlternativo2: {type: 'string'},
                marcaId: {type: 'string'},
                lineaId: {type: 'string'},
                rubroId: {type: 'string'},
                precio: { type: 'number', example: 1000.50 },
                listaPrecio: { type: 'number', example: 1 }, 
                file: { type: 'string', format: 'binary' },

            },
        },
    })
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
    async create(@Body() createProductDto: CreateProductDto, @UploadedFile() file?: Express.Multer.File): Promise<ResponseProductDto> {

        // Llamar al servicio para crear el product
        const newProduct = await this.productsService.createProduct(createProductDto, file);

        return newProduct;
    }

    @Get('public')
    @ApiOperation({ summary: 'Obtener productos sin precios (público)' })
    @ApiResponse({ status: 200, description: 'Productos obtenidos sin información de precios' })
    @ApiQuery({ name: 'linea', required: false })
    @ApiQuery({ name: 'rubro', required: false })
    @ApiQuery({ name: 'marca', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 50 })
    async findAllPublic(
        @Query('linea') linea?: string,
        @Query('rubro') rubro?: string,
        @Query('marca') marca?: string,
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 50
    ) {
        return this.productsService.findAllFilteredPublic({
            linea,
            rubro,
            marca,
            search,
            page,
            limit
        });
    }

    @Get('/clients')
    @ApiOperation({ summary: 'Obtener todos los productos' })
    @ApiResponse({ status: 200, description: 'Productos obtenidos', type: [Products] })
    @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados por página', example: 5 })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'cliente')
    @ApiSecurity('bearer')
    async getProductsClents(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return this.productsService.getProductsClients(page, limit);
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
    @UseInterceptors(FileInterceptor('file'), ) // FileInterceptor maneja la subida del archivo
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
                nombre: { type: 'string' },
                descripcion: { type: 'string' },
                codigo: { type: 'number'},
                codigoAlternativo1: { type: 'string' },
                codigoAlternativo2: { type: 'string' },
                state: { type: 'boolean' },
                marcaId: { type: 'string' },
                lineaId: { type: 'string' },
                rubroId: { type: 'string' },
                file: { type: 'string', format: 'binary' }
            },
        },
    })
    async updateProduct(
        @Param('id') id: string,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true })) updateProductDto: UpdateProductDto, 
        @UploadedFile() file?: Express.Multer.File
    ): Promise<ResponseProductDto> {
        try {
            const updateProduct = await this.productsService.update(id, updateProductDto, file);
            if (!updateProduct) {
                throw new NotFoundException('Producto no encontrado');
            }
            return updateProduct;  
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw new InternalServerErrorException('Error inesperado al actualizar el producto');
        }
    }


    @Get('admin/all')
    @ApiOperation({ summary: 'Obtener TODOS los productos (activos e inactivos) - Solo Admin' })
    @ApiResponse({ status: 200, description: 'Todos los productos obtenidos' })
    @ApiQuery({ name: 'linea', required: false })
    @ApiQuery({ name: 'rubro', required: false })
    @ApiQuery({ name: 'marca', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 1000 })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin') 
    @ApiSecurity('bearer')
    async findAllForAdmin(
        @Query('linea') linea?: string,
        @Query('rubro') rubro?: string,
        @Query('marca') marca?: string,
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 1000
    ) {
        return this.productsService.findAllForAdmin({
            linea,
            rubro,
            marca,
            search,
            page,
            limit
        });
    }


    @Get('public/:id')
    @ApiOperation({ summary: 'Obtener producto por ID sin precios (público)' })
    @ApiResponse({ status: 200, description: 'Producto obtenido sin precios' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async findOnePublic(@Param('id', new ParseUUIDPipe()) id: string) {
        const product = await this.productsService.findOnePublic(id);
        if (!product) {
            throw new NotFoundException("Producto no encontrado");
        }
        return product;
    }

    @Get()
    @ApiOperation({ summary: 'Obtener productos con precios (requiere autenticación)' })
    @ApiResponse({ status: 200, description: 'Productos obtenidos con precios' })
    @ApiQuery({ name: 'linea', required: false })
    @ApiQuery({ name: 'rubro', required: false })
    @ApiQuery({ name: 'marca', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 50 })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'cliente')
    @ApiSecurity('bearer')
    async findAllWithPrices(
        @Query('linea') linea?: string,
        @Query('rubro') rubro?: string,
        @Query('marca') marca?: string,
        @Query('search') search?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 50
    ) {
        return this.productsService.findAllFilteredWithPrices({
            linea,
            rubro,
            marca,
            search,
            page,
            limit
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener producto por ID con precios (requiere autenticación)' })
    @ApiResponse({ status: 200, description: 'Producto obtenido con precios' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin', 'cliente')
    @ApiSecurity('bearer')
    async findOneWithPrices(@Param('id', new ParseUUIDPipe()) id: string) {
        const product = await this.productsService.findOneWithPrices(id);
        if (!product) {
            throw new NotFoundException("Producto no encontrado");
        }
        return product;
    }

}