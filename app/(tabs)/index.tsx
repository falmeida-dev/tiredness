import Card from "@/components/Card";
import ListHeading from "@/components/ListHeading";
import { MoodSelector } from "@/components/MoodSelector";
import { FLASHCARDS, HOME_PHRASES } from "@/constants/data";
import "@/global.css";
import { useAuth, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const [mood, setMood] = useState<number | null>(null);
    const name = user?.firstName || user?.username || "Amigo";

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
                        {/* Card de selecionar humor */}
                        <View className="mb-2">
                            <Text className="text-heading text-lg font-bold my-4">Como você está se sentindo hoje?</Text>
                            <MoodSelector selectMood={mood} onSelect={setMood} />
                        </View>
                        {/* subtitulo - Diários recentes */}
                        <ListHeading title="Ações rápidas" />
                    </>
                )}
                data={FLASHCARDS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card title={item.title} description={item.description} img={item.img} color={item.color} page={item.page} />
                )}
                ItemSeparatorComponent={() => <View className="h-4" />}
                // botão de sair da conta
                ListFooterComponent={() => (
                    <TouchableOpacity
                        onPress={onSignOutPress}
                        className="mt-10 mb-20 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-4"
                    >
                        <Text className="font-sans-bold text-destructive">Sair da conta</Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">Nenhuma ação disponível</Text>}
                contentContainerClassName="pb-30"
            />
        </SafeAreaView>
    );
}