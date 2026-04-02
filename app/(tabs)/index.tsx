import Card from "@/components/Card";
import ListHeading from "@/components/ListHeading";
import { FLASHCARDS, HOME_PHRASES, HOME_USER } from "@/constants/data";
import "@/global.css";
import { styled } from "nativewind";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {

    // trocar a mensagem de acordo com o horário do dia, se for dia "Bom dia", se for tarde "Boa tarde" e se for noite "Boa noite"
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";




    return (
        <SafeAreaView className="flex-1 bg-background p-5">
                
                {/* cards -  */}
                <FlatList
                    ListHeaderComponent={()=>(
                        <>
                            {/* Header - texto de bem vindo e o nome do usuário vindo do constants/data.ts */}
                            <View className="home-header">
                                <View className="flex-1 mt-2">
                                    <Text className="text-xl font-sans-light tracking-widest">
                                        Bem-vindo de volta
                                    </Text>
                                    <Text className=" text-6xl mt-3 font-sans-bold ">
                                        {greeting}, {HOME_USER.name}!
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

                            {/* subtitulo - Diários recentes */}
                            <ListHeading title="Ações rápidas" />
                        </>
                    )}
                    data={FLASHCARDS}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card title={item.title} description={item.description} img={item.img}  color={item.color} page={item.page}/>
                )}
                ItemSeparatorComponent={()=> <View className="h-4"/>}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">Nenhuma ação disponível</Text>}
                contentContainerClassName="pb-30"
                />
        </SafeAreaView>
    );
}