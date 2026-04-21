import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [
    // puxando os .env
    ConfigModule.forRoot({ isGlobal: true }),
    // conexao do banco
    PrismaModule,
    // storage das tracks
    SupabaseModule,
    // as rotas de audio
    TracksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
