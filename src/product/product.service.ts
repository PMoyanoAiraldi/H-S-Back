import { Repository } from "typeorm";
import { Products } from "./product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
                
    ) { }
    
}