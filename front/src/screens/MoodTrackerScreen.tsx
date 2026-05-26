import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Angry, CheckCircle, Frown, Laugh, Meh, Smile } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  LayoutChangeEvent,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts, radius } from '../theme/colors';

// opcoes de humor com valor 1-5, icone e rotulo
const OPCOES_HUMOR = [
  { value: 1, Icon: Angry,  label: 'Mal'    },
  { value: 2, Icon: Frown,  label: 'Baixo'  },
  { value: 3, Icon: Meh,    label: 'Neutro' },
  { value: 4, Icon: Smile,  label: 'Bem'    },
  { value: 5, Icon: Laugh,  label: 'Ótimo'  },
];

// retorna 'YYYY-MM-DD' usando hora local do dispositivo
function localDateKey(date = new Date()): string {
  return (
    `${date.getFullYear()}-` +
    `${String(date.getMonth() + 1).padStart(2, '0')}-` +
    `${String(date.getDate()).padStart(2, '0')}`
  );
}

// slider de energia
function SliderEnergia({
  value,
  onValueChange,
}: {
  value: number;
  onValueChange: (v: number) => void;
}) {
  const valorRef = useRef(value);
  valorRef.current = value;

  const larguraTrackRef = useRef(0);
  const valorInicio = useRef(value);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // guarda o valor no momento que o usuario começa a arrastar
        valorInicio.current = valorRef.current;
      },
      onPanResponderMove: (_, g) => {
        const largura = larguraTrackRef.current;
        if (largura > 0) {
          const proximo = Math.round(valorInicio.current + (g.dx / largura) * 100);
          onValueChange(Math.max(0, Math.min(proximo, 100)));
        }
      },
    }),
  ).current;

  const handleLayout = (e: LayoutChangeEvent) => {
    larguraTrackRef.current = e.nativeEvent.layout.width;
  };

  const handlePress = (e: any) => {
    const largura = larguraTrackRef.current;
    if (largura > 0) {
      const proximo = Math.round((e.nativeEvent.locationX / largura) * 100);
      onValueChange(Math.max(0, Math.min(proximo, 100)));
    }
  };

  return (
    <View style={estilosSlider.wrapper}>
      <View style={estilosSlider.linha}>
        <Text style={estilosSlider.label}>ESGOTADO</Text>
        <Text style={estilosSlider.valorTexto}>{value}%</Text>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={estilosSlider.trackOuter}
        onLayout={handleLayout}
      >
        <View style={estilosSlider.trackFundo} />
        <View style={[estilosSlider.trackFill, { width: `${value}%` }]} />
        <View
          {...panResponder.panHandlers}
          style={[estilosSlider.bolinha, { left: `${value}%`, transform: [{ translateX: -12 }] }]}
        />
      </TouchableOpacity>

      <View style={estilosSlider.linha}>
        <View />
        <Text style={estilosSlider.label}>CHEIO DE ENERGIA</Text>
      </View>
    </View>
  );
}

const estilosSlider = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.dark,
    borderRadius: radius.card,
    padding: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A92A6',
    letterSpacing: 0.5,
  },
  valorTexto: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  trackOuter: {
    height: 40,
    justifyContent: 'center',
    marginVertical: 4,
  },
  trackFundo: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E3A4F',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  bolinha: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.primary,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

// tela principal
export default function MoodTrackerScreen() {
  const [humor, setHumor] = useState<number | null>(null);
  const [energia, setEnergia] = useState(50);
  const [jaFezCheckin, setJaFezCheckin] = useState(false);

  // toda vez que a tela ganha foco verifica se ja fez checkin hoje
  useFocusEffect(
    useCallback(() => {
      verificarCheckinHoje();
    }, []),
  );

  async function verificarCheckinHoje() {
    try {
      const raw = await AsyncStorage.getItem('checkins');
      const lista = raw ? JSON.parse(raw) : [];
      const hoje = localDateKey();
      // verifica se ja tem um checkin com a data de hoje
      if (Array.isArray(lista)) {
        let achou = false;
        for (let i = 0; i < lista.length; i++) {
          if (lista[i] && lista[i].date === hoje) {
            achou = true;
            break;
          }
        }
        setJaFezCheckin(achou);
      } else {
        setJaFezCheckin(false);
      }
    } catch (e) {
      console.log('deu erro ao verificar checkin:', e);
      setJaFezCheckin(false);
    }
  }

  async function salvarCheckin() {
    if (humor === null) {
      Alert.alert('Atenção', 'Selecione como está se sentindo.');
      return;
    }

    // monta o objeto do checkin com a data de hoje
    const checkin = {
      date: localDateKey(),            
      timestamp: new Date().toISOString(), 
      mood: humor,                     
      energy: energia,                 
    };

    try {
      // pega a lista atual e adiciona o novo checkin
      const raw = await AsyncStorage.getItem('checkins');
      const lista = raw ? JSON.parse(raw) : [];
      const listaCheckins = Array.isArray(lista) ? lista : [];
      listaCheckins.push(checkin);

      // salva o checkin com a data de hoje
      await AsyncStorage.setItem('checkins', JSON.stringify(listaCheckins));

      Alert.alert('Registrado!', 'Seu check-in de hoje foi salvo.');
      setJaFezCheckin(true);
    } catch (e) {
      console.log('deu erro ao salvar checkin:', e);
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  }

  // se ja fez o checkin hoje mostra tela de confirmacao
  if (jaFezCheckin) {
    return (
      <View style={styles.container}>
        <View style={styles.wrapperConcluido}>
          <CheckCircle size={56} color={colors.primary} strokeWidth={1.5} />
          <Text style={styles.tituloConcluido}>Check-in do dia concluído!</Text>
          <Text style={styles.subtituloConcluido}>
            Você já registrou como está se sentindo hoje.{'\n'}
            Volte amanhã para um novo check-in.
          </Text>
        </View>
      </View>
    );
  }

  // formulario de checkin
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Como você está se{'\n'}sentindo hoje?</Text>

      <Text style={styles.labelSecao}>Registro de Humor</Text>
      <View style={styles.filhaHumor}>
        {OPCOES_HUMOR.map((opt) => {
          const ativo = humor === opt.value;
          const IconeHumor = opt.Icon;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.botaoHumor, ativo && styles.botaoHumorAtivo]}
              activeOpacity={0.7}
              onPress={() => setHumor(opt.value)}
            >
              <IconeHumor
                size={32}
                color={ativo ? colors.primary : colors.textMuted}
                strokeWidth={2.5}
              />
              <Text style={[styles.labelHumor, ativo && styles.labelHumorAtivo]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.labelSecao}>Nível de Energia</Text>
      <SliderEnergia value={energia} onValueChange={setEnergia} />

      <TouchableOpacity style={styles.botaoSalvar} activeOpacity={0.8} onPress={salvarCheckin}>
        <Text style={styles.botaoSalvarTexto}>SALVAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  titulo: {
    ...fonts.titleLarge,
    color: colors.dark,
    marginBottom: 28,
    textAlign: 'center',
  },
  labelSecao: {
    ...fonts.body,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
    marginTop: 8,
  },
  filhaHumor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  botaoHumor: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.white,
    flex: 1,
    marginHorizontal: 3,
    aspectRatio: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botaoHumorAtivo: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(232,114,74,0.1)',
  },
  labelHumor: {
    ...fonts.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  labelHumorAtivo: {
    color: colors.primary,
    fontWeight: '700',
  },
  botaoSalvar: {
    marginTop: 36,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  botaoSalvarTexto: {
    ...fonts.body,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },

  // tela de checkin ja concluido
  wrapperConcluido: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  tituloConcluido: {
    ...fonts.titleMedium,
    color: colors.dark,
    textAlign: 'center',
  },
  subtituloConcluido: {
    ...fonts.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
