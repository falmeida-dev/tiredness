import { Module } from '@nestjs/common';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';

// módulo de registro de humor e energia
@Module({
  controllers: [MoodController],
  providers: [MoodService],
})
export class MoodModule {}
