import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme/colors';

// lista de musicas locais em assets/audio/
const MUSICAS = [
  {
    id: 1,
    titulo: 'Ondas do Rio',
    categoria: 'Ambiente',
    arquivo: require('../../assets/audio/rain-sound.mp3'),
  },
  {
    id: 2,
    titulo: 'Chuva',
    categoria: 'Ambiente',
    arquivo: require('../../assets/audio/river-sound.mp3'),
  },
  {
    id: 3,
    titulo: 'Sons de Pássaros',
    categoria: 'Ambiente',
    arquivo: require('../../assets/audio/birds.mp3'),
  },
  {
    id: 4,
    titulo: 'Música para Foco',
    categoria: 'Foco',
    arquivo: require('../../assets/audio/lofi-01.mp3'),
  },
  {
    id: 5,
    titulo: 'Música para Relaxar',
    categoria: 'Relaxar',
    arquivo: require('../../assets/audio/lofi-02.mp3'),
  },
  {
    id: 6,
    titulo: 'Música para Foco',
    categoria: 'Foco',
    arquivo: require('../../assets/audio/lofi-03.mp3'),
  },
];

const FILTROS = ['Todas', 'Ambiente', 'Relaxar', 'Foco'];

export default function MeditationScreen() {
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');
  const [tocandoId, setTocandoId] = useState<number | null>(null);
  const [som, setSom] = useState<Audio.Sound | null>(null);

  // filtra as musicas pela categoria selecionada
  const musicasFiltradas =
    filtroAtivo === 'Todas'
      ? MUSICAS
      : MUSICAS.filter((m) => m.categoria === filtroAtivo);

  async function tocarMusica(musica: (typeof MUSICAS)[0]) {
    try {
      // para o som atual se tiver algum tocando
      if (som) {
        await som.stopAsync();
        await som.unloadAsync();
        setSom(null);
        setTocandoId(null);

        // se clicou na mesma musica que estava tocando, so pausa
        if (tocandoId === musica.id) return;
      }

      // carrega e toca a musica nova
      const { sound: novoSom } = await Audio.Sound.createAsync(musica.arquivo);
      setSom(novoSom);
      setTocandoId(musica.id);
      await novoSom.playAsync();

      // quando a musica terminar limpa o estado
      novoSom.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setSom(null);
          setTocandoId(null);
        }
      });
    } catch (erro) {
      console.log('deu erro ao tocar musica:', erro);
      Alert.alert('Erro', 'Não foi possível tocar o áudio.');
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Meditar</Text>

      {/* filtros de categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosContainer}
        contentContainerStyle={styles.filtrosConteudo}
      >
        {FILTROS.map((filtro) => (
          <TouchableOpacity
            key={filtro}
            style={[styles.pill, filtroAtivo === filtro && styles.pillAtivo]}
            onPress={() => setFiltroAtivo(filtro)}
          >
            <Text style={[styles.pillTexto, filtroAtivo === filtro && styles.pillTextoAtivo]}>
              {filtro}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* cards de musica */}
      {musicasFiltradas.map((musica) => {
        const estaTocando = tocandoId === musica.id;
        return (
          <View key={musica.id} style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo}>{musica.titulo}</Text>
              <Text style={styles.cardCategoria}>{musica.categoria}</Text>
            </View>
            <TouchableOpacity
              style={[styles.botaoPlay, estaTocando && styles.botaoPlayAtivo]}
              onPress={() => tocarMusica(musica)}
            >
              <Ionicons
                name={estaTocando ? 'pause' : 'play'}
                size={22}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        );
      })}
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
    fontSize: 36,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 20,
  },
  filtrosContainer: {
    marginBottom: 24,
  },
  filtrosConteudo: {
    gap: 10,
    paddingRight: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: radius.radiuss,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  pillAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillTexto: {
    ...fonts.body,
    fontWeight: '600',
    color: colors.textMuted,
  },
  pillTextoAtivo: {
    color: colors.white,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  cardCategoria: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  botaoPlay: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPlayAtivo: {
    backgroundColor: colors.dark,
  },
});
