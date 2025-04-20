import { DatabaseUtilityService } from './database-utility.service';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'like'
  | 'ilike'
  | 'between'
  | 'in'
  | 'isNull'
  | 'isNotNull'
  | 'raw';

interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
  valueEnd?: any;
}

interface DateRangeFilter {
  dateField: string;
  startDate: string | Date;
  endDate: string | Date;
  useConvert?: boolean;
  dateFormat?: string;
}

interface SortOptions {
  field: string;
  direction: 'ASC' | 'DESC';
}

interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export class DatabaseUtilityRepository {
  constructor(public readonly databaseUtilityService: DatabaseUtilityService) {}
  async findById<T>(
    tenant: string,
    tableName: string,
    id: string | number,
    idField: string = 'id',
    columns?: string[],
  ): Promise<T | undefined> {
    const connection = await this.databaseUtilityService.getConnection(tenant);

    const queryBuilder = connection
      .createQueryBuilder()
      .select(columns ? columns.join(', ') : '*')
      .from(tableName, tableName)
      .where(`${tableName}.${idField} = :id`, { id })
      .limit(1);

    const result = (await queryBuilder.getRawOne()) as T | undefined;
    return result;
  }

  async findAll<T>(
    tenant: string,
    tableName: string,
    options: {
      columns?: string[];
      filters?: FilterCondition[];
      dateRanges?: DateRangeFilter[];
      sort?: SortOptions[];
      pagination?: PaginationOptions;
      groupBy?: string[];
      having?: FilterCondition[];
    } = {},
  ): Promise<T[]> {
    const connection = await this.databaseUtilityService.getConnection(tenant);

    let queryBuilder = connection
      .createQueryBuilder()
      .select(options.columns ? options.columns.join(', ') : '*')
      .from(tableName, tableName);

    if (options.filters?.length) {
      queryBuilder = this.applyFilters(
        queryBuilder,
        tableName,
        options.filters,
      );
    }

    if (options.dateRanges?.length) {
      queryBuilder = this.applyDateRanges(
        queryBuilder,
        tableName,
        options.dateRanges,
      );
    }

    if (options.sort?.length) {
      options.sort.forEach((sort) => {
        queryBuilder = queryBuilder.addOrderBy(
          `${tableName}.${sort.field}`,
          sort.direction,
        );
      });
    }

    if (options.groupBy?.length) {
      options.groupBy.forEach((field) => {
        queryBuilder = queryBuilder.addGroupBy(`${tableName}.${field}`);
      });
    }

    if (options.having?.length) {
      queryBuilder = this.applyFilters(
        queryBuilder,
        tableName,
        options.having,
        true,
      );
    }

    if (options.pagination) {
      if (options.pagination.limit !== undefined) {
        queryBuilder = queryBuilder.take(options.pagination.limit);
      }
      if (options.pagination.offset !== undefined) {
        queryBuilder = queryBuilder.skip(options.pagination.offset);
      }
    }

    const result = await queryBuilder.getRawMany();
    return result as T[];
  }

  async findOne<T>(
    tenant: string,
    tableName: string,
    options: {
      columns?: string[];
      filters?: FilterCondition[];
      dateRanges?: DateRangeFilter[];
      sort?: SortOptions[];
    } = {},
  ): Promise<T | undefined> {
    const results = await this.findAll<T>(tenant, tableName, {
      ...options,
      pagination: { limit: 1 },
    });

    return results.length > 0 ? results[0] : undefined;
  }

  async create<T>(
    tenant: string,
    tableName: string,
    data: Record<string, any>,
  ): Promise<T> {
    const connection = await this.databaseUtilityService.getConnection(tenant);
    const insertResult = await connection
      .createQueryBuilder()
      .insert()
      .into(tableName)
      .values(data)
      .execute();

    return insertResult as T;
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<ObjectLiteral>,
    tableName: string,
    filters: FilterCondition[],
    isHaving: boolean = false,
  ): SelectQueryBuilder<ObjectLiteral> {
    filters.forEach((filter, index) => {
      const paramName = `${filter.field}_${index}`;
      let condition: string;

      switch (filter.operator) {
        case 'equals':
          condition = `${tableName}.${filter.field} = :${paramName}`;
          break;
        case 'notEquals':
          condition = `${tableName}.${filter.field} != :${paramName}`;
          break;
        case 'greaterThan':
          condition = `${tableName}.${filter.field} > :${paramName}`;
          break;
        case 'lessThan':
          condition = `${tableName}.${filter.field} < :${paramName}`;
          break;
        case 'greaterThanOrEqual':
          condition = `${tableName}.${filter.field} >= :${paramName}`;
          break;
        case 'lessThanOrEqual':
          condition = `${tableName}.${filter.field} <= :${paramName}`;
          break;
        case 'like':
          condition = `${tableName}.${filter.field} LIKE :${paramName}`;
          break;
        case 'ilike':
          condition = `${tableName}.${filter.field} ILIKE :${paramName}`;
          break;
        case 'between':
          condition = `${tableName}.${filter.field} BETWEEN :${paramName} AND :${paramName}_end`;
          queryBuilder = queryBuilder.setParameter(
            `${paramName}_end`,
            filter.valueEnd,
          );
          break;
        case 'in':
          condition = `${tableName}.${filter.field} IN (:...${paramName})`;
          break;
        case 'isNull':
          condition = `${tableName}.${filter.field} IS NULL`;
          break;
        case 'isNotNull':
          condition = `${tableName}.${filter.field} IS NOT NULL`;
          break;
        default:
          condition = `${tableName}.${filter.field} = :${paramName}`;
      }

      if (!['isNull', 'isNotNull', 'raw'].includes(filter.operator)) {
        queryBuilder = queryBuilder.setParameter(paramName, filter.value);
      }

      if (index === 0) {
        if (isHaving) {
          queryBuilder = queryBuilder.having(condition);
        } else {
          queryBuilder = queryBuilder.where(condition);
        }
      } else {
        if (isHaving) {
          queryBuilder = queryBuilder.andHaving(condition);
        } else {
          queryBuilder = queryBuilder.andWhere(condition);
        }
      }
    });

    return queryBuilder;
  }

  private applyDateRanges(
    queryBuilder: SelectQueryBuilder<ObjectLiteral>,
    tableName: string,
    dateRanges: DateRangeFilter[],
  ): SelectQueryBuilder<ObjectLiteral> {
    // Extract table alias from the full table name (e.g., "dbo.BillVatLog" -> "BillVatLog")
    const tableAlias = tableName.includes('.')
      ? tableName.split('.').pop()
      : tableName;

    dateRanges.forEach((dateRange, index) => {
      const startParamName = `start_date_${index}`;
      const endParamName = `end_date_${index}`;
      let condition: string;

      if (dateRange.useConvert) {
        const dateFormat = dateRange.dateFormat || 'date';
        condition = `CONVERT(${dateFormat}, ${tableAlias}.${dateRange.dateField}) BETWEEN :${startParamName} AND :${endParamName}`;
      } else {
        condition = `${tableAlias}.${dateRange.dateField} BETWEEN :${startParamName} AND :${endParamName}`;
      }

      queryBuilder = queryBuilder
        .setParameter(startParamName, dateRange.startDate)
        .setParameter(endParamName, dateRange.endDate);

      queryBuilder =
        index === 0
          ? queryBuilder.where(condition)
          : queryBuilder.andWhere(condition);
    });

    return queryBuilder;
  }

  async executeRawQuery<T>(
    tenant: string,
    query: string,
    parameters: any[] = [],
  ): Promise<T[]> {
    const connection = await this.databaseUtilityService.getConnection(tenant);
    const result = (await connection.query(query, parameters)) as T;
    return result as T[];
  }
}
