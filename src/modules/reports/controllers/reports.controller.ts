import { res } from 'src/utils/utils';
import { Controller, Get, Query } from '@nestjs/common';
import User from 'src/decorators/User.decorator';
import { ReportsService } from '../services/reports.service';

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

  @Get('/bill')
  async getBillReport(
    @User('tenant') tenant: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const reports = await this.reportsService.getBillLogByDateRange(
      tenant,
      from,
      to,
    );

    return res(reports, 'Bill report retrieved successfully');
  }

  @Get('/bill-payment')
  async getBillPaymentReport(
    @User('tenant') tenant: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const reports = await this.reportsService.getBillPaymentLogByDateRange(
      tenant,
      from,
      to,
    );

    return res(reports, 'Bill Payment report retrieved successfully');
  }
}
