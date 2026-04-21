"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new client_1.PrismaClient({ adapter });
const tracks = [
    {
        title: 'Foco Profundo',
        category: 'MEDITATION',
        duration: 154,
        audioUrl: 'lofi-01.mp3',
    },
    {
        title: 'Respiro Calmo',
        category: 'MEDITATION',
        duration: 179,
        audioUrl: 'lofi-02.mp3',
    },
    {
        title: 'Noite Serena',
        category: 'MEDITATION',
        duration: 57,
        audioUrl: 'lofi-03.mp3',
    },
    {
        title: 'Foco Zen',
        category: 'MEDITATION',
        duration: 59,
        audioUrl: 'lofi-04.mp3',
    },
    {
        title: 'Chuva',
        category: 'AMBIENT',
        duration: 417,
        audioUrl: 'rain-sound.mp3',
    },
    {
        title: 'Rio',
        category: 'AMBIENT',
        duration: 12,
        audioUrl: 'river-sound.mp3',
    },
    {
        title: 'Pássaros',
        category: 'AMBIENT',
        duration: 626,
        audioUrl: 'birds.mp3',
    },
];
async function main() {
    console.log('🌱 Iniciando seed das faixas de áudio...');
    await prisma.audioTrack.deleteMany();
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
//# sourceMappingURL=seed.js.map