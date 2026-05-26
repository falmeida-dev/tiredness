import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { AlertOctagon, AlertTriangle, CalendarCheck, ShieldCheck, Smile, Zap } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { colors, fonts, radius } from '../theme/colors';

// tipo do checkin — mesmo formato que o MoodTrackerScreen salva
type Checkin = {
  date: string;      
  timestamp: string;
  mood: number;      
  energy: number;   
};

// formata uma data como 'YYYY-MM-DD'
function formatarDataChave(d: Date): string {
  return (
    `${d.getFullYear()}-` +
    `${String(d.getMonth() + 1).padStart(2, '0')}-` +
    `${String(d.getDate()).padStart(2, '0')}`
  );
}

// retorna 'YYYY-MM-DD' de N dias atras em hora local
function localDateKey(diasAtras = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return formatarDataChave(d);
}

// pega o inicio da semana atual (segunda-feira a meia-noite)
function getInicioSemana(): Date {
  const hoje = new Date();
  const diff = hoje.getDay() === 0 ? 6 : hoje.getDay() - 1;
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() - diff);
  segunda.setHours(0, 0, 0, 0);
  return segunda;
}

// tipo do status de burnout
type StatusBurnout = 'verde' | 'amarelo' | 'vermelho' | 'sem_dados';

// calcula o status de burnout baseado nos checkins
function calcularStatusBurnout(checkins: Checkin[]): StatusBurnout {
  const inicioSemana = getInicioSemana();

  // filtra so os checkins desta semana
  const checkinsSemana: Checkin[] = [];
  for (let i = 0; i < checkins.length; i++) {
    const c = checkins[i];
    const dataCheckin = c.timestamp ? new Date(c.timestamp) : new Date(c.date + 'T12:00:00');
    if (dataCheckin >= inicioSemana) {
      checkinsSemana.push(c);
    }
  }

  //  quando não tem nenhum checkin na semana
  if (checkinsSemana.length === 0) {
    return 'sem_dados';
  }

  // só aparece se humor < 2 OU energia < 30 em 3 ou mais dias CONSECUTIVOS nos últimos 7 dias
  const ultimos7Dias: string[] = [];
  for (let i = 6; i >= 0; i--) {
    ultimos7Dias.push(localDateKey(i));
  }

  const diaFoiRuim = ultimos7Dias.map(data => 
    checkins.some(c => c.date === data && (c.mood < 2 || c.energy < 30))
  );

  let consecutivos = 0;
  let temSequenciaVermelha = false;
  for (const ruim of diaFoiRuim) {
    if (ruim) {
      consecutivos++;
      if (consecutivos >= 3) {
        temSequenciaVermelha = true;
      }
    } else {
      consecutivos = 0;
    }
  }

  if (temSequenciaVermelha) {
    return 'vermelho';
  }

  // calcula media de humor e energia da semana
  let somaHumor = 0;
  let somaEnergia = 0;
  for (let i = 0; i < checkinsSemana.length; i++) {
    somaHumor += checkinsSemana[i].mood;
    somaEnergia += checkinsSemana[i].energy;
  }
  const mediaHumor = somaHumor / checkinsSemana.length;
  const mediaEnergia = somaEnergia / checkinsSemana.length;

  // mediaHumor >= 3 E mediaEnergia >= 50
  if (mediaHumor >= 3 && mediaEnergia >= 50) {
    return 'verde';
  }

  // mediaHumor >= 3 E mediaEnergia < 50 
  return 'amarelo';
}

// retorna as infos de exibicao baseado no status
function getInfoBurnout(status: StatusBurnout): { cor: string; titulo: string; mensagem: string } {
  if (status === 'verde') {
    return {
      cor: '#4CAF50',
      titulo: 'Você está bem!',
      mensagem: 'Você está equilibrado! Continue assim.',
    };
  }
  if (status === 'amarelo') {
    return {
      cor: '#FFC107',
      titulo: 'Atenção ao equilíbrio',
      mensagem: 'Sua energia está um pouco baixa. Tente descansar mais.',
    };
  }
  if (status === 'vermelho') {
    return {
      cor: '#F44336',
      titulo: 'Risco de esgotamento',
      mensagem: 'Você está apresentando sinais de esgotamento. Considere conversar com alguém.',
    };
  }
  // status === 'sem_dados'
  return {
    cor: '#9E9E9E',
    titulo: 'Sem dados',
    mensagem: 'Nenhum registro essa semana. Que tal fazer seu primeiro check-in?',
  };
}

// retorna o icone certo pro status de burnout
function IconeBurnout({ status }: { status: StatusBurnout }) {
  if (status === 'verde') return <ShieldCheck size={28} color="#4CAF50" />;
  if (status === 'amarelo') return <AlertTriangle size={28} color="#FFC107" />;
  if (status === 'vermelho') return <AlertOctagon size={28} color="#F44336" />;
  // status === 'sem_dados'
  return <AlertTriangle size={28} color="#9E9E9E" />;
}

// tela de relatorio
export default function ReportScreen() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);

  // recarrega sempre que a aba ganhar foco
  useFocusEffect(
    useCallback(() => {
      carregarCheckins();
    }, []),
  );

  // pega os checkins salvos no celular
  async function carregarCheckins() {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const raw = await AsyncStorage.getItem(`checkins_${user.email}`);
        const lista = raw ? JSON.parse(raw) : [];
        setCheckins(Array.isArray(lista) ? lista : []);
      } else {
        setCheckins([]);
      }
    } catch (e) {
      console.log('deu erro ao carregar checkins:', e);
      setCheckins([]);
    }
  }

  // filtra os checkins da semana atual
  const inicioSemana = getInicioSemana();
  const checkinsSemana: Checkin[] = [];
  for (let i = 0; i < checkins.length; i++) {
    const c = checkins[i];
    const dataCheckin = c.timestamp ? new Date(c.timestamp) : new Date(c.date + 'T12:00:00');
    if (dataCheckin >= inicioSemana) {
      checkinsSemana.push(c);
    }
  }

  // calcula a media de humor da semana
  let mediaHumor: number | null = null;
  if (checkinsSemana.length > 0) {
    let soma = 0;
    for (let i = 0; i < checkinsSemana.length; i++) {
      soma += checkinsSemana[i].mood;
    }
    mediaHumor = soma / checkinsSemana.length;
  }

  // calcula a media de energia da semana
  let mediaEnergia: number | null = null;
  if (checkinsSemana.length > 0) {
    let soma = 0;
    for (let i = 0; i < checkinsSemana.length; i++) {
      soma += checkinsSemana[i].energy;
    }
    mediaEnergia = soma / checkinsSemana.length;
  }

  // conta quantos dias unicos tiveram checkin nesta semana
  const datasUnicas = new Set<string>();
  for (let i = 0; i < checkinsSemana.length; i++) {
    datasUnicas.add(checkinsSemana[i].date);
  }
  const diasComCheckin = datasUnicas.size;

  // calcula o status de burnout
  const statusBurnout = calcularStatusBurnout(checkins);
  const infoBurnout = getInfoBurnout(statusBurnout);

  // monta os dados do grafico dos ultimos 7 dias
  const ROTULOS = ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Hoje'];
  const barras = [];
  for (let i = 0; i < 7; i++) {
    const chave = localDateKey(6 - i);
    let valorMood = 0;
    // procura se tem checkin nesse dia
    for (let j = 0; j < checkins.length; j++) {
      if (checkins[j].date === chave) {
        valorMood = checkins[j].mood;
        break;
      }
    }
    barras.push({ value: valorMood, label: ROTULOS[i], frontColor: '#E8724A' });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>Relatório</Text>

      {/* card de humor medio da semana */}
      <View style={styles.card}>
        <View style={styles.cardCabecalho}>
          <Smile size={18} color={colors.textMuted} />
          <Text style={styles.cardRotulo}>Humor médio da semana</Text>
        </View>
        {mediaHumor !== null ? (
          <Text style={styles.cardValor}>{mediaHumor.toFixed(1)} / 5</Text>
        ) : (
          <Text style={styles.cardVazio}>Sem dados esta semana</Text>
        )}
      </View>

      {/* card de energia media da semana */}
      <View style={styles.card}>
        <View style={styles.cardCabecalho}>
          <Zap size={18} color={colors.textMuted} />
          <Text style={styles.cardRotulo}>Energia média da semana</Text>
        </View>
        {mediaEnergia !== null ? (
          <Text style={styles.cardValor}>{Math.round(mediaEnergia)}%</Text>
        ) : (
          <Text style={styles.cardVazio}>Sem dados esta semana</Text>
        )}
      </View>

      {/* card de dias com checkin */}
      <View style={styles.card}>
        <View style={styles.cardCabecalho}>
          <CalendarCheck size={18} color={colors.textMuted} />
          <Text style={styles.cardRotulo}>Dias com check-in esta semana</Text>
        </View>
        <Text style={styles.cardValor}>{diasComCheckin} / 7</Text>
      </View>

      {/* card de status de burnout com icone colorido */}
      <View style={[styles.cardBurnout, { borderColor: infoBurnout.cor }]}>
        <IconeBurnout status={statusBurnout} />
        <Text style={[styles.burnoutTitulo, { color: infoBurnout.cor }]}>
          {infoBurnout.titulo}
        </Text>
        <Text style={styles.burnoutMensagem}>{infoBurnout.mensagem}</Text>
      </View>

      {/* grafico de barras dos ultimos 7 dias */}
      <Text style={styles.graficoTitulo}>Humor – últimos 7 dias</Text>
      <View style={styles.graficoCard}>
        <BarChart
          data={barras}
          barWidth={28}
          spacing={14}
          roundedTop
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: colors.textMuted, fontSize: 11 }}
          xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 11 }}
          noOfSections={5}
          maxValue={5}
          height={160}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  titulo: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 24,
  },

  // card de estatistica
  card: {
    backgroundColor: '#F0E8D8',
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  cardCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardRotulo: {
    ...fonts.caption,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValor: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
  },
  cardVazio: {
    ...fonts.body,
    color: colors.textMuted,
    fontStyle: 'italic',
  },

  // card de burnout
  cardBurnout: {
    backgroundColor: '#F0E8D8',
    borderRadius: radius.card,
    borderWidth: 2,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    gap: 8,
  },
  burnoutTitulo: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  burnoutMensagem: {
    ...fonts.body,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 22,
  },

  // grafico
  graficoTitulo: {
    ...fonts.body,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  graficoCard: {
    backgroundColor: '#F0E8D8',
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
    overflow: 'hidden',
  },
});
