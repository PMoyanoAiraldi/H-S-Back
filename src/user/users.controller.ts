import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";


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
    async uploadClients(@Body() clients: any[]) {
        await this.usersService.processClients(clients);
        return { message: 'Clientes procesados correctamente' };
    }
}