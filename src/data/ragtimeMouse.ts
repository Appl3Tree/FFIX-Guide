export type RagtimeQuestionWindow = "before-outer-continent" | "outer-continent" | "after-mount-gulug";

export type RagtimeMouseQuestion = {
  id: string;
  objectiveId: string;
  statement: string;
  answer: boolean;
  conservativeWindow: RagtimeQuestionWindow;
  chapterIds: string[];
};

export const ragtimeQuestionSourceIds = [
  "gamefaqs-ragtime-mouse-71891",
  "rpgsite-ragtime-mouse",
  "rpgclassics-ragtime-mouse",
  "cour89-ragtime-quiz",
] as const;

const questionChapterWindows: Record<RagtimeQuestionWindow, string[]> = {
  "before-outer-continent": [
    "disc-1.ice-cavern",
    "disc-2.outer-continent",
    "disc-3.aerial-exploration",
    "disc-4.final-preparations",
  ],
  "outer-continent": [
    "disc-2.outer-continent",
    "disc-3.aerial-exploration",
    "disc-4.final-preparations",
  ],
  "after-mount-gulug": [
    "disc-3.aerial-exploration",
    "disc-4.final-preparations",
  ],
};

const question = (
  id: string,
  objectiveId: string,
  statement: string,
  answer: boolean,
  conservativeWindow: RagtimeQuestionWindow,
): RagtimeMouseQuestion => ({
  id,
  objectiveId,
  statement,
  answer,
  conservativeWindow,
  chapterIds: questionChapterWindows[conservativeWindow],
});

// The Mouse may ask available questions in a different order; the final “can
// you defeat me?” prompt is always the last quiz question. The late group uses
// the conservative Hilda Garde III window because sources disagree about its
// earliest availability.
export const ragtimeMouseQuestions: RagtimeMouseQuestion[] = [
  question("fifteenth-war-date", "disc-1.ice-cavern.ragtime-fifteenth-war", "The Fifteenth Lindblum War began in 1600.", false, "before-outer-continent"),
  question("chocobo-forest-location", "disc-1.ice-cavern.ragtime-chocobo-forest", "Chocobo Forest is between Lindblum and South Gate.", true, "before-outer-continent"),
  question("canary-playwright", "disc-1.ice-cavern.ragtime-canary-playwright", "Lord Afon wrote ‘I Want to Be Your Canary.’", false, "before-outer-continent"),
  question("prima-vista-shipyard", "disc-1.ice-cavern.ragtime-prima-vista-shipyard", "Prima Vista was built at Artania Shipyards.", false, "before-outer-continent"),
  question("friendly-mus", "disc-2.outer-continent.ragtime-friendly-mus", "Some Mus are friendly and do not attack.", true, "outer-continent"),
  question("berkmea-cable-cars", "disc-2.outer-continent.ragtime-berkmea-cable-cars", "Berkmea’s cable cars have operated for eight years.", true, "outer-continent"),
  question("prima-vista-mist-power", "disc-2.outer-continent.ragtime-prima-vista-mist-power", "Prima Vista uses Mist as its energy source.", true, "outer-continent"),
  question("lindblum-castle-size", "disc-2.outer-continent.ragtime-lindblum-castle-size", "Lindblum Castle is larger than Alexandria Castle.", true, "outer-continent"),
  question("lindblum-air-cabs", "disc-2.outer-continent.ragtime-lindblum-air-cabs", "Lindblum’s air cabs operate around the clock.", true, "outer-continent"),
  question("fossil-roo-connection", "disc-2.outer-continent.ragtime-fossil-roo-connection", "Fossil Roo connects Treno and Alexandria.", false, "outer-continent"),
  question("prima-vista-meaning", "disc-3.aerial-exploration.ragtime-prima-vista-meaning", "Prima Vista means ‘love at first sight.’", false, "after-mount-gulug"),
  question("bobo-bird-fortune", "disc-3.aerial-exploration.ragtime-bobo-bird-fortune", "The Bobo bird is said to bring fortune.", false, "after-mount-gulug"),
  question("world-deserts", "disc-3.aerial-exploration.ragtime-world-deserts", "Only one desert exists in the world.", false, "after-mount-gulug"),
  question("card-carta-membership", "disc-3.aerial-exploration.ragtime-card-carta-membership", "Treno’s Card Carta café is members-only.", true, "after-mount-gulug"),
  question("conde-petie-residents", "disc-3.aerial-exploration.ragtime-conde-petie-residents", "Conde Petie is a village of Goblins.", false, "after-mount-gulug"),
  question("defeat-ragtimer", "disc-3.aerial-exploration.ragtime-defeat-ragtimer", "You can defeat Ragtime Mouse.", true, "after-mount-gulug"),
];

export const ragtimeMouseFinalRewardObjectiveId = "disc-3.aerial-exploration.ragtime-mouse";
