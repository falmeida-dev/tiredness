import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BurnoutQuizScreen from '../screens/BurnoutQuizScreen';
import HomeScreen from '../screens/HomeScreen';
import MoodTrackerScreen from '../screens/MoodTrackerScreen';
import MeditationScreen from '../screens/MeditationScreen';
import ReportScreen from '../screens/ReportScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// tabs de navegacao principal
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.dark,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8A92A6',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'MoodTracker') iconName = 'happy-outline';
          else if (route.name === 'Meditation') iconName = 'leaf-outline';
          else if (route.name === 'Report') iconName = 'bar-chart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="MoodTracker" component={MoodTrackerScreen} options={{ tabBarLabel: 'Humor' }} />
      <Tab.Screen name="Meditation" component={MeditationScreen} options={{ tabBarLabel: 'Meditação' }} />
      <Tab.Screen name="Report" component={ReportScreen} options={{ tabBarLabel: 'Relatório' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  // tela inicial: null = carregando, 'Login', 'BurnoutQuiz' ou 'Main'
  const [telaInicial, setTelaInicial] = useState<string | null>(null);

  useEffect(() => {
    verificarUsuario();
  }, []);

  // verifica se ja tem usuario salvo no celular pra nao cair sempre no login
  async function verificarUsuario() {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // se ja fez o quiz de burnout vai direto pra home
        if (user.firstAccess === false) {
          setTelaInicial('Main');
        } else {
          // se ainda nao fez o quiz manda pro quiz
          setTelaInicial('BurnoutQuiz');
        }
      } else {
        // nao tem usuario, vai pro login
        setTelaInicial('Login');
      }
    } catch (e) {
      console.log('deu erro ao verificar usuario:', e);
      setTelaInicial('Login');
    }
  }

  // enquanto carrega mostra um loading no meio da tela
  if (telaInicial === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={telaInicial}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="BurnoutQuiz" component={BurnoutQuizScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
