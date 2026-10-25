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
    id: "synthesis-recipe.desert-boots",
    resultItemId: "game-item.desert-boots",
    ingredients: [
      { itemId: "game-item.leather-hat", quantity: 1 },
      { itemId: "game-item.leather-shirt", quantity: 1 },
    ],
    chapterId: "disc-1.lindblum",
    shopId: "lindblum.synthesis-shop.disc-1",
    shopName: "Torres' Synthesis Shop (Lindblum, Disc I)",
    cost: { currency: "gil", amount: 300 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-cleyra-71891", "rpgclassics-synthesis", "cavesofnarshe-ff9-disc-2-map"],
    notes: "Leather Hat + Leather Shirt synthesizes Desert Boots for 300 Gil. Sources list the recipe at Lindblum, Treno, Black Mage Village, and Alexandria; the item paths capture the Disc I–IV shop windows and the separate Cleyra Trunk chest.",
  },
  {
    id: "synthesis-recipe.germinas-boots",
    resultItemId: "game-item.germinas-boots",
    ingredients: [
      { itemId: "game-item.desert-boots", quantity: 1 },
      { itemId: "game-item.fork", quantity: 1 },
    ],
    chapterId: "disc-2.treno",
    shopId: "treno.synthesis-shop.disc-2",
    shopName: "Treno Synthesis Shop (Disc II)",
    cost: { currency: "gil", amount: 900 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-shops-71891", "gamefaqs-item-locations-54996", "rpgclassics-synthesis", "cavesofnarshe-ff9-disc-2-map"],
    notes: "Desert Boots + Fork synthesizes Germinas Boots for 900 Gil. The recipe has seven modeled synthesis-shop windows from Treno and Lindblum through Black Mage Village and Alexandria. Desert Boots can be picked up in Cleyra Trunk or synthesized from Leather Hat + Leather Shirt; Fork has Quina's equipped copy, shops, and an Ipsen's Castle chest.",
  },
  {
    id: "synthesis-recipe.phoenix-pinion",
    resultItemId: "game-item.phoenix-pinion",
    ingredients: [
      { itemId: "game-item.phoenix-down", quantity: 1 },
      { itemId: "game-item.gysahl-greens", quantity: 1 },
    ],
    chapterId: "disc-4.memoria",
    shopId: "hades.master-synthesist",
    shopName: "Hades's Master Synthesist Shop",
    cost: { currency: "gil", amount: 300 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-master-synthesist-71891", "gamefaqs-item-locations-54996", "cavesofnarshe-ff9-items"],
    notes: "GameFAQs and Caves of Narshe list Phoenix Down + Gysahl Greens for 300 Gil at Hades. The recipe supplies repeatable Pinions for the Feather Boots ingredient chain; Gysahl Greens has separate Mene purchase, Hot & Cold, and Cleyra pickup paths.",
  },
  {
    id: "synthesis-recipe.magician-shoes",
    resultItemId: "game-item.magician-shoes",
    ingredients: [
      { itemId: "game-item.germinas-boots", quantity: 1 },
      { itemId: "game-item.bone-wrist", quantity: 1 },
    ],
    chapterId: "disc-2.return-to-lindblum",
    shopId: "lindblum.synthesis-shop.disc-2",
    shopName: "Lindblum Synthesis Shop (post-Cleyra)",
    cost: { currency: "gil", amount: 1500 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-item-locations-54996", "gamefaqs-shops-71891", "cavesofnarshe-ff9-disc-2-map"],
    notes: "GameFAQs and Caves of Narshe list Germinas Boots + Bone Wrist for 1,500 Gil. GameFAQs' main item list puts the early Lindblum shop after Cleyra, while the older item-location guide says after Disc I; the data keeps that timing unresolved and also models the separately documented Disc III–IV Lindblum shop.",
  },
  {
    id: "synthesis-recipe.fairy-earrings",
    resultItemId: "game-item.fairy-earrings",
    ingredients: [
      { itemId: "game-item.magic-armlet", quantity: 1 },
      { itemId: "game-item.soft", quantity: 1 },
    ],
    chapterId: "disc-2.outer-continent",
    shopId: "black-mage-village.black-cat-synthesis.disc-2-3",
    shopName: "Black Cat Synthesis Shop (Disc II–III)",
    cost: { currency: "gil", amount: 3200 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-shops-71891", "rpgclassics-synthesis"],
    notes: "GameFAQs' Shops table and RPGClassics list Fairy Earrings from Magic Armlet + Soft for 3,200 Gil, while the GameFAQs Items table gives 3,000 Gil; retain the disagreement and use the two shop/synthesis tables for the modeled price. GameFAQs lists the recipe at Black Mage Village, Alexandria, Treno, Lindblum, and Daguerreo; the item also has a later Desert Palace chest and repeatable Treno Auction source first available in Disc II. Magic Armlet's shop routes and Soft's common restock paths are modeled separately.",
  },
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
  {
    id: "synthesis-recipe.glass-buckle",
    resultItemId: "game-item.glass-buckle",
    ingredients: [
      { itemId: "game-item.glass-armlet", quantity: 1 },
      { itemId: "game-item.leather-wrist", quantity: 1 },
    ],
    chapterId: "disc-1.lindblum",
    shopId: "lindblum.synthesis-shop.disc-1",
    shopName: "Torres' Synthesis Shop (Lindblum, Disc I)",
    cost: { currency: "gil", amount: 500 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-item-locations-54996", "gamefaqs-shops-71891", "rpgclassics-synthesis", "gamefaqs-synthesis-xiamut-38565", "cavesofnarshe-ff9-disc-2-map"],
    notes: "GameFAQs, RPGClassics, Xiamut, and Caves of Narshe list Glass Armlet + Leather Wrist for 500 Gil. The item catalog models the Disc I Lindblum recipe plus the other source-listed windows at Treno, post-Cleyra Lindblum, Black Mage Village, Alexandria, later Treno and Lindblum, Alexandria's alley synthesist, and Black Mage Village on Disc IV. The source list is based on PlayStation references; direct modern-release stock checks remain open.",
  },
  {
    id: "synthesis-recipe.power-belt",
    resultItemId: "game-item.power-belt",
    ingredients: [
      { itemId: "game-item.glass-buckle", quantity: 1 },
      { itemId: "game-item.chain-mail", quantity: 1 },
    ],
    chapterId: "disc-2.return-to-lindblum",
    shopId: "lindblum.synthesis-shop.disc-2",
    shopName: "Lindblum Synthesis Shop (after Cleyra)",
    cost: { currency: "gil", amount: 2000 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-item-locations-54996", "gamefaqs-shops-71891", "gamefaqs-return-to-lindblum-71891", "rpgclassics-synthesis", "gamefaqs-synthesis-xiamut-38565", "cavesofnarshe-ff9-disc-2-map", "neoseeker-ffix-walkthrough-1816852"],
    notes: "GameFAQs, RPGClassics, Xiamut, and Caves of Narshe list Glass Buckle + Chain Mail for 2,000 Gil. GameFAQs identifies post-Cleyra Lindblum, Black Mage Village (Discs II–III), Alexandria, Treno (Discs III–IV), and Daguerreo; RPGClassics also lists Wayne's later Lindblum shop. The Treno Tradition reward is a separate direct source. Glass Buckle is made from Glass Armlet + Leather Wrist for 500 Gil, and both ingredients have their own source-linked paths. This recipe supports the optional 15 Chain Mail-equivalent target, which can count up to 12 Power Belts; it is not a normal completion requirement. Direct stock behavior on modern releases remains unverified.",
  },
  {
    id: "synthesis-recipe.cotton-robe",
    resultItemId: "game-item.cotton-robe",
    ingredients: [
      { itemId: "game-item.wrist", quantity: 1 },
      { itemId: "game-item.steepled-hat", quantity: 1 },
    ],
    chapterId: "disc-1.lindblum",
    shopId: "lindblum.synthesis-shop.disc-1",
    shopName: "Torres' Synthesis Shop (Lindblum, Disc I)",
    cost: { currency: "gil", amount: 1000 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-shops-71891", "rpgclassics-synthesis"],
    notes: "Wrist + Steepled Hat makes Cotton Robe. GameFAQs' Shops table and RPGClassics list the recipe for 1,000 Gil at the documented shops; the GameFAQs Items table lists 2,000 Gil. The item is also a two-copy Chocograph #2 reward, and Daguerreo appears in the detailed shop tables even though the Items table's location list omits it.",
  },
  {
    id: "synthesis-recipe.gluttons-robe",
    resultItemId: "game-item.gluttons-robe",
    ingredients: [
      { itemId: "game-item.mythril-fork", quantity: 1 },
      { itemId: "game-item.cotton-robe", quantity: 1 },
    ],
    chapterId: "disc-3.aerial-exploration",
    shopId: "daguerreo.synthesis-expert",
    shopName: "Synthesis Expert's Shop (Daguerreo)",
    cost: { currency: "gil", amount: 6000 },
    sourceIds: ["gamefaqs-items-71891", "gamefaqs-shops-71891", "rpgclassics-synthesis", "elitegrindlab-synthesis"],
    notes: "Mythril Fork + Cotton Robe makes Glutton's Robe at Daguerreo. The GameFAQs Shops table, RPGClassics, and EliteGrindLab list 6,000 Gil; the GameFAQs Items table lists 8,000 Gil. The recipe is the repeatable recovery route if both one-time steals from Quale and Kraken are missed.",
  },
];
