import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { useOAuth, useSignUp } from '@clerk/expo';
import { Link, useRouter, type Href } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  useWarmUpBrowser();
  {/* hooks do Clerk para lidar com o cadastro e autenticação via Google */}
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const router = useRouter();

  {/* estados para armazenar o email, senha, código de verificação e mensagens de erro localmente */}
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');

  {/* define a função para iniciar o fluxo de autenticação com o google */}
  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      {/* se a auth der certo e criar uma sessao, ativa ela e manda para a tela do formulario de burnout */}
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/burnout-quiz');
      }
    } catch (err) {
      console.error('OAuth error', err);
      setLocalError('Erro ao criar conta com Google.');
    }
  }, []);

  {/* define a função para criar uma nova conta usando email e senha, e 
   enviar o código de verificação para o email do usuário */}
  const onSignUpPress = async () => {
    setLocalError('');
    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setLocalError('Ocorreu um erro ao criar conta.');
    }
  };

  {/* verifica o código enviado para o email do usuário, e se estiver correto, finaliza o cadastro e redireciona para 
   a tela principal do app */}
  const onPressVerify = async () => {
    setLocalError('');
    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl('/burnout-quiz');
            router.replace(url as Href);
          },
        });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setLocalError('Código de verificação inválido.');
    }
  };

  const loading = fetchStatus === 'fetching';

  {/* se o cadastro estiver pendente de verificação, renderiza a tela de verificação de código dop  email */}
  if (pendingVerification) {
    return (
      <SafeAreaView className="auth-safe-area" style={{ flex: 1 }}>
        <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className=' w-60 flex-row gap-2'>
                <View className='bg-accent w-22 h-22 z-10 rounded-tr-2xl rounded-bl-2xl '>
                  <Image source={require('@/assets/images/logo-tiredness.png')} className='w-20 h-20' />
                </View>

                <View className="flex-column items-start gap-2">
                  <Text className="auth-wordmark">TiredNess</Text>
                  <Text className="ml-1">Ou endoidece ou fica doido</Text>
                </View>
            </View>

              <Text className="auth-title">Verifique seu e-mail</Text>
              <Text className="auth-subtitle">
                Enviamos um código para {emailAddress}. Insira-o abaixo para continuar.
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Código de Verificação</Text>
                  <TextInput
                    value={code}
                    placeholder="Digite o código"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    onChangeText={setCode}
                    className={`auth-input ${errors.fields.code ? 'auth-input-error' : ''}`}
                    keyboardType="numeric"
                  />
                  {errors.fields.code && (
                    <Text className="auth-error">{errors.fields.code.message}</Text>
                  )}
                </View>

                {localError ? (
                  <Text className="auth-error text-center">{localError}</Text>
                ) : null}
                {/* botão para verificar o código e finalizar o cadastro */}
                <TouchableOpacity
                  onPress={onPressVerify}
                  disabled={loading || !code}
                  className={`auth-button ${loading || !code ? 'auth-button-disabled' : ''}`}
                >
                  {loading ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Verificar</Text>
                  )}
                </TouchableOpacity>
                {/* reenvia o codigo para o email caso ele não tenha recebido */}
                <TouchableOpacity
                  onPress={() => signUp.verifications.sendEmailCode()}
                  className="auth-secondary-button"
                >
                  <Text className="auth-secondary-button-text">Reenviar código</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area" style={{ flex: 1 }}>
      <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="auth-content">
          <View className="auth-brand-block">
            <View className=' w-60 flex-row gap-2'>
                <Image source={require('@/assets/images/logo-tiredness.png')} className='w-20 h-20 rounded-tr-2xl rounded-bl-2xl' />
           

              <View className="flex-column items-start gap-2">
                <Text className="auth-wordmark">TiredNess</Text>
                <Text className="ml-1">Ou endoidece ou fica doido</Text>
              </View>
            </View>

            <Text className="auth-title mt-12">Criar nova conta</Text>
            <Text className="auth-subtitle">
              Comece hoje sua jornada para uma vida mais leve.
            </Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">E-mail</Text>
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Seu melhor e-mail"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={setEmailAddress}
                  className={`auth-input ${errors.fields.emailAddress ? 'auth-input-error' : ''}`}
                  keyboardType="email-address"
                />
                {errors?.fields?.emailAddress && (
                  <Text className="auth-error">{errors?.fields?.emailAddress.message}</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Senha</Text>
                <TextInput
                  value={password}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  secureTextEntry
                  onChangeText={setPassword}
                  className={`auth-input ${errors?.fields?.password ? 'auth-input-error' : ''}`}
                />
                {errors?.fields?.password && (
                  <Text className="auth-error">{errors?.fields?.password.message}</Text>
                )}
              </View>

              {localError ? (
                <Text className="auth-error text-center">{localError}</Text>
              ) : null}

              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={loading || !emailAddress || !password}
                className={`auth-button ${loading || !emailAddress || !password ? 'auth-button-disabled' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Continuar</Text>
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
                    <Text className="text-xs font-bold text-accent">G</Text>
                  </View>
                  <Text className="auth-social-text">Google</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="auth-link-row">
            <Text className="auth-link-copy">Já tem uma conta?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="auth-link">Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}