import { DataSource } from 'typeorm';
import { DatabaseUtilityService } from './../database-utility/database-utility.service';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  private tenantId: string;

  constructor(
    private readonly databaseUtilityService: DatabaseUtilityService,
  ) {}

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  getTenantId(): string {
    return this.tenantId;
  }

  async getConnection(): Promise<DataSource> {
    return await this.databaseUtilityService.getConnection(this.getTenantId());
  }
}
