import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from "./dto/login-user.dto";


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

}
