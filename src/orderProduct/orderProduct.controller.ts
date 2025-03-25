import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderProductService } from "./orderProduct.service";

@ApiTags("OrderProduct")
@Controller("orderProduct")
export class OrderProductController {
    constructor(
        private readonly orderProductsService: OrderProductService,
    ) { }
}