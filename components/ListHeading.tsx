import "@/global.css";
import { Text, View } from 'react-native';

const ListHeading = ({ title }: { title: string }) => {
  return (
    <View className='list-head ml-2'>
      <Text className="list-title">{title}</Text>

      {/* <TouchableOpacity className="list-action">
        <Text className="list-action-text">Ver todos</Text>
      </TouchableOpacity> */}
    </View>
  )
};

export default ListHeading;