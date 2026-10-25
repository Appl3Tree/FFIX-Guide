export type EnemyStatField = "level" | "HP" | "MP" | "EXP" | "AP" | "Gil";
export type EnemyTableSlot = "always" | "common" | "uncommon" | "semi-rare" | "rare";

export type EnemyStatClaim = {
  field: EnemyStatField;
  value: number;
  sourceIds: string[];
  verification: "cross-checked" | "single-source" | "disputed";
};

export type EnemyFact = {
  category: "type" | "elemental-weakness" | "elemental-resistance" | "status-vulnerability" | "attack";
  label: string;
  detail?: string;
  sourceIds: string[];
};

export type EnemyLootSlot = {
  slot: EnemyTableSlot;
  itemId: string | null;
  itemName?: string;
  sourceIds: string[];
  note?: string;
};

export type EnemyBlueMagic = {
  name: string;
  command: string;
  sourceIds: string[];
  objectiveIds: string[];
};

export type EnemyStrategy = {
  title: string;
  detail: string;
  sourceIds: string[];
};

export type EnemyRecord = {
  id: string;
  name: string;
  kind: "ordinary" | "boss" | "component";
  chapterId: string;
  versionScope: string;
  encounterIds: string[];
  stats: EnemyStatClaim[];
  steals: EnemyLootSlot[];
  drops: EnemyLootSlot[];
  facts: EnemyFact[];
  blueMagic: EnemyBlueMagic[];
  strategies: EnemyStrategy[];
  routeObjectiveIds: string[];
  missableIds: string[];
  cutoffIds: string[];
  sourceIds: string[];
  coverage: "partial";
  notes: string[];
};

export type EnemyEncounter = {
  id: string;
  title: string;
  chapterId: string;
  location: string;
  kind: "fixed" | "boss" | "random-pool";
  formation: { enemyId: string; quantity: number | null }[];
  sourceIds: string[];
  objectiveIds: string[];
  missableIds: string[];
  cutoffIds: string[];
  notes: string[];
};

const gulugSources = ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "gamerguides-mount-gulug", "elitegrindlab-mount-gulug"];
const mountGulugChapterId = "disc-3.lost-continent";
const pandemoniumChapterId = "disc-3.portal-to-another-world";
const iifaTreeChapterId = "disc-4.second-battle-of-iifa-tree";
const memoriaChapterId = "disc-4.memoria";
const finalBattleChapterId = "disc-4.the-final-battle";
const finalPreparationsChapterId = "disc-4.final-preparations";
const evilForestChapterId = "disc-1.evil-forest";
const iceCavernChapterId = "disc-1.ice-cavern";
const daliChapterId = "disc-1.village-of-dali";
const lindblumChapterId = "disc-1.lindblum";
const exploringLindblumChapterId = "disc-1.exploring-lindblum-kingdom";
const journeyToBurmeciaChapterId = "disc-1.journey-to-burmecia";
const burmeciaChapterId = "disc-1.burmecia";
const returnToGaiaChapterId = "disc-4.return-to-gaia";
const twisterObjectiveId = "disc-3.lost-continent.mount-gulug-blue-magic";
const twisterMissableId = "missable.disc-3.lost-continent.twister";
const twisterCutoffId = "cutoff.mount-gulug.twister";
const sweepObjectiveId = "disc-3.lost-continent.mount-gulug-sweep";
const sweepMissableId = "missable.disc-3.lost-continent.mount-gulug-sweep";
const storyExitCutoffId = "cutoff.mount-gulug.story-exit";
const meltigeminiObjectiveId = "disc-3.lost-continent.meltigemini-steals";
const meltigeminiMissableId = "missable.disc-3.lost-continent.meltigemini-steals";
const meltigeminiCutoffId = "cutoff.mount-gulug.meltigemini-steals";
const enemyListSourceId = "gamefaqs-enemy-list-71891";
const evilForestEnemySources = [enemyListSourceId, "gamefaqs-evil-forest-71891", "jegged-evil-forest"];
const evilForestBossSources = [enemyListSourceId, "gamefaqs-evil-forest-71891", "jegged-evil-forest"];
const iceCavernEnemySources = [enemyListSourceId, "gamefaqs-ice-cavern-71891", "jegged-ice-cavern"];
const iceCavernBossSources = ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "rpgclassics-ice-cavern"];
const iceCavernStealsObjectiveId = "disc-1.ice-cavern.boss-steals";
const iceCavernStealsMissableId = "missable.disc-1.ice-cavern.boss-steals";
const iceCavernStealsCutoffId = "cutoff.ice-cavern.boss-steals";
const blackWaltz2StealsObjectiveId = "disc-1.village-of-dali.black-waltz-2-steals";
const blackWaltz2StealsMissableId = "missable.disc-1.village-of-dali.black-waltz-2-steals";
const blackWaltz2StealsCutoffId = "cutoff.dali.black-waltz-2-steals";
const gizamalukeStealsObjectiveId = "disc-1.journey-to-burmecia.gizamaluke-steals";
const gizamalukeStealsMissableId = "missable.disc-1.journey-to-burmecia.gizamaluke-steals";
const gizamalukeStealsCutoffId = "cutoff.gizamaluke.boss-steals";
const nolrichEnemySources = [enemyListSourceId, "gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "gamefaqs-abilities-71891"];
const daliEnemySources = [enemyListSourceId, "gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali", "cavesofnarshe-dali-walkthrough", "elitegrindlab-dali", "gamefaqs-abilities-71891"];
const blackWaltz2Sources = ["gamefaqs-dali-71891", "gamefaqs-dali-79143", "jegged-dali", "gamerguides-dali", "elitegrindlab-dali", "cavesofnarshe-dali-enemies", "ffwiki-black-waltz-2"];
const lindblumPlateauSources = [enemyListSourceId, "gamefaqs-exploring-lindblum-71891", "cavesofnarshe-lindblum-walkthrough", "ffwiki-lindblum"];
const lindblumLowlandSources = [enemyListSourceId, "cavesofnarshe-enemies", "cavesofnarshe-lindblum-walkthrough", "gamefaqs-exploring-lindblum-71891", "gamefaqs-abilities-71891"];
const qusMarshSources = [enemyListSourceId, "cavesofnarshe-enemies", "cavesofnarshe-lindblum-walkthrough", "gamefaqs-exploring-lindblum-71891", "elitegrindlab-qus-marsh", "gamefaqs-abilities-71891"];
const qualeSources = ["gamefaqs-frog-catching-71891", "elitegrindlab-qus-marsh", "rpgclassics-bestiary-n-s"];
const grottoEnemySources = [enemyListSourceId, "gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke", "gamefaqs-grotto-south-gate-79143", "rpgclassics-gizamaluke", "gamefaqs-abilities-71891"];
const burmeciaEnemySources = [enemyListSourceId, "gamefaqs-burmecia-71891", "jegged-burmecia", "gamerguides-burmecia", "elitegrindlab-burmecia"];
const burmeciaRegionSources = [enemyListSourceId, "gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke", "cavesofnarshe-enemies", "elitegrindlab-burmecia"];
const burmeciaBossSources = ["gamefaqs-burmecia-71891", "jegged-burmecia", "cavesofnarshe-enemies", "elitegrindlab-burmecia"];
const burmeciaStealsObjectiveId = "disc-1.burmecia.beatrix-steals";
const burmeciaStealsMissableId = "missable.disc-1.burmecia.beatrix-steals";
const burmeciaStealsCutoffId = "cutoff.burmecia.beatrix-steals";
const gizamalukeBossSources = [...grottoEnemySources, "cavesofnarshe-gizamaluke", "ffonline-gizamaluke-boss"];
const huntEnemySources = [enemyListSourceId, "gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies", "cavesofnarshe-hunt-walkthrough"];
const huntLootSources = [enemyListSourceId, "cavesofnarshe-hunt-enemies"];
const zaghnolHuntSources = ["gamefaqs-hunt-minigame-71891", "gamefaqs-lindblum-71891", "jegged-lindblum", "gamerguides-lindblum", "cavesofnarshe-hunt-enemies", "cavesofnarshe-hunt-walkthrough"];
const mountGulugEnemySources = [enemyListSourceId, "gamefaqs-lost-continent-71891", "jegged-mount-gulug", "gamefaqs-abilities-71891"];
const pandemoniumEnemySources = [enemyListSourceId, "gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium", "flactem-pandemonium"];
const pandemoniumBlueMagicObjectiveId = "disc-3.portal-to-another-world.pandemonium-blue-magic";
const pandemoniumStealsObjectiveId = "disc-3.portal-to-another-world.pandemonium-boss-steals";
const pandemoniumClimaxObjectiveId = "disc-3.portal-to-another-world.pandemonium-climax";
const pandemoniumStealsMissableId = "missable.disc-3.portal-to-another-world.pandemonium-boss-steals";
const pandemoniumCutoffId = "cutoff.pandemonium.final-sequence";
const novaDragonSources = ["gamefaqs-second-battle-iifa-tree-71891", "jegged-memoria-nova-dragon"];
const novaDragonStealsObjectiveId = "disc-4.second-battle-of-iifa-tree.nova-dragon-steals";
const memoriaEntryObjectiveId = "disc-4.second-battle-of-iifa-tree.memoria-entry";
const novaDragonMissableId = "missable.disc-4.second-battle-of-iifa-tree.grand-armor";
const novaDragonCutoffId = "cutoff.nova-dragon.grand-armor";
const memoriaEnemySources = ["gamefaqs-memoria-71891", "jegged-memoria-nova-dragon"];
const memoriaTentacleSources = ["gamefaqs-memoria-71891", "jegged-memoria-nova-dragon", "gamerguides-memoria-kraken", "gamefaqs-monster-list-20490", "rpgclassics-kraken-bestiary"];
const deathguiseEnemySources = ["gamefaqs-memoria-71891", "jegged-crystal-world"];
const hadesEnemySources = ["gamefaqs-master-synthesist-71891", "rpgclassics-memoria", "gamefaqs-final-preparations-71891"];
const finalBattleEnemySources = ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown", "rpgclassics-memoria"];
const finalBattleStatsSources = ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"];
const ozmaEnemySources = ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891", "gamefaqs-final-preparations-71891"];
type LocalEnemyInput = Pick<EnemyRecord, "id" | "name" | "encounterIds" | "stats" | "steals" | "drops" | "facts" | "blueMagic" | "strategies" | "routeObjectiveIds" | "notes">;

function chapterEnemy(record: LocalEnemyInput, chapterId: string, sourceIds: string[]): EnemyRecord {
  return {
    ...record,
    kind: "ordinary",
    chapterId,
    versionScope: "PlayStation walkthrough data; parity with remastered releases has not been audited.",
    missableIds: [],
    cutoffIds: [],
    sourceIds: [...sourceIds],
    coverage: "partial",
  };
}

function localEnemy(record: LocalEnemyInput): EnemyRecord {
  return chapterEnemy(record, mountGulugChapterId, mountGulugEnemySources);
}

function chapterBoss(record: LocalEnemyInput, chapterId: string, sourceIds: string[], missableIds: string[] = [], cutoffIds: string[] = []): EnemyRecord {
  return {
    ...chapterEnemy(record, chapterId, sourceIds),
    kind: "boss",
    missableIds,
    cutoffIds,
  };
}

function pandemoniumEnemy(record: LocalEnemyInput): EnemyRecord {
  return chapterEnemy(record, pandemoniumChapterId, pandemoniumEnemySources);
}

function pandemoniumBoss(record: LocalEnemyInput, missableIds: string[] = [], cutoffIds: string[] = []): EnemyRecord {
  return chapterBoss(record, pandemoniumChapterId, pandemoniumEnemySources, missableIds, cutoffIds);
}

function memoriaBoss(record: LocalEnemyInput, missableId: string, cutoffId: string, sourceIds = memoriaEnemySources): EnemyRecord {
  return chapterBoss(record, memoriaChapterId, sourceIds, [missableId], [cutoffId]);
}

function memoriaComponent(record: LocalEnemyInput, sourceIds: string[]): EnemyRecord {
  return { ...chapterEnemy(record, memoriaChapterId, sourceIds), kind: "component" };
}

function memoriaLoot(slot: EnemyTableSlot, itemId: string | null, itemName?: string): EnemyLootSlot {
  return sourcedLoot(slot, itemId, ["gamefaqs-memoria-71891"], itemName);
}

function memoriaFact(category: EnemyFact["category"], label: string, detail?: string, sourceIds = memoriaEnemySources): EnemyFact {
  return sourcedFact(category, label, sourceIds, detail);
}

function pandemoniumBlueMagic(name: string, sourceIds: string[] = [enemyListSourceId, "gamefaqs-portal-to-another-world-71891"]): EnemyBlueMagic {
  return { name, command: "Eat", sourceIds, objectiveIds: [pandemoniumBlueMagicObjectiveId] };
}

function sourcedLoot(slot: EnemyTableSlot, itemId: string | null, sourceIds: string[], itemName?: string): EnemyLootSlot {
  return { slot, itemId, ...(itemName ? { itemName } : {}), sourceIds };
}

function enemyLoot(slot: EnemyTableSlot, itemId: string | null, itemName?: string): EnemyLootSlot {
  return sourcedLoot(slot, itemId, [enemyListSourceId], itemName);
}

function sourcedFact(category: EnemyFact["category"], label: string, sourceIds: string[], detail?: string): EnemyFact {
  return { category, label, ...(detail ? { detail } : {}), sourceIds };
}

function enemyFact(category: EnemyFact["category"], label: string, detail?: string): EnemyFact {
  return sourcedFact(category, label, [enemyListSourceId], detail);
}

function sourcedStats(entries: [EnemyStatField, number][], sourceIds: string[]): EnemyStatClaim[] {
  return entries.map(([field, value]) => ({ field, value, sourceIds, verification: "single-source" }));
}

function crossCheckedStats(entries: [EnemyStatField, number][], sourceIds: string[]): EnemyStatClaim[] {
  return entries.map(([field, value]) => ({ field, value, sourceIds, verification: "cross-checked" }));
}

function enemyStats(entries: [EnemyStatField, number][]): EnemyStatClaim[] {
  return sourcedStats(entries, [enemyListSourceId]);
}

function pandemoniumStats(entries: [EnemyStatField, number][]): EnemyStatClaim[] {
  return sourcedStats(entries, ["gamefaqs-portal-to-another-world-71891"]);
}

function pandemoniumLoot(slot: EnemyTableSlot, itemId: string | null, itemName?: string): EnemyLootSlot {
  return sourcedLoot(slot, itemId, ["gamefaqs-portal-to-another-world-71891"], itemName);
}

function pandemoniumFact(category: EnemyFact["category"], label: string, detail?: string): EnemyFact {
  return sourcedFact(category, label, ["gamefaqs-portal-to-another-world-71891"], detail);
}

function quinaSkill(name: string): EnemyBlueMagic {
  return { name, command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [twisterObjectiveId] };
}

function evilForestLoot(slot: EnemyTableSlot, itemId: string | null, itemName?: string): EnemyLootSlot {
  return sourcedLoot(slot, itemId, [enemyListSourceId], itemName);
}

function evilForestFact(category: EnemyFact["category"], label: string, detail?: string): EnemyFact {
  return sourcedFact(category, label, [enemyListSourceId], detail);
}

const evilForestEncounters: EnemyEncounter[] = [
  {
    id: "encounter.evil-forest.random-pool",
    title: "Evil Forest trail encounters",
    chapterId: evilForestChapterId,
    location: "Forest trails before the Plant Brain cave",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.dendrobium", quantity: null },
      { enemyId: "enemy.fang-a", quantity: null },
      { enemyId: "enemy.goblin", quantity: null },
    ],
    sourceIds: ["gamefaqs-evil-forest-71891", "jegged-evil-forest"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The listed formation members are route-area enemies, not a claim about encounter frequency or exact combinations."],
  },
  {
    id: "encounter.evil-forest.prison-cage-garnet",
    title: "Prison Cage — Garnet rescue battle",
    chapterId: evilForestChapterId,
    location: "Crash-site trail after Zidane reaches Vivi and Steiner",
    kind: "boss",
    formation: [{ enemyId: "enemy.prison-cage-garnet", quantity: 1 }],
    sourceIds: evilForestBossSources,
    objectiveIds: ["disc-1.evil-forest.getting-emotional"],
    missableIds: [],
    cutoffIds: [],
    notes: ["Zidane enters Trance automatically; Garnet's KO causes a Game Over."],
  },
  {
    id: "encounter.evil-forest.prison-cage-vivi",
    title: "Prison Cage — Vivi rescue battle",
    chapterId: evilForestChapterId,
    location: "Immediately after the Garnet rescue battle",
    kind: "boss",
    formation: [{ enemyId: "enemy.prison-cage-vivi", quantity: 1 }],
    sourceIds: evilForestBossSources,
    objectiveIds: ["disc-1.evil-forest.prison-cage-steals"],
    missableIds: ["missable.disc-1.evil-forest.prison-cage-steals"],
    cutoffIds: ["cutoff.evil-forest.escape"],
    notes: ["Vivi is the captive and automatically casts Fire. GameFAQs lists 533 HP for this second form; Jegged repeats the first form's 513 HP."],
  },
  {
    id: "encounter.evil-forest.plant-brain",
    title: "Plant Brain",
    chapterId: evilForestChapterId,
    location: "Boss cave after Monty's spring",
    kind: "boss",
    formation: [{ enemyId: "enemy.plant-brain", quantity: 1 }],
    sourceIds: evilForestBossSources,
    objectiveIds: ["disc-1.evil-forest.plant-brain-steals"],
    missableIds: ["missable.disc-1.evil-forest.plant-brain-steals"],
    cutoffIds: ["cutoff.evil-forest.escape"],
    notes: ["Blank joins during the battle; exact join trigger wording differs between route references."],
  },
  {
    id: "encounter.evil-forest.escape-plant-spiders",
    title: "Plant Spider escape ambush",
    chapterId: evilForestChapterId,
    location: "Mandatory battle on the chase route after Plant Brain",
    kind: "fixed",
    formation: [{ enemyId: "enemy.plant-spider", quantity: 3 }],
    sourceIds: ["jegged-evil-forest", "gamefaqs-evil-forest-71891"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["Jegged lists this as a mandatory battle against three Plant Spiders during the escape."],
  },
];

const iceCavernEncounters: EnemyEncounter[] = [
  {
    id: "encounter.ice-cavern.mist-jet-pool",
    title: "Ice Cavern mist-jet encounters",
    chapterId: iceCavernChapterId,
    location: "Mist vents throughout the Ice Cavern",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.cave-imp", quantity: null },
      { enemyId: "enemy.flan-ice-cavern", quantity: null },
      { enemyId: "enemy.wyerd", quantity: null },
    ],
    sourceIds: iceCavernEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The route references list these three enemy types in the cavern; mist vents trigger battles on contact, but the sources do not give encounter frequencies or exact combinations."],
  },
  {
    id: "encounter.ice-cavern.black-waltz-1-sealion",
    title: "Black Waltz 1 and Sealion",
    chapterId: iceCavernChapterId,
    location: "Waterfall boss battle after the Mois fork",
    kind: "boss",
    formation: [
      { enemyId: "enemy.black-waltz-1", quantity: 1 },
      { enemyId: "enemy.sealion", quantity: 1 },
    ],
    sourceIds: iceCavernBossSources,
    objectiveIds: [iceCavernStealsObjectiveId],
    missableIds: [iceCavernStealsMissableId],
    cutoffIds: [iceCavernStealsCutoffId],
    notes: ["Black Waltz 1 summons Sealion at the start. Defeat Waltz first: it heals Sealion and can summon another if Sealion falls while Waltz remains."],
  },
];

const grottoEncounters: EnemyEncounter[] = [
  {
    id: "encounter.gizamaluke-grotto.random-pool",
    title: "Gizamaluke's Grotto random encounters",
    chapterId: journeyToBurmeciaChapterId,
    location: "Cavern rooms and paths before the Sacred Room",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.hornet", quantity: null },
      { enemyId: "enemy.lamia", quantity: null },
      { enemyId: "enemy.skeleton", quantity: null },
      { enemyId: "enemy.type-a", quantity: null },
    ],
    sourceIds: grottoEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The regional roster is source-listed, but published route references do not provide complete formation rates for the Grotto. The two scripted Type A pairs are tracked separately."],
  },
  {
    id: "encounter.gizamaluke-grotto.type-a-first-pair",
    title: "First scripted Type A pair",
    chapterId: journeyToBurmeciaChapterId,
    location: "First bell-door chamber, after Zorn and Thorn leave two Black Mages",
    kind: "fixed",
    formation: [{ enemyId: "enemy.type-a", quantity: 2 }],
    sourceIds: ["gamefaqs-grotto-south-gate-79143", "rpgclassics-gizamaluke"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is the first of two mandatory two-mage fights in the bell route; defeat both Black Mages to continue."],
  },
  {
    id: "encounter.gizamaluke-grotto.type-a-second-pair",
    title: "Second scripted Type A pair",
    chapterId: journeyToBurmeciaChapterId,
    location: "First bell-door chamber, after the Zorn and Thorn scene",
    kind: "fixed",
    formation: [{ enemyId: "enemy.type-a", quantity: 2 }],
    sourceIds: ["gamefaqs-grotto-south-gate-79143", "rpgclassics-gizamaluke"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["Defeating this second pair awards another Gizamaluke Bell, which continues the route through the cavern."],
  },
  {
    id: "encounter.gizamaluke-grotto.gizamaluke",
    title: "Gizamaluke — Sacred Room boss",
    chapterId: journeyToBurmeciaChapterId,
    location: "Sacred Room behind the great bell, after using the Holy Bell",
    kind: "boss",
    formation: [{ enemyId: "enemy.gizamaluke", quantity: 1 }],
    sourceIds: gizamalukeBossSources,
    objectiveIds: [gizamalukeStealsObjectiveId],
    missableIds: [gizamalukeStealsMissableId],
    cutoffIds: [gizamalukeStealsCutoffId],
    notes: ["The Elixir, Magus Hat, and Ice Staff steals are available only during this one-time fight; the item types have later sources."],
  },
];

const burmeciaEncounters: EnemyEncounter[] = [
  {
    id: "encounter.burmecia.city-random-pool",
    title: "Burmecia city random encounters",
    chapterId: burmeciaChapterId,
    location: "Burmecia streets, houses, and square",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.basilisk", quantity: null },
      { enemyId: "enemy.ironite", quantity: null },
      { enemyId: "enemy.magic-vice", quantity: null },
    ],
    sourceIds: burmeciaEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The city route lists Basilisk, Ironite, and Magic Vice as ordinary encounters. Type A is a separate scripted pair, while the three Mimics are chest-triggered optional fights; no exact random formations or rates are inferred."],
  },
  {
    id: "encounter.burmecia-region.world-map-pool",
    title: "Burmecia and Cleyra region world-map encounters",
    chapterId: journeyToBurmeciaChapterId,
    location: "World-map areas around Burmecia and Cleyra, including Daines-horse Basin",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.lizard-man", quantity: null },
      { enemyId: "enemy.nymph", quantity: null },
      { enemyId: "enemy.sand-scorpion", quantity: null },
      { enemyId: "enemy.skeleton", quantity: null },
      { enemyId: "enemy.yeti", quantity: null },
    ],
    sourceIds: burmeciaRegionSources,
    objectiveIds: ["disc-1.journey-to-burmecia.blue-magic-night"],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs groups these as world-map enemies surrounding Burmecia and Cleyra and separately says Skeletons occur there. The Daines-horse Basin walkthrough identifies Nymph as a Night source; exact map-tile rates and formation combinations are not published."],
  },
  {
    id: "encounter.burmecia.type-a-pair",
    title: "Type A Black Mage pair",
    chapterId: burmeciaChapterId,
    location: "Street beyond the Burmecia entrance, after Zorn and Thorn's scene",
    kind: "fixed",
    formation: [{ enemyId: "enemy.type-a", quantity: 2 }],
    sourceIds: burmeciaEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is a mandatory scripted pair. Walkthroughs call them Black Mages; the enemy table's record name is Type A."],
  },
  {
    id: "encounter.burmecia.suburb.mimic-chest-1",
    title: "Suburb Mimic chest — upper room",
    chapterId: burmeciaChapterId,
    location: "Optional chest on the upper balcony before the Germinas Boots walkway",
    kind: "fixed",
    formation: [{ enemyId: "enemy.mimic", quantity: 1 }],
    sourceIds: burmeciaEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["Opening this optional chest starts a Mimic battle; leaving it closed avoids the fight."],
  },
  {
    id: "encounter.burmecia.suburb.mimic-chest-2",
    title: "Suburb Mimic chest — collapsed-floor route",
    chapterId: burmeciaChapterId,
    location: "Optional upper-floor chest reached after dropping the crumbling balcony",
    kind: "fixed",
    formation: [{ enemyId: "enemy.mimic", quantity: 1 }],
    sourceIds: burmeciaEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This optional chest is another Mimic and can be left unopened."],
  },
  {
    id: "encounter.burmecia.uptown.mimic-chest",
    title: "Uptown Mimic chest",
    chapterId: burmeciaChapterId,
    location: "Optional chest at the far end of the Uptown balcony after crossing the broken statue",
    kind: "fixed",
    formation: [{ enemyId: "enemy.mimic", quantity: 1 }],
    sourceIds: burmeciaEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["Opening this optional chest starts a Mimic battle; the chest can be left closed."],
  },
  {
    id: "encounter.burmecia.beatrix",
    title: "Beatrix — Burmecia Palace",
    chapterId: burmeciaChapterId,
    location: "Palace throne room, after the confrontation with Queen Brahne and Kuja",
    kind: "boss",
    formation: [{ enemyId: "enemy.beatrix-burmecia", quantity: 1 }],
    sourceIds: burmeciaBossSources,
    objectiveIds: [burmeciaStealsObjectiveId],
    missableIds: [burmeciaStealsMissableId],
    cutoffIds: [burmeciaStealsCutoffId],
    notes: ["This one-time battle has a short scripted ending, normally after Beatrix's tenth turn. Some sources also allow the fight to end if her HP reaches zero and differ on whether that counts as a win; the safe route prioritizes survival and selected steals."],
  },
];

const earlyDaliEncounters: EnemyEncounter[] = [
  {
    id: "encounter.nolrich-heights.world-map-pool",
    title: "Nolrich Heights world-map encounters",
    chapterId: iceCavernChapterId,
    location: "Mist Continent world map around Dali",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.carve-spider", quantity: null },
      { enemyId: "enemy.mu", quantity: null },
      { enemyId: "enemy.python", quantity: null },
    ],
    sourceIds: nolrichEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["These are the listed combat enemies for Nolrich Heights; the guides do not publish formation rates or exact combinations. Friendly Mu is a separate sidequest encounter, not part of the battle pool."],
  },
  {
    id: "encounter.dali-underground.random-pool",
    title: "Dali underground optional encounters",
    chapterId: daliChapterId,
    location: "Underground factory after opening the rear door",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.ghost", quantity: null },
      { enemyId: "enemy.vice", quantity: null },
      { enemyId: "enemy.skeleton", quantity: null },
    ],
    sourceIds: daliEnemySources,
    objectiveIds: ["disc-1.village-of-dali.underground-treasure-sweep"],
    missableIds: [],
    cutoffIds: [],
    notes: ["Opening the rear door enables optional random encounters; keeping it shut preserves an encounter-free route. GameFAQs and Caves of Narshe list Ghost and Vice, while Jegged and EliteGrindLab also include Skeleton. EliteGrindLab reports formations of Skeleton + Vice or Ghost alone; rates are not modeled."],
  },
  {
    id: "encounter.dali.black-waltz-2",
    title: "Black Waltz 2",
    chapterId: daliChapterId,
    location: "Dali story sequence; the reported field location is disputed",
    kind: "boss",
    formation: [{ enemyId: "enemy.black-waltz-2", quantity: 1 }],
    sourceIds: blackWaltz2Sources,
    objectiveIds: [blackWaltz2StealsObjectiveId],
    missableIds: [blackWaltz2StealsMissableId],
    cutoffIds: [blackWaltz2StealsCutoffId],
    notes: ["Several walkthroughs place the fight at Observatory Mountain; Final Fantasy Wiki and EliteGrindLab's field-script review place the encounter at the cargo-ship loading area. The dossier preserves that location conflict."],
  },
];

const lindblumEncounters: EnemyEncounter[] = [
  {
    id: "encounter.lindblum-plateau.mountain-pool",
    title: "Lindblum Plateau mountain encounters",
    chapterId: exploringLindblumChapterId,
    location: "Mountain terrain on Lindblum Plateau",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.carve-spider", quantity: null },
      { enemyId: "enemy.axe-beak", quantity: null },
    ],
    sourceIds: lindblumPlateauSources,
    objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    missableIds: [],
    cutoffIds: [],
    notes: ["Disc I–III sources list Carve Spider and Axe Beak on the plateau. Final Fantasy Wiki publishes separate two-enemy formations and rates; this pool records the regional roster without encoding those rates or quantities."],
  },
  {
    id: "encounter.lindblum-plateau.forest-pool",
    title: "Lindblum Plateau forest encounters",
    chapterId: exploringLindblumChapterId,
    location: "Forests on Lindblum Plateau",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.carve-spider", quantity: null },
      { enemyId: "enemy.axe-beak", quantity: null },
      { enemyId: "enemy.bomb", quantity: null },
    ],
    sourceIds: lindblumPlateauSources,
    objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    missableIds: [],
    cutoffIds: [],
    notes: ["Bomb is restricted to forest terrain; Caves of Narshe and GameFAQs specifically identify it as Quina's Mustard Bomb source here. The model does not infer encounter frequency or exact combinations."],
  },
  {
    id: "encounter.lindblum.festival-random-pool",
    title: "Festival of the Hunt district battles",
    chapterId: lindblumChapterId,
    location: "Business, Theater, and Industrial Districts during the 12-minute Festival",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.fang-b", quantity: null },
      { enemyId: "enemy.mu-b", quantity: null },
      { enemyId: "enemy.trick-sparrow-hunt", quantity: null },
    ],
    sourceIds: huntEnemySources,
    objectiveIds: ["disc-1.lindblum.master-hunter", "disc-1.lindblum.festival-vivi-win", "disc-1.lindblum.festival-freya-win"],
    missableIds: ["missable.disc-1.lindblum.festival-vivi"],
    cutoffIds: ["cutoff.lindblum-festival.vivi-outcome"],
    notes: ["Fang and Mu use Hunt-only variants. Trick Sparrow keeps its standard HP/MP/level profile, but sources disagree on Hunt steals and reward values; its event battle is not treated as a source of ordinary battle rewards. The district roster is recorded without asserting exact formations, point values, or spawn rates."],
  },
  {
    id: "encounter.lindblum.festival-zaghnol",
    title: "Zaghnol — Festival boss battle",
    chapterId: lindblumChapterId,
    location: "Business District shop plaza when about 4:30 remains on the Festival timer",
    kind: "boss",
    formation: [{ enemyId: "enemy.zaghnol-hunt", quantity: 1 }],
    sourceIds: zaghnolHuntSources,
    objectiveIds: ["disc-1.lindblum.zaghnol-steals", "disc-1.lindblum.master-hunter", "disc-1.lindblum.festival-freya-win", "disc-1.lindblum.festival-vivi-win"],
    missableIds: ["missable.disc-1.lindblum.zaghnol-steals", "missable.disc-1.lindblum.festival-vivi"],
    cutoffIds: ["cutoff.lindblum-festival.vivi-outcome"],
    notes: ["Freya joins Zidane for this one-time battle. If the plaza is already loaded when the timer reaches the trigger, the route sources say to leave and re-enter. GameFAQs lists Mythril Gloves and Needle Fork as steals; Caves of Narshe's Hunt table says no stolen items, so the conflict remains visible on the boss record."],
  },
];

const lindblumRegionalEncounters: EnemyEncounter[] = [
  {
    id: "encounter.gunitas-basin.world-map-pool",
    title: "Gunitas Basin world-map encounters",
    chapterId: daliChapterId,
    location: "Gunitas Basin around the route between Dali and Lindblum",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.goblin", quantity: null },
      { enemyId: "enemy.mu", quantity: null },
      { enemyId: "enemy.python", quantity: null },
    ],
    sourceIds: [enemyListSourceId, "gamefaqs-dali-71891", "jegged-dali"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs lists Goblin in addition to Mu and Python in Gunitas Basin. This is separate from the Nolrich Heights pool, which also includes Carve Spider; no formation rates or combinations are inferred."],
  },
  {
    id: "encounter.lindblum-area.lowlands-pool",
    title: "Lindblum lowland world-map encounters",
    chapterId: exploringLindblumChapterId,
    location: "Plains around Dragon's Gate and Chocobo Forest below Lindblum",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.clipper", quantity: null },
      { enemyId: "enemy.hedgehog-pie", quantity: null },
      { enemyId: "enemy.ironite", quantity: null },
      { enemyId: "enemy.ladybird", quantity: null },
      { enemyId: "enemy.mandragora", quantity: null },
      { enemyId: "enemy.serpion", quantity: null },
      { enemyId: "enemy.vice", quantity: null },
    ],
    sourceIds: lindblumLowlandSources,
    objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs groups Clipper, Hedgehog Pie, Ironite, Ladybird, Mandragora, and Serpion with the lowland area around Dragon's Gate/Chocobo Forest and separately notes Vice on the plains below Lindblum. Plateau-only Axe Beak and Bomb remain in their terrain pools; the model does not infer formation rates."],
  },
  {
    id: "encounter.qus-marsh.disc-1-interior-pool",
    title: "Qu's Marsh — Disc I interior encounters",
    chapterId: exploringLindblumChapterId,
    location: "Water and reeds inside the Mist Continent Qu's Marsh",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.axolotl", quantity: null },
      { enemyId: "enemy.gigan-toad-a", quantity: null },
    ],
    sourceIds: qusMarshSources,
    objectiveIds: ["disc-1.exploring-lindblum-kingdom.quina-recruit", "disc-1.exploring-lindblum-kingdom.blue-magic"],
    missableIds: [],
    cutoffIds: [],
    notes: ["The first Qu's Marsh has Axolotl and Gigan Toad [A]. Anemone and Sahagin belong to later marshes, and the stronger Gigan Toad [B] is a separate later-area version; the encounter pool is restricted to the Disc I state."],
  },
  {
    id: "encounter.qus-marsh.quale-99-frogs",
    title: "Quale — 99-frog challenge",
    chapterId: returnToGaiaChapterId,
    location: "Quale's house at Qu's Marsh after the shared frog count reaches 99",
    kind: "boss",
    formation: [{ enemyId: "enemy.quale", quantity: 1 }],
    sourceIds: qualeSources,
    objectiveIds: ["disc-4.return-to-gaia.frog-catching"],
    missableIds: [],
    cutoffIds: [],
    notes: ["Quale challenges the party when the 99-frog milestone is reached and gives Quina the Gastro Fork after victory. The battle is optional; the frog count is shared across the marshes and Frog Drop's damage can continue scaling beyond the boss trigger."],
  },
];

const mountGulugEncounters: EnemyEncounter[] = [
  {
    id: "encounter.mount-gulug.red-dragon-return-pair",
    title: "Red Dragon ambush on the return route",
    chapterId: mountGulugChapterId,
    location: "Scaffolding route back toward the well",
    kind: "fixed",
    formation: [{ enemyId: "enemy.red-dragon", quantity: 2 }],
    sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"],
    objectiveIds: [twisterObjectiveId],
    missableIds: [twisterMissableId],
    cutoffIds: [twisterCutoffId],
    notes: ["This is a scripted encounter, not a random formation. Quina can use Eat on either dragon if Twister is still needed."],
  },
  {
    id: "encounter.mount-gulug.red-dragon-mineshaft",
    title: "Solo Red Dragon by the Elixir chest",
    chapterId: mountGulugChapterId,
    location: "Mineshaft room beyond Mogtaka",
    kind: "fixed",
    formation: [{ enemyId: "enemy.red-dragon", quantity: 1 }],
    sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "elitegrindlab-mount-gulug"],
    objectiveIds: [twisterObjectiveId, sweepObjectiveId],
    missableIds: [twisterMissableId, sweepMissableId],
    cutoffIds: [twisterCutoffId, storyExitCutoffId],
    notes: ["The Elixir chest appears only after winning this fight; fleeing forfeits that location pickup."],
  },
  {
    id: "encounter.mount-gulug.red-dragon-lower-pair",
    title: "Red Dragon ambush on the bottom level",
    chapterId: mountGulugChapterId,
    location: "Bottom level after lowering the well lever three times",
    kind: "fixed",
    formation: [{ enemyId: "enemy.red-dragon", quantity: 2 }],
    sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"],
    objectiveIds: [twisterObjectiveId],
    missableIds: [twisterMissableId],
    cutoffIds: [twisterCutoffId],
    notes: ["This fixed fight occurs before the story proceeds to the boss sequence."],
  },
  {
    id: "encounter.mount-gulug.meltigemini",
    title: "Meltigemini",
    chapterId: mountGulugChapterId,
    location: "Story boss arena after the Mount Gulug cutscenes",
    kind: "boss",
    formation: [{ enemyId: "enemy.meltigemini", quantity: 1 }],
    sourceIds: ["gamefaqs-enemy-list-71891", ...gulugSources],
    objectiveIds: [meltigeminiObjectiveId],
    missableIds: [meltigeminiMissableId],
    cutoffIds: [meltigeminiCutoffId],
    notes: ["This is a one-time boss fight; steal attempts must happen before the victory."],
  },
  {
    id: "encounter.mount-gulug.common-pool",
    title: "Common random encounter pool",
    chapterId: mountGulugChapterId,
    location: "Throughout Mount Gulug",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.grenade", quantity: null },
      { enemyId: "enemy.vepal-red", quantity: null },
    ],
    sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["Grenade and Vepal (Red) are listed in all three dungeon levels; this pool is a location summary, not a fixed formation."],
  },
  {
    id: "encounter.mount-gulug.building-pool",
    title: "Building random encounter pool",
    chapterId: mountGulugChapterId,
    location: "Inside Mount Gulug buildings",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.worm-hydra", quantity: null }],
    sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"],
    objectiveIds: [twisterObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["Worm Hydra is restricted to building interiors in the documented local encounter distribution."],
  },
  {
    id: "encounter.mount-gulug.outside-pool",
    title: "Outside random encounter pool",
    chapterId: mountGulugChapterId,
    location: "Outside the Mount Gulug buildings",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.wraith-blue", quantity: null },
      { enemyId: "enemy.wraith-red", quantity: null },
    ],
    sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"],
    objectiveIds: [twisterObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["Both Wraith color variants are listed outside; the guide sources do not specify a fixed party count for random encounters."],
  },
];

const pandemoniumEncounters: EnemyEncounter[] = [
  {
    id: "encounter.pandemonium.fixed-amdusias",
    title: "Amdusias — Zidane, then Freya and Amarant",
    chapterId: pandemoniumChapterId,
    location: "Mind-control chamber, first scripted fight",
    kind: "boss",
    formation: [{ enemyId: "enemy.amdusias-fixed", quantity: 1 }],
    sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium"],
    objectiveIds: [pandemoniumClimaxObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["Zidane begins alone; Freya and Amarant join during the scripted battle. The next fixed encounter begins immediately."],
  },
  {
    id: "encounter.pandemonium.fixed-abadon",
    title: "Abadon — Steiner and Quina, then Zidane",
    chapterId: pandemoniumChapterId,
    location: "Mind-control chamber, second scripted fight",
    kind: "boss",
    formation: [{ enemyId: "enemy.abadon-fixed", quantity: 1 }],
    sourceIds: ["gamefaqs-portal-to-another-world-71891", "flactem-pandemonium"],
    objectiveIds: [pandemoniumClimaxObjectiveId, pandemoniumBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["Steiner and Quina start, then Zidane joins. Flactem says this scripted form cannot be eaten for Twister; the repeatable Abadon [B] encounter is the documented teacher."],
  },
  {
    id: "encounter.pandemonium.fixed-shell-dragon",
    title: "Shell Dragon — Zidane, then Dagger",
    chapterId: pandemoniumChapterId,
    location: "Mind-control chamber, third scripted fight",
    kind: "boss",
    formation: [{ enemyId: "enemy.shell-dragon-fixed", quantity: 1 }],
    sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "flactem-pandemonium"],
    objectiveIds: [pandemoniumClimaxObjectiveId, pandemoniumBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["Zidane begins alone and Dagger joins after the fight's scripted threshold. The sources disagree about whether Quina can learn Earth Shake from this fixed version; the random Shell Dragon [B] is a confirmed teacher."],
  },
  {
    id: "encounter.pandemonium.random-pool",
    title: "Pandemonium random encounters",
    chapterId: pandemoniumChapterId,
    location: "Pandemonium halls",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.abadon-b", quantity: null },
      { enemyId: "enemy.malboro-pandemonium", quantity: null },
      { enemyId: "enemy.shell-dragon-b", quantity: null },
    ],
    sourceIds: ["gamefaqs-enemy-list-71891", "gamefaqs-portal-to-another-world-71891", "flactem-pandemonium"],
    objectiveIds: [pandemoniumBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The area roster lists these random enemy families; sources do not give exact mixed-formation rates. Abadon [B] and Shell Dragon [B] are kept distinct from the preceding scripted fights."],
  },
  {
    id: "encounter.pandemonium.mover-trio",
    title: "Mover trio",
    chapterId: pandemoniumChapterId,
    location: "Pandemonium random encounter",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.mover-left", quantity: null },
      { enemyId: "enemy.mover-middle", quantity: null },
      { enemyId: "enemy.mover-right", quantity: null },
    ],
    sourceIds: ["gamefaqs-enemy-list-71891", "gamefaqs-portal-to-another-world-71891"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The enemy reference describes a group of three Movers with separate left, middle, and right stat records. The random-pool model leaves exact quantities unset."],
  },
  {
    id: "encounter.pandemonium.silver-dragon",
    title: "Silver Dragon",
    chapterId: pandemoniumChapterId,
    location: "Observatory boss arena",
    kind: "boss",
    formation: [{ enemyId: "enemy.silver-dragon", quantity: 1 }],
    sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium"],
    objectiveIds: [pandemoniumStealsObjectiveId, pandemoniumClimaxObjectiveId],
    missableIds: [pandemoniumStealsMissableId],
    cutoffIds: [pandemoniumCutoffId],
    notes: ["Garland and Kuja follow immediately; there is no shop or equipment break between these boss fights."],
  },
  {
    id: "encounter.pandemonium.garland",
    title: "Garland",
    chapterId: pandemoniumChapterId,
    location: "Observatory boss arena",
    kind: "boss",
    formation: [{ enemyId: "enemy.garland", quantity: 1 }],
    sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium"],
    objectiveIds: [pandemoniumStealsObjectiveId, pandemoniumClimaxObjectiveId],
    missableIds: [pandemoniumStealsMissableId],
    cutoffIds: [pandemoniumCutoffId],
    notes: ["This is the second fight in the consecutive boss sequence; Kuja follows immediately."],
  },
  {
    id: "encounter.pandemonium.kuja",
    title: "Kuja",
    chapterId: pandemoniumChapterId,
    location: "Observatory boss arena",
    kind: "boss",
    formation: [{ enemyId: "enemy.kuja", quantity: 1 }],
    sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium"],
    objectiveIds: [pandemoniumStealsObjectiveId, pandemoniumClimaxObjectiveId],
    missableIds: [pandemoniumStealsMissableId],
    cutoffIds: [pandemoniumCutoffId],
    notes: ["The story sequence continues immediately after the battle, and the route returns linearly through Bran Bal."],
  },
];

const iifaTreeEncounters: EnemyEncounter[] = [
  {
    id: "encounter.iifa-tree.nova-dragon",
    title: "Nova Dragon — purple orb above the Iifa Tree",
    chapterId: iifaTreeChapterId,
    location: "Disc IV purple orb, before entering Memoria",
    kind: "boss",
    formation: [{ enemyId: "enemy.nova-dragon", quantity: 1 }],
    sourceIds: [...novaDragonSources],
    objectiveIds: [novaDragonStealsObjectiveId, memoriaEntryObjectiveId],
    missableIds: [novaDragonMissableId],
    cutoffIds: [novaDragonCutoffId],
    notes: ["This one-time battle begins after entering the purple orb and leads directly to Memoria. Grand Armor can be synthesized instead only if the player retained a Mythril Sword."],
  },
];

const memoriaEncounters: EnemyEncounter[] = [
  {
    id: "encounter.memoria.hades",
    title: "Hades — optional boss",
    chapterId: memoriaChapterId,
    location: "Birth (underwater room), behind the rock formation",
    kind: "boss",
    formation: [{ enemyId: "enemy.hades", quantity: 1 }],
    sourceIds: hadesEnemySources,
    objectiveIds: ["disc-4.memoria.hades", "disc-4.memoria.hades-steals"],
    missableIds: ["missable.disc-4.memoria.hades-shop", "missable.disc-4.memoria.hades-running-shoes"],
    cutoffIds: ["cutoff.final-preparations.final-battle"],
    notes: ["Hades is hidden behind the rock formation in Birth. The optional fight can be postponed until Final Preparations, but cannot be repeated after victory; the final-battle departure closes the encounter window."],
  },
  {
    id: "encounter.memoria.maliris",
    title: "Maliris — Guardian of Fire",
    chapterId: memoriaChapterId,
    location: "Outer Path",
    kind: "boss",
    formation: [{ enemyId: "enemy.maliris", quantity: 1 }],
    sourceIds: memoriaEnemySources,
    objectiveIds: ["disc-4.memoria.maliris-steals"],
    missableIds: ["missable.disc-4.memoria.maliris-steals"],
    cutoffIds: ["cutoff.memoria.maliris-steals"],
    notes: ["The fight follows the Outer Path approach and cannot be repeated after victory."],
  },
  {
    id: "encounter.memoria.tiamat",
    title: "Tiamat — Guardian of Wind",
    chapterId: memoriaChapterId,
    location: "Time Interval",
    kind: "boss",
    formation: [{ enemyId: "enemy.tiamat-memoria", quantity: 1 }],
    sourceIds: memoriaEnemySources,
    objectiveIds: ["disc-4.memoria.tiamat-steals"],
    missableIds: ["missable.disc-4.memoria.tiamat-steals"],
    cutoffIds: ["cutoff.memoria.tiamat-steals"],
    notes: ["Tiamat appears at the top of the Time Interval stairs; avoid triggering Snort by attacking while a character is floating."],
  },
  {
    id: "encounter.memoria.kraken",
    title: "Kraken — Guardian of Water",
    chapterId: memoriaChapterId,
    location: "Ocean",
    kind: "boss",
    formation: [
      { enemyId: "enemy.kraken-memoria", quantity: 1 },
      { enemyId: "enemy.kraken-left-tentacle", quantity: 1 },
      { enemyId: "enemy.kraken-right-tentacle", quantity: 1 },
    ],
    sourceIds: [...memoriaEnemySources, "gamefaqs-monster-list-20490", "gamerguides-memoria-kraken"],
    objectiveIds: ["disc-4.memoria.kraken-steals"],
    missableIds: ["missable.disc-4.memoria.kraken-steals"],
    cutoffIds: ["cutoff.memoria.kraken-steals"],
    notes: ["Kraken begins with Left Tentacle and Right Tentacle. GameFAQs lists their Water-gun and Ink attacks without assigning sides; Jegged and Gamer Guides reverse which side uses each move, so the guide leaves that mapping unresolved."],
  },
  {
    id: "encounter.memoria.lich",
    title: "Lich — Guardian of Earth",
    chapterId: memoriaChapterId,
    location: "Gate to Space",
    kind: "boss",
    formation: [{ enemyId: "enemy.lich-memoria", quantity: 1 }],
    sourceIds: memoriaEnemySources,
    objectiveIds: ["disc-4.memoria.lich-steals"],
    missableIds: ["missable.disc-4.memoria.lich-steals"],
    cutoffIds: ["cutoff.memoria.lich-steals"],
    notes: ["The brief Nero Family checkpoint 14 window is immediately before the Lich battle; its separate warning remains linked from the walkthrough."],
  },
  {
    id: "encounter.memoria.deathguise",
    title: "Deathguise",
    chapterId: memoriaChapterId,
    location: "Crystal World",
    kind: "boss",
    formation: [{ enemyId: "enemy.deathguise", quantity: 1 }],
    sourceIds: deathguiseEnemySources,
    objectiveIds: ["disc-4.memoria.deathguise-steals"],
    missableIds: ["missable.disc-4.memoria.deathguise-steals"],
    cutoffIds: ["cutoff.memoria.deathguise-steals"],
    notes: ["This one-time battle precedes the final Kuja and Necron sequence. The route can return to Gaia for Final Preparations after victory."],
  },
];

const finalBattleEncounters: EnemyEncounter[] = [
  {
    id: "encounter.final-battle.trance-kuja",
    title: "Trance Kuja",
    chapterId: finalBattleChapterId,
    location: "Crystal World, after leaving the final save point",
    kind: "boss",
    formation: [{ enemyId: "enemy.trance-kuja", quantity: 1 }],
    sourceIds: finalBattleEnemySources,
    objectiveIds: ["disc-4.the-final-battle.trance-kuja", "disc-4.the-final-battle.trance-kuja-steals"],
    missableIds: ["missable.disc-4.the-final-battle.trance-kuja-steals"],
    cutoffIds: ["cutoff.final-battle.trance-kuja-steals"],
    notes: ["The first fight in the final sequence. A party menu appears afterward, but the sequence cannot return to the Crystal World save point."],
  },
  {
    id: "encounter.final-battle.necron",
    title: "Necron — final boss",
    chapterId: finalBattleChapterId,
    location: "Hill of Despair, immediately after the Trance Kuja sequence",
    kind: "boss",
    formation: [{ enemyId: "enemy.necron", quantity: 1 }],
    sourceIds: finalBattleEnemySources,
    objectiveIds: ["disc-4.the-final-battle.necron-steals"],
    missableIds: ["missable.disc-4.the-final-battle.necron-steals"],
    cutoffIds: ["cutoff.final-battle.necron-steals"],
    notes: ["Necron is the final fight in the sequence; victory leads directly to the ending."],
  },
];

const ozmaEncounters: EnemyEncounter[] = [
  {
    id: "encounter.final-preparations.ozma",
    title: "Ozma — optional super-boss",
    chapterId: finalPreparationsChapterId,
    location: "Chocobo's Air Garden, rear platform, at the stone structure",
    kind: "boss",
    formation: [{ enemyId: "enemy.ozma", quantity: 1 }],
    sourceIds: ozmaEnemySources,
    objectiveIds: ["disc-4.final-preparations.ozma-steals", "disc-4.final-preparations.ozma-defeated", "disc-4.final-preparations.ozma-rewards", "disc-4.final-preparations.ozma-achievement"],
    missableIds: ["missable.disc-4.final-preparations.ozma-steals"],
    cutoffIds: ["cutoff.final-preparations.final-battle"],
    notes: ["Reach the Air Garden with a Sky Chocobo and examine the stone structure on the rear platform. The Friendly Creatures quest changes Ozma's physical reach and Shadow affinity, but is not required to reach the arena."],
  },
];

export const enemyEncounters: EnemyEncounter[] = [...evilForestEncounters, ...iceCavernEncounters, ...grottoEncounters, ...burmeciaEncounters, ...earlyDaliEncounters, ...lindblumEncounters, ...lindblumRegionalEncounters, ...mountGulugEncounters, ...pandemoniumEncounters, ...iifaTreeEncounters, ...memoriaEncounters, ...ozmaEncounters, ...finalBattleEncounters];

const localEnemyRecords: EnemyRecord[] = [
  localEnemy({
    id: "enemy.grenade",
    name: "Grenade",
    encounterIds: ["encounter.mount-gulug.common-pool"],
    stats: enemyStats([["level", 36], ["HP", 4685], ["MP", 1240], ["EXP", 7459], ["AP", 2], ["Gil", 1336]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.peridot"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Aerial"),
      enemyFact("elemental-weakness", "Ice and Wind"),
      enemyFact("elemental-resistance", "Earth nullified; Fire damage halved"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Firaga, Flame, and Canon", "Flame removes about 20% of each target's maximum HP; Canon halves current HP."),
    ],
    blueMagic: [quinaSkill("Mustard Bomb")],
    strategies: [{ title: "Exploit its elemental weaknesses", detail: "Ice and Wind attacks are effective. Quina can learn Mustard Bomb with Eat.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [],
    notes: ["Grenade appears in the common Mount Gulug random pool. The source table lists no always-drop item and three conditional drop slots."],
  }),
  localEnemy({
    id: "enemy.vepal-red",
    name: "Vepal (Red)",
    encounterIds: ["encounter.mount-gulug.common-pool"],
    stats: enemyStats([["level", 35], ["HP", 4022], ["MP", 1214], ["EXP", 6933], ["AP", 2], ["Gil", 1326]]),
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("semi-rare", "game-item.phoenix-pinion"), enemyLoot("rare", "game-item.ether")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.topaz"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Aerial"),
      enemyFact("elemental-weakness", "Ice and Wind"),
      enemyFact("elemental-resistance", "Fire resisted; Earth nullified"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Lava Gun, Mustard Bomb, Blizzaga, Twister, and Scorch", "Lava Gun deals heavy Fire-elemental physical damage; Mustard Bomb inflicts Heat. Scorch can nullify elemental damage."),
    ],
    blueMagic: [quinaSkill("Mustard Bomb")],
    strategies: [{ title: "Use Ice or Wind damage", detail: "Both elements exploit Vepal's weaknesses. Quina can learn Mustard Bomb with Eat.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [],
    notes: ["Vepal (Red) is listed throughout the dungeon; this record refers to the red Mount Gulug form, not the later Vepal (Green)."],
  }),
  localEnemy({
    id: "enemy.worm-hydra",
    name: "Worm Hydra",
    encounterIds: ["encounter.mount-gulug.building-pool"],
    stats: [
      ...enemyStats([["level", 37], ["MP", 1268], ["EXP", 8010], ["AP", 3], ["Gil", 1345]]),
      { field: "HP", value: 4846, sourceIds: [enemyListSourceId, "jegged-mount-gulug"], verification: "disputed" },
      { field: "HP", value: 4486, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "disputed" },
    ],
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.antidote"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Nothing"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Dragon"),
      enemyFact("elemental-weakness", "Ice"),
      enemyFact("elemental-resistance", "Fire damage halved"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Venom Breath, Cold Breath, Flame, Aero Breath, and Lightning", "Venom Breath can inflict Venom; Cold Breath can inflict Freeze. Flame, Aero Breath, and Lightning each deal damage based on a portion of maximum HP."),
    ],
    blueMagic: [quinaSkill("Bad Breath")],
    strategies: [{ title: "Prepare for status and percentage damage", detail: "Antibody helps against Venom, Body Temp against Freeze, and Ice attacks exploit its weakness. Quina can learn Bad Breath with Eat.", sourceIds: [enemyListSourceId, "gamefaqs-lost-continent-71891", "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [],
    notes: ["HP is disputed: the GameFAQs enemy table and Jegged list 4,846, while the GameFAQs Lost Continent walkthrough lists 4,486. It appears only inside the Mount Gulug buildings in the documented local encounter pool."],
  }),
  localEnemy({
    id: "enemy.wraith-blue",
    name: "Wraith (Blue)",
    encounterIds: ["encounter.mount-gulug.outside-pool"],
    stats: enemyStats([["level", 36], ["HP", 4686], ["MP", 1239], ["EXP", 8950], ["AP", 2], ["Gil", 1654]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.opal"), enemyLoot("common", null, "Nothing"), enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Aerial and Undead"),
      enemyFact("elemental-weakness", "Fire, Wind, and Holy"),
      enemyFact("elemental-resistance", "Earth nullified; Ice and Shadow damage halved"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Devil's Candle, Blizzaga, and Doom", "Devil's Candle can inflict Freeze; Doom applies the Doom status."),
    ],
    blueMagic: [quinaSkill("Frost")],
    strategies: [{ title: "Use its Undead weakness", detail: "Healing effects and Fire attacks are especially effective. Quina can learn Frost with Eat.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [],
    notes: ["Both Wraith color forms are listed outside the buildings."],
  }),
  localEnemy({
    id: "enemy.wraith-red",
    name: "Wraith (Red)",
    encounterIds: ["encounter.mount-gulug.outside-pool"],
    stats: enemyStats([["level", 37], ["HP", 4846], ["MP", 1268], ["EXP", 8010], ["AP", 2], ["Gil", 1345]]),
    steals: [enemyLoot("common", "game-item.topaz"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", "game-item.phoenix-pinion"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.topaz"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Aerial and Undead"),
      enemyFact("elemental-weakness", "Ice, Wind, and Holy"),
      enemyFact("elemental-resistance", "Earth nullified; Fire and Shadow damage halved"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Devil's Candle, Firaga, and Doom", "Devil's Candle can inflict Heat; Doom applies the Doom status."),
    ],
    blueMagic: [quinaSkill("Mustard Bomb")],
    strategies: [{ title: "Use Ice, Wind, or healing", detail: "Its Undead nature makes healing effective; Ice and Wind are listed weaknesses. Quina can learn Mustard Bomb with Eat.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [],
    notes: ["Wraith (Red) is one of the two color variants listed outside the buildings."],
  }),
];

function pandemoniumMover(id: string, name: string, hp: number, mp: number): EnemyRecord {
  return pandemoniumEnemy({
    id,
    name,
    encounterIds: ["encounter.pandemonium.mover-trio"],
    stats: enemyStats([["level", 52], ["HP", hp], ["MP", mp], ["EXP", 23801], ["AP", 3], ["Gil", 2300]]),
    steals: [enemyLoot("common", "game-item.opal"), enemyLoot("uncommon", "game-item.vaccine"), enemyLoot("semi-rare", "game-item.tent"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.opal"), enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", "game-item.vaccine"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Aerial"),
      enemyFact("elemental-weakness", "Fire, Ice, Lightning, Wind, Water, Holy, and Shadow"),
      enemyFact("elemental-resistance", "Earth nullified"),
      enemyFact("attack", "Virus Combo", "With two Movers alive, this attack inflicts Virus."),
      enemyFact("attack", "Delta Attack", "With all three Movers alive, this attack can inflict KO."),
      enemyFact("attack", "Firaga", "Heavy Fire-elemental damage."),
    ],
    blueMagic: [],
    strategies: [{ title: "Break the trio before it can coordinate", detail: "Two living Movers can use Virus Combo; all three can use Delta Attack. Their broad elemental weaknesses make area attacks effective, while Earth damage is nullified.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["GameFAQs records Left, Middle, and Right variants with separate stats; the encounter reference models one of each in the documented trio."],
  });
}

const pandemoniumEnemyRecords: EnemyRecord[] = [
  pandemoniumEnemy({
    id: "enemy.abadon-b",
    name: "Abadon [B]",
    encounterIds: ["encounter.pandemonium.random-pool"],
    stats: enemyStats([["level", 58], ["HP", 12658], ["MP", 2479], ["EXP", 32073], ["AP", 4], ["Gil", 2604]]),
    steals: [enemyLoot("common", null, "Garnet"), enemyLoot("uncommon", "game-item.vaccine"), enemyLoot("semi-rare", "game-item.phoenix-pinion"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Garnet"), enemyLoot("uncommon", "game-item.vaccine"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Aerial and Bug"),
      enemyFact("elemental-weakness", "Wind"),
      enemyFact("elemental-resistance", "Earth nullified"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "High Wind", "Party-wide attack."),
      enemyFact("attack", "Virus Fly", "Can inflict Virus."),
      enemyFact("attack", "Thundaga and Blade", "Thundaga is elemental damage; Blade targets one character."),
    ],
    blueMagic: [pandemoniumBlueMagic("Twister", [enemyListSourceId, "gamefaqs-portal-to-another-world-71891", "flactem-pandemonium"])],
    strategies: [{ title: "Learn Twister here if needed", detail: "Quina can Eat the repeatable Abadon [B]. The scripted Abadon is a separate encounter and is not listed as this Blue Magic source.", sourceIds: [enemyListSourceId, "flactem-pandemonium"] }],
    routeObjectiveIds: [pandemoniumBlueMagicObjectiveId],
    notes: ["The enemy list labels this random form Abadon [B]. It has different stats and loot from the level-54 scripted Abadon fought earlier in the area."],
  }),
  pandemoniumEnemy({
    id: "enemy.malboro-pandemonium",
    name: "Malboro",
    encounterIds: ["encounter.pandemonium.random-pool"],
    stats: enemyStats([["level", 57], ["HP", 11687], ["MP", 2334], ["EXP", 30579], ["AP", 3], ["Gil", 2572]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.vaccine"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.ore"), enemyLoot("common", null, "Nothing"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Bad Breath", "Malboro's signature attack can inflict multiple status effects."),
      enemyFact("attack", "Virus Tentacle", "Inflicts Virus."),
      enemyFact("attack", "Absorb and Osmose", "Drains HP or MP."),
    ],
    blueMagic: [pandemoniumBlueMagic("Bad Breath", [enemyListSourceId, "gamefaqs-portal-to-another-world-71891", "flactem-pandemonium"])],
    strategies: [{ title: "Disable it or finish quickly", detail: "Bad Breath and Virus Tentacle can disrupt the party. The source lists many status vulnerabilities; strong offense limits the number of turns it gets.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [pandemoniumBlueMagicObjectiveId],
    notes: ["The GameFAQs enemy list gives no creature type or elemental weakness/resistance for this entry."],
  }),
  pandemoniumEnemy({
    id: "enemy.shell-dragon-b",
    name: "Shell Dragon [B]",
    encounterIds: ["encounter.pandemonium.random-pool"],
    stats: enemyStats([["level", 58], ["HP", 12661], ["MP", 2482], ["EXP", 32073], ["AP", 4], ["Gil", 2588]]),
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.vaccine"), enemyLoot("semi-rare", "game-item.tent"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", "game-item.ore"), enemyLoot("common", "game-item.topaz"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Dragon"),
      enemyFact("elemental-weakness", "Ice"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Smash", "Reduces one target to 1 HP."),
      enemyFact("attack", "Earth Shake", "Heavy Earth-elemental damage; Quina can learn it with Eat."),
      enemyFact("attack", "Snort", "Can eject one character from battle."),
      enemyFact("attack", "Charge", "Heavy physical damage."),
    ],
    blueMagic: [pandemoniumBlueMagic("Earth Shake")],
    strategies: [{ title: "Protect against its strongest attacks", detail: "Ice exploits its weakness. Prepare healing for Smash, and defend against Earth Shake; status attacks can also subdue it.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [pandemoniumBlueMagicObjectiveId],
    notes: ["This repeatable random form is listed separately from the fixed Shell Dragon story fight."],
  }),
  pandemoniumMover("enemy.mover-left", "Mover [Left]", 7353, 2062),
  pandemoniumMover("enemy.mover-middle", "Mover [Middle]", 7353, 2064),
  pandemoniumMover("enemy.mover-right", "Mover [Right]", 3677, 2065),
  pandemoniumBoss({
    id: "enemy.amdusias-fixed",
    name: "Amdusias",
    encounterIds: ["encounter.pandemonium.fixed-amdusias"],
    stats: [
      { field: "level", value: 54, sourceIds: ["gamefaqs-portal-to-another-world-71891"], verification: "single-source" },
      { field: "HP", value: 10926, sourceIds: ["gamefaqs-portal-to-another-world-71891"], verification: "disputed" },
      { field: "HP", value: 20926, sourceIds: ["jegged-pandemonium", "elitegrindlab-pandemonium"], verification: "disputed" },
      ...pandemoniumStats([["MP", 9282], ["EXP", 26376], ["AP", 3], ["Gil", 2316]]),
    ],
    steals: [pandemoniumLoot("common", "game-item.tent"), pandemoniumLoot("uncommon", "game-item.ether"), pandemoniumLoot("semi-rare", null, "Nothing"), pandemoniumLoot("rare", null, "Nothing")],
    drops: [pandemoniumLoot("always", "game-item.ether"), pandemoniumLoot("common", null, "Nothing"), pandemoniumLoot("uncommon", null, "Nothing"), pandemoniumLoot("rare", null, "Nothing")],
    facts: [
      pandemoniumFact("type", "Aerial and Demon"),
      pandemoniumFact("elemental-weakness", "Wind"),
      pandemoniumFact("elemental-resistance", "Earth nullified"),
      pandemoniumFact("attack", "Bio, Thundara, and Horn", "Bio and Thundara are magic attacks; Horn is physical."),
    ],
    blueMagic: [],
    strategies: [{ title: "Stay alive until allies arrive", detail: "Zidane starts alone. Heal or defend until Freya and Amarant join, then use Jump and focused attacks.", sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium"] }],
    routeObjectiveIds: [pandemoniumClimaxObjectiveId],
    notes: ["GameFAQs lists 10,926 HP; Jegged and EliteGrindLab list 20,926. The disagreement is shown without selecting a value."],
  }),
  pandemoniumBoss({
    id: "enemy.abadon-fixed",
    name: "Abadon (fixed fight)",
    encounterIds: ["encounter.pandemonium.fixed-abadon"],
    stats: pandemoniumStats([["level", 54], ["HP", 10926], ["MP", 9383], ["EXP", 26376], ["AP", 4], ["Gil", 2348]]),
    steals: [pandemoniumLoot("common", "game-item.vaccine"), pandemoniumLoot("uncommon", "game-item.ether"), pandemoniumLoot("semi-rare", null, "Nothing"), pandemoniumLoot("rare", null, "Nothing")],
    drops: [pandemoniumLoot("always", "game-item.ether"), pandemoniumLoot("common", null, "Nothing"), pandemoniumLoot("uncommon", null, "Nothing"), pandemoniumLoot("rare", null, "Nothing")],
    facts: [
      pandemoniumFact("type", "Aerial and Bug"),
      pandemoniumFact("elemental-weakness", "Wind"),
      pandemoniumFact("elemental-resistance", "Earth nullified"),
      pandemoniumFact("attack", "Blade, High Wind, and Thundaga", "Blade targets one character; High Wind hits the party."),
    ],
    blueMagic: [],
    strategies: [{ title: "Keep Steiner and Quina healthy", detail: "They begin the battle before Zidane joins. Quina can heal with learned Blue Magic; the fight's scripted form is not listed as an Eat source for Twister.", sourceIds: ["gamefaqs-portal-to-another-world-71891", "flactem-pandemonium"] }],
    routeObjectiveIds: [pandemoniumClimaxObjectiveId],
    notes: ["This level-54 scripted variant is separate from the level-58 Abadon [B] in random encounters. The enemy-reference HP belongs to the random form."],
  }),
  pandemoniumBoss({
    id: "enemy.shell-dragon-fixed",
    name: "Shell Dragon (fixed fight)",
    encounterIds: ["encounter.pandemonium.fixed-shell-dragon"],
    stats: [
      ...pandemoniumStats([["level", 54], ["MP", 9335], ["EXP", 26376], ["AP", 4], ["Gil", 2332]]),
      { field: "HP", value: 10921, sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium"], verification: "disputed" },
      { field: "HP", value: 20921, sourceIds: ["elitegrindlab-pandemonium"], verification: "disputed" },
    ],
    steals: [pandemoniumLoot("common", "game-item.phoenix-down"), pandemoniumLoot("uncommon", "game-item.elixir"), pandemoniumLoot("semi-rare", null, "Nothing"), pandemoniumLoot("rare", null, "Nothing")],
    drops: [pandemoniumLoot("always", "game-item.elixir"), pandemoniumLoot("common", "game-item.hi-potion"), pandemoniumLoot("uncommon", "game-item.vaccine"), pandemoniumLoot("rare", null, "Nothing")],
    facts: [
      pandemoniumFact("type", "Dragon"),
      pandemoniumFact("elemental-weakness", "Ice"),
      pandemoniumFact("attack", "Smash", "Reduces one target to 1 HP."),
      pandemoniumFact("attack", "Earth Shake", "Heavy Earth-elemental damage."),
      pandemoniumFact("attack", "Charge", "Physical damage."),
    ],
    blueMagic: [pandemoniumBlueMagic("Earth Shake", ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "flactem-pandemonium"])],
    strategies: [{ title: "Survive the solo opening", detail: "Zidane begins alone. Use Float or Earth protection against Earth Shake and heal as soon as Smash leaves a character at 1 HP; Dagger joins during the encounter.", sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium"] }],
    routeObjectiveIds: [pandemoniumClimaxObjectiveId, pandemoniumBlueMagicObjectiveId],
    notes: ["GameFAQs and Jegged list 10,921 HP; EliteGrindLab lists 20,921. Whether Quina can learn Earth Shake from this fixed version remains disputed; the random Shell Dragon [B] is a confirmed teacher."],
  }),
  pandemoniumBoss({
    id: "enemy.silver-dragon",
    name: "Silver Dragon",
    encounterIds: ["encounter.pandemonium.silver-dragon"],
    stats: [
      ...pandemoniumStats([["level", 58], ["MP", 9999], ["EXP", 0], ["AP", 13], ["Gil", 5240]]),
      { field: "HP", value: 24056, sourceIds: ["gamefaqs-portal-to-another-world-71891"], verification: "disputed" },
      { field: "HP", value: 24055, sourceIds: ["jegged-pandemonium"], verification: "disputed" },
      { field: "HP", value: 34055, sourceIds: ["elitegrindlab-pandemonium"], verification: "disputed" },
    ],
    steals: [pandemoniumLoot("common", "game-item.elixir"), pandemoniumLoot("uncommon", "game-item.dragon-mail"), pandemoniumLoot("semi-rare", "game-item.kaiser-knuckles"), pandemoniumLoot("rare", null, "Nothing")],
    drops: [pandemoniumLoot("always", "game-item.wing-edge"), pandemoniumLoot("common", "game-item.elixir"), pandemoniumLoot("uncommon", "game-item.elixir"), pandemoniumLoot("rare", "game-item.elixir")],
    facts: [
      pandemoniumFact("type", "Dragon and Aerial"),
      pandemoniumFact("elemental-weakness", "Ice and Wind"),
      pandemoniumFact("elemental-resistance", "Earth nullified"),
      pandemoniumFact("status-vulnerability", "Darkness, Silence, Sleep, and Slow"),
      pandemoniumFact("attack", "Twister and Aerial Slash", "Both attacks deal Wind-elemental damage."),
      pandemoniumFact("attack", "Shockwave and Claw", "Physical attacks; Shockwave can hit multiple targets."),
    ],
    blueMagic: [],
    strategies: [{ title: "Prepare Wind protection and attempt every steal", detail: "Wind resistance reduces its strongest attacks. Sleep, Slow, Silence, and Blind can create safer turns for Zidane to steal Dragon Mail and Kaiser Knuckles.", sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium"] }],
    routeObjectiveIds: [pandemoniumStealsObjectiveId, pandemoniumClimaxObjectiveId],
    notes: ["HP claims are disputed: GameFAQs lists 24,056, Jegged 24,055, and EliteGrindLab 34,055. The guaranteed Wing Edge drop is separate from the listed conditional Elixir slots."],
  }, [pandemoniumStealsMissableId], [pandemoniumCutoffId]),
  pandemoniumBoss({
    id: "enemy.garland",
    name: "Garland",
    encounterIds: ["encounter.pandemonium.garland"],
    stats: [
      ...pandemoniumStats([["level", 62], ["MP", 9999], ["EXP", 0], ["AP", 0], ["Gil", 0]]),
      { field: "HP", value: 40729, sourceIds: ["gamefaqs-portal-to-another-world-71891"], verification: "disputed" },
      { field: "HP", value: 40728, sourceIds: ["jegged-pandemonium"], verification: "disputed" },
      { field: "HP", value: 50728, sourceIds: ["elitegrindlab-pandemonium"], verification: "disputed" },
    ],
    steals: [pandemoniumLoot("common", "game-item.battle-boots"), pandemoniumLoot("uncommon", "game-item.ninja-gear"), pandemoniumLoot("semi-rare", "game-item.dark-gear"), pandemoniumLoot("rare", null, "Nothing")],
    drops: [pandemoniumLoot("always", null, "Nothing"), pandemoniumLoot("common", null, "Nothing"), pandemoniumLoot("uncommon", null, "Nothing"), pandemoniumLoot("rare", null, "Nothing")],
    facts: [
      pandemoniumFact("type", "Human"),
      pandemoniumFact("status-vulnerability", "Darkness, Silence, and Slow"),
      pandemoniumFact("attack", "Flare and Stop", "Silence prevents his dangerous spell casting; Locomotion blocks Stop."),
      pandemoniumFact("attack", "Wave and Psychokinesis", "Physical attacks; Psychokinesis is unblockable."),
    ],
    blueMagic: [],
    strategies: [{ title: "Silence Garland and keep Locomotion active", detail: "Silence suppresses Flare and Stop; Darkness and Slow are also listed status weaknesses. Attempt all three steals before moving to Kuja.", sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium"] }],
    routeObjectiveIds: [pandemoniumStealsObjectiveId, pandemoniumClimaxObjectiveId],
    notes: ["HP claims are disputed: GameFAQs lists 40,729, Jegged 40,728, and EliteGrindLab 50,728."],
  }, [pandemoniumStealsMissableId], [pandemoniumCutoffId]),
  pandemoniumBoss({
    id: "enemy.kuja",
    name: "Kuja",
    encounterIds: ["encounter.pandemonium.kuja"],
    stats: [
      ...pandemoniumStats([["level", 64], ["MP", 9999], ["EXP", 0], ["AP", 0], ["Gil", 0]]),
      { field: "HP", value: 42383, sourceIds: ["gamefaqs-portal-to-another-world-71891"], verification: "disputed" },
      { field: "HP", value: 42382, sourceIds: ["jegged-pandemonium"], verification: "disputed" },
      { field: "HP", value: 52382, sourceIds: ["elitegrindlab-pandemonium"], verification: "disputed" },
    ],
    steals: [pandemoniumLoot("common", "game-item.ether"), pandemoniumLoot("uncommon", "game-item.carabini-mail"), pandemoniumLoot("semi-rare", null, "Nothing"), pandemoniumLoot("rare", null, "Light Robe")],
    drops: [pandemoniumLoot("always", null, "Nothing"), pandemoniumLoot("common", null, "Nothing"), pandemoniumLoot("uncommon", null, "Nothing"), pandemoniumLoot("rare", null, "Nothing")],
    facts: [
      pandemoniumFact("type", "Human"),
      pandemoniumFact("status-vulnerability", "Darkness and Slow"),
      pandemoniumFact("attack", "Demi and Thundaga", "Demi deals a portion of maximum HP as damage; Thundaga is Thunder-elemental."),
      pandemoniumFact("attack", "Flare Star", "Can become frequent if the party uses Reflect or reduces Kuja's MP to zero."),
      pandemoniumFact("attack", "Ultima", "A scripted attack follows the battle and reduces the party to 1 HP."),
    ],
    blueMagic: [],
    strategies: [{ title: "Use Shell and avoid Reflect", detail: "Shell helps against Kuja's magic. Do not cast Reflect or use Carbuncle's Reflect effect; attempt to steal Light Robe before victory.", sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium"] }],
    routeObjectiveIds: [pandemoniumStealsObjectiveId, pandemoniumClimaxObjectiveId],
    notes: ["HP claims are disputed: GameFAQs lists 42,383, Jegged 42,382, and EliteGrindLab 52,382. Ultima is part of the scripted ending rather than a continuing attack pattern. Light Robe remains source text because the current item catalog has not normalized it."],
  }, [pandemoniumStealsMissableId], [pandemoniumCutoffId]),
];

const iifaTreeEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.nova-dragon",
    name: "Nova Dragon",
    encounterIds: ["encounter.iifa-tree.nova-dragon"],
    stats: [
      ...sourcedStats([["level", 67], ["MP", 9999], ["EXP", 0], ["AP", 13], ["Gil", 9506]], ["gamefaqs-second-battle-iifa-tree-71891"]),
      { field: "HP", value: 54941, sourceIds: ["gamefaqs-second-battle-iifa-tree-71891"], verification: "disputed" },
      { field: "HP", value: 54940, sourceIds: ["jegged-memoria-nova-dragon"], verification: "disputed" },
    ],
    steals: [
      sourcedLoot("common", "game-item.remedy", novaDragonSources),
      sourcedLoot("uncommon", "game-item.dragon-wrist", novaDragonSources),
      sourcedLoot("semi-rare", null, novaDragonSources, "Nothing"),
      { ...sourcedLoot("rare", "game-item.grand-armor", novaDragonSources), note: "GameFAQs lists Grand Armor in the Rare slot; Jegged describes it as Very Rare. This display follows the GameFAQs table and keeps the wording conflict visible." },
    ],
    drops: [
      sourcedLoot("always", "game-item.wing-edge", novaDragonSources),
      sourcedLoot("common", "game-item.ether", novaDragonSources),
      sourcedLoot("uncommon", "game-item.elixir", novaDragonSources),
      sourcedLoot("rare", null, ["gamefaqs-second-battle-iifa-tree-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Dragon and Aerial", novaDragonSources),
      sourcedFact("elemental-weakness", "Ice and Wind", novaDragonSources),
      sourcedFact("elemental-resistance", "Earth nullified", novaDragonSources),
      sourcedFact("status-vulnerability", "Darkness, Silence, Sleep, and Slow", novaDragonSources),
      sourcedFact("attack", "Twister", novaDragonSources, "Wind damage to the party."),
      sourcedFact("attack", "Aerial Slash", novaDragonSources, "Wind damage to the party."),
      sourcedFact("attack", "Tidal Wave", novaDragonSources, "Water damage to the party."),
      sourcedFact("attack", "Shockwave", ["gamefaqs-second-battle-iifa-tree-71891"], "Physical damage to the party."),
      sourcedFact("attack", "Psychokinesis", ["gamefaqs-second-battle-iifa-tree-71891"], "Unblockable single-target attack."),
      sourcedFact("attack", "Counter", ["gamefaqs-second-battle-iifa-tree-71891"], "Can retaliate after taking damage."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Prioritize Wind and Water protection", detail: "Equip Wind resistance first, then Water resistance. Ribbons absorb both elements; Protect Rings reduce elemental damage. Bird Killer also increases damage against this Aerial enemy.", sourceIds: novaDragonSources },
      { title: "Use Sleep during the Grand Armor steal attempt", detail: "Sleep can keep Nova Dragon from attacking while Zidane tries to steal. Ultima Weapon's Soul Blade can inflict Sleep; Master Thief improves the very-rare steal chance. Silence may shift attacks toward Shockwave and Psychokinesis when Wind is already nullified.", sourceIds: novaDragonSources },
    ],
    routeObjectiveIds: [novaDragonStealsObjectiveId, memoriaEntryObjectiveId],
    notes: [
      "HP claims conflict by one point: GameFAQs lists 54,941 and Jegged lists 54,940. The conflict remains visible pending direct game verification.",
      "The encounter is one-time. The linked Grand Armor warning describes the conditional Black Mage Village synthesis fallback when a Mythril Sword was retained.",
    ],
  }, iifaTreeChapterId, novaDragonSources, [novaDragonMissableId], [novaDragonCutoffId]),
];

const memoriaEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.hades",
    name: "Hades",
    encounterIds: ["encounter.memoria.hades"],
    stats: sourcedStats([["level", 92], ["HP", 55535], ["MP", 9999], ["EXP", 65535], ["AP", 30], ["Gil", 9638]], ["gamefaqs-master-synthesist-71891"]),
    steals: [
      sourcedLoot("common", "game-item.reflect-ring", ["gamefaqs-master-synthesist-71891"]),
      sourcedLoot("uncommon", "game-item.running-shoes", ["gamefaqs-master-synthesist-71891"]),
      sourcedLoot("semi-rare", "game-item.battle-boots", ["gamefaqs-master-synthesist-71891"]),
      sourcedLoot("rare", "game-item.robe-of-lords", ["gamefaqs-master-synthesist-71891"]),
    ],
    drops: [
      sourcedLoot("always", "game-item.wing-edge", ["gamefaqs-master-synthesist-71891"]),
      sourcedLoot("common", "game-item.elixir", ["gamefaqs-master-synthesist-71891"]),
      sourcedLoot("uncommon", "game-item.elixir", ["gamefaqs-master-synthesist-71891"]),
      sourcedLoot("rare", "game-item.elixir", ["gamefaqs-master-synthesist-71891"]),
    ],
    facts: [
      sourcedFact("type", "Demon", ["gamefaqs-master-synthesist-71891"]),
      sourcedFact("type", "Aerial", ["gamefaqs-master-synthesist-71891"]),
      sourcedFact("elemental-weakness", "Holy", ["gamefaqs-master-synthesist-71891"]),
      sourcedFact("elemental-resistance", "Shadow absorbed; Earth nullified", ["gamefaqs-master-synthesist-71891"]),
      sourcedFact("status-vulnerability", "Slow", ["gamefaqs-master-synthesist-71891"]),
      sourcedFact("attack", "Freeze", ["gamefaqs-master-synthesist-71891"], "Can inflict Freeze; Body Temp prevents the status."),
      sourcedFact("attack", "Mustard Bomb", ["gamefaqs-master-synthesist-71891"], "Inflicts Heat; a character who acts while heated is KO'd."),
      sourcedFact("attack", "Cleave", ["gamefaqs-master-synthesist-71891"], "Powerful physical attack against the party."),
      sourcedFact("attack", "Judgment Sword", ["gamefaqs-master-synthesist-71891"], "Reduces one character's HP to 1; may miss."),
      sourcedFact("attack", "Powering Sword", ["gamefaqs-master-synthesist-71891"], "Counts down for three turns, then Hades uses Curse after odd-numbered countdowns or Doomsday after even-numbered countdowns."),
      sourcedFact("attack", "Curse", ["gamefaqs-master-synthesist-71891"], "Deals party damage and can inflict Darkness, Confuse, Mini, Poison, or Slow."),
      sourcedFact("attack", "Doomsday", ["gamefaqs-master-synthesist-71891"], "Deals heavy Shadow damage and heals Hades for 9,999 HP."),
      sourcedFact("attack", "Reflect", ["gamefaqs-master-synthesist-71891"], "Hades can cast Reflect on himself."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Nullify or absorb Shadow", detail: "Doomsday deals heavy Shadow damage and can heal Hades. Use equipment that nullifies or absorbs Shadow; halving Shadow damage is not enough according to the source strategy.", sourceIds: ["gamefaqs-master-synthesist-71891"] },
      { title: "Steal before finishing the fight", detail: "The four equipment steals are available only during this optional one-time encounter. Slow can help control Hades while Zidane attempts the selected steals; protect against Heat and status effects.", sourceIds: hadesEnemySources },
    ],
    routeObjectiveIds: ["disc-4.memoria.hades", "disc-4.memoria.hades-steals"],
    notes: [
      "GameFAQs lists Elixir in the Common, Uncommon, and Rare drop slots as well as an Always Wing Edge drop. The item-path record captures the Elixir source without assuming a drop probability or total quantity.",
      "RPGClassics confirms Hades's location and four steals but describes a two-Pumice-Piece handoff before shop access; GameFAQs says the shop opens after victory. The source register preserves this trigger difference pending direct game verification.",
    ],
  }, memoriaChapterId, hadesEnemySources, ["missable.disc-4.memoria.hades-shop", "missable.disc-4.memoria.hades-running-shoes"], ["cutoff.final-preparations.final-battle"]),
  memoriaBoss({
    id: "enemy.maliris",
    name: "Maliris",
    encounterIds: ["encounter.memoria.maliris"],
    stats: [
      { field: "level", value: 72, sourceIds: memoriaEnemySources, verification: "cross-checked" },
      { field: "HP", value: 56497, sourceIds: ["gamefaqs-memoria-71891"], verification: "disputed" },
      { field: "HP", value: 59497, sourceIds: ["jegged-memoria-nova-dragon"], verification: "disputed" },
      ...sourcedStats([["MP", 3381], ["EXP", 0], ["AP", 10], ["Gil", 8532]], ["gamefaqs-memoria-71891"]),
    ],
    steals: [
      memoriaLoot("common", "game-item.genji-armor"),
      memoriaLoot("uncommon", "game-item.ultima-sword"),
      memoriaLoot("semi-rare", "game-item.masamune"),
      memoriaLoot("rare", null, "Nothing"),
    ],
    drops: [
      memoriaLoot("always", "game-item.phoenix-pinion"),
      memoriaLoot("common", "game-item.phoenix-down"),
      memoriaLoot("uncommon", "game-item.ether"),
      memoriaLoot("rare", "game-item.elixir"),
    ],
    facts: [
      memoriaFact("type", "Demon"),
      memoriaFact("elemental-weakness", "Ice"),
      memoriaFact("elemental-resistance", "Fire absorbed"),
      memoriaFact("status-vulnerability", "Sleep and Slow"),
      memoriaFact("attack", "Firaga and Flame Slash", "Fire-elemental damage to one character."),
      memoriaFact("attack", "Sword Quiver", "Physical damage to the party."),
      memoriaFact("attack", "Mustard Bomb", "Inflicts Heat; a character who acts while heated is immediately KO'd."),
      memoriaFact("attack", "Raining Swords", "A heavy party-wide attack triggered at the end of the fight."),
      memoriaFact("attack", "Reflect", "Maliris can cast Reflect on herself."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Protect against Fire and Heat", detail: "Use Fire-resistant or absorbing equipment and Body Temp. Keep the party's HP high before finishing the fight because Raining Swords follows the defeat.", sourceIds: memoriaEnemySources },
      { title: "Sleep while Zidane steals", detail: "Ultima Weapon's Soul Blade can inflict Sleep. Attempt the three equipment steals before using Ice attacks to finish Maliris.", sourceIds: memoriaEnemySources },
    ],
    routeObjectiveIds: ["disc-4.memoria.maliris-steals"],
    notes: [
      "HP claims conflict: GameFAQs lists 56,497 while Jegged lists 59,497. Both are retained pending direct game verification.",
      "Steal and drop slot labels follow GameFAQs's four-slot table. Jegged labels Masamune as Rare rather than Semi-Rare and uses different rarity terms for the Phoenix Down, Ether, and Elixir drops.",
    ],
  }, "missable.disc-4.memoria.maliris-steals", "cutoff.memoria.maliris-steals"),
  memoriaBoss({
    id: "enemy.tiamat-memoria",
    name: "Tiamat",
    encounterIds: ["encounter.memoria.tiamat"],
    stats: [
      { field: "level", value: 72, sourceIds: memoriaEnemySources, verification: "cross-checked" },
      { field: "HP", value: 56497, sourceIds: ["gamefaqs-memoria-71891"], verification: "disputed" },
      { field: "HP", value: 59494, sourceIds: ["jegged-memoria-nova-dragon"], verification: "disputed" },
      ...sourcedStats([["MP", 3381], ["EXP", 0], ["AP", 10], ["Gil", 8532]], ["gamefaqs-memoria-71891"]),
    ],
    steals: [
      memoriaLoot("common", "game-item.blood-sword"),
      memoriaLoot("uncommon", "game-item.feather-boots"),
      memoriaLoot("semi-rare", null, "Nothing"),
      memoriaLoot("rare", "game-item.grand-helm"),
    ],
    drops: [
      memoriaLoot("always", "game-item.wing-edge"),
      memoriaLoot("common", "game-item.phoenix-down"),
      memoriaLoot("uncommon", "game-item.ether"),
      memoriaLoot("rare", "game-item.elixir"),
    ],
    facts: [
      memoriaFact("type", "Dragon"),
      memoriaFact("elemental-weakness", "Ice"),
      memoriaFact("elemental-resistance", "Wind absorbed"),
      memoriaFact("status-vulnerability", "Silence, Sleep, and Slow"),
      memoriaFact("attack", "Twister", "Wind-elemental damage to the party."),
      memoriaFact("attack", "Float", "Floats party members; attacking a floating character can trigger Snort."),
      memoriaFact("attack", "Absorb MP, Absorb Magic, and Absorb Strength", "Drain MP or lower one character's Magic or Strength."),
      memoriaFact("attack", "Jet Fire", "Fire damage with a chance to inflict Heat."),
      memoriaFact("attack", "Silent Claw", "Physical damage with a chance to inflict Silence."),
      memoriaFact("attack", "Snort", "A counter that removes a floating character from the battle when that character is attacked."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Sleep the guardian during the steal attempt", detail: "Sleep can suppress Tiamat while Zidane works through the one-fight steal table. Keep Body Temp equipped for Jet Fire's Heat effect.", sourceIds: memoriaEnemySources },
      { title: "Avoid the Snort counter", detail: "Do not attack Tiamat while a party member is floating. Wait for Float to expire or use Dispel before attacking; prepare Wind and Fire protection.", sourceIds: memoriaEnemySources },
    ],
    routeObjectiveIds: ["disc-4.memoria.tiamat-steals"],
    notes: [
      "HP claims conflict: GameFAQs lists 56,497 while Jegged lists 59,494. Both are retained pending direct game verification.",
      "Steal and drop slot labels follow GameFAQs's four-slot table. Jegged labels Grand Helm Very Rare and uses different rarity terms for the Phoenix Down, Ether, and Elixir drops.",
    ],
  }, "missable.disc-4.memoria.tiamat-steals", "cutoff.memoria.tiamat-steals"),
  memoriaBoss({
    id: "enemy.kraken-memoria",
    name: "Kraken",
    encounterIds: ["encounter.memoria.kraken"],
    stats: [
      { field: "level", value: 72, sourceIds: memoriaEnemySources, verification: "cross-checked" },
      { field: "HP", value: 55536, sourceIds: ["gamefaqs-memoria-71891"], verification: "disputed" },
      { field: "HP", value: 59496, sourceIds: ["jegged-memoria-nova-dragon"], verification: "disputed" },
      ...sourcedStats([["MP", 3380], ["EXP", 0], ["AP", 10], ["Gil", 17376]], ["gamefaqs-memoria-71891"]),
    ],
    steals: [
      memoriaLoot("common", "game-item.genji-helmet"),
      memoriaLoot("uncommon", "game-item.wizard-rod"),
      memoriaLoot("semi-rare", null, "Nothing"),
      memoriaLoot("rare", "game-item.gluttons-robe"),
    ],
    drops: [
      memoriaLoot("always", "game-item.phoenix-pinion"),
      memoriaLoot("common", "game-item.phoenix-down"),
      memoriaLoot("uncommon", "game-item.ether"),
      memoriaLoot("rare", "game-item.elixir"),
    ],
    facts: [
      memoriaFact("type", "Dragon"),
      memoriaFact("elemental-weakness", "Lightning"),
      memoriaFact("elemental-resistance", "Water absorbed; Ice damage halved"),
      memoriaFact("status-vulnerability", "Slow"),
      memoriaFact("attack", "Water-gun", "Single-target Water damage; enabled by a tentacle. Guides disagree about which side uses it.", ["gamefaqs-memoria-71891", "jegged-memoria-nova-dragon", "gamerguides-memoria-kraken"]),
      memoriaFact("attack", "Ink", "Can inflict Darkness; enabled by a tentacle. Guides disagree about which side uses it.", ["gamefaqs-memoria-71891", "jegged-memoria-nova-dragon", "gamerguides-memoria-kraken"]),
      memoriaFact("attack", "Leg", "Physical damage to one character; becomes available after a tentacle is defeated and can counter attacks."),
      memoriaFact("attack", "Freeze", "Inflicts Freeze; Body Temp prevents the status."),
      memoriaFact("attack", "Waterga", "Heavy Water-elemental damage."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Equip Water protection and Body Temp", detail: "Water resistance or absorption sharply reduces Kraken's main damage. Body Temp prevents Freeze; Bright Eyes helps with Ink's Darkness.", sourceIds: memoriaEnemySources },
      { title: "Use Lightning after Zidane finishes stealing", detail: "Lightning exploits Kraken's weakness. The two tentacles enable Water-gun and Ink; each can be targeted separately. Their individual stats and loot appear in the component records.", sourceIds: memoriaEnemySources },
    ],
    routeObjectiveIds: ["disc-4.memoria.kraken-steals"],
    notes: [
      "HP claims conflict: GameFAQs lists 55,536 while Jegged lists 59,496. Both are retained pending direct game verification.",
      "Steal and drop slot labels follow GameFAQs's four-slot table. The GameFAQs item reference calls Genji Helmet Genji Helm, while the walkthroughs use Genji Helmet. Jegged labels Glutton's Robe Very Rare and gives percentages for the conditional Phoenix Down, Ether, and Elixir drops. Tentacle HP and right-side steal claims conflict across the GameFAQs walkthrough, its older monster list, and RPGClassics; the component dossiers preserve those claims separately.",
    ],
  }, "missable.disc-4.memoria.kraken-steals", "cutoff.memoria.kraken-steals", [...memoriaEnemySources, "gamerguides-memoria-kraken", "gamefaqs-monster-list-20490", "rpgclassics-kraken-bestiary"]),
  memoriaComponent({
    id: "enemy.kraken-left-tentacle",
    name: "Kraken — Left Tentacle",
    encounterIds: ["encounter.memoria.kraken"],
    stats: [
      { field: "level", value: 71, sourceIds: ["gamefaqs-monster-list-20490"], verification: "single-source" },
      { field: "HP", value: 10001, sourceIds: ["gamefaqs-memoria-71891", "gamefaqs-monster-list-20490"], verification: "disputed" },
      { field: "HP", value: 18169, sourceIds: ["rpgclassics-kraken-bestiary"], verification: "disputed" },
      ...sourcedStats([["MP", 3339], ["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-monster-list-20490"]),
    ],
    steals: [
      sourcedLoot("common", "game-item.elixir", ["gamefaqs-memoria-71891", "gamefaqs-monster-list-20490"]),
    ],
    drops: [],
    facts: [
      sourcedFact("type", "Demon", ["gamefaqs-monster-list-20490"]),
      sourcedFact("elemental-weakness", "Lightning", ["gamefaqs-monster-list-20490"]),
      sourcedFact("elemental-resistance", "Water absorbed; Ice damage halved", ["gamefaqs-monster-list-20490"]),
      sourcedFact("status-vulnerability", "None", ["gamefaqs-memoria-71891", "gamefaqs-monster-list-20490"], "GameFAQs says the tentacles have no status weaknesses; its enemy table marks their listed status effects immune."),
      sourcedFact("attack", "Tentacle-activated attacks", ["gamefaqs-memoria-71891", "jegged-memoria-nova-dragon", "gamerguides-memoria-kraken"], "GameFAQs lists Water-gun and Ink as Kraken attacks but does not assign them to a side. Jegged and Gamer Guides give opposite left/right assignments."),
    ],
    blueMagic: [],
    strategies: [],
    routeObjectiveIds: [],
    notes: [
      "GameFAQs lists 10,001 HP, but RPGClassics lists 18,169 HP. Preserve both values pending direct verification.",
      "The older GameFAQs monster list gives the Left Tentacle a Common Elixir steal. Its current walkthrough reports a Common Elixir steal with shared tentacle details but does not print side-specific tables. GameFAQs says the tentacles have no drops.",
    ],
  }, memoriaTentacleSources),
  memoriaComponent({
    id: "enemy.kraken-right-tentacle",
    name: "Kraken — Right Tentacle",
    encounterIds: ["encounter.memoria.kraken"],
    stats: [
      { field: "level", value: 71, sourceIds: ["gamefaqs-monster-list-20490"], verification: "single-source" },
      { field: "HP", value: 10001, sourceIds: ["gamefaqs-memoria-71891", "gamefaqs-monster-list-20490"], verification: "disputed" },
      { field: "HP", value: 18168, sourceIds: ["rpgclassics-kraken-bestiary"], verification: "disputed" },
      ...sourcedStats([["MP", 3338], ["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-monster-list-20490"]),
    ],
    steals: [
      sourcedLoot("common", "game-item.elixir", ["gamefaqs-memoria-71891"], "The walkthrough reports a Common Elixir steal alongside shared tentacle details but does not print a side-specific table. Its older enemy list and RPGClassics instead list Wing Edge for the Right Tentacle."),
    ],
    drops: [],
    facts: [
      sourcedFact("type", "Demon", ["gamefaqs-monster-list-20490"]),
      sourcedFact("elemental-weakness", "Lightning", ["gamefaqs-monster-list-20490"]),
      sourcedFact("elemental-resistance", "Water absorbed; Ice damage halved", ["gamefaqs-monster-list-20490"]),
      sourcedFact("status-vulnerability", "None", ["gamefaqs-memoria-71891", "gamefaqs-monster-list-20490"], "GameFAQs says the tentacles have no status weaknesses; its enemy table marks their listed status effects immune."),
      sourcedFact("attack", "Tentacle-activated attacks", ["gamefaqs-memoria-71891", "jegged-memoria-nova-dragon", "gamerguides-memoria-kraken"], "GameFAQs lists Water-gun and Ink as Kraken attacks but does not assign them to a side. Jegged and Gamer Guides give opposite left/right assignments."),
    ],
    blueMagic: [],
    strategies: [],
    routeObjectiveIds: [],
    notes: [
      "GameFAQs lists 10,001 HP, but RPGClassics lists 18,168 HP. Preserve both values pending direct verification.",
      "The Right Tentacle's steal is disputed: the GameFAQs Memoria walkthrough reports a Common Elixir steal alongside shared tentacle details but does not name a side; its older monster list and RPGClassics list Wing Edge for Right Tentacle.",
    ],
  }, memoriaTentacleSources),
  memoriaBoss({
    id: "enemy.lich-memoria",
    name: "Lich",
    encounterIds: ["encounter.memoria.lich"],
    stats: [
      { field: "level", value: 71, sourceIds: memoriaEnemySources, verification: "cross-checked" },
      { field: "HP", value: 58554, sourceIds: memoriaEnemySources, verification: "cross-checked" },
      ...sourcedStats([["MP", 9999], ["EXP", 0], ["AP", 10], ["Gil", 8436]], ["gamefaqs-memoria-71891"]),
    ],
    steals: [
      memoriaLoot("common", "game-item.genji-gloves"),
      memoriaLoot("uncommon", "game-item.sirens-flute"),
      memoriaLoot("semi-rare", "game-item.black-robe"),
      memoriaLoot("rare", null, "Nothing"),
    ],
    drops: [
      memoriaLoot("always", "game-item.phoenix-pinion"),
      memoriaLoot("common", "game-item.phoenix-down"),
      memoriaLoot("uncommon", "game-item.ether"),
      memoriaLoot("rare", "game-item.elixir"),
    ],
    facts: [
      memoriaFact("type", "Demon"),
      memoriaFact("elemental-weakness", "Fire, Wind, and Holy"),
      memoriaFact("elemental-resistance", "Earth absorbed; Shadow damage halved"),
      memoriaFact("status-vulnerability", "Slow"),
      memoriaFact("attack", "LV5 Death", "KOs characters whose levels are multiples of five."),
      memoriaFact("attack", "Death", "Can instantly KO one character."),
      memoriaFact("attack", "Earthquake and Earth Shake", "Earth-elemental damage to the party."),
      memoriaFact("attack", "Death Cutter", "Physical damage with a chance to inflict Doom."),
      memoriaFact("attack", "Doom and Stop", "Status attacks that apply their named effects."),
      memoriaFact("attack", "Venom Powder", "Inflicts Venom."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Prepare for Earth and level-based status attacks", detail: "Use Float or Earth-absorbing/resistant equipment, equip Locomotion and Antibody, and check whether character levels are multiples of five before entering.", sourceIds: memoriaEnemySources },
      { title: "Use Slow and avoid Doomsday", detail: "Slow is effective, and Fire, Wind, or Holy attacks exploit Lich's weaknesses. Do not cast Doomsday while Lich absorbs Earth and halves Shadow damage.", sourceIds: memoriaEnemySources },
    ],
    routeObjectiveIds: ["disc-4.memoria.lich-steals"],
    notes: [
      "GameFAQs and Jegged agree on Lich's 58,554 HP, level 71, and Earth absorption. The separate checkpoint 14 warning is linked to the approach immediately before this encounter.",
      "Steal and drop slot labels follow GameFAQs's four-slot table. Jegged labels Black Robe Rare rather than Semi-Rare and uses different rarity terms for the Phoenix Down, Ether, and Elixir drops.",
    ],
  }, "missable.disc-4.memoria.lich-steals", "cutoff.memoria.lich-steals"),
  memoriaBoss({
    id: "enemy.deathguise",
    name: "Deathguise",
    encounterIds: ["encounter.memoria.deathguise"],
    stats: [
      { field: "level", value: 74, sourceIds: deathguiseEnemySources, verification: "cross-checked" },
      { field: "HP", value: 55535, sourceIds: deathguiseEnemySources, verification: "cross-checked" },
      ...sourcedStats([["MP", 9999], ["EXP", 0], ["AP", 0], ["Gil", 8916]], ["gamefaqs-memoria-71891"]),
    ],
    steals: [
      memoriaLoot("common", "game-item.elixir"),
      memoriaLoot("uncommon", "game-item.black-belt"),
      memoriaLoot("semi-rare", null, "Nothing"),
      memoriaLoot("rare", "game-item.duel-claws"),
    ],
    drops: [
      memoriaLoot("always", "game-item.wing-edge"),
      memoriaLoot("common", "game-item.phoenix-down"),
      memoriaLoot("uncommon", "game-item.ether"),
      memoriaLoot("rare", "game-item.elixir"),
    ],
    facts: [
      memoriaFact("type", "Demon and Aerial", undefined, deathguiseEnemySources),
      memoriaFact("elemental-weakness", "Ice and Wind", undefined, deathguiseEnemySources),
      memoriaFact("elemental-resistance", "Earth nullified", undefined, deathguiseEnemySources),
      memoriaFact("status-vulnerability", "Sleep and Slow", undefined, deathguiseEnemySources),
      memoriaFact("attack", "Meteor", "Deathguise opens the battle with this party-wide non-elemental attack.", deathguiseEnemySources),
      memoriaFact("attack", "Spin", "Physical damage to the whole party while Deathguise is open.", deathguiseEnemySources),
      memoriaFact("attack", "Demon's Claw", "Physical damage to one character while Deathguise is open.", deathguiseEnemySources),
      memoriaFact("attack", "Death and LV5 Death", "Can KO a target; LV5 Death affects characters whose levels are multiples of five.", deathguiseEnemySources),
      memoriaFact("attack", "Twister", "Wind-elemental damage to the party while Deathguise is closed.", deathguiseEnemySources),
    ],
    blueMagic: [],
    strategies: [
      { title: "Protect against Wind and the opening Meteor", detail: "Equip Wind resistance and heal after the opening Meteor. Check levels that are multiples of five before the fight to reduce the risk from LV5 Death.", sourceIds: deathguiseEnemySources },
      { title: "Use Sleep while attempting the steals", detail: "Sleep and Slow are effective. Keep Zidane stealing through the Elixir, Black Belt, and Duel Claws slots before using strong attacks to finish the fight.", sourceIds: deathguiseEnemySources },
    ],
    routeObjectiveIds: ["disc-4.memoria.deathguise-steals"],
    notes: [
      "GameFAQs and Jegged agree on 55,535 HP and level 74. The attack pattern changes between open and closed forms.",
      "Steal and drop slot labels follow GameFAQs's four-slot table. Jegged labels Duel Claws Very Rare and uses different rarity terms for the Phoenix Down, Ether, and Elixir drops; the steal opportunity closes after this one-time battle.",
    ],
  }, "missable.disc-4.memoria.deathguise-steals", "cutoff.memoria.deathguise-steals", deathguiseEnemySources),
];

const finalBattleEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.trance-kuja",
    name: "Trance Kuja",
    encounterIds: ["encounter.final-battle.trance-kuja"],
    stats: [
      { field: "level", value: 76, sourceIds: finalBattleStatsSources, verification: "cross-checked" },
      { field: "HP", value: 55536, sourceIds: ["gamefaqs-the-final-battle-71891"], verification: "disputed" },
      { field: "HP", value: 55535, sourceIds: ["jegged-kuja-necron-final-showdown"], verification: "disputed" },
      ...sourcedStats([["MP", 9999], ["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-the-final-battle-71891"]),
    ],
    steals: [
      sourcedLoot("common", "game-item.ether", ["gamefaqs-the-final-battle-71891"]),
      sourcedLoot("uncommon", "game-item.white-robe", ["gamefaqs-the-final-battle-71891"]),
      sourcedLoot("semi-rare", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
      sourcedLoot("rare", "game-item.rebirth-ring", ["gamefaqs-the-final-battle-71891"]),
    ],
    drops: [
      sourcedLoot("always", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
      sourcedLoot("common", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("type", "Aerial", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("elemental-weakness", "None", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("elemental-resistance", "None", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("status-vulnerability", "Darkness and Slow", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("attack", "Flare, Holy, Ultima, and Reflect", ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"], "Mostly magical attacks; Kuja can cast Reflect on himself."),
      sourcedFact("attack", "Curaga", ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"], "Kuja can heal himself."),
      sourcedFact("attack", "Flare Star", ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"], "Party-wide damage equal to 35 times each character's level; may occur as a counter, especially at low HP."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Attempt selected steals before dealing damage", detail: "Trance Kuja's one-fight table includes Ether, White Robe, and Rebirth Ring. No return to the save point is possible after this encounter, so complete selected steals before finishing him.", sourceIds: ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"] },
      { title: "Keep the party healed near the end", detail: "Flare Star can punish the party near Kuja's defeat. Keep HP high and avoid Auto-Reflect, which the source warns can lead to dangerous counters.", sourceIds: ["gamefaqs-the-final-battle-71891"] },
    ],
    routeObjectiveIds: ["disc-4.the-final-battle.trance-kuja", "disc-4.the-final-battle.trance-kuja-steals"],
    notes: ["HP reports differ by one point: GameFAQs lists 55,536 and Jegged lists 55,535. Both claims are retained pending direct game verification."],
  }, finalBattleChapterId, finalBattleEnemySources, ["missable.disc-4.the-final-battle.trance-kuja-steals"], ["cutoff.final-battle.trance-kuja-steals"]),
  chapterBoss({
    id: "enemy.necron",
    name: "Necron",
    encounterIds: ["encounter.final-battle.necron"],
    stats: [
      { field: "level", value: 69, sourceIds: finalBattleEnemySources, verification: "cross-checked" },
      { field: "HP", value: 54100, sourceIds: finalBattleStatsSources, verification: "cross-checked" },
      ...sourcedStats([["MP", 9999], ["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-the-final-battle-71891"]),
    ],
    steals: [
      sourcedLoot("common", "game-item.elixir", ["gamefaqs-the-final-battle-71891"]),
      sourcedLoot("uncommon", "game-item.elixir", ["gamefaqs-the-final-battle-71891"]),
      sourcedLoot("semi-rare", "game-item.elixir", ["gamefaqs-the-final-battle-71891"]),
      sourcedLoot("rare", "game-item.elixir", ["gamefaqs-the-final-battle-71891"]),
    ],
    drops: [
      sourcedLoot("always", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
      sourcedLoot("common", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-the-final-battle-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Aerial", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("elemental-weakness", "Wind and Holy", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("elemental-resistance", "Earth nullified", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("status-vulnerability", "Slow", ["gamefaqs-the-final-battle-71891"]),
      sourcedFact("attack", "Firaga, Blizzaga, Thundaga, Flare, Holy, and Meteor", ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"], "Can use elemental spells against one target or the whole party; Meteor deals heavy party damage."),
      sourcedFact("attack", "Blue Shockwave", ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"], "Reduces one character's HP to 1."),
      sourcedFact("attack", "Neutron Ring", ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"], "Heavy physical damage to the party."),
      sourcedFact("attack", "Grand Cross", ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"], "Can inflict a wide range of status effects on the party."),
      sourcedFact("attack", "Curaga, Shell, and Protect", ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"], "Necron can use these spells on itself."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Protect against status effects and major elements", detail: "Grand Cross can inflict many status effects. Prepare status defenses and protect against Fire, Ice, Lightning, and Holy before leaving the party menu after Kuja.", sourceIds: ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"] },
      { title: "Check the four Elixir steal tiers", detail: "GameFAQs lists Elixir in all four steal slots. Jegged lists a single Common Elixir slot with its own probability; the discrepancy is recorded rather than collapsed.", sourceIds: ["gamefaqs-the-final-battle-71891", "jegged-kuja-necron-final-showdown"] },
    ],
    routeObjectiveIds: ["disc-4.the-final-battle.necron-steals"],
    notes: ["The steal tables disagree: GameFAQs lists Elixir in Common, Uncommon, Semi-Rare, and Rare slots; Jegged lists one Common Elixir steal at 70%. Both source claims remain visible."],
  }, finalBattleChapterId, finalBattleEnemySources, ["missable.disc-4.the-final-battle.necron-steals"], ["cutoff.final-battle.necron-steals"]),
];

const ozmaEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.ozma",
    name: "Ozma",
    encounterIds: ["encounter.final-preparations.ozma"],
    stats: sourcedStats([["level", 99], ["HP", 55535], ["MP", 9999], ["EXP", 65535], ["AP", 100], ["Gil", 18312]], ["gamefaqs-ultimate-monster-71891"]),
    steals: [
      sourcedLoot("common", "game-item.elixir", ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891"]),
      sourcedLoot("uncommon", "game-item.robe-of-lords", ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891"]),
      sourcedLoot("semi-rare", "game-item.dark-matter", ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891"]),
      sourcedLoot("rare", "game-item.pumice-piece", ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891"]),
    ],
    drops: [
      sourcedLoot("always", "game-item.pumice", ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891"]),
      sourcedLoot("common", "game-item.dark-matter", ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891"]),
      sourcedLoot("uncommon", "game-item.dark-matter", ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891"]),
      sourcedLoot("rare", "game-item.dark-matter", ["gamefaqs-ultimate-monster-71891", "gamefaqs-items-71891"]),
    ],
    facts: [
      sourcedFact("type", "Aerial", ["gamefaqs-ultimate-monster-71891"]),
      sourcedFact("elemental-weakness", "Wind and Holy; Shadow after Friendly Creatures", ["gamefaqs-ultimate-monster-71891"], "Completing the Friendly Creatures quest changes Ozma's Shadow affinity from absorption to weakness."),
      sourcedFact("elemental-resistance", "Earth nullified; Shadow absorbed if Friendly Creatures is incomplete", ["gamefaqs-ultimate-monster-71891"]),
      sourcedFact("status-vulnerability", "Darkness and Slow", ["gamefaqs-ultimate-monster-71891"]),
      sourcedFact("attack", "Doomsday", ["gamefaqs-ultimate-monster-71891"], "Heavy party-wide Shadow damage. After Friendly Creatures, Ozma becomes weak to Shadow but still casts Doomsday, which can damage it."),
      sourcedFact("attack", "Flare, Holy, and LV4 Holy", ["gamefaqs-ultimate-monster-71891"], "Powerful elemental or non-elemental magic; LV4 Holy checks character levels divisible by four."),
      sourcedFact("attack", "Absorb MP", ["gamefaqs-ultimate-monster-71891"], "Drains a character's MP."),
      sourcedFact("attack", "Mini, Death, and LV5 Death", ["gamefaqs-ultimate-monster-71891"], "Mini targets the party; Death can KO one character; LV5 Death targets characters at levels divisible by five."),
      sourcedFact("attack", "Esuna", ["gamefaqs-ultimate-monster-71891"], "Removes status ailments from Ozma."),
      sourcedFact("attack", "Curse", ["gamefaqs-ultimate-monster-71891"], "Heavy party damage and Darkness, Confuse, Mini, Poison, and Slow."),
      sourcedFact("attack", "Flare Star", ["gamefaqs-ultimate-monster-71891"], "Damage equal to 50 times the target's level; can miss."),
      sourcedFact("attack", "Meteor", ["gamefaqs-ultimate-monster-71891"], "Unblockable party-wide damage with a wide random range."),
      sourcedFact("attack", "Curaga and Berserk counters", ["gamefaqs-ultimate-monster-71891"], "Ozma can counter damage by healing itself with Curaga or inflicting Berserk on the attacker."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Complete Friendly Creatures before the fight", detail: "Finishing the creature quest makes Ozma physically reachable and changes its Shadow affinity from absorbing Shadow to being weak to it. The sidequest makes the fight easier but is not required to reach the Air Garden.", sourceIds: ["gamefaqs-ultimate-monster-71891"] },
      { title: "Prepare for Shadow, Holy, and status attacks", detail: "Nullify Shadow and Holy damage and equip status defenses for Curse and other ailments. Levels divisible by four can draw LV4 Holy; avoid multiples of five if LV5 Death is a concern.", sourceIds: ["gamefaqs-ultimate-monster-71891"] },
      { title: "Finish the selected steals before attacking", detail: "Ozma can fill its ATB and act before a command when it is idle. Delay attacks until Zidane completes the selected steals; Dark Matter and Pumice Piece occupy its rare slots.", sourceIds: ["gamefaqs-ultimate-monster-71891"] },
    ],
    routeObjectiveIds: ["disc-4.final-preparations.ozma-steals", "disc-4.final-preparations.ozma-defeated", "disc-4.final-preparations.ozma-rewards"],
    notes: [
      "The GameFAQs table lists Dark Matter in all three conditional drop slots in addition to a Semi-Rare steal and the one-time Treno auction. The separate drop paths preserve the slots without treating any conditional drop as guaranteed.",
      "Friendly Creatures changes physical reach and Shadow affinity. Exact character level is not required by the route; level-multiple warnings describe Ozma's LV4 Holy and LV5 Death targeting rules.",
    ],
  }, finalPreparationsChapterId, ozmaEnemySources, ["missable.disc-4.final-preparations.ozma-steals"], ["cutoff.final-preparations.final-battle"]),
];

const evilForestEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.prison-cage-garnet",
    name: "Prison Cage (Garnet)",
    encounterIds: ["encounter.evil-forest.prison-cage-garnet"],
    stats: [
      { field: "level", value: 2, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "HP", value: 513, sourceIds: evilForestBossSources, verification: "cross-checked" },
      { field: "MP", value: 1083, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "AP", value: 0, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "Gil", value: 0, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
    ],
    steals: [
      evilForestLoot("common", null, "Nothing"), evilForestLoot("uncommon", null, "Nothing"),
      evilForestLoot("semi-rare", null, "Nothing"), evilForestLoot("rare", null, "Nothing"),
    ],
    drops: [
      evilForestLoot("always", null, "Nothing"), evilForestLoot("common", null, "Nothing"),
      evilForestLoot("uncommon", null, "Nothing"), evilForestLoot("rare", null, "Nothing"),
    ],
    facts: [
      sourcedFact("elemental-weakness", "Fire", evilForestBossSources),
      sourcedFact("attack", "Absorb", evilForestBossSources, "Drains Garnet's HP; her KO causes a Game Over."),
      sourcedFact("attack", "Tidal Flame", ["gamefaqs-evil-forest-71891"], "Can hit Garnet as well as the party; avoid using it in this rescue fight."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Keep Garnet alive", detail: "Absorb drains Garnet's HP. Heal her before a third successful drain can cause a Game Over, and use Zidane's automatic Trance on the cage rather than Tidal Flame.", sourceIds: evilForestBossSources },
    ],
    routeObjectiveIds: ["disc-1.evil-forest.getting-emotional"],
    notes: ["The first scripted boss fight begins with Zidane in Trance and is the supported Steam Getting Emotional trigger."],
  }, evilForestChapterId, [...evilForestBossSources, "steam-achievements"]),
  chapterBoss({
    id: "enemy.prison-cage-vivi",
    name: "Prison Cage (Vivi)",
    encounterIds: ["encounter.evil-forest.prison-cage-vivi"],
    stats: [
      { field: "level", value: 2, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "HP", value: 533, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "disputed" },
      { field: "HP", value: 513, sourceIds: ["jegged-evil-forest"], verification: "disputed" },
      { field: "MP", value: 1186, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "AP", value: 3, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "Gil", value: 436, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
    ],
    steals: [
      evilForestLoot("common", "game-item.broadsword"), evilForestLoot("uncommon", "game-item.leather-wrist"),
      evilForestLoot("semi-rare", null, "Nothing"), evilForestLoot("rare", null, "Nothing"),
    ],
    drops: [
      evilForestLoot("always", "game-item.eye-drops"), evilForestLoot("common", "game-item.phoenix-down"),
      evilForestLoot("uncommon", null, "Nothing"), evilForestLoot("rare", null, "Nothing"),
    ],
    facts: [
      sourcedFact("elemental-weakness", "Fire", evilForestBossSources),
      sourcedFact("attack", "Absorb", evilForestBossSources, "Drains the captive's HP; Vivi's KO causes a Game Over."),
      sourcedFact("attack", "Vivi's automatic Fire", evilForestBossSources, "Vivi casts Fire on Prison Cage each turn while captive."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Take the Broadsword and Leather Wrist", detail: "The second battle is the first Prison Cage encounter with stealable equipment. Heal Vivi after repeated Absorb attacks and steal before finishing the boss.", sourceIds: evilForestBossSources },
    ],
    routeObjectiveIds: ["disc-1.evil-forest.prison-cage-steals"],
    notes: ["The two sources disagree on the second battle's HP: GameFAQs lists 533 and Jegged repeats 513. Both values are preserved without assuming cross-release parity."],
  }, evilForestChapterId, evilForestBossSources, ["missable.disc-1.evil-forest.prison-cage-steals"], ["cutoff.evil-forest.escape"]),
  chapterBoss({
    id: "enemy.plant-brain",
    name: "Plant Brain",
    encounterIds: ["encounter.evil-forest.plant-brain"],
    stats: [
      { field: "level", value: 7, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "HP", value: 916, sourceIds: evilForestBossSources, verification: "cross-checked" },
      { field: "MP", value: 1431, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "AP", value: 5, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
      { field: "Gil", value: 468, sourceIds: ["gamefaqs-evil-forest-71891"], verification: "single-source" },
    ],
    steals: [
      evilForestLoot("common", "game-item.eye-drops"), evilForestLoot("uncommon", "game-item.iron-helm"),
      evilForestLoot("semi-rare", null, "Nothing"), evilForestLoot("rare", null, "Nothing"),
    ],
    drops: [
      evilForestLoot("always", "game-item.phoenix-down"), evilForestLoot("common", "game-item.potion"),
      evilForestLoot("uncommon", "game-item.potion"), evilForestLoot("rare", "game-item.potion"),
    ],
    facts: [
      sourcedFact("elemental-weakness", "Fire", evilForestBossSources),
      sourcedFact("status-vulnerability", "Berserk, Darkness, Silence, Sleep, and Slow", ["gamefaqs-evil-forest-71891"]),
      sourcedFact("attack", "Thunder", ["gamefaqs-evil-forest-71891"], "Its main damage threat during the early boss fight."),
      sourcedFact("attack", "Pollen", ["gamefaqs-evil-forest-71891"], "Deals damage and may inflict Darkness."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Use Fire and steal before defeating it", detail: "Vivi's Fire and Steiner's Fire Sword exploit Plant Brain's weakness. Steal Eye Drops and Iron Helm before the one-time battle ends; Blank joins during the fight if the party needs another thief.", sourceIds: evilForestBossSources },
      { title: "Tent can disable its magic", detail: "GameFAQs describes a 50% chance for a thrown Tent to inflict Darkness and Silence, but the item also restores Plant Brain to full HP. This is an optional tactic, not a completion requirement.", sourceIds: ["gamefaqs-evil-forest-71891"] },
    ],
    routeObjectiveIds: ["disc-1.evil-forest.plant-brain-steals"],
    notes: ["GameFAQs and Jegged agree on 916 HP. The Hellplant/Plant Brain type is not assigned because the inspected boss table does not list a type."],
  }, evilForestChapterId, evilForestBossSources, ["missable.disc-1.evil-forest.plant-brain-steals"], ["cutoff.evil-forest.escape"]),
  chapterEnemy({
    id: "enemy.dendrobium",
    name: "Dendrobium",
    encounterIds: ["encounter.evil-forest.random-pool"],
    stats: enemyStats([["level", 2], ["HP", 174], ["MP", 186], ["EXP", 39], ["AP", 2], ["Gil", 99]]),
    steals: [evilForestLoot("common", "game-item.eye-drops"), evilForestLoot("uncommon", "game-item.tent"), evilForestLoot("semi-rare", "game-item.ore"), evilForestLoot("rare", null, "Nothing")],
    drops: [evilForestLoot("always", null, "Nothing"), evilForestLoot("common", "game-item.eye-drops"), evilForestLoot("uncommon", "game-item.potion"), evilForestLoot("rare", "game-item.phoenix-down")],
    facts: [
      evilForestFact("type", "Aerial"), evilForestFact("elemental-weakness", "Wind"), evilForestFact("elemental-resistance", "Earth nullified"),
      evilForestFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      evilForestFact("attack", "Wind", "A stronger early-game magical attack."),
    ],
    blueMagic: [],
    strategies: [],
    routeObjectiveIds: [],
    notes: [],
  }, evilForestChapterId, evilForestEnemySources),
  chapterEnemy({
    id: "enemy.fang-a",
    name: "Fang [A]",
    encounterIds: ["encounter.evil-forest.random-pool"],
    stats: enemyStats([["level", 1], ["HP", 68], ["MP", 170], ["EXP", 23], ["AP", 1], ["Gil", 90]]),
    steals: [evilForestLoot("common", "game-item.potion"), evilForestLoot("uncommon", "game-item.phoenix-down"), evilForestLoot("semi-rare", "game-item.hi-potion"), evilForestLoot("rare", "game-item.phoenix-pinion")],
    drops: [evilForestLoot("always", null, "Nothing"), evilForestLoot("common", "game-item.eye-drops"), evilForestLoot("uncommon", "game-item.phoenix-down"), evilForestLoot("rare", null, "Nothing")],
    facts: [
      evilForestFact("type", "Beast"), evilForestFact("elemental-weakness", "Fire"),
      evilForestFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      evilForestFact("attack", "Physical attacks", "Weak single-target physical damage."),
    ],
    blueMagic: [],
    strategies: [{ title: "Use Fire or Beast Killer", detail: "Fang has low HP and is vulnerable to Fire; Beast Killer is also effective.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["Fang [A] is kept separate from the later Festival of the Hunt variant Fang [B]."],
  }, evilForestChapterId, evilForestEnemySources),
  chapterEnemy({
    id: "enemy.goblin",
    name: "Goblin",
    encounterIds: ["encounter.evil-forest.random-pool", "encounter.gunitas-basin.world-map-pool"],
    stats: enemyStats([["level", 5], ["HP", 33], ["MP", 172], ["EXP", 23], ["AP", 1], ["Gil", 88]]),
    steals: [evilForestLoot("common", "game-item.potion"), evilForestLoot("uncommon", null, "Nothing"), evilForestLoot("semi-rare", null, "Nothing"), evilForestLoot("rare", null, "Nothing")],
    drops: [evilForestLoot("always", null, "Nothing"), evilForestLoot("common", "game-item.potion"), evilForestLoot("uncommon", "game-item.echo-screen"), evilForestLoot("rare", "game-item.phoenix-down")],
    facts: [evilForestFact("elemental-weakness", "Fire")],
    blueMagic: [{ name: "Goblin Punch", command: "Eat", sourceIds: [enemyListSourceId], objectiveIds: [] }],
    strategies: [],
    routeObjectiveIds: [],
    notes: ["Goblin's Eat result is Goblin Punch. Quina is not yet available in the Evil Forest, so the early record is a bestiary source; GameFAQs also lists Goblin in Gunitas Basin."],
  }, evilForestChapterId, evilForestEnemySources),
  chapterEnemy({
    id: "enemy.plant-spider",
    name: "Plant Spider",
    encounterIds: ["encounter.evil-forest.escape-plant-spiders"],
    stats: enemyStats([["level", 1], ["HP", 33], ["MP", 173], ["EXP", 22], ["AP", 1], ["Gil", 91]]),
    steals: [evilForestLoot("common", "game-item.potion"), evilForestLoot("uncommon", "game-item.ore"), evilForestLoot("semi-rare", "game-item.hi-potion"), evilForestLoot("rare", null, "Nothing")],
    drops: [evilForestLoot("always", null, "Nothing"), evilForestLoot("common", "game-item.potion"), evilForestLoot("uncommon", "game-item.eye-drops"), evilForestLoot("rare", "game-item.potion")],
    facts: [
      evilForestFact("type", "Bug"), evilForestFact("elemental-weakness", "Fire"),
      evilForestFact("attack", "Thunder", "Uses weaker Thunder spells than Plant Brain during the escape route."),
    ],
    blueMagic: [],
    strategies: [],
    routeObjectiveIds: [],
    notes: ["Jegged lists a mandatory escape battle against three Plant Spiders after Plant Brain."],
  }, evilForestChapterId, evilForestEnemySources),
];

const iceCavernEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.cave-imp",
    name: "Cave Imp",
    encounterIds: ["encounter.ice-cavern.mist-jet-pool"],
    stats: enemyStats([["level", 2], ["HP", 74], ["MP", 186], ["EXP", 35], ["AP", 1], ["Gil", 118]]),
    steals: [
      enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.phoenix-down"),
      enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.ore"),
      enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.tent"),
    ],
    facts: [
      enemyFact("elemental-resistance", "Ice (half damage)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Sleeping Juice", ["gamefaqs-enemy-list-71891", "gamefaqs-ice-cavern-71891"], "Can inflict Sleep on one character."),
    ],
    blueMagic: [],
    strategies: [{ title: "Use physical attacks or Fire", detail: "Cave Imp is vulnerable to ordinary physical damage; Vivi's Fire is effective. Watch for Sleeping Juice against a solo or low-status-resistance party member.", sourceIds: ["gamefaqs-enemy-list-71891", "gamefaqs-ice-cavern-71891"] }],
    routeObjectiveIds: [],
    notes: ["The Ice Cavern area list places Cave Imp among the mist-jet encounters; no encounter frequency or formation rate is inferred."],
  }, iceCavernChapterId, iceCavernEnemySources),
  chapterEnemy({
    id: "enemy.flan-ice-cavern",
    name: "Flan",
    encounterIds: ["encounter.ice-cavern.mist-jet-pool"],
    stats: enemyStats([["level", 2], ["HP", 75], ["MP", 183], ["EXP", 41], ["AP", 2], ["Gil", 110]]),
    steals: [
      enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.ore"),
      enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"),
      enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("elemental-weakness", "Fire"), enemyFact("elemental-resistance", "Ice (half damage)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Blizzard", ["gamefaqs-enemy-list-71891", "gamefaqs-ice-cavern-71891"], "Can deal ice-elemental damage to the party."),
    ],
    blueMagic: [],
    strategies: [{ title: "Exploit its Fire weakness", detail: "Vivi's Fire is effective against Flan and avoids spending attacks into its ice resistance. Keep Vivi's MP for the boss route and other ice cavern enemies.", sourceIds: ["gamefaqs-enemy-list-71891", "gamefaqs-ice-cavern-71891"] }],
    routeObjectiveIds: [],
    notes: ["The Ice Cavern route lists Flan among mist-jet encounters; no encounter frequency or formation rate is inferred."],
  }, iceCavernChapterId, iceCavernEnemySources),
  chapterEnemy({
    id: "enemy.wyerd",
    name: "Wyerd",
    encounterIds: ["encounter.ice-cavern.mist-jet-pool"],
    stats: enemyStats([["level", 2], ["HP", 129], ["MP", 183], ["EXP", 45], ["AP", 1], ["Gil", 116]]),
    steals: [
      enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.tent"),
      enemyLoot("semi-rare", "game-item.phoenix-down"), enemyLoot("rare", null, "Nothing"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"),
      enemyLoot("uncommon", "game-item.ether"), enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("type", "Beast"), enemyFact("elemental-weakness", "Fire"), enemyFact("elemental-resistance", "Ice (half damage)"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
    ],
    blueMagic: [],
    strategies: [{ title: "Use Fire or physical attacks", detail: "GameFAQs describes Wyerd as a straightforward brawler and recommends Fire or a few physical hits.", sourceIds: ["gamefaqs-enemy-list-71891"] }],
    routeObjectiveIds: [],
    notes: ["The Ice Cavern area list places Wyerd among the mist-jet encounters; no encounter frequency or formation rate is inferred."],
  }, iceCavernChapterId, iceCavernEnemySources),
  chapterBoss({
    id: "enemy.black-waltz-1",
    name: "Black Waltz 1",
    encounterIds: ["encounter.ice-cavern.black-waltz-1-sealion"],
    stats: [
      { field: "level", value: 2, sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"], verification: "cross-checked" },
      { field: "HP", value: 229, sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"], verification: "cross-checked" },
      { field: "MP", value: 9999, sourceIds: ["gamefaqs-ice-cavern-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-ice-cavern-71891"], verification: "single-source" },
      { field: "AP", value: 5, sourceIds: ["gamefaqs-ice-cavern-71891"], verification: "single-source" },
      { field: "Gil", value: 339, sourceIds: ["gamefaqs-ice-cavern-71891"], verification: "single-source" },
    ],
    steals: [
      sourcedLoot("common", "game-item.remedy", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"]),
      sourcedLoot("uncommon", "game-item.silk-shirt", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "rpgclassics-ice-cavern"]),
      sourcedLoot("semi-rare", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.hi-potion", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"]),
      sourcedLoot("common", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", ["gamefaqs-ice-cavern-71891"]),
      sourcedFact("elemental-weakness", "Fire and Ice", ["gamefaqs-ice-cavern-71891"]),
      sourcedFact("status-vulnerability", "Freeze and Slow", ["gamefaqs-ice-cavern-71891"]),
      sourcedFact("attack", "Summon Sealion", ["gamefaqs-ice-cavern-71891", "rpgclassics-ice-cavern"], "Calls Sealion into the one-character boss battle."),
      sourcedFact("attack", "Heal Sealion", ["gamefaqs-ice-cavern-71891"], "While Black Waltz 1 remains alive, it can heal Sealion; if Sealion is defeated first, Waltz can summon another."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Finish Waltz before Sealion", detail: "Black Waltz 1 supports and can resummon Sealion. Steal the selected items first, then defeat Waltz before attacking Sealion.", sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "rpgclassics-ice-cavern"] },
      { title: "Keep Zidane healed during the solo fight", detail: "Only Zidane enters the waterfall battle. Heal before pushing Sealion into its later orb phases, which add stronger ice and water attacks.", sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"] },
    ],
    routeObjectiveIds: [iceCavernStealsObjectiveId],
    notes: ["The regular battle guides agree on level 2 and 229 HP. The checked sources identify this as a solo Zidane fight; the original PlayStation data has not been compared against remastered releases."],
  }, iceCavernChapterId, iceCavernBossSources, [iceCavernStealsMissableId], [iceCavernStealsCutoffId]),
  chapterBoss({
    id: "enemy.sealion",
    name: "Sealion",
    encounterIds: ["encounter.ice-cavern.black-waltz-1-sealion"],
    stats: [
      { field: "level", value: 3, sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"], verification: "cross-checked" },
      { field: "HP", value: 472, sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"], verification: "cross-checked" },
      { field: "MP", value: 9999, sourceIds: ["gamefaqs-ice-cavern-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-ice-cavern-71891"], verification: "single-source" },
      { field: "AP", value: 0, sourceIds: ["gamefaqs-ice-cavern-71891"], verification: "single-source" },
      { field: "Gil", value: 0, sourceIds: ["gamefaqs-ice-cavern-71891"], verification: "single-source" },
    ],
    steals: [
      sourcedLoot("common", "game-item.ether", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"]),
      sourcedLoot("uncommon", "game-item.mythril-dagger", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "rpgclassics-ice-cavern"]),
      sourcedLoot("semi-rare", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.phoenix-down", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"]),
      sourcedLoot("common", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-ice-cavern-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Aerial", ["gamefaqs-ice-cavern-71891"]),
      sourcedFact("elemental-weakness", "Fire", ["gamefaqs-ice-cavern-71891"]),
      sourcedFact("elemental-resistance", "Absorbs Ice; nullifies Water and Earth", ["gamefaqs-ice-cavern-71891"]),
      sourcedFact("status-vulnerability", "Slow", ["gamefaqs-ice-cavern-71891"]),
      sourcedFact("attack", "Wing", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"], "Physical damage used during the early orb phase."),
      sourcedFact("attack", "Blizzard and Blizzara", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"], "The guides differ on which spell appears in the blue and yellow orb phases; both describe stronger ice attacks as the orb changes."),
      sourcedFact("attack", "Tsunami", ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern"], "A later orb phase adds a party-wide Water attack; Sealion is unaffected by its own Water damage."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal the Mythril Dagger early", detail: "The uncommon steal is an important Zidane weapon and teaches Bandit. The steal can be missed when the one-time boss battle ends; the dagger has later purchase paths.", sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "rpgclassics-ice-cavern"] },
      { title: "Delay damage until ready to finish the boss", detail: "Sealion changes orb phases as it takes damage. Keep Zidane healed and use Tidal Flame after Trance if available; the guides agree that the late red phase adds Tsunami.", sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "rpgclassics-ice-cavern"] },
    ],
    routeObjectiveIds: [iceCavernStealsObjectiveId],
    notes: ["Orb-color behavior differs between the two walkthroughs: GameFAQs lists Blizzard and then Blizzara across phases, while Jegged gives regular attacks in blue and Blizzard in yellow. The exact spell timing is left source-specific."],
  }, iceCavernChapterId, iceCavernBossSources, [iceCavernStealsMissableId], [iceCavernStealsCutoffId]),
];

const grottoEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.hornet",
    name: "Hornet",
    encounterIds: ["encounter.gizamaluke-grotto.random-pool"],
    stats: enemyStats([["level", 7], ["HP", 293], ["MP", 281], ["EXP", 89], ["AP", 1], ["Gil", 194]]),
    steals: [enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Bug and Aerial"),
      enemyFact("elemental-weakness", "Lightning and Wind"),
      enemyFact("elemental-resistance", "Earth (nullified)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Buzz", [enemyListSourceId], "Can inflict Berserk."),
      sourcedFact("attack", "Stinger", [enemyListSourceId], "Weak single-target physical damage."),
    ],
    blueMagic: [{ name: "Vanish", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "rpgclassics-gizamaluke"], objectiveIds: [] }],
    strategies: [{ title: "Use Lightning or Wind", detail: "Hornet is weak to both elements. Watch for Buzz, which can Berserk a party member; Stinger is a comparatively weak physical attack.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["The Grotto enemy table lists Hornet as Bug and Aerial, with Vanish as Quina's Eat skill."],
  }, journeyToBurmeciaChapterId, grottoEnemySources),
  chapterEnemy({
    id: "enemy.lamia",
    name: "Lamia",
    encounterIds: ["encounter.gizamaluke-grotto.random-pool"],
    stats: enemyStats([["level", 10], ["HP", 994], ["MP", 358], ["EXP", 204], ["AP", 2], ["Gil", 494]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.potion"), enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", "game-item.ether"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "None"),
      enemyFact("elemental-weakness", "Lightning"),
      enemyFact("elemental-resistance", "Water (half damage)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Entice", "Can inflict Confuse."),
      enemyFact("attack", "Might", "Raises its physical damage; multiple casts make Slash dangerous."),
      enemyFact("attack", "Cure and Slash", "Cure restores Lamia's HP; Slash deals physical damage."),
    ],
    blueMagic: [{ name: "LV3 Def-less", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "rpgclassics-gizamaluke"], objectiveIds: [] }],
    strategies: [{ title: "Take it down before Might stacks", detail: "Lamia is a local difficulty spike: it can Confuse a character with Entice, heal itself, and strengthen Slash with Might. Lightning exploits its weakness, and Quina can learn LV3 Def-less with Eat.", sourceIds: [enemyListSourceId, "rpgclassics-gizamaluke"] }],
    routeObjectiveIds: [],
    notes: ["GameFAQs calls Lamia the most dangerous ordinary enemy in the Grotto and specifically warns that repeated Might casts make Slash much stronger."],
  }, journeyToBurmeciaChapterId, grottoEnemySources),
  chapterEnemy({
    id: "enemy.type-a",
    name: "Type A",
    encounterIds: ["encounter.gizamaluke-grotto.random-pool", "encounter.gizamaluke-grotto.type-a-first-pair", "encounter.gizamaluke-grotto.type-a-second-pair", "encounter.burmecia.type-a-pair"],
    stats: enemyStats([["level", 8], ["HP", 398], ["MP", 293], ["EXP", 115], ["AP", 2], ["Gil", 199]]),
    steals: [enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Human"),
      enemyFact("elemental-weakness", "None listed"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Fire, Blizzard, Thunder, and Strike", "Elemental spells deal modest single-target damage; Strike is physical."),
    ],
    blueMagic: [],
    strategies: [{ title: "Silence the scripted pair if needed", detail: "Silence works against Type A. The mandatory pairs use spells and Strike, but the enemy table describes their attacks as modest compared with the Grotto's Lamia.", sourceIds: [enemyListSourceId, "gamefaqs-grotto-south-gate-79143"] }],
    routeObjectiveIds: [],
    notes: ["Type A is the name used by the enemy list; the route walkthroughs call these Black Mages. The two Grotto pairs and Burmecia's separate scripted pair are tracked independently. EliteGrindLab notes that Game8 prints 155 EXP/two steal slots while Caves of Narshe prints 115 EXP/four slots; this record retains the GameFAQs enemy-table values and leaves the table discrepancy explicit."],
  }, journeyToBurmeciaChapterId, [...grottoEnemySources, ...burmeciaEnemySources, "cavesofnarshe-enemies"]),
  chapterBoss({
    id: "enemy.gizamaluke",
    name: "Gizamaluke",
    encounterIds: ["encounter.gizamaluke-grotto.gizamaluke"],
    stats: crossCheckedStats([["level", 16], ["HP", 3175], ["MP", 502], ["EXP", 0], ["AP", 5], ["Gil", 800]], ["cavesofnarshe-gizamaluke", "ffonline-gizamaluke-boss"]),
    steals: [
      sourcedLoot("common", "game-item.elixir", ["gamefaqs-grotto-south-gate-79143", "jegged-gizamaluke", "rpgclassics-gizamaluke"]),
      sourcedLoot("uncommon", "game-item.magus-hat", ["gamefaqs-grotto-south-gate-79143", "jegged-gizamaluke", "rpgclassics-gizamaluke"]),
      sourcedLoot("semi-rare", "game-item.ice-staff", ["gamefaqs-grotto-south-gate-79143", "jegged-gizamaluke", "rpgclassics-gizamaluke"]),
      sourcedLoot("rare", null, ["gamefaqs-grotto-south-gate-79143"], "Nothing"),
    ],
    drops: [sourcedLoot("always", "game-item.tent", ["cavesofnarshe-gizamaluke", "ffonline-gizamaluke-boss"])],
    facts: [
      sourcedFact("type", "Flying", ["cavesofnarshe-gizamaluke"]),
      sourcedFact("elemental-weakness", "Thunder and Wind", ["ffonline-gizamaluke-boss"]),
      sourcedFact("elemental-resistance", "Water damage halved; Earth nullified", ["ffonline-gizamaluke-boss"]),
      sourcedFact("status-vulnerability", "Darkness, Mini, Silence, Sleep, and Slow", ["ffonline-gizamaluke-boss"]),
      sourcedFact("attack", "Crash", ["ffonline-gizamaluke-boss"], "Heavy single-target physical damage; it can also counter physical attacks."),
      sourcedFact("attack", "Water", ["ffonline-gizamaluke-boss", "gamefaqs-grotto-south-gate-79143"], "Can target one character or the party."),
      sourcedFact("attack", "Silent Voice", ["ffonline-gizamaluke-boss"], "Inflicts Silence on a character."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Protect the party while Zidane steals", detail: "Crash hits hard and Water can target the party, so keep a character ready to heal. Vivi's Thunder exploits the listed weakness; Freya can Jump to avoid attacks during her turn.", sourceIds: ["gamefaqs-grotto-south-gate-79143", "rpgclassics-gizamaluke"] },
      { title: "Treat the Tent trick as a gamble", detail: "A Tent may inflict Darkness and Silence, but a failed Tent can fully heal the boss. Save first if trying this tactic, and avoid repeating it when you would rather preserve the boss's current HP.", sourceIds: ["gamefaqs-grotto-south-gate-79143", "jegged-gizamaluke"] },
    ],
    routeObjectiveIds: [gizamalukeStealsObjectiveId],
    notes: ["The boss drops a Tent. Route sources agree on the three named steals, but their printed steal rates differ; no probabilities or attempt counts are asserted."],
  }, journeyToBurmeciaChapterId, gizamalukeBossSources, [gizamalukeStealsMissableId], [gizamalukeStealsCutoffId]),
];

const burmeciaEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.basilisk",
    name: "Basilisk",
    encounterIds: ["encounter.burmecia.city-random-pool"],
    stats: enemyStats([["level", 6], ["HP", 346], ["MP", 267], ["EXP", 167], ["AP", 1], ["Gil", 233]]),
    steals: [enemyLoot("common", "game-item.soft"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.potion"), enemyLoot("common", "game-item.soft"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("rare", "game-item.soft")],
    facts: [
      enemyFact("type", "Beast"), enemyFact("elemental-weakness", "Ice"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Tongue", [enemyListSourceId], "Basic physical damage."),
      sourcedFact("attack", "Slow and Gradual Petrify", [enemyListSourceId], "Gradual Petrify counts down to petrification; defeat the Basilisk before the timer expires or remove the effect with a Soft."),
    ],
    blueMagic: [{ name: "Pumpkin Head", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Ice and watch the petrification timer", detail: "Ice exploits its weakness. A Soft can remove Gradual Petrify, but ending the battle before the timer expires also prevents petrification.", sourceIds: [enemyListSourceId, "elitegrindlab-burmecia"] }],
    routeObjectiveIds: [],
    notes: ["Burmecia's enemy table reports Basilisk's Gradual Petrify attack; the guide keeps it as a combat hazard rather than treating ordinary Petrify vulnerability as the same status."],
  }, burmeciaChapterId, [...burmeciaEnemySources, "gamefaqs-abilities-71891"]),
  chapterEnemy({
    id: "enemy.magic-vice",
    name: "Magic Vice",
    encounterIds: ["encounter.burmecia.city-random-pool"],
    stats: enemyStats([["level", 7], ["HP", 297], ["MP", 278], ["EXP", 212], ["AP", 1], ["Gil", 239]]),
    steals: [
      sourcedLoot("common", "game-item.echo-screen", [enemyListSourceId, "jegged-burmecia"]),
      enemyLoot("uncommon", "game-item.ether"), enemyLoot("semi-rare", "game-item.ether"), enemyLoot("rare", "game-item.ether"),
    ],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.ether"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "None"), enemyFact("elemental-weakness", "None listed"), enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, and Venom"),
      sourcedFact("attack", "Magic Hammer", [enemyListSourceId], "Drains a random amount of one character's MP."),
      sourcedFact("attack", "Mug", [enemyListSourceId], "Deals minor damage, steals an item from the party, and may be followed by the enemy fleeing."),
    ],
    blueMagic: [{ name: "Magic Hammer", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.burmecia.blue-magic"] }],
    strategies: [{ title: "Eat it promptly and protect inventory", detail: "Magic Vice has low HP and can flee after Mugging an item. Quina can learn Magic Hammer with Eat; use physical attacks to weaken it and check the inventory if it steals.", sourceIds: [enemyListSourceId, "gamefaqs-burmecia-71891"] }],
    routeObjectiveIds: ["disc-1.burmecia.blue-magic"],
    notes: ["GameFAQs and Jegged list Echo Screen as the first steal; EliteGrindLab records a publisher disagreement between Echo Screen and Eye Drops for that slot. This record follows the GameFAQs enemy table and leaves the alternate item unresolved. GameFAQs and Jegged also differ slightly on printed EXP/AP values; the selected table values remain source-specific."],
  }, burmeciaChapterId, [...burmeciaEnemySources, "gamefaqs-abilities-71891"]),
  chapterEnemy({
    id: "enemy.mimic",
    name: "Mimic",
    encounterIds: ["encounter.burmecia.suburb.mimic-chest-1", "encounter.burmecia.suburb.mimic-chest-2", "encounter.burmecia.uptown.mimic-chest"],
    stats: enemyStats([["level", 8], ["HP", 346], ["MP", 295], ["EXP", 320], ["AP", 2], ["Gil", 777]]),
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.antidote"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.ether"), enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "None"), enemyFact("elemental-weakness", "Holy"), enemyFact("elemental-resistance", "Shadow (half damage)"),
      enemyFact("status-vulnerability", "Darkness, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Eat and Poison", [enemyListSourceId], "Eat deals weak physical damage; Poison can inflict the Poison status."),
      sourcedFact("attack", "Call", [enemyListSourceId, "elitegrindlab-burmecia"], "Summons a Magic Vice that may Mug an item from the party."),
    ],
    blueMagic: [],
    strategies: [{ title: "Treat the chests as optional fights", detail: "Three Burmecia chests are Mimics. If opened, the Mimic can summon a Magic Vice; focus it promptly to reduce the chance of an item being stolen.", sourceIds: [enemyListSourceId, "gamefaqs-burmecia-71891", "elitegrindlab-burmecia"] }],
    routeObjectiveIds: [],
    notes: ["Burmecia's three chest-triggered Mimics are modeled as separate fixed optional encounters, not as members of its ordinary random pool."],
  }, burmeciaChapterId, burmeciaEnemySources),
  chapterEnemy({
    id: "enemy.lizard-man",
    name: "Lizard Man",
    encounterIds: ["encounter.burmecia-region.world-map-pool"],
    stats: enemyStats([["level", 10], ["HP", 589], ["MP", 359], ["EXP", 173], ["AP", 1], ["Gil", 218]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "None"), enemyFact("elemental-weakness", "Ice and Lightning"), enemyFact("elemental-resistance", "Water (half damage)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Protect", [enemyListSourceId], "May raise its own physical defense; switch to magic while the effect is active."),
    ],
    blueMagic: [{ name: "LV3 Def-less", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Ice or Lightning", detail: "Either listed element is effective. If Lizard Man casts Protect, use magic rather than relying on physical damage.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["GameFAQs places Lizard Man on the world map surrounding Burmecia and Cleyra; it is not part of the city's indoor random pool."],
  }, journeyToBurmeciaChapterId, [...burmeciaRegionSources, "gamefaqs-abilities-71891"]),
  chapterEnemy({
    id: "enemy.nymph",
    name: "Nymph",
    encounterIds: ["encounter.burmecia-region.world-map-pool"],
    stats: enemyStats([["level", 9], ["HP", 458], ["MP", 345], ["EXP", 329], ["AP", 1], ["Gil", 303]]),
    steals: [enemyLoot("common", "game-item.echo-screen"), enemyLoot("uncommon", "game-item.ore"), enemyLoot("semi-rare", "game-item.hi-potion"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.annoyntment"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "None"), enemyFact("elemental-weakness", "Fire and Shadow"), enemyFact("elemental-resistance", "Holy (half damage)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Fira", [enemyListSourceId], "Powerful Fire-elemental spell."),
    ],
    blueMagic: [{ name: "Night", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "gamefaqs-journey-to-burmecia-71891"], objectiveIds: ["disc-1.journey-to-burmecia.blue-magic-night"] }],
    strategies: [{ title: "Use physical attacks and Fire or Shadow", detail: "Nymph is fairly resistant to magic overall but is weak to Fire and Shadow. Its Fira spell can be dangerous at this point; Quina can learn Night with Eat.", sourceIds: [enemyListSourceId, "gamefaqs-journey-to-burmecia-71891"] }],
    routeObjectiveIds: ["disc-1.journey-to-burmecia.blue-magic-night"],
    notes: ["GameFAQs lists Nymph in the Burmecia/Cleyra world-map region and the route identifies it in Daines-horse Basin. One guide also labels Nymph as a Burmecia city enemy; that location claim is not merged into the indoor city pool."],
  }, journeyToBurmeciaChapterId, [...burmeciaRegionSources, "gamefaqs-abilities-71891"]),
  chapterEnemy({
    id: "enemy.sand-scorpion",
    name: "Sand Scorpion",
    encounterIds: ["encounter.burmecia-region.world-map-pool"],
    stats: enemyStats([["level", 10], ["HP", 526], ["MP", 360], ["EXP", 400], ["AP", 1], ["Gil", 315]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.antidote"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    drops: [enemyLoot("always", "game-item.potion"), enemyLoot("common", "game-item.annoyntment"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("rare", "game-item.hi-potion")],
    facts: [
      enemyFact("type", "None"), enemyFact("elemental-weakness", "Ice"), enemyFact("elemental-resistance", "Water (absorbs)"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Fira", [enemyListSourceId], "Strong single-target Fire-elemental damage."),
      sourcedFact("attack", "Poison Counter", [enemyListSourceId], "Non-fatal damage can trigger a counter that deals damage and inflicts Poison."),
    ],
    blueMagic: [{ name: "LV3 Def-less", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Ice and avoid Water", detail: "Ice exploits its weakness, while it absorbs Water. Be ready to cure Poison if a non-fatal hit triggers Poison Counter.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["Sand Scorpion is part of the world-map regional roster around Burmecia and Cleyra, not the indoor Burmecia pool."],
  }, journeyToBurmeciaChapterId, [...burmeciaRegionSources, "gamefaqs-abilities-71891"]),
  chapterEnemy({
    id: "enemy.yeti",
    name: "Yeti",
    encounterIds: ["encounter.burmecia-region.world-map-pool"],
    stats: enemyStats([["level", 9], ["HP", 463], ["MP", 342], ["EXP", 133], ["AP", 1], ["Gil", 221]]),
    steals: [enemyLoot("common", "game-item.eye-drops"), enemyLoot("uncommon", "game-item.ore"), enemyLoot("semi-rare", "game-item.hi-potion"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.eye-drops"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Aerial"), enemyFact("elemental-weakness", "Wind and Shadow"), enemyFact("elemental-resistance", "Earth (nullified); Holy (half damage)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Bite, Blind Tail, and Blizzara", [enemyListSourceId], "Bite deals physical damage, Blind Tail can inflict Darkness, and Blizzara is a heavy Ice spell."),
    ],
    blueMagic: [{ name: "Pumpkin Head", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Wind or Shadow and watch for Blizzara", detail: "Wind and Shadow exploit its weaknesses. Its defense is low, but Blizzara can deal heavy damage; Quina can learn Pumpkin Head by eating it.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["Yeti is listed for the surrounding Burmecia/Cleyra world-map areas; no exact map-tile formation or encounter rate is published."],
  }, journeyToBurmeciaChapterId, [...burmeciaRegionSources, "gamefaqs-abilities-71891"]),
  chapterBoss({
    id: "enemy.beatrix-burmecia",
    name: "Beatrix (Burmecia)",
    encounterIds: ["encounter.burmecia.beatrix"],
    stats: [
      { field: "level", value: 14, sourceIds: ["cavesofnarshe-enemies", "jegged-burmecia", "elitegrindlab-burmecia"], verification: "disputed" },
      { field: "level", value: 16, sourceIds: ["gamefaqs-burmecia-71891", "elitegrindlab-burmecia"], verification: "disputed" },
      { field: "HP", value: 3630, sourceIds: ["cavesofnarshe-enemies", "jegged-burmecia", "elitegrindlab-burmecia"], verification: "disputed" },
      { field: "HP", value: 3360, sourceIds: ["gamefaqs-burmecia-71891", "elitegrindlab-burmecia"], verification: "disputed" },
      { field: "MP", value: 3467, sourceIds: ["cavesofnarshe-enemies", "elitegrindlab-burmecia"], verification: "disputed" },
      { field: "MP", value: 3367, sourceIds: ["gamefaqs-burmecia-71891", "elitegrindlab-burmecia"], verification: "disputed" },
      ...crossCheckedStats([["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-burmecia-71891", "cavesofnarshe-enemies"]),
    ],
    steals: [
      sourcedLoot("common", "game-item.phoenix-down", burmeciaBossSources),
      sourcedLoot("uncommon", "game-item.chain-plate", burmeciaBossSources),
      sourcedLoot("semi-rare", null, burmeciaBossSources, "Nothing"),
      sourcedLoot("rare", "game-item.mythril-sword", burmeciaBossSources),
    ],
    drops: [
      sourcedLoot("always", null, burmeciaBossSources, "Nothing"),
      sourcedLoot("common", null, burmeciaBossSources, "Nothing"),
      sourcedLoot("uncommon", null, burmeciaBossSources, "Nothing"),
      sourcedLoot("rare", null, burmeciaBossSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", burmeciaBossSources),
      sourcedFact("elemental-weakness", "None listed", burmeciaBossSources),
      sourcedFact("elemental-resistance", "None listed", burmeciaBossSources),
      sourcedFact("status-vulnerability", "Slow", burmeciaBossSources),
      sourcedFact("attack", "Attack", ["gamefaqs-burmecia-71891", "jegged-burmecia"], "Strong physical damage."),
      sourcedFact("attack", "Thunder Slash", ["gamefaqs-burmecia-71891", "jegged-burmecia"], "Lightning-elemental attack; Coral Ring can absorb it and Silk Shirt reduces its damage."),
      sourcedFact("attack", "Shock", ["gamefaqs-burmecia-71891"], "Can deal enough damage to knock out an early-game character."),
      sourcedFact("attack", "Stock Break or Climhazzard", ["jegged-burmecia", "elitegrindlab-burmecia"], "Her scripted finisher leaves the party at 1 HP; publishers differ on which move appears."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Keep the party alive while Zidane steals", detail: "Use Slow if available, move vulnerable characters to the back row, heal through Thunder Slash and Shock, and attempt the selected steals before the scripted ending. Do not attack solely to force a faster finish while still stealing.", sourceIds: ["gamefaqs-burmecia-71891", "jegged-burmecia", "elitegrindlab-burmecia"] },
      { title: "Treat the Mythril Sword as an optional lottery", detail: "The Mythril Sword occupies the very rare fourth steal slot. The one-time turn window is short, and later sources provide the item type; prioritize Phoenix Down and Chain Plate if those copies matter to the chosen goal.", sourceIds: ["gamefaqs-burmecia-71891", "jegged-burmecia", "elitegrindlab-burmecia"] },
    ],
    routeObjectiveIds: [burmeciaStealsObjectiveId],
    notes: ["Published Beatrix stat tables disagree: most reviewed publishers give Level 14, 3,630 HP, and 3,467 MP, while GameFAQs prints Level 16, 3,360 HP, and 3,367 MP. The fight's end condition is also described differently: some call it unwinnable, while others say it can end at 0 HP; the finisher and 1-HP party outcome are consistently described. Steal rates are not modeled."],
  }, burmeciaChapterId, burmeciaBossSources, [burmeciaStealsMissableId], [burmeciaStealsCutoffId]),
];

const earlyDaliEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.carve-spider",
    name: "Carve Spider",
    encounterIds: ["encounter.nolrich-heights.world-map-pool", "encounter.lindblum-plateau.mountain-pool", "encounter.lindblum-plateau.forest-pool"],
    stats: enemyStats([["level", 3], ["HP", 129], ["MP", 199], ["EXP", 48], ["AP", 1], ["Gil", 124]]),
    steals: [
      enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.tent"),
      enemyLoot("semi-rare", "game-item.ore"), enemyLoot("rare", null, "Nothing"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.ore"),
      enemyLoot("uncommon", "game-item.eye-drops"), enemyLoot("rare", "game-item.phoenix-down"),
    ],
    facts: [
      enemyFact("type", "Bug"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Fire", [enemyListSourceId], "Can deal about 75 Fire damage."),
      sourcedFact("attack", "Web", [enemyListSourceId], "Inflicts Slow."),
    ],
    blueMagic: [{ name: "LV3 Def-less", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Bug Killer and watch for Slow", detail: "Carve Spider is a sharp early difficulty spike if met before Dali; Bug Killer helps, while Web can inflict Slow. Quina can learn LV3 Def-less later by eating it.", sourceIds: [enemyListSourceId, "jegged-ice-cavern"] }],
    routeObjectiveIds: [],
    notes: ["The route sources list Carve Spider in the Nolrich Heights world-map pool; the record does not imply that every map tile uses the same encounter rate."],
  }, iceCavernChapterId, nolrichEnemySources),
  chapterEnemy({
    id: "enemy.mu",
    name: "Mu",
    encounterIds: ["encounter.nolrich-heights.world-map-pool", "encounter.gunitas-basin.world-map-pool"],
    stats: enemyStats([["level", 2], ["HP", 77], ["MP", 183], ["EXP", 34], ["AP", 1], ["Gil", 104]]),
    steals: [
      enemyLoot("common", null, "Nothing"), enemyLoot("uncommon", "game-item.potion"),
      enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"),
      enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", "game-item.phoenix-down"),
    ],
    facts: [
      enemyFact("type", "None"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Stone", [enemyListSourceId], "The attack can deal about 40 damage."),
    ],
    blueMagic: [{ name: "Limit Glove", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Finish it with an ordinary attack", detail: "The regular Mu has little HP; its Stone attack is its main threat. The friendly Mu encounter that asks for Ore is a separate sidequest event and is not a battle.", sourceIds: [enemyListSourceId, "jegged-ice-cavern"] }],
    routeObjectiveIds: [],
    notes: ["The listed combat form is the standard Mu. Jegged separately describes the Friendly Monster Mu, which asks for Ore and rewards a Potion plus 10 AP."],
  }, iceCavernChapterId, nolrichEnemySources),
  chapterEnemy({
    id: "enemy.python",
    name: "Python",
    encounterIds: ["encounter.nolrich-heights.world-map-pool", "encounter.gunitas-basin.world-map-pool"],
    stats: enemyStats([["level", 2], ["HP", 75], ["MP", 184], ["EXP", 40], ["AP", 1], ["Gil", 106]]),
    steals: [
      enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.ore"),
      enemyLoot("semi-rare", "game-item.hi-potion"), enemyLoot("rare", "game-item.phoenix-pinion"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Nothing"),
      enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("elemental-weakness", "Ice"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Thunder", [enemyListSourceId], "Uses single-target Thunder."),
    ],
    blueMagic: [{ name: "Pumpkin Head", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Ice and avoid wasting turns", detail: "Python has low HP, is weak to Ice, and can use Thunder. Quina can learn Pumpkin Head by eating it later.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["The route sources list Python in the Nolrich Heights world-map pool; no frequency or formation rate is inferred."],
  }, iceCavernChapterId, nolrichEnemySources),
  chapterEnemy({
    id: "enemy.ghost",
    name: "Ghost",
    encounterIds: ["encounter.dali-underground.random-pool"],
    stats: enemyStats([["level", 4], ["HP", 118], ["MP", 9999], ["EXP", 48], ["AP", 1], ["Gil", 126]]),
    steals: [
      enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.ore"),
      enemyLoot("semi-rare", "game-item.hi-potion"), enemyLoot("rare", "game-item.phoenix-pinion"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Nothing"),
      enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("type", "Undead and Aerial"),
      sourcedFact("elemental-weakness", "Wind and Shadow", [enemyListSourceId, "ffwiki-ghost"], "The GameFAQs enemy table lists Shadow; Final Fantasy Wiki also lists Wind."),
      sourcedFact("elemental-resistance", "Holy (half damage); Earth (nullified)", [enemyListSourceId, "ffwiki-ghost"]),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Osmose", [enemyListSourceId], "Drains MP."),
      sourcedFact("attack", "Fire and Lightning", [enemyListSourceId], "Uses elemental spells against the party."),
    ],
    blueMagic: [{ name: "Roulette", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Cure or focus fire", detail: "GameFAQs recommends Cure against this undead enemy. Fire and Lightning are effective, and defeating it quickly limits its chance to drain MP with Osmose.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["Ghost is listed by the main Dali routes. Its rare Phoenix Pinion steal sits behind Potion, Ore, and Hi-Potion; the enemy table does not imply the steal is an efficient farm."],
  }, daliChapterId, [...daliEnemySources, "ffwiki-ghost"]),
  chapterEnemy({
    id: "enemy.vice",
    name: "Vice",
    encounterIds: ["encounter.dali-underground.random-pool", "encounter.lindblum-area.lowlands-pool"],
    stats: enemyStats([["level", 4], ["HP", 129], ["MP", 209], ["EXP", 48], ["AP", 1], ["Gil", 128]]),
    steals: [
      enemyLoot("common", "game-item.echo-screen"), enemyLoot("uncommon", "game-item.potion"),
      enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"),
      enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", "game-item.phoenix-down"),
    ],
    facts: [
      enemyFact("type", "None"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Fire", [enemyListSourceId], "Deals about 75 Fire damage."),
      sourcedFact("attack", "Steal", [enemyListSourceId], "Can steal an item from a party member."),
    ],
    blueMagic: [{ name: "Vanish", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Take it out before it steals", detail: "Vice has no listed elemental weakness, but it is fragile. It can steal from the party and use Fire; ordinary attacks are sufficient.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [],
    notes: ["GameFAQs and Caves of Narshe list Vice in Dali's optional underground pool and on the plains below Lindblum. Opening the factory rear door is not required for its route or mandatory pickups."],
  }, daliChapterId, daliEnemySources),
  chapterEnemy({
    id: "enemy.skeleton",
    name: "Skeleton",
    encounterIds: ["encounter.dali-underground.random-pool", "encounter.gizamaluke-grotto.random-pool", "encounter.burmecia-region.world-map-pool"],
    stats: enemyStats([["level", 8], ["HP", 400], ["MP", 293], ["EXP", 104], ["AP", 1], ["Gil", 209]]),
    steals: [
      enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"),
      enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.ether"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"),
      enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("type", "Undead"),
      enemyFact("elemental-weakness", "Fire and Holy"),
      enemyFact("elemental-resistance", "Shadow (half damage)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Whirl Slash", [enemyListSourceId], "Can hit front-row characters for about 100 damage."),
    ],
    blueMagic: [{ name: "Pumpkin Head", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "rpgclassics-gizamaluke"], objectiveIds: [] }],
    strategies: [{ title: "Use Vivi's Fire and watch the HP spike", detail: "At 400 HP this is much tougher than nearby Disc I enemies. Fire and Holy exploit its weaknesses; Whirl Slash can deal heavy damage to front-row characters.", sourceIds: [enemyListSourceId, "elitegrindlab-dali"] }],
    routeObjectiveIds: [],
    notes: ["The enemy table and RPGClassics list Skeleton in Gizamaluke's Grotto, and GameFAQs separately includes Skeletons on the Burmecia/Cleyra surrounding world map. Its Dali underground appearance is a distinct dispute: Jegged and EliteGrindLab include it; GameFAQs, Caves of Narshe, and Final Fantasy Wiki omit it. EliteGrindLab reports it only in Dali formations paired with Vice."],
  }, daliChapterId, [...new Set([...daliEnemySources, ...grottoEnemySources, ...burmeciaRegionSources])]),
  chapterBoss({
    id: "enemy.black-waltz-2",
    name: "Black Waltz 2",
    encounterIds: ["encounter.dali.black-waltz-2"],
    stats: [
      { field: "level", value: 6, sourceIds: ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"], verification: "cross-checked" },
      { field: "HP", value: 1030, sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"], verification: "cross-checked" },
      { field: "MP", value: 3017, sourceIds: ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies"], verification: "cross-checked" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies"], verification: "cross-checked" },
      { field: "AP", value: 5, sourceIds: ["gamefaqs-dali-71891"], verification: "single-source" },
      { field: "Gil", value: 441, sourceIds: ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies"], verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.steepled-hat", ["gamefaqs-dali-71891", "jegged-dali", "cavesofnarshe-dali-enemies"]),
      sourcedLoot("uncommon", "game-item.leather-plate", ["gamefaqs-dali-71891", "jegged-dali", "cavesofnarshe-dali-enemies"]),
      sourcedLoot("semi-rare", null, ["gamefaqs-dali-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-dali-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.ether", ["gamefaqs-dali-71891", "jegged-dali", "cavesofnarshe-dali-enemies"]),
      sourcedLoot("common", "game-item.ether", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]),
      sourcedLoot("uncommon", "game-item.ether", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]),
      sourcedLoot("rare", "game-item.ether", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]),
    ],
    facts: [
      sourcedFact("type", "Human and Aerial", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies"]),
      sourcedFact("elemental-weakness", "Wind", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies", "elitegrindlab-dali"]),
      sourcedFact("elemental-resistance", "Earth (nullified)", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies"]),
      sourcedFact("status-vulnerability", "Darkness and Slow", ["gamefaqs-dali-71891", "cavesofnarshe-dali-enemies"]),
      sourcedFact("status-vulnerability", "Mini", ["gamefaqs-dali-71891", "ffwiki-black-waltz-2"], "GameFAQs lists Mini as a vulnerability; Final Fantasy Wiki lists it among the boss's immunities."),
      sourcedFact("attack", "Teleport", ["gamefaqs-dali-71891"], "Basic physical attack against one of the male characters."),
      sourcedFact("attack", "Fire, Blizzard, and Thunder", ["gamefaqs-dali-71891"], "Uses the basic elemental spells; casting a spell at Waltz can trigger an -ara counter."),
      sourcedFact("attack", "Fira counter", ["gamefaqs-dali-71891", "jegged-dali"], "Uses party-target Fira as a counter when an attack takes it below half HP."),
      sourcedFact("attack", "Hypnotize", ["gamefaqs-dali-71891", "jegged-dali"], "If Dagger is the only surviving party member, puts her to Sleep and ends the battle in a Game Over."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal before attacking", detail: "Try for the Steepled Hat and Leather Plate before ending this one-time encounter. Both item types have later purchase sources, but the boss copies cannot be reclaimed.", sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "elitegrindlab-dali"] },
      { title: "Use physical attacks and keep the party up", detail: "Steiner's Bird Killer helps against the aerial boss. Vivi's spells can draw -ara counters, and crossing the half-HP threshold triggers Fira. Keep the other characters alive so Hypnotize cannot end the fight.", sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali"] },
    ],
    routeObjectiveIds: [blackWaltz2StealsObjectiveId],
    notes: [
      "Black Waltz 2's four drop slots all list Ether: one guaranteed slot plus up to three conditional additional copies. Caves of Narshe summarizes this as Ether ×4; several route summaries mention only one.",
      "GameFAQs lists Mini as a vulnerability, while Final Fantasy Wiki lists Mini among immunities. The catalog keeps the disagreement rather than resolving it without a direct game check.",
      "HP is listed as 1,030 by the cross-checked sources; StrategyWiki's 1,000 figure is an apparent rounding or transcription difference and is not selected as the record value.",
      "Walkthroughs differ on the encounter's field location. The dossier uses the Dali story chapter and keeps Observatory Mountain versus cargo-ship loading-area claims explicit in its encounter note.",
    ],
  }, daliChapterId, blackWaltz2Sources, [blackWaltz2StealsMissableId], [blackWaltz2StealsCutoffId]),
];

const lindblumEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.axe-beak",
    name: "Axe Beak",
    encounterIds: ["encounter.lindblum-plateau.mountain-pool", "encounter.lindblum-plateau.forest-pool"],
    stats: enemyStats([["level", 6], ["HP", 241], ["MP", 267], ["EXP", 123], ["AP", 1], ["Gil", 224]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", "game-item.ether"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Beast"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Beak", "Weak physical damage."),
      enemyFact("attack", "Thundara", "A stronger Lightning spell than its physical attack."),
      enemyFact("attack", "Glowing Eyes", "Can inflict Sleep."),
    ],
    blueMagic: [{ name: "Limit Glove", command: "Eat", sourceIds: [enemyListSourceId], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Watch for Sleep and Thundara", detail: "Beast Killer helps against Axe Beak. Glowing Eyes can put a character to Sleep; Quina can learn Limit Glove by eating it after it is weakened.", sourceIds: [enemyListSourceId, "cavesofnarshe-lindblum-walkthrough"] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["Axe Beak appears on both mountain and forest terrain on the plateau; it shares the same table as the later Treno-area enemy entry."],
  }, exploringLindblumChapterId, lindblumPlateauSources),
  chapterEnemy({
    id: "enemy.bomb",
    name: "Bomb",
    encounterIds: ["encounter.lindblum-plateau.forest-pool"],
    stats: enemyStats([["level", 10], ["HP", 526], ["MP", 359], ["EXP", 178], ["AP", 1], ["Gil", 235]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    drops: [enemyLoot("always", "game-item.potion"), enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Aerial"),
      enemyFact("elemental-weakness", "Ice, Water, and Wind"),
      enemyFact("elemental-resistance", "Fire (absorbs); Earth (nullifies)"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Grow and Blow Up", "After growing several times, Bomb can use Blow Up for damage based on its remaining HP."),
      enemyFact("attack", "Charge and Fire", "Both attacks can deal heavy damage at this early point in the game."),
    ],
    blueMagic: [{ name: "Mustard Bomb", command: "Eat", sourceIds: [enemyListSourceId], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Use Ice, Water, or Wind and finish quickly", detail: "Bomb absorbs Fire and nullifies Earth. Its Grow sequence can lead into Blow Up for damage based on its remaining HP; Quina can learn Mustard Bomb by eating it in the plateau forests.", sourceIds: [enemyListSourceId, "cavesofnarshe-lindblum-walkthrough"] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["Bomb is limited to forest terrain on Lindblum Plateau; it is not part of the plateau mountain pool."],
  }, exploringLindblumChapterId, lindblumPlateauSources),
  chapterEnemy({
    id: "enemy.fang-b",
    name: "Fang [B] (Festival of the Hunt)",
    encounterIds: ["encounter.lindblum.festival-random-pool"],
    stats: crossCheckedStats([["level", 5], ["HP", 216], ["MP", 253], ["EXP", 0], ["AP", 0], ["Gil", 0]], huntLootSources),
    steals: [
      sourcedLoot("common", null, huntLootSources, "Nothing"), sourcedLoot("uncommon", null, huntLootSources, "Nothing"),
      sourcedLoot("semi-rare", null, huntLootSources, "Nothing"), sourcedLoot("rare", null, huntLootSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, huntLootSources, "Nothing"), sourcedLoot("common", null, huntLootSources, "Nothing"),
      sourcedLoot("uncommon", null, huntLootSources, "Nothing"), sourcedLoot("rare", null, huntLootSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Beast", huntLootSources),
      sourcedFact("elemental-weakness", "Fire", huntLootSources),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Physical attacks", [enemyListSourceId], "The Hunt variant is described as the strongest of the regular Festival animals."),
    ],
    blueMagic: [],
    strategies: [{ title: "Prioritize Fang for points", detail: "GameFAQs describes Fangs as the highest-value regular Festival animals. The Hunt variant is stronger than Fang [A], but its table lists no steals or drops.", sourceIds: ["gamefaqs-hunt-minigame-71891", enemyListSourceId, "cavesofnarshe-hunt-enemies"] }],
    routeObjectiveIds: [],
    notes: ["This level-5, 216-HP Hunt-only form is distinct from the level-1 Fang [A] in the Evil Forest. The Hunt version awards no EXP, AP, or Gil and has no item drops in the inspected tables."],
  }, lindblumChapterId, huntEnemySources),
  chapterEnemy({
    id: "enemy.mu-b",
    name: "Mu [B] (Festival of the Hunt)",
    encounterIds: ["encounter.lindblum.festival-random-pool"],
    stats: crossCheckedStats([["level", 5], ["HP", 201], ["MP", 253], ["EXP", 0], ["AP", 0], ["Gil", 0]], huntLootSources),
    steals: [
      sourcedLoot("common", null, huntLootSources, "Nothing"), sourcedLoot("uncommon", null, huntLootSources, "Nothing"),
      sourcedLoot("semi-rare", null, huntLootSources, "Nothing"), sourcedLoot("rare", null, huntLootSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, huntLootSources, "Nothing"), sourcedLoot("common", null, huntLootSources, "Nothing"),
      sourcedLoot("uncommon", null, huntLootSources, "Nothing"), sourcedLoot("rare", null, huntLootSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "None", huntLootSources),
      sourcedFact("elemental-weakness", "None listed", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Shadow", ["cavesofnarshe-hunt-enemies"], "Caves of Narshe lists Shadow as a weakness for Mu (Hunt), while GameFAQs lists no weakness."),
      sourcedFact("elemental-resistance", "Holy", ["cavesofnarshe-hunt-enemies"], "Caves of Narshe lists Holy as a resistance; GameFAQs lists no resistance."),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Stone", [enemyListSourceId], "The standard Mu attack is also described for the Hunt form."),
    ],
    blueMagic: [],
    strategies: [{ title: "Treat the hunt form as a separate opponent", detail: "Mu [B] has 201 HP, compared with standard Mu's 77 HP, and yields Festival points instead of ordinary battle rewards. Sources disagree on whether this Hunt form resists Holy and is weak to Shadow.", sourceIds: huntEnemySources }],
    routeObjectiveIds: [],
    notes: ["The Festival version is level 5 with 201 HP and no ordinary rewards. Caves of Narshe lists Holy resistance and Shadow weakness; GameFAQs lists neither, so both claims are retained."],
  }, lindblumChapterId, huntEnemySources),
  chapterEnemy({
    id: "enemy.trick-sparrow-hunt",
    name: "Trick Sparrow (Festival of the Hunt)",
    encounterIds: ["encounter.lindblum.festival-random-pool"],
    stats: [
      ...crossCheckedStats([["level", 5], ["HP", 191], ["MP", 250]], huntLootSources),
      { field: "EXP", value: 65, sourceIds: [enemyListSourceId, "cavesofnarshe-hunt-enemies"], verification: "disputed" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-hunt-minigame-71891"], verification: "disputed" },
      { field: "AP", value: 1, sourceIds: [enemyListSourceId, "cavesofnarshe-hunt-enemies"], verification: "disputed" },
      { field: "AP", value: 0, sourceIds: ["gamefaqs-hunt-minigame-71891"], verification: "disputed" },
      { field: "Gil", value: 198, sourceIds: [enemyListSourceId, "cavesofnarshe-hunt-enemies"], verification: "disputed" },
      { field: "Gil", value: 0, sourceIds: ["gamefaqs-hunt-minigame-71891"], verification: "disputed" },
    ],
    steals: [
      { slot: "common", itemId: "game-item.ore", sourceIds: [enemyListSourceId], note: "GameFAQs says the Festival version is the same as the ordinary Trick Sparrow apart from drops; Caves of Narshe's Hunt entry lists no stolen items." },
      sourcedLoot("uncommon", null, huntLootSources, "Nothing"), sourcedLoot("semi-rare", null, huntLootSources, "Nothing"), sourcedLoot("rare", null, huntLootSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, huntLootSources, "Nothing"), sourcedLoot("common", null, huntLootSources, "Nothing"),
      sourcedLoot("uncommon", null, huntLootSources, "Nothing"), sourcedLoot("rare", null, huntLootSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Aerial", huntLootSources),
      sourcedFact("elemental-weakness", "Wind", huntLootSources),
      sourcedFact("elemental-resistance", "Earth (nullifies)", huntLootSources),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Drain", [enemyListSourceId], "Can drain roughly 50 HP from Zidane during the Festival."),
    ],
    blueMagic: [{ name: "Matra Magic", command: "Eat", sourceIds: [enemyListSourceId], objectiveIds: [] }],
    strategies: [{ title: "Keep its points in context", detail: "Trick Sparrow is a weaker point source than Fang. GameFAQs says the Hunt version retains its ordinary stats but drops nothing; the Hunt guide and Caves of Narshe disagree over ordinary EXP/AP/Gil and whether its Ore steal remains available.", sourceIds: huntEnemySources }],
    routeObjectiveIds: [],
    notes: ["The normal Trick Sparrow table lists an Ore steal, 65 EXP, 1 AP, and 198 Gil. The Festival minigame reference says Hunt enemies award no EXP/AP/Gil/items, while Caves of Narshe's Hunt row repeats the normal EXP/AP/Gil but lists no steals or drops. This event-only record preserves the conflict instead of treating the base loot table as certain Hunt behavior."],
  }, lindblumChapterId, huntEnemySources),
  chapterBoss({
    id: "enemy.zaghnol-hunt",
    name: "Zaghnol (Festival of the Hunt)",
    encounterIds: ["encounter.lindblum.festival-zaghnol"],
    stats: crossCheckedStats([["level", 9], ["HP", 1574], ["MP", 2342], ["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies"]),
    steals: [
      sourcedLoot("common", "game-item.mythril-gloves", ["gamefaqs-hunt-minigame-71891", "jegged-lindblum", "gamerguides-lindblum"]),
      sourcedLoot("uncommon", "game-item.needle-fork", ["gamefaqs-hunt-minigame-71891", "jegged-lindblum", "gamerguides-lindblum"]),
      sourcedLoot("semi-rare", null, ["gamefaqs-hunt-minigame-71891"], "Nothing"), sourcedLoot("rare", null, ["gamefaqs-hunt-minigame-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, ["gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies"], "Nothing"), sourcedLoot("common", null, ["gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies"], "Nothing"), sourcedLoot("rare", null, ["gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Beast", ["gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies"]),
      sourcedFact("elemental-weakness", "Water", ["gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies"]),
      sourcedFact("elemental-resistance", "Lightning (half damage)", ["gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies"]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, Mini, Silence, Sleep, and Slow", ["gamefaqs-hunt-minigame-71891"]),
      sourcedFact("attack", "Heave", ["gamefaqs-hunt-minigame-71891"], "Strong single-target physical attack."),
      sourcedFact("attack", "Electrocute and Thunder", ["gamefaqs-hunt-minigame-71891"], "Electrocute enables single-target or multi-target Thunder."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal both items before choosing the winner", detail: "The one-time battle is the early source for Mythril Gloves and Needle Fork. GameFAQs and route walkthroughs list both steals; Caves of Narshe's Hunt table says no stolen items, so the route retains the practical steal check while flagging that source conflict.", sourceIds: ["gamefaqs-hunt-minigame-71891", "jegged-lindblum", "gamerguides-lindblum", "cavesofnarshe-hunt-enemies"] },
      { title: "Use Freya to control the finish", detail: "Freya joins Zidane for the battle. The winner depends on who defeats Zaghnol; the exact Freya-finishing behavior is version-sensitive, so follow the selected outcome route and its warning rather than assuming a universal score threshold.", sourceIds: ["gamefaqs-hunt-minigame-71891", "jegged-lindblum", "gamerguides-lindblum", "cavesofnarshe-hunt-walkthrough"] },
    ],
    routeObjectiveIds: ["disc-1.lindblum.zaghnol-steals"],
    notes: ["The Hunt-specific form is Level 9 with 1,574 HP, 2,342 MP, and no EXP/AP/Gil. GameFAQs lists Mythril Gloves and Needle Fork in its steal table and multiple route guides tell the player to steal both; Caves of Narshe's event table lists no stolen items. The ordinary world-map Zaghnol has different stats and loot and is not represented by this event record.", "GameFAQs lists Water weakness, half Lightning resistance, and Berserk/Confuse/Darkness/Mini/Silence/Sleep/Slow vulnerabilities for the Festival form. Caves of Narshe's Hunt table lists additional status immunities; no exhaustive immunity model is available in the current data type."],
  }, lindblumChapterId, zaghnolHuntSources, ["missable.disc-1.lindblum.zaghnol-steals", "missable.disc-1.lindblum.festival-vivi"], ["cutoff.lindblum-festival.vivi-outcome"]),
];

const lindblumAreaEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.clipper",
    name: "Clipper",
    encounterIds: ["encounter.lindblum-area.lowlands-pool"],
    stats: enemyStats([["level", 7], ["HP", 294], ["MP", 278], ["EXP", 80], ["AP", 1], ["Gil", 190]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("elemental-weakness", "Lightning"), enemyFact("elemental-resistance", "Water (half damage)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Bubbles, Crush, and Water", "Bubbles hits the party; Crush deals physical damage to one character; Water is its elemental spell."),
    ],
    blueMagic: [{ name: "Aqua Breath", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Use Lightning", detail: "Clipper is weak to Lightning and only partly resists Water; its modest HP and Bubbles/Crush/Water moves make it less threatening than Ironite.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["Clipper is listed in the Lindblum lowlands and around Qu's Marsh; its regional appearances share this battle table."],
  }, exploringLindblumChapterId, lindblumLowlandSources),
  chapterEnemy({
    id: "enemy.hedgehog-pie",
    name: "Hedgehog Pie",
    encounterIds: ["encounter.lindblum-area.lowlands-pool"],
    stats: enemyStats([["level", 7], ["HP", 295], ["MP", 281], ["EXP", 119], ["AP", 1], ["Gil", 187]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "None"), enemyFact("elemental-weakness", "None listed"), enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Fat Press", "Moderate single-target physical damage."),
    ],
    blueMagic: [{ name: "Pumpkin Head", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Finish it before Fat Press adds pressure", detail: "Hedgehog Pie has no listed elemental defense; ordinary attacks are sufficient, and Quina can learn Pumpkin Head by eating it.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["GameFAQs lists Hedgehog Pie around the Lindblum lowlands and in forests near Qu's Marsh."],
  }, exploringLindblumChapterId, lindblumLowlandSources),
  chapterEnemy({
    id: "enemy.ironite",
    name: "Ironite",
    encounterIds: ["encounter.lindblum-area.lowlands-pool", "encounter.burmecia.city-random-pool"],
    stats: enemyStats([["level", 11], ["HP", 889], ["MP", 374], ["EXP", 577], ["AP", 2], ["Gil", 269]]),
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.soft"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.hi-potion"), enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", "game-item.soft"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Aerial and Dragon"), enemyFact("elemental-weakness", "Ice and Wind"), enemyFact("elemental-resistance", "Earth (nullified)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Wings, Flame, and Thundara", "Flame deals a large fraction of max HP as Fire damage; Wings is physical."),
    ],
    blueMagic: [{ name: "Angel's Snack", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Treat Ironite as the high-risk lowland encounter", detail: "Flame deals percentage-based Fire damage, while Wings and Thundara add pressure. Ice/Wind attacks, Dragon Killer, Bird Killer, and status effects are recommended by GameFAQs.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["Ironite appears in both Lindblum's lowland pool and Burmecia's city pool; the same stat and battle table is used for both appearances."],
  }, exploringLindblumChapterId, [...lindblumLowlandSources, ...burmeciaEnemySources]),
  chapterEnemy({
    id: "enemy.ladybird",
    name: "Ladybird (Ladybug in non-PAL versions)",
    encounterIds: ["encounter.lindblum-area.lowlands-pool"],
    stats: enemyStats([["level", 6], ["HP", 244], ["MP", 266], ["EXP", 89], ["AP", 1], ["Gil", 193]]),
    steals: [enemyLoot("common", "game-item.eye-drops"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", "game-item.hi-potion"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Aerial and Bug"), enemyFact("elemental-weakness", "Wind"), enemyFact("elemental-resistance", "Earth (nullified)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Spear and Fire", "Spear deals modest physical damage."),
    ],
    blueMagic: [{ name: "Pumpkin Head", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Exploit Wind and killer abilities", detail: "Wind is effective; Bird Killer and Bug Killer both apply. The enemy is otherwise a low-threat encounter in this area.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["GameFAQs calls the enemy Ladybird and notes that it is called Ladybug in non-PAL versions; the display name preserves both forms."],
  }, exploringLindblumChapterId, lindblumLowlandSources),
  chapterEnemy({
    id: "enemy.mandragora",
    name: "Mandragora",
    encounterIds: ["encounter.lindblum-area.lowlands-pool"],
    stats: enemyStats([["level", 9], ["HP", 662], ["MP", 342], ["EXP", 307], ["AP", 1], ["Gil", 595]]),
    steals: [enemyLoot("common", "game-item.echo-screen"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", "game-item.hi-potion"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("elemental-weakness", "Fire"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Blizzara and Shriek", "Blizzara deals Ice damage; Shriek can inflict Silence."),
      enemyFact("attack", "Chestnut", "Deals damage based on the HP Mandragora has lost."),
    ],
    blueMagic: [{ name: "Limit Glove", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Use Fire and protect spellcasters from Silence", detail: "Fire is effective. Shriek can silence Vivi or Dagger, and Chestnut's damage increases with the HP Mandragora has lost.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["GameFAQs lists Mandragora among the lowland enemies below Lindblum; it is distinct from plant-family enemies in the Evil Forest."],
  }, exploringLindblumChapterId, lindblumLowlandSources),
  chapterEnemy({
    id: "enemy.serpion",
    name: "Serpion",
    encounterIds: ["encounter.lindblum-area.lowlands-pool"],
    stats: enemyStats([["level", 8], ["HP", 397], ["MP", 295], ["EXP", 139], ["AP", 1], ["Gil", 184]]),
    steals: [enemyLoot("common", "game-item.antidote"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.eye-drops"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Dragon"), enemyFact("elemental-weakness", "Ice"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Stab, Blizzard, and Cure", "Stab is its main physical move; it may also cast Blizzard or Cure."),
      enemyFact("attack", "Poison Stab", "A counter used in its Attacking Stance that can inflict Poison."),
    ],
    blueMagic: [{ name: "Mighty Guard", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Eat one for Mighty Guard", detail: "Quina can learn Mighty Guard from Serpion. Ice attacks exploit its weakness; watch for Poison Stab counters while it is in Attacking Stance.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["Serpion appears in the Lindblum lowlands and around Qu's Marsh; its battle table is shared across those areas."],
  }, exploringLindblumChapterId, lindblumLowlandSources),
  chapterEnemy({
    id: "enemy.axolotl",
    name: "Axolotl",
    encounterIds: ["encounter.qus-marsh.disc-1-interior-pool"],
    stats: enemyStats([["level", 6], ["HP", 211], ["MP", 266], ["EXP", 106], ["AP", 1], ["Gil", 236]]),
    steals: [enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("elemental-weakness", "Lightning"), enemyFact("elemental-resistance", "Water (nullified)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Water", "Uses Water against the party."),
      enemyFact("attack", "Aqua Breath", "Deals a fraction of each target's max HP and can be more dangerous than its Water spell."),
    ],
    blueMagic: [{ name: "Aqua Breath", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Learn Aqua Breath and exploit Lightning", detail: "Axolotl is the early Qu's Marsh source for Aqua Breath. It nullifies Water and is weak to Lightning; Aqua Breath itself deals percentage-based damage if it connects.", sourceIds: [enemyListSourceId, "elitegrindlab-qus-marsh"] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["Axolotl appears only in the first, Mist Continent Qu's Marsh. Later marshes contain other enemy forms, so this record is scoped to the Disc I pool."],
  }, exploringLindblumChapterId, qusMarshSources),
  chapterEnemy({
    id: "enemy.gigan-toad-a",
    name: "Gigan Toad [A]",
    encounterIds: ["encounter.qus-marsh.disc-1-interior-pool"],
    stats: enemyStats([["level", 6], ["HP", 242], ["MP", 264], ["EXP", 139], ["AP", 1], ["Gil", 292]]),
    steals: [enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", "game-item.hi-potion"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.ore"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("elemental-weakness", "Lightning"), enemyFact("elemental-resistance", "Water (absorbs)"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Glowing Eyes", "Can inflict Sleep."),
      enemyFact("attack", "Water and Blizzara", "Both are less damaging than expected against this Water-absorbing enemy."),
    ],
    blueMagic: [{ name: "Frog Drop", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"] }],
    strategies: [{ title: "Learn Frog Drop and use Lightning", detail: "Quina learns Frog Drop by eating Gigan Toad [A]. Lightning exploits its weakness; leave Water-absorbing equipment off the enemy-facing action plan.", sourceIds: [enemyListSourceId, "elitegrindlab-qus-marsh"] }],
    routeObjectiveIds: ["disc-1.exploring-lindblum-kingdom.blue-magic"],
    notes: ["GameFAQs distinguishes this 242-HP Disc I form from a later level-7 Gigan Toad [B] with 297 HP and a different steal/drop table. Other guides conflate the forms; this bestiary keeps the first-marsh variant separate."],
  }, exploringLindblumChapterId, qusMarshSources),
  chapterBoss({
    id: "enemy.quale",
    name: "Quale",
    encounterIds: ["encounter.qus-marsh.quale-99-frogs"],
    stats: crossCheckedStats([["level", 76], ["HP", 65535], ["MP", 3680], ["EXP", 65535], ["AP", 10], ["Gil", 10800]], qualeSources),
    steals: [
      sourcedLoot("common", "game-item.elixir", qualeSources), sourcedLoot("uncommon", "game-item.ninja-gear", qualeSources),
      sourcedLoot("semi-rare", "game-item.gluttons-robe", qualeSources), sourcedLoot("rare", "game-item.robe-of-lords", qualeSources),
    ],
    drops: [
      sourcedLoot("always", "game-item.elixir", qualeSources), sourcedLoot("common", "game-item.elixir", qualeSources),
      sourcedLoot("uncommon", "game-item.elixir", qualeSources), sourcedLoot("rare", "game-item.elixir", qualeSources),
    ],
    facts: [
      sourcedFact("type", "Human", qualeSources), sourcedFact("elemental-weakness", "Lightning", qualeSources),
      sourcedFact("elemental-resistance", "Water (absorbs)", qualeSources), sourcedFact("status-vulnerability", "Slow", qualeSources),
      sourcedFact("attack", "Rolling Attack", ["gamefaqs-frog-catching-71891"], "Heavy single-target physical damage."),
      sourcedFact("attack", "Water and Aqua Breath", ["gamefaqs-frog-catching-71891"], "Water damage can be dangerous without protection; Aqua Breath deals percentage-based damage."),
      sourcedFact("attack", "Blind, Confuse, Mini, Poison, and Silence", ["gamefaqs-frog-catching-71891"], "Status spells can disable characters without suitable support abilities."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal the four slots before finishing", detail: "The optional boss has Elixir, Ninja Gear, Glutton's Robe, and Robe of Lords in its steal table. Glutton's Robe has a later synthesis route; the other item routes are tracked in the item catalog.", sourceIds: qualeSources },
      { title: "Save before frog 99 and protect against Water and status", detail: "The 99th frog triggers the fight. GameFAQs recommends saving at 98 frogs and preparing water resistance and status protection before returning to the pond.", sourceIds: ["gamefaqs-frog-catching-71891", "elitegrindlab-qus-marsh"] },
    ],
    routeObjectiveIds: ["disc-4.return-to-gaia.frog-catching"],
    notes: ["The optional battle triggers on the shared 99-frog count. All four drop slots list Elixir; victory also awards Gastro Fork, a quest reward rather than a battle-table drop. The printed 65,535 HP is shared by the reviewed references, though EliteGrindLab notes that this equals the 16-bit maximum and does not resolve the game's stored-value behavior."],
  }, returnToGaiaChapterId, qualeSources),
];

export const enemyRecords: EnemyRecord[] = [
  ...evilForestEnemyRecords,
  ...iceCavernEnemyRecords,
  ...grottoEnemyRecords,
  ...burmeciaEnemyRecords,
  ...earlyDaliEnemyRecords,
  ...lindblumEnemyRecords,
  ...lindblumAreaEnemyRecords,
  {
    id: "enemy.red-dragon",
    name: "Red Dragon",
    kind: "ordinary",
    chapterId: mountGulugChapterId,
    versionScope: "PlayStation walkthrough data; parity with remastered releases has not been audited.",
    encounterIds: [
      "encounter.mount-gulug.red-dragon-return-pair",
      "encounter.mount-gulug.red-dragon-mineshaft",
      "encounter.mount-gulug.red-dragon-lower-pair",
    ],
    stats: [
      { field: "level", value: 36, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "single-source" },
      { field: "HP", value: 8000, sourceIds: gulugSources, verification: "cross-checked" },
      { field: "MP", value: 1242, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "single-source" },
      { field: "EXP", value: 23377, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "disputed" },
      { field: "EXP", value: 22377, sourceIds: ["elitegrindlab-mount-gulug"], verification: "disputed" },
      { field: "AP", value: 3, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "single-source" },
      { field: "Gil", value: 5156, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "single-source" },
    ],
    steals: [
      { slot: "common", itemId: null, itemName: "Tent", sourceIds: ["gamefaqs-lost-continent-71891"], note: "Tent is not yet a normalized game-item record." },
      { slot: "uncommon", itemId: "game-item.ether", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { slot: "semi-rare", itemId: "game-item.elixir", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { slot: "rare", itemId: "game-item.elixir", sourceIds: ["gamefaqs-lost-continent-71891"] },
    ],
    drops: [
      { slot: "always", itemId: "game-item.ether", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { slot: "common", itemId: null, itemName: "Sapphire", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { slot: "uncommon", itemId: null, itemName: "Sapphire", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { slot: "rare", itemId: null, itemName: "Sapphire", sourceIds: ["gamefaqs-lost-continent-71891"] },
    ],
    facts: [
      { category: "type", label: "Aerial", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "type", label: "Dragon", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "elemental-weakness", label: "Ice and Wind", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "elemental-resistance", label: "Earth nullified; Fire damage halved", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "status-vulnerability", label: "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "attack", label: "Twister", detail: "Wind-elemental Blue Magic that can hit the whole party; Quina can learn it here with Eat.", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"] },
      { category: "attack", label: "Aerial Slash", detail: "Wind-elemental damage to the party.", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "attack", label: "Dive", detail: "Heavy physical damage.", sourceIds: ["gamefaqs-lost-continent-71891"] },
    ],
    blueMagic: [
      { name: "Twister", command: "Eat", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "gamefaqs-abilities-71891"], objectiveIds: [twisterObjectiveId] },
    ],
    strategies: [
      { title: "Use a fixed fight or recover Twister in Memoria", detail: "Bring Quina if Twister is missing and use Eat on a weakened Red Dragon. This is the earlier, scripted opportunity; GameFAQs also documents the revived Tiamat in Crystal World as a later teacher before Deathguise.", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "gamerguides-mount-gulug", "elitegrindlab-mount-gulug", "gamefaqs-memoria-71891"] },
      { title: "Prepare for Wind attacks", detail: "Wind-resistant equipment can reduce the pressure from Twister and Aerial Slash. The enemy also takes extra damage from Ice and Wind.", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"] },
    ],
    routeObjectiveIds: [twisterObjectiveId, sweepObjectiveId],
    missableIds: [twisterMissableId, sweepMissableId],
    cutoffIds: [twisterCutoffId, storyExitCutoffId],
    sourceIds: [...gulugSources, "gamefaqs-abilities-71891", "gamefaqs-memoria-71891"],
    coverage: "partial",
    notes: [
      "GameFAQs and Jegged describe a two-dragon ambush, the solo mineshaft fight, and a final pair. EliteGrindLab reports roughly five dragons across three ambushes while noting that its reviewed sources disagree on whether there are three or four encounter groups; the exact grouping remains unresolved.",
      "The EXP tables conflict: GameFAQs lists 23,377, while EliteGrindLab lists 22,377. Both values are preserved rather than selected.",
      "GameFAQs lists Tent as the common steal. Tent is not yet normalized in the item catalog, so that row retains the source name instead of an item link.",
    ],
  },
  {
    id: "enemy.meltigemini",
    name: "Meltigemini",
    kind: "boss",
    chapterId: mountGulugChapterId,
    versionScope: "PlayStation walkthrough data; parity with remastered releases has not been audited.",
    encounterIds: ["encounter.mount-gulug.meltigemini"],
    stats: [
      { field: "level", value: 42, sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "elitegrindlab-mount-gulug"], verification: "cross-checked" },
      { field: "HP", value: 24348, sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "elitegrindlab-mount-gulug"], verification: "cross-checked" },
      { field: "MP", value: 1570, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "single-source" },
      { field: "AP", value: 11, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "single-source" },
      { field: "Gil", value: 6428, sourceIds: ["gamefaqs-lost-continent-71891"], verification: "single-source" },
    ],
    steals: [
      { slot: "common", itemId: "game-item.vaccine", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"] },
      { slot: "uncommon", itemId: "game-item.golden-hairpin", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"] },
      { slot: "semi-rare", itemId: "game-item.demons-vest", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "gamerguides-mount-gulug"] },
      { slot: "rare", itemId: null, itemName: "Nothing", sourceIds: ["gamefaqs-lost-continent-71891"], note: "The listed rare steal result is nothing." },
    ],
    drops: [
      { slot: "always", itemId: "game-item.vaccine", sourceIds: ["gamefaqs-lost-continent-71891", "gamefaqs-enemy-list-71891"], note: "One Vaccine is guaranteed." },
      { slot: "common", itemId: "game-item.vaccine", sourceIds: ["gamefaqs-lost-continent-71891", "gamefaqs-enemy-list-71891"], note: "Chance-based additional copy." },
      { slot: "uncommon", itemId: "game-item.vaccine", sourceIds: ["gamefaqs-lost-continent-71891", "gamefaqs-enemy-list-71891"], note: "Chance-based additional copy." },
      { slot: "rare", itemId: "game-item.vaccine", sourceIds: ["gamefaqs-lost-continent-71891", "gamefaqs-enemy-list-71891"], note: "Chance-based additional copy." },
    ],
    facts: [
      { category: "type", label: "Demon", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "elemental-weakness", label: "Fire and Holy", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "elitegrindlab-mount-gulug"] },
      { category: "elemental-resistance", label: "Shadow damage halved", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "elitegrindlab-mount-gulug"] },
      { category: "status-vulnerability", label: "Darkness, Mini, and Slow", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "attack", label: "Viral Smoke", detail: "Minor party damage and Virus status; Virus prevents AP from the fight according to the independent route audit.", sourceIds: ["gamefaqs-lost-continent-71891", "elitegrindlab-mount-gulug"] },
      { category: "attack", label: "Venom Breath", detail: "Physical attack that inflicts Venom.", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "attack", label: "Bio", detail: "Damage with a chance to inflict Poison.", sourceIds: ["gamefaqs-lost-continent-71891"] },
      { category: "attack", label: "Wings", detail: "Physical damage.", sourceIds: ["gamefaqs-lost-continent-71891"] },
    ],
    blueMagic: [],
    strategies: [
      { title: "Equip Antibody before the fight", detail: "GameFAQs reports that Antibody prevents Venom Breath's Venom and Bio's Poison. EliteGrindLab also flags Viral Smoke's Virus as an AP concern.", sourceIds: ["gamefaqs-lost-continent-71891", "elitegrindlab-mount-gulug"] },
      { title: "Use Mini and steal only while the party is stable", detail: "GameFAQs recommends Mini to weaken the boss and disable its physical damage, then attempting the Vaccine, Golden Hairpin, and Demon's Vest steals. Exact steal percentages are omitted from this record.", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"] },
    ],
    routeObjectiveIds: [meltigeminiObjectiveId],
    missableIds: [meltigeminiMissableId],
    cutoffIds: [meltigeminiCutoffId],
    sourceIds: ["gamefaqs-enemy-list-71891", ...gulugSources],
    coverage: "partial",
    notes: [
      "The Vaccine table has four slots: one guaranteed copy plus up to three chance-based additional copies. Exact drop probabilities are left to the source enemy table and are not required for the route.",
      "The selected armor steal is Demon's Vest; one source reports Demon's Mail, likely confusing it with the earlier Mount Gulug chest. The warning and item record retain that disagreement.",
      "Steal percentages differ between references and are intentionally not normalized here.",
    ],
  },
  ...localEnemyRecords,
  ...pandemoniumEnemyRecords,
  ...iifaTreeEnemyRecords,
  ...memoriaEnemyRecords,
  ...finalBattleEnemyRecords,
  ...ozmaEnemyRecords,
];

export const enemyCatalogCoverage = {
  status: "partial" as const,
  chapterIds: [evilForestChapterId, iceCavernChapterId, journeyToBurmeciaChapterId, burmeciaChapterId, daliChapterId, lindblumChapterId, exploringLindblumChapterId, returnToGaiaChapterId, mountGulugChapterId, pandemoniumChapterId, iifaTreeChapterId, memoriaChapterId, finalBattleChapterId, finalPreparationsChapterId],
  enemyIds: [...evilForestEnemyRecords.map((enemy) => enemy.id), ...iceCavernEnemyRecords.map((enemy) => enemy.id), ...grottoEnemyRecords.map((enemy) => enemy.id), ...burmeciaEnemyRecords.map((enemy) => enemy.id), ...earlyDaliEnemyRecords.map((enemy) => enemy.id), ...lindblumEnemyRecords.map((enemy) => enemy.id), ...lindblumAreaEnemyRecords.map((enemy) => enemy.id), "enemy.red-dragon", "enemy.meltigemini", ...localEnemyRecords.map((enemy) => enemy.id), ...pandemoniumEnemyRecords.map((enemy) => enemy.id), ...iifaTreeEnemyRecords.map((enemy) => enemy.id), ...memoriaEnemyRecords.map((enemy) => enemy.id), ...finalBattleEnemyRecords.map((enemy) => enemy.id), ...ozmaEnemyRecords.map((enemy) => enemy.id)],
  encounterIds: [...enemyEncounters.map((encounter) => encounter.id)],
  note: "Partial enemy reference for Evil Forest, Ice Cavern/Nolrich Heights, Gizamaluke's Grotto, Burmecia and its surrounding world-map region, Dali, Lindblum Plateau and lowlands, Qu's Marsh, Return to Gaia (Quale), Mount Gulug, Pandemonium, the Disc IV Iifa Tree battle, Memoria, Final Preparations, and the final battle. Evil Forest covers its source-listed trail pool, both Prison Cage rescue fights, Plant Brain, and the three-Plant-Spider escape battle; the second Prison Cage HP disagreement remains explicit. Ice Cavern covers the three mist-jet enemy types and the combined Black Waltz 1/Sealion battle; the boss HP and levels are cross-checked, and the Sealion orb-phase spell disagreement is kept source-specific. Gizamaluke's Grotto covers Hornet, Lamia, Skeleton, Type A, two scripted Type A pairs, and Gizamaluke; the Dali Skeleton listing remains separately disputed, and the boss's three one-time steals link to the existing warning and later item recovery. Burmecia separates its Basilisk/Ironite/Magic Vice random pool, the three optional Mimic chest fights, the fixed Type A pair, Beatrix's one-time boss steals, and the wider Burmecia/Cleyra regional pool. Beatrix's level/HP/MP and scripted end condition remain disputed; Magic Vice's first steal slot and Type A's EXP/steal-table printings retain source conflicts. The regional pool includes the Daines-horse Basin Night opportunity and its separately listed Skeleton appearance without implying encounter rates. Nolrich Heights is a separate world-map pool for Carve Spider, Mu, and Python; the adjacent Gunitas Basin pool additionally includes Goblin. Mu's Friendly Monster appearance remains separate from its combat data. Dali's optional underground pool distinguishes the door-triggered Ghost/Vice encounters from the disputed Skeleton listing and records the reported Skeleton + Vice/Ghost-only formations. Black Waltz 2 is a separate one-time boss encounter linked to its steal objective, cutoff, and recovery warning; its field location, Mini vulnerability, and four-Ether drop table preserve source-specific differences. Lindblum separates Plateau mountain/forest pools, lowland enemies around Dragon's Gate and Chocobo Forest, and the first Qu's Marsh Axolotl/Gigan Toad pool; later marsh enemy variants are excluded. Quale is a separate optional boss tied to the shared 99-frog objective, with its four Elixir drop slots, steals, and Gastro Fork quest reward recorded. The Festival uses Hunt-only Fang and Mu variants and a separate Zaghnol boss. Trick Sparrow reward/steal claims, Mu's elemental traits, and Zaghnol's event steals preserve their source conflicts. Mount Gulug covers its source-listed random enemy families, three fixed Red Dragon groups, and Meltigemini. Pandemonium distinguishes its random variants, Mover trio, three scripted party-split fights, and Silver Dragon/Garland/Kuja sequence. Nova Dragon's one-time fight includes the conditional Grand Armor steal. Memoria adds Hades, the four revived guardians, Deathguise, and Kraken's two tentacle components; their disputed HP, Hades shop trigger, right-tentacle steal, and move-side assignments remain explicit. Final Preparations adds Ozma with its Friendly Creatures-dependent reach and Shadow affinity. Trance Kuja's HP and Necron's steal tiers preserve source differences. Other areas and release-by-release parity remain to be researched.",
};
