import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/users.entity";
import { Products } from "src/product/product.entity";
import { Order } from "src/order/order.entity";
import { OrderProduct } from "src/orderProduct/order-product.entity";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import { FileUploadService } from "src/file-upload/file-upload.service";
import { ProductService } from "src/product/product.service";
import { Linea } from "./linea.entity";
import { LineaService } from "./linea.service";
import { LineaController } from "./linea.controller";



@Module({
    imports: [TypeOrmModule.forFeature([Linea, User, Products, Order, OrderProduct])],
    providers: [LineaService, CloudinaryService, FileUploadService, ProductService],
    controllers: [LineaController],
    exports: [LineaService, TypeOrmModule]
})

export class LineaModule{}