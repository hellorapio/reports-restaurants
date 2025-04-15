import { TenantService } from '../tenant/tenant.service';

export class DatabaseUtilityRepository {
  constructor(public readonly tenantService: TenantService) {}
  async findAll<T>(
    tableName: string,
    conditions?: Record<string, string | number>,
    orderBy?: string,
    orderDirection: 'ASC' | 'DESC' = 'ASC',
    limit?: number,
    offset?: number,
  ): Promise<T[]> {
    const connection = await this.tenantService.getConnection();

    let queryBuilder = connection
      .createQueryBuilder()
      .select('*')
      .from(tableName, tableName);

    // Add WHERE conditions
    if (conditions && Object.keys(conditions).length > 0) {
      Object.keys(conditions).forEach((key, index) => {
        if (index === 0) {
          queryBuilder = queryBuilder.where(`${tableName}.${key} = :${key}`, {
            [key]: conditions[key],
          });
        } else {
          queryBuilder = queryBuilder.andWhere(
            `${tableName}.${key} = :${key}`,
            { [key]: conditions[key] },
          );
        }
      });
    }

    if (orderBy) {
      queryBuilder = queryBuilder.orderBy(
        `${tableName}.${orderBy}`,
        orderDirection,
      );
    }

    if (limit !== undefined) {
      queryBuilder = queryBuilder.take(limit);

      if (offset !== undefined) {
        queryBuilder = queryBuilder.skip(offset);
      }
    }

    const result = await queryBuilder.getRawMany();
    return result as T[];
  }

  async findOne<T>(
    tableName: string,
    conditions: Record<string, string | number>,
  ): Promise<T | undefined> {
    const connection = await this.tenantService.getConnection();

    let queryBuilder = connection
      .createQueryBuilder()
      .select('*')
      .from(tableName, tableName);

    Object.keys(conditions).forEach((key, index) => {
      if (index === 0) {
        queryBuilder = queryBuilder.where(`${tableName}.${key} = :${key}`, {
          [key]: conditions[key],
        });
      } else {
        queryBuilder = queryBuilder.andWhere(`${tableName}.${key} = :${key}`, {
          [key]: conditions[key],
        });
      }
    });

    queryBuilder = queryBuilder.take(1);

    const result = (await queryBuilder.getRawOne()) as T;
    return result;
  }

  async create<T>(tableName: string, data: Record<string, any>): Promise<T> {
    const connection = await this.tenantService.getConnection();

    const insertResult = await connection
      .createQueryBuilder()
      .insert()
      .into(tableName)
      .values(data)
      .execute();

    return insertResult as T;
  }

  async findById<T>(
    tableName: string,
    id: string | number,
  ): Promise<T | undefined> {
    const connection = await this.tenantService.getConnection();

    const result = (await connection
      .createQueryBuilder()
      .select('*')
      .from(tableName, tableName)
      .where(`${tableName}.ID = :id`, { id })
      .getRawOne()) as T;

    return result;
  }
}
