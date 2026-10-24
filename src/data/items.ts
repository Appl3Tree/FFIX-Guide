import type { CoverageState } from "./guide.ts";

export type GameItemCategory = "consumable" | "equipment" | "key-item";

export type ItemAcquisitionMethod =
  | "chest"
  | "hidden-pickup"
  | "fixed-pickup"
  | "moogle-shop"
  | "shop"
  | "mogshop"
  | "mognet-reward"
  | "quest-reward"
  | "steal"
  | "chocograph";

export type ItemAcquisitionAvailability = "single-use" | "one-time-encounter" | "limited-window" | "conditional" | "repeatable" | "window-unverified";

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
  shopId?: string;
  shopName?: string;
  recommendedBeforeChapterId?: string;
  conditions?: string;
  notes?: string;
  cost?: ItemCost;
  walkthroughObjectiveIds?: string[];
  sourceIds: string[];
};

export type ItemInventoryTarget = {
  id: string;
  itemId: string;
  chapterId: string;
  targetQuantity: number;
  interpretation: string;
  sourceIds: string[];
};

export type EquipmentAbilityClaim = {
  id: string;
  itemId: string;
  abilityName: string;
  verification: CoverageState;
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
    "disc-2.journey-to-outer-continent",
    "disc-2.outer-continent",
    "disc-3.picking-up-the-trail",
    "disc-3.forgotten-continent",
    "disc-3.desert-palace",
    "disc-3.lost-continent",
    "disc-3.aerial-exploration",
    "disc-3.preparing-to-leave",
    "disc-4.return-to-gaia",
  ],
  note: "Partial acquisition catalog: an initial Burmecia slice plus the source-listed Disc III final-stock shops and select alternate reward routes. Shop cutoffs, recovery paths, and item-level completeness still need independent review.",
};

const burmeciaSources = [
  "gamefaqs-burmecia-71891",
  "jegged-burmecia",
  "gamerguides-burmecia",
  "elitegrindlab-burmecia",
];

const finalStockSources = ["gamefaqs-preparing-to-leave-71891", "gamefaqs-shops-71891"];
const disc4ShopSources = ["gamefaqs-shops-71891", "gamefaqs-return-to-gaia-71891"];

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
  { id: "game-item.bandana", name: "Bandana", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.leather-plate", name: "Leather Plate", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.mythril-vest", name: "Mythril Vest", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.fairy-flute", name: "Fairy Flute", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.mythril-claws", name: "Mythril Claws", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.trident", name: "Trident", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.green-beret", name: "Green Beret", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.gold-armor", name: "Gold Armor", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.judo-uniform", name: "Judo Uniform", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.diamond-gloves", name: "Diamond Gloves", category: "equipment", sourceIds: [...finalStockSources, "gamefaqs-chocobo-hot-cold-71891"], verification: "partial" },
  { id: "game-item.diamond-sword", name: "Diamond Sword", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.flame-saber", name: "Flame Saber", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.heavy-lance", name: "Heavy Lance", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.scissor-fangs", name: "Scissor Fangs", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.silver-fork", name: "Silver Fork", category: "equipment", sourceIds: [...finalStockSources, "gamefaqs-items-71891", "gamefaqs-frog-catching-71891"], verification: "partial" },
  { id: "game-item.black-hood", name: "Black Hood", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.asuras-rod", name: "Asura's Rod", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.hamelin", name: "Hamelin", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.octagon-rod", name: "Octagon Rod", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.obelisk", name: "Obelisk", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.rune-blade", name: "Rune Blade", category: "equipment", sourceIds: finalStockSources, verification: "partial" },
  { id: "game-item.tiger-fangs", name: "Tiger Fangs", category: "equipment", sourceIds: [...finalStockSources, "gamefaqs-items-71891", "cavesofnarshe-ff9-claws"], verification: "partial" },
  { id: "game-item.diamond-armor", name: "Diamond Armor", category: "equipment", sourceIds: [...finalStockSources, "gamefaqs-items-71891", "gamefaqs-return-to-gaia-71891", "rpgclassics-armor"], verification: "partial" },
  { id: "game-item.orichalcon", name: "Orichalcon", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.defender", name: "Defender", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.ultima-sword", name: "Ultima Sword", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.holy-lance", name: "Holy Lance", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.avenger", name: "Avenger", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.kaiser-knuckles", name: "Kaiser Knuckles", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.mythril-racket", name: "Mythril Racket", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.fork", name: "Fork", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.bistro-fork", name: "Bistro Fork", category: "equipment", sourceIds: [...disc4ShopSources, "gamefaqs-frog-catching-71891", "game8-frog-catching"], verification: "partial" },
  { id: "game-item.rising-sun", name: "Rising Sun", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.magic-armlet", name: "Magic Armlet", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.egoists-armlet", name: "Egoist's Armlet", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.dragon-wrist", name: "Dragon Wrist", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.power-wrist", name: "Power Wrist", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.defense-gloves", name: "Defense Gloves", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.aegis-gloves", name: "Aegis Gloves", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.lamias-tiara", name: "Lamia's Tiara", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.golden-hairpin", name: "Golden Hairpin", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.coronet", name: "Coronet", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.flash-hat", name: "Flash Hat", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.adaman-hat", name: "Adaman Hat", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.platinum-helm", name: "Platinum Helm", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.kaiser-helm", name: "Kaiser Helm", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.demons-vest", name: "Demon's Vest", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.minervas-plate", name: "Minerva's Plate", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.ninja-gear", name: "Ninja Gear", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.platina-armor", name: "Platina Armor", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.carabini-mail", name: "Carabini Mail", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.dragon-mail", name: "Dragon Mail", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.wizard-rod", name: "Wizard Rod", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.sirens-flute", name: "Siren's Flute", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.high-mage-staff", name: "High Mage Staff", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.thief-hat", name: "Thief Hat", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.holy-miter", name: "Holy Miter", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.dark-gear", name: "Dark Gear", category: "equipment", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.magic-tag", name: "Magic Tag", category: "consumable", sourceIds: disc4ShopSources, verification: "partial" },
  { id: "game-item.vaccine", name: "Vaccine", category: "consumable", sourceIds: disc4ShopSources, verification: "partial" },
];

const treasureSweepObjective = "disc-1.burmecia.treasure-sweep";
const beatrixStealObjective = "disc-1.burmecia.beatrix-steals";
const stiltzkinObjective = "disc-1.burmecia.stiltzkin-1";
const stiltzkinBundle = { currency: "gil" as const, amount: 333, bundleId: "burmecia-stiltzkin-first-bundle" };

type Disc3ShopPathInput = {
  id: string;
  itemId: string;
  chapterId: string;
  shopId: string;
  shopName: string;
  method: "shop" | "mogshop";
  price: number;
  availability: ItemAcquisitionAvailability;
  conditions: string;
  notes?: string;
  additionalSourceIds?: string[];
};

const disc3ShopPaths: ItemAcquisitionPath[] = ([
  { id: "black-mage-village.bandana", itemId: "game-item.bandana", chapterId: "disc-3.picking-up-the-trail", shopId: "black-mage-village.weapon-shop", shopName: "Black Mage Village Weapon Shop", method: "shop", price: 500, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Black Mage Village's Disc IV shops have changed stock, so this exact item listing is only available through the pre-departure window." },
  { id: "black-mage-village.chain-plate", itemId: "game-item.chain-plate", chapterId: "disc-3.picking-up-the-trail", shopId: "black-mage-village.weapon-shop", shopName: "Black Mage Village Weapon Shop", method: "shop", price: 810, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Black Mage Village's Disc IV shops have changed stock, so this exact item listing is only available through the pre-departure window." },
  { id: "black-mage-village.leather-plate", itemId: "game-item.leather-plate", chapterId: "disc-3.picking-up-the-trail", shopId: "black-mage-village.weapon-shop", shopName: "Black Mage Village Weapon Shop", method: "shop", price: 530, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Black Mage Village's Disc IV shops have changed stock, so this exact item listing is only available through the pre-departure window." },
  { id: "black-mage-village.mythril-vest", itemId: "game-item.mythril-vest", chapterId: "disc-3.picking-up-the-trail", shopId: "black-mage-village.weapon-shop", shopName: "Black Mage Village Weapon Shop", method: "shop", price: 1180, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Black Mage Village's Disc IV shops have changed stock, so this exact item listing is only available through the pre-departure window." },

  { id: "mimoza-oeilvert.fairy-flute", itemId: "game-item.fairy-flute", chapterId: "disc-3.forgotten-continent", shopId: "mimoza-oeilvert", shopName: "Mimoza's Mogshop (Oeilvert)", method: "mogshop", price: 4500, availability: "limited-window", conditions: "Oeilvert becomes inaccessible after the Shimmering Island transition." },
  { id: "mimoza-oeilvert.mythril-claws", itemId: "game-item.mythril-claws", chapterId: "disc-3.forgotten-continent", shopId: "mimoza-oeilvert", shopName: "Mimoza's Mogshop (Oeilvert)", method: "mogshop", price: 6500, availability: "limited-window", conditions: "Oeilvert becomes inaccessible after the Shimmering Island transition." },
  { id: "mimoza-oeilvert.trident", itemId: "game-item.trident", chapterId: "disc-3.forgotten-continent", shopId: "mimoza-oeilvert", shopName: "Mimoza's Mogshop (Oeilvert)", method: "mogshop", price: 3580, availability: "limited-window", conditions: "Oeilvert becomes inaccessible after the Shimmering Island transition." },
  { id: "mimoza-oeilvert.green-beret", itemId: "game-item.green-beret", chapterId: "disc-3.forgotten-continent", shopId: "mimoza-oeilvert", shopName: "Mimoza's Mogshop (Oeilvert)", method: "mogshop", price: 2180, availability: "limited-window", conditions: "Oeilvert becomes inaccessible after the Shimmering Island transition." },
  { id: "mimoza-oeilvert.gold-armor", itemId: "game-item.gold-armor", chapterId: "disc-3.forgotten-continent", shopId: "mimoza-oeilvert", shopName: "Mimoza's Mogshop (Oeilvert)", method: "mogshop", price: 2950, availability: "limited-window", conditions: "Oeilvert becomes inaccessible after the Shimmering Island transition." },
  { id: "mimoza-oeilvert.judo-uniform", itemId: "game-item.judo-uniform", chapterId: "disc-3.forgotten-continent", shopId: "mimoza-oeilvert", shopName: "Mimoza's Mogshop (Oeilvert)", method: "mogshop", price: 5000, availability: "limited-window", conditions: "Oeilvert becomes inaccessible after the Shimmering Island transition." },
  { id: "mimoza-oeilvert.diamond-gloves", itemId: "game-item.diamond-gloves", chapterId: "disc-3.forgotten-continent", shopId: "mimoza-oeilvert", shopName: "Mimoza's Mogshop (Oeilvert)", method: "mogshop", price: 2000, availability: "limited-window", conditions: "Oeilvert becomes inaccessible after the Shimmering Island transition." },
  { id: "mimoza-oeilvert.diamond-sword", itemId: "game-item.diamond-sword", chapterId: "disc-3.forgotten-continent", shopId: "mimoza-oeilvert", shopName: "Mimoza's Mogshop (Oeilvert)", method: "mogshop", price: 4700, availability: "limited-window", conditions: "Oeilvert becomes inaccessible after the Shimmering Island transition." },

  { id: "mojito-desert-palace.fairy-flute", itemId: "game-item.fairy-flute", chapterId: "disc-3.desert-palace", shopId: "mojito-desert-palace", shopName: "Mojito's Mogshop (Desert Palace)", method: "mogshop", price: 4500, availability: "limited-window", conditions: "The Desert Palace becomes inaccessible after the Shimmering Island transition." },
  { id: "mojito-desert-palace.mythril-claws", itemId: "game-item.mythril-claws", chapterId: "disc-3.desert-palace", shopId: "mojito-desert-palace", shopName: "Mojito's Mogshop (Desert Palace)", method: "mogshop", price: 6500, availability: "limited-window", conditions: "The Desert Palace becomes inaccessible after the Shimmering Island transition." },
  { id: "mojito-desert-palace.trident", itemId: "game-item.trident", chapterId: "disc-3.desert-palace", shopId: "mojito-desert-palace", shopName: "Mojito's Mogshop (Desert Palace)", method: "mogshop", price: 3580, availability: "limited-window", conditions: "The Desert Palace becomes inaccessible after the Shimmering Island transition." },
  { id: "mojito-desert-palace.green-beret", itemId: "game-item.green-beret", chapterId: "disc-3.desert-palace", shopId: "mojito-desert-palace", shopName: "Mojito's Mogshop (Desert Palace)", method: "mogshop", price: 2180, availability: "limited-window", conditions: "The Desert Palace becomes inaccessible after the Shimmering Island transition." },
  { id: "mojito-desert-palace.gold-armor", itemId: "game-item.gold-armor", chapterId: "disc-3.desert-palace", shopId: "mojito-desert-palace", shopName: "Mojito's Mogshop (Desert Palace)", method: "mogshop", price: 2950, availability: "limited-window", conditions: "The Desert Palace becomes inaccessible after the Shimmering Island transition." },
  { id: "mojito-desert-palace.judo-uniform", itemId: "game-item.judo-uniform", chapterId: "disc-3.desert-palace", shopId: "mojito-desert-palace", shopName: "Mojito's Mogshop (Desert Palace)", method: "mogshop", price: 5000, availability: "limited-window", conditions: "The Desert Palace becomes inaccessible after the Shimmering Island transition." },
  { id: "mojito-desert-palace.diamond-gloves", itemId: "game-item.diamond-gloves", chapterId: "disc-3.desert-palace", shopId: "mojito-desert-palace", shopName: "Mojito's Mogshop (Desert Palace)", method: "mogshop", price: 2000, availability: "limited-window", conditions: "The Desert Palace becomes inaccessible after the Shimmering Island transition." },
  { id: "mojito-desert-palace.diamond-sword", itemId: "game-item.diamond-sword", chapterId: "disc-3.desert-palace", shopId: "mojito-desert-palace", shopName: "Mojito's Mogshop (Desert Palace)", method: "mogshop", price: 4700, availability: "limited-window", conditions: "The Desert Palace becomes inaccessible after the Shimmering Island transition." },

  { id: "esto-gaza.gold-armor", itemId: "game-item.gold-armor", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 2950, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.judo-uniform", itemId: "game-item.judo-uniform", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 5000, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.diamond-gloves", itemId: "game-item.diamond-gloves", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 2000, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.diamond-sword", itemId: "game-item.diamond-sword", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 4700, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.flame-saber", itemId: "game-item.flame-saber", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 5190, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.heavy-lance", itemId: "game-item.heavy-lance", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 4700, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.scissor-fangs", itemId: "game-item.scissor-fangs", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 8000, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.silver-fork", itemId: "game-item.silver-fork", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 7400, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.black-hood", itemId: "game-item.black-hood", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 2550, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.asuras-rod", itemId: "game-item.asuras-rod", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 3180, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.hamelin", itemId: "game-item.hamelin", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 5700, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },
  { id: "esto-gaza.octagon-rod", itemId: "game-item.octagon-rod", chapterId: "disc-3.lost-continent", shopId: "esto-gaza", shopName: "Esto Gaza shop", method: "shop", price: 4500, availability: "limited-window", conditions: "Esto Gaza becomes inaccessible after the Shimmering Island transition." },

  { id: "daguerreo.asuras-rod", itemId: "game-item.asuras-rod", chapterId: "disc-3.aerial-exploration", shopId: "daguerreo", shopName: "Daguerreo weapon shop", method: "shop", price: 3180, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Daguerreo's Disc IV weapon shop has changed stock, so this exact item listing is only available through the pre-departure window." },
  { id: "daguerreo.hamelin", itemId: "game-item.hamelin", chapterId: "disc-3.aerial-exploration", shopId: "daguerreo", shopName: "Daguerreo weapon shop", method: "shop", price: 5700, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Daguerreo's Disc IV weapon shop has changed stock, so this exact item listing is only available through the pre-departure window." },
  { id: "daguerreo.octagon-rod", itemId: "game-item.octagon-rod", chapterId: "disc-3.aerial-exploration", shopId: "daguerreo", shopName: "Daguerreo weapon shop", method: "shop", price: 4500, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Daguerreo's Disc IV weapon shop has changed stock, so this exact item listing is only available through the pre-departure window." },
  { id: "daguerreo.obelisk", itemId: "game-item.obelisk", chapterId: "disc-3.aerial-exploration", shopId: "daguerreo", shopName: "Daguerreo weapon shop", method: "shop", price: 6000, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Daguerreo's Disc IV weapon shop has changed stock, so this exact item listing is only available through the pre-departure window." },
  { id: "daguerreo.rune-blade", itemId: "game-item.rune-blade", chapterId: "disc-3.aerial-exploration", shopId: "daguerreo", shopName: "Daguerreo weapon shop", method: "shop", price: 8900, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Daguerreo's Disc IV weapon shop has changed stock, so this exact item listing is only available through the pre-departure window." },
  { id: "daguerreo.tiger-fangs", itemId: "game-item.tiger-fangs", chapterId: "disc-3.aerial-exploration", shopId: "daguerreo", shopName: "Daguerreo weapon shop", method: "shop", price: 13500, availability: "limited-window", conditions: "Listed in the Disc III final-stock inventory. Daguerreo's Disc IV weapon shop has changed stock, so this exact item listing is only available through the pre-departure window.", notes: "The GameFAQs shop table gives 8,000 Gil, while its pre-departure table, its item reference, Caves of Narshe, and FFOnline give 13,500 Gil. The path uses 13,500 pending direct game verification.", additionalSourceIds: ["gamefaqs-items-71891", "cavesofnarshe-ff9-claws"] },
  { id: "daguerreo.diamond-armor", itemId: "game-item.diamond-armor", chapterId: "disc-3.aerial-exploration", shopId: "daguerreo", shopName: "Daguerreo weapon shop", method: "shop", price: 8800, availability: "limited-window", conditions: "GameFAQs and RPGClassics list Daguerreo as the only documented Diamond Armor source; the Disc IV weapon inventory omits it. This path is source-backed but not directly game-verified.", notes: "GameFAQs recommends buying three Diamond Armors and says they can only be obtained at Daguerreo. RPGClassics independently lists Daguerreo as the acquisition source. No alternate post-transition source appears in the reviewed references.", additionalSourceIds: ["gamefaqs-items-71891", "gamefaqs-return-to-gaia-71891", "rpgclassics-armor"] },
] satisfies Disc3ShopPathInput[]).map((path) => ({
  id: `item-path.disc-3-stock.${path.id}`,
  itemId: path.itemId,
  chapterId: path.chapterId,
  method: path.method,
  quantity: 1,
  availability: path.availability,
  shopId: path.shopId,
  shopName: path.shopName,
  recommendedBeforeChapterId: "disc-3.preparing-to-leave",
  walkthroughObjectiveIds: [
    "disc-3.aerial-exploration.daguerreo-stock",
    ...(path.id === "daguerreo.diamond-armor" ? ["disc-3.aerial-exploration.diamond-armor"] : []),
  ],
  conditions: path.conditions,
  ...(path.notes ? { notes: path.notes } : {}),
  cost: { currency: "gil" as const, amount: path.price },
  sourceIds: [...finalStockSources, ...(path.additionalSourceIds ?? [])],
}));

const disc4ShopPathInputs = [
  ["black-mage-village.weapon-shop", "Black Mage Village Weapon Shop (Disc IV)", "wizard-rod", 3990],
  ["black-mage-village.weapon-shop", "Black Mage Village Weapon Shop (Disc IV)", "sirens-flute", 7000],
  ["black-mage-village.weapon-shop", "Black Mage Village Weapon Shop (Disc IV)", "high-mage-staff", 6000],
  ["black-mage-village.weapon-shop", "Black Mage Village Weapon Shop (Disc IV)", "thief-hat", 7100],
  ["black-mage-village.weapon-shop", "Black Mage Village Weapon Shop (Disc IV)", "holy-miter", 8300],
  ["black-mage-village.weapon-shop", "Black Mage Village Weapon Shop (Disc IV)", "dark-gear", 16300],
  ["black-mage-village.item-shop", "Black Mage Village Item Shop (Disc IV)", "magic-tag", 100],
  ["black-mage-village.item-shop", "Black Mage Village Item Shop (Disc IV)", "vaccine", 100],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "orichalcon", 17000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "defender", 9340],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "ultima-sword", 14000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "holy-lance", 11000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "avenger", 16000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "kaiser-knuckles", 18000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "mythril-racket", 2250],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "fork", 1100],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "bistro-fork", 10300],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "rising-sun", 500],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "magic-armlet", 1000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "egoists-armlet", 2000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "dragon-wrist", 4800],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "power-wrist", 5100],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "defense-gloves", 6000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "aegis-gloves", 7000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "lamias-tiara", 800],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "golden-hairpin", 3700],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "coronet", 4400],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "flash-hat", 5200],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "adaman-hat", 6100],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "platinum-helm", 4600],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "kaiser-helm", 7120],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "demons-vest", 10250],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "minervas-plate", 12200],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "ninja-gear", 14000],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "platina-armor", 10500],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "carabini-mail", 12300],
  ["daguerreo.weapon-shop", "Daguerreo Weapon Shop (Disc IV)", "dragon-mail", 14000],
] as const;

const disc4ShopPaths: ItemAcquisitionPath[] = disc4ShopPathInputs.map(([shopId, shopName, itemSlug, price]) => ({
  id: `item-path.disc-4-shop.${shopId}.${itemSlug}`,
  itemId: `game-item.${itemSlug}`,
  chapterId: "disc-4.return-to-gaia",
  method: "shop",
  quantity: 1,
  availability: "repeatable",
  shopId: `${shopId}.disc-4`,
  shopName,
  conditions: "Listed in the Disc IV stock after the party returns to Gaia aboard the Invincible.",
  cost: { currency: "gil", amount: price },
  sourceIds: disc4ShopSources,
}));

export const itemAcquisitionPaths: ItemAcquisitionPath[] = [
  ...disc3ShopPaths,
  ...disc4ShopPaths,
  {
    id: "item-path.disc-2.chocograph-five-diamond-gloves",
    itemId: "game-item.diamond-gloves",
    chapterId: "disc-2.outer-continent",
    method: "chocograph",
    quantity: 1,
    availability: "conditional",
    conditions: "Dig up Chocograph #5, Bird's Eye Lagoon, after Choco can reach the relevant treasure location.",
    walkthroughObjectiveIds: ["disc-2.outer-continent.chocograph-five-treasure"],
    sourceIds: ["gamefaqs-chocobo-hot-cold-71891", "gamefaqs-outer-continent-71891"],
  },
  {
    id: "item-path.disc-2.frog-catching-silver-fork",
    itemId: "game-item.silver-fork",
    chapterId: "disc-2.journey-to-outer-continent",
    method: "quest-reward",
    quantity: 1,
    availability: "conditional",
    conditions: "Catch 23 frogs for Quale's Silver Fork reward. The 33-frog reward is Bistro Fork, not Silver Fork.",
    walkthroughObjectiveIds: ["disc-2.journey-to-outer-continent.frog-catching"],
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-frog-catching-71891", "game8-frog-catching"],
  },
  {
    id: "item-path.disc-2.frog-catching-bistro-fork",
    itemId: "game-item.bistro-fork",
    chapterId: "disc-2.journey-to-outer-continent",
    method: "quest-reward",
    quantity: 1,
    availability: "conditional",
    conditions: "Catch 33 frogs for Quale's Bistro Fork reward; Silver Fork is the 23-frog reward.",
    walkthroughObjectiveIds: ["disc-2.journey-to-outer-continent.frog-catching"],
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-frog-catching-71891", "game8-frog-catching"],
  },
  {
    id: "item-path.disc-3.desert-palace-black-hood",
    itemId: "game-item.black-hood",
    chapterId: "disc-3.desert-palace",
    method: "fixed-pickup",
    quantity: 1,
    availability: "single-use",
    conditions: "Claim the Black Hood from the Shadow Chamber bloodstone reward during the Desert Palace sequence.",
    walkthroughObjectiveIds: ["disc-3.desert-palace.bloodstones"],
    sourceIds: ["gamefaqs-desert-palace-71891", "gamefaqs-items-71891"],
  },
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

const finalStockTargetInterpretation = "Source-specific total acquisition target from GameFAQs' Disc III pre-departure list. Count copies already owned and copies consumed in synthesis; this is not a universal minimum for every completion route.";

export const sourceInventoryTargets: ItemInventoryTarget[] = [
  ["bandana", 12], ["chain-plate", 3], ["leather-plate", 3], ["mythril-vest", 10],
  ["fairy-flute", 2], ["mythril-claws", 2], ["trident", 2], ["green-beret", 7],
  ["gold-armor", 3], ["judo-uniform", 7], ["diamond-gloves", 3], ["diamond-sword", 2],
  ["flame-saber", 2], ["heavy-lance", 2], ["scissor-fangs", 2], ["silver-fork", 2],
  ["black-hood", 6], ["asuras-rod", 2], ["hamelin", 2], ["octagon-rod", 2],
  ["obelisk", 2], ["rune-blade", 2], ["tiger-fangs", 2], ["diamond-armor", 3],
].map(([slug, targetQuantity]) => ({
  id: `item-target.disc-3.preparing-to-leave.${slug}`,
  itemId: `game-item.${slug}`,
  chapterId: "disc-3.preparing-to-leave",
  targetQuantity: targetQuantity as number,
  interpretation: finalStockTargetInterpretation,
  sourceIds: ["gamefaqs-preparing-to-leave-71891"],
}));

export const equipmentAbilityClaims: EquipmentAbilityClaim[] = [
  { id: "item-ability.trident.luna", itemId: "game-item.trident", abilityName: "Luna", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.diamond-armor.ability-up", itemId: "game-item.diamond-armor", abilityName: "Ability Up", verification: "partial", sourceIds: ["gamefaqs-items-71891", "rpgclassics-armor"] },
  { id: "item-ability.diamond-sword.power-break", itemId: "game-item.diamond-sword", abilityName: "Power Break", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.flame-saber.magic-break", itemId: "game-item.flame-saber", abilityName: "Magic Break", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.heavy-lance.six-dragons", itemId: "game-item.heavy-lance", abilityName: "Six Dragons", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.black-hood.death", itemId: "game-item.black-hood", abilityName: "Death", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.hamelin.jewel", itemId: "game-item.hamelin", abilityName: "Jewel", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.octagon-rod.firaga", itemId: "game-item.octagon-rod", abilityName: "Firaga", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.octagon-rod.blizzaga", itemId: "game-item.octagon-rod", abilityName: "Blizzaga", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.octagon-rod.thundaga", itemId: "game-item.octagon-rod", abilityName: "Thundaga", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
  { id: "item-ability.rune-blade.iai-strike", itemId: "game-item.rune-blade", abilityName: "Iai Strike", verification: "partial", sourceIds: ["gamefaqs-preparing-to-leave-71891", "gamefaqs-abilities-71891"] },
];
