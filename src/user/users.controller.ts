import { Body, Controller, Post, Get, UseGuards, UseInterceptors, Param, Patch, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Roles } from "src/decorators/roles.decorator";
import { AuthGuard } from "src/guard/auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { User } from "./users.entity";
import { RecoverPasswordDto } from "./dto/recover-password.dto";
import { FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UserService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Crear un nuevo cliente' })
    @ApiResponse({ status: 201, description: 'Cliente creado exitosamente', type: CreateUserDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al crear el cliente' })
    @ApiBody({
        description: 'Datos para registrar el cliente',
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
        },
    })
        async createUser(@Body() createUser: CreateUserDto) {
        const user = await this.usersService.createUser(createUser)

        return {
            message: `Cliente creado exitosamente`, user
        };
    }

    @Post('upload')
    async uploadClients(@Body() clients: User[]) {
        await this.usersService.processClients(clients);
        return { message: 'Clientes procesados correctamente' };
    }

    @Post('recover')
    @HttpCode(HttpStatus.OK)
    async recoverPassword(@Body() recoverData: RecoverPasswordDto) {
        const result = await this.usersService.recoverPassword(recoverData);
        return result;
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '100',
        @Query('state') state?: string,
        @Query('rol') rol?: string,
        @Query('search') search?: string
    ) {
        const pageNumber = Number(page) || 1;
        const limitNumber = Math.min(Number(limit) || 100, 100);

        const query = this.userRepository
        .createQueryBuilder('user')
        .orderBy('user.nombre', 'ASC')
        .take(limitNumber)
        .skip((pageNumber - 1) * limitNumber);
                                            //SQL con un placeholder :state // { state: true } → el valor que reemplaza al placeholder
        if (state === 'active') query.andWhere('user.state = :state', { state: true });
        if (state === 'inactive') query.andWhere('user.state = :state', { state: false });
        if (rol && rol !== 'todos') query.andWhere('user.rol = :rol', { rol });
        if (search) query.andWhere('user.nombre ILIKE :search', { search: `%${search}%` });

        const [users, total] = await query.getManyAndCount();

        return {
            total,
            totalPages: Math.ceil(total / limitNumber),
            page: pageNumber,
            data: users,
        };
    }
    

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findOne(@Param('id') id: string): Promise<User> {
            return this.usersService.getUserForId(id);
    }

    @Patch(':id/state')
    @ApiOperation({ summary: 'Cambiar estado de un usuario (activar/desactivar)' })
    @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente', type: User })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiBody({
        description: 'Estado del usuario',
        schema: {
            type: 'object',
            properties: {
                state: { type: 'boolean', example: true }
            }
        }
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async updateState(
        @Param('id') id: string,
        @Body('state') state: boolean
    ): Promise<User> {
        return this.usersService.updateUserState(id, state);
    }

}