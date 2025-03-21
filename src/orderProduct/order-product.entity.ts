import { Order } from "src/order/order.entity";
import { Products } from "../product/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum statusEnum {
    PENDING = 'pending',           // La orden fue creada, pero aún no confirmada.
    CONFIRMED = 'confirmed',       // El usuario confirmó la compra (checkout), pero aún no pagó.
    PAID = 'paid',                 // El pago fue recibido exitosamente.
    PROCESSING = 'processing',     // El pedido se está preparando para envío.
    SHIPPED = 'shipped',           // El pedido fue enviado.
    DELIVERED = 'delivered',       // El pedido fue recibido por el cliente.
    CANCELLED = 'cancelled',       // El pedido fue cancelado antes de ser pagado/enviado.
    RETURNED = 'returned',         // El cliente devolvió el pedido.
}

@Entity({ name: 'orderProduct'})

export class OrderProduct{
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid', name: "productId", nullable: false })
    productId: string;
        
    @ManyToOne(() => Products, (product) => product.orderProducts,)
    @JoinColumn({ name: "productId" })
    product: Products;

    @Column({type: 'int'})
    quantity: number

    @Column({type: 'int'})
    subtotal: number

    @Column({ type: 'uuid', name: 'orderId', nullable: false })
    orderId: string

    @ManyToOne(() => Order, (orders) => orders.orderProducts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    orders: Order;

    @Column({
            type: 'enum',
            enum: statusEnum,
            default: statusEnum.PENDING,
        })
    status: statusEnum; 
}