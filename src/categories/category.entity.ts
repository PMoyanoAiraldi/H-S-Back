import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Products } from '../product/product.entity';

@Entity()
export class Category {

    /**
     * El id de la categoría
     * @example 'e2d481f2-735e-428f-8a24-c296956dccf9'
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * El nombre de la categoría del producto
     * @example 'tractor - ver si lo tomamos por herramientas'
     */
    @Column({ length: 50, nullable: false })
    name: string;

    @OneToMany(() => Products, (product) => product.category)
    products: Products[];

    @Column({ nullable: true })
    image?: string;

    @Column({ default: true }) // Por defecto, la categoria estará activa
    state: boolean
}
