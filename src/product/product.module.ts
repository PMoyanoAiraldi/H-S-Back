import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/users.entity";
import { Products } from "./product.entity";
import { OrderProduct } from "src/orderProduct/order-product.entity";
import { Order } from "src/order/order.entity";
import { ProductService } from "./product.service";
import { ProductsController } from "./product.controller";
import { CloudinaryService } from "src/file-upload/cloudinary.service";
import { Linea } from "src/linea/linea.entity";
import { LineaService } from "src/linea/linea.service";
import { Precio } from "src/precio/precio.entity";
import { MarcaService } from "src/marca/marca.service";
import { RubroService } from "src/rubro/rubro.service";
import { Marca } from "src/marca/marca.entity";
import { Rubro } from "src/rubro/rubro.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Products, OrderProduct, Order, Precio, Linea, Marca, Rubro])],
    providers: [ ProductService, MarcaService, RubroService, LineaService, CloudinaryService],
    controllers: [ProductsController],
    exports: [ProductService]
})
export class ProductModule{}