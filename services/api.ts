import { AudioTrack } from '@/types/track';
import axios from 'axios';

const BASE_URL = 'https://api-tiredness-production.up.railway.app';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
});

export const getMeditations = async (): Promise<AudioTrack[]> =>{
    const { data } = await api.get<AudioTrack[]>('/tracks/meditations'); 
    return data;
};

export const getAmbientSounds = async (): Promise<AudioTrack[]> =>{
    const { data } = await api.get<AudioTrack[]>('/tracks/ambient');
    return data;
};

export const getAllTracks = async () => {
    const { data } = await api.get('/tracks')
    return data;
};

export default api;