import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";

// mook de dados só para aparecer na tela
const MOOD_DATA = [
  { day: 'Seg', emoji: '😐', score: 3 },
  { day: 'Ter', emoji: '😐', score: 3 },
  { day: 'Qua', emoji: '😞', score: 2 },
  { day: 'Qui', emoji: '🙂', score: 4 },
  { day: 'Sex', emoji: '🙂', score: 4 },
  { day: 'Sáb', emoji: '🙂', score: 4 },
  { day: 'Dom', emoji: '😐', score: 3 },
];

const ENERGY_DATA = [
  { day: 'Seg', percent: 60 },
  { day: 'Ter', percent: 75 },
  { day: 'Qua', percent: 40 },
  { day: 'Qui', percent: 70 },
  { day: 'Sex', percent: 85 },
  { day: 'Sáb', percent: 65 },
  { day: 'Dom', percent: 55 },
];

export default function RelatorioScreen() {
  const insets = useSafeAreaInsets();
  const tabBarBottomOffset = Math.max(insets.bottom, 20) + 72 + 12;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: tabBarBottomOffset }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View className="mt-8 mb-8">
          <Text className="text-primary font-bold text-6xl">Relatórios</Text>
          <Text className="text-primary mt-1 mx-1 text-lg font-medium">sua média semanal</Text>
        </View>

        {/* cards de médias da semana */}
        <View className="flex-row justify-between mb-6 gap-4">
          {/* card de humor médio */}
          <View className="flex-1 bg-background border border-primary p-4 rounded">
            <View className="flex-row items-center mb-3">
              <View className="bg-accent/10 p-2 rounded-full mr-2">
                <Ionicons name="stats-chart" size={16} color="#ea7a53" />
              </View>
              <Text className="text-muted-foreground font-semibold flex-1" numberOfLines={1}>Humor médio</Text>
            </View>
            <Text className="text-4xl font-extrabold text-primary mb-1">3.6</Text>
            <Text className="text-primary font-medium">😐 de 5</Text>
          </View>

          {/* card de energia média */}
          <View className="flex-1 bg-background border border-primary p-4 rounded">
            <View className="flex-row items-center mb-3">
              <View className="bg-accent/10 p-2 rounded-full mr-2">
                <Ionicons name="flash" size={16} color="#ea7a53" />
              </View>
              <Text className="text-muted-foreground font-semibold flex-1" numberOfLines={1}>Energia média</Text>
            </View>
            <Text className="text-4xl font-extrabold text-primary mb-1">64%</Text>
            <Text className="text-success font-bold text-xs" numberOfLines={1}>↑ 8% vs semana anterior</Text>
          </View>
        </View>

        {/* card de humor semanal */}
        <View className="bg-background border border-primary p-5 rounded mb-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-primary font-bold text-xl">Humor semanal</Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={14} color="rgba(0, 0, 0, 0.6)" />
              <Text className="text-muted-foreground ml-1 text-xs font-semibold">Últimos 7 dias</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center px-1">
            {MOOD_DATA.map((item, index) => (
              <View key={index} className="items-center">
                <Text className="text-2xl mb-3">{item.emoji}</Text>
                <Text className="text-muted-foreground text-xs font-semibold">{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* card de energia semanal */}
        <View className="bg-background border border-primary p-5 rounded mb-8">
          <View className="mb-8">
            <Text className="text-primary font-bold text-xl">Energia semanal</Text>
          </View>

          <View className="flex-row justify-between items-end h-32 px-1">
            {ENERGY_DATA.map((item, index) => (
              <View key={index} className="items-center flex-1">
                <Text className="text-muted-foreground text-[10px] font-bold mb-2">{item.percent}%</Text>
                <View className="w-6 bg-accent rounded-t-md" style={{ height: `${item.percent}%` }} />
                <Text className="text-muted-foreground text-xs font-semibold mt-3">{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}