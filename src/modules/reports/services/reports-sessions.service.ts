import { DatabaseUtilityService } from 'src/global/database-utility/database-utility.service';
import { DatabaseUtilityRepository } from '../../../global/database-utility/database-utility.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsSessionsService extends DatabaseUtilityRepository {
  constructor(public readonly databaseUtilityService: DatabaseUtilityService) {
    super(databaseUtilityService);
  }

  async getSessionsReport<T>(
    tenant: string,
    startDate: string | Date,
  ): Promise<T[]> {
    return await this.findAll<T>(tenant, 'vSession', {
      columns: [
        'CashDrawerA',
        'StartDate',
        'EndDate',
        'UserNameA',
        'StartAmount',
        'EndAmount',
        'CashSaleTotal',
      ],
      dateRanges: [
        {
          dateField: 'StartDate',
          startDate,
          endDate: new Date(),
          useConvert: true,
        },
      ],
    });
  }

  async getSessionsDeficitReport<T>(
    tenant: string,
    startDate: string | Date,
  ): Promise<T[]> {
    return await this.findAll<T>(tenant, 'vSession', {
      columns: [
        'CashDrawerA',
        'StartDate',
        'EndDate',
        'UserNameA',
        'CashDeficit',
      ],
      filters: [
        {
          field: 'CashDeficit',
          operator: 'greaterThan',
          value: '0',
        },
      ],
      dateRanges: [
        {
          dateField: 'StartDate',
          startDate,
          hasFilter: true,
          endDate: new Date(),
          useConvert: true,
        },
      ],
    });
  }
}
