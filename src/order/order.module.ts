import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderProduct } from "src/orderProduct/order-product.entity";
import { Products } from "src/product/product.entity";
import { User } from "src/user/users.entity";
import { Order } from "./order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { Linea } from "src/linea/linea.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Products, OrderProduct, Order, Linea])],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule{}