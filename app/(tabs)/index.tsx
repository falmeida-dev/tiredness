import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-xl font-bold text-success">
                Hello World! Ta fufando
            </Text>

            <Link href={"../onboarding"} className="mt-4 rounded bg-primary text-white p-3 font-medium">Go to Onboarding</Link>
            <Link href={"../(auth)/sign-in"} className="mt-4 rounded bg-accent text-shadow-taupe-900 p-3 font-medium">Go to Sign In</Link>
            <Link href={"../(auth)/sign-up"} className="mt-4 rounded bg-success text-white p-3 font-medium">Go to Sign Up</Link>

            <Link href={"/mood/report"}>Mood Report</Link>

            <Link 
                href={{
                    pathname: "/mood/[id]",
                    params: { id: "seila" }
                }}>
            Sei la
            </Link>


        </SafeAreaView>
    );
}