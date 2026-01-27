import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/user/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request: Request = context.switchToHttp().getRequest() 
    const token = this.extractTokenFromHeader(request)

    if(!token){
      throw new UnauthorizedException('El token no fue encontrado')
    }

    try{
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET') 
      });
      
  //     request['user'] = payload
  //     payload.iat = new Date(payload.iat * 1000)
  //     payload.exp = new Date(payload.exp * 1000)
  //     console.log('Payload', payload) 
  //   }catch{
  //     throw new UnauthorizedException('Token invalido')
  //   }
  //   return true
  // }

     // Buscar el usuario completo en la BD
      const user = await this.usersRepository.findOne({ 
        where: { id: payload.id } 
      });

      if (!user || !user.state) {
        throw new UnauthorizedException('Usuario no encontrado o deshabilitado');
      }

      const { password, ...userWithoutPassword } = user;
      request['user'] = userWithoutPassword; // Guardar usuario completo sin password
      
      console.log('Usuario autenticado:', userWithoutPassword);
    }catch(error){
      console.error('Error en AuthGuard:', error);
      throw new UnauthorizedException('Token invalido')
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined
  }


}