import { Order } from "src/order/order.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

export enum rolEnum {
    ADMIN = 'admin',
    CLIENT = 'client',
}

@Entity({
    name: 'users'
})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 80, nullable: false })
    name: string;

    @Column({ nullable: false })
    password: string;

    @Column({
        type: 'enum',
        enum: rolEnum,
        default: rolEnum.CLIENT,
    })
    rol: rolEnum;

    @Column({ default: true }) // Por defecto, el usuario estará activo
    state: boolean;

    @OneToMany(() => Order, (order) => order.user)
    order: Order[]
}
