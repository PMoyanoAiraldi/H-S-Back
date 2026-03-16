import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCambio } from './tipoCambio.entity';

@Injectable()
export class TipoCambioService {

    constructor(
        @InjectRepository(TipoCambio)
        private readonly tipoCambioRepo: Repository<TipoCambio>,
    ) {}

    // Trae el TC más reciente guardado
    // Lo usa el frontend para mostrar el valor actual
    async getActual(): Promise<TipoCambio> {
        const tc = await this.tipoCambioRepo.findOne({
            where: {},
            order: { fecha: 'DESC' }, // el más reciente primero
        });

        if (!tc) throw new NotFoundException('No hay tipo de cambio cargado');
        return tc;
    }

    // Crea o actualiza el TC del día
    // Si ya existe un TC para hoy, lo pisa. Si no, crea uno nuevo.
    async upsertHoy(valor: number): Promise<TipoCambio> {
        const hoy = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

        let tc = await this.tipoCambioRepo.findOne({ where: { fecha: hoy } });

        if (tc) {
            // Ya existe uno para hoy, lo actualizamos
            tc.valor = valor;
            return this.tipoCambioRepo.save(tc);
        }

        // No existe para hoy, creamos uno nuevo
        const nuevo = this.tipoCambioRepo.create({ valor, fecha: hoy });
        return this.tipoCambioRepo.save(nuevo);
    }
}