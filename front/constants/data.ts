import { icons } from "./icons";

export const tabs = [
    { name: "index", title: "home", icon: icons.home },
    { name: "mood", title: "humor", icon: icons.mood },
    { name: "meditate", title: "meditar", icon: icons.meditate },
    { name: "gratitude", title: "gratidão", icon: icons.gratitude },
    { name: "insights", title: "relatórios", icon: icons.activity },
]


export const HOME_PHRASES = {
    motivational: "Acredite sempre em si mesmo e em sua capacidade de superar desafios. Você é mais forte do que imagina!",
    author: "TiredNess Team"
}

export const FLASHCARDS = [
    {
        id: "mood",
        img: require('../assets/images/img-card-music-blue.png'),
        title: "Rastreio de Humor",
        description: "Registre seu humor diário e acompanhe suas variações.",
        page: "mood",
        color: "#b8d4e3"
    },
    {
        id: "meditate",
        img: require('../assets/images/img-card-music-red.png'),
        title: "Meditação",
        description: "Pratique a meditação diária para melhorar sua concentração e reduzir o estresse.",
        page: "meditate",
        color: "#e8def8"
    },
    {
        id: "insights",
        img: require('../assets/images/img-card-music-green.png'),
        title: "Diário de gratidão",
        description: "Anote diariamente coisas pelas quais você é grato para cultivar uma mentalidade positiva.",
        page: "gratitude",
        color: "#8BCBB8"
    },
]

// dados para o formulário de burnout
export const QUESTIONS = [
    {
    id: 1,
    text: 'Com que frequência você se sente emocionalmente esgotado pelo trabalho ou pelos estudos?',
  },
  {
    id: 2,
    text: 'Você tem dificuldade em se concentrar nas tarefas do dia a dia?',
  },
  {
    id: 3,
    text: 'Você sente que seu desempenho caiu mesmo se esforçando?',
  },
  {
    id: 4,
    text: 'Você se distancia emocionalmente das pessoas ao seu redor (amigos, família, colegas)?',
  },
  {
    id: 5,
    text: 'Você sente que acordar para mais um dia de trabalho ou estudo é algo difícil ou angustiante?',
  },
  {
    id: 6,
    text: 'Você sente que suas conquistas não têm valor ou que nada do que faz é suficiente?',
  },
];

export const OPTIONS = [
  { label: 'Nunca',           value: 0 },
  { label: 'Às vezes',        value: 1 },
  { label: 'Frequentemente',  value: 2 },
  { label: 'Sempre',          value: 3 },
];