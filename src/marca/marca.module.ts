import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Marca } from "./marca.entity";
import { MarcaService } from "./marca.service";
import { MarcaController } from "./marca.controller";


@Module({
    imports: [TypeOrmModule.forFeature([Marca])],
    providers: [ MarcaService],
    controllers: [MarcaController],
    exports: [MarcaService]
})
export class MarcaModule{}