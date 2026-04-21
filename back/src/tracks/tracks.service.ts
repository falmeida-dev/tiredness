import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

// mapeia qual categoria vai pra qual bucket do supabase pra nao dar ruim
const CATEGORY_BUCKET_MAP: Record<string, string> = {
  MEDITATION: 'music',
  AMBIENT: 'sound-ambience',
};

// servico pra pegar as faixas no banco e botar a url do audio nelas
@Injectable()
export class TracksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  // coloca url publica nas tracks (gambiarrazinha pra facilitar pro front)
  private enrichWithPublicUrls(
    tracks: {
      id: string;
      category: string;
      audioUrl: string;
      [key: string]: unknown;
    }[],
  ) {
    if (tracks.length === 0) return [];

    return tracks.map((track) => {
      // se a categoria nao existir poe music msm
      const bucket = CATEGORY_BUCKET_MAP[track.category] ?? 'music';
      return {
        ...track,
        // sobrescreve o nome do arquivo com a url inteira
        audioUrl: this.supabase.getPublicUrl(bucket, track.audioUrl),
      };
    });
  }

  // pega das meditacoes
  async getMeditations() {
    const tracks = await this.prisma.audioTrack.findMany({
      where: { category: 'MEDITATION' },
    });
    return this.enrichWithPublicUrls(tracks);
  }

  // pega os sons de fundo/ambiente
  async getAmbientSounds() {
    const tracks = await this.prisma.audioTrack.findMany({
      where: { category: 'AMBIENT' },
    });
    return this.enrichWithPublicUrls(tracks);
  }

  // junta os dois e retorna no msm json
  async getAllTracks() {
    const [meditations, ambient] = await Promise.all([
      this.getMeditations(),
      this.getAmbientSounds(),
    ]);
    return { meditations, ambient };
  }
}
