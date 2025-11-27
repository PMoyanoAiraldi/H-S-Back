import { TypeOrmModule } from "@nestjs/typeorm";
import { SubRubro } from "./subRubro.entity";
import { SubRubroService } from "./subRubro.service";
import { SubRubroController } from "./subRubro.controller";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([SubRubro])],
    providers: [ SubRubroService],
    controllers: [SubRubroController],
    exports: [SubRubroService]
})
export class SubRubroModule{}