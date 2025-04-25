import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { FileUploadService } from "src/file-upload/file-upload.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guard/auth.guard";
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guard/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ResponseCategoryDto } from "./dto/response-category.dto";

@ApiTags('Categorias')
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

}
