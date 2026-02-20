import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SftpService } from './sftp.service';
import { SftpController } from './sftp.controller';
import { User } from 'src/user/users.entity';


@Module({
    imports: [
        ScheduleModule.forRoot(),   // necesario para los Cron jobs
        TypeOrmModule.forFeature([User]),
    ],
    providers: [SftpService],
    controllers: [SftpController],
    exports: [SftpService],
})
export class SftpModule {}