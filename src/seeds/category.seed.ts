import { Category } from 'src/categories/category.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedCategory = async (dataSource: DataSource) => {
    const categoryRepository = dataSource.getRepository(Category);

    const categories = [
    {
        name: 'Accesorios'
    },
    {
        name: 'Bombas',
    },
    {
        name: 'Motores',
    },
    {
        name: 'Válvulas',
    },
    {
        name: 'Cilindros',
    },
];

  // Insertar categorias si no existen
    for (const category of categories) {
        const existingCategory = await categoryRepository.findOne({
        where: { name: category.name },
        });

        if (!existingCategory) {
        await categoryRepository.save(category);
        console.log(`La categoria "${category.name}" no existe y se insertará.`);
        } else {
        console.log(`La categoria "${category.name}" ya existe y no se insertará.`);
        }
    }
};