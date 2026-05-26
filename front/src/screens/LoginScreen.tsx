import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, fonts, radius } from '../theme/colors';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      // pega os usuarios cadastrados no celular
      const usersDbStr = await AsyncStorage.getItem('users_db');
      const usersDb = usersDbStr ? JSON.parse(usersDbStr) : [];

      if (Array.isArray(usersDb) && usersDb.length > 0) {
        const emailLower = email.toLowerCase().trim();
        const user = usersDb.find(
          (u: any) => u && u.email && u.email.toLowerCase().trim() === emailLower && u.password === senha
        );

        if (user) {
          // Alert.alert('Sucesso', 'Login realizado com sucesso!');
          // salva o usuario atual na sessao ativa
          await AsyncStorage.setItem('user', JSON.stringify(user));
          
          // navega pro lugar certo dependendo se ja fez o quiz ou nao
          if (user.firstAccess) {
            navigation.replace('BurnoutQuiz');
          } else {
            navigation.replace('Main');
          }
        } else {
          Alert.alert('Erro', 'Email ou senha incorretos.');
        }
      } else {
        // nao tem nenhum usuario cadastrado ainda
        Alert.alert('Erro', 'Nenhum usuário cadastrado.');
      }
    } catch (e) {
      console.log('deu erro ao fazer login:', e);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image
        source={require('../../assets/images/logo-tiredness.png')}
        style={{ width: 70, height: 70, borderRadius: 10, alignItems: 'center' }}
        resizeMode="contain"
        />
      <Text style={styles.titulo}>TiredNess</Text>
      </View>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.botao} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.8}>
          <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  titulo: {
    ...fonts.titleLarge,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 48,
  },
  formulario: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.button,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...fonts.body,
    color: colors.textDark,
  },
  botao: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.button,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoTexto: {
    color: colors.white,
    ...fonts.titleMedium,
    fontSize: 16,
  },
  link: {
    color: colors.primary,
    ...fonts.body,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
});
