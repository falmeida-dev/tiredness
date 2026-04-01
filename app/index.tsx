import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-xl font-bold text-success">
                Hello World! Ta fufando
            </Text>

            <Link href={"/onboarding"} className="mt-4 rounded bg-primary text-white p-3 font-medium">Go to Onboarding</Link>
        </View>
    );
}