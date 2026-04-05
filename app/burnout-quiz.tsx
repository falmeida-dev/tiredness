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

// pega a largura da tela para usar em animações e estilos responsivos
const { width } = Dimensions.get('window');

//tela de quiz para avaliar o nível de burnout do usuário
//exibe um resultado personalizado com base na pontuação total
export default function BurnoutQuizScreen() {
  // estado para controlar o progresso do quiz, respostas, exibição de resultados e carregamento
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
    setAnswers({ ...answers, [currentQuestion.id]: value });
    
    // pula para a proxima pergunta depois de um delau 
    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        calculateAndShowResult();
      }
    }, 300);
  };

  // calcula a pontuacao total e diz o nivel de burnout salva e exibe o resultado 
  const calculateAndShowResult = async () => {
    setSaving(true);
    const score = Object.values(answers).reduce((acc, val) => acc + val, 0);
    
    // salva no armazenamento local 
    await saveBurnoutResult(score);
    
    // diz o nivel de burnout com base na pontuacao total
    let level: 'baixo' | 'médio' | 'severo' = 'baixo';
    if (score >= 13) level = 'severo';
    else if (score >= 7) level = 'médio';

    // atualiza o estado com o resultado para exibir a tela de resultados
    setResult({
      score,
      level,
      date: new Date().toISOString(),
    });
    
    setSaving(false);
    setShowResult(true);
  };

  // função para obter os detalhes do resultado com base no nível de burnout
  const getLevelDetails = (level: string) => {
    switch (level) {
      case 'severo':
        // retorna detalhes para nível severo
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

  // se showResult for true e result existir, exibe a tela de resultados personalizada com base no nível de burnout
  if (showResult && result) {
    const details = getLevelDetails(result.level);
    return (
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            entering={FadeIn.duration(800)}
            className="px-6"
          >
            <View 
              style={{ backgroundColor: details.bg, borderColor: details.color }}
              className="w-full rounded-[40px] border-2 p-8 items-center shadow-2xl"
            >
              <View 
                style={{ backgroundColor: details.color }}
                className="size-24 rounded-full items-center justify-center -mt-16 mb-6 shadow-lg border-4 border-white"
              >
                <Ionicons name={details.icon} size={48} color="white" />
              </View>
              
              <Text 
                style={{ color: details.color }}
                className="text-3xl font-sans-extrabold text-center mb-4"
              >
                {details.title}
              </Text>
              
              <Text className="text-primary text-center text-lg font-sans-medium leading-7 mb-8">
                {details.description}
              </Text>
              // exibe a pontuação total com uma barra de progresso visual e um botão para continuar para o dashboard
              <View className="w-full bg-white/60 rounded-3xl p-6 mb-8 border border-primary/5">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-primary/60 font-sans-bold uppercase text-xs tracking-wider">Sua Pontuação</Text>
                  <Text className="text-primary font-sans-extrabold text-2xl">{result.score}/18</Text>
                </View>
                <View className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
                  <Animated.View 
                    style={{ 
                      width: `${(result.score / 18) * 100}%`, 
                      backgroundColor: details.color 
                    }}
                    className="h-full rounded-full"
                  />
                </View>
              </View>
              // botão para continuar para o dashboard
              <TouchableOpacity
              // joga o usuario para a tela index.tsx dentro de (tabs) que é a tela home
                onPress={() => router.replace('/(tabs)')}
                style={{ backgroundColor: '#081126' }}
                className="w-full py-5 rounded-3xl items-center shadow-lg active:opacity-80"
              >
                <Text className="text-white font-sans-bold text-lg uppercase tracking-tight">Continuar para o Dashboard</Text>
              </TouchableOpacity>
            </View>
            
            <Text className="mt-8 text-muted-foreground text-center font-sans-medium px-8 leading-5 italic opacity-80">
              Aviso: Este questionário é apenas para orientação e não substitui uma consulta profissional.
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  // tela de quiz normal para responder as perguntas e calcular o resultado
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 pb-12">
          {/* Header */}
          <View className="mb-10 items-center">
            <View className="bg-accent/10 px-4 py-2 rounded-full mb-4">
              <Text className="text-accent font-sans-bold uppercase tracking-widest text-xs">
                Avaliação de Bem-estar
              </Text>
            </View>
            <Text className="text-3xl font-sans-extrabold text-primary text-center">
              Como você está hoje?
            </Text>
            <Text className="text-muted-foreground text-center mt-2 font-sans-medium leading-6">
              Responda com sinceridade para personalizarmos sua experiência.
            </Text>
          </View>

          {/* barra de progressão em cima */}
          <View className="mb-10">
            <View className="flex-row justify-between mb-2">
              <Text className="text-primary/60 font-sans-bold text-xs uppercase">Progresso</Text>
              <Text className="text-primary font-sans-bold text-xs">{currentIndex + 1} de {totalQuestions}</Text>
            </View>
            <View className="h-2.5 w-full bg-primary/5 rounded-full overflow-hidden">
              <Animated.View 
                layout={LinearTransition}
                style={{ width: `${progress * 100}%` }}
                className="h-full bg-accent"
              />
            </View>
          </View>

          {/* card de pergunta */}
          <Animated.View 
            key={currentQuestion.id}
            entering={FadeInRight.duration(500)}
            exiting={FadeOutLeft.duration(500)}
            className="bg-white rounded-3xl p-8 border border-primary/5 shadow-sm mb-8"
          >
            <Text className="text-accent font-sans-bold text-sm mb-3 uppercase">Pergunta {currentIndex + 1}</Text>
            <Text className="text-2xl font-sans-bold text-primary leading-8">
              {currentQuestion.text}
            </Text>
          </Animated.View>

          {/* opções de resposta */}
          <View className="gap-4">
            {OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.7}
                className={`flex-row items-center p-5 rounded-2xl border-2 transition-all ${
                  answers[currentQuestion.id] === opt.value
                    ? 'bg-accent/5 border-accent'
                    : 'bg-white border-primary/5'
                }`}
              >
                <View className={`size-6 rounded-full border-2 items-center justify-center mr-4 ${
                  answers[currentQuestion.id] === opt.value
                    ? 'border-accent bg-accent'
                    : 'border-primary/20'
                }`}>
                  {answers[currentQuestion.id] === opt.value && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className={`text-lg font-sans-semibold ${
                  answers[currentQuestion.id] === opt.value ? 'text-accent' : 'text-primary'
                }`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {saving && (
            <View className="absolute inset-0 bg-white/60 items-center justify-center rounded-3xl">
              <ActivityIndicator color="#ea7a53" size="large" />
              <Text className="mt-4 font-sans-bold text-accent">Analisando resultados...</Text>
            </View>
          )}

          {/* controles de navegação */}
          {currentIndex > 0 && (
            <TouchableOpacity 
              onPress={() => setCurrentIndex(currentIndex - 1)}
              className="mt-8 self-center px-6 py-2"
            >
              <Text className="text-muted-foreground font-sans-semibold decoration-underline">
                Voltar para a anterior
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}