
import { Precio } from 'src/precio/precio.entity';
import { Products } from 'src/product/product.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedPrecio = async (dataSource: DataSource) => {
    const precioRepository = dataSource.getRepository(Precio);
    const productRepository = dataSource.getRepository(Products);

    const precio = [
    {
        listaPrecio: 1,  
        precio: 49979.58,
        productId: '0d199b6b-479c-4fd9-8a16-1eb9634b5d99'
    },
    {
        listaPrecio: 1,  
        precio: 81.08,
        productId: '14da8a6a-6cde-4d63-b1b7-0e4820abd80e'
    },
    {
        listaPrecio: 1,  
        precio: 44993.74,
        productId: '213d1e09-bcbf-4ad4-8147-8c3794efc899'
    },
    {
        listaPrecio: 1,  
        precio: 5273.18,
        productId: '3c04b189-04a3-4e34-bb0c-56fb69c31af0'
    },
    {
        listaPrecio: 1,  
        precio: 314393.20,
        productId: 'a4ae98df-e8b5-4cc1-83ed-9bb05953da60'
    },
];

  // Insertar precios si no existen
    for (const precioData of precio) {
        try {
            // Verificar que el producto existe
            const producto = await productRepository.findOne({
                where: { id: precioData.productId }
            });

            if (!producto) {
                console.log(`❌ Producto con ID "${precioData.productId}" no existe. Saltando...`);
                continue;
            }

            // Verificar si ya existe un precio para ese producto y esa lista
            const existingPrice = await precioRepository.findOne({
                where: { 
                    producto: { id: precioData.productId },
                    listaPrecio: precioData.listaPrecio 
                },
                relations: ['producto']
            });

            if (!existingPrice) {
                // Crear el precio con la relación al producto
                const nuevoPrecio = precioRepository.create({
                    producto: producto,
                    listaPrecio: precioData.listaPrecio,
                    precio: precioData.precio
                });

                await precioRepository.save(nuevoPrecio);
                console.log(`✅ Precio ${precioData.precio} insertado para producto ${producto.nombre} (Lista ${precioData.listaPrecio})`);
            } else {
                console.log(`⚠️  Ya existe precio para producto ${producto.nombre} en lista ${precioData.listaPrecio}. No se insertará.`);
            }
        } catch (error) {
            console.error(`❌ Error al insertar precio para producto ${precioData.productId}:`, error.message);
        }
    }
};