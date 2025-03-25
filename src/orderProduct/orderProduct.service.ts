import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderProduct } from "./order-product.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrderProductService {
    constructor(
        @InjectRepository(OrderProduct)
        private readonly orderProductsRepository: Repository<OrderProduct>,
            
    ) { }
}