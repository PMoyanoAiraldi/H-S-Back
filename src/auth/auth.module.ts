import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "src/shared/shared.module";
import { User } from "src/user/users.entity";
import { UserModule } from "src/user/users.module";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwtStrategy";
import { AuthController } from "./auth.controller";


@Module({
    imports: [
        UserModule, 
        PassportModule, 
        SharedModule, 
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        AuthService,
        JwtStrategy, // Estrategia para autenticación JWT
    ],
    controllers: [AuthController],
    exports: [AuthModule]
})
export class AuthModule {}
