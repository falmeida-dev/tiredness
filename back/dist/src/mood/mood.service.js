"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoodService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const DAYS_PT = {
    0: 'Dom',
    1: 'Seg',
    2: 'Ter',
    3: 'Qua',
    4: 'Qui',
    5: 'Sex',
    6: 'Sáb',
};
const SCORE_EMOJI = {
    0: '😞',
    1: '😟',
    2: '😐',
    3: '🙂',
    4: '😊',
};
let MoodService = class MoodService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMoodEntry(dto) {
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
    async getWeeklySummary(userId) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const currentEntries = await this.prisma.moodEntry.findMany({
            where: {
                userId,
                createdAt: { gte: startOfWeek },
            },
            orderBy: { createdAt: 'asc' },
        });
        const lastWeekEntries = await this.prisma.moodEntry.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startOfLastWeek,
                    lt: startOfWeek,
                },
            },
        });
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
        const avgMoodScore = currentEntries.reduce((sum, e) => sum + e.mood, 0) /
            currentEntries.length;
        const averageMood = Math.round((avgMoodScore / 4) * 100);
        const averageEnergy = Math.round(currentEntries.reduce((sum, e) => sum + e.energy, 0) /
            currentEntries.length);
        let energyChange = 0;
        if (lastWeekEntries.length > 0) {
            const lastAvgEnergy = Math.round(lastWeekEntries.reduce((sum, e) => sum + e.energy, 0) /
                lastWeekEntries.length);
            energyChange = averageEnergy - lastAvgEnergy;
        }
        const roundedScore = Math.round(avgMoodScore);
        const moodEmoji = SCORE_EMOJI[roundedScore] ?? '😐';
        const dailyMoodMap = new Map();
        const dailyEnergyMap = new Map();
        for (const entry of currentEntries) {
            const dayOfWeek = entry.createdAt.getDay();
            dailyMoodMap.set(dayOfWeek, { emoji: entry.emoji, score: entry.mood });
            dailyEnergyMap.set(dayOfWeek, entry.energy);
        }
        const dailyMood = [];
        const dailyEnergy = [];
        for (let d = 0; d < 7; d++) {
            const dayLabel = DAYS_PT[d];
            const mood = dailyMoodMap.get(d);
            const energy = dailyEnergyMap.get(d);
            if (mood) {
                dailyMood.push({ day: dayLabel, emoji: mood.emoji, score: mood.score });
            }
            else {
                dailyMood.push({ day: dayLabel, emoji: '–', score: -1 });
            }
            if (energy !== undefined) {
                dailyEnergy.push({ day: dayLabel, percent: energy });
            }
            else {
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
    async getHistory(userId) {
        return this.prisma.moodEntry.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.MoodService = MoodService;
exports.MoodService = MoodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MoodService);
//# sourceMappingURL=mood.service.js.map