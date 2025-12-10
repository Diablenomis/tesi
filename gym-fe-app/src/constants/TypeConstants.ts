export const HOMEPAGE_CARD_TYPE_SCHEDA_TUTORIAL = "scheda-tutorial";
export const HOMEPAGE_CARD_TYPE_SCHEDA_PERSONALIZZATA = "scheda-personalizzata";
export const HOMEPAGE_CARD_TYPE_COACHING = "coaching";
export const HOMEPAGE_CARD_TYPE_ABOUT_US = "about-us";
export const HOMEPAGE_CARD_TYPE_PERSONAL_AREA = "personal-area";

export const PAGE_TYPE_HOMEPAGE = "page-homepage";
export const PAGE_TYPE_SCHEDA_TUTORIAL = "page-scheda-tutorial";
export const PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL = "page-scheda-tutorial-detail";
export const PAGE_TYPE_SCHEDA_TUTORIAL_DETAIL_USER =
  "page-scheda-tutorial-detail-user";
export const PAGE_TYPE_SCHEDA_PERSONALIZZATA = "page-scheda-personalizzata";
export const PAGE_TYPE_COACHING = "page-coaching";

export const PAGE_TYPE_PROFILE = "page-profile";
export const PAGE_TYPE_ABOUT_US = "page-about-us";

export const FILTER_TYPE_TUTORIAL = "tutorial";
export const FILTER_TYPE_COACHING = "coaching";

export const PACK_BODY_PART_TYPE = [
  {
    key: "PETTO",
    name: "Petto",
    class: "pack-card-petto-icon",
  },
  {
    key: "ADDOMINALI",
    name: "Addominali",
  },
  {
    key: "BRACCIA",
    name: "Braccia",
  },
  {
    key: "GAMBE",
    name: "Gambe",
  },
  {
    key: "SCHIENA",
    name: "Schiena",
  },
  {
    key: "COMPLETO",
    name: "Completo",
  },
];
export const SUB_TYPES = {
  coaching_online: "coaching-online",
  scheda_personalizzata: "scheda-personalizzata",
};
export const PACK_DISCIPLINE_TYPE = [
  {
    key: "calisthenics",
    name: "Calisthenics",
  },
  {
    key: "Powerlifting",
    name: "Powerlifting",
  },
  {
    key: "post_fisioterapia_dopo_infortunio",
    name: "Post fisioterapia dopo infortunio",
  },
  {
    key: "posturale_rieducazione_motoria",
    name: "Posturale rieducazione motoria",
  },
];

export const PACK_LEVEL_TYPE = [
  {
    key: "PRIMI_PASSI",
    name: "Primi passi",
  },
  {
    key: "BASE",
    name: "Base",
  },
  {
    key: "INTERMEDIO",
    name: "Intermedio",
  },
  {
    key: "AVANZATO",
    name: "Avanzato",
  },
  {
    key: "MASTER",
    name: "Master",
  },
];

export const LS_USER = "FitNexus_user";
export const LS_USER_TYPE = "FitNexus_user_type";
export const LS_ACCESS_TOKEN = "FitNexus_access_token";
export const LS_REFRESH_TOKEN = "FitNexus_refresh_token";
export const LS_IS_ADMIN = "isAdmin";
export const LS_IS_COACH = "idCoach";
export const LS_IS_CUSTOMER = "isCustomer";
export const BASE_VIDEO_URL = "https://vimeo.com/";
export const HOMEPAGE_VIDEO_URL = "https://vimeo.com/791474012";

export const tools_to_use: {
  answerGiven: String;
  tools: string[];
}[] = [
  {
    answerGiven: "Casa",
    tools: [
      "parallele basse",
      "parallele alte",
      "elastico corto resistenza bassa",
      "elastico corto resistenza media",
      "elastico corto resistenza alta",
      "elastico lungo sottile",
      "elastico lungo medio",
      "elastico lungo spesso",

      "anelli",
      "sbarra (per trazioni)",
      "kettlebell",
      "step",
      "fitball",
      "manubri",
      "bilanciere",
      "panca piana",
      "panca regolabile",
      "cavigliere peso",
      "yoga foam brick",
      "hand grip",
      "ABS roll",
      "corda",
      "bosu",
      "inferriate o infissi per elastici",
      "polsini",
      "gomitiere",
      "tappetino fitness",
      "elastico stoffa",
    ],
  },
  {
    answerGiven: "HomeFitNexus",
    tools: [
      "parallele basse",
      "parallele alte",
      "elastico corto resistenza bassa",
      "elastico corto resistenza media",
      "elastico corto resistenza alta",
      "elastico lungo sottile",
      "elastico lungo medio",
      "elastico lungo spesso",
      "anelli",
      "kettlebell",
      "step",
      "fitball",
      "manubri",
      "bilanciere",
      "panca piana",
      "panca regolabile",
      "cavigliere peso",
      "yoga foam brick",
      "hand grip",
      "ABS roll",
      "corda",
      "bosu",
      "inferriate o infissi per elastici",
      "straps",
      "ginocchiere",
      "board press",
      "scarpe Powerlifting",
      "cinta",
      "polsini",
      "gomitiere",
      "battle roap",
      "tappetino fitness",
      "elastico stoffa",
      "blocchi",
    ],
  },
  {
    answerGiven: "Palestra",
    tools: [
      "parallele basse",
      "parallele alte",
      "elastico corto resistenza bassa",
      "elastico corto resistenza media",
      "elastico corto resistenza alta",
      "elastico lungo sottile",
      "elastico lungo medio",
      "elastico lungo spesso",
      "anelli",
      "kettlebell",
      "step",
      "fitball",
      "manubri",
      "bilanciere",
      "panca piana",
      "panca regolabile",
      "cavigliere peso",
      "yoga foam brick",
      "hand grip",
      "ABS roll",
      "corda",
      "bosu",
      "inferriate o infissi per elastici",
      "straps",
      "ginocchiere",
      "board press",
      "scarpe Powerlifting",
      "cinta",
      "polsini",
      "gomitiere",
      "battle roap",
      "tappetino fitness",
      "elastico stoffa",
      "blocchi",
    ],
  },
  {
    answerGiven: "Parco",
    tools: [
      "parallele basse",
      "parallele alte",
      "elastico corto resistenza bassa",
      "elastico corto resistenza media",
      "elastico corto resistenza alta",
      "elastico lungo sottile",
      "elastico lungo medio",
      "elastico lungo spesso",
      "anelli",
      "sbarra (per trazioni)",
      "kettlebell",
      "step",
      "fitball",
      "manubri",
      "bilanciere",
      "panca piana",
      "panca regolabile",
      "cavigliere peso",
      "yoga foam brick",
      "hand grip",
      "ABS roll",
      "corda",
      "bosu",
      "inferriate o infissi per elastici",
      "polsini",
      "gomitiere",
      "tappetino fitness",
      "elastico stoffa",
    ],
  },
];
export const marks = [
  {
    value: 1,
    label: "Pessimo",
  },
  {
    value: 2,
    label: "Scarso",
  },
  {
    value: 3,
    label: "Mediocre",
  },
  {
    value: 4,
    label: "Buono",
  },
  {
    value: 5,
    label: "Eccelso",
  },
];
export const formQuestions: {
  question: string;
  type: string;
  answer: string[];
  obbligatory: boolean;
  order: number;
}[] = [
  // 0 nop
  {
    question: "",
    type: "input",
    answer: [],
    obbligatory: false,
    order: 500,
  },

  // 1 nop
  {
    question: "",
    type: "input",
    answer: [],
    obbligatory: false,
    order: 500,
  },

  // 2 nop
  {
    question: "",
    type: "select",
    answer: ["Maschio", "Femmina"],
    obbligatory: false,
    order: 500,
  },

  // 3 nop
  {
    question: "",
    type: "date",
    answer: [],
    obbligatory: false,
    order: 500,
  },

  // 4 ok
  {
    question: "Altezza",
    type: "input",
    answer: [],
    obbligatory: true,
    order: 1,
  },

  // 5 ok
  {
    question: "Peso",
    type: "inputKG",
    answer: [],
    obbligatory: true,
    order: 2,
  },

  // 6 ok
  {
    question:
      "Eventuali dolori frequenti/problemi posturali/infortuni/patologie",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 3,
  },

  // 7 ok
  {
    question: "Stile di vita",
    type: "select",
    answer: [
      "Sedentari{sex} (0 allenamenti)",
      "Poco attiv{sex} (1 allenamenti)",
      "Attiv{sex} (2 allenamenti)",
      "Molto attiv{sex} (3-4 allenamenti)",
      "Pro (5+ allenamenti)",
    ],
    obbligatory: true,
    order: 4,
  },

  // 8 ok
  {
    question: "Livello stress quotidiano",
    type: "slice",
    answer: ["1", "5"],
    obbligatory: true,
    order: 8,
  },

  // 9 ok
  {
    question: "Attualmente ti alleni?",
    type: "selectCustom1",
    answer: ["Si", "No"],
    obbligatory: true,
    order: 5,
  },

  // 10 ok-ish
  {
    question: "Ti sei mai allenat{sex} in passato?",
    type: "selectCustom2",
    answer: ["Si", "No"],
    obbligatory: false,
    order: 7,
  },

  // 11 ok
  {
    question: "Scrivi tutte le attività che hai praticato e per quanto tempo",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 10,
  },

  // 12 nop
  {
    question: "",
    type: "selectCustomSi",
    answer: ["Da meno di 1 anno", "1-2 anni", "3+ anni"],
    obbligatory: false,
    order: 50000,
  },

  // 13 ok
  {
    question:
      "Ti sei sempre allenat{sex} da sol{sex}, o vieni da un allenamento con un coach?",
    type: "selectCustomSi2",
    answer: ["Solo", "Coach"],
    obbligatory: false,
    order: 6,
  },

  // 14 ok
  {
    question: "Quante volte vorresti allenarti a settimana?",
    type: "selectCustom3",
    answer: ["2", "3", "4", "5", "6"],
    obbligatory: true,
    order: 11,
  },

  // 15 ok
  {
    question: "Quanto tempo vuoi che duri un allenamento?",
    type: "select",
    answer: [
      "30 minuti",
      "45 minuti",
      "1 ora",
      "1 ora e 15 minuti",
      "1 ora e 30 minuti",
      "2 ore",
      "2 ore e 30 minuti",
    ],
    obbligatory: true,
    order: 13,
  },

  // 16 ok
  {
    question: "Quali sono i tuoi obiettivi",
    type: "selectMultiple",
    answer: [
      "Aumento massa muscolare",
      "Perdita peso (massa grassa)",
      "Miglioramento estetico",
      "Miglioramento mobilità e flessibilità",
      "Recupero da infortunio post fisioterapico",
      "Migliorare resistenza",
      // "Altro",
    ],
    obbligatory: true,
    order: 14,
  },

  // 17 ok
  {
    question: "Quante ore dormi al giorno?",
    type: "slice",
    answer: ["1", "12"],
    obbligatory: true,
    order: 9,
  },

  // 18 ok
  {
    question: "Dove ti allenerai",
    type: "selectMultiple",
    answer: ["Casa", "Palestra", "Parco", "HomeFitNexus"],
    obbligatory: true,
    order: 16,
  },

  // 19 ok
  {
    question:
      "Selezionare piccoli oggetti e/o attrezzi che potresti utilizzare",
    type: "selectMultiple",
    answer: ["risposte non qui ma in tools_to_use"],
    obbligatory: false,
    order: 18,
  },

  // 20 ok
  {
    question: "Selezionare grandi attrezzi/macchinari che potresti utilizzare",
    type: "selectMultiple",
    answer: [
      "spalliera",
      "rack",
      "multipower",
      "leg press",
      "leg curl seduto",
      "leg curl sdraiato",
      "abductor e addutor machine",
      "hyperextention",
      "glutes machine",
      "rear kick",
      "leg press orizzontale",
      "leg press verticale",
      "leg press inclinata",
      "hack squat",
      "pendulum squat",
      "safety squat bar",
      "cable station",
      "trapp bar",
      "cavi",
      "corda",
      "belt squat machine",
      "hip thrust machine",
      "panca piana",
      "panca inclinata",
      "chest press",
      "pectoral fly",
      "lat machine",
      "low row",
      "t-bar",
      "high row",
      "pulley row",
      "shoulder press",
      "lateral raise machine",
      "curl machine",
      "tapis roulant",
      "cyclette",
      "vogatore",
      "ellittica",
      "stairs master machine",
    ],
    obbligatory: false,
    order: 19,
  },

  // 21
  {
    question: "",
    type: "",
    answer: [],
    obbligatory: false,
    order: 500,
  },

  // 22
  {
    question: "Quanto tempo riesci a stare in plank?",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 20,
  },

  // 23
  {
    question: "Massimale piegamenti a terra?",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 21,
  },

  // 24
  {
    question: "Massimale squat a corpo libero",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 22,
  },

  // 25 ok
  {
    question:
      "Specifica i tuoi obiettivi e/o se hai qualche richiesta in particolare",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 15,
  },

  // 26
  {
    question:
      "Se hai riscontrato problematiche durante i test, ti chiediamo di segnalarci quali sono i tuoi punti carenti",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 34,
  },
  // 27
  {
    question: "",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 500,
  },

  // 28

  {
    question: "Se hai dei pesi specifici scrivili qui",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 20,
  },
  // 29
  {
    question: "",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 500,
  },
  // 30 nop
  {
    question: "",
    type: "selectMultiple",
    answer: [],
    obbligatory: false,
    order: 500,
  },

  //31
  {
    question: "Massimale trazioni supine/prone?",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 23,
  },

  //32
  {
    question: "Massimale 1RM panca? (peso massimale per una ripetizione)",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 23,
  },

  //33
  {
    question: "Massimale 1RM squat? (peso massimale per una ripetizione)",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 23,
  },
  //34
  {
    question:
      "Massimale 1RM stacco regular/sumo? (peso massimale per una ripetizione)",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 23,
  },

  // 35
  {
    question: "Deep squat con mani dietro la nuca",
    type: "slice",
    answer: ["1", "5"],
    obbligatory: false,
    order: 28,
  },
  // 36
  {
    question: "Shoulder mobility bastone/elastico - braccio destro basso",
    type: "slice",
    answer: ["1", "5"],
    obbligatory: false,
    order: 27,
  },
  // 37
  {
    question: "Active straight leg raise - gamba destra alta",
    type: "slice",
    answer: ["1", "5"],
    obbligatory: false,
    order: 24,
  },
  // 38
  {
    question: "Wall y",
    type: "slice",
    answer: ["1", "5"],
    obbligatory: false,
    order: 29,
  },

  //39
  {
    question:
      "Quanto consideri importante il ruolo dell'alimentazione nel raggiungimento dei tuoi obiettivi di salute e forma fisica?",
    type: "select",
    answer: ["Non conta nulla", "Poco", "È importante", "È fondamentale"],
    obbligatory: false,
    order: 30,
  },

  //40
  {
    question:
      "Hai mai notato una relazione tra ciò che mangi e le tue prestazioni durante gli allenamenti o la tua capacità di recuperare? ",
    type: "select",
    answer: ["No", "Non ci ho mai fatto caso", "Si"],
    obbligatory: false,
    order: 31,
  },
  //41
  {
    question:
      "Hai mai avvertito difficoltà nel raggiungere i tuoi obiettivi di fitness nonostante l'impegno negli allenamenti?",
    type: "select",
    answer: ["No", "Si ma non ho mai capito perché", "Si"],
    obbligatory: false,
    order: 32,
  },

  //42
  {
    question:
      "Hai mai provato a seguire una dieta specifica per raggiungere i tuoi obiettivi di fitness?",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 33,
  },
  // 43
  {
    question: "Active straight leg raise - gamba sinistra alta",
    type: "slice",
    answer: ["1", "5"],
    obbligatory: false,
    order: 25,
  },
  // 44
  {
    question: "Shoulder mobility bastone/elastico - braccio sinistro basso",
    type: "slice",
    answer: ["1", "5"],
    obbligatory: false,
    order: 26,
  },
  // 45 ok
  {
    question:
      "Quante volte ti vuoi allenare a settimana per ogni luogo che hai selezionato?",
    type: "inputArea",
    answer: [],
    obbligatory: false,
    order: 17,
  },

  // 46 ok
  {
    question:
      "Indica i giorni della settimana in cui prevedi di allenarti (Es: Lunedì - Mercoledì - Venerdì)",
    type: "inputArea",
    answer: [],
    obbligatory: true,
    order: 12,
  },
  // 47 ok
  {
    question:
      "Inserisci un'immagine di te stesso",
    type: "image",
    answer: [],
    obbligatory: false,
    order: 499,
  },
];

export const pageDescriptions: {
  personalizzata: { main: string; secondary: string[] }[];
  coaching: { main: string; secondary: string[] }[];
  tutorial: { main: string; secondary: string[] }[];
  fitNexus: { main: string; secondary: string[] }[];
  personal: { main: string; secondary: string[] }[];
} = {
  personalizzata: [
    {
      main: "Piano di allenamento personalizzato dalle durata di 5 settimane, ci baseremo su:",
      secondary: [
        "I tuoi obiettivi",
        "La tua condizione fisica, considerando anche eventuali problemi fisici e infortuni",
        "La tua disponibilità temporale per allenarti (posso allenarmi 4 volte a settimana per 2 ore)",
        "L’attrezzatura a tua disposizione (mi alleno a casa ed ho queste cose, mi alleno in palestra, mi alleno al parco..)",
      ],
    },
    {
      main: "Feedback a distanza di una settimana per aggiustare la scheda in caso di necessità",
      secondary: [],
    },
    {
      main: "Accesso alla community telegram dove poter porre domande e inviare video relativi al tuo allenamento",
      secondary: [],
    },
    {
      main: "Accesso alla piattaforma, PER SEMPRE, e alla tua area personale dove poter visualizzare tutte le tue schede acquistate",
      secondary: [],
    },
    {
      main: "Ogni scheda è composta da una serie di esercizi a partire dal riscaldamento fino alla fase finale di stretching ed è possibile scaricarla in pdf in modo da averla sempre a portata di mano anche in condizioni dove non si ha internet o non si vuole usare il telefono. Ogni esercizio ha:",
      secondary: [
        "Un certo numero di ripetizioni per un certo numero di serie",
        "Tempo di recupero tra una serie e l’altra",
        "Video dell’esecuzione dell’esercizio",
        "Spiegazione scritta con focus sugli errori comuni da evitare (in futuro)",
      ],
    },
    {
      main: "Check iniziale tramite foto (facoltativo ma fortemente consigliato)",
      secondary: [],
    },
    {
      main: "Una volta acquistato un nostro servizio avrai per sempre la possibilità di accedere alla piattaforma e visualizzare le tue vecchie schede. Attenzione però, per ottenere risultati è fondamentale cambiare scheda, altrimenti ti troverai in una fase di stallo",
      secondary: [],
    },
  ],
  coaching: [
    {
      main: "Piano di allenamento personalizzato dalle durata di 5 settimane, ci baseremo su:",
      secondary: [
        "i tuoi obiettivi",
        "la tua condizione fisica, considerando anche eventuali problemi fisici e infortuni",
        "la tua disponibilità temporale per allenarti (posso allenarmi 4 volte a settimana per 2 ore)",
        "l’attrezzatura a tua disposizione(mi alleno a casa ed ho queste cose, mi alleno in palestra, mi alleno al parco..)",
      ],
    },
    {
      main: "Accesso alla piattaforma, PER SEMPRE*, e alla tua area personale dove poter visualizzare tutte le tue schede acquistate",
      secondary: [],
    },
    {
      main: "Ogni scheda è composta da una serie di esercizi a partire dal riscaldamento fino alla fase finale di stretching ed è possibile scaricarla in pdf in modo da averla sempre a portata di mano anche in condizioni dove non si ha internet o non si vuole usare il telefono. Ogni esercizio ha:",
      secondary: [
        "Un certo numero di ripetizioni per un certo numero di serie",
        "Tempo di recupero tra una serie e l’altra",
        "Video dell’esecuzione dell’esercizio",
        "Spiegazione scritta con focus sugli errori comuni da evitare (in futuro)",
      ],
    },
    {
      main: "Possibilità di scegliere il personal trainer da cui farsi seguire e chat diretta tramite whatsapp con lui/lei per poter inviare domande e video delle esecuzioni degli esercizi",
      secondary: [],
    },
    {
      main: "Check iniziale in videochiamata",
      secondary: [],
    },
    {
      main: "Una volta acquistato un nostro servizio avrai per sempre la possibilità di accedere alla piattaforma e visualizzare le tue vecchie schede. Attenzione però, per ottenere risultati è fondamentale cambiare scheda, altrimenti ti troverai in una fase di stallo",
      secondary: [],
    },
  ],
  tutorial: [
    {
      main: "Sono schede preimpostate per aiutarti a raggiungere un obiettivo specifico. \nOgni scheda è divisa in vari livelli di difficoltà, dal più semplice al più complesso, da scegliere in base al tuo livello attuale. Facciamo anche distinzione di sesso per via della differente strutta corporea che c’è tra uomo e donna",
      secondary: [],
    },
    {
      main: "Comprando una scheda tutorial:",
      secondary: [
        "Ti garantiamo di riuscire a raggiungere l’obiettivo finale se seguirai l’allenamento che ti proponiamo",
        "Accesso alla piattaforma, PER SEMPRE*, e alla tua area personale dove poter visualizzare tutte le tue schede acquistate",
        "Ogni scheda è composta da una serie di esercizi a partire dal riscaldamento fino alla fase finale di stretching ed è possibile scaricarla in pdf in modo da averla sempre a portata di mano anche in condizioni dove non si ha internet o non si vuole usare il telefono",
      ],
    },
    {
      main: "Ogni esercizio ha:",
      secondary: [
        "Un certo numero di ripetizioni per un certo numero di serie",
        "Tempo di recupero tra una serie e l’altra",
        "Video dell’esecuzione dell’esercizio con spiegazione a voce e scritta",
      ],
    },
    {
      main: "Una volta acquistato un nostro servizio avrai per sempre la possibilità di accedere alla piattaforma e visualizzare le tue vecchie schede. Attenzione però, per ottenere risultati è fondamentale cambiare scheda, altrimenti ti troverai in una fase di stallo",
      secondary: [],
    },
  ],
  fitNexus: [
    {
      main: "FitNexus è un progetto che si propone di aiutare le persone che amano allenarsi e che vogliono raggiungere i loro obiettivi nel mondo del fitness attraverso la vendita di servizi di allenamento personalizzati su una piattaforma online",
      secondary: [],
    },
    {
      main: "Il team di FitNexus è composto da cinque coach altamente specializzati in diversi settori del fitness. Per via della loro specializzazione e dei valori che li uniscono, FitNexus si rivolge a un pubblico che cerca qualcosa di più rispetto ai soliti obiettivi di mettere massa o dimagrire",
      secondary: [],
    },
    {
      main: "Il logo presenta un font abbastanza movimentato, rotondo, non statico visto lo scambio di colori e, sicuramente, non un design segmentato con linee dritte. Questo permette di creare armonia, movimento e quindi una sensazione piacevole da parte dell'utente che lo visualizza. Il fitness è movimento, armonia del corpo, qualcosa che ci modella, come gli angoli arrotondati del font. Il simbolo della pausa rappresenta il play dei video presenti nella piattaforma, ovvero la modalità di erogazione del servizio, e, infine, un uomo con dei muscoli stilizzato, che rappresenta il fitness e l'allenamento, la forza di avere la costanza e la determinazione per",
      secondary: [],
    },
    {
      main: 'FitNexus si chiama così perché il fitness è alla base della salute delle persone questo è l\'obiettivo principale del progetto: aiutare le persone a muoversi meglio e a raggiungere i loro obiettivi di allenamento. Il nome "FitNexus" vuole anche trasmettere l’idea di innovazione e miglioramento dei servizi ed è ciò che FitNexus si prefissa di raggiungere. Infine, "Nexus" significa connessione, e questo rappresenta il collegamento tra il coach e l\'utente, che avviene attraverso la piattaforma online.',
      secondary: [],
    },
    {
      main: "A chi ci rivolgiamo:",
      secondary: [
        "Persone che già si allenano, seguendo un allenamento fatto dal personal trainer della palestra o facendo da soli in base alle conoscenze acquisite con l’esperienza. Queste persone però sono in fase di stallo o vorrebbero qualcosa in più",
        "Persone che hanno degli obiettivi più specifici rispetto al semplice voglio dimagrire o voglio mettere massa, obiettivi che non riescono a raggiungere da soli o con il personal trainer della palestra",
        "Persone che hanno o hanno avuto problemi fisici e quindi hanno bisogno di un allenamento personalizzato che tenga in considerazione il loro problema",
        "Persone che hanno già avuto esperienze con servizi online di allenamento ma sono rimaste insoddisfatte",
      ],
    },
    {
      main: "Perché affidarsi a noi?",
      secondary: [
        "Perché il coaching online è diverso dall’allenamento dal vivo e per saperlo fare bene c’è bisogno di esperienza, cosa che noi abbiamo",
        "Perché dietro FitNexus non c’è una persona ma un team di coach con specializzazioni diverse",
        "Per la piattaforme che c’è dietro",
        "Perchè offriamo servizi su misura per te",
        "Perchè non trovi altri servizi come il nostro",
      ],
    },
  ],
  personal: [
    {
      main: "Descrizione dell'area personale",
      secondary: [],
    },
  ],
};
