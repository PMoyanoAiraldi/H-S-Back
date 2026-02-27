import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Configuracion } from "./configuracion.entity";
import { Repository } from "typeorm";

@Injectable()
export class ConfiguracionService {
    constructor(
        @InjectRepository(Configuracion)
        private readonly configuracionRepository: Repository<Configuracion>,
    ) {}

    async get(clave: string): Promise<number> {
        const config = await this.configuracionRepository.findOne({ where: { clave } });
        return config?.valor ?? 1;
    }

    async set(clave: string, valor: number): Promise<void> {
        await this.configuracionRepository.upsert({ clave, valor }, ['clave']);
    }
}