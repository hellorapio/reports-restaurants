import { DatabaseUtilityService } from './../../global/database-utility/database-utility.service';
import { DatabaseUtilityRepository } from './../../global/database-utility/database-utility.repository';
import { Injectable } from '@nestjs/common';
import { User } from 'src/types';

@Injectable()
export class UsersService extends DatabaseUtilityRepository {
  constructor(public readonly databaseUtilityService: DatabaseUtilityService) {
    super(databaseUtilityService);
  }
  async findByPhone(tenant: string, phone: string): Promise<User | undefined> {
    return await this.findOne(tenant, 'users', {
      filters: [{ field: 'Phone', operator: 'equals', value: phone }],
    });
  }
}
