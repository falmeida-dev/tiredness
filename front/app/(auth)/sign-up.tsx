import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { useOAuth, useSignUp } from '@clerk/expo';
import { Link, useRouter, type Href } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  useWarmUpBrowser();
  {/* hooks do Clerk para lidar com o cadastro e autenticação via Google */ }
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const router = useRouter();

  {/* estados para armazenar o email, senha, código de verificação e mensagens de erro localmente */ }
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');

  {/* define a função para iniciar o fluxo de autenticação com o google */ }
  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      {/* se a auth der certo e criar uma sessao, ativa ela e manda para a tela do formulario de burnout */ }
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
        setLocalError(error.message || 'Dados inválidos. Verifique e tente novamente.');
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
        setLocalError(error.message || 'Código inválido. Verifique e tente novamente.');
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

  if (pendingVerification) {
    return (
      <SafeAreaView className="auth-safe-area" style={{ flex: 1 }}>
        <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="auth-content mt-12">

            <View className="auth-brand-block mt-4">
              <View className=' w-60 flex-row gap-2'>
                <Image source={require('@/assets/images/logo-tiredness.png')} className='w-20 h-20 rounded-tr-2xl rounded-bl-2xl' />

                <View className="flex-column items-start gap-2">
                  <Text className="auth-wordmark">TiredNess</Text>
                  <Text className="ml-1 text-xs text-muted-foreground uppercase tracking-widest font-sans-bold">Ou endoidece ou fica doido</Text>
                </View>
              </View>

              <Text className="auth-title mt-12">Verifique seu{'\n'}e-mail</Text>
              <Text className="auth-subtitle">
                Enviamos um código para {emailAddress}. Insira-o abaixo para continuar.
              </Text>
            </View>

            <View className="auth-form mt-8">
              <View className="auth-field">
                <View className={`auth-input-wrapper ${errors?.fields?.code ? 'auth-input-wrapper-error' : ''}`}>
                  <Feather name="key" size={20} className="auth-input-icon" color="#ea7a53" />
                  <TextInput
                    value={code}
                    placeholder="Código de verificação"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    onChangeText={setCode}
                    className="auth-input"
                    keyboardType="numeric"
                  />
                </View>
                {errors?.fields?.code && (
                  <Text className="auth-error">{errors.fields.code.message}</Text>
                )}
              </View>

              {localError ? (
                <Text className="auth-error text-center mt-2">{localError}</Text>
              ) : null}

              <TouchableOpacity
                onPress={onPressVerify}
                disabled={loading || !code}
                className={`auth-button ${loading || !code ? 'auth-button-disabled' : ''}`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff9e3" />
                ) : (
                  <Text className="auth-button-text">Verificar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => signUp.verifications.sendEmailCode()}
                className="mt-6 self-center"
              >
                <Text className="auth-secondary-button-text text-muted-foreground">Reenviar código</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area" style={{ flex: 1 }}>
      <ScrollView className="auth-scroll" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="auth-content mt-12">

          <View className="auth-brand-block mt-4">
            <View className=' w-60 flex-row gap-2'>
              <Image source={require('@/assets/images/logo-tiredness.png')} className='w-20 h-20 rounded-tr-2xl rounded-bl-2xl' />

              <View className="flex-column items-start gap-2">
                <Text className="auth-wordmark">TiredNess</Text>
                <Text className="text-xs text-muted-foreground uppercase tracking-widest font-sans-bold">Ou endoidece{'\n'}ou fica doido</Text>
              </View>
            </View>

            <Text className="auth-title mt-12">Criar nova conta</Text>
            <Text className="auth-subtitle">
              Comece hoje sua jornada para{'\n'}uma vida mais leve.
            </Text>
          </View>

          <View className="auth-form mt-8">
            <View className="auth-field mb-2">
              <View className={`auth-input-wrapper ${errors?.fields?.emailAddress ? 'auth-input-wrapper-error' : ''}`}>
                <Feather name="mail" size={20} className="auth-input-icon" color="#ea7a53" />
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Seu melhor e-mail"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={setEmailAddress}
                  className="auth-input"
                  keyboardType="email-address"
                />
              </View>
              {errors?.fields?.emailAddress && (
                <Text className="auth-error">{errors?.fields?.emailAddress.message}</Text>
              )}
            </View>

            <View className="auth-field">
              <View className={`auth-input-wrapper ${errors?.fields?.password ? 'auth-input-wrapper-error' : ''}`}>
                <Feather name="lock" size={20} className="auth-input-icon" color="#ea7a53" />
                <TextInput
                  value={password}
                  placeholder="Mínimo 8 caracteres"
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

            {localError ? (
              <Text className="auth-error text-center mt-2">{localError}</Text>
            ) : null}

            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={loading || !emailAddress || !password}
              className={`auth-button ${loading || !emailAddress || !password ? 'auth-button-disabled' : ''}`}
            >
              {loading ? (
                <ActivityIndicator color="#fff9e3" />
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
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png' }} className="w-5 h-5" />
                </View>
                <Text className="auth-social-text">Google</Text>
              </TouchableOpacity>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}