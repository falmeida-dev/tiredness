import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, radius } from '../theme/colors';

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      // salva o usuario no celular com firstAccess true pra mandar pro quiz
      const user = { name: nome, email, password: senha, firstAccess: true };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      // volta pro login depois de cadastrar
      navigation.navigate('Login');
    } catch (e) {
      console.log('deu erro ao cadastrar:', e);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TiredNess</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor={colors.textMuted}
          value={nome}
          onChangeText={setNome}
        />
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

        <TouchableOpacity style={styles.botao} onPress={handleCadastro} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.8}>
          <Text style={styles.link}>Já tem conta? Faça login</Text>
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
