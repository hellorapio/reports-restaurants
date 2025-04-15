import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseUtilityService {
  connections: Map<string, DataSource> = new Map<string, DataSource>();

  constructor(private readonly configService: ConfigService) {}

  private async getAdminConnection(): Promise<DataSource> {
    return await this.getConnection('master');
  }

  async getConnection(database: string): Promise<DataSource> {
    if (this.connections.has(database))
      if (this.connections.get(database)?.isInitialized)
        return this.connections.get(database) as DataSource;

    const dataSource = await new DataSource({
      name: database,
      type: 'mssql',
      host: this.configService.get<string>('db.host'),
      port: parseInt(this.configService.get<string>('db.port') || '1433', 10),
      username: this.configService.get<string>('db.user'),
      password: this.configService.get<string>('db.pass'),
      database,
      synchronize: false,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }).initialize();

    this.connections.set(database, dataSource);

    return dataSource;
  }

  async listAllDatabases(): Promise<string[]> {
    const connection = await this.getAdminConnection();

    let databases: string[] = [];
    const mssqlResult: Record<string, string>[] = await connection.query(
      "SELECT name FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb');",
    );
    databases = mssqlResult.map((row) => row.name);
    return databases;
  }
}
