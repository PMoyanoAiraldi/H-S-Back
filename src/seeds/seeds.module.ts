import { Module, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { seedCategory } from './category.seed';
import { seedProduct } from './product.seed';

@Module({})
export class SeedModule implements OnModuleInit {
    constructor(private dataSource: DataSource) {}

    async onModuleInit() {

        await seedCategory(this.dataSource);
        await seedProduct(this.dataSource)
        await seedUsers(this.dataSource); 
        
    }
}
