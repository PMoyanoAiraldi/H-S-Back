
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
        productId: 'b6abb5a9-f54e-4289-b0ff-5004b40aa3ae'
    },
    {
        listaPrecio: 1,  
        precio: 81.08,
        productId: '7d62031f-cc0f-4ef0-89fd-59336571e8d5'
    },
    {
        listaPrecio: 1,  
        precio: 44993.74,
        productId: 'e2aa52bf-2579-4bff-addf-0a824b16056b'
    },
    {
        listaPrecio: 1,  
        precio: 5273.18,
        productId: 'b2f900ff-274f-43a4-8110-687a38b3b3a0'
    },
    {
        listaPrecio: 1,  
        precio: 314393.20,
        productId: '0175207a-7daf-4daf-bf05-678b77869af7'
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