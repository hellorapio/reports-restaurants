import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { User } from 'src/types';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
  ID: string;
  tenant: string;
  type: 'refresh' | 'access';
};
@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.sec')!,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access')
      throw new UnauthorizedException('Invalid token type');
    const user = await this.usersService.findById<User>(
      payload.tenant,
      'users',
      payload.ID,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.tenant = payload.tenant;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Password, ...result } = user;

    return result;
  }
}
