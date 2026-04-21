import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// conecta no supabase pra pegar os links dos audios
@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
    this.client = createClient(
      this.config.get<string>('SUPABASE_URL')!,
      this.config.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  // pega a url publica do arquivo (rapidao)
  getPublicUrl(bucket: string, filePath: string): string {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}
