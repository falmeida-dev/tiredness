import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // se isso aparecer na tela, o deploy funcionou amem
    return 'API do tiredness rodando liso! 🚀';
  }
}
