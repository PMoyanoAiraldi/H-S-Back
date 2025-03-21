import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../categories/category.entity';
import { OrderProduct } from 'src/orderProduct/order-product.entity';

@Entity()
export class Products {

    /**
     * El id del producto 
     * @example 'e2d481f2-735e-428f-8a24-c296956dccf9'
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;


    /**
     * El nombre del producto
     * @example 'Bombas'
     */
    @Column({ length: 50, nullable: false })
    name: string;

    /**
     * La descripción del producto
     * @example 'Bomba a engranajes G1A '
     */
    @Column('text',{nullable: false})
    description: string;

    /**
    * El precio del producto
    * @example '250.50'
    */
    @Column('decimal', { precision: 10, scale: 2, nullable: false})
    price: number;

    /**
    * La cantidad disponible de ese producto
    * @example '15'
    */
    @Column('int',{nullable: false})
    stock: number;

    /**
    * La url de la imagen del producto
    * @example 'default-image-url.jpg'
    */
    @Column({ default: 'default-image-url.jpg' })
    imgUrl: string;

    
    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @ManyToMany(() => OrderProduct, (orderProduct) => orderProduct.product)  
    @JoinTable()
    orderProducts: OrderProduct[];
}
