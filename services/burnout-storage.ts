import AsyncStorage from '@react-native-async-storage/async-storage';

const BURNOUT_RESULT_KEY = '@burnout_result';
const QUIZ_COMPLETED_KEY = '@quiz_completed';

export type BurnoutLevel = 'baixo' | 'médio' | 'severo';

export interface BurnoutResult {
  score: number;
  level: BurnoutLevel;
  date: string;
}

/**
 * Saves the burnout quiz result and marks it as completed.
 */
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
    console.error('Error saving burnout result:', error);
  }
};

/**
 * Retrieves the saved burnout quiz result.
 */
export const getBurnoutResult = async (): Promise<BurnoutResult | null> => {
  try {
    const data = await AsyncStorage.getItem(BURNOUT_RESULT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting burnout result:', error);
    return null;
  }
};

/**
 * Checks if the user has completed the quiz.
 */
export const hasCompletedQuiz = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(QUIZ_COMPLETED_KEY);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking quiz status:', error);
    return false;
  }
};

/**
 * Clears the quiz status (useful for debugging or re-taking).
 */
export const clearQuizStatus = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BURNOUT_RESULT_KEY);
    await AsyncStorage.removeItem(QUIZ_COMPLETED_KEY);
  } catch (error) {
    console.error('Error clearing quiz status:', error);
  }
};
