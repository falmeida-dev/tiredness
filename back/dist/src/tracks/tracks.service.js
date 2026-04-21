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
exports.TracksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_service_1 = require("../supabase/supabase.service");
const CATEGORY_BUCKET_MAP = {
    MEDITATION: 'music',
    AMBIENT: 'sound-ambience',
};
let TracksService = class TracksService {
    prisma;
    supabase;
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    enrichWithPublicUrls(tracks) {
        if (tracks.length === 0)
            return [];
        return tracks.map((track) => {
            const bucket = CATEGORY_BUCKET_MAP[track.category] ?? 'music';
            return {
                ...track,
                audioUrl: this.supabase.getPublicUrl(bucket, track.audioUrl),
            };
        });
    }
    async getMeditations() {
        const tracks = await this.prisma.audioTrack.findMany({
            where: { category: 'MEDITATION' },
        });
        return this.enrichWithPublicUrls(tracks);
    }
    async getAmbientSounds() {
        const tracks = await this.prisma.audioTrack.findMany({
            where: { category: 'AMBIENT' },
        });
        return this.enrichWithPublicUrls(tracks);
    }
    async getAllTracks() {
        const [meditations, ambient] = await Promise.all([
            this.getMeditations(),
            this.getAmbientSounds(),
        ]);
        return { meditations, ambient };
    }
};
exports.TracksService = TracksService;
exports.TracksService = TracksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], TracksService);
//# sourceMappingURL=tracks.service.js.map