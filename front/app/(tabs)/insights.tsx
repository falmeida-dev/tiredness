import { useTabBarOffset } from "@/hooks/useTabBarOffset";
import { getWeeklySummary } from "@/services/api";
import { WeeklySummary } from "@/types/mood";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function RelatorioScreen() {
  const tabBarBottomOffset = useTabBarOffset();
  const { user } = useUser();

  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getWeeklySummary(user.id);
      setSummary(data);
    } catch (error) {
      console.error('Erro ao buscar resumo semanal:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const doFetch = async () => {
        if (!user?.id) return;
        try {
          setLoading(true);
          const data = await getWeeklySummary(user.id);
          if (isActive) setSummary(data);
        } catch (error) {
          console.error('Erro ao buscar resumo semanal:', error);
        } finally {
          if (isActive) {
            setLoading(false);
            setRefreshing(false);
          }
        }
      };

      doFetch();

      return () => {
        isActive = false;
      };
    }, [user?.id])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSummary();
  };

  // loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#ea7a53" />
        <Text className="text-primary mt-4 font-semibold">Carregando relatórios...</Text>
      </SafeAreaView>
    );
  }

  // se não tem dados
  const hasData = summary && summary.totalEntries > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: tabBarBottomOffset }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ea7a53" />
        }
      >
        {/* Cabeçalho */}
        <View className="mt-8 mb-8">
          <Text className="text-primary font-bold text-6xl">Relatórios</Text>
          <Text className="text-primary mt-1 mx-1 text-lg font-medium">sua média semanal</Text>
        </View>

        {!hasData ? (
          // empty state — nenhum registro ainda
          <View className="bg-background border border-primary p-8 rounded items-center">
            <Text className="text-6xl mb-4">!</Text>
            <Text className="text-primary font-bold text-xl text-center mb-2">
              Nenhum registro encontrado
            </Text>
            <Text className="text-muted-foreground text-center text-base">
              Registre seu humor na aba "Humor" para ver seus relatórios aqui.
            </Text>
          </View>
        ) : (
          <>
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
                <Text className="text-4xl font-extrabold text-primary mb-1">{summary!.averageMood}%</Text>
                <Text className="text-primary font-medium">{summary!.moodEmoji} de 100%</Text>
              </View>

              {/* card de energia média */}
              <View className="flex-1 bg-background border border-primary p-4 rounded">
                <View className="flex-row items-center mb-3">
                  <View className="bg-accent/10 p-2 rounded-full mr-2">
                    <Ionicons name="flash" size={16} color="#ea7a53" />
                  </View>
                  <Text className="text-muted-foreground font-semibold flex-1" numberOfLines={1}>Energia média</Text>
                </View>
                <Text className="text-4xl font-extrabold text-primary mb-1">{summary!.averageEnergy}%</Text>
                {summary!.energyChange !== 0 ? (
                  <Text
                    className={`font-bold text-xs ${summary!.energyChange > 0 ? 'text-success' : 'text-red-500'}`}
                    numberOfLines={1}
                  >
                    {summary!.energyChange > 0 ? '↑' : '↓'} {Math.abs(summary!.energyChange)}% vs semana anterior
                  </Text>
                ) : (
                  <Text className="text-muted-foreground font-bold text-xs">— sem comparação</Text>
                )}
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
                {summary!.dailyMood.map((item, index) => (
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
                {summary!.dailyEnergy.map((item, index) => (
                  <View key={index} className="items-center flex-1">
                    <Text className="text-muted-foreground text-[10px] font-bold mb-2">{item.percent}%</Text>
                    <View className="w-6 bg-accent rounded-t-md" style={{ height: `${Math.max(item.percent, 2)}%` }} />
                    <Text className="text-muted-foreground text-xs font-semibold mt-3">{item.day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}