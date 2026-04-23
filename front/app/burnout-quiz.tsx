import { OPTIONS, QUESTIONS } from '@/constants/data';
import { BurnoutResult, saveBurnoutResult } from '@/services/burnout-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

{/* pega a largura da tela para usar em animações e estilos responsivos */}
const { width } = Dimensions.get('window');

{/*tela de quiz para avaliar o nível de burnout do usuário
 exibe um resultado personalizado com base na pontuação total*/}
export default function BurnoutQuizScreen() {
  {/* estado para controlar o progresso do quiz, respostas, exibição de resultados e carregamento*/}
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<BurnoutResult | null>(null);

  const totalQuestions = QUESTIONS.length;
  const progress = (currentIndex + 1) / totalQuestions;
  const currentQuestion = QUESTIONS[currentIndex];

  const handleSelect = (value: number) => {
    const allAnswers = { ...answers, [currentQuestion.id]: value};
    
    setAnswers(allAnswers);

    {/* pula para a proxima pergunta depois de um delay */}
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        calculateAndShowResult(allAnswers);
      }
    }, 300);
  };

  {/*calcula a pontuacao total e diz o nivel de burnout salva e exibe o resultado  */}
  const calculateAndShowResult = async (finalAnswers = answers) => {
    setSaving(true);
    const score = Object.values(finalAnswers).reduce((acc, val) => acc + val, 0);
    
    {/* salva no armazenamento local */}
    await saveBurnoutResult(score);
    
    {/* diz o nivel de burnout com base na pontuacao total */}
    let level: 'baixo' | 'médio' | 'severo' = 'baixo';
    if (score >= 13) level = 'severo';
    else if (score >= 7) level = 'médio';

    {/* atualiza o estado com o resultado para exibir a tela de resultados */}
    setResult({
      score,
      level,
      date: new Date().toISOString(),
    });
    
    setSaving(false);
    setShowResult(true);
  };

  {/* função para obter os detalhes do resultado com base no nível de burnout */}
  const getLevelDetails = (level: string) => {
    switch (level) {
      case 'severo':
        {/* retorna detalhes para nível severo */}
        return {
          title: 'Nível Severo',
          description: 'Seus sinais indicam um alto nível de esgotamento. É essencial buscar ajuda profissional e priorizar o descanso imediato.',
          color: '#dc2626',
          bg: '#fee2e2',
          icon: 'alert-circle' as const,
        };
      case 'médio':
        return {
          title: 'Nível Médio',
          description: 'Você está demonstrando sinais de cansaço significativo. É um bom momento para ajustar sua rotina e focar no autocuidado.',
          color: '#d97706',
          bg: '#fef3c7',
          icon: 'warning' as const,
        };
      default:
        return {
          title: 'Nível Baixo',
          description: 'Seu nível de estresse parece sob controle no momento. Continue praticando hábitos saudáveis para manter seu equilíbrio.',
          color: '#16a34a',
          bg: '#dcfce7',
          icon: 'checkmark-circle' as const,
        };
    }
  };

  {/* se showResult for true e result existir, exibe a tela de resultados personalizada com base no nível de burnout */}
  if (showResult && result) {
    const details = getLevelDetails(result.level);
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeIn.duration(800)}
          >
            <View className="mt-8 mb-8">
              <Text className="text-primary font-bold text-6xl">Resultado</Text>
              <Text className="text-primary mt-1 text-lg font-medium">Veja como está o seu bem-estar.</Text>
            </View>

            <View 
              className="w-full rounded-2xl border border-primary bg-transparent p-6 mb-8 mt-4"
            >
              <View className="flex-row items-center mb-4">
                <View 
                  style={{ backgroundColor: details.bg }}
                  className="size-16 rounded-full items-center justify-center mr-4"
                >
                  <Ionicons name={details.icon} size={32} color={details.color} />
                </View>
                
                <View className="flex-1">
                  <Text 
                    style={{ color: details.color }}
                    className="text-2xl font-bold"
                  >
                    {details.title}
                  </Text>
                  <Text className="text-primary font-bold text-xl mt-1">{result.score}/18 pontos</Text>
                </View>
              </View>
              
              <Text className="text-primary text-base font-medium leading-6 mb-2">
                {details.description}
              </Text>

            </View>

            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="w-full py-4 rounded bg-accent items-center mt-2"
            >
              <Text className="text-primary font-bold text-lg">Continuar pro início</Text>
            </TouchableOpacity>
            
            <Text className="mt-8 text-primary/60 text-center font-medium px-4 leading-5 opacity-80">
              Aviso: Este questionário é apenas para orientação e não substitui uma consulta profissional.
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  {/* tela de quiz normal para responder as perguntas e calcular o resultado */}
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 pb-12">
          {/* Header */}
          <View className="mt-8 mb-10">
            <Text className="text-primary font-bold text-6xl">Bem-estar</Text>
            <Text className="text-primary mt-1 text-lg font-medium">Como você está se sentindo?</Text>
          </View>

          {/* barra de progressão em cima */}
          <View className="mb-10">
            <View className="flex-row justify-between mb-2">
              <Text className="text-primary/60 font-medium text-xs uppercase">Progresso</Text>
              <Text className="text-primary font-bold text-xs">{currentIndex + 1} de {totalQuestions}</Text>
            </View>
            <View className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
              <Animated.View 
                layout={LinearTransition}
                style={{ width: `${progress * 100}%` }}
                className="h-full bg-accent"
              />
            </View>
          </View>

          {/* parte da pergunta */}
          <Animated.View 
            key={currentQuestion.id}
            entering={FadeInRight.duration(500)}
            exiting={FadeOutLeft.duration(500)}
            className="mb-8"
          >
            <Text className="text-primary/60 font-bold text-sm mb-3 uppercase tracking-widest">Pergunta {currentIndex + 1}</Text>
            <Text className="text-3xl font-bold text-primary leading-10">
              {currentQuestion.text}
            </Text>
          </Animated.View>

          {/* opções de resposta */}
          <View className="gap-3">
            {OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.7}
                className={`flex-row items-center p-5 rounded border ${
                  answers[currentQuestion.id] === opt.value
                    ? 'bg-accent/10 border-accent'
                    : 'bg-transparent border-primary/20'
                }`}
              >
                <View className={`size-5 rounded-full border items-center justify-center mr-4 ${
                  answers[currentQuestion.id] === opt.value
                    ? 'border-accent bg-accent'
                    : 'border-primary/20 bg-transparent'
                }`}>
                  {answers[currentQuestion.id] === opt.value && (
                    <Ionicons name="checkmark" size={12} color="#fff9e3" />
                  )}
                </View>
                <Text className={`text-lg transition-colors ${
                  answers[currentQuestion.id] === opt.value ? 'text-primary font-bold' : 'text-primary font-medium'
                }`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {saving && (
            <View className="absolute inset-0 bg-background/80 items-center justify-center">
              <ActivityIndicator color="#ea7a53" size="large" />
              <Text className="mt-4 font-bold text-primary">Analisando resultados...</Text>
            </View>
          )}

          {/* controles de navegação */}
          {currentIndex > 0 && (
            <TouchableOpacity 
              onPress={() => setCurrentIndex(currentIndex - 1)}
              className="mt-8 self-center px-6 py-2"
            >
              <Text className="text-primary/60 font-medium decoration-underline">
                Voltar para a anterior
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}