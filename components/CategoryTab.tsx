import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";


type Props = {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    isActive: boolean;
    onPress: () => void;
};

export const CategoryTab = ({label, icon, isActive, onPress}: Props) =>{
    return(
        <TouchableOpacity
            onPress={onPress}
            className={`h-12 px-4 mb-10 rounded-2xl flex-row items-center justify-center mr-3 border border-primary ${isActive ? 'bg-accent' : 'bg-background'}`}
            activeOpacity={0.7}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={18}
                    color={isActive ? '#081126' : '#081126'}
                    style={{ marginRight: 8}}
                />
            )}
            <Text className={`font-semibold text-lg ${isActive ? 'text-primary' : 'text-primary'}`}>{label}</Text>

        </TouchableOpacity>
    );
};