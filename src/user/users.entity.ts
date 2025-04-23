import { Order } from "src/order/order.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";


@Entity({
    name: 'users'
})
export class User {

    /**
     * El id del usuario
     * @example 'e2d481f2-735e-428f-8a24-c296956dccf9'
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;


    /**
     * Nombre del usuario
     * @example 'Paula'
     */
    @Column({ length: 80, nullable: false, unique: true })
    username: string;


    /**
     * La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)
     * @example 'Ejemplo*1'
     */
    @Column({ nullable: false})
    password: string;



    /**
     *  Rol del usuario, si es `false` es un usuario estándar, si es `true` es administrador.
     * @example 'false'
     */
    @Column({default: false})
    admin: boolean


    /**
     * Estado del usuario. `true` significa que el usuario está activo, `false` indica que está inactivo.
     * @example 'true'
     */
    @Column({ default: true }) // Por defecto, el usuario estará activo
    state: boolean;


    /**
     * Indica si el usuario debe cambiar su contraseña al iniciar sesión
     * @example true
     */
    @Column({ default: true })
    mustChangePassword: boolean;

    /**
     * Lista de órdenes asociadas al usuario.
     * 
     */
    @OneToMany(() => Order, (order) => order.user)
    order: Order[]
}
