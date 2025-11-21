import { Linea } from "src/linea/linea.entity";
import { Products } from "src/product/product.entity";
import { Rubro } from "src/rubro/rubro.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'sub_rubros' })
export class SubRubro {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Código único del cliente (del CSV)
     * @example '1'
     */
    @Column({ type: 'int', nullable: false, unique: true })
    codigo: number;

    @Column({ unique: true })
    nombre: string; // Del CSV "Rubros" - Columna "Nombre"

    // @OneToMany(() => Linea, (linea) => linea.subRubro)
    // linea: Linea[];

    @ManyToOne(() => Rubro, (rubro) => rubro.subRubros)
    rubro: Rubro;

    @OneToMany(() => Products, (product) => product.subRubro)
    productos: Products[];
}