import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfiguracionController } from "./configuracion.controller";
import { ConfiguracionService } from "./configuracion.service";
import { Configuracion } from "./configuracion.entity";
import { User } from "src/user/users.entity";



@Module({
    imports: [TypeOrmModule.forFeature([Configuracion, User])],
    providers: [ConfiguracionService],
    controllers: [ConfiguracionController],
    exports: [ConfiguracionService, TypeOrmModule]
})

export class ConfiguracionModule{}