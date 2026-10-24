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

// Start with directly documented ATE-to-ATE and side-content links. More
// objective and chapter relationships can join this graph as they are audited.
export const objectiveDependencies: ObjectiveDependency[] = activeTimeEvents.flatMap((event) =>
  (event.prerequisites ?? []).map((prerequisiteObjectiveId) => ({
    prerequisiteObjectiveId,
    dependentObjectiveId: event.objectiveId,
    sourceIds: event.sourceIds,
  })),
);
