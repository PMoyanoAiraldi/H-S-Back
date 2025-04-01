import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        // private readonly cloudinaryService: CloudinaryService,
        
    ) { }

    async createUser(createUser: CreateUserDto): Promise<User>{
        // Verificar si el correo ya existe
        const userExisting = await this.usersRepository.findOne({ where: { username: createUser.username } });
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

            const savedUser = await this.usersRepository.save(newUser)
            console.log('Usuario guardado en la BD:', savedUser);
            return savedUser
        } catch (error) {
            console.error('Error al crear el cliente:', error);
            if (error instanceof HttpException) {
                throw error; // Re-lanzar excepciones controladas
            }
            throw new HttpException('Error al crear el cliente', 500);
        }

        async getUserForId(id: string): Promise<User | undefined>{
            return this.usersRepository.findOne({ where: {id}})
        }
        
        async processClients(clients: Partial<User>[]): Promise<User[]> {
            const createdUsers: User[] = [];
            for (const client of clients) {
                const existingUser = await this.usersRepository.findOne({ 
                where: { username: client.username } 
                });
        
                if (!existingUser) {
                const hashedPassword = await bcrypt.hash('ClaveTemporal123!', 10);
                
                const newUser = this.usersRepository.create({
                    username: this.generateUsername(client),
                    password: hashedPassword,
                    mustChangePassword: true, // Obligar cambio de clave en primer login
                });
        
                await this.usersRepository.save(newUser);
                createdUsers.push(newUser);
            }
                return createdUsers
            }
        }
        
        private generateUsername(client: any): string {
            return client.razonSocial 
                ? client.razonSocial.replace(/\s+/g, '_').toLowerCase()
                : `${client.nombre}_${client.apellido}`.toLowerCase();
        }


        
        }

    
