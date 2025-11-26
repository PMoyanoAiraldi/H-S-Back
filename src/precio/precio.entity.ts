import { Products } from "src/product/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'precios' })
export class Precio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Products, (product) => product.precios)
    producto: Products;

    @Column('int')
    listaPrecio: number; // Del CSV "Precios" - Columna "Lista"

    @Column('decimal', { precision: 10, scale: 2 })
    precio: number; // Del CSV "Precios" - Columna "Valor"

    @UpdateDateColumn()
    updatedAt: Date;
}