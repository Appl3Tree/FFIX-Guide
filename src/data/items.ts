import type { CoverageState } from "./guide.ts";

export type GameItemCategory = "consumable" | "equipment" | "key-item";

export type ItemAcquisitionMethod =
  | "chest"
  | "hidden-pickup"
  | "fixed-pickup"
  | "moogle-shop"
  | "mognet-reward"
  | "steal"
  | "chocograph";

export type ItemAcquisitionAvailability = "single-use" | "one-time-encounter" | "limited-window" | "conditional" | "repeatable";

export type ItemCost = {
  currency: "gil";
  amount: number;
  bundleId?: string;
};

export type GameItem = {
  id: string;
  name: string;
  category: GameItemCategory;
  sourceIds: string[];
  verification: CoverageState;
};

export type ItemAcquisitionPath = {
  id: string;
  itemId: string;
  chapterId: string;
  method: ItemAcquisitionMethod;
  quantity: number;
  availability: ItemAcquisitionAvailability;
  conditions?: string;
  cost?: ItemCost;
  walkthroughObjectiveIds?: string[];
  sourceIds: string[];
};

// This is a sourced initial slice, not a complete item inventory. Keep each
// acquisition independent so later duplicates, recovery routes, and shop
// cutoffs can be added without changing an item's stable identity.
export const itemCatalogCoverage = {
  status: "partial" as const,
  chapterIds: [
    "disc-1.burmecia",
    "disc-1.exploring-lindblum-kingdom",
    "disc-2.journey-to-treno",
  ],
  note: "Initial Burmecia acquisition slice, with the cited Streamside Chocograph and Black Waltz 3 rematch alternatives included where they source the same item.",
};

const burmeciaSources = [
  "gamefaqs-burmecia-71891",
  "jegged-burmecia",
  "gamerguides-burmecia",
  "elitegrindlab-burmecia",
];

export const gameItems: GameItem[] = [
  { id: "game-item.cancer-stellazzio", name: "Cancer Stellazzio", category: "key-item", sourceIds: [...burmeciaSources, "jegged-stellazzio"], verification: "partial" },
  { id: "game-item.potion", name: "Potion", category: "consumable", sourceIds: burmeciaSources, verification: "partial" },
  { id: "game-item.soft", name: "Soft", category: "consumable", sourceIds: [...burmeciaSources, "jegged-stiltzkin"], verification: "partial" },
  { id: "game-item.germinas-boots", name: "Germinas Boots", category: "equipment", sourceIds: [...burmeciaSources, "gamefaqs-chocobo-hot-cold-71891"], verification: "partial" },
  { id: "game-item.protection-bell", name: "Protection Bell", category: "key-item", sourceIds: burmeciaSources, verification: "partial" },
  { id: "game-item.ether", name: "Ether", category: "consumable", sourceIds: [...burmeciaSources, "jegged-stiltzkin"], verification: "partial" },
  { id: "game-item.phoenix-down", name: "Phoenix Down", category: "consumable", sourceIds: burmeciaSources, verification: "partial" },
  { id: "game-item.tent", name: "Tent", category: "consumable", sourceIds: burmeciaSources, verification: "partial" },
  { id: "game-item.mythril-spear", name: "Mythril Spear", category: "equipment", sourceIds: burmeciaSources, verification: "partial" },
  { id: "game-item.lightning-staff", name: "Lightning Staff", category: "equipment", sourceIds: [...burmeciaSources, "gamefaqs-journey-to-treno-71891", "jegged-summit-station"], verification: "partial" },
  { id: "game-item.kupo-nut", name: "Kupo Nut", category: "key-item", sourceIds: [...burmeciaSources, "gamefaqs-kupo-nuts-71891", "gamefaqs-moogle-faq-23306"], verification: "partial" },
  { id: "game-item.hi-potion", name: "Hi-Potion", category: "consumable", sourceIds: [...burmeciaSources, "jegged-stiltzkin"], verification: "partial" },
  { id: "game-item.chain-plate", name: "Chain Plate", category: "equipment", sourceIds: burmeciaSources, verification: "partial" },
  { id: "game-item.mythril-sword", name: "Mythril Sword", category: "equipment", sourceIds: burmeciaSources, verification: "partial" },
];

const treasureSweepObjective = "disc-1.burmecia.treasure-sweep";
const beatrixStealObjective = "disc-1.burmecia.beatrix-steals";
const stiltzkinObjective = "disc-1.burmecia.stiltzkin-1";
const stiltzkinBundle = { currency: "gil" as const, amount: 333, bundleId: "burmecia-stiltzkin-first-bundle" };

export const itemAcquisitionPaths: ItemAcquisitionPath[] = [
  {
    id: "item-path.burmecia.cancer",
    itemId: "game-item.cancer-stellazzio",
    chapterId: "disc-1.burmecia",
    method: "hidden-pickup",
    quantity: 1,
    availability: "single-use",
    conditions: "Search behind the overturned cart or wooden box on the first street.",
    walkthroughObjectiveIds: ["disc-1.burmecia.cancer-stellazzio"],
    sourceIds: ["gamefaqs-burmecia-71891", "jegged-burmecia", "jegged-stellazzio"],
  },
  {
    id: "item-path.burmecia.potion-room-chest",
    itemId: "game-item.potion",
    chapterId: "disc-1.burmecia",
    method: "chest",
    quantity: 1,
    availability: "single-use",
    conditions: "Ground-floor room after the two Type A Black Mages.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.soft-room-chest",
    itemId: "game-item.soft",
    chapterId: "disc-1.burmecia",
    method: "chest",
    quantity: 1,
    availability: "single-use",
    conditions: "Visible chest in the ground-floor room after the two Type A Black Mages.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.soft-stairwell-hidden",
    itemId: "game-item.soft",
    chapterId: "disc-1.burmecia",
    method: "hidden-pickup",
    quantity: 1,
    availability: "single-use",
    conditions: "Search behind the stairwell on the bottom floor of the same house.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.stiltzkin-soft",
    itemId: "game-item.soft",
    chapterId: "disc-1.burmecia",
    method: "moogle-shop",
    quantity: 1,
    availability: "limited-window",
    cost: stiltzkinBundle,
    walkthroughObjectiveIds: [stiltzkinObjective],
    sourceIds: ["gamefaqs-burmecia-71891", "jegged-stiltzkin"],
  },
  {
    id: "item-path.burmecia.germinas-boots-chest",
    itemId: "game-item.germinas-boots",
    chapterId: "disc-1.burmecia",
    method: "chest",
    quantity: 1,
    availability: "single-use",
    conditions: "Walk across the crumbling balcony to the chest before running over the floor.",
    walkthroughObjectiveIds: ["disc-1.burmecia.germinas-boots"],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.lindblum.streamside-germinas-boots",
    itemId: "game-item.germinas-boots",
    chapterId: "disc-1.exploring-lindblum-kingdom",
    method: "chocograph",
    quantity: 2,
    availability: "single-use",
    conditions: "Dig the first Chocograph, Streamside, at the King Ed Plains shore after the river meets the ocean.",
    walkthroughObjectiveIds: ["disc-1.exploring-lindblum-kingdom.first-chocographs"],
    sourceIds: ["gamefaqs-chocobo-hot-cold-71891"],
  },
  {
    id: "item-path.burmecia.protection-bell",
    itemId: "game-item.protection-bell",
    chapterId: "disc-1.burmecia",
    method: "fixed-pickup",
    quantity: 1,
    availability: "single-use",
    conditions: "Speak with the wounded soldier in the bedroom and search under the bed.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.ether-hidden",
    itemId: "game-item.ether",
    chapterId: "disc-1.burmecia",
    method: "hidden-pickup",
    quantity: 1,
    availability: "single-use",
    conditions: "Search behind the shelf in the bedroom beyond the collapsed floor.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.stiltzkin-ether",
    itemId: "game-item.ether",
    chapterId: "disc-1.burmecia",
    method: "moogle-shop",
    quantity: 1,
    availability: "limited-window",
    cost: stiltzkinBundle,
    walkthroughObjectiveIds: [stiltzkinObjective],
    sourceIds: ["gamefaqs-burmecia-71891", "jegged-stiltzkin"],
  },
  {
    id: "item-path.burmecia.phoenix-down-chest",
    itemId: "game-item.phoenix-down",
    chapterId: "disc-1.burmecia",
    method: "chest",
    quantity: 1,
    availability: "single-use",
    conditions: "Uptown balcony room reached by crossing between balconies over the broken statue.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.phoenix-down-beatrix",
    itemId: "game-item.phoenix-down",
    chapterId: "disc-1.burmecia",
    method: "steal",
    quantity: 1,
    availability: "one-time-encounter",
    conditions: "Steal from Beatrix during her scripted first Burmecia fight.",
    walkthroughObjectiveIds: [beatrixStealObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.tent-chest",
    itemId: "game-item.tent",
    chapterId: "disc-1.burmecia",
    method: "chest",
    quantity: 1,
    availability: "single-use",
    conditions: "Uptown balcony room reached by crossing between balconies over the broken statue.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.mythril-spear",
    itemId: "game-item.mythril-spear",
    chapterId: "disc-1.burmecia",
    method: "fixed-pickup",
    quantity: 1,
    availability: "single-use",
    conditions: "Collect the spear from the armory in Fountain Square.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.lightning-staff-chest",
    itemId: "game-item.lightning-staff",
    chapterId: "disc-1.burmecia",
    method: "chest",
    quantity: 1,
    availability: "single-use",
    conditions: "Open the back chest in Atla's Vault; this also triggers Stiltzkin's appearance.",
    walkthroughObjectiveIds: [treasureSweepObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.journey-to-treno.lightning-staff-steal",
    itemId: "game-item.lightning-staff",
    chapterId: "disc-2.journey-to-treno",
    method: "steal",
    quantity: 1,
    availability: "one-time-encounter",
    conditions: "Steal from the Black Waltz 3 rematch during the train sequence.",
    walkthroughObjectiveIds: ["disc-2.journey-to-treno.black-waltz-3-steals"],
    sourceIds: ["gamefaqs-journey-to-treno-71891", "jegged-summit-station"],
  },
  {
    id: "item-path.burmecia.kupo-nut-atla",
    itemId: "game-item.kupo-nut",
    chapterId: "disc-1.burmecia",
    method: "mognet-reward",
    quantity: 1,
    availability: "conditional",
    conditions: "Carry Mogki's letter from Lindblum and deliver it to Atla through Mognet; Atla then gives a Kupo Nut.",
    walkthroughObjectiveIds: ["disc-1.burmecia.mognet-atla-monev", "disc-1.burmecia.kupo-nut-to-moguta"],
    sourceIds: ["gamefaqs-burmecia-71891", "gamefaqs-kupo-nuts-71891", "gamefaqs-moogle-faq-23306"],
  },
  {
    id: "item-path.burmecia.stiltzkin-hi-potion",
    itemId: "game-item.hi-potion",
    chapterId: "disc-1.burmecia",
    method: "moogle-shop",
    quantity: 1,
    availability: "limited-window",
    cost: stiltzkinBundle,
    walkthroughObjectiveIds: [stiltzkinObjective],
    sourceIds: ["gamefaqs-burmecia-71891", "jegged-stiltzkin"],
  },
  {
    id: "item-path.burmecia.beatrix-chain-plate",
    itemId: "game-item.chain-plate",
    chapterId: "disc-1.burmecia",
    method: "steal",
    quantity: 1,
    availability: "one-time-encounter",
    conditions: "Steal from Beatrix during her scripted first Burmecia fight.",
    walkthroughObjectiveIds: [beatrixStealObjective],
    sourceIds: burmeciaSources,
  },
  {
    id: "item-path.burmecia.beatrix-mythril-sword",
    itemId: "game-item.mythril-sword",
    chapterId: "disc-1.burmecia",
    method: "steal",
    quantity: 1,
    availability: "one-time-encounter",
    conditions: "Rare steal from Beatrix during her scripted first Burmecia fight.",
    walkthroughObjectiveIds: [beatrixStealObjective],
    sourceIds: burmeciaSources,
  },
];
