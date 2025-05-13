import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { seedCategory } from './category.seed';
// import { seedProducts } from './products/product.seed';

@Module({})
export class SeedModule {
    constructor(private dataSource: DataSource) {}

    async onModuleInit() {
        await seedCategory(this.dataSource);
        // await seedProducts(this.dataSource); 
        await seedUsers(this.dataSource); 
    }
}
