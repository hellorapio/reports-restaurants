//@ts-nocheck
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // In production, use environment variables
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    const { password, ...result } = user;
    return result;
  }
}
