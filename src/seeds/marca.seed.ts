import { Marca } from 'src/marca/marca.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedMarca = async (dataSource: DataSource) => {
    const marcaRepository = dataSource.getRepository(Marca);

    const marca = [
    {
        codigo: 162,   
        nombre: 'REXROTH',
        imgUrl: 'default-image-url.jpg',
    },
    {
        codigo: 140,
        nombre: 'GRASELLI JUAN E HIJOS S.A',
        imgUrl: 'default-image-url.jpg',
    },
    {
        codigo: 71,
        nombre: 'VERION',
        imgUrl: 'default-image-url.jpg',
    },
    {
        codigo: 11, 
        nombre: 'METALURGICA CESCA',
        imgUrl: 'default-image-url.jpg',
    },
    {
        codigo: 17,
        nombre: 'MORO ALBERTO',
        imgUrl: 'default-image-url.jpg',
    },
];

  // Insertar marcas si no existen
    for (const marcas of marca) {
        const existingMarca = await marcaRepository.findOne({
        where: { codigo: marcas.codigo },
        });

        if (!existingMarca) {
        await marcaRepository.save(marcas);
        console.log(`La marca "${marcas.nombre}" no existe y se insertará.`);
        } else {
        console.log(`La marca "${marcas.nombre}" ya existe y no se insertará.`);
        }
    }
};