import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

// Módulo global do Supabase — disponível em toda a aplicação
@Global()
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
