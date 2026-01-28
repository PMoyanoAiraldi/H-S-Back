import { Body, Controller, Post, Get, UseGuards, UseInterceptors, Param, Patch } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Roles } from "src/decorators/roles.decorator";
import { AuthGuard } from "src/guard/auth.guard";
import { RolesGuard } from "src/guard/roles.guard";
import { User } from "./users.entity";
import { RecoverPasswordDto } from "./dto/recover-password.dto";


@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UserService,
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
    async recoverPassword(@Body() recoverData: RecoverPasswordDto) {
        const user = await this.usersService.recoverPassword(recoverData);
        return { message: 'Contraseña actualizada con éxito!', user};
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @ApiSecurity('bearer')
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
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