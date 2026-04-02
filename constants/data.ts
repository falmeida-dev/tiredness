import { icons } from "./icons";

export const tabs = [
    { name: "index", title: "home", icon: icons.home },
    { name: "mood", title: "humor", icon: icons.mood },
    { name: "meditate", title: "meditar", icon: icons.meditate },
    { name: "gratitude", title: "gratidão", icon: icons.gratitude },
    { name: "insights", title: "relatórios", icon: icons.activity },

]

export const HOME_USER = {
    name: "Fulano",
}

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