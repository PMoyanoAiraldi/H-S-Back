import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SftpService } from './sftp.service';
import { SftpController } from './sftp.controller';
import { User } from 'src/user/users.entity';
import { Linea } from 'src/linea/linea.entity';
import { Marca } from 'src/marca/marca.entity';
import { Rubro } from 'src/rubro/rubro.entity';
import { Products } from 'src/product/product.entity';
import { Precio } from 'src/precio/precio.entity';


@Module({
    imports: [
        ScheduleModule.forRoot(),   // necesario para los Cron jobs
        TypeOrmModule.forFeature([User, Linea, Marca, Rubro, Products, Precio]),
    ],
    providers: [SftpService],
    controllers: [SftpController],
    exports: [SftpService],
})
export class SftpModule {}