import { Marca } from "src/marca/marca.entity";
import { Products } from "src/product/product.entity";
import { Rubro } from "src/rubro/rubro.entity";
import { SubRubro } from "src/subRubro/subRubro.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'lineas' })
export class Linea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Código único del cliente (del CSV)
     * @example '1'
     */
    @Column({ type: 'int', nullable: false, unique: true })
    codigo: number;

    @Column({ unique: true })
    nombre: string; // Del CSV "Lineas" - Columna "Nombre"

    // @ManyToOne(() => Rubro, (rubro) => rubro.linea)
    // rubro: Rubro;

    // @ManyToOne(() => SubRubro, (subRubro) => subRubro.linea)
    // subRubro: SubRubro;

    @Column({ default: 'default-image-url.jpg', nullable: true })
    imgUrl?: string;

    @Column({ default: true }) 
    state: boolean;

    @OneToMany(() => Products, (product) => product.linea)
    productos: Products[];
}