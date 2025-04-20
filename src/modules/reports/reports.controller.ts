import { res } from 'src/utils/utils';
import { ReportsService } from './reports.service';
import { Controller, Get, Query } from '@nestjs/common';
import User from 'src/decorators/User.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('/bill-vat')
  async getBillVatReport(
    @User('tenant') tenant: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const reports = await this.reportsService.getBillVatLogByDateRange(
      tenant,
      from,
      to,
    );

    return res(reports, 'Bill VAT report retrieved successfully');
  }
}
