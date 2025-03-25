import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Products } from "src/product/product.entity";
import { User } from "src/user/users.entity";
import { OrderProduct } from "./order-product.entity";
import { Order } from "src/order/order.entity";
import { Category } from "src/categories/category.entity";
import { OrderProductService } from "./orderProduct.service";
import { OrderProductController } from "./orderProduct.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User, Products, OrderProduct, Order, Category])],
    providers: [OrderProductService],
    controllers: [OrderProductController],
    exports: [OrderProductService]
})
export class OrderProductModule{}