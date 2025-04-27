import { DatabaseUtilityService } from 'src/global/database-utility/database-utility.service';
import { DatabaseUtilityRepository } from '../../../global/database-utility/database-utility.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsByService extends DatabaseUtilityRepository {
  constructor(public readonly databaseUtilityService: DatabaseUtilityService) {
    super(databaseUtilityService);
  }
}
