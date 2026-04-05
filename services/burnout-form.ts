import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    BURNOUT_SCORE: '@tiredness:burnout_score',
    BURNOUT_LEVEL: '@tiredness:burnout_level',
    QUIZ_COMPLETED: '@tiredness:quiz_completed',
};

export async function saveBurnoutData(score: number) {
    let level = 'baixo';
    if (score >= 7 && score <=12) level = 'médio';
    if (score >= 13) level = 'alto';
    
    try {
        await AsyncStorage.setItem(KEYS.BURNOUT_SCORE, String(score));
        await AsyncStorage.setItem(KEYS.BURNOUT_LEVEL, level);
        await AsyncStorage.setItem(KEYS.QUIZ_COMPLETED, 'true');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

export async function getBurnoutResults() {
    const completo = await AsyncStorage.getItem(KEYS.QUIZ_COMPLETED);
    // se o quiz não foi respondido, retorna null
    if (!completo) return null;

    const score = await AsyncStorage.getItem(KEYS.BURNOUT_SCORE);
    const level = await AsyncStorage.getItem(KEYS.BURNOUT_LEVEL);

    return {
        score: score ? Number(score) : null,
        level: level || null,
    };

}

export async function completedQuiz() {
    const value = await AsyncStorage.getItem(KEYS.QUIZ_COMPLETED);
    return value === 'true';
}

// limpa os dados do quiz
export async function clearBurnoutData() {
    await AsyncStorage.multiRemove([
        KEYS.BURNOUT_SCORE,
        KEYS.BURNOUT_LEVEL,
        KEYS.QUIZ_COMPLETED,
    ]);
}