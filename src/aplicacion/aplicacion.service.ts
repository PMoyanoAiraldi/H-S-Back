import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Aplicacion } from "./aplicacion.entity";
import { Repository } from "typeorm";

@Injectable()
export class AplicacionService {
    constructor(
        @InjectRepository(Aplicacion)
        private readonly aplicacionRepository: Repository<Aplicacion>,
    ) {}

    async findAll(): Promise<Aplicacion[]> {
        return this.aplicacionRepository.find({
            where: { state: true },
            order: { codigo: 'ASC' }
        });
    }

    async findOne(id: string): Promise<Aplicacion> {
        return this.aplicacionRepository.findOne({ where: { id } });
    }

}