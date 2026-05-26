import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      // pega o usuario salvo no celular
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // verifica se o email e senha batem com o que foi cadastrado
        if (user.email === email && user.password === senha) {
          Alert.alert('Sucesso', 'Login realizado com sucesso!');
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
      <Text style={styles.titulo}>TiredNess</Text>

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
