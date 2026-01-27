import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Marca } from "./marca.entity";
import { MarcaService } from "./marca.service";
import { MarcaController } from "./marca.controller";
import { User } from "src/user/users.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Marca, User])],
    providers: [ MarcaService],
    controllers: [MarcaController],
    exports: [MarcaService]
})
export class MarcaModule{}