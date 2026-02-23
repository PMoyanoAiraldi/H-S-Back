import { Products } from "src/product/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'marcas' })

export class Marca {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Código único del cliente (del CSV)
     * @example '1'
     */
    @Column({ type: 'int', nullable: false, unique: true })
    codigo: number;

    @Column()
    nombre: string; // Del CSV "Marcas" - Columna "Nombre"

    @Column({ default: 'default-image-url.jpg', nullable: true })
    imgUrl?: string;


    @Column({ default: true }) 
    state: boolean;

    @OneToMany(() => Products, (product) => product.marca)
    productos: Products[]
}
