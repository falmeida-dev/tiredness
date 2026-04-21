import { TracksService } from './tracks.service';
export declare class TracksController {
    private readonly tracksService;
    constructor(tracksService: TracksService);
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
