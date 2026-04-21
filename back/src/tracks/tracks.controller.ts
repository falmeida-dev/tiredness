import { Controller, Get } from '@nestjs/common';
import { TracksService } from './tracks.service';

// rotinhas de audio pra tela de meditar
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  // pega so as meditacoes
  @Get('meditations')
  getMeditations() {
    return this.tracksService.getMeditations();
  }

  // pega so as chuvas e fogueiras
  @Get('ambient')
  getAmbientSounds() {
    return this.tracksService.getAmbientSounds();
  }

  // manda bala e retorna tudo de uma vez
  @Get()
  getAllTracks() {
    return this.tracksService.getAllTracks();
  }
}
