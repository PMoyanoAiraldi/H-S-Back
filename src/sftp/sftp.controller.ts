import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SftpService } from './sftp.service';
import { User } from 'src/user/users.entity';


@Controller('clientes')
export class SftpController {
    constructor(
        private readonly sftpService: SftpService,
    ) {}

    /**
     * Dispara la sincronización manualmente (útil para testing o forzar actualización)
     * POST /clientes/sync
     * 
     * IMPORTANTE: proteger este endpoint con un guard de admin en producción
     */
    @Post('sync')
    async syncManual() {
        await this.sftpService.syncManual();
        return { message: 'Sincronización ejecutada correctamente.' };
    }
}