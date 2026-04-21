// tipos para o registro de humor e relatórios

export interface MoodEntry {
  id: string;
  mood: number;       // 0-4 (índice do emoji)
  emoji: string;      // emoji selecionado
  energy: number;     // 0-100
  note?: string;      // anotação do dia
  userId: string;     // Clerk user ID
  createdAt: string;  // ISO date string
}

export interface DailyMood {
  day: string;        // "Seg", "Ter", etc.
  emoji: string;      // emoji do dia ou "–"
  score: number;      // 0-4 ou -1 se não registrou
}

export interface DailyEnergy {
  day: string;        // "Seg", "Ter", etc.
  percent: number;    // 0-100
}

export interface WeeklySummary {
  averageMood: number;     // 0-100 (porcentagem)
  averageEnergy: number;   // 0-100 (porcentagem)
  energyChange: number;    // diferença vs semana anterior
  moodEmoji: string;       // emoji da média
  dailyMood: DailyMood[];
  dailyEnergy: DailyEnergy[];
  totalEntries: number;
}
