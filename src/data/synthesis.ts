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

// The recipe table starts with a source-cross-checked endgame recipe tied to
// the Nova Dragon missable warning. It is not yet a complete synthesis list.
export const synthesisRecipes: SynthesisRecipe[] = [
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
];
