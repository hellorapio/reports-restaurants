import { TenantService } from './../../global/tenant/tenant.service';
import { DatabaseUtilityRepository } from './../../global/database-utility/database-utility.repository';
import { Injectable } from '@nestjs/common';
import { User } from 'src/types';

@Injectable()
export class UsersService extends DatabaseUtilityRepository {
  constructor(public readonly tenantService: TenantService) {
    super(tenantService);
  }
  async findByPhone(phone: string): Promise<User | undefined> {
    return await this.findOne('users', { Phone: phone });
  }
}
