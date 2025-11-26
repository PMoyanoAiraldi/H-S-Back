import { Marca } from 'src/marca/marca.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedMarca = async (dataSource: DataSource) => {
    const marcaRepository = dataSource.getRepository(Marca);

    const marca = [
    {
        codigo: 162,   
        nombre: 'REXROTH'
    },
    {
        codigo: 140,
        nombre: 'GRASELLI JUAN E HIJOS S.A',
    },
    {
        codigo: 71,
        nombre: 'VERION',
    },
    {
        codigo: 11, 
        nombre: 'METALURGICA CESCA',
    },
    {
        codigo: 17,
        nombre: 'MORO ALBERTO',
    },
];

  // Insertar marcas si no existen
    for (const marcas of marca) {
        const existingMarca = await marcaRepository.findOne({
        where: { nombre: marcas.nombre },
        });

        if (!existingMarca) {
        await marcaRepository.save(marcas);
        console.log(`La marca "${marcas.nombre}" no existe y se insertará.`);
        } else {
        console.log(`La marca "${marcas.nombre}" ya existe y no se insertará.`);
        }
    }
};