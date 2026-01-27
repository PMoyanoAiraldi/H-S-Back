import { BadRequestException, Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from "./dto/login-user.dto";
import { AuthGuard } from "src/guard/auth.guard";
import * as bcrypt from 'bcrypt';


@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor (
        private readonly authService: AuthService,
        
    
    ) {}

    @Post('login')
    @ApiOperation({ summary: 'Loguear un usuario' })
    @ApiResponse({ status: 201, description: 'Usuario logueado exitosamente', type: LoginUserDto })
    @ApiResponse({ status: 500, description: 'Error inesperado al loguear el usuario' })
    @ApiBody({
        description: 'Datos para iniciar sesion',
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
        },
})
    async signIn(@Body() credentials: LoginUserDto) {
        return  await  this.authService.login(credentials)
        
    }

    @UseGuards(AuthGuard)
    @Patch('change-password')
    @ApiOperation({ summary: 'Cambiar la contraseña del usuario logueado' })
    @ApiBearerAuth() 
    @ApiBody({
    description: 'Contraseña actual y nueva contraseña',
    schema: {
        type: 'object',
        properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
        },
    },
    })
    @ApiResponse({ status: 200, description: 'Contraseña cambiada correctamente' })
    @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta' })
    async changePassword(@Req() req, @Body() body) {
    const { oldPassword, newPassword } = body;
    return this.authService.changePassword(req.user.id, oldPassword, newPassword);
}

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener usuario logueado a partir del token' })
    getProfile(@Req() req) {
    return req.user;
    }


}
