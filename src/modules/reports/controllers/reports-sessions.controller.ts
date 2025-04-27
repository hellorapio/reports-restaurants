import { res } from 'src/utils/utils';
import { Controller, Get, Query } from '@nestjs/common';
import User from 'src/decorators/User.decorator';
import { ReportsSessionsService } from '../services/reports-sessions.service';

@Controller('reports')
export class ReportsSessionsController {
  constructor(private reportsService: ReportsSessionsService) {}

  @Get('/sessions')
  async getBillVatReport(
    @User('tenant') tenant: string,
    @Query('from') from: string,
  ) {
    const reports = await this.reportsService.getSessionsReport(tenant, from);

    return res(reports, 'Sessions report retrieved successfully');
  }

  @Get('/sessions-deficit')
  async getBillReport(
    @User('tenant') tenant: string,
    @Query('from') from: string,
  ) {
    const reports = await this.reportsService.getSessionsDeficitReport(
      tenant,
      from,
    );

    return res(reports, 'Sessions Deficit report retrieved successfully');
  }
}
