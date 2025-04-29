import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/users.entity";
import { Products } from "./product.entity";
import { OrderProduct } from "src/orderProduct/order-product.entity";
import { Order } from "src/order/order.entity";
import { Category } from "src/categories/category.entity";
import { ProductService } from "./product.service";
import { ProductsController } from "./product.controller";
import { CategoryService } from "src/categories/category.service";
import { CloudinaryService } from "src/file-upload/cloudinary.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, Products, OrderProduct, Order, Category])],
    providers: [ ProductService, CategoryService, CloudinaryService],
    controllers: [ProductsController],
    exports: [ProductService]
})
export class ProductModule{}