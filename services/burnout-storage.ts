import AsyncStorage from '@react-native-async-storage/async-storage';

const BURNOUT_RESULT_KEY = '@burnout_result';
const QUIZ_COMPLETED_KEY = '@quiz_completed';

export type BurnoutLevel = 'baixo' | 'médio' | 'severo';

export interface BurnoutResult {
  score: number;
  level: BurnoutLevel;
  date: string;
}

//  salva o resultado do quiz de burnout no armazenamento local, incluindo a pontuação, o nível e a data
export const saveBurnoutResult = async (score: number): Promise<void> => {
  let level: BurnoutLevel = 'baixo';

  if (score >= 13) {
    level = 'severo';
  } else if (score >= 7) {
    level = 'médio';
  }

  const result: BurnoutResult = {
    score,
    level,
    date: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem(BURNOUT_RESULT_KEY, JSON.stringify(result));
    await AsyncStorage.setItem(QUIZ_COMPLETED_KEY, 'true');
  } catch (error) {
    console.error('Erro ao salvar o resultado do burnout:', error);
  }
};

//  recupera o resultado do quiz de burnout do armazenamento local, retornando a pontuação, o nível e a data, ou null se não houver resultado salvo
export const getBurnoutResult = async (): Promise<BurnoutResult | null> => {
  try {
    const data = await AsyncStorage.getItem(BURNOUT_RESULT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao recuperar o resultado do burnout:', error);
    return null;
  }
};

//  checa se o quiz de burnout já foi concluído 
export const hasCompletedQuiz = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(QUIZ_COMPLETED_KEY);
    return completed === 'true';
  } catch (error) {
    console.error('Erro ao verificar o status do quiz:', error);
    return false;
  }
};

//  limpa o resultado do quiz de burnout e o status de conclusão do quiz do armazenamento local, permitindo que o usuário refaça o quiz do zero
export const clearQuizStatus = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BURNOUT_RESULT_KEY);
    await AsyncStorage.removeItem(QUIZ_COMPLETED_KEY);
  } catch (error) {
    console.error('Erro ao limpar o status do quiz:', error);
  }
};
