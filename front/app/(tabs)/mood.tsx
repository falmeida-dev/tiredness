import { EnergySlider } from '@/components/EnergySlider';
import { MoodSelector, moods } from '@/components/MoodSelector';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors } from '@/constants/theme';
import { createMoodEntry } from '@/services/api';
import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function HumorScreen() {
  // pega o initialMood que veio da Home (se tiver)
  const { initialMood } = useLocalSearchParams<{ initialMood?: string }>();

  const { user } = useUser();
  const [humor, setHumor] = useState<number | null>(null);
  const [energia, setEnergia] = useState(50);
  const [carregando, setCarregando] = useState(false);
  const [nota, setNota] = useState('');
  const [jaRegistrouHoje, setJaRegistrouHoje] = useState(false);
  const [loadingVerificacao, setLoadingVerificacao] = useState(true);

  // verifica se já registrou no async storage hoje
  useEffect(() => {
    const verificarRegistro = async () => {
      if (!user?.id) return;
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const key = `@mood_recorded_${user.id}_${today}`;
      try {
        const registrado = await AsyncStorage.getItem(key);
        if (registrado === 'true') {
          setJaRegistrouHoje(true);
        }
      } catch (error) {
        console.error("Erro ao verificar AsyncStorage:", error);
      } finally {
        setLoadingVerificacao(false);
      }
    };

    verificarRegistro();
  }, [user?.id]);

  // se veio um mood da home, já pré-seleciona o emoji
  useEffect(() => {
    if (initialMood !== undefined && initialMood !== null) {
      const parsed = parseInt(initialMood, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 4) {
        setHumor(parsed);
      }
    }
  }, [initialMood]);

  const saveOnStorage = async () => {
    if (humor === null) {
      Alert.alert('Selecione seu humor antes de salvar');
      return;
    }

    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
      return;
    }

    setCarregando(true);

    try {
      await createMoodEntry({
        mood: humor,
        emoji: moods[humor].emoji,
        energy: energia,
        note: nota.trim() || undefined,
        userId: user.id,
      });

      // marca como registrado hoje no local storage
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const key = `@mood_recorded_${user.id}_${today}`;
      await AsyncStorage.setItem(key, 'true');
      setJaRegistrouHoje(true);

      Alert.alert('Salvo!', 'Seu humor e energia foram registrados com sucesso.');

    } catch (error) {
      console.error('Erro ao salvar humor:', error);
      Alert.alert('Erro', 'Não foi possível salvar o humor. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (loadingVerificacao) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (jaRegistrouHoje) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
        <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
        <Text className="text-text-heading text-3xl font-extrabold text-center mt-6">Tudo certo por hoje!</Text>
        <Text className="text-lg text-center mt-4 mb-8 text-muted-foreground">
          Você já registrou seu humor hoje. Volte amanhã para um novo registro e continue acompanhando seu bem-estar!
        </Text>
        <PrimaryButton title="Voltar" onPress={() => router.replace('/(tabs)')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background py-10">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView className="flex-1 px-6 pt-10" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View className="mb-8">
            <Text className="text-text-heading text-5xl font-extrabold">Como você está se sentindo hoje?</Text>
            <Text className="text-2xl mt-3">Me conta como você está se sentindo e sua energia hoje</Text>
          </View>

          <View className="mb-8">
            <View className='flex-row gap-1'>
              <MaterialIcons name="mood" size={24} color="black" />
              <Text className='text-text-heading font-bold text-lg mb-5'>Registro de Humor</Text>
            </View>
            <MoodSelector selectMood={humor} onSelect={setHumor} />
          </View>

          {/* barra de registro de energia */}
          <View className='mb-8'>
            <View className='flex-row justify-between items-center'>
              <View className='flex-row gap-1'>
                <Ionicons name="flash-outline" size={24} color="black" />
                <Text className='text-text-heading font-bold text-lg mb-3'>Nível de Energia</Text>
              </View>
              <Text className='text-accent font-extrabold text-2xl'>{energia}%</Text>
            </View>
            <EnergySlider value={energia} onChange={setEnergia} />
          </View>

          {/* campo para fazer anotação */}
          <View className='bg-background p-4 border border-primary rounded'>
            <Text className='mb-4 font-bold text-lg'>Anotação (se quiser)</Text>
            <View>
              <TextInput
                multiline
                placeholder='O que aconteceu hoje?'
                placeholderTextColor={'#ea7a53'}
                value={nota}
                onChangeText={setNota}
                textAlignVertical='top'
                style={{
                  color: '#ea7a53',
                  backgroundColor: '#f6eecf',
                  borderRadius: 5,
                  padding: 10,
                  height: 128,
                  fontSize: 16,
                  flex: 1,
                  textAlign: 'left',
                }}
              />
            </View>
          </View>

          {/* botão de enviar */}
          <View>
            <PrimaryButton title="Salvar" onPress={saveOnStorage} loading={carregando} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};