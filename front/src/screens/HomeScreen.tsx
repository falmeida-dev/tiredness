import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Brain, NotebookPen, Smile, SmilePlus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts, radius } from '../theme/colors';

// frases que trocam a cada dia
const FRASES_DIARIAS = [
  'Descansar não é preguiça, é manutenção.',
  'Você não precisa ser produtivo todos os dias para ter valor.',
  'Cuide de si como cuidaria de alguém que você ama.',
  'Permita-se pausar sem culpa.',
  'Pequenos passos também são progresso.',
  'Respire fundo. Você está fazendo o seu melhor.',
  'Gentileza consigo mesmo é a maior força.',
  'O cansaço pede escuta, não velocidade.',
  'Hoje, escolha o que te faz bem.',
  'Seu bem-estar importa mais do que sua agenda.',
];

// retorna bom dia / boa tarde / boa noite de acordo com a hora
function getSaudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

// texto do label de humor baseado na media
function getLabelHumor(media: number): string {
  if (media <= 1.5) return 'Baixo';
  if (media <= 2.5) return 'Regular';
  if (media <= 3.5) return 'Bom';
  return 'Ótimo';
}

// pega o comeco da semana (segunda-feira)
function getInicioSemana(): Date {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = domingo
  const diff = diaSemana === 0 ? 6 : diaSemana - 1;
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() - diff);
  segunda.setHours(0, 0, 0, 0);
  return segunda;
}

export default function HomeScreen({ navigation }: any) {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [mediaHumorSemana, setMediaHumorSemana] = useState<number | null>(null);
  const [textoGratidao, setTextoGratidao] = useState('');

  // atualiza os dados toda vez que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, []),
  );

  const carregarDados = async () => {
    try {
      // pega o usuario salvo no celular
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.name) {
          setNomeUsuario(user.name);
        }

        // pega os checkins e calcula a media de humor da semana
        const checkinsStr = await AsyncStorage.getItem(`checkins_${user.email}`);
        if (checkinsStr) {
          const checkins = JSON.parse(checkinsStr);
          if (Array.isArray(checkins)) {
            const inicioSemana = getInicioSemana();

            // filtra so os checkins desta semana
            const checkinsSemana = [];
            for (let i = 0; i < checkins.length; i++) {
              const c = checkins[i];
              if (!c) continue;
              const dataCheckin = c.timestamp ? new Date(c.timestamp) : new Date(c.date + 'T12:00:00');
              if (dataCheckin >= inicioSemana) {
                checkinsSemana.push(c);
              }
            }

            // calcula a media de humor da semana
            if (checkinsSemana.length > 0) {
              let somaHumor = 0;
              for (let i = 0; i < checkinsSemana.length; i++) {
                somaHumor += checkinsSemana[i].mood;
              }
              setMediaHumorSemana(somaHumor / checkinsSemana.length);
            } else {
              // se nao tiver dado ainda mostra nulo
              setMediaHumorSemana(null);
            }
          } else {
            setMediaHumorSemana(null);
          }
        } else {
          setMediaHumorSemana(null);
        }
      } else {
        setMediaHumorSemana(null);
      }
    } catch (e) {
      console.log('deu erro ao carregar dados da Home:', e);
    }
  };

  // salva a mensagem de gratidao no AsyncStorage
  const salvarGratidao = async () => {
    const texto = textoGratidao.trim();
    if (!texto) {
      Alert.alert('Atenção', 'Escreva algo antes de salvar.');
      return;
    }

    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const key = `gratitude_${user.email}`;

        // pega a lista atual de gratidoes
        const existente = await AsyncStorage.getItem(key);
        const lista: { text: string; date: string }[] = existente ? JSON.parse(existente) : [];
        // adiciona a nova gratidao com a data de hoje
        lista.push({ text: texto, date: new Date().toISOString() });
        await AsyncStorage.setItem(key, JSON.stringify(lista));
        setTextoGratidao('');
        Alert.alert('Salvo', 'Gratidão registrada com sucesso!');
      }
    } catch (e) {
      console.log('deu erro ao salvar gratidao:', e);
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  };

  // abre um alerta para confirmar a saída
  const confirmarSair = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que quer sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: realizarLogout,
        },
      ],
      { cancelable: true }
    );
  };

  // realiza o logout limpando a chave user e resetando a navegação
  const realizarLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.log('Erro ao sair da conta:', e);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  // pega a frase do dia baseada no dia do mes
  const fraseDoDia = FRASES_DIARIAS[new Date().getDate() % FRASES_DIARIAS.length];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* saudacao do usuario */}
        <Text style={styles.bemVindoTexto}>Bem-vindo de volta</Text>
        <Text style={styles.saudacao}>
          {getSaudacao()}, {nomeUsuario || 'Usuário'}!
        </Text>

        {/* card da frase motivacional do dia */}
        <View style={styles.cardFrase}>
          <Text style={styles.fraseLabel}>Motivação diária</Text>
          <Text style={styles.fraseTexto}>{fraseDoDia}</Text>
        </View>

        {/* card com resumo do humor da semana */}
        <View style={styles.cardHumor}>
          <View style={styles.cardHumorCabecalho}>
            <Smile size={20} color={colors.textDark} />
            <Text style={styles.cardHumorTitulo}>Humor da semana</Text>
          </View>

          {mediaHumorSemana !== null ? (
            <View style={styles.cardHumorCorpo}>
              {/* icone de humor baseado na media */}
              <Smile size={36} color={colors.primary} />
              <View>
                <Text style={styles.humorLabel}>
                  Média: {getLabelHumor(mediaHumorSemana)}
                </Text>
                <Text style={styles.humorValor}>
                  {mediaHumorSemana.toFixed(1)} / 5
                </Text>
              </View>
            </View>
          ) : (
            // se nao tiver dado ainda mostra mensagem vazia
            <Text style={styles.humorVazio}>Sem registros esta semana.</Text>
          )}

          <TouchableOpacity
            style={styles.linkRelatorio}
            onPress={() => navigation.navigate('Report')}
          >
            <Text style={styles.linkRelatorioTexto}>Ver relatórios →</Text>
          </TouchableOpacity>
        </View>

        {/* botoes de acao rapida */}
        <Text style={styles.tituloSecao}>Ações rápidas</Text>

        <View style={styles.filhaAcoes}>
          {/* rastreio de Humor → vai pra aba de humor */}
          <TouchableOpacity
            style={[styles.cardAcao, { backgroundColor: colors.cardBlue }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MoodTracker')}
          >
            <SmilePlus size={28} color={colors.textDark} />
            <Text style={styles.labelAcao}>Rastreio de{'\n'}Humor</Text>
          </TouchableOpacity>

          {/* meditacao → vai pra aba de meditacao */}
          <TouchableOpacity
            style={[styles.cardAcao, { backgroundColor: colors.cardLilac }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Meditation')}
          >
            <Brain size={28} color={colors.textDark} />
            <Text style={styles.labelAcao}>Meditação</Text>
          </TouchableOpacity>

          {/* diario de gratidao → campo logo abaixo */}
          <TouchableOpacity
            style={[styles.cardAcao, { backgroundColor: colors.cardGreen }]}
            activeOpacity={0.8}
            onPress={() => {
              // so visual, o campo ta logo abaixo na tela
            }}
          >
            <NotebookPen size={28} color={colors.textDark} />
            <Text style={styles.labelAcao}>Diário de{'\n'}Gratidão</Text>
          </TouchableOpacity>
        </View>

        {/* campo de texto do diario de gratidao */}
        <View style={styles.cardGratidao}>
          <Text style={styles.gratidaoTitulo}>Gratidão de hoje</Text>
          <TextInput
            style={styles.gratidaoInput}
            placeholder="Pelo que você é grato(a) hoje?"
            placeholderTextColor={colors.textMuted}
            multiline
            value={textoGratidao}
            onChangeText={setTextoGratidao}
          />
          <TouchableOpacity
            style={styles.botaoSalvar}
            activeOpacity={0.8}
            onPress={salvarGratidao}
          >
            <Text style={styles.botaoSalvarTexto}>Salvar</Text>
          </TouchableOpacity>
        </View>

        {/* botão discreto de sair da conta */}
        <TouchableOpacity
          style={styles.botaoSair}
          activeOpacity={0.7}
          onPress={confirmarSair}
        >
          <Text style={styles.botaoSairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },

  // saudacao
  bemVindoTexto: {
    ...fonts.caption,
    color: colors.textMuted,
    marginBottom: 4,
  },
  saudacao: {
    ...fonts.titleLarge,
    color: colors.dark,
    marginBottom: 24,
  },

  // card frase diaria
  cardFrase: {
    backgroundColor: colors.primary,
    borderRadius: radius.card,
    padding: 20,
    marginBottom: 16,
  },
  fraseLabel: {
    ...fonts.caption,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontWeight: '600',
  },
  fraseTexto: {
    ...fonts.body,
    color: colors.white,
    fontWeight: '600',
    lineHeight: 22,
  },

  // card humor da semana
  cardHumor: {
    backgroundColor: colors.background,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 24,
  },
  cardHumorCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardHumorTitulo: {
    ...fonts.body,
    fontWeight: '700',
    color: colors.textDark,
  },
  cardHumorCorpo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  humorLabel: {
    ...fonts.body,
    fontWeight: '600',
    color: colors.textDark,
  },
  humorValor: {
    ...fonts.caption,
    color: colors.textMuted,
  },
  humorVazio: {
    ...fonts.body,
    color: colors.textMuted,
    marginBottom: 12,
  },
  linkRelatorio: {
    alignSelf: 'flex-start',
  },
  linkRelatorioTexto: {
    ...fonts.caption,
    color: colors.primary,
    fontWeight: '700',
  },

  // acoes rapidas
  tituloSecao: {
    ...fonts.titleMedium,
    fontSize: 18,
    color: colors.dark,
    marginBottom: 12,
  },
  filhaAcoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  cardAcao: {
    flex: 1,
    borderRadius: radius.card,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    gap: 8,
  },
  labelAcao: {
    ...fonts.caption,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
  },

  // diario de gratidao
  cardGratidao: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gratidaoTitulo: {
    ...fonts.body,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
  },
  gratidaoInput: {
    backgroundColor: colors.background,
    borderRadius: radius.button,
    padding: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    ...fonts.body,
    color: colors.textDark,
    marginBottom: 12,
  },
  botaoSalvar: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoSalvarTexto: {
    color: colors.white,
    ...fonts.body,
    fontWeight: '700',
  },
  botaoSair: {
    marginTop: 32,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  botaoSairTexto: {
    color: '#CC4444',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
