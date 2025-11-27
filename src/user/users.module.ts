import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Products } from "src/product/product.entity";
import { OrderProduct } from "src/orderProduct/order-product.entity";
import { Order } from "src/order/order.entity";
import { UserService } from "./users.service";
import { UsersController } from "./users.controller";
import { Linea } from "src/linea/linea.entity";



@Module({
    imports: [TypeOrmModule.forFeature([User, Products, OrderProduct, Order, Linea])],
    providers: [ UserService],
    controllers: [UsersController],
    exports: [UserService]
})
export class UserModule{}