import CardAcaoRapida from "@/components/CardAcaoRapida";
import ListHeading from "@/components/ListHeading";
import { PrimaryButton } from "@/components/PrimaryButton";
import { FLASHCARDS, HOME_PHRASES } from "@/constants/data";
import "@/global.css";
import { getWeeklySummary } from "@/services/api";
import { WeeklySummary } from "@/types/mood";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { styled } from "nativewind";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const [summary, setSummary] = useState<WeeklySummary | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const name = user?.firstName || user?.username || "Amigo";

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchSummary = async () => {
                if (!user?.id) return;
                try {
                    setLoadingSummary(true);
                    const data = await getWeeklySummary(user.id);
                    if (isActive) {
                        setSummary(data);
                    }
                } catch (error) {
                    console.error('Erro ao buscar resumo na home:', error);
                } finally {
                    if (isActive) setLoadingSummary(false);
                }
            };

            fetchSummary();

            return () => {
                isActive = false;
            };
        }, [user?.id])
    );

    // trocar a mensagem de acordo com o horário do dia, se for dia "Bom dia", se for tarde "Boa tarde" e se for noite "Boa noite"
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    const onSignOutPress = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error("Erro ao sair da conta", err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">

            {/* cards -  */}
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        {/* header - texto de bem vindo e o nome do usuário vindo do constants/data.ts */}
                        <View className="home-header">
                            <View className="flex-1 mt-2">
                                <Text className="text-xl font-sans-light tracking-widest">
                                    Bem-vindo de volta
                                </Text>
                                <Text className=" text-6xl h-35 mt-3 font-sans-bold ">
                                    {greeting}, {name}!
                                </Text>
                            </View>
                        </View>
                        {/* Fim header */}

                        {/* Card da frase */}
                        <View className="home-phrase-card mt-2">
                            <Text className="home-phrase-label">Frase do dia</Text>

                            <View className="home-phrase-row">
                                <Text className="home-phrase-amount">"{HOME_PHRASES.motivational}"</Text>

                            </View>
                            <View className="home-phrase-row">
                                <Text className="home-phrase-date italic">{HOME_PHRASES.author}</Text>
                            </View>
                        </View>
                        {/* fim do card de frase */}
                        {/* card de nível de humor médio */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/(tabs)/insights")}
                            className="bg-background border border-primary p-4 rounded mb-4 mt-2"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1 justify-center">
                                    <View className="flex-row items-center mb-1">
                                        {/* <View className="bg-accent/10 p-2 rounded-full mr-2">
                                            <Ionicons name="stats-chart" size={16} color="#ea7a53" />
                                        </View> */}
                                        <Text className="text-primary font-bold text-lg">Nível de humor</Text>
                                    </View>
                                    <Text className="text-muted-foreground font-medium text-sm  mb-3">
                                        {summary?.totalEntries === 0 ? "Sem dados nessa semana" : "Média dessa semana"}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <Text className="text-muted-foreground font-bold text-sm text-primary">Ver relatórios</Text>
                                        <Ionicons name="arrow-forward" size={12} color="#081126" />
                                    </View>
                                </View>

                                {loadingSummary ? (
                                    <View className="w-24 h-24 items-center justify-center">
                                        <ActivityIndicator size="small" color="#ea7a53" />
                                    </View>
                                ) : (
                                    <View className="items-center justify-center border-[5px] border-accent/20 rounded-full w-24 h-24 ml-2">
                                        <Text className="text-3xl font-extrabold text-primary">{summary?.averageMood ?? 0}%</Text>
                                        <Text className="text-xl mt-0.5">{summary?.moodEmoji ?? "😐"}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                        {/* subtitulo - Ações rápidas */}
                        <ListHeading title="Ações rápidas" />
                    </>
                )}
                data={FLASHCARDS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CardAcaoRapida title={item.title} description={item.description} img={item.img} color={item.color} page={item.page} />
                )}
                ItemSeparatorComponent={() => <View className="h-4" />}
                // botão de sair da conta
                ListFooterComponent={() => (
                    <PrimaryButton title="Sair da conta" onPress={onSignOutPress} />
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">Nenhuma ação disponível</Text>}
                contentContainerClassName="pb-30"
            />
        </SafeAreaView>
    );
}