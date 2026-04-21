import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';

// layout para as telas de autenticação (sign-in e sign-up) e manda
// redirecionar para a tela principal se o usuário já estiver autenticado
export default function AuthLayout() {
  // verifica o estado de autenticação do usuário
  const { isLoaded, isSignedIn } = useAuth();

  // enquanto o estado de autenticação está sendo carregado, retorna null para evitar renderizar a tela de autenticação
  if (!isLoaded) return null;

  // se o usuário já estiver autenticado, redireciona para a tela principal
  if (isSignedIn) {
    return <Redirect href={'/(tabs)'} />;
  }

  // se o usuário não estiver autenticado, renderiza as telas de sign-in e sign-up
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}

