import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Rubro } from "./rubro.entity";
import { RubroService } from "./rubro.service";
import { RubroController } from "./rubro.controller";
import { User } from "src/user/users.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Rubro, User])],
    providers: [ RubroService],
    controllers: [RubroController],
    exports: [RubroService]
})
export class RubroModule{}