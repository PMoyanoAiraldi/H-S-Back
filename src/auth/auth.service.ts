import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
            where: {username: loginUser.username},
        });
        console.log('Usuario encontrado:', user);

        if (!user) {
            throw new HttpException('Nombre o contraseña incorrecto', HttpStatus.UNAUTHORIZED);
        }

        // Verificar si el usuario está habilitado
        if (!user.state) {
            throw new ForbiddenException('Tu cuenta está suspendida. Contacta al administrador.');
        }

        const isPasswordMatching = user && await bcrypt.compare(loginUser.password, user.password);

        console.log('Contraseña recibida en el login:', loginUser.password);
        console.log('Contraseña coincide:', isPasswordMatching);

        if (!isPasswordMatching) {
            throw new HttpException('Nombre o contraseña incorrecto', HttpStatus.UNAUTHORIZED);
        }

        const token = await this.createToken(user);
        const { password, ...userWithoutPassword } = user;// Elimina campos sensibles como password

        // Si es su primer acceso, obligar a cambiar la contraseña
        if (user.mustChangePassword) {
        
            return {// Devuelve tanto el token como la información del usuario
                user: {
                    ...userWithoutPassword,
                    mustChangePassword: true,
                },
                token,
            };
        }
        return {
            user: userWithoutPassword,
            token,
        };

    }

    private async createToken(user: User) {
        const payload = {
            id: user.id,
            username: user.username,
            rol: user.admin
        };
        return this.jwtService.signAsync(payload)
    }

    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
    
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            throw new BadRequestException('Contraseña actual incorrecta.');
        }
    
        user.password = await bcrypt.hash(newPassword, 10);
        user.mustChangePassword = false;
    
        await this.usersRepository.save(user);
    
        return { message: 'Contraseña cambiada correctamente' };
    }
    
    
    }