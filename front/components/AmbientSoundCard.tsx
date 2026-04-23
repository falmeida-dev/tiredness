import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";


type Props = {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    isActive: boolean;
    isLoading?: boolean;
    onPress: () => void;
}

export const AmbientSoundCard = ({ label, icon, isActive, isLoading, onPress }: Props) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading}
            className={`w-28 h-28 rounded items-center justify-center m-2 border ${isActive ? 'bg-accent border' : 'bg-background'}`}
        >
            <View className={`w-14 h-14 rounded items-center justify-center mb-2 ${isActive ? "bg-accent" : 'bg-primary'}`}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#081126" />
                ) : (
                    <Ionicons
                        name={icon}
                        size={18}
                        color={isActive ? '#081126' : '#fff'}
                    />
                )
                }
            </View>

            <Text className={'font-medium text-primary'}>
                {isLoading ? "" : label}
            </Text>

        </TouchableOpacity>


    );


}