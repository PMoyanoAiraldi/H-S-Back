import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Configuracion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    clave: string; // ej: 'tipo_cambio'

    @Column('decimal', { precision: 10, scale: 2 })
    valor: number;

    @UpdateDateColumn()
    updatedAt: Date;
}