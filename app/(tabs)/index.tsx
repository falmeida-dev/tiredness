import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-7xl font-sans-extrabold font-bold ">
                Home
            </Text>
            <Text className="text-7xl font-bold ">
                Principal
            </Text>

            <Link href={"../onboarding"} className="mt-4 rounded bg-primary font-sans-bold text-white p-3 font-medium">Ir para Onboarding</Link>
            <Link href={"../(auth)/sign-in"} className="mt-4 rounded bg-primary font-sans-bold text-white p-3 font-medium">Criar conta</Link>
            <Link href={"../(auth)/sign-up"} className="mt-4 rounded bg-primary font-sans-bold text-white p-3 font-medium">Entrar</Link>

        </SafeAreaView>
    );
}