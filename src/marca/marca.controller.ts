import { Body, Controller, Post, Get, UseGuards, Param, Put, Patch } from "@nestjs/common";
import { MarcaService } from "./marca.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResponseMarcaDto } from "./dto/response-marca.dto";
import { Roles } from "src/decorators/roles.decorator";
import { AuthGuard } from "src/guard/auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { CreateMarcaDto } from "./dto/create-marca.dto";
import { ResponseMarcaSimpleDto } from "./dto/response-marca-simple.dto";
import { Marca } from "./marca.entity";
import { Products } from "src/product/product.entity";
import { UpdateMarcaDto } from "./dto/update-marca.dto";

@ApiTags('Marca')
@Controller("marca")
export class MarcaController {
    constructor(
        private readonly marcaService: MarcaService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear una nueva marca' })
    @ApiResponse({ status: 201, description: 'Marca creada', type: ResponseMarcaSimpleDto })
    @ApiResponse({ status: 400, description: 'La marca ya existe.' })
    @ApiSecurity('bearer')
    @ApiBody({
            description: 'Datos para crear la marca',
            schema: {
                type: 'object',
                properties: {
                    nombre: { type: 'string' },
                    codigo: { type: 'number'}
                }
            }
        })
    async create(@Body() createMarcaDto: CreateMarcaDto): Promise<ResponseMarcaSimpleDto> {
            const nuevaMarca = await this.marcaService.createMarca(createMarcaDto);
            return nuevaMarca;
        }
    
    @Get()
    @ApiOperation({ summary: 'Obtener todas las marcas activas' })
    async findAll() {
        return this.marcaService.findAllActive(); // Solo activas
    }


    @Get('admin/all')
    @ApiOperation({ summary: 'Listar todas las marcas (activas e inactivas)' })
    @ApiResponse({ status: 200, description: 'Lista de marcas', type: [Marca] })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findAllForAdmin(): Promise<Marca[]> {
        return this.marcaService.findAll();
    }
    
    
    @Get(':id/actives')
    @ApiOperation({ summary: 'Obtener una marca activa por ID' })
    @ApiResponse({ status: 200, description: 'Marca encontrada', type: Marca })
    @ApiResponse({ status: 404, description: 'Marca no encontrada' })
    async findOneActiva(@Param('id') id: string): Promise<Marca> {
        return this.marcaService.findOneActiv(id);
    }
    
    @Get(':id')
    @ApiOperation({ summary: 'Obtener una marca por ID' })
    @ApiResponse({ status: 200, description: 'Marca encontrada', type: Marca })
    @ApiResponse({ status: 404, description: 'Marca no encontrada' })
    @ApiSecurity('bearer')
    async findOne(@Param('id') id: string): Promise<Marca> {
            return this.marcaService.findOne(id);
    }
    
    @Get(':marcaId/products')
    @ApiOperation({ summary: 'Obtener productos por marca' })
    @ApiResponse({ status: 200, description: 'Productos obtenidos', type: [Products] })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async findProductsByMarca(@Param('marcaId') marcaId: string) {
        return this.marcaService.findProductByMarca(marcaId);
    }
    
    @Put(':id')
    @ApiOperation({ summary: 'Modificar una marca' })
    @ApiResponse({ status: 201, description: 'Marca modificada', type: UpdateMarcaDto })
    @ApiResponse({ status: 404, description: 'Marca no encontrada' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiBody({
        description: 'Datos para actualizar la marca',
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                codigo: {type: 'number'}
            }
        }
    })
    async update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto): Promise<Marca> {
        return this.marcaService.update(id, updateMarcaDto);
    }

    @Patch(':id/state')
    @ApiOperation({ summary: 'Cambiar estado de marca (activar/desactivar) - Solo Admin' })
    @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async updateState(
        @Param('id') id: string,
        @Body() updateStateDto: { state: boolean }
    ) {
        return this.marcaService.updateState(id, updateStateDto.state);
    }




}