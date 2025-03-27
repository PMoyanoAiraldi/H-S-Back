import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        // private readonly jwtService: JwtService,
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
        
    }

    
