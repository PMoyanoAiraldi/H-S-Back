import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Products } from "src/product/product.entity";
import { User } from "src/user/users.entity";
import { OrderProduct } from "./order-product.entity";
import { Order } from "src/order/order.entity";
import { OrderProductService } from "./orderProduct.service";
import { OrderProductController } from "./orderProduct.controller";
import { Linea } from "src/linea/linea.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Products, OrderProduct, Order, Linea])],
    providers: [OrderProductService],
    controllers: [OrderProductController],
    exports: [OrderProductService]
})
export class OrderProductModule{}