import { Body, Controller, Get, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { LineaService } from "./linea.service";
import { FileUploadService } from "src/file-upload/file-upload.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guard/auth.guard";
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guard/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Products } from "src/product/product.entity";
import { ResponseLineaDto } from "./dto/response-linea.dto";
import { CreateLineaDto } from "./dto/create-linea.dto";
import { ResponseLineaSimpleDto } from "./dto/response-linea-simple.dto";
import { Linea } from "./linea.entity";
import { UpdateLineaDto } from "./dto/update-linea.dto";

@ApiTags('Linea')
@Controller('linea')
export class LineaController {
    constructor(private readonly lineaService: LineaService,
        private readonly fileUploadService: FileUploadService,
        
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear una nueva linea' })
    @ApiResponse({ status: 201, description: 'Linea creada', type: ResponseLineaSimpleDto })
    @ApiResponse({ status: 400, description: 'La linea ya existe.' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Datos para crear la línea, incluyendo la opción de subir una imagen',
        schema: {
            type: 'object',
            properties: {
                image: { type: 'string', format: 'binary'},
                nombre: { type: 'string' },
                codigo: { type: 'number'}
            }
        }
    })
    @UseInterceptors(FileInterceptor('image'))
    async create(@Body() createLineaDto: CreateLineaDto, @UploadedFile() file?: Express.Multer.File): Promise<ResponseLineaSimpleDto> {
        const nuevaLinea = await this.lineaService.create(createLineaDto, file);
        return nuevaLinea;
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas las lineas' })
    @ApiResponse({ status: 200, description: 'Lista de lineas', type: [Linea] })
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin')
    @ApiSecurity('bearer')
    async findAll(): Promise<Linea[]> {
        return this.lineaService.findAll();
    }

    @Get('admin/all')
    @ApiOperation({ summary: 'Obtener TODAS las líneas (activas e inactivas) - Solo Admin' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findAllForAdmin() {
        return this.lineaService.findAll(); // Todas (activas e inactivas)
    }

    @Get(':id/actives')
    @ApiOperation({ summary: 'Obtener una linea activa por ID' })
    @ApiResponse({ status: 200, description: 'Linea encontrada', type: Linea })
    @ApiResponse({ status: 404, description: 'Linea no encontrada' })
    async findOneActiva(@Param('id') id: string): Promise<Linea> {
        return this.lineaService.findOneActiv(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una linea por ID' })
    @ApiResponse({ status: 200, description: 'Linea encontrada', type: Linea })
    @ApiResponse({ status: 404, description: 'Linea no encontrada' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findOne(@Param('id') id: string): Promise<Linea> {
        return this.lineaService.findOne(id);
    }

    @Get(':lineaId/products')
    @ApiOperation({ summary: 'Obtener productos por linea' })
    @ApiResponse({ status: 200, description: 'Productos obtenidos', type: [Products] })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async findProductsByLinea(@Param('lineaId') lineaId: string) {
        return this.lineaService.findProductByLinea(lineaId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Modificar una linea' })
    @ApiResponse({ status: 201, description: 'Linea modificada', type: UpdateLineaDto })
    @ApiResponse({ status: 404, description: 'Linea no encontrada' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiBody({
        description: 'Datos para actualizar la linea',
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                codigo: {type: 'number'}
            }
        }
    })
    async update(
        @Param('id') id: string, 
        @Body() updateLineaDto: UpdateLineaDto,
    ): Promise<Linea> {
        
        return this.lineaService.update(id, updateLineaDto);
    }

    @Patch(':id/state')
    @ApiOperation({ summary: 'Cambiar estado de línea (activar/desactivar) - Solo Admin' })
    @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async updateState(
        @Param('id') id: string,
        @Body() updateStateDto: { state: boolean }
    ) {
        return this.lineaService.updateState(id, updateStateDto.state);
    }



}
