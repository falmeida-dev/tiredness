import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";
type Props = {
    value: number;
    onChange: (value: number) => void;
};

export const EnergySlider = ({ value, onChange }: Props) => {
    return (
        <View className="w-full bg-[#081126] p-5 rounded">
            <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={value}
                onValueChange={onChange}
                minimumTrackTintColor="#ea7a53"
                maximumTrackTintColor="#121417"
                thumbTintColor="#FFF"
            />
            <View className="flex-row justify-between">
                <Text className="text-white font-medium text-[12px] uppercase">Esgotado</Text>
                <Text className="text-white font-medium text-[12px] uppercase">Cheio de energia</Text>
            </View>
        </View>
    );
};