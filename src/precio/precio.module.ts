import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Precio } from "./precio.entity";
import { PrecioService } from "./precio.service";
import { PrecioController } from "./precio.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Precio])],
    providers: [ PrecioService],
    controllers: [PrecioController],
    exports: [PrecioService]
})
export class PrecioModule{}