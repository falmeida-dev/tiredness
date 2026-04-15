import { EnergySlider } from '@/components/EnergySlider';
import { MoodSelector } from '@/components/MoodSelector';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';



export default function HumorScreen() {

  const [humor, setHumor] = useState<number | null>(null);
  const [energia, setEnergia] = useState(50);
  const [carregando, setCarregando] = useState(false);
  const [nota, setNota] = useState('a');

  const saveOnStorage = async() =>{
    if(humor === null){
      Alert.alert('Selecione seu humor antes de salvar');
      return;
    }

    setCarregando(true);
    
    try {
      const response = await fetch('https://api-tiredness.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ humor, energia }),
      });

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o humor.');
    } finally {
      setCarregando(false);
    }
  };

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

          <View className='bg-card p-4 shadow rounded-lg'>
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
          <PrimaryButton title="Salvar" onPress={saveOnStorage} loading={carregando}/>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};