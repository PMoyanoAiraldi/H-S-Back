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
import { Precio } from "src/precio/precio.entity";
import { MarcaService } from "src/marca/marca.service";
import { Marca } from "src/marca/marca.entity";
import { RubroService } from "src/rubro/rubro.service";
import { Rubro } from "src/rubro/rubro.entity";



@Module({
    imports: [TypeOrmModule.forFeature([Linea, Marca, Rubro, User, Products, Order, Precio, OrderProduct])],
    providers: [LineaService, CloudinaryService, MarcaService, RubroService, FileUploadService, ProductService],
    controllers: [LineaController],
    exports: [LineaService, TypeOrmModule]
})

export class LineaModule{}