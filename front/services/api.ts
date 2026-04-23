import { AudioTrack } from '@/types/track';
import { MoodEntry, WeeklySummary } from '@/types/mood';
import axios from 'axios';

const BASE_URL = 'https://tired-ness.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
});

export const getMeditations = async (): Promise<AudioTrack[]> => {
    const { data } = await api.get<AudioTrack[]>('/api/tracks/meditations');
    return data;
};

export const getAmbientSounds = async (): Promise<AudioTrack[]> => {
    const { data } = await api.get<AudioTrack[]>('/api/tracks/ambient');
    return data;
};



// salva um registro de humor no banco
export const createMoodEntry = async (payload: {
    mood: number;
    emoji: string;
    energy: number;
    note?: string;
    userId: string;
}): Promise<MoodEntry> => {
    const { data } = await api.post<MoodEntry>('/api/humor', payload);
    return data;
};

// busca o resumo semanal com médias em porcentagem
export const getWeeklySummary = async (userId: string): Promise<WeeklySummary> => {
    const { data } = await api.get<WeeklySummary>(`/api/humor/semanal?userId=${userId}`);
    return data;
};

export default api;