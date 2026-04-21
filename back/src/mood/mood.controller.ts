import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MoodService } from './mood.service';
import { CreateMoodDto } from './create-mood.dto';

// rotas de humor e energia
@Controller('humor')
export class MoodController {
  constructor(private readonly moodService: MoodService) { }

  // salva um registro de humor
  @Post()
  createMoodEntry(@Body() dto: CreateMoodDto) {
    return this.moodService.createMoodEntry(dto);
  }

  // retorna o resumo semanal com médias em %
  @Get('semanal')
  getWeeklySummary(@Query('userId') userId: string) {
    return this.moodService.getWeeklySummary(userId);
  }

  // retorna o historico completo
  @Get('historico')
  getHistory(@Query('userId') userId: string) {
    return this.moodService.getHistory(userId);
  }
}
