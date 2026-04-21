import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

// tela inicial que verifica se o usuário está logado
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
   if(!isLoaded) return;

   requestAnimationFrame(()=>{
    if (isSignedIn){
      router.replace('/(tabs)');
    } else{
      router.replace('/(auth)/sign-up')
    }
   });
  }, [isLoaded, isSignedIn]);

  return null;
}
