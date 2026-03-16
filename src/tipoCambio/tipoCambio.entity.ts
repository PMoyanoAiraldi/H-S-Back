import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'tipo_cambio' })
export class TipoCambio {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    valor: number; // El TC del día, ej: 1200.00

    @Column({ type: 'date' })
    fecha: string; // Fecha del TC, ej: '2025-03-16'

    @UpdateDateColumn()
    updatedAt: Date;
}