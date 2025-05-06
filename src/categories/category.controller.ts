import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { FileUploadService } from "src/file-upload/file-upload.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guard/auth.guard";
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guard/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ResponseCategoryDto } from "./dto/response-category.dto";
import { Category } from "./category.entity";
import { Products } from "src/product/product.entity";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService,
        private readonly fileUploadService: FileUploadService,
        
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiResponse({ status: 201, description: 'Categoría creada', type: ResponseCategoryDto })
    @ApiResponse({ status: 400, description: 'La categoría ya existe.' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos para crear la categoria, incluyendo la opción de subir una imagen',
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary'},
                name: { type: 'string' },
            }
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file?: Express.Multer.File): Promise<ResponseCategoryDto> {
        const newCategory = await this.categoryService.create(createCategoryDto, file);
        return newCategory;
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas las categorías' })
    @ApiResponse({ status: 200, description: 'Lista de categorías', type: [Category] })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findAll(): Promise<Category[]> {
        return this.categoryService.findAll();
    }

    // @Get('actives')
    // @ApiOperation({ summary: 'Listar todas las categorías activas' })
    // @ApiResponse({ status: 200, description: 'Lista de categorías activas', type: [Category] })
    // async findAllActivas(): Promise<Category[]> {
    //     return this.categoryService.obtenerCategoriasActivas();
    // }

    @Get(':id/actives')
    @ApiOperation({ summary: 'Obtener una categoría activa por ID' })
    @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
    async findOneActiva(@Param('id') id: string): Promise<Category> {
        return this.categoryService.findOneActiv(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una categoría por ID' })
    @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findOne(@Param('id') id: string): Promise<Category> {
        return this.categoryService.findOne(id);
    }

    @Get(':categoryId/products')
    @ApiOperation({ summary: 'Obtener productos por categoría' })
    @ApiResponse({ status: 200, description: 'Productos obtenidos', type: [Products] })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async findProductsByCategory(@Param('categoryId') categoryId: string) {
        return this.categoryService.findProductByCategory(categoryId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Modificar una categoría' })
    @ApiResponse({ status: 201, description: 'Categoría modificada', type: UpdateCategoryDto })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos para actualizar la categoria, incluyendo la opción de subir una imagen',
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary'},
                name: { type: 'string' },
            }
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string, 
        @Body() updateCategoryDto: UpdateCategoryDto,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<Category> {
        
        return this.categoryService.update(id, updateCategoryDto, file);
    }



}
