import { Category } from 'src/categories/category.entity';
import { Products } from 'src/product/product.entity';
import { DataSource, getRepository } from 'typeorm';


export const seedProduct = async (dataSource: DataSource) => {

    const productRepository = dataSource.getRepository(Products);
    const categoryRepository = dataSource.getRepository(Category);

    try {

    const bombas = await categoryRepository.findOne({ where: { name: 'Bombas' } });
    const motores = await categoryRepository.findOne({ where: { name: 'Motores' } });
    const valvulas = await categoryRepository.findOne({ where: { name: 'Válvulas' } });
    const accesorios = await categoryRepository.findOne({ where: { name: 'Accesorios' } });
    const cilindros = await categoryRepository.findOne({ where: { name: 'Cilindros' } });

    console.log({ bombas, motores, valvulas, accesorios, cilindros });
    if (!bombas || !motores || !valvulas || !accesorios || !cilindros) {
            throw new Error('❌ Alguna categoría no existe. Revisá el seed de categorías.');
        }

        console.log('✅ Todas las categorías encontradas, creando productos...');

    const products = [
    {
        name: 'Bomba a engranajes',
        description:'Completar descripción',
        price: 0.00,
        stock: 0,
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758139499/Bombas_a_engranajes_dlcpfe.png',
        state: true,
        category: bombas
    },
    {
        name: 'Motor hidráulico',
        description:'Completar descripción',
        price: 0.00,
        stock: 0,
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140047/motor-hidraulico_dypniq.png',
        state: true,
        category: motores
    },
    {
        name: 'Válvulas hidráulicas',
        description:'Completar descripción',
        price: 0.00,
        stock: 0,
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140242/valvulas_hidraulicas_u9h3rz.png',
        state: true,
        category: valvulas
    },
    {
        name: 'Mangueras hidráulicas',
        description:'Completar descripción',
        price: 0.00,
        stock: 0,
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140428/mangueras-1_yvorlm.png',
        state: true,
        category: accesorios
    },
    {
        name: 'Cilindro hidráulico',
        description:'Completar descripción',
        price: 0.00,
        stock: 0,
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140654/cilindros-hidraulicos_ixwbrq.png',
        state: true,
        category: cilindros
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

    
    } catch (error) {
    console.error('❌ Error al ejecutar el seed de productos:');
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
};