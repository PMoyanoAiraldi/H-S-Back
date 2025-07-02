import { Category } from 'src/categories/category.entity';
import { Products } from 'src/product/product.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedProduct = async (dataSource: DataSource) => {
    const productRepository = dataSource.getRepository(Products);

    const products = [
    {
        name: 'Bomba a engranajes G1A',
        description:'',
        price: 0,
        stock: 0,

    },

];

  // Insertar productos si no existen
    for (const product of products) {
        const existingProduct = await productRepository.findOne({
        where: { name: product.name },
        });

        if (!existingProduct) {
        await productRepository.save(product);
        console.log(`El producto "${product.name}" no existe y se insertará.`);
        } else {
        console.log(`El producto "${product.name}" ya existe y no se insertará.`);
        }
    }
};