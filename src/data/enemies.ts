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
  kind: "ordinary" | "boss";
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

export const enemyEncounters: EnemyEncounter[] = [...mountGulugEncounters, ...pandemoniumEncounters, ...iifaTreeEncounters];

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

export const enemyRecords: EnemyRecord[] = [
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
      { title: "Use the fixed fights for Quina's learning opportunity", detail: "Bring Quina if Twister is missing and use Eat on a weakened dragon. The local encounters are scripted; the later Memoria alternative is still disputed in the route data.", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug", "gamerguides-mount-gulug", "elitegrindlab-mount-gulug"] },
      { title: "Prepare for Wind attacks", detail: "Wind-resistant equipment can reduce the pressure from Twister and Aerial Slash. The enemy also takes extra damage from Ice and Wind.", sourceIds: ["gamefaqs-lost-continent-71891", "jegged-mount-gulug"] },
    ],
    routeObjectiveIds: [twisterObjectiveId, sweepObjectiveId],
    missableIds: [twisterMissableId, sweepMissableId],
    cutoffIds: [twisterCutoffId, storyExitCutoffId],
    sourceIds: [...gulugSources, "gamefaqs-abilities-71891"],
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
];

export const enemyCatalogCoverage = {
  status: "partial" as const,
  chapterIds: [mountGulugChapterId, pandemoniumChapterId, iifaTreeChapterId],
  enemyIds: ["enemy.red-dragon", "enemy.meltigemini", ...localEnemyRecords.map((enemy) => enemy.id), ...pandemoniumEnemyRecords.map((enemy) => enemy.id), ...iifaTreeEnemyRecords.map((enemy) => enemy.id)],
  encounterIds: [...enemyEncounters.map((encounter) => encounter.id)],
  note: "Partial enemy reference for Mount Gulug, Pandemonium, and the Disc IV Iifa Tree battle. Mount Gulug covers its source-listed random enemy families, three fixed Red Dragon groups, and Meltigemini. Pandemonium distinguishes its random variants, Mover trio, three scripted party-split fights, and Silver Dragon/Garland/Kuja sequence. Nova Dragon's one-time fight includes the conditional Grand Armor steal; published boss HP disagreements remain visible. Other areas and release-by-release parity remain to be researched.",
};
