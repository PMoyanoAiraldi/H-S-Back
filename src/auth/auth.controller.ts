import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
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
    async signIn(@Body() credentials: LoginUserDto) {
        return this.authService.login(credentials)
    }

    @UseGuards(AuthGuard) // Solo usuarios autenticados pueden cambiar la contraseña
    @Post('change-password')
    async changePassword(@Req() req, @Body() body) {
        const { oldPassword, newPassword } = body;
        const user = await this.usersRepository.findOne({ where: { id: req.user.id } });

        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        throw new BadRequestException('Contraseña actual incorrecta.');
    }

        user.password = await bcrypt.hash(newPassword, 10);
        user.mustChangePassword = false; // Ya no necesita cambiar la clave
        await this.userRepository.save(user);

        return { message: 'Contraseña cambiada correctamente' };
    }

}
