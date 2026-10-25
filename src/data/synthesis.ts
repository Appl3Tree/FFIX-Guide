import type { ItemCost } from "./items.ts";

export type SynthesisIngredient = {
  itemId: string;
  quantity: number;
};

export type SynthesisRecipe = {
  id: string;
  resultItemId: string;
  ingredients: SynthesisIngredient[];
  chapterId: string;
  shopId: string;
  shopName: string;
  cost: ItemCost;
  sourceIds: string[];
  notes?: string;
};

// This is an initial, source-cross-checked recipe slice, not a complete list.
export const synthesisRecipes: SynthesisRecipe[] = [
  {
    id: "synthesis-recipe.feather-boots",
    resultItemId: "game-item.feather-boots",
    ingredients: [
      { itemId: "game-item.magician-shoes", quantity: 1 },
      { itemId: "game-item.phoenix-pinion", quantity: 1 },
    ],
    chapterId: "disc-3.the-home-front",
    shopId: "alexandria.synthesis-shop.disc-3",
    shopName: "Alexandria Synthesis Shop",
    cost: { currency: "gil", amount: 4000 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-shops-71891", "rpgclassics-synthesis", "jegged-synthesis"],
    notes: "GameFAQs lists Magician Shoes + Phoenix Pinion for 4,000 Gil at Alexandria, Treno (Disc III–IV), Lindblum (Disc III–IV), and Daguerreo. Separate item paths record the other three shop windows; Oeilvert, Chocograph #9, the Treno auction, and Tiamat are alternate Feather Boots sources.",
  },
  {
    id: "synthesis-recipe.grand-armor",
    resultItemId: "game-item.grand-armor",
    ingredients: [
      { itemId: "game-item.mythril-sword", quantity: 1 },
      { itemId: "game-item.mythril-armor", quantity: 1 },
    ],
    chapterId: "disc-4.return-to-gaia",
    shopId: "black-mage-village.black-cat",
    shopName: "Black Cat Synthesis Shop (Disc IV)",
    cost: { currency: "gil", amount: 45000 },
    sourceIds: [
      "gamefaqs-items-71891",
      "gamefaqs-item-locations-54996",
      "gamefaqs-shops-71891",
      "rpgclassics-armor",
      "jegged-synthesis",
      "elitegrindlab-synthesis",
      "gamefaqs-synthesis-xiamut-38565",
      "gamefaqs-synthesis-correction-25681",
    ],
    notes: "Xiamut's older GameFAQs table lists Mythril Armlet + Mythril Sword; CouchPotato's later revision explicitly corrects the ingredient to Mythril Armor, and the current item reference plus independent synthesis lists agree. The recipe is conditional on retaining a Mythril Sword through Disc IV.",
  },
  {
    id: "synthesis-recipe.battle-boots",
    resultItemId: "game-item.battle-boots",
    ingredients: [
      { itemId: "game-item.feather-boots", quantity: 1 },
      { itemId: "game-item.wing-edge", quantity: 1 },
    ],
    chapterId: "disc-3.aerial-exploration",
    shopId: "daguerreo.synthesis-expert",
    shopName: "Synthesis Expert's Shop (Daguerreo)",
    cost: { currency: "gil", amount: 6500 },
    sourceIds: ["gamefaqs-items-71891", "rpgclassics-synthesis", "jegged-synthesis", "elitegrindlab-synthesis"],
    notes: "GameFAQs, RPGClassics, Jegged, and EliteGrindLab agree on the Feather Boots + Wing Edge recipe at Daguerreo. RPGClassics and EliteGrindLab give the 6,500-Gil price; GameFAQs notes the separate 45-frog reward and other acquisition paths. Feather Boots can also be synthesized from Magician Shoes + Phoenix Pinion or recovered from Oeilvert, Abandoned Lagoon, Treno's auction, and Tiamat.",
  },
  {
    id: "synthesis-recipe.rebirth-ring",
    resultItemId: "game-item.rebirth-ring",
    ingredients: [
      { itemId: "game-item.diamond", quantity: 1 },
      { itemId: "game-item.anklet", quantity: 1 },
    ],
    chapterId: "disc-3.aerial-exploration",
    shopId: "daguerreo.synthesis-expert",
    shopName: "Synthesis Expert's Shop (Daguerreo)",
    cost: { currency: "gil", amount: 7000 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-item-locations-54996", "rpgclassics-synthesis", "jegged-synthesis"],
    notes: "GameFAQs identifies Diamond + Anklet at Daguerreo; RPGClassics and Jegged independently list the 7,000-Gil price. Ingredient paths include Anklet's Desert Palace pickup, repeatable Hot & Cold digging, variable-price Treno Auction, and its Gold Choker + Peridot recipe, but the full ingredient-source inventory remains partial.",
  },
  {
    id: "synthesis-recipe.anklet",
    resultItemId: "game-item.anklet",
    ingredients: [
      { itemId: "game-item.gold-choker", quantity: 1 },
      { itemId: "game-item.peridot", quantity: 1 },
    ],
    chapterId: "disc-3.aerial-exploration",
    shopId: "daguerreo.synthesis-expert",
    shopName: "Synthesis Expert's Shop (Daguerreo)",
    cost: { currency: "gil", amount: 4000 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-item-locations-54996", "rpgclassics-synthesis", "jegged-synthesis"],
    notes: "GameFAQs lists Gold Choker + Peridot at Alexandria, Treno, Lindblum, and Daguerreo. RPGClassics gives the 4,000-Gil price and lists the recipe at the Disc III Alexandria and Treno synthesis shops; Daguerreo is the selected representative route.",
  },
  {
    id: "synthesis-recipe.peridot",
    resultItemId: "game-item.peridot",
    ingredients: [
      { itemId: "game-item.ore", quantity: 1 },
      { itemId: "game-item.soft", quantity: 1 },
    ],
    chapterId: "disc-3.aerial-exploration",
    shopId: "daguerreo.synthesis-expert",
    shopName: "Synthesis Expert's Shop (Daguerreo)",
    cost: { currency: "gil", amount: 100 },
    sourceIds: ["gamefaqs-items-71891", "rpgclassics-synthesis", "jegged-synthesis"],
    notes: "GameFAQs lists Peridot from Ore + Soft at Daguerreo, Black Mage Village (Disc IV), and Master Synthesist. RPGClassics gives the 100-Gil cost and also lists the recipe at Daguerreo, the Disc IV Black Cat shop, and Hades.",
  },
  {
    id: "synthesis-recipe.gold-choker",
    resultItemId: "game-item.gold-choker",
    ingredients: [
      { itemId: "game-item.linen-cuirass", quantity: 1 },
      { itemId: "game-item.soft", quantity: 1 },
    ],
    chapterId: "disc-2.treno",
    shopId: "treno.synthesis-shop",
    shopName: "Treno Synthesis Shop",
    cost: { currency: "gil", amount: 1300 },
    sourceIds: ["gamefaqs-items-71891", "rpgclassics-synthesis", "jegged-synthesis"],
    notes: "GameFAQs and Jegged list the Linen Cuirass + Soft recipe at Treno and other synthesis shops. RPGClassics lists it for 1,300 Gil at Treno in Disc II, Lindblum after the Cleyra attack, Black Mage Village, Alexandria, and Lindblum's later shop.",
  },
  {
    id: "synthesis-recipe.silk-robe",
    resultItemId: "game-item.silk-robe",
    ingredients: [
      { itemId: "game-item.silk-shirt", quantity: 1 },
      { itemId: "game-item.bandana", quantity: 1 },
    ],
    chapterId: "disc-3.card-tournament",
    shopId: "treno.synthesis-shop.disc-3",
    shopName: "Treno Synthesis Shop (Disc III)",
    cost: { currency: "gil", amount: 2000 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-shops-71891", "cavesofnarshe-ff9-robes", "rpgclassics-synthesis", "jegged-synthesis"],
    notes: "Silk Robe is also a nine-frog reward and a Cleyra Trunk chest. GameFAQs lists synthesis at Treno, Lindblum after Cleyra, Black Mage Village (Disc II-III), and Alexandria; Caves of Narshe lists Treno (Disc III), Lindblum (Disc III), Alexandria (Disc III), and Daguerreo (Disc III-IV). The available shop windows are represented separately, and Lindblum's post-Cleyra timing is retained with the sources' differing disc labels.",
  },
];
