import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Rubro } from "./rubro.entity";
import { RubroService } from "./rubro.service";
import { RubroController } from "./rubro.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Rubro])],
    providers: [ RubroService],
    controllers: [RubroController],
    exports: [RubroService]
})
export class RubroModule{}