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
type LocalEnemyInput = Pick<EnemyRecord, "id" | "name" | "encounterIds" | "stats" | "steals" | "drops" | "facts" | "blueMagic" | "strategies" | "routeObjectiveIds" | "notes">;

function localEnemy(record: LocalEnemyInput): EnemyRecord {
  return {
    ...record,
    kind: "ordinary",
    chapterId: mountGulugChapterId,
    versionScope: "PlayStation walkthrough data; parity with remastered releases has not been audited.",
    missableIds: [],
    cutoffIds: [],
    sourceIds: [...mountGulugEnemySources],
    coverage: "partial",
  };
}

function enemyLoot(slot: EnemyTableSlot, itemId: string | null, itemName?: string): EnemyLootSlot {
  return { slot, itemId, ...(itemName ? { itemName } : {}), sourceIds: [enemyListSourceId] };
}

function enemyFact(category: EnemyFact["category"], label: string, detail?: string): EnemyFact {
  return { category, label, ...(detail ? { detail } : {}), sourceIds: [enemyListSourceId] };
}

function enemyStats(entries: [EnemyStatField, number][]): EnemyStatClaim[] {
  return entries.map(([field, value]) => ({ field, value, sourceIds: [enemyListSourceId], verification: "single-source" }));
}

function quinaSkill(name: string): EnemyBlueMagic {
  return { name, command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [twisterObjectiveId] };
}

export const enemyEncounters: EnemyEncounter[] = [
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
];

export const enemyCatalogCoverage = {
  status: "partial" as const,
  chapterIds: [mountGulugChapterId],
  enemyIds: ["enemy.red-dragon", "enemy.meltigemini", ...localEnemyRecords.map((enemy) => enemy.id)],
  encounterIds: [
    "encounter.mount-gulug.red-dragon-return-pair",
    "encounter.mount-gulug.red-dragon-mineshaft",
    "encounter.mount-gulug.red-dragon-lower-pair",
    "encounter.mount-gulug.meltigemini",
    "encounter.mount-gulug.common-pool",
    "encounter.mount-gulug.building-pool",
    "encounter.mount-gulug.outside-pool",
  ],
  note: "Mount Gulug profiles cover the four source-listed random enemy families and variants, three fixed Red Dragon groups, and Meltigemini. Other areas and release-by-release parity remain to be researched.",
};
