import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/users.entity";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
    
        
    ) { }
    async login(loginUser: LoginUserDto): Promise<{ user: Partial<User>, token: string }> {
        const user = await this.usersRepository.findOne({ 
            where: {name: loginUser.name},
        });
        console.log('Usuario encontrado:', user);

        if (!user) {
            throw new HttpException('Nombre o contraseña incorrecto', HttpStatus.UNAUTHORIZED);
        }

        // Verificar si el usuario está habilitado
        if (!user.state) {
            throw new ForbiddenException('Tu cuenta está suspendida. Contacta al administrador.');
        }

        const isPasswordMatchin = user && await bcrypt.compare(loginUser.password, user.password);

        console.log('Contraseña recibida en el login:', loginUser.password);
        console.log('Contraseña coincide:', isPasswordMatchin);

        if (!isPasswordMatchin) {
            throw new HttpException('Nombre o contraseña incorrecto', HttpStatus.UNAUTHORIZED);
        }

        const token = await this.createToken(user);
        
        // Elimina campos sensibles como contrasena
        const { password, ...userswithoutpassword } = user;

        // Devuelve tanto el token como la información del usuario
        return {
            user: userswithoutpassword,
            token
        };
    }

    private async createToken(user: User) {
        const payload = {
            id: user.id,
            name: user.name,
            rol: user.admin
        };
        return this.jwtService.signAsync(payload)
    }
    
    }