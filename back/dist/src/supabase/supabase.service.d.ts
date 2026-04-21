import { ConfigService } from '@nestjs/config';
export declare class SupabaseService {
    private config;
    private client;
    constructor(config: ConfigService);
    getPublicUrl(bucket: string, filePath: string): string;
}
