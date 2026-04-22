import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type Props = {
    title: string;
    subtitle: string;
    duration: string;
    isPlaying?: boolean;
    isBuffering?: boolean;
    onPress: () => void;
};

export const TrackCard = ({ title, subtitle, duration, isPlaying, isBuffering, onPress }: Props) => {
    const isActive = isPlaying || isBuffering;

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-background p-4 rounded mb-3 flex-row items-center border ${isActive ? 'border-accent' : 'border-primary'}`}
            activeOpacity={0.7}
        >
            <View className={`w-12 h-9 rounded items-center justify-center mr-4 bg-primary`}>
                {isBuffering ? (
                    <ActivityIndicator size="small" color="#081126" />
                ) : (
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={24}
                        color={'#fff'}
                    />
                )}
            </View>

            <View className="flex-1">
                <Text className={`font-bold ${isActive ? 'text-accent' : 'text-primary'}`}>
                    {title}
                </Text>
                <Text className="text-sm mt-0.5">
                    {isBuffering ? 'Carregando...' : subtitle}
                </Text>
            </View>
            <Text className="text-sm font-medium">{duration}</Text>
        </TouchableOpacity>
    )


}