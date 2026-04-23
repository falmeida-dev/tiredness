import { components } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// hook reutilizável para calcular o offset inferior da tab bar
// usado por telas que precisam compensar padding para a tab bar flutuante
export const useTabBarOffset = () => {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, 20) + components.tabBar.height + 12;
};
