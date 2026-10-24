import { activeTimeEvents } from "./ates.ts";

export type ObjectiveDependency = {
  prerequisiteObjectiveId: string;
  dependentObjectiveId: string;
  sourceIds: string[];
};

export type GuideSequenceEdge = {
  fromChapterId: string;
  toChapterId: string;
  relationship: "guide-order";
  sourceIds: string[];
};

export type GameRouteEdge = {
  id: string;
  fromChapterId: string;
  toChapterId: string;
  relationship: "required-story" | "optional-detour" | "optional-return" | "rejoin";
  summary: string;
  sourceIds: string[];
};

// Stable chapter IDs in the source guide's table-of-contents order. This is
// the guide's navigation sequence, not a claim that each chapter is a hard
// in-game prerequisite for the next one.
export const guideChapterSequence = [
  "disc-1.alexandria",
  "disc-1.evil-forest",
  "disc-1.ice-cavern",
  "disc-1.village-of-dali",
  "disc-1.cargo-ship",
  "disc-1.lindblum",
  "disc-1.exploring-lindblum-kingdom",
  "disc-1.journey-to-burmecia",
  "disc-1.burmecia",
  "disc-2.journey-to-treno",
  "disc-2.treno",
  "disc-2.journey-to-cleyra",
  "disc-2.cleyra",
  "disc-2.return-to-alexandria",
  "disc-2.pinnacle-rocks",
  "disc-2.return-to-lindblum",
  "disc-2.journey-to-outer-continent",
  "disc-2.outer-continent",
  "disc-2.magdalene-forest",
  "disc-2.conde-petie-mountain-path",
  "disc-2.madain-sari",
  "disc-2.journey-to-iifa-tree",
  "disc-2.iifa-tree",
  "disc-2.return-to-madain-sari",
  "disc-2.battle-of-iifa-tree",
  "disc-3.the-home-front",
  "disc-3.card-tournament",
  "disc-3.trouble-on-the-home-front",
  "disc-3.the-aftermath",
  "disc-3.on-the-high-seas",
  "disc-3.picking-up-the-trail",
  "disc-3.forgotten-continent",
  "disc-3.desert-palace",
  "disc-3.lost-continent",
  "disc-3.aerial-exploration",
  "disc-3.ipsens-castle",
  "disc-3.breaking-the-seal",
  "disc-3.preparing-to-leave",
  "disc-3.portal-to-another-world",
  "disc-4.return-to-gaia",
  "disc-4.second-battle-of-iifa-tree",
  "disc-4.memoria",
  "disc-4.final-preparations",
  "disc-4.the-final-battle",
];

export const guideSequenceEdges: GuideSequenceEdge[] = guideChapterSequence.slice(1).map((toChapterId, index) => ({
  fromChapterId: guideChapterSequence[index],
  toChapterId,
  relationship: "guide-order",
  sourceIds: ["gamefaqs-walkthrough-71891"],
}));

// The researched gameplay route slice. Keep this separate from the complete
// TOC sequence so an unresearched adjacency is never presented as a game
// requirement. This slice ends with the party's return to Madain Sari after
// the first Iifa Tree descent.
export const verifiedGameRouteChapterIds = [
  "disc-1.alexandria",
  "disc-1.evil-forest",
  "disc-1.ice-cavern",
  "disc-1.village-of-dali",
  "disc-1.cargo-ship",
  "disc-1.lindblum",
  "disc-1.exploring-lindblum-kingdom",
  "disc-1.journey-to-burmecia",
  "disc-1.burmecia",
  "disc-2.journey-to-treno",
  "disc-2.treno",
  "disc-2.journey-to-cleyra",
  "disc-2.cleyra",
  "disc-2.return-to-alexandria",
  "disc-2.pinnacle-rocks",
  "disc-2.return-to-lindblum",
  "disc-2.journey-to-outer-continent",
  "disc-2.outer-continent",
  "disc-2.magdalene-forest",
  "disc-2.conde-petie-mountain-path",
  "disc-2.madain-sari",
  "disc-2.journey-to-iifa-tree",
  "disc-2.iifa-tree",
  "disc-2.return-to-madain-sari",
] as const;

export const gameRouteCoverage = {
  status: "partial" as const,
  throughChapterId: "disc-2.return-to-madain-sari",
  chapterIds: verifiedGameRouteChapterIds,
};

export const gameRouteEdges: GameRouteEdge[] = [
  {
    id: "story.alexandria-to-evil-forest",
    fromChapterId: "disc-1.alexandria",
    toChapterId: "disc-1.evil-forest",
    relationship: "required-story",
    summary: "The Alexandria escape and Prima Vista crash strand the party at the Evil Forest crash site.",
    sourceIds: ["gamefaqs-alexandria-71891", "jegged-alexandria-castle", "jegged-evil-forest"],
  },
  {
    id: "story.evil-forest-to-ice-cavern",
    fromChapterId: "disc-1.evil-forest",
    toChapterId: "disc-1.ice-cavern",
    relationship: "required-story",
    summary: "After Plant Brain and the escape, the party reaches Gunitas Basin and the world map; Ice Cavern is the next story destination. A South Gate stop is optional.",
    sourceIds: ["gamefaqs-evil-forest-71891", "gamefaqs-ice-cavern-71891", "jegged-evil-forest", "jegged-ice-cavern"],
  },
  {
    id: "story.ice-cavern-to-dali",
    fromChapterId: "disc-1.ice-cavern",
    toChapterId: "disc-1.village-of-dali",
    relationship: "required-story",
    summary: "Defeating Black Waltz 1 and Sealion returns Zidane to the world map. Dali is the next destination; the nearby South Gate and friendly Mu are optional stops.",
    sourceIds: ["gamefaqs-ice-cavern-71891", "gamefaqs-dali-71891", "jegged-ice-cavern", "jegged-dali"],
  },
  {
    id: "story.dali-to-cargo-ship",
    fromChapterId: "disc-1.village-of-dali",
    toChapterId: "disc-1.cargo-ship",
    relationship: "required-story",
    summary: "After the Dali factory and Black Waltz 2, the party may rest and shop or depart immediately. Boarding the airship at the field prompt advances to the Cargo Ship sequence.",
    sourceIds: ["gamefaqs-dali-71891", "gamefaqs-cargo-ship-71891", "jegged-dali", "jegged-cargo-ship"],
  },
  {
    id: "story.cargo-ship-to-lindblum",
    fromChapterId: "disc-1.cargo-ship",
    toChapterId: "disc-1.lindblum",
    relationship: "required-story",
    summary: "Defeating Black Waltz 3 aboard the Cargo Ship triggers the arrival scenes in Lindblum.",
    sourceIds: ["gamefaqs-cargo-ship-71891", "gamefaqs-lindblum-71891", "jegged-cargo-ship", "jegged-lindblum"],
  },
  {
    id: "story.lindblum-to-journey-to-burmecia",
    fromChapterId: "disc-1.lindblum",
    toChapterId: "disc-1.journey-to-burmecia",
    relationship: "required-story",
    summary: "The Festival of the Hunt concludes with a revealed next destination and party change. Leaving Lindblum starts the story route toward Gizamaluke's Grotto and Burmecia; the kingdom exploration can be skipped.",
    sourceIds: ["gamefaqs-lindblum-71891", "gamefaqs-exploring-lindblum-71891", "gamefaqs-journey-to-burmecia-71891", "jegged-lindblum", "jegged-gizamaluke"],
  },
  {
    id: "story.journey-to-burmecia-to-burmecia",
    fromChapterId: "disc-1.journey-to-burmecia",
    toChapterId: "disc-1.burmecia",
    relationship: "required-story",
    summary: "The route through Gizamaluke's Grotto includes a parallel Dagger/Steiner sequence at Bohden Gate. The party reunites at Daines-horse Basin, from which Burmecia is north of the Grotto exit.",
    sourceIds: ["gamefaqs-journey-to-burmecia-71891", "gamefaqs-burmecia-71891", "jegged-gizamaluke"],
  },
  {
    id: "story.burmecia-to-journey-to-treno",
    fromChapterId: "disc-1.burmecia",
    toChapterId: "disc-2.journey-to-treno",
    relationship: "required-story",
    summary: "After the first Burmecia visit, the Disc II transition resumes with the parallel Dagger-and-Steiner route at Summit Station.",
    sourceIds: ["gamefaqs-burmecia-71891", "gamefaqs-journey-to-treno-71891", "jegged-summit-station"],
  },
  {
    id: "story.journey-to-treno-to-treno",
    fromChapterId: "disc-2.journey-to-treno",
    toChapterId: "disc-2.treno",
    relationship: "required-story",
    summary: "After Black Waltz 3's second battle, Dagger and Steiner pass South Gate and Bentini Heights to reach Treno.",
    sourceIds: ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "jegged-treno"],
  },
  {
    id: "story.treno-to-journey-to-cleyra",
    fromChapterId: "disc-2.treno",
    toChapterId: "disc-2.journey-to-cleyra",
    relationship: "required-story",
    summary: "Treno's Supersoft sequence leads into Gargan Roo; after the Gargant encounter and story scenes, control returns to Zidane's party in Burmecia for the Cleyra approach.",
    sourceIds: ["gamefaqs-treno-71891", "gamefaqs-journey-to-cleyra-71891", "jegged-treno", "jegged-gargan-roo"],
  },
  {
    id: "story.journey-to-cleyra-to-cleyra",
    fromChapterId: "disc-2.journey-to-cleyra",
    toChapterId: "disc-2.cleyra",
    relationship: "required-story",
    summary: "After any optional backtracking and preparation, travel west from Burmecia and enter Cleyra's whirlwind.",
    sourceIds: ["gamefaqs-journey-to-cleyra-71891", "gamefaqs-cleyra-71891", "jegged-gargan-roo", "jegged-cleyra"],
  },
  {
    id: "story.cleyra-to-return-to-alexandria",
    fromChapterId: "disc-2.cleyra",
    toChapterId: "disc-2.return-to-alexandria",
    relationship: "required-story",
    summary: "Cleyra's evacuation and Beatrix encounter lead to the party's capture and the next story sequence aboard the Red Rose and in Alexandria Castle.",
    sourceIds: ["gamefaqs-cleyra-71891", "gamefaqs-return-to-alexandria-71891", "jegged-cleyra", "jegged-return-to-alexandria-castle"],
  },
  {
    id: "story.return-to-alexandria-to-pinnacle-rocks",
    fromChapterId: "disc-2.return-to-alexandria",
    toChapterId: "disc-2.pinnacle-rocks",
    relationship: "required-story",
    summary: "After the Alexandria Castle escape, party split, Beatrix encounter, and Ralvuimago fight, the story continues at Pinnacle Rocks with the Ramuh sequence.",
    sourceIds: ["gamefaqs-return-to-alexandria-71891", "gamefaqs-pinnacle-rocks-71891", "jegged-return-to-alexandria-castle", "jegged-pinnacle-rocks"],
  },
  {
    id: "story.pinnacle-rocks-to-return-to-lindblum",
    fromChapterId: "disc-2.pinnacle-rocks",
    toChapterId: "disc-2.return-to-lindblum",
    relationship: "required-story",
    summary: "After Ramuh's story fragments and the Peridot scene, jumping from the cliff triggers the scenes that carry the party to Lindblum. This same required transition reconnects the route after the optional Pinnacle Rocks pickup return.",
    sourceIds: ["gamefaqs-pinnacle-rocks-71891", "gamefaqs-return-to-lindblum-71891", "jegged-pinnacle-rocks", "jegged-return-to-lindblum"],
  },
  {
    id: "story.return-to-lindblum-to-journey-to-outer-continent",
    fromChapterId: "disc-2.return-to-lindblum",
    toChapterId: "disc-2.journey-to-outer-continent",
    relationship: "required-story",
    summary: "After the Lindblum preparations and Dragon's Gate scenes, the party leaves for Qu's Marsh; Quina must rejoin if not recruited earlier before the route through Fossil Roo can continue.",
    sourceIds: ["gamefaqs-return-to-lindblum-71891", "gamefaqs-journey-to-outer-continent-71891", "jegged-return-to-lindblum", "jegged-fossil-roo"],
  },
  {
    id: "story.journey-to-outer-continent-to-outer-continent",
    fromChapterId: "disc-2.journey-to-outer-continent",
    toChapterId: "disc-2.outer-continent",
    relationship: "required-story",
    summary: "The party follows Quina through Fossil Roo, defeats Lani, and exits the one-way Gargant route onto the Outer Continent.",
    sourceIds: ["gamefaqs-journey-to-outer-continent-71891", "gamefaqs-outer-continent-71891", "jegged-fossil-roo", "jegged-conde-petie"],
  },
  {
    id: "story.outer-continent-to-magdalene-forest",
    fromChapterId: "disc-2.outer-continent",
    toChapterId: "disc-2.magdalene-forest",
    relationship: "required-story",
    summary: "After reaching Conde Petie and viewing the story ATE that reunites the party, the dwarves direct them to the owl-free forest southeast of town.",
    sourceIds: ["gamefaqs-outer-continent-71891", "gamefaqs-magdalene-forest-71891", "jegged-conde-petie", "jegged-black-mage-village"],
  },
  {
    id: "story.magdalene-forest-to-conde-petie-mountain-path",
    fromChapterId: "disc-2.magdalene-forest",
    toChapterId: "disc-2.conde-petie-mountain-path",
    relationship: "required-story",
    summary: "Black Mage Village's story scenes point the party back to Conde Petie; completing the required ceremony opens the mountain route beyond the town.",
    sourceIds: ["gamefaqs-magdalene-forest-71891", "gamefaqs-conde-petie-mountain-path-71891", "jegged-black-mage-village", "jegged-conde-petie-mountain-path"],
  },
  {
    id: "story.conde-petie-mountain-path-to-madain-sari",
    fromChapterId: "disc-2.conde-petie-mountain-path",
    toChapterId: "disc-2.madain-sari",
    relationship: "required-story",
    summary: "After crossing the Mountain Path and reaching the Lucid Plains, the party travels to Madain Sari for Eiko's story sequence.",
    sourceIds: ["gamefaqs-conde-petie-mountain-path-71891", "gamefaqs-madain-sari-71891", "jegged-conde-petie-mountain-path", "jegged-madain-sari"],
  },
  {
    id: "story.madain-sari-to-journey-to-iifa-tree",
    fromChapterId: "disc-2.madain-sari",
    toChapterId: "disc-2.journey-to-iifa-tree",
    relationship: "required-story",
    summary: "After Eiko's first-visit story scenes and the required rest, the party leaves Madain Sari and sets out toward the Iifa Tree.",
    sourceIds: ["gamefaqs-madain-sari-71891", "gamefaqs-journey-to-iifa-tree-71891", "jegged-madain-sari", "jegged-iifa-tree"],
  },
  {
    id: "story.journey-to-iifa-tree-to-iifa-tree",
    fromChapterId: "disc-2.journey-to-iifa-tree",
    toChapterId: "disc-2.iifa-tree",
    relationship: "required-story",
    summary: "Return across Conde Petie Mountain Path by the northern fork to Pualei Plains, then travel to the Iifa Tree; the Nymph encounter along the way is optional.",
    sourceIds: ["gamefaqs-journey-to-iifa-tree-71891", "gamefaqs-iifa-tree-71891", "jegged-iifa-tree", "jegged-madain-sari"],
  },
  {
    id: "story.iifa-tree-to-return-to-madain-sari",
    fromChapterId: "disc-2.iifa-tree",
    toChapterId: "disc-2.return-to-madain-sari",
    relationship: "required-story",
    summary: "Eiko breaks the seal, the party descends the tree and defeats Soulcage, then the story sends them back along the Mountain Path to Madain Sari.",
    sourceIds: ["gamefaqs-iifa-tree-71891", "gamefaqs-return-to-madain-sari-71891", "jegged-iifa-tree", "jegged-return-to-madain-sari"],
  },
  {
    id: "detour.lindblum-kingdom-exploration",
    fromChapterId: "disc-1.lindblum",
    toChapterId: "disc-1.exploring-lindblum-kingdom",
    relationship: "optional-detour",
    summary: "After the Festival, Qu's Marsh, Quina recruitment, the plateau, and nearby Chocobo content form an optional preparation excursion. Quina is optional at this point, though the source flags the marsh visit for later ATE prerequisites and recommends recruiting Quina before the coming dungeon.",
    sourceIds: ["gamefaqs-lindblum-71891", "gamefaqs-exploring-lindblum-71891", "gamefaqs-journey-to-burmecia-71891", "jegged-lindblum"],
  },
  {
    id: "detour.lindblum-kingdom-rejoin",
    fromChapterId: "disc-1.exploring-lindblum-kingdom",
    toChapterId: "disc-1.journey-to-burmecia",
    relationship: "rejoin",
    summary: "The excursion can be skipped or completed, then the walkthrough rejoins the required route toward Gizamaluke's Grotto.",
    sourceIds: ["gamefaqs-exploring-lindblum-71891", "gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke"],
  },
  {
    id: "detour.journey-to-cleyra-kupo-nut-return",
    fromChapterId: "disc-2.journey-to-cleyra",
    toChapterId: "disc-1.journey-to-burmecia",
    relationship: "optional-return",
    summary: "Before entering Cleyra, the party can backtrack through Burmecia to Gizamaluke's Grotto and deliver the Kupo Nut Nazna supplied at Summit Station. The delivery is optional; the Disc II guide also identifies Lindblum's basin as a possible side excursion.",
    sourceIds: ["gamefaqs-journey-to-treno-71891", "gamefaqs-journey-to-cleyra-71891", "jegged-gargan-roo", "jegged-kupo-nuts"],
  },
  {
    id: "detour.journey-to-cleyra-rejoin",
    fromChapterId: "disc-1.journey-to-burmecia",
    toChapterId: "disc-2.journey-to-cleyra",
    relationship: "rejoin",
    summary: "After the optional Grotto delivery, return to the Burmecia basin and continue west to Cleyra.",
    sourceIds: ["gamefaqs-journey-to-cleyra-71891", "jegged-gargan-roo", "jegged-cleyra"],
  },
  {
    id: "detour.return-to-lindblum-pinnacle-rocks-return",
    fromChapterId: "disc-2.return-to-lindblum",
    toChapterId: "disc-2.pinnacle-rocks",
    relationship: "optional-return",
    summary: "From Lindblum, the party can use Hunter's Gate to revisit Pinnacle Rocks and collect the Elixir and Phoenix Down if they were missed earlier.",
    sourceIds: ["gamefaqs-return-to-lindblum-71891", "gamefaqs-pinnacle-rocks-71891", "jegged-return-to-lindblum", "jegged-pinnacle-rocks"],
  },
  {
    id: "detour.journey-to-outer-continent-kupo-nut-return",
    fromChapterId: "disc-2.journey-to-outer-continent",
    toChapterId: "disc-1.journey-to-burmecia",
    relationship: "optional-return",
    summary: "Before leaving Dragon's Gate for Qu's Marsh, the party can return to Gizamaluke's Grotto and deliver the Kupo Nut for an optional Elixir reward.",
    sourceIds: ["gamefaqs-journey-to-outer-continent-71891", "gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke", "jegged-kupo-nuts"],
  },
  {
    id: "detour.journey-to-outer-continent-kupo-nut-rejoin",
    fromChapterId: "disc-1.journey-to-burmecia",
    toChapterId: "disc-2.journey-to-outer-continent",
    relationship: "rejoin",
    summary: "After the optional Moguta delivery, return to Dragon's Gate and resume the required route to Qu's Marsh and Fossil Roo.",
    sourceIds: ["gamefaqs-journey-to-outer-continent-71891", "jegged-return-to-lindblum", "jegged-gizamaluke"],
  },
];

// Start with directly documented ATE-to-ATE and side-content links. More
// objective and chapter relationships can join this graph as they are audited.
export const objectiveDependencies: ObjectiveDependency[] = activeTimeEvents.flatMap((event) =>
  (event.prerequisites ?? []).map((prerequisiteObjectiveId) => ({
    prerequisiteObjectiveId,
    dependentObjectiveId: event.objectiveId,
    sourceIds: event.sourceIds,
  })),
);
