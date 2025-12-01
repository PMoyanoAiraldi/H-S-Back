import { Body, Controller, Post, Get, UseGuards, Param, Put } from "@nestjs/common";
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
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
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
    @ApiOperation({ summary: 'Listar todas las marcas' })
    @ApiResponse({ status: 200, description: 'Lista de marcas', type: [Marca] })
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin')
    @ApiSecurity('bearer')
    async findAll(): Promise<Marca[]> {
        return this.marcaService.findAll();
    }
    
    // @Get('actives')
    // @ApiOperation({ summary: 'Listar todas las categorías activas' })
    // @ApiResponse({ status: 200, description: 'Lista de categorías activas', type: [Category] })
    // async findAllActivas(): Promise<Category[]> {
    //     return this.categoryService.obtenerCategoriasActivas();
    // }
    
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
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
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

}