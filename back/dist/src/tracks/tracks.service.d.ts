import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
export declare class TracksService {
    private readonly prisma;
    private readonly supabase;
    constructor(prisma: PrismaService, supabase: SupabaseService);
    private enrichWithPublicUrls;
    getMeditations(): Promise<{
        audioUrl: string;
        id: string;
        category: string;
    }[]>;
    getAmbientSounds(): Promise<{
        audioUrl: string;
        id: string;
        category: string;
    }[]>;
    getAllTracks(): Promise<{
        meditations: {
            audioUrl: string;
            id: string;
            category: string;
        }[];
        ambient: {
            audioUrl: string;
            id: string;
            category: string;
        }[];
    }>;
}
