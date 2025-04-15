import { Module } from '@nestjs/common';
import { ConfigModule } from './global/config/config.module';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseUtilityModule } from './global/database-utility/database-utility.module';
import { UsersModule } from './modules/users/users.module';
import { TenantModule } from './global/tenant/tenant.module';
import JwtGuard from './guards/jwt.guard';
import { JwtModule } from './global/jwt/jwt.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    DatabaseUtilityModule,
    UsersModule,
    TenantModule,
    JwtModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
