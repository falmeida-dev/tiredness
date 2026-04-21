import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Usa conexão direta (porta 5432) — necessário para seeds e migrations
// O pgBouncer (6543) não é compatível com operações de schema
const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// ============================================================
// SEED: Insere as faixas de áudio no banco de dados
// ============================================================
// Armazenamos apenas o NOME DO ARQUIVO (com extensão) no campo audioUrl.
// A API gera a URL pública completa no momento da requisição.
//
// Buckets no Supabase Storage (ambos públicos):
//   - "music"          → Meditações / músicas lofi
//   - "sound-ambience" → Sons ambientes (chuva, rio, pássaros, etc.)
//
// IMPORTANTE: O campo audioUrl DEVE corresponder EXATAMENTE ao
// nome do arquivo no bucket do Supabase Storage (incluindo extensão).
//
// ── COMO ADICIONAR NOVAS MÚSICAS ──────────────────────────────
// 1. Faça upload do arquivo no Supabase Storage:
//    - Meditações/lofi → bucket "music"
//    - Sons ambientes  → bucket "sound-ambience"
// 2. Adicione um novo objeto no array 'tracks' abaixo:
//    {
//      title: 'Nome da Música',        // título exibido no app
//      category: 'MEDITATION',          // ou 'AMBIENT'
//      duration: 180,                   // duração aproximada em segundos
//      audioUrl: 'nome-do-arquivo.mp3', // EXATAMENTE como está no bucket
//    }
// 3. Execute o seed: npx prisma db seed
// ============================================================

const tracks = [
  // ─── Meditações / Lofi (bucket: music) ─────────────────────
  {
    title: 'Foco Profundo',
    category: 'MEDITATION',
    duration: 154, // lofi-01.mp3 ≈ 3.7MB ÷ 192kbps ≈ 2m34s
    audioUrl: 'lofi-01.mp3',
  },
  {
    title: 'Respiro Calmo',
    category: 'MEDITATION',
    duration: 179, // lofi-02.mp3 ≈ 4.3MB ÷ 192kbps ≈ 2m59s
    audioUrl: 'lofi-02.mp3',
  },
  {
    title: 'Noite Serena',
    category: 'MEDITATION',
    duration: 57, // lofi-03.mp3 ≈ 1.38MB ÷ 192kbps ≈ 57s
    audioUrl: 'lofi-03.mp3',
  },
  {
    title: 'Foco Zen',
    category: 'MEDITATION',
    duration: 59, // lofi-04.mp3 ≈ 1.43MB ÷ 192kbps ≈ 59s
    audioUrl: 'lofi-04.mp3',
  },

  // ─── Sons Ambientes (bucket: sound-ambience) ──────────────
  {
    title: 'Chuva',
    category: 'AMBIENT',
    duration: 417, // rain-sound.mp3 ≈ 3.84MB ÷ 128kbps ≈ 4m
    audioUrl: 'rain-sound.mp3',
  },
  {
    title: 'Rio',
    category: 'AMBIENT',
    duration: 12, // river-sound.mp3 ≈ 204KB — bem curto
    audioUrl: 'river-sound.mp3',
  },
  {
    title: 'Pássaros',
    category: 'AMBIENT',
    duration: 626, // birds.mp3 ≈ 10MB ÷ 128kbps ≈ 10m
    audioUrl: 'birds.mp3',
  },
];

async function main() {
  console.log('🌱 Iniciando seed das faixas de áudio...');

  // Limpa registros anteriores para seed idempotente
  await prisma.audioTrack.deleteMany();

  // Insere todas as faixas
  await prisma.audioTrack.createMany({ data: tracks });

  const count = await prisma.audioTrack.count();
  console.log(`✅ Seed concluído! ${count} faixas inseridas no banco.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
