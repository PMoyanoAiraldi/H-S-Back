import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        // private readonly cloudinaryService: CloudinaryService,
        
    ) { }

    async createUser(createUser: CreateUserDto): Promise<User>{
        // Verificar si el correo ya existe
        const userExisting = await this.usersRepository.findOne({ where: { name: createUser.name } });
        if (userExisting) {
            throw new HttpException('El cliente ya está registrado', 400);
        }

            // Crear una nueva instancia de usuario
            const newUser = new User();
            Object.assign(newUser, createUser);// Asignar los datos del DTO al nuevo usuario
            console.log('Usuario antes de guardar:', newUser);

            const hashedpassword = await bcrypt.hash(createUser.password, 10);
            newUser.password = hashedpassword;// Asignar la contraseña encriptada al nuevo usuario
            console.log('Hashed password:', newUser.password);

            return this.usersRepository.save(newUser)
        } catch (error) {
            console.error('Error al crear el cliente:', error);
            if (error instanceof HttpException) {
                throw error; // Re-lanzar excepciones controladas
            }
            throw new HttpException('Error al crear el cliente', 500);
        }


        async login(loginUser: LoginUserDto): Promise<{ user: Partial<User>, token: string }> {
            const user = await this.usersRepository.findOne({ 
                where: {name: loginUser.name.toLowerCase()},
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

    
