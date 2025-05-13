import { DataSource, getRepository } from 'typeorm';
import { rolEnum } from 'src/user/users.entity';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/users.entity';


export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // Contraseñas por defecto
  const passwordAdmin = 'Admin*123';
  const passwordCliente = 'Cliente*123';

  // Encriptando las contraseñas
  const hashedPasswordAdmin = await bcrypt.hash(passwordAdmin, 10);
  const hashedPasswordCliente = await bcrypt.hash(passwordCliente, 10);

  const users = [
    {
      username: 'Administrador',
      password: hashedPasswordAdmin, // Asignando la contraseña hasheada
      rol: rolEnum.ADMIN,
    },
    {
      username: 'Cliente Juan',
      password: hashedPasswordCliente, // Asignando la contraseña hasheada
      rol: rolEnum.CLIENTE,
    },
  ];

  // Insertar usuarios si no existen
  for (const user of users) {
    const existingUser = await userRepository.findOne({
      where: { username: user.username }, // Verifica si el usuario ya existe por su nombre de usuario
    });

    if (!existingUser) {
      await userRepository.save(user);
      console.log(`El usuario "${user.username}" no existe y se insertará.`);
    } else {
      console.log(`El usuario "${user.username}" ya existe y no se insertará.`);
    }
  }
};
