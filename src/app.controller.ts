import { DatabaseUtilityService } from './global/database-utility/database-utility.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import Public from './decorators/Public.decorator';

@Controller()
@Public()
export class AppController {
  constructor(
    private readonly databaseUtilityService: DatabaseUtilityService,
  ) {}

  @Get('')
  async getDatabase() {
    const connections = await this.databaseUtilityService.listAllDatabases();
    return {
      status: 'success',
      code: 200,
      message: 'connected',
      data: connections,
    };
  }

  @Get('health')
  health() {
    return { status: 'server is live' };
  }

  @Post('health')
  getBody(@Body() body: Record<string, any>) {
    return body;
  }
}
