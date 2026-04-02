import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

const MoodDetail = () => {
  const { id } = useLocalSearchParams<{id: string}>();
  
  return (
    <View>
      <Text>MoodDetail: {id}</Text>
      <Link href="/">Voltar para o início</Link>
    </View>
  )
}

export default MoodDetail;