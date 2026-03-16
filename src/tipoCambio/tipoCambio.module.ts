import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCambio } from './tipoCambio.entity';
import { TipoCambioController } from './tipoCambio.controller';
import { TipoCambioService } from './tipoCambio.service';
import { User } from 'src/user/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TipoCambio, User])],
    controllers: [TipoCambioController],
    providers: [TipoCambioService],
})
export class TipoCambioModule {}