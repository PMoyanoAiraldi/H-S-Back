import { Order } from "src/order/order.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum rolEnum {
    ADMIN = 'admin',
    CLIENTE = 'cliente',
}

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
     * Código único del cliente (del CSV)
     * @example '1'
     */
    // @Column({ type: 'int', nullable: false, unique: true })
    // codigo: number;

    /**
     * Nombre del cliente
     * @example 'Empresa S.A' o 'Juan Perez'
     */
    @Column({ length: 255, nullable: false, unique: true })
    nombre: string;

    /**
     * La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)
     * @example 'Ejemplo*1'
     */
    @Column({ nullable: false})
    password: string;

    // @Column({ nullable: true })
    // email?: string; // Del CSV "Clientes" - Columna "Email"

    // @Column({ nullable: true })
    // telefono?: string; // Del CSV "Clientes" - Columna "Telefono"

    // @Column('decimal', { precision: 5, scale: 2, default: 0 })
    // descuento: number; // Del CSV "Descuento1"

    // @Column({ default: 'lista_general' })
    // listaPrecio: string; // Del CSV "ListasDePrecio"

    @Column({
        type: 'enum',
        enum: rolEnum,
        default: rolEnum.CLIENTE,
    })
    rol: rolEnum;

    /**
     * Estado del cliente. `true` significa que el cliente está activo, `false` indica que está inactivo.
     * @example 'true'
     */
    @Column({ default: true }) // Por defecto, el cliente estará activo
    state: boolean;


    /**
     * Indica si el cliente debe cambiar su contraseña al iniciar sesión
     * @example true
     */
    @Column({ default: true })
    mustChangePassword: boolean;


    /**
     * Token hasheado para recuperación de contraseña
     */
    @Column({ nullable: true })
    resetPasswordToken?: string;


    /**
     * Fecha de expiración del token de recuperación
     */
    @Column({ nullable: true })
    resetPasswordExpires?: Date;

    /**
     * Fecha del último login del usuario
     */
    @Column({ nullable: true })
    lastLogin?: Date;


    /**
     * Fecha de creación del registro
     * Se setea automáticamente
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Fecha de última modificación del registro
     * Se actualiza automáticamente en cada save()
     */
    @UpdateDateColumn()
    updatedAt: Date;


    /**
     * Lista de órdenes asociadas al cliente.
     * 
     */
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]
}
