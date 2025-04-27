import { Module } from '@nestjs/common';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';
import { ReportsSessionsService } from './services/reports-sessions.service';
import { ReportsSessionsController } from './controllers/reports-sessions.controller';

@Module({
  providers: [ReportsService, ReportsSessionsService],
  controllers: [ReportsController, ReportsSessionsController],
})
export class ReportsModule {}
