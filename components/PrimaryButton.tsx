import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export const PrimaryButton = ({title, onPress, loading, disabled}: Props) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={loading || disabled}
        activeOpacity={0.8}
        className={`bg-accent h-14 rounded-2xl mt-5 items-center justify-center ${(loading|| disabled) ? 'opacity-60' : ''}`}
    >
        {loading? (
            <ActivityIndicator color="#ea7a53" />
        ): (
            <Text className="text-primary font-bold text-lg uppercase tracking-wider">
                {title}
            </Text>
        )}
    </TouchableOpacity>
);

