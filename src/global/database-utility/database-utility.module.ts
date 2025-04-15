import { Global, Module } from '@nestjs/common';
import { DatabaseUtilityService } from './database-utility.service';

@Global()
@Module({
  providers: [DatabaseUtilityService],
  exports: [DatabaseUtilityService],
})
export class DatabaseUtilityModule {}
