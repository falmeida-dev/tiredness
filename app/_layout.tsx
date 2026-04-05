import { tokenCache } from '@/constants/token-cache';
import '@/global.css';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// puxando as fontes dos asserts
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf')
  });

  //  esconde a tela de inicio (que aparece a logo quadrada carregando) quando as fontes estiverem carregadas
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // se a fonte não estiver carregada, não mostra nada
  if (!fontsLoaded) return null;

  // se não tiver a chave de API do Clerk, mostra um erro
  if (!publishableKey) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center', color: '#dc2626' }}>
          Erro: A chave de API do Clerk não foi encontrada no seu arquivo .env.
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <RootContent />
    </ClerkProvider>
  );
}

// componente que vai renderizar o conteúdo do app
function RootContent() {
  const { isLoaded } = useAuth();

  // se o Clerk ainda não tiver carregado, mostra uma tela de loading com o circulo carregando
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff9e3' }}>
        <ActivityIndicator size="large" color="#ea7a53" />
        <Text style={{ marginTop: 12, color: '#081126' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}






