import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { useOAuth, useSignIn } from '@clerk/expo';
import { Link, useRouter, type Href } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';


{/* isso é para web, expo web, para lidar com o redirecionamento após o login, e completar o processo de autenticação */ }
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  useWarmUpBrowser();

  {/* hook do clerk para login */ }
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const router = useRouter();
  {/* estados */ }
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  {/*define a função para iniciar o fluxo de autenticação com o google*/ }
  {/* e se der certo joga pra index.tsx */ }
  const onGooglePress = useCallback(async () => {
    // 
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      {/* se a sessão for criada, ativa a sessão e redireciona para a tela principal do app */ }
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('OAuth error', err);
      setLocalError('Erro ao entrar com Google.');
    }
  }, [startOAuthFlow, router]);

  {/* define a função para fazer login usando email e senha */ }
  const onSignInPress = async () => {
    setLocalError('');

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        setLocalError(error.message || 'Dados inválidos. Verifique e tente novamente.');
        return;
      }

      {/* se o login for bem-sucedido, finaliza o processo de autenticação e redireciona para a tela principal do app */ }
      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: async ({ session, decorateUrl }) => {
            const url = decorateUrl('/(tabs)');
            if (url.startsWith('http')) {
              {/* isso é para web, expo web */ }
              router.replace('/(tabs)');
            } else {
              {/* isso é para mobile */ }
              router.replace(url as Href);
            }
          },
        });
      } else {
        {/*caso o login não seja concluído */ }
        setLocalError('Login incompleto. Verifique suas credenciais.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setLocalError('Ocorreu um erro ao entrar.');
    }
  };

  {/* carregando */ }
  const loading = fetchStatus === 'fetching';

  return (
    <SafeAreaView className="auth-safe-area" style={{ flex: 1 }}>
      <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="auth-content mt-12">

          <View className="auth-brand-block mt-4">
            <View className=' w-60 flex-row gap-2'>
              <Image source={require('@/assets/images/logo-tiredness.png')} className='w-20 h-20 rounded-tr-2xl rounded-bl-2xl ' />

              <View className="flex-column items-start gap-2">
                <Text className="auth-wordmark">TiredNess</Text>
                <Text className="text-xs text-muted-foreground uppercase tracking-widest font-sans-bold">Ou endoidece{'\n'}ou fica doido</Text>
              </View>
            </View>

            <Text className="auth-title mt-12">Olá!</Text>
            <Text className="auth-subtitle">
              Faça login para continuar.
            </Text>
          </View>

          <View className="auth-form mt-8">
            <View className="auth-field mb-2">
              <View className={`auth-input-wrapper ${errors?.fields?.identifier ? 'auth-input-wrapper-error' : ''}`}>
                <Feather name="mail" size={20} className="auth-input-icon" color="#ea7a53" />
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="E-mail"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={setEmailAddress}
                  className="auth-input"
                  keyboardType="email-address"
                />
              </View>
              {errors?.fields?.identifier && (
                <Text className="auth-error">{errors?.fields?.identifier.message}</Text>
              )}
            </View>

            <View className="auth-field">
              <View className={`auth-input-wrapper ${errors?.fields?.password ? 'auth-input-wrapper-error' : ''}`}>
                <Feather name="lock" size={20} className="auth-input-icon" color="#ea7a53" />
                <TextInput
                  value={password}
                  placeholder="Senha"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  secureTextEntry
                  onChangeText={setPassword}
                  className="auth-input"
                />
              </View>
              {errors?.fields?.password && (
                <Text className="auth-error">{errors?.fields?.password.message}</Text>
              )}
            </View>

            <TouchableOpacity className="self-end mt-1">
              <Text className="auth-helper">Esqueceu a senha?</Text>
            </TouchableOpacity>

            {localError ? (
              <Text className="auth-error text-center mt-2">{localError}</Text>
            ) : null}

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading || !emailAddress || !password}
              className={`auth-button ${loading || !emailAddress || !password ? 'auth-button-disabled' : ''}`}
            >
              {loading ? (
                <ActivityIndicator color="#fff9e3" />
              ) : (
                <Text className="auth-button-text">Entrar</Text>
              )}
            </TouchableOpacity>

            <View className="auth-divider-row">
              <View className="auth-divider-line" />
              <Text className="auth-divider-text">ou continuar com</Text>
              <View className="auth-divider-line" />
            </View>

            <View className="auth-social-row">
              <TouchableOpacity onPress={onGooglePress} className="auth-social-button">
                <View className="auth-social-icon">
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png' }} className="w-5 h-5" />
                </View>
                <Text className="auth-social-text">Google</Text>
              </TouchableOpacity>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Não tem uma conta?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="auth-link">Criar conta</Text>
                </TouchableOpacity>
              </Link>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}