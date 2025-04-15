import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { jwtPayload } from 'src/types';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async verify(token: string): Promise<jwtPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('jwt.ref'),
      ignoreExpiration: false,
      algorithms: ['HS256'],
    });
  }

  async generateRefreshToken(id: string, tenant: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        ID: id,
        type: 'refresh',
        tenant,
      },
      {
        secret: this.configService.get<string>('jwt.ref'),
        expiresIn: this.configService.get<string>('jwt.refreshExp'),
      },
    );
  }
  async generateAccessToken(id: string, tenant: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        ID: id,
        type: 'access',
        tenant,
      },
      {
        secret: this.configService.get<string>('jwt.sec'),
        expiresIn: this.configService.get<string>('jwt.accessExp'),
      },
    );
  }

  async generateAdminToken(id: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: id,
        type: 'admin',
      },
      {
        secret: this.configService.get<string>('jwt.admin'),
        expiresIn: this.configService.get<string>('jwt.adminExp'),
      },
    );
  }
}
