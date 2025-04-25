import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { User } from "src/user/users.entity";
import { Products } from "src/product/product.entity";
import { Order } from "src/order/order.entity";
import { OrderProduct } from "src/orderProduct/order-product.entity";
import { CategoryController } from "./category.controller";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import { FileUploadService } from "src/file-upload/file-upload.service";
import { ProductService } from "src/product/product.service";



@Module({
    imports: [TypeOrmModule.forFeature([Category, User, Products, Order, OrderProduct])],
    providers: [CategoryService, CloudinaryService, FileUploadService, ProductService],
    controllers: [CategoryController],
    exports: [CategoryService, TypeOrmModule]
})

export class CategoryModule{}