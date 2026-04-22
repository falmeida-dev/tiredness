import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMoodDto } from './create-mood.dto';

// mapeamento dos dias da semana em pt-br
const DAYS_PT: Record<number, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};

// emoji padrão baseado no score médio
const SCORE_EMOJI: Record<number, string> = {
  0: '😞',
  1: '😟',
  2: '😐',
  3: '🙂',
  4: '😊',
};

// serviço de humor salva, calcula médias e retorna pro front
@Injectable()
export class MoodService {
  constructor(private readonly prisma: PrismaService) { }

  // salva o registro de humor no banco apenas 1 por dia por usuário
  async createMoodEntry(dto: CreateMoodDto) {
    // verifica se já existe registro hoje para esse usuário
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await this.prisma.moodEntry.findFirst({
      where: {
        userId: dto.userId,
        createdAt: { gte: today, lt: tomorrow },
      },
    });

    if (existing) {
      throw new ConflictException('Já existe um registro de humor para hoje.');
    }

    return this.prisma.moodEntry.create({
      data: {
        mood: dto.mood,
        emoji: dto.emoji,
        energy: dto.energy,
        note: dto.note ?? null,
        userId: dto.userId,
      },
    });
  }

  // retorna o resumo semanal com médias em porcentagem
  async getWeeklySummary(userId: string) {
    const now = new Date();

    // pega o início da semana atual (domingo)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // pega o início da semana passada pra comparar
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // busca registros da semana atual
    const currentEntries = await this.prisma.moodEntry.findMany({
      where: {
        userId,
        createdAt: { gte: startOfWeek },
      },
      orderBy: { createdAt: 'asc' },
    });

    // busca registros da semana passada (pra calcular a diferença)
    const lastWeekEntries = await this.prisma.moodEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfLastWeek,
          lt: startOfWeek,
        },
      },
    });

    // se não tem nenhum registro, retorna tudo zerado
    if (currentEntries.length === 0) {
      return {
        averageMood: 0,
        averageEnergy: 0,
        energyChange: 0,
        moodEmoji: '😐',
        dailyMood: [],
        dailyEnergy: [],
        totalEntries: 0,
      };
    }

    // calcula média de humor em porcentagem 
    const avgMoodScore =
      currentEntries.reduce((sum, e) => sum + e.mood, 0) /
      currentEntries.length;
    const averageMood = Math.round((avgMoodScore / 4) * 100);

    // calcula média de energia
    const averageEnergy = Math.round(
      currentEntries.reduce((sum, e) => sum + e.energy, 0) /
      currentEntries.length,
    );

    // calcula energia da semana passada pra comparar
    let energyChange = 0;
    if (lastWeekEntries.length > 0) {
      const lastAvgEnergy = Math.round(
        lastWeekEntries.reduce((sum, e) => sum + e.energy, 0) /
        lastWeekEntries.length,
      );
      energyChange = averageEnergy - lastAvgEnergy;
    }

    // emoji que representa a media de humor
    const roundedScore = Math.round(avgMoodScore);
    const moodEmoji = SCORE_EMOJI[roundedScore] ?? '😐';

    // agrupa por dia da semana pra montar os cards do relatório
    // pra cada dia, pega o último registro (se tiver mais de 1 no dia)
    const dailyMoodMap = new Map<number, { emoji: string; score: number }>();
    const dailyEnergyMap = new Map<number, number>();

    for (const entry of currentEntries) {
      const dayOfWeek = entry.createdAt.getDay();
      dailyMoodMap.set(dayOfWeek, { emoji: entry.emoji, score: entry.mood });
      dailyEnergyMap.set(dayOfWeek, entry.energy);
    }

    // monta array dos 7 dias 
    const dailyMood: { day: string; emoji: string; score: number }[] = [];
    const dailyEnergy: { day: string; percent: number }[] = [];

    for (let d = 0; d < 7; d++) {
      const dayLabel = DAYS_PT[d];
      const mood = dailyMoodMap.get(d);
      const energy = dailyEnergyMap.get(d);

      if (mood) {
        dailyMood.push({ day: dayLabel, emoji: mood.emoji, score: mood.score });
      } else {
        dailyMood.push({ day: dayLabel, emoji: '–', score: -1 });
      }

      if (energy !== undefined) {
        dailyEnergy.push({ day: dayLabel, percent: energy });
      } else {
        dailyEnergy.push({ day: dayLabel, percent: 0 });
      }
    }

    return {
      averageMood,
      averageEnergy,
      energyChange,
      moodEmoji,
      dailyMood,
      dailyEnergy,
      totalEntries: currentEntries.length,
    };
  }

  // retorna todo o historico do usuario (se quiser no futuro)
  async getHistory(userId: string) {
    return this.prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
