import { Category } from 'src/categories/category.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedCategory = async (dataSource: DataSource) => {
    const categoryRepository = dataSource.getRepository(Category);

    const categories = [
    {
        name: 'Tractor',
        image: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1746567196/category/tractorjpg.jpg', 
    },
    {
        name: 'Cosechadora',
        image: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1746568022/category/cosechadorajpeg.jpg'
    },
    {
        name: 'Pulverizador',
        image: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1747176421/category/pulverizadorjpg.jpg'
    },
    {
        name: 'Sembradora',
        image: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1747176345/category/sembradorajpg.jpg'
    },

];

  // Insertar usuarios si no existen
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