import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
      // pega a lista atual de usuarios cadastrados
      const usersDbStr = await AsyncStorage.getItem('users_db');
      const usersDb = usersDbStr ? JSON.parse(usersDbStr) : [];

      // verifica se ja existe usuario com esse email
      const emailLower = email.toLowerCase().trim();
      const existe = Array.isArray(usersDb) && usersDb.some(
        (u: any) => u && u.email && u.email.toLowerCase().trim() === emailLower
      );

      if (existe) {
        Alert.alert('Erro', 'Este e-mail já está cadastrado.');
        return;
      }

      // cria o novo usuario com firstAccess true pra mandar pro quiz
      const novoUsuario = { name: nome.trim(), email: email.trim(), password: senha, firstAccess: true };
      const novaLista = Array.isArray(usersDb) ? [...usersDb, novoUsuario] : [novoUsuario];

      await AsyncStorage.setItem('users_db', JSON.stringify(novaLista));
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
