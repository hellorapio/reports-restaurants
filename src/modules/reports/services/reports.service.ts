import { DatabaseUtilityService } from 'src/global/database-utility/database-utility.service';
import { DatabaseUtilityRepository } from '../../../global/database-utility/database-utility.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService extends DatabaseUtilityRepository {
  constructor(public readonly databaseUtilityService: DatabaseUtilityService) {
    super(databaseUtilityService);
  }
  async getBillVatLogByDateRange<T>(
    tenant: string,
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<T[]> {
    return await this.findAll<T>(tenant, 'BillVatLog', {
      columns: [
        'AutoSeq',
        'Seq',
        'ObjectDateTime',
        'TaxedTotalAmount',
        'TaxAmount',
        'TotalAmount',
        'SyncState',
        'StatusCode',
      ],
      dateRanges: [
        {
          dateField: 'AutoDateTime',
          startDate,
          endDate,
          useConvert: true,
        },
      ],
      sort: [{ field: 'AutoSeq', direction: 'ASC' }],
    });
  }

  async getBillLogByDateRange<T>(
    tenant: string,
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<T[]> {
    return await this.findAll<T>(tenant, 'vBill', {
      columns: [
        'Num',
        'Btime',
        'PosTablenameA',
        'DiscValue',
        'TotalValue',
        'AgentNameA',
        'Phone1',
        'PosTypeNameA',
        'Reference',
        'RegisteVat',
      ],
      dateRanges: [
        {
          dateField: 'Bdate',
          startDate,
          endDate,
          useConvert: true,
        },
      ],
    });
  }

  async getBillPaymentLogByDateRange<T>(
    tenant: string,
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<T[]> {
    return await this.findAll<T>(tenant, 'vBillPayment', {
      columns: ['NameA', 'sum(Amount) as Amount'],
      dateRanges: [
        {
          dateField: 'Bdate',
          startDate,
          endDate,
          useConvert: true,
        },
      ],
      groupBy: ['NameA'],
    });
  }
}
