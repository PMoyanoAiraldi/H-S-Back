import { Body, Controller,Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RubroService } from "./rubro.service";
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResponseRubroSimpleDto } from "./dto/response-rubro-simple.dto";
import { AuthGuard } from "src/guard/auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { CreateRubroDto } from "./dto/create-rubro.dto";
import { Rubro } from "./rubro.entity";
import { Products } from "src/product/product.entity";
import { UpdateRubroDto } from "./dto/update-rubro.dto";



@ApiTags('Rubro')
@Controller("rubro")
export class RubroController {
    constructor(
        private readonly rubroService: RubroService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo rubro' })
    @ApiResponse({ status: 201, description: 'Rubro creado', type: ResponseRubroSimpleDto })
    @ApiResponse({ status: 400, description: 'El rubro ya existe.' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiBody({
        description: 'Datos para crear el rubro',
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                codigo: { type: 'number'}
                }
            }
        })
    async createRubro(@Body() createRubroDto: CreateRubroDto): Promise<ResponseRubroSimpleDto> {
        const nuevoRubro = await this.rubroService.createRubro(createRubroDto);
            return nuevoRubro;
    }
        
    @Get()
    @ApiOperation({ summary: 'Listar todos los rubros' })
    @ApiResponse({ status: 200, description: 'Lista de rubros', type: [Rubro] })
    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('admin')
    @ApiSecurity('bearer')
    async findAll(): Promise<Rubro[]> {
        return this.rubroService.findAllRubro();
    }
        
        // @Get('actives')
        // @ApiOperation({ summary: 'Listar todas las categorías activas' })
        // @ApiResponse({ status: 200, description: 'Lista de categorías activas', type: [Category] })
        // async findAllActivas(): Promise<Category[]> {
        //     return this.categoryService.obtenerCategoriasActivas();
        // }
        
    @Get(':id/actives')
    @ApiOperation({ summary: 'Obtener un rubro activo por ID' })
    @ApiResponse({ status: 200, description: 'Rubro encontrado', type: Rubro })
    @ApiResponse({ status: 404, description: 'Rubro no encontrado' })
    async findOneActive(@Param('id') id: string): Promise<Rubro> {
        return this.rubroService.findOneActiveRubro(id);
    }
        
    @Get(':id')
    @ApiOperation({ summary: 'Obtener un rubro por ID' })
    @ApiResponse({ status: 200, description: 'Rubro encontrada', type: Rubro })
    @ApiResponse({ status: 404, description: 'Rubro no encontrada' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findOne(@Param('id') id: string): Promise<Rubro> {
        return this.rubroService.findOneRubro(id);
    }
        
    @Get(':rubroId/products')
    @ApiOperation({ summary: 'Obtener productos por rubro' })
    @ApiResponse({ status: 200, description: 'Productos obtenidos', type: [Products] })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async findProductsByRubro(@Param('rubroId') rubroId: string) {
        return this.rubroService.findProductByRubro(rubroId);
    }
        
    @Put(':id')
    @ApiOperation({ summary: 'Modificar un rubro' })
    @ApiResponse({ status: 201, description: 'Rubro modificado', type: UpdateRubroDto })
    @ApiResponse({ status: 404, description: 'Rubro no encontrado' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    @ApiBody({
        description: 'Datos para actualizar el rubro',
        schema: {
            type: 'object',
            properties: {
                nombre: { type: 'string' },
                codigo: {type: 'number'}
            }
        }
    })
    async update(@Param('id') id: string, @Body() updateRubroDto: UpdateRubroDto): Promise<Rubro> {
        return this.rubroService.update(id, updateRubroDto);
    }
    
}