import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const SignUp = () => {
  return (
    <View>
      <Text>sign-up</Text>
      <Link href={"/(auth)/sign-in"}>Já tem uma conta? Entrar</Link>
    </View>
  )
}

export default SignUp;