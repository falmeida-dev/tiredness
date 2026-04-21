import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

// módulo de faixas de áudio
@Module({
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule { }
