# 💨 TiredNess
 
> Um app mobile para ajudar no controle e monitoramento do burnout no dia a dia.
 
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Projeto Acadêmico](https://img.shields.io/badge/Projeto-Acadêmico-E8724A?style=for-the-badge)
 
---
 
## 📖 Sobre o projeto
 
O **TiredNess** é um projeto acadêmico desenvolvido no curso de **Ciência da Computação (3º período)**, criado para atender duas disciplinas ao mesmo tempo: **Mobile Coding** e **Códigos de Alta Performance **.
 
A ideia surgiu de um problema real: o burnout (esgotamento profissional e acadêmico) é cada vez mais comum, especialmente entre estudantes e jovens profissionais, e poucas pessoas sabem identificar os sinais antes que piore.
 
O app permite que o usuário registre seu humor e energia diariamente, escutar músicas relaxantes e acompanhar sua evolução semanal por meio de relatórios simples e visuais.
 
---
 
## 📱 Telas
 
| Tela | O que faz |
|------|-----------|
| 🔐 Login e Cadastro | Autenticação local, sem servidor externo |
| 📋 Questionário de Burnout | Avaliação inicial do nível de esgotamento do usuário |
| 🏠 Home | Frase motivacional do dia, humor da semana e ações rápidas |
| 😊 Rastreio de Humor | Registro diário de humor e nível de energia |
| 🎵 Meditação | Player de áudio com músicas locais para relaxar |
| 📊 Relatório | Médias semanais, gráfico de humor e status de burnout |
 
---
 
## 🛠️ Tecnologias
 
- ⚛️ **React Native** — base do app mobile
- 📦 **Expo** — ambiente de desenvolvimento e build
- 🟦 **TypeScript** — tipagem estática no código
- 💾 **AsyncStorage** — armazenamento local de dados no dispositivo
- 🧭 **React Navigation** — navegação entre telas (Stack + Bottom Tabs)
- 🎵 **expo-av** — reprodução dos áudios de meditação
- 🎨 **lucide-react-native** — biblioteca de ícones
---
 
## 🚀 Como rodar o projeto
 
**Apenas android por enquanto:** basta acessar esse link logo abaixo e clicar em **Install**

https://expo.dev/accounts/fernando_asc/projects/tiredness/builds/7667860d-7ad9-426c-a727-45899b60cf4e

 
## 📁 Estrutura de pastas
 
```
front/
├── src/
│   ├── screens/       # Todas as telas do app
│   ├── navigation/    # Configuração das rotas e navegação
│   └── theme/         # Cores e tokens de design
├── assets/
│   └── audio/         # Faixas de áudio para a tela de meditação
├── App.tsx            # Ponto de entrada da aplicação
└── app.json           # Configurações do Expo
```
 
---
 
## ✅ Funcionalidades
 
- [x] Cadastro e login local (sem backend)
- [x] Suporte a múltiplos usuários no mesmo dispositivo
- [x] Questionário inicial de classificação de burnout
- [x] Check-in diário de humor e energia
- [x] Meditação com player de áudio local
- [x] Relatório semanal com gráfico de humor
- [x] Status de burnout calculado automaticamente
- [ ] Notificações de lembrete de check-in *(v2)*
- [ ] Sincronização entre dispositivos *(v2)*
---
 
## 👥 Feito por
 
**TiredNess Team** — Ciência da Computação, 3º período  
Projeto desenvolvido para as disciplinas de **Mobile Coding** e **Códigos de Alta Performance**.
 
> Feito para fins acadêmicos. 🎓
