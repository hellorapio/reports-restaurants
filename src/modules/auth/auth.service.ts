import { TenantService } from 'src/global/tenant/tenant.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { encryptString } from 'src/utils/utils';
import LoginDto from './dtos/login.dto';
import { User } from 'src/types';
import { JwtService } from 'src/global/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tenantService: TenantService,
  ) {}

  async validateUser(phone: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByPhone(phone);

    if (!user) {
      return null;
    }

    const isPasswordValid = encryptString(password) === user.Password;

    if (isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(dto: LoginDto) {
    this.tenantService.setTenantId(dto.tenant);
    const user = await this.validateUser(dto.phone, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const payload = { sub: user.ID, tenant: dto.tenant };

    return {
      access_token: await this.jwtService.generateAccessToken(
        user.ID,
        dto.tenant,
      ),
      refresh_token: await this.jwtService.generateRefreshToken(
        user.ID,
        dto.tenant,
      ),
      user,
    };
  }
}
