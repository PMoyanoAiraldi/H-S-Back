import { Products } from "src/product/product.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'aplicacion' })
export class Aplicacion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Código único del cliente (del CSV)
     * @example '1'
     */
    @Column({ type: 'int', nullable: false, unique: true })
    codigo: number;

    @Column()
    nombre: string; 

    @Column({ default: 'default-image-url.jpg', nullable: true })
    imgUrl?: string;

    @Column({ default: true }) 
    state: boolean;

    @ManyToMany(() => Products, (product) => product.aplicaciones)
    productos: Products[];
}