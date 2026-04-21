export interface AudioTrack {
    id: string;
    title: string;
    category: 'MEDITATION' | 'AMBIENT';
    duration: number;
    audioUrl: string;
};

export interface TrackResponse{
    meditations: AudioTrack[];
    ambient: AudioTrack[];
}