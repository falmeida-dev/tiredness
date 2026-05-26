import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, fonts, radius } from '../theme/colors';

// perguntas do quiz de burnout
const PERGUNTAS = [
  'Você se sente emocionalmente esgotado(a)?',
  'Você se sente frustrado(a) com suas atividades diárias?',
  'Você acha que está trabalhando/estudando demais?',
  'Você sente que não tem energia para realizar suas tarefas?',
  'Você tem a sensação de que não está alcançando nada?',
  'Você se sente desmotivado(a) e sem entusiasmo?',
];

// opcoes de resposta com valor numerico
const OPCOES = [
  { label: 'Nunca', value: 0 },
  { label: 'Raramente', value: 1 },
  { label: 'Às vezes', value: 2 },
  { label: 'Frequentemente', value: 3 },
  { label: 'Sempre', value: 4 },
];

export default function BurnoutQuizScreen({ navigation }: any) {
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultado, setResultado] = useState<{ nivel: string; cor: string; mensagem: string } | null>(null);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null);

  // quando o usuario escolhe uma opcao
  const handleEscolha = (valor: number) => {
    setOpcaoSelecionada(valor);

    // pequeno delay pra mostrar o feedback visual antes de avançar
    setTimeout(async () => {
      const novaPontuacao = pontuacao + valor;

      if (indicePergunta < PERGUNTAS.length - 1) {
        // vai pra proxima pergunta
        setPontuacao(novaPontuacao);
        setIndicePergunta(indicePergunta + 1);
        setOpcaoSelecionada(null);
      } else {
        // ultima pergunta, finaliza o quiz
        setPontuacao(novaPontuacao);
        await finalizarQuiz(novaPontuacao);
      }
    }, 400);
  };

  // calcula o nivel de burnout e salva o resultado
  const finalizarQuiz = async (pontuacaoFinal: number) => {
    let nivel = '';
    let cor = '';
    let mensagem = '';

    // define o nivel baseado na pontuacao total
    if (pontuacaoFinal <= 8) {
      nivel = 'Leve';
      cor = '#4CAF50';
      mensagem = 'Você está lidando bem com a sua rotina.';
    } else if (pontuacaoFinal <= 16) {
      nivel = 'Moderado';
      cor = '#FFC107';
      mensagem = 'Sinal de alerta. Considere descansar mais e repensar seus hábitos.';
    } else {
      nivel = 'Severo';
      cor = '#F44336';
      mensagem = 'Cuidado! Nível de exaustão alto. Procure apoio e priorize sua saúde.';
    }

    setResultado({ nivel, cor, mensagem });
    setMostrarResultado(true);

    try {
      // pega o usuario da sessao ativa
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userObj.firstAccess = false;
        
        // atualiza o usuario pra dizer que ja fez o quiz (firstAccess = false) na sessao ativa
        await AsyncStorage.setItem('user', JSON.stringify(userObj));

        // salva o resultado do burnout específico desse usuário
        const resultadoObj = { score: pontuacaoFinal, level: nivel, date: new Date().toISOString() };
        await AsyncStorage.setItem(`burnoutResult_${userObj.email}`, JSON.stringify(resultadoObj));

        // atualiza também na lista de usuários cadastrados (users_db)
        const usersDbStr = await AsyncStorage.getItem('users_db');
        if (usersDbStr) {
          const usersDb = JSON.parse(usersDbStr);
          if (Array.isArray(usersDb)) {
            const index = usersDb.findIndex(
              (u: any) => u && u.email && u.email.toLowerCase().trim() === userObj.email.toLowerCase().trim()
            );
            if (index !== -1) {
              usersDb[index].firstAccess = false;
              await AsyncStorage.setItem('users_db', JSON.stringify(usersDb));
            }
          }
        }
      }
    } catch (e) {
      console.log('deu erro ao salvar resultado do quiz:', e);
    }
  };

  // quando clica em "Começar" no resultado vai pra home
  const irParaHome = () => {
    navigation.replace('Main');
  };

  // tela de resultado
  if (mostrarResultado && resultado) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Resultado</Text>
          <View style={[styles.cardResultado, { borderColor: resultado.cor }]}>
            <Text style={[styles.nivelResultado, { color: resultado.cor }]}>{resultado.nivel}</Text>
            <Text style={styles.pontuacaoResultado}>{pontuacao} pontos</Text>
          </View>
          <Text style={styles.mensagemResultado}>{resultado.mensagem}</Text>
          <View style={styles.espacador} />
          <TouchableOpacity style={styles.botaoPrimario} onPress={irParaHome}>
            <Text style={styles.botaoPrimarioTexto}>Começar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // calcula o percentual da barra de progresso
  const percentualProgresso = (indicePergunta / PERGUNTAS.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* barra de progresso das perguntas */}
      <View style={styles.barraProgressoContainer}>
        <View style={[styles.barraProgresso, { width: `${percentualProgresso}%` }]} />
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.progressoTexto}>
          Pergunta {indicePergunta + 1} de {PERGUNTAS.length}
        </Text>
        <Text style={[styles.titulo, { marginBottom: 32 }]}>{PERGUNTAS[indicePergunta]}</Text>

        <View style={styles.opcoesContainer}>
          {OPCOES.map((opcao, index) => {
            const estaSelecionada = opcaoSelecionada === opcao.value;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.botaoOpcao, estaSelecionada && styles.botaoOpcaoSelecionado]}
                onPress={() => handleEscolha(opcao.value)}
                // desabilita depois de escolher pra nao deixar clicar de novo
                disabled={opcaoSelecionada !== null}
              >
                <Text style={[styles.textoOpcao, estaSelecionada && styles.textoOpcaoSelecionado]}>
                  {opcao.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  barraProgressoContainer: {
    height: 8,
    backgroundColor: colors.border,
    width: '100%',
  },
  barraProgresso: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  conteudo: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  progressoTexto: {
    ...fonts.caption,
    color: colors.textMuted,
    marginBottom: 12,
    textAlign: 'center',
  },
  titulo: {
    ...fonts.titleMedium,
    color: colors.dark,
    textAlign: 'center',
  },
  opcoesContainer: {
    width: '100%',
    gap: 12,
  },
  botaoOpcao: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: radius.button,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  botaoOpcaoSelecionado: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textoOpcao: {
    ...fonts.body,
    color: colors.textDark,
    textAlign: 'center',
    fontWeight: '600',
  },
  textoOpcaoSelecionado: {
    color: colors.white,
  },
  cardResultado: {
    borderWidth: 2,
    borderRadius: radius.card,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.white,
  },
  nivelResultado: {
    ...fonts.titleLarge,
    marginBottom: 8,
  },
  pontuacaoResultado: {
    ...fonts.titleMedium,
    color: colors.textMuted,
  },
  mensagemResultado: {
    ...fonts.body,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  espacador: {
    flex: 1,
  },
  botaoPrimario: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  botaoPrimarioTexto: {
    ...fonts.body,
    color: colors.white,
    fontWeight: 'bold',
  },
});
