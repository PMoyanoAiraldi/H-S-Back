import { Linea } from "src/linea/linea.entity";
import { Products } from "src/product/product.entity";
import { SubRubro } from "src/subRubro/subRubro.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'rubros' })
export class Rubro {
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

    // @OneToMany(() => Linea, (linea) => linea.rubro)
    // linea: Linea[];

    @OneToMany(() => SubRubro, (subRubro) => subRubro.rubro)
    subRubros: SubRubro[];

    @OneToMany(() => Products, (product) => product.rubro)
    productos: Products[];
}