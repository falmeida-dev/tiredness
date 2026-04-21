import { MoodService } from './mood.service';
import { CreateMoodDto } from './create-mood.dto';
export declare class MoodController {
    private readonly moodService;
    constructor(moodService: MoodService);
    createMoodEntry(dto: CreateMoodDto): Promise<{
        id: string;
        mood: number;
        emoji: string;
        energy: number;
        note: string | null;
        userId: string;
        createdAt: Date;
    }>;
    getWeeklySummary(userId: string): Promise<{
        averageMood: number;
        averageEnergy: number;
        energyChange: number;
        moodEmoji: string;
        dailyMood: {
            day: string;
            emoji: string;
            score: number;
        }[];
        dailyEnergy: {
            day: string;
            percent: number;
        }[];
        totalEntries: number;
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        mood: number;
        emoji: string;
        energy: number;
        note: string | null;
        userId: string;
        createdAt: Date;
    }[]>;
}
