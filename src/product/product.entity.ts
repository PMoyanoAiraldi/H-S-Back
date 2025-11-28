import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderProduct } from 'src/orderProduct/order-product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Marca } from 'src/marca/marca.entity';
import { Linea } from 'src/linea/linea.entity';
import { Rubro } from 'src/rubro/rubro.entity';
import { SubRubro } from 'src/subRubro/subRubro.entity';
import { Precio } from 'src/precio/precio.entity';

@Entity()
export class Products {

    /**
     * El id del producto 
     * @example 'e2d481f2-735e-428f-8a24-c296956dccf9'
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Código único del cliente (del CSV)
     * @example '1'
     */
    @Column({ type: 'int', unique: true })
    codigo?: number;


    @Column({ nullable: true })
    codigoAlternativo1?: string; // Del CSV "Articulos" - Columna "CodigoAlternativo1"


    @Column({ nullable: true })
    codigoAlternativo2?: string; // Del CSV "Articulos" - Columna "CodigoAlternativo2"


    /**
     * El nombre del producto
     * @example 'Bombas'
     */
    @Column({ length: 100, nullable: false })
    nombre: string;

    /**
     * La descripción del producto
     * @example 'Bomba a engranajes G1A '
     */
    @Column('text',{nullable: false})
    descripcion?: string;


    @ManyToOne(() => Marca, (marca) => marca.productos)
    marca: Marca; // Del CSV "Articulos" - Columna "Marca"

    @ManyToOne(() => Linea, (linea) => linea.productos, { nullable: true })
    linea?: Linea; // Del CSV "Articulos" - Columna "Linea"

    @ManyToOne(() => Rubro, (rubro) => rubro.productos)
    rubro: Rubro; // Del CSV "Articulos" - Columna "Rubro"

    // @ManyToOne(() => SubRubro, (subRubro) => subRubro.productos, { nullable: true })
    // subRubro?: SubRubro; // Del CSV "Articulos" - Columna "SubRubro"


    /**
    * La cantidad disponible de ese producto
    * @example '15'
    */
    // @Column('int',{nullable: false})
    // stock: number;   NO ESTAN ACTUALIZADOS!!!


    /**
    * La url de la imagen del producto
    * @example 'default-image-url.jpg'
    */
    @Column({ default: 'default-image-url.jpg', nullable: true })
    imgUrl?: string;

    /**
    * El estado del producto
    * @example 'true'
    */
    @Column({ default: true }) // Por defecto, el producto estará activo
    state: boolean;

    @OneToMany(() => Precio, (precio) => precio.producto)
    precios: Precio[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => OrderProduct, (orderProduct) => orderProduct.product)  
    @JoinTable()
    orderProducts: OrderProduct[];
}
