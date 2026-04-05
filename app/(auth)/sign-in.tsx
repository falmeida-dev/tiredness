import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { useOAuth, useSignIn } from '@clerk/expo';
import { Link, useRouter, type Href } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// isso é para web, expo web, para lidar com o redirecionamento após o login, e completar o processo de autenticação
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  useWarmUpBrowser();

  // hook do clerk para login
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const router = useRouter();
  // estados
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // define a função para iniciar o fluxo de autenticação com o google
  // e se der certo joga pra index.tsx 
  const onGooglePress = useCallback(async () => {
    // 
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      // se a sessão for criada, ativa a sessão e redireciona para a tela principal do app
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('OAuth error', err);
      setLocalError('Erro ao entrar com Google.');
    }
  }, []);

  // define a função para fazer login usando email e senha
  const onSignInPress = async () => {
    setLocalError('');

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      // se o login for bem-sucedido, finaliza o processo de autenticação e redireciona para a tela principal do app
      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl('/(tabs)');
            if (url.startsWith('http')) {
              // isso é para web, expo web
              router.replace('/(tabs)');
            } else {
              // isso é para mobile
              router.replace(url as Href);
            }
          },
        });
      } else {
        // caso o login não seja concluído
        setLocalError('Login incompleto. Verifique suas credenciais.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setLocalError('Ocorreu um erro ao entrar.');
    }
  };

  // carregando
  const loading = fetchStatus === 'fetching';

  return (
    // tela de login
    <SafeAreaView className="auth-safe-area" style={{ flex: 1, marginTop: 20 }}>
      <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="auth-content">
          <View className="auth-brand-block">

            <View className=' w-60 flex-row gap-2'>
              <Image source={require('@/assets/images/logo-tiredness.png')} className='w-20 h-20 rounded-tr-2xl rounded-bl-2xl ' />

              <View className="flex-column items-start gap-2">
                <Text className="auth-wordmark">TiredNess</Text>
                <Text className="ml-1">Ou endoidece ou fica doido</Text>
              </View>
            </View>

            <Text className="auth-title mt-12">Bem-vindo de volta</Text>
            <Text className="auth-subtitle">
              Entre para continuar sua jornada de descuidado.
            </Text>
          </View>
          {/* card de login */}
          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">E-mail</Text>
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Seu e-mail"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={setEmailAddress}
                  className={`auth-input ${errors.fields.identifier ? 'auth-input-error' : ''}`}
                  keyboardType="email-address"
                />
                {errors.fields.identifier && (
                  <Text className="auth-error">{errors.fields.identifier.message}</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Senha</Text>
                <TextInput
                  value={password}
                  placeholder="Sua senha"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  secureTextEntry
                  onChangeText={setPassword}
                  className={`auth-input ${errors.fields.password ? 'auth-input-error' : ''}`}
                />
                {errors.fields.password && (
                  <Text className="auth-error">{errors.fields.password.message}</Text>
                )}
              </View>

              {localError ? (
                <Text className="auth-error text-center">{localError}</Text>
              ) : null}

              <TouchableOpacity
                onPress={onSignInPress}
                disabled={loading || !emailAddress || !password}
                className={`auth-button ${loading || !emailAddress || !password ? 'auth-button-disabled' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Entrar</Text>
                )}
              </TouchableOpacity>

              <View className="auth-divider-row">
                <View className="auth-divider-line" />
                <Text className="auth-divider-text">ou continuar com</Text>
                <View className="auth-divider-line" />
              </View>

              // opções de login social
              <View className="auth-social-row">
                <TouchableOpacity onPress={onGooglePress} className="auth-social-button">
                  <View className="auth-social-icon">
                    <Text className="text-xs font-bold text-accent">G</Text>
                  </View>
                  <Text className="auth-social-text">Google</Text>
                </TouchableOpacity>
              </View>
            </View>
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
      </ScrollView>
    </SafeAreaView>
  );
}