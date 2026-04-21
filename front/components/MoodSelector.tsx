import { Text, TouchableOpacity, View } from "react-native";


export type MoodInfo = {
    label: string;
    emoji: string;
};

export const moods: MoodInfo[] = [
    { label: 'Mal', emoji: '😞' },
    { label: 'Baixo', emoji: '😟' },
    { label: 'Neutro', emoji: '😐' },
    { label: 'Bem', emoji: '🙂' },
    { label: 'Ótimo', emoji: '😊' },
];

type Props = {
    selectMood: number | null;
    onSelect: (index: number) => void;
};

export function MoodSelector({ selectMood, onSelect }: Props) {
    return (
        <View className="flex-row gap-2 justify-between w-full">
            {moods.map((mood, index) => {
                const isSelecte = selectMood === index;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSelect(index)}
                        activeOpacity={0.7}
                        className={`items-center justify-center p-2 rounded-2xl border-2 w-[18%] aspect-square bg-background ${isSelecte ? 'border-primary' : 'border-primary/60'}`}
                    >
                        <Text className="text-2xl">{mood.emoji}</Text>
                        <Text className={`text-sm font-medium ${isSelecte ? 'text-primary' : 'text-gray-500'}`}>{mood.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};