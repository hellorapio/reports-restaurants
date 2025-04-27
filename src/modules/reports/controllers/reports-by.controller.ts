import { Controller } from '@nestjs/common';
import { ReportsSessionsService } from '../services/reports-sessions.service';

@Controller('reports')
export class ReportsByController {
  constructor(private reportsService: ReportsSessionsService) {}
}
