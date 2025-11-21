import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CloudinaryService } from './cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/users.entity';
import { UserService } from 'src/user/users.service';
import { CategoryService } from 'src/linea/linea.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  
  ],
  providers: [FileUploadService,UserService, CloudinaryService,  CategoryService],
  controllers: [],
  exports: [FileUploadService,  CloudinaryService]
})

export class FileUploadModule {}
