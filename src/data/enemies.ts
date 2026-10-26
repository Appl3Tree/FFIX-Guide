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

export type EnemyPreparationGuidance = {
  suggestedLevelRange?: { min: number; max: number };
  levelRationale: string;
  difficultyAssessment?: string;
  optionalGrinding: string;
  setupAdvice: string;
  confidence: "partial" | "disputed";
  sourceIds: string[];
};

export type EnemyRecord = {
  id: string;
  name: string;
  kind: "ordinary" | "boss" | "component" | "friendly";
  chapterId: string;
  versionScope: string;
  encounterIds: string[];
  stats: EnemyStatClaim[];
  steals: EnemyLootSlot[];
  drops: EnemyLootSlot[];
  facts: EnemyFact[];
  blueMagic: EnemyBlueMagic[];
  strategies: EnemyStrategy[];
  preparationGuidance?: EnemyPreparationGuidance;
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
const firstIifaTreeChapterId = "disc-2.iifa-tree";
const battleIifaTreeChapterId = "disc-2.battle-of-iifa-tree";
const returnMadainSariChapterId = "disc-2.return-to-madain-sari";
const homeFrontChapterId = "disc-3.trouble-on-the-home-front";
const iifaTreeChapterId = "disc-4.second-battle-of-iifa-tree";
const memoriaChapterId = "disc-4.memoria";
const finalBattleChapterId = "disc-4.the-final-battle";
const finalPreparationsChapterId = "disc-4.final-preparations";
const alexandriaChapterId = "disc-1.alexandria";
const evilForestChapterId = "disc-1.evil-forest";
const iceCavernChapterId = "disc-1.ice-cavern";
const daliChapterId = "disc-1.village-of-dali";
const cargoShipChapterId = "disc-1.cargo-ship";
const trenoChapterId = "disc-2.treno";
const summitStationChapterId = "disc-2.journey-to-treno";
const garganRooChapterId = "disc-2.journey-to-cleyra";
const lindblumChapterId = "disc-1.lindblum";
const exploringLindblumChapterId = "disc-1.exploring-lindblum-kingdom";
const journeyToBurmeciaChapterId = "disc-1.journey-to-burmecia";
const burmeciaChapterId = "disc-1.burmecia";
const cleyraChapterId = "disc-2.cleyra";
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
const tantarianObjectiveId = "disc-2.return-to-alexandria.tantarian";
const tantarianMissableId = "missable.disc-3.trouble-on-the-home-front.tantarian";
const tantarianCutoffId = "cutoff.alexandria-defense.tantarian";
const tantarianSources = ["gamefaqs-return-to-alexandria-71891", "gamefaqs-trouble-on-home-front-71891", "jegged-return-to-alexandria-castle", "jegged-trouble-on-home-front", "gamerguides-alexandria-castle-2", "rpgclassics-bestiary-t-z", "cavesofnarshe-tantarian"];
const trenoGriffinObjectiveId = "disc-2.treno.griffin-challenge";
const trenoGriffinMissableId = "missable.disc-2.treno.griffin-challenge";
const trenoGriffinCutoffId = "cutoff.treno-griffin.stage";
const trenoGriffinSources = ["gamefaqs-treno-71891", "gamefaqs-weapon-shop-monsters-71891", "jegged-treno", "elitegrindlab-treno", "rpgclassics-treno-monsters", enemyListSourceId];
const outerContinentChapterId = "disc-2.outer-continent";
const magdaleneForestChapterId = "disc-2.magdalene-forest";
const outerContinentMarshChapterId = "disc-2.journey-to-outer-continent";
const outerContinentMarshBlueMagicObjectiveId = "disc-2.journey-to-outer-continent.blue-magic";
const madainSariChapterId = "disc-2.madain-sari";
const pinnacleRocksChapterId = "disc-2.pinnacle-rocks";
const fossilRooChapterId = "disc-2.journey-to-outer-continent";
const mountainPathChapterId = "disc-2.conde-petie-mountain-path";
const pualeiPlainsChapterId = "disc-2.journey-to-iifa-tree";
const desertPalaceChapterId = "disc-3.desert-palace";
const desertPalaceBlueMagicObjectiveId = "disc-3.desert-palace.blue-magic";
const valiaPiraObjectiveId = "disc-3.desert-palace.valia-pira";
const ipsensCastleChapterId = "disc-3.ipsens-castle";
const ipsensCastleBlueMagicObjectiveId = "disc-3.ipsens-castle.blue-magic";
const ipsensCastleMirrorsObjectiveId = "disc-3.ipsens-castle.mirrors";
const ipsensTaharkaStealsObjectiveId = "disc-3.ipsens-castle.taharka-steals";
const ipsensTaharkaRamuhCardObjectiveId = "disc-3.ipsens-castle.taharka-ramuh-card";
const ipsensTaharkaStealsMissableId = "missable.disc-3.ipsens-castle.taharka-steals";
const ipsensTaharkaStealsCutoffId = "cutoff.ipsens-castle.taharka-steals";
const breakingSealChapterId = "disc-3.breaking-the-seal";
const earthGuardianStealsObjectiveId = "disc-3.breaking-the-seal.earth-guardian-steals";
const earthGuardianEarthShakeObjectiveId = "disc-3.breaking-the-seal.earth-shake";
const earthGuardianCompleteObjectiveId = "disc-3.breaking-the-seal.complete-shrines";
const earthGuardianStealsMissableId = "missable.disc-3.breaking-the-seal.earth-guardian-steals";
const earthGuardianStealsCutoffId = "cutoff.earth-guardian.steals";
const earthGuardianSources = ["gamefaqs-breaking-the-seal-71891", "jegged-four-shrines-terra", "cavesofnarshe-earth-guardian"];
const earthGuardianEncounterSources = [...earthGuardianSources, "rpgclassics-disc-3-walkthrough"];
const outerContinentBlueMagicObjectiveId = "disc-2.outer-continent.blue-magic";
const fossilRooBlueMagicObjectiveId = "disc-2.journey-to-outer-continent.blue-magic";
const lostContinentBlueMagicObjectiveId = "disc-3.on-the-high-seas.blue-magic";
const lanarMarshChapterId = "disc-3.on-the-high-seas";
const forgottenContinentChapterId = "disc-3.forgotten-continent";
const forgottenContinentBlueMagicRecoveryObjectiveId = "disc-3.forgotten-continent.blue-magic-recovery";
const friendlyFeatherCircleObjectiveId = "disc-3.lost-continent.feather-circle";
const nightBlueMagicObjectiveId = "disc-1.journey-to-burmecia.blue-magic-night";
const outerContinentFriendlyLadybugObjectiveId = "disc-2.outer-continent.friendly-ladybug";
const mountainPathFriendlyYetiObjectiveId = "disc-2.conde-petie-mountain-path.friendly-yeti";
const pualeiFriendlyNymphObjectiveId = "disc-2.journey-to-iifa-tree.nymph";
const hilgigarsStealsObjectiveId = "disc-2.conde-petie-mountain-path.hilgigars-steals";
const hilgigarsStealsMissableId = "missable.disc-2.conde-petie-mountain-path.hilgigars-steals";
const hilgigarsStealsCutoffId = "cutoff.conde-petie.hilgigars-steals";
const outerContinentEncounterSources = ["gamefaqs-monster-list-20490"];
const forgottenContinentEncounterSources = ["gamefaqs-monster-list-20490"];
const forgottenContinentEnemySources = [enemyListSourceId, "gamefaqs-monster-list-20490", "gamefaqs-forgotten-continent-71891", "jegged-desert-palace", "gamefaqs-abilities-71891"];
const forgottenContinentFriendlyJabberwockSources = ["gamefaqs-monster-list-20490", "gamefaqs-friendly-creatures-71891", "gamefaqs-forgotten-continent-71891", "jegged-friendly-monsters"];
const deadForestEncounterSources = ["gamefaqs-magdalene-forest-71891", enemyListSourceId];
const deadForestEnemySources = [enemyListSourceId, "gamefaqs-magdalene-forest-71891", "gamefaqs-abilities-71891"];
const mountainPathEnemySources = [enemyListSourceId, "gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path", "gamefaqs-abilities-71891"];
const lucidPlainsEnemySources = [...mountainPathEnemySources, "gamefaqs-monster-list-20490"];
const banyanoShoresEnemySources = [enemyListSourceId, "rpgclassics-bestiary-a-c"];
const disc4WorldMapEncounterSources = [enemyListSourceId];
const disc4WorldMapBlueMagicObjectiveId = "disc-4.return-to-gaia.island-blue-magic";
const friendlyYetiSources = ["gamefaqs-monster-list-20490", "gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path", "gamefaqs-friendly-creatures-71891", "jegged-friendly-monsters"];
const pualeiPlainsEncounterSources = ["gamefaqs-journey-to-iifa-tree-71891", "gamefaqs-conde-petie-mountain-path-71891", enemyListSourceId, "gamefaqs-monster-list-20490"];
const pualeiFriendlyNymphSources = ["gamefaqs-journey-to-iifa-tree-71891", "gamefaqs-friendly-creatures-71891", "jegged-friendly-monsters"];
const desertPalaceEnemySources = ["gamefaqs-desert-palace-71891", "jegged-returning-desert-palace", enemyListSourceId, "gamefaqs-monster-list-20490", "gamefaqs-abilities-71891"];
const desertPalaceBossSources = ["gamefaqs-desert-palace-71891", "jegged-returning-desert-palace", "flactem-desert-palace", "elitegrindlab-desert-palace", "gamefaqs-monster-list-20490"];
const desertPalaceBossTableSources = ["gamefaqs-desert-palace-71891", "gamefaqs-monster-list-20490"];
const ipsensCastleEnemySources = [enemyListSourceId, "gamefaqs-ipsens-castle-71891", "jegged-ipsens-castle", "flactem-ipsens-castle", "elitegrindlab-ipsens-castle", "gamefaqs-abilities-71891", "rpgclassics-bestiary-t-z"];
const ipsensCastleEncounterSources = [enemyListSourceId, "gamefaqs-ipsens-castle-71891", "jegged-ipsens-castle", "flactem-ipsens-castle"];
const ipsensTaharkaTableSources = ["gamefaqs-ipsens-castle-71891", "rpgclassics-bestiary-t-z"];
const pinnacleRocksEnemySources = [enemyListSourceId, "gamefaqs-pinnacle-rocks-71891", "jegged-pinnacle-rocks", "cavesofnarshe-pinnacle-rocks", "cavesofnarshe-enemies", "gamefaqs-item-locations-54996", "elitegrindlab-pinnacle-rocks", "gamefaqs-abilities-71891", "rpgclassics-bestiary-n-s"];
const fossilRooEnemySources = [enemyListSourceId, "gamefaqs-journey-to-outer-continent-71891", "jegged-fossil-roo", "gamerguides-fossil-roo", "rpgclassics-fossil-roo", "elitegrindlab-fossil-roo", "gamefaqs-abilities-71891"];
const lostContinentFeatherSources = [enemyListSourceId, "gamefaqs-lost-continent-71891", "jegged-esto-gaza", "rpgclassics-lost-continent"];
const friendlyFeatherCircleSources = ["gamefaqs-friendly-creatures-71891", "jegged-friendly-monsters", "cavesofnarshe-friendly-creatures", "gamefaqs-lost-continent-71891", "gamerguides-mount-gulug"];
const outerContinentEnemySources = [enemyListSourceId, "gamefaqs-monster-list-20490", "gamefaqs-outer-continent-71891", "jegged-conde-petie", "rpgclassics-outer-continent", "gamefaqs-abilities-71891"];
const cactuarSources = [...outerContinentEnemySources, "jegged-world-map-cactuar"];
const goblinMageSources = [...outerContinentEnemySources, "jegged-world-map-goblin-mage"];
const griffinSources = [...outerContinentEnemySources, "jegged-world-map-griffin", "gamefaqs-magdalene-forest-71891"];
const worldMapZaghnolSources = [...outerContinentEnemySources, "jegged-world-map-zaghnol"];
const cactuarStatSources = [enemyListSourceId, "gamefaqs-monster-list-20490", "jegged-world-map-cactuar"];
const goblinMageStatSources = [enemyListSourceId, "gamefaqs-monster-list-20490", "jegged-world-map-goblin-mage"];
const griffinStatSources = [enemyListSourceId, "gamefaqs-monster-list-20490", "jegged-world-map-griffin"];
const worldMapZaghnolStatSources = [enemyListSourceId, "gamefaqs-monster-list-20490", "jegged-world-map-zaghnol"];
const outerContinentFriendlySources = ["gamefaqs-monster-list-20490", "gamefaqs-friendly-creatures-71891", "gamefaqs-outer-continent-71891", "gamefaqs-magdalene-forest-71891", "flactem-friendly-monsters", "jegged-friendly-monsters"];
const evilForestEnemySources = [enemyListSourceId, "gamefaqs-evil-forest-71891", "jegged-evil-forest"];
const evilForestBossSources = [enemyListSourceId, "gamefaqs-evil-forest-71891", "jegged-evil-forest"];
const maskedManSources = ["gamefaqs-alexandria-71891", "gamefaqs-alexandria-79143", "rpgclassics-primavista", "gamefaqs-walkthrough-15690"];
const crashSiteBakuSources = ["gamefaqs-evil-forest-71891", "rpgclassics-bestiary-a-c", "vgkami-evil-forest", "gamefaqs-walkthrough-15690"];
const iceCavernEnemySources = [enemyListSourceId, "gamefaqs-ice-cavern-71891", "jegged-ice-cavern"];
const iceCavernBossSources = ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "rpgclassics-ice-cavern"];
const iceCavernSealionSources = [...iceCavernBossSources, "gamefaqs-ice-cavern-79143", "kamigame-ice-cavern-boss"];
const iceCavernStealsObjectiveId = "disc-1.ice-cavern.boss-steals";
const iceCavernStealsMissableId = "missable.disc-1.ice-cavern.boss-steals";
const iceCavernStealsCutoffId = "cutoff.ice-cavern.boss-steals";
const blackWaltz2StealsObjectiveId = "disc-1.village-of-dali.black-waltz-2-steals";
const blackWaltz2StealsMissableId = "missable.disc-1.village-of-dali.black-waltz-2-steals";
const blackWaltz2StealsCutoffId = "cutoff.dali.black-waltz-2-steals";
const summitStationBlackWaltzStealsObjectiveId = "disc-2.journey-to-treno.black-waltz-3-steals";
const summitStationBlackWaltzStealsMissableId = "missable.disc-2.journey-to-treno.black-waltz-3-steals";
const summitStationBlackWaltzStealsCutoffId = "cutoff.journey-to-treno.black-waltz-3-steals";
const cargoShipBlackWaltzStealsObjectiveId = "disc-1.cargo-ship.black-waltz-3-steals";
const cargoShipBlackWaltzStealsMissableId = "missable.disc-1.cargo-ship.black-waltz-3-steals";
const cargoShipBlackWaltzStealsCutoffId = "cutoff.cargo-ship.black-waltz-3-steals";
const gizamalukeStealsObjectiveId = "disc-1.journey-to-burmecia.gizamaluke-steals";
const gizamalukeStealsMissableId = "missable.disc-1.journey-to-burmecia.gizamaluke-steals";
const gizamalukeStealsCutoffId = "cutoff.gizamaluke.boss-steals";
const nolrichEnemySources = [enemyListSourceId, "gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "gamefaqs-abilities-71891"];
const daliEnemySources = [enemyListSourceId, "gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali", "cavesofnarshe-dali-walkthrough", "elitegrindlab-dali", "gamefaqs-abilities-71891"];
const blackWaltz2Sources = ["gamefaqs-dali-71891", "gamefaqs-dali-79143", "jegged-dali", "gamerguides-dali", "elitegrindlab-dali", "cavesofnarshe-dali-enemies", "ffwiki-black-waltz-2"];
const blackWaltz2PreparationSources = [...blackWaltz2Sources, "kamigame-dali-black-waltz-2"];
const cargoShipEnemySources = ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship", "rpgclassics-bestiary-a-c", "rpgclassics-cargo-ship-walkthrough", "cavesofnarshe-cargo-ship", "elitegrindlab-cargo-ship"];
const cargoShipPreparationSources = ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship", "cavesofnarshe-cargo-ship", "elitegrindlab-cargo-ship"];
const summitStationEnemySources = ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station", "strategywiki-summit-station", "elitegrindlab-south-gate"];
const bentiniHeightsEnemySources = [enemyListSourceId, "gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station"];
const garganRooEnemySources = [enemyListSourceId, "gamefaqs-treno-71891", "jegged-gargan-roo", "elitegrindlab-gargan-roo", "rpgclassics-gargan-roo", "gamerguides-gargan-roo"];
const garganRooBossSources = ["gamefaqs-treno-71891", "jegged-gargan-roo", "elitegrindlab-gargan-roo", "rpgclassics-gargan-roo", "gamerguides-gargan-roo"];
const garganRooRalvurahvaObjectiveId = "disc-2.journey-to-cleyra.ralvurahva-steals";
const garganRooRalvurahvaMissableId = "missable.disc-2.journey-to-cleyra.ralvurahva-steals";
const garganRooRalvurahvaCutoffId = "cutoff.gargan-roo.ralvurahva-steals";
const lindblumPlateauSources = [enemyListSourceId, "gamefaqs-exploring-lindblum-71891", "cavesofnarshe-lindblum-walkthrough", "ffwiki-lindblum"];
const lindblumLowlandSources = [enemyListSourceId, "cavesofnarshe-enemies", "cavesofnarshe-lindblum-walkthrough", "gamefaqs-exploring-lindblum-71891", "gamefaqs-abilities-71891"];
const qusMarshSources = [enemyListSourceId, "cavesofnarshe-enemies", "cavesofnarshe-lindblum-walkthrough", "gamefaqs-exploring-lindblum-71891", "elitegrindlab-qus-marsh", "gamefaqs-abilities-71891"];
const outerContinentMarshSources = [enemyListSourceId, "gamefaqs-journey-to-outer-continent-71891", "gamefaqs-outer-continent-71891", "elitegrindlab-qus-marsh", "flactem-disc-2-fossil-roo-outer-continent", "gamefaqs-abilities-71891"];
const lanarMarshSources = [enemyListSourceId, "gamefaqs-item-locations-54996", "gamefaqs-on-the-high-seas-71891", "jegged-blue-narciss", "gamerguides-side-questing-2", "elitegrindlab-qus-marsh", "gamefaqs-abilities-71891"];
const gimmeCatSources = [enemyListSourceId, "gamefaqs-on-the-high-seas-71891", "rpgclassics-bestiary-c-g", "gamefaqs-abilities-71891"];
const blairsurpassMarshSources = [enemyListSourceId, "gamefaqs-item-locations-54996", "gamefaqs-forgotten-continent-71891", "gamefaqs-qus-marsh-60521", "gamefaqs-frog-catching-71891", "gamefaqs-abilities-71891", "rpgclassics-disc-3-walkthrough"];
const anemoneMarshSources = [...new Set([...lanarMarshSources, ...blairsurpassMarshSources])];
const qualeSources = ["gamefaqs-frog-catching-71891", "elitegrindlab-qus-marsh", "rpgclassics-bestiary-n-s"];
const grottoEnemySources = [enemyListSourceId, "gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke", "gamefaqs-grotto-south-gate-79143", "rpgclassics-gizamaluke", "gamefaqs-abilities-71891"];
const burmeciaEnemySources = [enemyListSourceId, "gamefaqs-burmecia-71891", "jegged-burmecia", "gamerguides-burmecia", "elitegrindlab-burmecia"];
const burmeciaRegionSources = [enemyListSourceId, "gamefaqs-journey-to-burmecia-71891", "jegged-gizamaluke", "cavesofnarshe-enemies", "elitegrindlab-burmecia"];
const burmeciaBossSources = ["gamefaqs-burmecia-71891", "jegged-burmecia", "cavesofnarshe-enemies", "elitegrindlab-burmecia"];
const cleyraEnemySources = [enemyListSourceId, "gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra", "cavesofnarshe-enemies", "cavesofnarshe-cleyra-walkthrough", "gamefaqs-abilities-71891"];
const cleyraEncounterSources = ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra", "cavesofnarshe-cleyra-walkthrough"];
const cleyraBossSources = ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra", "cavesofnarshe-enemies"];
const antlionPreparationSources = [...cleyraBossSources, "gamefaqs-boss-guide-31490", "kamigame-antlion"];
const cleyraBlueMagicObjectiveId = "disc-2.cleyra.blue-magic";
const cleyraAntlionStealsObjectiveId = "disc-2.cleyra.antlion-steals";
const cleyraAntlionStealsMissableId = "missable.disc-2.cleyra.antlion-steals";
const cleyraAntlionStealsCutoffId = "cutoff.cleyra-antlion.boss-steals";
const cleyraBeatrixStealsObjectiveId = "disc-2.cleyra.beatrix-steals";
const cleyraBeatrixStealsMissableId = "missable.disc-2.cleyra.beatrix-steals";
const cleyraBeatrixStealsCutoffId = "cutoff.cleyra-beatrix.boss-steals";
const returnToAlexandriaChapterId = "disc-2.return-to-alexandria";
const alexandriaBeatrixStealsObjectiveId = "disc-2.return-to-alexandria.beatrix-steals";
const alexandriaBeatrixStealsMissableId = "missable.disc-2.return-to-alexandria.beatrix-steals";
const alexandriaBeatrixStealsCutoffId = "cutoff.alexandria-rescue.beatrix-steals";
const alexandriaBeatrixBossSources = ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle", "gamerguides-alexandria-castle-2", "elitegrindlab-missables"];
const ralvuimagoStealsObjectiveId = "disc-2.return-to-alexandria.ralvuimago-steals";
const ralvuimagoStealsMissableId = "missable.disc-2.return-to-alexandria.ralvuimago-steals";
const ralvuimagoStealsCutoffId = "cutoff.alexandria-rescue.ralvuimago-steals";
const ralvuimagoSources = ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle", "gamerguides-alexandria-castle-2", "elitegrindlab-gargan-roo", "cavesofnarshe-enemies", "rpgclassics-bestiary-n-s"];
const ralvuimagoPreparationSources = [...ralvuimagoSources, "gamefaqs-boss-guide-31490", "kamigame-ralvuimago", "gamefaqs-treno-71891"];
const ralvuimagoCombatSources = [...ralvuimagoSources, "gamefaqs-boss-guide-31490", "kamigame-ralvuimago"];
const burmeciaStealsObjectiveId = "disc-1.burmecia.beatrix-steals";
const burmeciaStealsMissableId = "missable.disc-1.burmecia.beatrix-steals";
const burmeciaStealsCutoffId = "cutoff.burmecia.beatrix-steals";
const gizamalukeBossSources = [...grottoEnemySources, "cavesofnarshe-gizamaluke", "ffonline-gizamaluke-boss", "gamefaqs-single-character-27398", "vgr-no-spoiler-walkthrough"];
const gizamalukePreparationSources = gizamalukeBossSources;
const huntEnemySources = [enemyListSourceId, "gamefaqs-hunt-minigame-71891", "cavesofnarshe-hunt-enemies", "cavesofnarshe-hunt-walkthrough"];
const huntLootSources = [enemyListSourceId, "cavesofnarshe-hunt-enemies"];
const zaghnolHuntSources = ["gamefaqs-hunt-minigame-71891", "gamefaqs-lindblum-71891", "jegged-lindblum", "gamerguides-lindblum", "cavesofnarshe-hunt-enemies", "cavesofnarshe-hunt-walkthrough"];
const mountGulugEnemySources = [enemyListSourceId, "gamefaqs-lost-continent-71891", "jegged-mount-gulug", "gamefaqs-abilities-71891"];
const pandemoniumEnemySources = [enemyListSourceId, "gamefaqs-portal-to-another-world-71891", "jegged-pandemonium", "elitegrindlab-pandemonium", "flactem-pandemonium"];
const firstIifaTreeEnemySources = [enemyListSourceId, "gamefaqs-iifa-tree-71891", "jegged-iifa-tree", "elitegrindlab-iifa-tree"];
const firstIifaTreeStealsObjectiveId = "disc-2.iifa-tree.soulcage-steals";
const firstIifaTreeStealsMissableId = "missable.disc-2.iifa-tree.soulcage-steals";
const firstIifaTreeStealsCutoffId = "cutoff.iifa-tree.soulcage-steals";
const firstIifaTreeLv5DeathObjectiveId = "disc-2.iifa-tree.lv5-death";
const battleIifaTreeEnemySources = [enemyListSourceId, "gamefaqs-battle-iifa-tree-71891", "gamefaqs-wrapping-up-disc-2-79143", "jegged-iifa-tree-revisited", "gamerguides-iifa-tree-2", "elitegrindlab-iifa-tree-revisited", "gamefaqs-abilities-71891"];
const battleIifaTreeMistodonStealsObjectiveId = "disc-2.battle-of-iifa-tree.mistodon-steals";
const battleIifaTreeMistodonStealsMissableId = "missable.disc-2.battle-of-iifa-tree.mistodon-steals";
const battleIifaTreeMistodonStealsCutoffId = "cutoff.iifa-tree-return.mistodon-steals";
const battleIifaTreeAngelSnackObjectiveId = "disc-2.battle-of-iifa-tree.angel-snack";
const scarletHairStealsObjectiveId = "disc-2.return-to-madain-sari.scarlet-hair-steals";
const scarletHairStealsMissableId = "missable.disc-2.return-to-madain-sari.scarlet-hair-steals";
const scarletHairStealsCutoffId = "cutoff.return-to-madain-sari.scarlet-hair-steals";
const scarletHairSources = ["gamefaqs-return-to-madain-sari-71891", "jegged-return-to-madain-sari", "gamerguides-revisiting-madain-sari", "rpgclassics-bounty-hunters", "rpgclassics-bestiary-n-s", "elitegrindlab-madain-sari-eidolon-wall"];
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
type LocalEnemyInput = Pick<EnemyRecord, "id" | "name" | "encounterIds" | "stats" | "steals" | "drops" | "facts" | "blueMagic" | "strategies" | "preparationGuidance" | "routeObjectiveIds" | "notes">;

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

function disc4WorldMapEnemy(record: LocalEnemyInput, bestiarySourceId: string): EnemyRecord {
  return chapterEnemy(record, returnToGaiaChapterId, [enemyListSourceId, "gamefaqs-abilities-71891", bestiarySourceId]);
}

function disc4WorldMapStats(entries: [EnemyStatField, number][], bestiarySourceId: string): EnemyStatClaim[] {
  return [
    ...crossCheckedStats(entries.filter(([field]) => field !== "AP"), [enemyListSourceId, bestiarySourceId]),
    ...enemyStats(entries.filter(([field]) => field === "AP")),
  ];
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

const alexandriaEncounters: EnemyEncounter[] = [
  {
    id: "encounter.alexandria.masked-man-opening",
    title: "Masked Man (Baku) — Prima Vista opening battle",
    chapterId: alexandriaChapterId,
    location: "Dark room aboard the Prima Vista, after lighting the candle",
    kind: "boss",
    formation: [{ enemyId: "enemy.masked-man-opening", quantity: 1 }],
    sourceIds: maskedManSources,
    objectiveIds: ["disc-1.alexandria.masked-man-steals"],
    missableIds: ["missable.disc-1.alexandria.masked-man-steals"],
    cutoffIds: ["cutoff.alexandria.masked-man-steals"],
    notes: ["RPGClassics identifies the Masked Man as Baku after this fight. This opening encounter is separate from his later Prima Vista Crash Site battle, which has a different stat and steal table."],
  },
];

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
    id: "encounter.evil-forest.baku-crash-site",
    title: "Baku — Prima Vista Crash Site",
    chapterId: evilForestChapterId,
    location: "Cargo Room of the wrecked Prima Vista after Zidane speaks with Baku",
    kind: "boss",
    formation: [{ enemyId: "enemy.baku-crash-site", quantity: 1 }],
    sourceIds: crashSiteBakuSources,
    objectiveIds: ["disc-1.evil-forest.baku-steals"],
    missableIds: ["missable.disc-1.evil-forest.baku-steals"],
    cutoffIds: ["cutoff.evil-forest.escape"],
    notes: ["This is Baku's second, post-crash fight. It is separate from the opening Masked Man encounter aboard the Prima Vista."],
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
    id: "encounter.disc4.burmecia.suburb.mimic-chest-1",
    title: "Disc IV Burmecia Suburb Mimic chest — balcony room",
    chapterId: returnToGaiaChapterId,
    location: "Optional Mimic chest on the second floor of the first side room reached from the Cancer map",
    kind: "fixed",
    formation: [{ enemyId: "enemy.mimic", quantity: 1 }],
    sourceIds: ["megane-kangaroo-disc4-burmecia-recovery"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["A first-hand Disc IV recovery run reports this chest still contains a Mimic. Treat the encounter as conditional on the chest remaining unopened; the source does not establish repeat access after an earlier opening or behavior across other releases."],
  },
  {
    id: "encounter.disc4.burmecia.suburb.mimic-chest-2",
    title: "Disc IV Burmecia Suburb Mimic chest — stairwell room",
    chapterId: returnToGaiaChapterId,
    location: "Optional Mimic chest on the second floor of the upper-right side room, behind the stairs",
    kind: "fixed",
    formation: [{ enemyId: "enemy.mimic", quantity: 1 }],
    sourceIds: ["megane-kangaroo-disc4-burmecia-recovery"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["A first-hand Disc IV recovery run reports this chest still contains a Mimic. Treat the encounter as conditional on the chest remaining unopened; the source does not establish repeat access after an earlier opening or behavior across other releases."],
  },
  {
    id: "encounter.disc4.burmecia.uptown.mimic-chest",
    title: "Disc IV Burmecia Uptown Mimic chest",
    chapterId: returnToGaiaChapterId,
    location: "Optional Mimic chest on the right side of the map with the Phoenix Down and Tent pickups",
    kind: "fixed",
    formation: [{ enemyId: "enemy.mimic", quantity: 1 }],
    sourceIds: ["megane-kangaroo-disc4-burmecia-recovery"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["A first-hand Disc IV recovery run reports this chest still contains a Mimic. Treat the encounter as conditional on the chest remaining unopened; the source does not establish repeat access after an earlier opening or behavior across other releases."],
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

const cleyraEncounters: EnemyEncounter[] = [
  {
    id: "encounter.cleyra-trunk.bottom-sand-base.random-pool",
    title: "Cleyra Trunk — bottom and sand base",
    chapterId: cleyraChapterId,
    location: "Lower trunk, sand base, and first rooms beyond the locked door",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.dragonfly", quantity: null },
      { enemyId: "enemy.sand-golem", quantity: null },
      { enemyId: "enemy.zuu", quantity: null },
    ],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [cleyraBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The GameFAQs route gives this room group Dragonfly, Sand Golem, and Zuu. Exact formation combinations and encounter rates are not published; the Sand Golem record's listed stats belong to its Core."],
  },
  {
    id: "encounter.cleyra-trunk.sandfall.random-pool",
    title: "Cleyra Trunk — sandfall",
    chapterId: cleyraChapterId,
    location: "Sandfall room after opening the sand passage",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.dragonfly", quantity: null },
      { enemyId: "enemy.sand-golem", quantity: null },
    ],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [cleyraBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The route lists Dragonfly and Sand Golem in this room group. Opening the sandfall blocks the entrance, but the enemies remain available on the route onward."],
  },
  {
    id: "encounter.cleyra-trunk.path-to-cleyra.random-pool",
    title: "Cleyra Trunk — path to Cleyra and bridge",
    chapterId: cleyraChapterId,
    location: "Upper path leading toward the bridge to Cleyra",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.carrion-worm", quantity: null },
      { enemyId: "enemy.dragonfly", quantity: null },
    ],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [cleyraBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The route lists Carrion Worm and Dragonfly in this section; no formation odds are inferred."],
  },
  {
    id: "encounter.cleyra-trunk.sand-fork.random-pool",
    title: "Cleyra Trunk — sand fork and sand paths",
    chapterId: cleyraChapterId,
    location: "Cavern reached beyond the fork and bridge",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.carrion-worm", quantity: null },
      { enemyId: "enemy.dragonfly", quantity: null },
      { enemyId: "enemy.sand-golem", quantity: null },
    ],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [cleyraBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The route lists Carrion Worm, Dragonfly, and Sand Golem here. The Sand Golem Core can be targeted directly with Ice magic; striking its body can trigger counters."],
  },
  {
    id: "encounter.cleyra-trunk.quicksand.random-pool",
    title: "Cleyra Trunk — quicksand pits and upper outer climb",
    chapterId: cleyraChapterId,
    location: "Whirlpool room, quicksand pits, and upper outer climb",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.carrion-worm", quantity: null },
      { enemyId: "enemy.dragonfly", quantity: null },
      { enemyId: "enemy.sand-scorpion", quantity: null },
      { enemyId: "enemy.zuu", quantity: null },
    ],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [cleyraBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["This room group includes Sand Scorpion in addition to the recurring Trunk enemies. Falling into a pit and failing to jump out triggers a separate forced Sand Scorpion battle, recorded below."],
  },
  {
    id: "encounter.cleyra-trunk.quicksand-pit.sand-scorpion",
    title: "Quicksand pit — forced Sand Scorpion",
    chapterId: cleyraChapterId,
    location: "A quicksand pit when Zidane fails to jump out",
    kind: "fixed",
    formation: [{ enemyId: "enemy.sand-scorpion", quantity: 1 }],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is a fixed recovery battle, not a random formation. Victory returns Zidane to a previous area; the pool may be avoided by jumping out of the pit."],
  },
  {
    id: "encounter.cleyra-trunk.return.whirlpool-soldiers",
    title: "Trunk return — whirlpool soldiers",
    chapterId: cleyraChapterId,
    location: "Dormant whirlpool room during the post-Antlion return",
    kind: "fixed",
    formation: [{ enemyId: "enemy.soldier-a", quantity: 2 }],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is a forced Alexandrian Soldier encounter. Some walkthroughs leave its count unspecified while others describe a pair; the recorded pair follows the latter reports and remains pending direct game verification. The roster uses the Cleyra Soldier (A) record."],
  },
  {
    id: "encounter.cleyra-trunk.return.sand-pit-soldiers",
    title: "Trunk return — soldiers near the sand pits",
    chapterId: cleyraChapterId,
    location: "Path beyond the dormant quicksand pits during the post-Antlion return",
    kind: "fixed",
    formation: [{ enemyId: "enemy.soldier-a", quantity: 2 }],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The return route identifies a fixed pair of Cleyra Soldiers. Some walkthroughs describe only another soldier battle without printing its count."],
  },
  {
    id: "encounter.cleyra-trunk.return.bridge-cave-soldiers",
    title: "Trunk return — bridge cave soldiers",
    chapterId: cleyraChapterId,
    location: "Cave immediately before the bridge scene during the post-Antlion return",
    kind: "fixed",
    formation: [{ enemyId: "enemy.soldier-a", quantity: 2 }],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The return route identifies a final fixed pair of Cleyra Soldiers before the bridge cutscene returns the party to town."],
  },
  {
    id: "encounter.cleyra-assault.entrance-type-b",
    title: "Cleyra assault — entrance Type B",
    chapterId: cleyraChapterId,
    location: "Settlement entrance, immediately after the party returns from the Trunk",
    kind: "fixed",
    formation: [{ enemyId: "enemy.type-b", quantity: 1 }],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This fixed Type B battle begins the settlement assault sequence and occurs before the Mognet letter check."],
  },
  {
    id: "encounter.cleyra-assault.first-soldiers",
    title: "Cleyra assault — first three Soldiers",
    chapterId: cleyraChapterId,
    location: "Settlement stairs after returning from Mopli's letter check",
    kind: "fixed",
    formation: [{ enemyId: "enemy.soldier-a", quantity: 3 }],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The assault walkthrough gives this fixed fight as three Cleyra Soldiers."],
  },
  {
    id: "encounter.cleyra-assault.first-type-b-pair",
    title: "Cleyra assault — first Type B pair",
    chapterId: cleyraChapterId,
    location: "Settlement stairs, immediately after the first three-Soldier fight",
    kind: "fixed",
    formation: [{ enemyId: "enemy.type-b", quantity: 2 }],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is a separate fixed battle against two Type B enemies."],
  },
  {
    id: "encounter.cleyra-assault.soldiers-and-type-b",
    title: "Cleyra assault — Soldiers and Type B",
    chapterId: cleyraChapterId,
    location: "Upper settlement route after the left evacuation choice",
    kind: "fixed",
    formation: [
      { enemyId: "enemy.soldier-a", quantity: 2 },
      { enemyId: "enemy.type-b", quantity: 1 },
    ],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The fixed encounter has two Cleyra Soldiers and one Type B enemy."],
  },
  {
    id: "encounter.cleyra-assault.final-soldiers",
    title: "Cleyra assault — final three Soldiers",
    chapterId: cleyraChapterId,
    location: "Bridge route after directing residents to cross to the right",
    kind: "fixed",
    formation: [{ enemyId: "enemy.soldier-a", quantity: 3 }],
    sourceIds: cleyraEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This final fixed Soldier group precedes the Cathedral lawn and the survivor rewards."],
  },
  {
    id: "encounter.cleyra.antlion",
    title: "Antlion — Cleyra settlement boss",
    chapterId: cleyraChapterId,
    location: "Sandpit beside the settlement entrance after the Cathedral and Inn scenes",
    kind: "boss",
    formation: [{ enemyId: "enemy.antlion-cleyra", quantity: 1 }],
    sourceIds: cleyraBossSources,
    objectiveIds: [cleyraAntlionStealsObjectiveId],
    missableIds: [cleyraAntlionStealsMissableId],
    cutoffIds: [cleyraAntlionStealsCutoffId],
    notes: ["The one-time fight has three named steals and a separate Always Annoyntment drop. The steal objective, missable warning, cutoff, and existing item paths are linked on the boss record."],
  },
  {
    id: "encounter.cleyra.beatrix",
    title: "Beatrix — Cleyra settlement boss",
    chapterId: cleyraChapterId,
    location: "Outside the Cathedral after the evacuation and survivor rewards",
    kind: "boss",
    formation: [{ enemyId: "enemy.beatrix-cleyra", quantity: 1 }],
    sourceIds: cleyraBossSources,
    objectiveIds: [cleyraBeatrixStealsObjectiveId],
    missableIds: [cleyraBeatrixStealsMissableId],
    cutoffIds: [cleyraBeatrixStealsCutoffId],
    notes: ["This one-time battle ends after ten turns or when Beatrix reaches 0 HP; Stock Break reduces the party to 1 HP at the end. The safe route prioritizes survival and selected steals."],
  },
];

const returnToAlexandriaEncounters: EnemyEncounter[] = [
  {
    id: "encounter.return-to-alexandria.beatrix",
    title: "Beatrix — third battle in Alexandria Castle",
    chapterId: returnToAlexandriaChapterId,
    location: "Upper circular path after Mosh's Chapel letter and before the party split",
    kind: "boss",
    formation: [{ enemyId: "enemy.beatrix-alexandria", quantity: 1 }],
    sourceIds: alexandriaBeatrixBossSources,
    objectiveIds: [alexandriaBeatrixStealsObjectiveId],
    missableIds: [alexandriaBeatrixStealsMissableId],
    cutoffIds: [alexandriaBeatrixStealsCutoffId],
    notes: ["GameFAQs lists Phoenix Down, Ice Brand, and Survival Vest in this battle's steal table. Its walkthrough says the fight ends at 0 HP or Beatrix's tenth turn; no exact steal rates are modeled."],
  },
  {
    id: "encounter.return-to-alexandria.ralvuimago",
    title: "Ralvuimago — return Gargant boss",
    chapterId: returnToAlexandriaChapterId,
    location: "Gargan Roo return ride from Alexandria toward Pinnacle Rocks",
    kind: "boss",
    formation: [{ enemyId: "enemy.ralvuimago", quantity: 1 }],
    sourceIds: ralvuimagoSources,
    objectiveIds: [ralvuimagoStealsObjectiveId],
    missableIds: [ralvuimagoStealsMissableId],
    cutoffIds: [ralvuimagoStealsCutoffId],
    notes: ["This is the separate return-ride boss fought by Zidane, Dagger, and Vivi after the Alexandria escape. Ralvuimago is distinct from the outbound Ralvurahva encounter; its steals link to the existing warning, cutoff, and item recovery paths."],
  },
];

const tantarianEncounters: EnemyEncounter[] = [
  {
    id: "encounter.tantarian.disc-2-library",
    title: "Tantarian — timed Disc II library opportunity",
    chapterId: returnToAlexandriaChapterId,
    location: "Alexandria Castle's left library during the 30-minute rescue sequence",
    kind: "boss",
    formation: [{ enemyId: "enemy.tantarian", quantity: 1 }],
    sourceIds: ["gamefaqs-return-to-alexandria-71891", "gamerguides-alexandria-castle-2", "jegged-return-to-alexandria-castle"],
    objectiveIds: [tantarianObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is the first of two story opportunities. Defeating Tantarian here prevents its later Disc III encounter; skipping it preserves the final library chance."],
  },
  {
    id: "encounter.tantarian.disc-3-library",
    title: "Tantarian — final Disc III library opportunity",
    chapterId: homeFrontChapterId,
    location: "Alexandria Castle's left library before following Dagger to the altar",
    kind: "boss",
    formation: [{ enemyId: "enemy.tantarian", quantity: 1 }],
    sourceIds: tantarianSources,
    objectiveIds: [tantarianObjectiveId],
    missableIds: [tantarianMissableId],
    cutoffIds: [tantarianCutoffId],
    notes: ["This is the final chance if the Disc II encounter was skipped. Leaving the library for the tower closes this window; the two story appearances are alternatives, not two rewards on one save."],
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

const cargoShipEncounters: EnemyEncounter[] = [
  {
    id: "encounter.cargo-ship.black-waltz-3",
    title: "Black Waltz 3 — Cargo Ship battle",
    chapterId: cargoShipChapterId,
    location: "Cargo Ship deck after the cockpit scenes",
    kind: "boss",
    formation: [{ enemyId: "enemy.black-waltz-3-cargo-ship", quantity: 1 }],
    sourceIds: cargoShipEnemySources,
    objectiveIds: [cargoShipBlackWaltzStealsObjectiveId],
    missableIds: [cargoShipBlackWaltzStealsMissableId],
    cutoffIds: [cargoShipBlackWaltzStealsCutoffId],
    notes: ["This is the first Black Waltz 3 fight, aboard the Cargo Ship. The later South Gate train-car battle has different stats and steal items and is modeled as a separate encounter."]
  },
];

const trenoGriffinEncounters: EnemyEncounter[] = [
  {
    id: "encounter.treno.griffin-challenge",
    title: "Griffin — Treno Knight's House arena challenge",
    chapterId: trenoChapterId,
    location: "Basement arena beneath Treno's Knight's House/Weapon Shop, first visit",
    kind: "boss",
    formation: [{ enemyId: "enemy.griffin-treno-arena", quantity: 1 }],
    sourceIds: trenoGriffinSources,
    objectiveIds: [trenoGriffinObjectiveId, "disc-2.tonberry-card"],
    missableIds: [trenoGriffinMissableId],
    cutoffIds: [trenoGriffinCutoffId],
    notes: ["A single active character fights alone. The fixed Tonberry Card reward is tracked separately from recovery of the card type; the arena Griffin is distinct from ordinary field Griffin encounters."],
  },
];

const summitStationEncounters: EnemyEncounter[] = [
  {
    id: "encounter.summit-station.black-waltz-3-rematch",
    title: "Black Waltz 3 — Summit Station rematch",
    chapterId: summitStationChapterId,
    location: "Cable car between Summit Station and Alexandria Station",
    kind: "boss",
    formation: [{ enemyId: "enemy.black-waltz-3-rematch", quantity: 1 }],
    sourceIds: summitStationEnemySources,
    objectiveIds: [summitStationBlackWaltzStealsObjectiveId],
    missableIds: [summitStationBlackWaltzStealsMissableId],
    cutoffIds: [summitStationBlackWaltzStealsCutoffId],
    notes: ["This is Black Waltz 3's Disc II rematch, separate from the earlier Cargo Ship boss encounter. The one-time steal window closes when the battle ends."],
  },
];

const bentiniHeightsEncounters: EnemyEncounter[] = [
  {
    id: "encounter.bentini-heights.world-map-pool",
    title: "Bentini Heights world-map encounters",
    chapterId: summitStationChapterId,
    location: "Mist Continent world map around Treno, beyond South Gate",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.carve-spider", quantity: null },
      { enemyId: "enemy.mu", quantity: null },
      { enemyId: "enemy.ladybird", quantity: null },
      { enemyId: "enemy.mandragora", quantity: null },
      { enemyId: "enemy.trick-sparrow", quantity: null },
    ],
    sourceIds: bentiniHeightsEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs lists Mu, Mandragora, and Trick Sparrow for Bentini Heights; Jegged's broader Treno-area list also names Carve Spider and Ladybird. The friendly Ghost is a sidequest visitor, not a hostile random encounter. Exact formations and encounter rates are not published."],
  },
];

const garganRooEncounters: EnemyEncounter[] = [
  {
    id: "encounter.gargan-roo.random-pool",
    title: "Gargan Roo random encounters",
    chapterId: garganRooChapterId,
    location: "Gargan Roo tunnel",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.crawler", quantity: null },
      { enemyId: "enemy.dragonfly", quantity: null },
    ],
    sourceIds: garganRooEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The sources identify Crawler and Dragonfly as the area roster but do not establish exact formation rates here. Quina is absent from the temporary Dagger/Steiner/Marcus party, so Dragonfly's Matra Magic should be learned earlier in Cleyra if desired."],
  },
  {
    id: "encounter.gargan-roo.ralvurahva",
    title: "Ralvurahva — outbound Gargant boss",
    chapterId: garganRooChapterId,
    location: "Outbound Gargant ride from Gargan Roo toward Alexandria",
    kind: "boss",
    formation: [{ enemyId: "enemy.ralvurahva", quantity: 1 }],
    sourceIds: garganRooBossSources,
    objectiveIds: [garganRooRalvurahvaObjectiveId],
    missableIds: [garganRooRalvurahvaMissableId],
    cutoffIds: [garganRooRalvurahvaCutoffId],
    notes: ["This is the one-time outbound fight before the party reaches Alexandria. Ralvurahva escapes at 0 HP, so finish any selected steals before attacking it down."],
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
    id: "encounter.qus-marsh.outer-continent-disc-ii-pool",
    title: "Qu's Marsh — Outer Continent Disc II encounters",
    chapterId: outerContinentMarshChapterId,
    location: "The second Qu's Marsh on the Outer Continent, reached after the Fossil Roo exit",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.sahagin", quantity: null },
      { enemyId: "enemy.gigan-toad-b", quantity: null },
    ],
    sourceIds: outerContinentMarshSources,
    objectiveIds: ["disc-2.journey-to-outer-continent.quina-rejoin", "disc-2.journey-to-outer-continent.frog-catching", outerContinentMarshBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["Keep this Outer Continent pool separate from the Disc I Lindblum Basin marsh: its roster is Sahagin and Gigan Toad [B], not Axolotl and Gigan Toad [A]. Quina rejoins before reaching the required Fossil Roo route, so Eat opportunities are available here; no encounter rates or fixed formation counts are inferred."],
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

const outerContinentEncounters: EnemyEncounter[] = [
  {
    id: "encounter.outer-continent.dirt-pool",
    title: "Outer Continent — dirt terrain encounters",
    chapterId: outerContinentChapterId,
    location: "Dirt at Donna Plains, Dyshnose Shores, Gegalrich Shores, and Kognish Shores",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.cactuar", quantity: null },
      { enemyId: "enemy.goblin-mage", quantity: null },
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.zaghnol-b", quantity: null },
    ],
    sourceIds: outerContinentEncounterSources,
    objectiveIds: [outerContinentBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The source lists the same terrain roster at all four named regions. Goblin Mage appears in one- and two-enemy formations; this pool records roster membership without inferring rates or that every listed enemy appears together."],
  },
  {
    id: "encounter.outer-continent.grass-pool",
    title: "Outer Continent — grass terrain encounters",
    chapterId: outerContinentChapterId,
    location: "Grass at Donna Plains and Gegalrich Shores",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.goblin-mage", quantity: null },
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.friendly-ladybird", quantity: null },
      { enemyId: "enemy.zaghnol-b", quantity: null },
    ],
    sourceIds: outerContinentEncounterSources,
    objectiveIds: [outerContinentBlueMagicObjectiveId, outerContinentFriendlyLadybugObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["Ladybird (F) is the special Friendly Ladybird encounter, not the ordinary Ladybird combat record. The terrain table lists Goblin Mage in one- and two-enemy formations; encounter rates are not modeled."],
  },
  {
    id: "encounter.outer-continent.marsh-pool",
    title: "Outer Continent — marsh terrain encounters",
    chapterId: outerContinentChapterId,
    location: "Marsh terrain at Donna Plains",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.zaghnol-b", quantity: null },
    ],
    sourceIds: outerContinentEncounterSources,
    objectiveIds: [outerContinentBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The Out1 terrain table lists only Griffin and Zaghnol in Donna Plains marsh encounters; this does not include the separate Qu's Marsh pond encounters."],
  },
  {
    id: "encounter.outer-continent.forest-pool",
    title: "Outer Continent — world-map forest encounters",
    chapterId: outerContinentChapterId,
    location: "Forest terrain at Donna Plains, Dyshnose Shores, and Kognish Shores",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.friendly-ladybird", quantity: null },
      { enemyId: "enemy.zaghnol-b", quantity: null },
    ],
    sourceIds: outerContinentEncounterSources,
    objectiveIds: [outerContinentBlueMagicObjectiveId, outerContinentFriendlyLadybugObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The terrain table lists Griffin, Ladybird (F), and Zaghnol in these world-map forests. The Dead Forest field area is a separate encounter location and is not included."],
  },
  {
    id: "encounter.outer-continent.beach-pool",
    title: "Outer Continent — beach encounters",
    chapterId: outerContinentChapterId,
    location: "Beaches at Dyshnose Shores, Gegalrich Shores, and Kognish Shores",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.zaghnol-b", quantity: null },
    ],
    sourceIds: outerContinentEncounterSources,
    objectiveIds: [outerContinentBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The source lists a Griffin and/or Zaghnol formation on each named beach. No encounter rates are inferred."],
  },
  {
    id: "encounter.magdalene-forest.outer-forest-pool",
    title: "Magdalene Forest — world-map forest encounters",
    chapterId: magdaleneForestChapterId,
    location: "Forest terrain outside the Dead Forest field area",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.friendly-ladybird", quantity: null },
      { enemyId: "enemy.zaghnol-b", quantity: null },
    ],
    sourceIds: outerContinentEncounterSources,
    objectiveIds: [outerContinentBlueMagicObjectiveId, outerContinentFriendlyLadybugObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is the Outer Continent world-map forest table for Magdalene Forest. The similarly named Dead Forest is an interior field area with a different roster."],
  },
];

const forgottenContinentFieldEncounters: EnemyEncounter[] = [
  {
    id: "encounter.forgotten-continent.blairsurpass-dirt-pool",
    title: "Blairsurpass Plains — dirt terrain encounters",
    chapterId: forgottenContinentChapterId,
    location: "Dirt terrain on Blairsurpass Plains",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.cactuar", quantity: null },
      { enemyId: "enemy.catoblepas", quantity: null },
      { enemyId: "enemy.jabberwock", quantity: null },
    ],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List gives separate dirt formations with one Armstrong, three or four Cactuars, one Catoblepas, or two ordinary Jabberwocks. This records species membership without inventing encounter rates; its formation counts are retained here as source notes."],
  },
  {
    id: "encounter.forgotten-continent.blairsurpass-mountain-pool",
    title: "Blairsurpass Plains — mountain terrain encounters",
    chapterId: forgottenContinentChapterId,
    location: "Mountain terrain on Blairsurpass Plains",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.catoblepas", quantity: null },
    ],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List reports one Armstrong or one Catoblepas in this terrain table. Exact encounter odds are not listed."],
  },
  {
    id: "encounter.forgotten-continent.blairsurpass-grass-pool",
    title: "Blairsurpass Plains — grass terrain encounters",
    chapterId: forgottenContinentChapterId,
    location: "Grass terrain on Blairsurpass Plains",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.armstrong", quantity: null }],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List reports a single Armstrong formation in this terrain table. Exact encounter odds are not listed."],
  },
  {
    id: "encounter.forgotten-continent.blairsurpass-forest-pool",
    title: "Blairsurpass Plains — forest encounters",
    chapterId: forgottenContinentChapterId,
    location: "Forest terrain on Blairsurpass Plains",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.friendly-jabberwock", quantity: null },
    ],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId, "disc-3.forgotten-continent.jabberwock"],
    missableIds: [],
    cutoffIds: [],
    notes: ["The terrain table names one Armstrong and Jabberwock (F). The friendly form is the Emerald-feeding sidequest encounter, not the hostile Jabberwock from dirt terrain."],
  },
  {
    id: "encounter.forgotten-continent.blairsurpass-marsh-pool",
    title: "Blairsurpass Plains — marsh encounter",
    chapterId: forgottenContinentChapterId,
    location: "Marsh terrain on Blairsurpass Plains, outside Qu's Marsh",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.adamantoise", quantity: null }],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: ["disc-3.forgotten-continent.earth-shake"],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List reports Adamantoise in the overworld marsh. This is separate from the adjacent Qu's Marsh pond and its frog-catching encounters."],
  },
  {
    id: "encounter.forgotten-continent.seaways-dirt-pool",
    title: "Seaways Canyon — dirt terrain encounters",
    chapterId: forgottenContinentChapterId,
    location: "Dirt terrain in Seaways Canyon",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.cactuar", quantity: null },
      { enemyId: "enemy.catoblepas", quantity: null },
      { enemyId: "enemy.jabberwock", quantity: null },
    ],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List gives separate dirt formations with one Armstrong, three or four Cactuars, one Catoblepas, or two ordinary Jabberwocks. This records the listed roster and preserves the formation counts in source notes, without estimating rates."],
  },
  {
    id: "encounter.forgotten-continent.seaways-sunrise-dirt-pool",
    title: "Seaways Canyon — Sunrise dirt encounters",
    chapterId: forgottenContinentChapterId,
    location: "The Sunrise-labeled dirt terrain in Seaways Canyon",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.adamantoise", quantity: null },
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.cactuar", quantity: null },
      { enemyId: "enemy.catoblepas", quantity: null },
    ],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: ["disc-3.forgotten-continent.earth-shake", forgottenContinentBlueMagicRecoveryObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List separates this Sunrise-labeled table from Seaways Canyon dirt and lists Adamantoise, Armstrong, three or four Cactuars, and Catoblepas. The source's label is preserved without inferring what triggers the distinction."],
  },
  {
    id: "encounter.forgotten-continent.seaways-mountain-pool",
    title: "Seaways Canyon — mountain terrain encounters",
    chapterId: forgottenContinentChapterId,
    location: "Mountain terrain in Seaways Canyon",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.catoblepas", quantity: null },
    ],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List reports one Armstrong or one Catoblepas in this terrain table. Exact encounter odds are not listed."],
  },
  {
    id: "encounter.forgotten-continent.seaways-grass-pool",
    title: "Seaways Canyon — grass terrain encounters",
    chapterId: forgottenContinentChapterId,
    location: "Grass terrain in Seaways Canyon",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.armstrong", quantity: null }],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List reports a single Armstrong formation in this terrain table. Exact encounter odds are not listed."],
  },
  {
    id: "encounter.forgotten-continent.seaways-sunrise-grass-pool",
    title: "Seaways Canyon — Sunrise grass encounters",
    chapterId: forgottenContinentChapterId,
    location: "The Sunrise-labeled grass terrain in Seaways Canyon",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.friendly-jabberwock", quantity: null },
    ],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId, "disc-3.forgotten-continent.jabberwock"],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List names one Armstrong and Jabberwock (F). It prints this as a separate Sunrise-labeled terrain table; the friendly Jabberwock remains distinct from the hostile form."],
  },
  {
    id: "encounter.forgotten-continent.seaways-forest-pool",
    title: "Seaways Canyon — forest encounters",
    chapterId: forgottenContinentChapterId,
    location: "Forest terrain in Seaways Canyon",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.friendly-jabberwock", quantity: null },
    ],
    sourceIds: forgottenContinentEncounterSources,
    objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId, "disc-3.forgotten-continent.jabberwock"],
    missableIds: [],
    cutoffIds: [],
    notes: ["The older GameFAQs Monster List names one Armstrong and Jabberwock (F) in the forest table. The friendly creature's quest encounter is not a hostile battle."],
  },
];

const mountainPathEncounters: EnemyEncounter[] = [
  {
    id: "encounter.conde-petie-mountain-path.random-pool",
    title: "Conde Petie Mountain Path random encounters",
    chapterId: mountainPathChapterId,
    location: "Mountain Path screens before and after the Hilgigars fork",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.gnoll", quantity: null },
      { enemyId: "enemy.ochu", quantity: null },
      { enemyId: "enemy.troll", quantity: null },
    ],
    sourceIds: ["gamefaqs-conde-petie-mountain-path-71891", enemyListSourceId],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs lists Gnoll, Ochu, and Troll for the path. The reference table does not establish exact formations or encounter frequencies."],
  },
  {
    id: "encounter.conde-petie-mountain-path.hilgigars",
    title: "Hilgigars — Mountain Path boss",
    chapterId: mountainPathChapterId,
    location: "Upper root path west of Suzuna and Stiltzkin",
    kind: "boss",
    formation: [{ enemyId: "enemy.hilgigars", quantity: 1 }],
    sourceIds: ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path", "gamerguides-conde-petie-mountain-path"],
    objectiveIds: [hilgigarsStealsObjectiveId],
    missableIds: [hilgigarsStealsMissableId],
    cutoffIds: [hilgigarsStealsCutoffId],
    notes: ["Hilgigars' three steal targets link to the existing one-fight warning and item acquisition paths. Published drop tables differ, so the record preserves the GameFAQs table with the Jegged prose disagreement noted."],
  },
  {
    id: "encounter.conde-petie-mountain-path.lucid-plains-pool",
    title: "Lucid Plains world-map encounters",
    chapterId: mountainPathChapterId,
    location: "World-map grass and forest approach between the Mountain Path exit and Madain Sari",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.blazer-beetle", quantity: null },
      { enemyId: "enemy.goblin-mage", quantity: null },
      { enemyId: "enemy.troll", quantity: null },
    ],
    sourceIds: ["gamefaqs-conde-petie-mountain-path-71891", "gamefaqs-monster-list-20490", enemyListSourceId],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The route lists Blazer Beetle, Goblin Mage, and Troll on Lucid Plains; the older monster list and enemy table supply the combat entries. This roster does not imply exact formations or rates."],
  },
  {
    id: "encounter.conde-petie-mountain-path.friendly-yeti",
    title: "Friendly Yeti — Lucid Plains",
    chapterId: mountainPathChapterId,
    location: "Forest terrain on Lucid Plains",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.friendly-yeti", quantity: null }],
    sourceIds: friendlyYetiSources,
    objectiveIds: [mountainPathFriendlyYetiObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is the optional Friendly Creature encounter, separate from the ordinary Yeti battle record. Feed it 2 Ore for 20 AP and an Elixir; encounter odds are not modeled."],
  },
];

const pualeiPlainsEncounters: EnemyEncounter[] = [
  {
    id: "encounter.journey-to-iifa-tree.pualei-plains-pool",
    title: "Pualei Plains world-map encounters",
    chapterId: pualeiPlainsChapterId,
    location: "World-map grass and forest terrain between the Mountain Path exit and Iifa Tree",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.blazer-beetle", quantity: null },
      { enemyId: "enemy.goblin-mage", quantity: null },
      { enemyId: "enemy.troll", quantity: null },
    ],
    sourceIds: pualeiPlainsEncounterSources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The Disc II route lists Blazer Beetle, Gnoll, Goblin Mage, Ochu, and Troll across the return trip. The Mountain Path group separately accounts for Gnoll, Ochu, and Troll; the Pualei Plains roster is Blazer Beetle, Goblin Mage, and Troll. Sources do not establish exact formations, encounter rates, or terrain-specific sub-pools."],
  },
  {
    id: "encounter.journey-to-iifa-tree.friendly-nymph",
    title: "Friendly Nymph — Pualei Plains",
    chapterId: pualeiPlainsChapterId,
    location: "Forest terrain beside the Mountain Path exit on Pualei Plains",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.friendly-nymph", quantity: null }],
    sourceIds: pualeiFriendlyNymphSources,
    objectiveIds: [pualeiFriendlyNymphObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is the non-hostile Friendly Creature encounter, separate from ordinary Nymph and from the plains battle pool. Give it 3 Ore for 30 AP and an Emerald; the forest location is required."],
  },
];

const madainSariEncounters: EnemyEncounter[] = [
  {
    id: "encounter.madain-sari.banyano-shores-pool",
    title: "Banyano Shores world-map encounter",
    chapterId: madainSariChapterId,
    location: "World map — Banyano Shores near Madain Sari",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.blazer-beetle", quantity: null }],
    sourceIds: banyanoShoresEnemySources,
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: [
      "RPGClassics' bestiary explicitly places Blazer Beetle on Banyano Shores as well as Pualei Plains. This is a location-specific record, separate from the Lucid Plains and Pualei Plains route pools.",
      "The source confirms Blazer Beetle at this location but does not establish a complete shoreline roster, encounter formations, or rates.",
    ],
  },
];

const desertPalaceEncounters: EnemyEncounter[] = [
  {
    id: "encounter.desert-palace.random-pool",
    title: "Desert Palace ordinary encounters",
    chapterId: desertPalaceChapterId,
    location: "Cid's dock area and the Desert Palace chambers",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.drakan", quantity: null },
      { enemyId: "enemy.grimlock", quantity: null },
      { enemyId: "enemy.ogre", quantity: null },
      { enemyId: "enemy.torama", quantity: null },
    ],
    sourceIds: desertPalaceEnemySources,
    objectiveIds: [desertPalaceBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs and Jegged list Drakan, Grimlock, Ogre, and Torama in the palace. The older PAL monster table lists 1 or 2 Drakan, 2 Grimlocks, 1 or 2 Ogres, and 1 or 2 Toramas; this record keeps the area roster together and does not infer encounter rates or chamber-specific availability. Valia Pira is modeled separately as the scripted boss."],
  },
  {
    id: "encounter.desert-palace.valia-pira",
    title: "Valia Pira — Desert Palace security system",
    chapterId: desertPalaceChapterId,
    location: "Upper Shadow Chamber after the final candle is lit",
    kind: "boss",
    formation: [{ enemyId: "enemy.valia-pira", quantity: 1 }],
    sourceIds: desertPalaceBossSources,
    objectiveIds: [valiaPiraObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is the scripted boss battle after the palace candle puzzle, separate from the four ordinary enemy types."],
  },
];

const desertPalaceEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.drakan",
    name: "Drakan",
    encounterIds: ["encounter.desert-palace.random-pool"],
    stats: sourcedStats([["level", 30], ["HP", 3292], ["MP", 1018], ["EXP", 0], ["AP", 0], ["Gil", 0]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("uncommon", "game-item.antidote", [enemyListSourceId]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", null, [enemyListSourceId], "Sapphire"),
      sourcedLoot("uncommon", "game-item.phoenix-down", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    facts: [
      sourcedFact("type", "Aerial and Demon", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Wind", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "Earth (nullifies)", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Mind Blast", [enemyListSourceId], "Deals damage and can inflict Confuse."),
      sourcedFact("attack", "Bio, Freeze, Mustard Bomb, Reflect, and Vanish", [enemyListSourceId]),
    ],
    blueMagic: [{ name: "Vanish", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [desertPalaceBlueMagicObjectiveId] }],
    strategies: [{ title: "Eat Drakan for Vanish", detail: "If Quina is in the selected Desert Palace party and still needs Vanish, use Eat before defeating Drakan. Mind Blast can damage and confuse one target; Wind is listed as a weakness and Earth is nullified.", sourceIds: desertPalaceEnemySources }],
    routeObjectiveIds: [desertPalaceBlueMagicObjectiveId],
    notes: ["The GameFAQs Enemy List reports no EXP, AP, or Gil for Drakan. Its card drop is Stroper, outside this bestiary's item-loot fields."],
  }, desertPalaceChapterId, desertPalaceEnemySources),
  chapterEnemy({
    id: "enemy.grimlock",
    name: "Grimlock",
    encounterIds: ["encounter.desert-palace.random-pool"],
    stats: sourcedStats([["level", 30], ["HP", 3292], ["MP", 1018], ["EXP", 6610], ["AP", 2], ["Gil", 1363]], [enemyListSourceId]),
    steals: [
      { ...sourcedLoot("common", "game-item.ore", [enemyListSourceId]), note: "Physical red-top form; the magical blue-top form lists Hi-Potion." },
      { ...sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId]), note: "Physical red-top form; the magical blue-top form lists Nothing." },
      { ...sourcedLoot("semi-rare", "game-item.ether", [enemyListSourceId]), note: "Physical red-top form; the magical blue-top form lists Nothing." },
      { ...sourcedLoot("rare", null, [enemyListSourceId], "Nothing"), note: "Physical red-top form; the magical blue-top form lists Ether." },
    ],
    drops: [
      { ...sourcedLoot("always", null, [enemyListSourceId], "Nothing"), note: "Physical red-top form; the magical blue-top form lists Topaz." },
      { ...sourcedLoot("common", "game-item.phoenix-down", [enemyListSourceId]), note: "Physical red-top form; the magical blue-top form lists Nothing." },
      { ...sourcedLoot("uncommon", "game-item.ether", [enemyListSourceId]), note: "Physical red-top form; the magical blue-top form lists Nothing." },
      { ...sourcedLoot("rare", null, [enemyListSourceId], "Nothing"), note: "The source lists Nothing for both forms." },
    ],
    facts: [
      sourcedFact("elemental-weakness", "Fire, Ice, and Lightning", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "The physical red-top form attacks physically and is vulnerable to magic; the magical blue-top form casts Silence, Sleep, Slow, and Stop and is vulnerable to physical attacks.", [enemyListSourceId]),
    ],
    blueMagic: [{ name: "Night", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [desertPalaceBlueMagicObjectiveId] }],
    strategies: [{ title: "Match attacks to Grimlock's form", detail: "Use magic against the physical red-top form and physical attacks against the magical blue-top form. Quina can use Eat for Night; the source reports different steal and drop tables for the two forms.", sourceIds: desertPalaceEnemySources }],
    routeObjectiveIds: [desertPalaceBlueMagicObjectiveId],
    notes: ["Stats are shared by both forms. Loot rows above show the physical red-top form; each row's note records the corresponding magical blue-top result so the two variant tables are not merged."],
  }, desertPalaceChapterId, desertPalaceEnemySources),
  chapterEnemy({
    id: "enemy.ogre",
    name: "Ogre",
    encounterIds: ["encounter.desert-palace.random-pool"],
    stats: sourcedStats([["level", 29], ["HP", 3300], ["MP", 966], ["EXP", 5151], ["AP", 2], ["Gil", 1281]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", "game-item.annoyntment", [enemyListSourceId]),
      sourcedLoot("uncommon", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("semi-rare", "game-item.phoenix-pinion", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.phoenix-down", [enemyListSourceId]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Flame", [enemyListSourceId], "Fire-elemental damage to the whole party."),
      sourcedFact("attack", "Knife and Trouble Knife", [enemyListSourceId], "Physical damage; Trouble Knife can inflict Trouble."),
    ],
    blueMagic: [{ name: "Matra Magic", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [desertPalaceBlueMagicObjectiveId] }],
    strategies: [{ title: "Eat Ogre for Matra Magic", detail: "If Quina needs Matra Magic, use Eat before defeating Ogre. It is level 29, so the palace guide's LV5 Death advice for the other level-30 enemies does not apply to Ogre.", sourceIds: desertPalaceEnemySources }],
    routeObjectiveIds: [desertPalaceBlueMagicObjectiveId],
    notes: ["GameFAQs lists Ogre as especially common near the dock area; the encounter record does not infer a numerical rate."],
  }, desertPalaceChapterId, desertPalaceEnemySources),
  chapterEnemy({
    id: "enemy.torama",
    name: "Torama",
    encounterIds: ["encounter.desert-palace.random-pool"],
    stats: sourcedStats([["level", 30], ["HP", 3292], ["MP", 1018], ["EXP", 5675], ["AP", 2], ["Gil", 1118]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("uncommon", "game-item.antidote", [enemyListSourceId]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", "game-item.phoenix-pinion", [enemyListSourceId]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", null, [enemyListSourceId], "Amethyst"),
      sourcedLoot("uncommon", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Beast and Demon", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Water", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "Lightning (absorbs)", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Blaster", [enemyListSourceId], "Can deal heavy damage and inflict Stop."),
    ],
    blueMagic: [{ name: "LV4 Holy", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [desertPalaceBlueMagicObjectiveId] }],
    strategies: [{ title: "Silence Torama and Eat for LV4 Holy", detail: "Torama is a spellcaster with no physical attacks; Silence prevents its spells. Use Eat if Quina still needs LV4 Holy. Water is its listed weakness and it absorbs Lightning.", sourceIds: desertPalaceEnemySources }],
    routeObjectiveIds: [desertPalaceBlueMagicObjectiveId],
    notes: ["The GameFAQs Enemy List identifies Silence as an effective way to stop Torama's spellcasting."],
  }, desertPalaceChapterId, desertPalaceEnemySources),
  chapterBoss({
    id: "enemy.valia-pira",
    name: "Valia Pira",
    encounterIds: ["encounter.desert-palace.valia-pira"],
    stats: [
      { field: "level", value: 36, sourceIds: desertPalaceBossTableSources, verification: "cross-checked" },
      { field: "HP", value: 12120, sourceIds: [...desertPalaceBossTableSources, "jegged-returning-desert-palace"], verification: "disputed" },
      { field: "MP", value: 9999, sourceIds: desertPalaceBossTableSources, verification: "cross-checked" },
      { field: "EXP", value: 0, sourceIds: desertPalaceBossTableSources, verification: "cross-checked" },
      { field: "AP", value: 11, sourceIds: desertPalaceBossTableSources, verification: "cross-checked" },
      { field: "Gil", value: 4089, sourceIds: desertPalaceBossTableSources, verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", null, desertPalaceBossTableSources, "Nothing"),
      sourcedLoot("uncommon", null, desertPalaceBossTableSources, "Nothing"),
      sourcedLoot("semi-rare", null, desertPalaceBossTableSources, "Nothing"),
      sourcedLoot("rare", null, desertPalaceBossTableSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.elixir", desertPalaceBossTableSources),
      sourcedLoot("common", "game-item.ether", desertPalaceBossTableSources),
      sourcedLoot("uncommon", "game-item.ether", desertPalaceBossTableSources),
      sourcedLoot("rare", "game-item.ether", desertPalaceBossTableSources),
    ],
    facts: [
      sourcedFact("type", "Aerial", desertPalaceBossTableSources),
      sourcedFact("elemental-weakness", "Wind", desertPalaceBossTableSources, "GameFAQs and the older PAL Monster List agree that Wind is a weakness."),
      sourcedFact("elemental-weakness", "Water (reported by GameFAQs)", ["gamefaqs-desert-palace-71891"], "The older PAL Monster List lists Water as normal; elemental weakness reporting is preserved source by source."),
      sourcedFact("elemental-resistance", "Earth (nullifies)", desertPalaceBossTableSources),
      sourcedFact("elemental-resistance", "All elements (nullifies while the Resist Elements bloodstone effect is active)", ["gamefaqs-desert-palace-71891"]),
      sourcedFact("status-vulnerability", "Darkness, Sleep, and Slow", desertPalaceBossTableSources),
      sourcedFact("attack", "Firaga, Blizzaga, Thundaga, Holy, Flare, Mustard Bomb (Heat), Freeze, and Reflect", desertPalaceBossTableSources),
    ],
    blueMagic: [],
    strategies: [
      { title: "Complete the six bloodstones before the fight", detail: "Collect the six palace stones before lighting the final candle; they suppress Valia Pira's opening enhancements. Protect the party from Heat and Freeze, and use Reflect or Carbuncle against its magic-focused offense.", sourceIds: desertPalaceBossSources },
      { title: "Optional MP-depletion win", detail: "The battle ends when Valia Pira's MP reaches zero. Quina can use Magic Hammer or Osmose if the party prefers this slower route.", sourceIds: ["gamefaqs-desert-palace-71891", "jegged-returning-desert-palace"] },
    ],
    routeObjectiveIds: [valiaPiraObjectiveId],
    notes: ["GameFAQs and the older PAL Monster List report 12,120 HP; Jegged reports 12,119, so the stat is marked disputed. The GameFAQs walkthrough reports both Wind and Water weakness, while the older PAL Monster List reports Wind weakness and Water as normal. Steal rows are all Nothing; the boss has an Elixir always-drop slot and Ether in the three chance-based drop slots."],
  }, desertPalaceChapterId, desertPalaceBossSources),
];

const ipsensCastleEncounters: EnemyEncounter[] = [
  {
    id: "encounter.ipsens-castle.initial-area-pool",
    title: "Ipsen's Castle initial-area encounters",
    chapterId: ipsensCastleChapterId,
    location: "Castle entrance and Kumool's room",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.agares", quantity: null },
      { enemyId: "enemy.cerberus", quantity: null },
      { enemyId: "enemy.gargoyle", quantity: null },
      { enemyId: "enemy.veteran", quantity: null },
    ],
    sourceIds: ipsensCastleEncounterSources,
    objectiveIds: [ipsensCastleBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs lists Agares, Cerberus, Gargoyle, and Veteran in the initial areas. This is a room-group roster; encounter odds and unlisted formations are not inferred."],
  },
  {
    id: "encounter.ipsens-castle.stairwell-lift-pool",
    title: "Ipsen's Castle stairwell and lift encounters",
    chapterId: ipsensCastleChapterId,
    location: "Ladder routes, fresco room, and lift approach",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.agares", quantity: null },
      { enemyId: "enemy.cerberus", quantity: null },
      { enemyId: "enemy.gargoyle", quantity: null },
      { enemyId: "enemy.tonberry", quantity: null },
      { enemyId: "enemy.veteran", quantity: null },
    ],
    sourceIds: ipsensCastleEncounterSources,
    objectiveIds: [ipsensCastleBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The route's Stairwell & Lift roster adds Tonberry. GameFAQs also names Taharka under this section, but its room text places the fixed boss after taking the mirrors in the mural room; the boss is modeled separately."],
  },
  {
    id: "encounter.ipsens-castle.mural-room-pool",
    title: "Ipsen's Castle mural-room encounters",
    chapterId: ipsensCastleChapterId,
    location: "Mural room before and after the Taharka fight",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.agares", quantity: null },
      { enemyId: "enemy.gargoyle", quantity: null },
      { enemyId: "enemy.tonberry", quantity: null },
      { enemyId: "enemy.veteran", quantity: null },
    ],
    sourceIds: ipsensCastleEncounterSources,
    objectiveIds: [ipsensCastleBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs lists Agares, Gargoyle, Tonberry, and Veteran in the Mural Room; Cerberus is not in this room's listed roster. Taharka is a separate fixed boss encounter."],
  },
  {
    id: "encounter.ipsens-castle.treasure-hunting-pool",
    title: "Ipsen's Castle treasure-route encounters",
    chapterId: ipsensCastleChapterId,
    location: "Trapdoor, upper lift, and chandelier treasure rooms",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.agares", quantity: null },
      { enemyId: "enemy.cerberus", quantity: null },
      { enemyId: "enemy.gargoyle", quantity: null },
      { enemyId: "enemy.tonberry", quantity: null },
      { enemyId: "enemy.veteran", quantity: null },
    ],
    sourceIds: ipsensCastleEncounterSources,
    objectiveIds: [ipsensCastleBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs lists the same five-enemy roster during treasure hunting. The records preserve the route's separate room group without asserting formation sizes or encounter rates."],
  },
  {
    id: "encounter.ipsens-castle.taharka",
    title: "Taharka — Ipsen's Castle mural guardian",
    chapterId: ipsensCastleChapterId,
    location: "Mural room when attempting to leave after collecting the four mirrors",
    kind: "boss",
    formation: [{ enemyId: "enemy.taharka", quantity: 1 }],
    sourceIds: ipsensCastleEnemySources,
    objectiveIds: [ipsensCastleMirrorsObjectiveId, ipsensTaharkaStealsObjectiveId, ipsensTaharkaRamuhCardObjectiveId],
    missableIds: [ipsensTaharkaStealsMissableId],
    cutoffIds: [ipsensTaharkaStealsCutoffId],
    notes: ["This one-time scripted fight begins after the four-mirror mural interaction; ordinary random encounters in the room are tracked separately."],
  },
];

const ipsensCastleEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.agares",
    name: "Agares",
    encounterIds: ["encounter.ipsens-castle.initial-area-pool", "encounter.ipsens-castle.stairwell-lift-pool", "encounter.ipsens-castle.mural-room-pool", "encounter.ipsens-castle.treasure-hunting-pool"],
    stats: sourcedStats([["level", 43], ["HP", 6775], ["MP", 1596], ["EXP", 14279], ["AP", 3], ["Gil", 1945]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", "game-item.tent", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.soft", [enemyListSourceId]),
      sourcedLoot("semi-rare", "game-item.ore", [enemyListSourceId]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", null, [enemyListSourceId], "Amethyst"),
      sourcedLoot("uncommon", "game-item.phoenix-down", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    facts: [
      sourcedFact("type", "Demon", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "None listed", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "None listed", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "-ra level magic, Freeze, Osmose, and Paper Storm", [enemyListSourceId], "GameFAQs describes these attacks after Agares revives an accompanying Gargoyle with Arise."),
    ],
    blueMagic: [],
    strategies: [{ title: "Stop Agares from reviving a Gargoyle", detail: "If an Agares and Gargoyle appear together, prioritize Agares before the Gargoyle can be revived; the Enemy List warns that Agares then adds -ra magic, Freeze, Osmose, and Paper Storm. Quina's Eat reports that Agares tastes bad.", sourceIds: ipsensCastleEnemySources }],
    routeObjectiveIds: [],
    notes: ["GameFAQs reports that Agares tastes bad to Quina and has a Ragtime Mouse card drop; neither is an item-loot row in this bestiary."],
  }, ipsensCastleChapterId, ipsensCastleEnemySources),
  chapterEnemy({
    id: "enemy.cerberus",
    name: "Cerberus",
    encounterIds: ["encounter.ipsens-castle.initial-area-pool", "encounter.ipsens-castle.stairwell-lift-pool", "encounter.ipsens-castle.treasure-hunting-pool"],
    stats: sourcedStats([["level", 44], ["HP", 6977], ["MP", 1623], ["EXP", 15181], ["AP", 3], ["Gil", 1984]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.opal", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.ether", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.opal", [enemyListSourceId]),
    ],
    facts: [
      sourcedFact("type", "Beast", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "None listed", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "None listed", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Flame", [enemyListSourceId], "Fire-elemental attack that removes 30% of the target's maximum HP."),
      sourcedFact("attack", "Firaga and Strike", [enemyListSourceId]),
    ],
    blueMagic: [{ name: "Auto-Life", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "jegged-ipsens-castle"], objectiveIds: [ipsensCastleBlueMagicObjectiveId] }],
    strategies: [{ title: "Learn Auto-Life if Quina still needs it", detail: "Use Eat on Cerberus before defeating it if Auto-Life is missing. Flame removes 30% of a target's maximum HP, so heal through that fixed damage alongside Firaga and Strike.", sourceIds: ipsensCastleEnemySources }],
    routeObjectiveIds: [ipsensCastleBlueMagicObjectiveId],
    notes: ["GameFAQs records Cerberus's card as Cerberus. Item drop slots follow the enemy table; no acquisition odds are inferred here."],
  }, ipsensCastleChapterId, ipsensCastleEnemySources),
  chapterEnemy({
    id: "enemy.gargoyle",
    name: "Gargoyle",
    encounterIds: ["encounter.ipsens-castle.initial-area-pool", "encounter.ipsens-castle.stairwell-lift-pool", "encounter.ipsens-castle.mural-room-pool", "encounter.ipsens-castle.treasure-hunting-pool"],
    stats: sourcedStats([["level", 44], ["HP", 6977], ["MP", 1628], ["EXP", 15181], ["AP", 3], ["Gil", 1958]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId]),
      sourcedLoot("semi-rare", "game-item.phoenix-pinion", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", null, [enemyListSourceId], "Sapphire"),
      sourcedLoot("uncommon", "game-item.phoenix-down", [enemyListSourceId]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Stone and Aerial", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Wind", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "Earth (nullifies)", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Darkness, KO, Silence, Sleep, and Slow", [enemyListSourceId]),
      sourcedFact("attack", "Break and Gradual Petrify", [enemyListSourceId]),
      sourcedFact("attack", "Charge and Aerial Slash", [enemyListSourceId]),
    ],
    blueMagic: [{ name: "Mighty Guard", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "jegged-ipsens-castle"], objectiveIds: [ipsensCastleBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Soft before it wakes", detail: "GameFAQs recommends Soft on a sleeping Gargoyle for an easy defeat. It can also use Break or Gradual Petrify; if Quina needs Mighty Guard, use Eat before finishing the enemy.", sourceIds: ipsensCastleEnemySources }],
    routeObjectiveIds: [ipsensCastleBlueMagicObjectiveId],
    notes: ["GameFAQs lists Gargoyle's card as Gargoyle."],
  }, ipsensCastleChapterId, ipsensCastleEnemySources),
  chapterEnemy({
    id: "enemy.tonberry",
    name: "Tonberry",
    encounterIds: ["encounter.ipsens-castle.stairwell-lift-pool", "encounter.ipsens-castle.mural-room-pool", "encounter.ipsens-castle.treasure-hunting-pool"],
    stats: [
      { field: "level", value: 46, sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z"], verification: "cross-checked" },
      { field: "HP", value: 7887, sourceIds: [enemyListSourceId], verification: "disputed" },
      { field: "HP", value: 7886, sourceIds: ["rpgclassics-bestiary-t-z"], verification: "disputed" },
      { field: "MP", value: 1779, sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z"], verification: "cross-checked" },
      { field: "EXP", value: 13297, sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z"], verification: "cross-checked" },
      { field: "AP", value: 4, sourceIds: [enemyListSourceId], verification: "single-source" },
      { field: "Gil", value: 1513, sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z"], verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.hi-potion", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("uncommon", "game-item.phoenix-down", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("semi-rare", "game-item.phoenix-pinion", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.peridot", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("uncommon", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
    ],
    facts: [
      sourcedFact("elemental-weakness", "None (GameFAQs listing)", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Ice (RPGClassics listing)", ["rpgclassics-bestiary-t-z"]),
      sourcedFact("elemental-resistance", "None listed", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "None listed", [enemyListSourceId]),
      sourcedFact("attack", "Knife and Everyone's Grudge", [enemyListSourceId], "Knife can deal 9,999 damage when the Tonberry reaches a character; Everyone's Grudge deals damage based on previously defeated Tonberries."),
    ],
    blueMagic: [],
    strategies: [{ title: "Defeat Tonberry before it reaches the party", detail: "Use strong attacks against Tonberry while it advances. If it reaches a character, Knife can deal 9,999 damage or Everyone's Grudge can scale with the number of Tonberries defeated. The sources disagree on HP by 1 and on whether Ice is a weakness.", sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z", "elitegrindlab-ipsens-castle"] }],
    routeObjectiveIds: [],
    notes: ["GameFAQs reports 7,887 HP and no elemental weakness; RPGClassics reports 7,886 HP and Ice weakness. Both source readings are retained. GameFAQs and RPGClassics list a Tonberry card drop; RPGClassics also lists Tonberry in Memoria, while this profile is scoped to its Ipsen encounter."],
  }, ipsensCastleChapterId, ipsensCastleEnemySources),
  chapterEnemy({
    id: "enemy.veteran",
    name: "Veteran",
    encounterIds: ["encounter.ipsens-castle.initial-area-pool", "encounter.ipsens-castle.stairwell-lift-pool", "encounter.ipsens-castle.mural-room-pool", "encounter.ipsens-castle.treasure-hunting-pool"],
    stats: [
      { field: "level", value: 44, sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z"], verification: "cross-checked" },
      { field: "HP", value: 6972, sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z"], verification: "cross-checked" },
      { field: "MP", value: 1672, sourceIds: [enemyListSourceId], verification: "disputed" },
      { field: "MP", value: 1627, sourceIds: ["rpgclassics-bestiary-t-z"], verification: "disputed" },
      { field: "EXP", value: 15181, sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z"], verification: "cross-checked" },
      { field: "AP", value: 3, sourceIds: [enemyListSourceId], verification: "single-source" },
      { field: "Gil", value: 1971, sourceIds: [enemyListSourceId, "rpgclassics-bestiary-t-z"], verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.hi-potion", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("uncommon", "game-item.ether", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("semi-rare", "game-item.phoenix-pinion", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.topaz", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("common", "game-item.phoenix-down", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("uncommon", "game-item.ether", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Aerial and Demon", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Wind, Water, and Holy", [enemyListSourceId, "rpgclassics-bestiary-t-z"]),
      sourcedFact("elemental-resistance", "Earth (nullifies); Lightning and Shadow damage halved", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Claw, Blaster, Doom, and Roulette", [enemyListSourceId]),
    ],
    blueMagic: [{ name: "Doom", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "jegged-ipsens-castle"], objectiveIds: [ipsensCastleBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Eat for Doom and protect against status attacks", detail: "If Quina still needs Doom, use Eat on Veteran before finishing it. Its attacks include Blaster, Doom, and Roulette; Wind, Water, and Holy are listed weaknesses, while Earth is nullified and Lightning and Shadow are halved.", sourceIds: ipsensCastleEnemySources }],
    routeObjectiveIds: [ipsensCastleBlueMagicObjectiveId],
    notes: ["GameFAQs reports 1,672 MP; RPGClassics reports 1,627 MP. Other shared listed stats agree, and both list Veteran as its card. RPGClassics also lists Veteran in Memoria; this record covers the Ipsen opportunity."],
  }, ipsensCastleChapterId, ipsensCastleEnemySources),
  chapterBoss({
    id: "enemy.taharka",
    name: "Taharka",
    encounterIds: ["encounter.ipsens-castle.taharka"],
    stats: [
      { field: "level", value: 46, sourceIds: ipsensTaharkaTableSources, verification: "cross-checked" },
      { field: "HP", value: 29186, sourceIds: ipsensTaharkaTableSources, verification: "cross-checked" },
      { field: "MP", value: 1776, sourceIds: ipsensTaharkaTableSources, verification: "cross-checked" },
      { field: "EXP", value: 0, sourceIds: ipsensTaharkaTableSources, verification: "cross-checked" },
      { field: "AP", value: 11, sourceIds: ["gamefaqs-ipsens-castle-71891"], verification: "single-source" },
      { field: "Gil", value: 8092, sourceIds: ipsensTaharkaTableSources, verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.elixir", ["gamefaqs-ipsens-castle-71891", "rpgclassics-bestiary-t-z"]),
      sourcedLoot("uncommon", "game-item.mythril-claws", ["gamefaqs-ipsens-castle-71891", "rpgclassics-bestiary-t-z"]),
      sourcedLoot("semi-rare", "game-item.orichalcon", ["gamefaqs-ipsens-castle-71891", "rpgclassics-bestiary-t-z"]),
      sourcedLoot("rare", null, ["gamefaqs-ipsens-castle-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, ["gamefaqs-ipsens-castle-71891"], "Nothing"),
      sourcedLoot("common", null, ["gamefaqs-ipsens-castle-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-ipsens-castle-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-ipsens-castle-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Aerial", ["gamefaqs-ipsens-castle-71891", "rpgclassics-bestiary-t-z"]),
      sourcedFact("elemental-weakness", "Fire and Wind", ["gamefaqs-ipsens-castle-71891", "rpgclassics-bestiary-t-z"]),
      sourcedFact("elemental-resistance", "Earth (nullifies); Ice damage halved", ["gamefaqs-ipsens-castle-71891"]),
      sourcedFact("status-vulnerability", "Heat, Poison, Silence, Sleep, and Slow", ["gamefaqs-ipsens-castle-71891"]),
      sourcedFact("attack", "Blizzaga and Chop while open", ["gamefaqs-ipsens-castle-71891"]),
      sourcedFact("attack", "Ram while closed", ["gamefaqs-ipsens-castle-71891"], "Defense rises sharply while Taharka is closed."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal during the one-time fight, if safe", detail: "Zidane can attempt Elixir, Mythril Claws, and Orichalcon before the fight ends. The source labels Orichalcon semi-rare; the item types have later sources, so do not risk a wipe for extra copies.", sourceIds: ["gamefaqs-ipsens-castle-71891", "rpgclassics-bestiary-t-z", "elitegrindlab-ipsens-castle"] },
      { title: "Exploit status and the open/closed states", detail: "Silence or Sleep can limit Taharka's attacks; Poison and Slow are also listed. Mustard Bomb or Add Status can inflict Heat. When open it uses Blizzaga and Chop; when closed, its defense rises and it uses Ram. The castle's inverted weapon-power rule remains active.", sourceIds: ["gamefaqs-ipsens-castle-71891", "flactem-ipsens-castle", "elitegrindlab-ipsens-castle"] },
    ],
    routeObjectiveIds: [ipsensCastleMirrorsObjectiveId, ipsensTaharkaStealsObjectiveId, ipsensTaharkaRamuhCardObjectiveId],
    notes: ["GameFAQs and RPGClassics agree on Level 46, 29,186 HP, 1,776 MP, 0 EXP, and 8,092 Gil; GameFAQs also lists 11 AP. GameFAQs names a Ramuh Card drop while RPGClassics records Ramuh in its card field. Published references inspected here do not support the generic HP-variance note previously attached to the Taharka steal warning."],
  }, ipsensCastleChapterId, ipsensCastleEnemySources, [ipsensTaharkaStealsMissableId], [ipsensTaharkaStealsCutoffId]),
];

const earthGuardianEncounters: EnemyEncounter[] = [
  {
    id: "encounter.breaking-the-seal.earth-guardian",
    title: "Earth Guardian — Earth Shrine boss",
    chapterId: breakingSealChapterId,
    location: "Earth Shrine altar, after placing the mirror",
    kind: "boss",
    formation: [{ enemyId: "enemy.earth-guardian", quantity: 1 }],
    sourceIds: earthGuardianEncounterSources,
    objectiveIds: ["disc-3.breaking-the-seal.four-shrines", earthGuardianStealsObjectiveId, earthGuardianEarthShakeObjectiveId, earthGuardianCompleteObjectiveId],
    missableIds: [earthGuardianStealsMissableId],
    cutoffIds: [earthGuardianStealsCutoffId],
    notes: ["This is the fixed Earth Shrine fight assigned to Zidane and Quina; it is separate from the other shrines' automatic completion scenes."],
  },
];

const earthGuardianEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.earth-guardian",
    name: "Earth Guardian",
    encounterIds: ["encounter.breaking-the-seal.earth-guardian"],
    stats: crossCheckedStats([["level", 54], ["HP", 20756], ["MP", 2234], ["EXP", 0], ["AP", 11], ["Gil", 4512]], earthGuardianSources),
    steals: [
      sourcedLoot("common", "game-item.avenger", earthGuardianSources),
      sourcedLoot("uncommon", "game-item.rubber-suit", earthGuardianSources),
      sourcedLoot("semi-rare", null, earthGuardianSources, "Nothing"),
      sourcedLoot("rare", null, earthGuardianSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.phoenix-pinion", earthGuardianSources),
      sourcedLoot("common", null, earthGuardianSources, "Nothing"),
      sourcedLoot("uncommon", null, earthGuardianSources, "Nothing"),
      sourcedLoot("rare", null, earthGuardianSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Demon", earthGuardianSources),
      sourcedFact("elemental-weakness", "Wind and Holy", earthGuardianSources),
      sourcedFact("elemental-resistance", "Earth is absorbed; Shadow damage is halved", earthGuardianSources),
      sourcedFact("status-vulnerability", "Darkness, Mini, Sleep, and Slow", ["gamefaqs-breaking-the-seal-71891"]),
      sourcedFact("attack", "Firaga, Blizzaga, and Thundaga", ["gamefaqs-breaking-the-seal-71891"], "GameFAQs describes its -ga spells as single-target attacks."),
      sourcedFact("attack", "Double Slash and Earthquake", ["gamefaqs-breaking-the-seal-71891"], "Double Slash is physical; Earthquake deals heavy Earth damage to the party."),
    ],
    blueMagic: [{ name: "Earth Shake", command: "Eat", sourceIds: earthGuardianSources, objectiveIds: [earthGuardianEarthShakeObjectiveId] }],
    strategies: [
      { title: "Protect Zidane and Quina from Earth damage", detail: "Equip Earth protection or Auto-Float where available. Auto-Reflect can blunt the Guardian's -ga spells, while Devil Killer increases Zidane's damage against its Demon type.", sourceIds: ["gamefaqs-breaking-the-seal-71891", "jegged-four-shrines-terra"] },
      { title: "Use status before attempting the steals", detail: "GameFAQs lists Darkness, Mini, Sleep, and Slow as vulnerabilities. Night can put the boss to sleep; Bad Breath can attempt several listed statuses. Have Zidane try Avenger and Rubber Suit before finishing the one-time fight.", sourceIds: ["gamefaqs-breaking-the-seal-71891", "jegged-four-shrines-terra"] },
      { title: "Eat for Earth Shake if Quina still needs it", detail: "Quina can learn Earth Shake from this boss with Eat. Use it after the boss is weakened, since the action ends the fight when the learning check succeeds.", sourceIds: earthGuardianSources },
    ],
    routeObjectiveIds: [earthGuardianStealsObjectiveId, earthGuardianCompleteObjectiveId],
    notes: [
      "GameFAQs and Caves of Narshe list Avenger as the common steal and Rubber Suit as the uncommon steal; Jegged reports 70% and 23% respectively per connected steal check. These odds are source context, not required attempt targets.",
      "GameFAQs, Jegged, and Caves of Narshe agree on Level 54, 20,756 HP, and 2,234 MP. GameFAQs and Caves of Narshe list 0 EXP, 11 AP, and 4,512 Gil. The fixed card reward is Atomos; the always-drop reward is one Phoenix Pinion.",
    ],
  }, breakingSealChapterId, earthGuardianSources, [earthGuardianStealsMissableId], [earthGuardianStealsCutoffId]),
];

const pinnacleRocksEncounters: EnemyEncounter[] = [
  {
    id: "encounter.pinnacle-rocks.random-pool",
    title: "Pinnacle Rocks random encounters",
    chapterId: pinnacleRocksChapterId,
    location: "Forest paths and crash-site screens at Pinnacle Rocks",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.sand-scorpion", quantity: null },
      { enemyId: "enemy.seeker-bat", quantity: null },
      { enemyId: "enemy.zaghnol-b", quantity: null },
    ],
    sourceIds: pinnacleRocksEnemySources,
    objectiveIds: ["disc-1.journey-to-burmecia.blue-magic-night"],
    missableIds: [],
    cutoffIds: [],
    notes: ["Route references list Sand Scorpion, Seeker Bat, and Zaghnol for the area; the enemy table and independent route sources provide their combat data. The group records the area roster without inferring formations, encounter rates, or exact screen-specific availability."],
  },
];

const fossilRooEncounters: EnemyEncounter[] = [
  {
    id: "encounter.fossil-roo.random-pool",
    title: "Fossil Roo random encounters",
    chapterId: fossilRooChapterId,
    location: "Cavern paths throughout Fossil Roo; the reviewed sources do not separate enemy pools by tunnel",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.abomination", quantity: null },
      { enemyId: "enemy.feather-circle", quantity: null },
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.seeker-bat", quantity: null },
    ],
    sourceIds: fossilRooEnemySources,
    objectiveIds: [fossilRooBlueMagicObjectiveId, nightBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The Fossil Roo Enemy List and route walkthroughs identify Abomination, Feather Circle, Griffin, and Seeker Bat. The formation records the area roster without inventing exact enemy counts, tunnel-by-tunnel distribution, or encounter rates. The Armodullahan chase and Lani are separate story encounters."],
  },
];

const lanarMarshEncounters: EnemyEncounter[] = [
  {
    id: "encounter.lanar-island.qus-marsh.anemone-opportunity",
    title: "Anemone — Lanar Island Qu’s Marsh opportunity",
    chapterId: lanarMarshChapterId,
    location: "Inside Qu’s Marsh on Lanar Island, Forgotten Continent",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.anemone", quantity: null }],
    sourceIds: lanarMarshSources,
    objectiveIds: [lostContinentBlueMagicObjectiveId, "disc-3.on-the-high-seas.lanar-frogs"],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs, Jegged, and Gamer Guides place Anemone inside Lanar Island’s Qu’s Marsh as a repeatable Bad Breath teacher. This is a scoped enemy opportunity, not a claim that Anemone is the pond’s complete encounter roster; published sources describe Gigan Toad variants across the marshes but do not reconcile their area-specific labels."],
  },
  {
    id: "encounter.on-the-high-seas.gimme-cat-island-grass",
    title: "Gimme Cat — island grasslands opportunity",
    chapterId: lanarMarshChapterId,
    location: "Grassland broadly reported near Lanar Island and the Salvage Archipelago",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.gimme-cat", quantity: null }],
    sourceIds: gimmeCatSources,
    objectiveIds: [lostContinentBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["The Disc III route reports Gimme Cat in grass near Lanar Island/Salvage Archipelago. GameFAQs also labels it a Daguerreo-area enemy, and RPGClassics lists Sacrobless Island; exact tiles and a complete local roster are not established."],
  },
];

const blairsurpassMarshEncounters: EnemyEncounter[] = [
  {
    id: "encounter.blairsurpass.qus-marsh.anemone-opportunity",
    title: "Anemone — Blairsurpass Plains Qu’s Marsh opportunity",
    chapterId: forgottenContinentChapterId,
    location: "Inside Qu’s Marsh on Blairsurpass Plains, Forgotten Continent",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.anemone", quantity: null }],
    sourceIds: blairsurpassMarshSources,
    objectiveIds: [lostContinentBlueMagicObjectiveId, "disc-3.forgotten-continent.qus-marsh-frogs"],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs' Forgotten Continent route identifies the separate Blairsurpass Plains frog pond, and the enemy/location references place Anemone in both Blairsurpass and Lanar Island Qu’s Marshes as a repeatable Bad Breath teacher. This is a scoped enemy opportunity, not a claim that Anemone is the pond’s complete encounter roster; the Gigan Toad variant labels remain unreconciled."],
  },
];

const disc4WorldMapEncounters: EnemyEncounter[] = [
  {
    id: "encounter.return-to-gaia.mist-continent-world-map",
    title: "Mist Continent — Disc IV world-map enemy roster",
    chapterId: returnToGaiaChapterId,
    location: "Mist Continent world map; the source does not identify exact tiles",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.adamantoise", quantity: null },
      { enemyId: "enemy.axe-beak", quantity: null },
      { enemyId: "enemy.bandersnatch", quantity: null },
      { enemyId: "enemy.bomb", quantity: null },
      { enemyId: "enemy.carve-spider", quantity: null },
      { enemyId: "enemy.clipper", quantity: null },
      { enemyId: "enemy.dracozombie", quantity: null },
      { enemyId: "enemy.ghost", quantity: null },
      { enemyId: "enemy.gigan-octopus", quantity: null },
      { enemyId: "enemy.goblin", quantity: null },
      { enemyId: "enemy.grand-dragon", quantity: null },
      { enemyId: "enemy.hedgehog-pie", quantity: null },
      { enemyId: "enemy.ironite", quantity: null },
      { enemyId: "enemy.ladybird", quantity: null },
      { enemyId: "enemy.lizard-man", quantity: null },
      { enemyId: "enemy.malboro-pandemonium", quantity: null },
      { enemyId: "enemy.mandragora", quantity: null },
      { enemyId: "enemy.mistodon-b", quantity: null },
      { enemyId: "enemy.mu", quantity: null },
      { enemyId: "enemy.python", quantity: null },
      { enemyId: "enemy.sand-scorpion", quantity: null },
      { enemyId: "enemy.serpion", quantity: null },
      { enemyId: "enemy.skeleton", quantity: null },
      { enemyId: "enemy.trick-sparrow", quantity: null },
      { enemyId: "enemy.worm-hydra", quantity: null },
      { enemyId: "enemy.vice", quantity: null },
      { enemyId: "enemy.whale-zombie", quantity: null },
      { enemyId: "enemy.yeti", quantity: null },
    ],
    sourceIds: disc4WorldMapEncounterSources,
    objectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: [
      "GameFAQs lists these 28 enemy identities under Mist Continent Enemies (Disc 4), including the distinct Mistodon [B] version. This is a continent-level roster, not a fixed formation or claim that every member shares one tile; exact tiles, formations, and encounter rates are not given.",
      "GameFAQs says the earlier-area enemies generally appear in their prior regions. RPGClassics independently lists broad Disc IV locations for several members, but does not provide the exact Mist Continent tile/formation table.",
    ],
  },
  {
    id: "encounter.return-to-gaia.outer-continent-world-map",
    title: "Outer Continent — Disc IV world-map enemy roster",
    chapterId: returnToGaiaChapterId,
    location: "Outer Continent world map; the source does not identify exact tiles",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.blazer-beetle", quantity: null },
      { enemyId: "enemy.cactuar", quantity: null },
      { enemyId: "enemy.dracozombie", quantity: null },
      { enemyId: "enemy.gigan-octopus", quantity: null },
      { enemyId: "enemy.goblin-mage", quantity: null },
      { enemyId: "enemy.grand-dragon", quantity: null },
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.hecteyes", quantity: null },
      { enemyId: "enemy.land-worm", quantity: null },
      { enemyId: "enemy.malboro-pandemonium", quantity: null },
      { enemyId: "enemy.mistodon-b", quantity: null },
      { enemyId: "enemy.ogre", quantity: null },
      { enemyId: "enemy.troll", quantity: null },
      { enemyId: "enemy.whale-zombie", quantity: null },
    ],
    sourceIds: disc4WorldMapEncounterSources,
    objectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: [
      "GameFAQs lists these 14 enemy identities under Outer Continent Enemies (Disc 4). This is a continent-level roster, not a fixed formation or claim that every member shares one tile; exact tiles, formations, and encounter rates are not given.",
      "GameFAQs says the earlier-area enemies generally appear in their prior regions. RPGClassics' broad Disc IV enemy locations do not resolve this roster into exact tiles or formations.",
    ],
  },
  {
    id: "encounter.return-to-gaia.lost-continent-world-map",
    title: "Lost Continent — Disc IV world-map enemy roster",
    chapterId: returnToGaiaChapterId,
    location: "Lost Continent world map; the source does not identify exact tiles",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.dracozombie", quantity: null },
      { enemyId: "enemy.feather-circle", quantity: null },
      { enemyId: "enemy.gigan-octopus", quantity: null },
      { enemyId: "enemy.hecteyes", quantity: null },
      { enemyId: "enemy.malboro-pandemonium", quantity: null },
      { enemyId: "enemy.mistodon-b", quantity: null },
      { enemyId: "enemy.vepal-green", quantity: null },
      { enemyId: "enemy.whale-zombie", quantity: null },
    ],
    sourceIds: disc4WorldMapEncounterSources,
    objectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: [
      "GameFAQs lists these eight enemy identities under Lost Continent Enemies (Disc 4). This is a continent-level roster, not a fixed formation or claim that every member shares one tile; exact tiles, formations, and encounter rates are not given.",
      "This Disc IV roster is separate from the Disc III Lost Continent field and Mount Gulug encounters; it does not establish that those earlier area pools persist after the world-map change.",
    ],
  },
  {
    id: "encounter.return-to-gaia.forgotten-continent-world-map",
    title: "Forgotten Continent — Disc IV world-map enemy roster",
    chapterId: returnToGaiaChapterId,
    location: "Forgotten Continent world map; the source does not identify exact tiles",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.adamantoise", quantity: null },
      { enemyId: "enemy.armstrong", quantity: null },
      { enemyId: "enemy.cactuar", quantity: null },
      { enemyId: "enemy.dracozombie", quantity: null },
      { enemyId: "enemy.gigan-octopus", quantity: null },
      { enemyId: "enemy.gimme-cat", quantity: null },
      { enemyId: "enemy.grand-dragon", quantity: null },
      { enemyId: "enemy.hecteyes", quantity: null },
      { enemyId: "enemy.jabberwock", quantity: null },
      { enemyId: "enemy.malboro-pandemonium", quantity: null },
      { enemyId: "enemy.mistodon-b", quantity: null },
      { enemyId: "enemy.worm-hydra", quantity: null },
    ],
    sourceIds: disc4WorldMapEncounterSources,
    objectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: [
      "GameFAQs lists these 12 enemy identities under Forgotten Continent Enemies (Disc 4). This is a continent-level roster, not a fixed formation or claim that every member shares one tile; exact tiles, formations, and encounter rates are not given.",
      "The continent roster includes Gimme Cat; the separate Sacrobless Island/Daguerreo record remains a more specific, independently sourced encounter opportunity and does not claim to be the whole Forgotten Continent pool.",
    ],
  },
];

const disc4IslandEncounters: EnemyEncounter[] = [
  {
    id: "encounter.return-to-gaia.sacrobless-gimme-cat",
    title: "Gimme Cat — Sacrobless Island/Daguerreo area opportunity",
    chapterId: returnToGaiaChapterId,
    location: "Sacrobless Island near Daguerreo; exact grass tile is unspecified",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.gimme-cat", quantity: null }],
    sourceIds: gimmeCatSources,
    objectiveIds: ["disc-4.return-to-gaia.island-blue-magic"],
    missableIds: [],
    cutoffIds: [],
    notes: ["RPGClassics places Gimme Cat on Sacrobless Island, while GameFAQs categorizes it under Daguerreo-area enemies. This is a scoped repeatable encounter opportunity, not a complete island roster or a claim about exact tile, formation, or rate. Keep this hostile enemy separate from Friendly Creature exchanges."],
  },
];

const lostContinentFeatherEncounters: EnemyEncounter[] = [
  {
    id: "encounter.lost-continent.feather-circle-teacher",
    title: "Feather Circle — Lost Continent Blue Magic opportunity",
    chapterId: mountGulugChapterId,
    location: "Lost Continent world-map snowfield near Esto Gaza",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.feather-circle", quantity: null }],
    sourceIds: lostContinentFeatherSources,
    objectiveIds: [lostContinentBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is a scoped appearance/teacher link for the standard hostile Feather Circle, not a complete Lost Continent encounter roster or a claim about formations and rates. The Friendly Feather Circle is modeled in its own encounter group."],
  },
  {
    id: "encounter.lost-continent.friendly-feather-circle",
    title: "Friendly Feather Circle — Mitmakis Ice Field",
    chapterId: mountGulugChapterId,
    location: "Mitmakis Ice Field on the Lost Continent, near the snowy tracks north of the beach and Esto Gaza",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.friendly-feather-circle", quantity: null }],
    sourceIds: friendlyFeatherCircleSources,
    objectiveIds: [friendlyFeatherCircleObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["This optional Friendly Creature asks for a Moonstone and rewards a Lapis Lazuli and 30 AP. It is a separate encounter identity from ordinary Feather Circle; appearance odds are not modeled."],
  },
];

const pinnacleRocksEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.seeker-bat",
    name: "Seeker Bat",
    encounterIds: ["encounter.pinnacle-rocks.random-pool", "encounter.fossil-roo.random-pool"],
    stats: crossCheckedStats([["level", 12], ["HP", 594], ["MP", 377], ["EXP", 449], ["AP", 2], ["Gil", 366]], [enemyListSourceId, "gamefaqs-item-locations-54996"]),
    steals: [
      sourcedLoot("common", "game-item.eye-drops", [enemyListSourceId, "gamefaqs-item-locations-54996", "elitegrindlab-pinnacle-rocks"]),
      sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId, "gamefaqs-item-locations-54996", "elitegrindlab-pinnacle-rocks"]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.echo-screen", [enemyListSourceId, "gamefaqs-item-locations-54996", "elitegrindlab-pinnacle-rocks"]),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId, "gamefaqs-item-locations-54996", "elitegrindlab-pinnacle-rocks"]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "gamefaqs-item-locations-54996", "elitegrindlab-pinnacle-rocks"]),
    ],
    facts: [
      sourcedFact("type", "Aerial", pinnacleRocksEnemySources),
      sourcedFact("elemental-weakness", "Fire and Wind", pinnacleRocksEnemySources),
      sourcedFact("elemental-resistance", "Earth (nullifies)", pinnacleRocksEnemySources),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Scratch", [enemyListSourceId, "elitegrindlab-pinnacle-rocks"], "Physical damage."),
      sourcedFact("attack", "Darkness", [enemyListSourceId, "elitegrindlab-pinnacle-rocks"], "Can inflict Darkness."),
      sourcedFact("attack", "Absorb", [enemyListSourceId, "elitegrindlab-pinnacle-rocks"], "Drains HP; the route table also names stronger Absorb variants."),
    ],
    blueMagic: [{ name: "Night", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "rpgclassics-bestiary-n-s"], objectiveIds: [nightBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Fire or Wind and prepare for Darkness", detail: "Fire and Wind exploit the listed weaknesses; Earth damage is nullified. Scratch and Absorb are modest, but Darkness can make physical attacks miss. Quina can learn Night if available in the party and the skill is still missing.", sourceIds: pinnacleRocksEnemySources }],
    routeObjectiveIds: [nightBlueMagicObjectiveId],
    notes: ["The standard Seeker Bat table is shared between Pinnacle Rocks and Fossil Roo. GameFAQs, the item-location guide, and other reviewed tables put Eye Drops and Tent in the steal list and Echo Screen, Hi-Potion, and Ether in the drop list. EliteGrindLab reports that Caves of Narshe transposes the Seeker Bat steal/drop lists; the disputed table is not silently merged."],
  }, pinnacleRocksChapterId, pinnacleRocksEnemySources),
];

const fossilRooEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.abomination",
    name: "Abomination",
    encounterIds: ["encounter.fossil-roo.random-pool"],
    stats: sourcedStats([["level", 15], ["HP", 879], ["MP", 482], ["EXP", 913], ["AP", 1], ["Gil", 388]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.annoyntment", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.phoenix-down", [enemyListSourceId]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "None", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "None listed", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "None listed", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Silent Slap", [enemyListSourceId], "Physical damage that can inflict Silence."),
      sourcedFact("attack", "Fira", [enemyListSourceId]),
      sourcedFact("attack", "Sleep", [enemyListSourceId]),
    ],
    blueMagic: [{ name: "Night", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [nightBlueMagicObjectiveId] }],
    strategies: [{ title: "Eat one for Night if it is still missing", detail: "Abomination is a second documented Night teacher after Nymph. Silent Slap can silence a character, so keep healing available while Quina weakens it enough for Eat.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [nightBlueMagicObjectiveId],
    notes: ["The enemy-table profile is shared with the Fossil Roo walkthrough. Its common Annoyntment drop is separate from its steal slots."],
  }, fossilRooChapterId, fossilRooEnemySources),
  chapterEnemy({
    id: "enemy.feather-circle",
    name: "Feather Circle (ordinary)",
    encounterIds: ["encounter.fossil-roo.random-pool", "encounter.lost-continent.feather-circle-teacher"],
    stats: sourcedStats([["level", 13], ["HP", 619], ["MP", 448], ["EXP", 629], ["AP", 2], ["Gil", 378]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.annoyntment", [enemyListSourceId]),
      sourcedLoot("semi-rare", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("uncommon", "game-item.phoenix-down", [enemyListSourceId]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Aerial", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Lightning and Wind", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "Earth (nullifies)", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Trouble Tail", [enemyListSourceId], "Can inflict Trouble, which spreads physical damage to the party when the affected character is hit."),
    ],
    blueMagic: [{ name: "LV4 Holy", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "rpgclassics-lost-continent"], objectiveIds: [fossilRooBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Lightning or Wind; cure Trouble", detail: "It is weak to Lightning and Wind and nullifies Earth. Feather Circles are listed in large groups, so defeat them quickly and cure Trouble before an affected character is struck. Quina can learn LV4 Holy with Eat in Fossil Roo or from a later Lost Continent opportunity.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "rpgclassics-lost-continent"] }],
    routeObjectiveIds: [fossilRooBlueMagicObjectiveId],
    notes: ["GameFAQs reports Earth nullification and does not list Water resistance; Caves of Narshe reports Water resistance. The Water claim is preserved as a source disagreement rather than merged into a single elemental profile. The friendly form is a distinct quest encounter and record."],
  }, fossilRooChapterId, [...fossilRooEnemySources, "cavesofnarshe-enemies", "rpgclassics-lost-continent"]),
  {
    id: "enemy.friendly-feather-circle",
    name: "Friendly Feather Circle",
    kind: "friendly",
    chapterId: mountGulugChapterId,
    versionScope: "Original PlayStation Friendly Creature quest data; release and region parity have not been audited.",
    encounterIds: ["encounter.lost-continent.friendly-feather-circle"],
    stats: [],
    steals: [],
    drops: [],
    facts: [],
    blueMagic: [],
    strategies: [{ title: "Give it a Moonstone for the quest reward", detail: "Friendly Feather Circle asks for a Moonstone and rewards a Lapis Lazuli and 30 AP. The Moonstone is not required for the Over the Moon achievement, which tracks collecting all four Moonstones.", sourceIds: friendlyFeatherCircleSources }],
    routeObjectiveIds: [friendlyFeatherCircleObjectiveId],
    missableIds: [],
    cutoffIds: [],
    sourceIds: friendlyFeatherCircleSources,
    coverage: "partial",
    notes: ["The hostile Feather Circle is a separate battle record with stats, steals, drops, and LV4 Holy. Friendly Feather Circle has no modeled battle table; its item request and quest reward are kept in the strategy note."],
  },
];

const deadForestEncounters: EnemyEncounter[] = [
  {
    id: "encounter.magdalene-forest.dead-forest-pool",
    title: "Dead Forest field encounters",
    chapterId: magdaleneForestChapterId,
    location: "Dead Forest field area on the route to Black Mage Village",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.griffin", quantity: null },
      { enemyId: "enemy.myconid", quantity: null },
      { enemyId: "enemy.zemzelett", quantity: null },
    ],
    sourceIds: deadForestEncounterSources,
    objectiveIds: [outerContinentBlueMagicObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["GameFAQs lists Griffin, Myconid, and Zemzelett for the Dead Forest field area, separately from its Magdalene Forest world-map table. No fixed party counts or encounter rates are inferred."],
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

const firstIifaTreeEncounters: EnemyEncounter[] = [
  {
    id: "encounter.iifa-tree.tree-roots-pool",
    title: "Tree Roots random encounters",
    chapterId: firstIifaTreeChapterId,
    location: "Outer roots before the elevator",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.dracozombie", quantity: null },
      { enemyId: "enemy.myconid", quantity: null },
      { enemyId: "enemy.stroper", quantity: null },
      { enemyId: "enemy.zombie", quantity: null },
    ],
    sourceIds: ["gamefaqs-iifa-tree-71891", "jegged-iifa-tree", enemyListSourceId],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["The route sources list these four enemy types in the Tree Roots. The roster does not imply exact mixed formations or encounter rates."],
  },
  {
    id: "encounter.iifa-tree.inner-roots-pool",
    title: "Inner Roots random encounters",
    chapterId: firstIifaTreeChapterId,
    location: "Inner roots beyond the elevator",
    kind: "random-pool",
    formation: [
      { enemyId: "enemy.dracozombie", quantity: null },
      { enemyId: "enemy.stroper", quantity: null },
      { enemyId: "enemy.zombie", quantity: null },
    ],
    sourceIds: ["gamefaqs-iifa-tree-71891", "jegged-iifa-tree", enemyListSourceId],
    objectiveIds: [firstIifaTreeLv5DeathObjectiveId],
    missableIds: [],
    cutoffIds: [],
    notes: ["Dracozombie and Stroper can teach Quina LV5 Death if Quina is available. EliteGrindLab reports that the lower-root encounter screens remain reachable after the one-time chest route closes."],
  },
  {
    id: "encounter.iifa-tree.fixed-zombie-trio",
    title: "Three Zombies — fixed descent battle",
    chapterId: firstIifaTreeChapterId,
    location: "Immediately after riding the platform down",
    kind: "fixed",
    formation: [{ enemyId: "enemy.zombie", quantity: 3 }],
    sourceIds: ["gamefaqs-iifa-tree-71891", "jegged-iifa-tree"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This scripted battle precedes the Dracozombie fight after the party speaks with Vivi."],
  },
  {
    id: "encounter.iifa-tree.fixed-dracozombie",
    title: "Dracozombie — fixed descent battle",
    chapterId: firstIifaTreeChapterId,
    location: "After the Zombie trio and the prompt to speak with Vivi",
    kind: "fixed",
    formation: [{ enemyId: "enemy.dracozombie", quantity: 1 }],
    sourceIds: ["gamefaqs-iifa-tree-71891", "jegged-iifa-tree"],
    objectiveIds: [],
    missableIds: [],
    cutoffIds: [],
    notes: ["This is a separate scripted battle, not a random formation."],
  },
  {
    id: "encounter.iifa-tree.soulcage",
    title: "Soulcage — Disc II boss",
    chapterId: firstIifaTreeChapterId,
    location: "Lower level, after examining the far-left field icon and speaking with Dagger",
    kind: "boss",
    formation: [{ enemyId: "enemy.soulcage", quantity: 1 }],
    sourceIds: firstIifaTreeEnemySources,
    objectiveIds: [firstIifaTreeStealsObjectiveId],
    missableIds: [firstIifaTreeStealsMissableId],
    cutoffIds: [firstIifaTreeStealsCutoffId],
    notes: ["This one-time boss encounter ends the Soulcage steal opportunity; Life defeats the undead boss immediately, so steal first if pursuing all three items."],
  },
];

const battleIifaTreeEncounters: EnemyEncounter[] = [
  {
    id: "encounter.iifa-tree-return.mistodon-upper-pair",
    title: "Mistodon [A] — upper-perch pair",
    chapterId: battleIifaTreeChapterId,
    location: "Upper perch after the automatic ascent at the fourth screen",
    kind: "fixed",
    formation: [{ enemyId: "enemy.mistodon-a", quantity: 2 }],
    sourceIds: battleIifaTreeEnemySources,
    objectiveIds: [battleIifaTreeMistodonStealsObjectiveId, battleIifaTreeAngelSnackObjectiveId],
    missableIds: [battleIifaTreeMistodonStealsMissableId],
    cutoffIds: [battleIifaTreeMistodonStealsCutoffId],
    notes: ["GameFAQs, Jegged, and Gamer Guides identify this as a scripted two-Mistodon fight. Complete any desired steals or Quina Eat attempt before using Life, Phoenix Down, or other undead-kill tactics."],
  },
  {
    id: "encounter.iifa-tree-return.mistodon-after-dagger",
    title: "Mistodon [A] — additional battle after Dagger leaves",
    chapterId: battleIifaTreeChapterId,
    location: "After Dagger leaves and before the party reaches Mocchi",
    kind: "fixed",
    formation: [{ enemyId: "enemy.mistodon-a", quantity: 1 }],
    sourceIds: battleIifaTreeEnemySources,
    objectiveIds: [battleIifaTreeMistodonStealsObjectiveId, battleIifaTreeAngelSnackObjectiveId],
    missableIds: [battleIifaTreeMistodonStealsMissableId],
    cutoffIds: [battleIifaTreeMistodonStealsCutoffId],
    notes: ["Jegged describes one solo Mistodon battle after Dagger leaves. Other guides group the following waves differently, so this fixed encounter records only the separately described solo battle."],
  },
  {
    id: "encounter.iifa-tree-return.mistodon-reported-downhill-pool",
    title: "Mistodon [A] — reported downhill encounter pool",
    chapterId: battleIifaTreeChapterId,
    location: "Downhill route after Mocchi",
    kind: "random-pool",
    formation: [{ enemyId: "enemy.mistodon-a", quantity: null }],
    sourceIds: battleIifaTreeEnemySources,
    objectiveIds: [battleIifaTreeMistodonStealsObjectiveId, battleIifaTreeAngelSnackObjectiveId],
    missableIds: [battleIifaTreeMistodonStealsMissableId],
    cutoffIds: [battleIifaTreeMistodonStealsCutoffId],
    notes: ["GameFAQs' Excalibur II route calls one or two fights on the later descent random, while the story guides describe further Mistodon battles as waves. EliteGrindLab says the scripted story waves cannot be refought or farmed. This records the reported downhill encounter opportunity without claiming that it repeats the same steal table after leaving and re-entering."],
  },
];

const returnMadainSariEncounters: EnemyEncounter[] = [
  {
    id: "encounter.return-madain-sari.scarlet-hair",
    title: "Scarlet Hair — Eidolon Wall duel",
    chapterId: returnMadainSariChapterId,
    location: "Inside the Eidolon Wall after choosing to rescue Eiko",
    kind: "boss",
    formation: [{ enemyId: "enemy.scarlet-hair", quantity: 1 }],
    sourceIds: scarletHairSources,
    objectiveIds: [scarletHairStealsObjectiveId],
    missableIds: [scarletHairStealsMissableId],
    cutoffIds: [scarletHairStealsCutoffId],
    notes: ["The rescue scene leads into a one-on-one battle with Zidane. Defeating Scarlet Hair ends this encounter-specific Ether and Poison Knuckles steal opportunity; both item types have later recovery sources."],
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

export const enemyEncounters: EnemyEncounter[] = [...alexandriaEncounters, ...evilForestEncounters, ...iceCavernEncounters, ...grottoEncounters, ...burmeciaEncounters, ...cleyraEncounters, ...returnToAlexandriaEncounters, ...tantarianEncounters, ...earlyDaliEncounters, ...cargoShipEncounters, ...trenoGriffinEncounters, ...summitStationEncounters, ...bentiniHeightsEncounters, ...garganRooEncounters, ...lindblumEncounters, ...lindblumRegionalEncounters, ...outerContinentEncounters, ...forgottenContinentFieldEncounters, ...mountainPathEncounters, ...pualeiPlainsEncounters, ...madainSariEncounters, ...desertPalaceEncounters, ...ipsensCastleEncounters, ...earthGuardianEncounters, ...pinnacleRocksEncounters, ...fossilRooEncounters, ...lanarMarshEncounters, ...blairsurpassMarshEncounters, ...disc4WorldMapEncounters, ...disc4IslandEncounters, ...lostContinentFeatherEncounters, ...deadForestEncounters, ...mountGulugEncounters, ...pandemoniumEncounters, ...firstIifaTreeEncounters, ...returnMadainSariEncounters, ...battleIifaTreeEncounters, ...iifaTreeEncounters, ...memoriaEncounters, ...ozmaEncounters, ...finalBattleEncounters];

const disc4WorldMapEnemyRecords: EnemyRecord[] = [
  disc4WorldMapEnemy({
    id: "enemy.bandersnatch",
    name: "Bandersnatch",
    encounterIds: [],
    stats: disc4WorldMapStats([["level", 14], ["HP", 899], ["MP", 464], ["EXP", 787], ["AP", 2], ["Gil", 347]], "rpgclassics-bestiary-a-c"),
    steals: [enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.phoenix-down"), enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Beast"),
      enemyFact("elemental-weakness", "None listed"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("attack", "Tongue", "Can inflict Sleep."),
      enemyFact("attack", "Rush and Thundara"),
    ],
    blueMagic: [{ name: "Pumpkin Head", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [disc4WorldMapBlueMagicObjectiveId] }],
    strategies: [{ title: "Guard against Sleep and exploit Beast Killer", detail: "Tongue can put a character to sleep; Rush and Thundara deal damage. The source recommends Beast Killer.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    notes: ["GameFAQs and RPGClassics agree on Level 14, HP 899, MP 464, 787 EXP, 347 Gil, Pumpkin Head, and the listed item identities. RPGClassics calls out Alexandria Castle and Alexandria Plateau; GameFAQs includes the plateau version in the Disc IV Mist Continent roster."],
  }, "rpgclassics-bestiary-a-c"),
  disc4WorldMapEnemy({
    id: "enemy.gigan-octopus",
    name: "Gigan Octopus",
    encounterIds: [],
    stats: disc4WorldMapStats([["level", 31], ["HP", 3584], ["MP", 1044], ["EXP", 6096], ["AP", 3], ["Gil", 1840]], "rpgclassics-bestiary-c-g"),
    steals: [enemyLoot("common", "game-item.eye-drops"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Aerial"),
      enemyFact("elemental-weakness", "Lightning and Wind"),
      enemyFact("elemental-resistance", "Water damage halved; Earth nullified"),
      enemyFact("attack", "Ink", "Deals damage and can inflict Darkness."),
      enemyFact("attack", "Blizzaga and 6 Legs", "Blizzaga is especially dangerous to a single target; 6 Legs drains HP from one character."),
      enemyFact("attack", "Mighty Guard"),
    ],
    blueMagic: [{ name: "Mighty Guard", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [disc4WorldMapBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Lightning and Wind", detail: "Both listed weaknesses exploit Gigan Octopus. Quina can learn Mighty Guard with Eat before the enemy is defeated.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    notes: ["RPGClassics gives the same core stats and lists all Mist Continent beaches on Disc IV. Its unranked drop list differs from GameFAQs' four-slot drop table; the profile preserves GameFAQs' explicit slots without inferring probabilities."],
  }, "rpgclassics-bestiary-c-g"),
  disc4WorldMapEnemy({
    id: "enemy.grand-dragon",
    name: "Grand Dragon",
    encounterIds: [],
    stats: disc4WorldMapStats([["level", 60], ["HP", 13206], ["MP", 2550], ["EXP", 35208], ["AP", 3], ["Gil", 2604]], "rpgclassics-bestiary-c-g"),
    steals: [enemyLoot("common", "game-item.tent"), enemyLoot("uncommon", "game-item.ether"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.rising-sun")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", "game-item.ether"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Dragon"),
      enemyFact("elemental-weakness", "Ice"),
      enemyFact("elemental-resistance", "Lightning damage halved"),
      enemyFact("attack", "Thundaga and Venom Breath", "Venom Breath can inflict Venom on the party."),
    ],
    blueMagic: [{ name: "LV3 Def-less", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [disc4WorldMapBlueMagicObjectiveId] }],
    strategies: [{ title: "Use LV5 Death if its level condition is met", detail: "GameFAQs recommends Quina's LV5 Death as a safe way to defeat Grand Dragon; its Level 60 is divisible by five. Otherwise exploit Ice and prepare for Thundaga and party-wide Venom.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    notes: ["GameFAQs and RPGClassics agree on the stat profile, LV3 Def-less, and listed steal/drop item identities. RPGClassics gives Popos Heights, Salvage Archipelago, and Sacrobless Island as locations; the GameFAQs Disc IV continent rosters place the enemy on three continents."],
  }, "rpgclassics-bestiary-c-g"),
  disc4WorldMapEnemy({
    id: "enemy.whale-zombie",
    name: "Whale Zombie",
    encounterIds: [],
    stats: disc4WorldMapStats([["level", 32], ["HP", 3730], ["MP", 1066], ["EXP", 6609], ["AP", 3], ["Gil", 1528]], "rpgclassics-bestiary-t-z"),
    steals: [enemyLoot("common", "game-item.antidote"), enemyLoot("uncommon", "game-item.magic-tag"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Aerial and Undead"),
      enemyFact("elemental-weakness", "Fire, Lightning, Wind, and Holy"),
      enemyFact("elemental-resistance", "Earth nullified; Water and Shadow damage halved"),
      enemyFact("attack", "Death and Zombie Powder"),
      enemyFact("attack", "Venom Breath and Ultra Soundwave", "Can inflict Venom and Mini."),
    ],
    blueMagic: [{ name: "LV5 Death", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [disc4WorldMapBlueMagicObjectiveId] }],
    strategies: [{ title: "Use curative damage and learn LV5 Death", detail: "Whale Zombie is Undead, so healing effects damage it. Quina can use Eat to learn LV5 Death; protect the party from its Death, Zombie, Venom, and Mini effects.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    notes: ["RPGClassics agrees on the core stats, steal/drop item identities, and LV5 Death; it lists broad world-beach locations across Discs III and IV rather than exact tiles or formations."],
  }, "rpgclassics-bestiary-t-z"),
  disc4WorldMapEnemy({
    id: "enemy.hecteyes",
    name: "Hecteyes",
    encounterIds: [],
    stats: disc4WorldMapStats([["level", 51], ["HP", 9567], ["MP", 2033], ["EXP", 17096], ["AP", 3], ["Gil", 2049]], "rpgclassics-kraken-bestiary"),
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.vaccine"), enemyLoot("semi-rare", "game-item.phoenix-pinion"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", "game-item.vaccine"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Demon and Undead"),
      enemyFact("elemental-weakness", "Fire and Holy"),
      enemyFact("elemental-resistance", "Shadow damage halved"),
      enemyFact("attack", "Hypnotize and Roulette", "Hypnotize can inflict Sleep; Roulette can KO a random target."),
      enemyFact("attack", "Absorb", "Deals damage and restores HP to Hecteyes."),
    ],
    blueMagic: [{ name: "Roulette", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [disc4WorldMapBlueMagicObjectiveId] }],
    strategies: [{ title: "Exploit Fire and Holy while watching for Roulette", detail: "Fire and Holy are listed weaknesses. Hypnotize can put a character to sleep, and Roulette can KO one random target.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    notes: ["RPGClassics cross-checks the profile, Roulette lesson, and listed loot, and says Hecteyes appears at various Disc IV locations; GameFAQs separately lists it on the Outer, Lost, and Forgotten Continents."],
  }, "rpgclassics-kraken-bestiary"),
  disc4WorldMapEnemy({
    id: "enemy.land-worm",
    name: "Land Worm",
    encounterIds: [],
    stats: disc4WorldMapStats([["level", 29], ["HP", 5296], ["MP", 997], ["EXP", 5151], ["AP", 3], ["Gil", 1316]], "rpgclassics-kraken-bestiary"),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", "game-item.ore"), enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Bug"),
      enemyFact("elemental-weakness", "None listed"),
      enemyFact("elemental-resistance", "Water absorbed"),
      enemyFact("attack", "Sandstorm and Demi", "Sandstorm damages the party; Demi reduces one target's maximum HP when it connects."),
      enemyFact("attack", "Maelstrom", "Can reduce one target to single-digit HP."),
    ],
    blueMagic: [{ name: "Matra Magic", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [disc4WorldMapBlueMagicObjectiveId] }],
    strategies: [{ title: "Watch for Maelstrom and learn Matra Magic", detail: "Heal a character reduced to single-digit HP by Maelstrom. Quina can learn Matra Magic with Eat; Water is absorbed, so do not use it as an attack element.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    notes: ["GameFAQs spells the name Land Worm; RPGClassics writes Landworm. The references agree on the core stats, loot, and Matra Magic; RPGClassics lists Kiera Desert, while GameFAQs places it in the Disc IV Outer Continent roster."],
  }, "rpgclassics-kraken-bestiary"),
  disc4WorldMapEnemy({
    id: "enemy.vepal-green",
    name: "Vepal [Green]",
    encounterIds: [],
    stats: disc4WorldMapStats([["level", 34], ["HP", 4363], ["MP", 1188], ["EXP", 6434], ["AP", 2], ["Gil", 1270]], "rpgclassics-bestiary-t-z"),
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("semi-rare", "game-item.phoenix-pinion"), enemyLoot("rare", "game-item.ether")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Aerial"),
      enemyFact("elemental-weakness", "Fire and Wind"),
      enemyFact("elemental-resistance", "Ice damage halved; Earth nullified"),
      enemyFact("attack", "Body Ram, Blizzaga, and Freeze"),
    ],
    blueMagic: [{ name: "Aqua Breath", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [disc4WorldMapBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Fire or Wind and prepare for Freeze", detail: "Fire and Wind exploit its weaknesses. Body Ram and Blizzaga can deal heavy damage, while Freeze can disable one character. Quina can learn Aqua Breath with Eat.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    notes: ["RPGClassics cross-checks the stats, Aqua Breath, weaknesses, and loot. It lists Mitmakis Ice Field; GameFAQs includes this form in the Disc IV Lost Continent roster. Keep it distinct from the Red Vepal at Mount Gulug."],
  }, "rpgclassics-bestiary-t-z"),
  disc4WorldMapEnemy({
    id: "enemy.mistodon-b",
    name: "Mistodon [B]",
    encounterIds: [],
    stats: disc4WorldMapStats([["level", 56], ["HP", 11434], ["MP", 2301], ["EXP", 24276], ["AP", 2], ["Gil", 2023]], "rpgclassics-kraken-bestiary"),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.peridot"), enemyLoot("uncommon", "game-item.ether"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Undead"),
      enemyFact("elemental-weakness", "Fire and Holy"),
      enemyFact("elemental-resistance", "Shadow damage halved"),
    ],
    blueMagic: [{ name: "Angel's Snack", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [disc4WorldMapBlueMagicObjectiveId] }],
    strategies: [{ title: "Exploit its Undead nature", detail: "Fire, Holy, and curative effects exploit this form's listed profile. Quina can learn Angel's Snack with Eat if the skill is still missing.", sourceIds: [enemyListSourceId] }],
    routeObjectiveIds: [disc4WorldMapBlueMagicObjectiveId],
    notes: ["This Disc IV version is distinct from Mistodon [A] at the Disc II Iifa Tree return. GameFAQs and RPGClassics agree on its core stats and listed loot. Do not copy the older version's attack profile onto Mistodon [B]; the inspected Disc IV enemy table does not provide one."],
  }, "rpgclassics-kraken-bestiary"),
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

const firstIifaTreeEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.dracozombie",
    name: "Dracozombie",
    encounterIds: [
      "encounter.iifa-tree.tree-roots-pool",
      "encounter.iifa-tree.inner-roots-pool",
      "encounter.iifa-tree.fixed-dracozombie",
    ],
    stats: enemyStats([["level", 24], ["HP", 2179], ["MP", 760], ["EXP", 3229], ["AP", 3], ["Gil", 941]]),
    steals: [
      enemyLoot("common", "game-item.magic-tag"),
      enemyLoot("uncommon", "game-item.hi-potion"),
      enemyLoot("semi-rare", null, "Nothing"),
      enemyLoot("rare", "game-item.ether"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"),
      enemyLoot("common", "game-item.hi-potion"),
      enemyLoot("uncommon", "game-item.phoenix-down"),
      enemyLoot("rare", "game-item.ether"),
    ],
    facts: [
      enemyFact("type", "Dragon and Undead"),
      enemyFact("elemental-weakness", "Fire, Ice, and Holy"),
      enemyFact("elemental-resistance", "Shadow damage halved"),
      enemyFact("status-vulnerability", "Berserk, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Zombie Breath", "Can inflict Zombie on one character."),
      enemyFact("attack", "LV5 Death", "KOs characters whose levels are multiples of five."),
    ],
    blueMagic: [{ name: "LV5 Death", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [firstIifaTreeLv5DeathObjectiveId] }],
    strategies: [
      { title: "Use undead damage while watching for two status attacks", detail: "Life defeats Dracozombie outright, and curative magic or items damage it. Zombie Breath can inflict Zombie; LV5 Death targets party members whose levels are multiples of five. Quina can use Eat to learn LV5 Death if the skill is still needed.", sourceIds: firstIifaTreeEnemySources },
    ],
    routeObjectiveIds: [firstIifaTreeLv5DeathObjectiveId],
    notes: ["GameFAQs lists Fire, Ice, and Holy as weaknesses. EliteGrindLab reports its field-data read as Fire, Thunder, and Holy, while its Caves of Narshe cross-check reports Fire and Ice; retain the disagreement pending direct verification."],
  }, firstIifaTreeChapterId, [...firstIifaTreeEnemySources, "cavesofnarshe-enemies", "gamefaqs-abilities-71891"]),
  chapterEnemy({
    id: "enemy.stroper",
    name: "Stroper",
    encounterIds: ["encounter.iifa-tree.tree-roots-pool", "encounter.iifa-tree.inner-roots-pool"],
    stats: enemyStats([["level", 21], ["HP", 1840], ["MP", 697], ["EXP", 2346], ["AP", 2], ["Gil", 915]]),
    steals: [
      enemyLoot("common", "game-item.soft"),
      enemyLoot("uncommon", "game-item.peridot"),
      enemyLoot("semi-rare", "game-item.phoenix-down"),
      enemyLoot("rare", "game-item.peridot"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"),
      enemyLoot("common", "game-item.peridot"),
      enemyLoot("uncommon", "game-item.phoenix-down"),
      enemyLoot("rare", "game-item.peridot"),
    ],
    facts: [
      enemyFact("type", "Stone"),
      enemyFact("elemental-weakness", "Fire"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Silence", "Can silence the party."),
      enemyFact("attack", "Gradual Petrify"),
      enemyFact("attack", "Slap and Sweep", "Physical attacks against one or all characters."),
    ],
    blueMagic: [{ name: "LV5 Death", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [firstIifaTreeLv5DeathObjectiveId] }],
    strategies: [{ title: "Use Soft; Stona does not work", detail: "A Soft instantly defeats Stroper. Its other notable threats are Silence and Gradual Petrify. Quina can use Eat to learn LV5 Death if the skill is still needed.", sourceIds: firstIifaTreeEnemySources }],
    routeObjectiveIds: [firstIifaTreeLv5DeathObjectiveId],
    notes: ["GameFAQs lists Stroper in both the Tree Roots and Inner Roots; the lower-root screen remains a later LV5 Death learning opportunity when Quina is available."],
  }, firstIifaTreeChapterId, [...firstIifaTreeEnemySources, "gamefaqs-abilities-71891"]),
  chapterEnemy({
    id: "enemy.zombie",
    name: "Zombie",
    encounterIds: [
      "encounter.iifa-tree.tree-roots-pool",
      "encounter.iifa-tree.inner-roots-pool",
      "encounter.iifa-tree.fixed-zombie-trio",
    ],
    stats: enemyStats([["level", 19], ["HP", 973], ["MP", 603], ["EXP", 1445], ["AP", 2], ["Gil", 708]]),
    steals: [
      enemyLoot("common", "game-item.magic-tag"),
      enemyLoot("uncommon", "game-item.tent"),
      enemyLoot("semi-rare", null, "Nothing"),
      enemyLoot("rare", "game-item.ether"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"),
      enemyLoot("common", "game-item.magic-tag"),
      enemyLoot("uncommon", "game-item.soft"),
      enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("type", "Undead"),
      enemyFact("elemental-weakness", "Fire and Holy"),
      enemyFact("elemental-resistance", "Shadow damage halved"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Roulette", "Can KO one random unit; Quina can learn this Blue Magic with Eat."),
      enemyFact("attack", "Melt", "Kills the Zombie and deals its remaining HP as damage to one target."),
    ],
    blueMagic: [{ name: "Roulette", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "End the fight quickly with undead damage", detail: "Life defeats Zombie outright, and curative magic or items damage it. Roulette can KO a random unit, while Melt can deal the Zombie's remaining HP as damage to a target.", sourceIds: firstIifaTreeEnemySources }],
    routeObjectiveIds: [],
    notes: ["The GameFAQs enemy table lists Fire and Holy weaknesses. EliteGrindLab reports the same Fire/Holy read from its field data but says Caves of Narshe lists Holy alone; retain the disagreement pending direct verification."],
  }, firstIifaTreeChapterId, [...firstIifaTreeEnemySources, "cavesofnarshe-enemies", "gamefaqs-abilities-71891"]),
  chapterBoss({
    id: "enemy.soulcage",
    name: "Soulcage",
    encounterIds: ["encounter.iifa-tree.soulcage"],
    stats: [
      ...crossCheckedStats([["level", 26], ["HP", 9765]], ["gamefaqs-iifa-tree-71891", "jegged-iifa-tree", "elitegrindlab-iifa-tree"]),
      ...sourcedStats([["MP", 862], ["EXP", 0], ["AP", 9], ["Gil", 3800]], ["gamefaqs-iifa-tree-71891"]),
    ],
    steals: [
      sourcedLoot("common", "game-item.oak-staff", firstIifaTreeEnemySources),
      sourcedLoot("uncommon", "game-item.magician-cloak", firstIifaTreeEnemySources),
      sourcedLoot("semi-rare", "game-item.brigandine", firstIifaTreeEnemySources),
      sourcedLoot("rare", null, firstIifaTreeEnemySources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.phoenix-pinion", firstIifaTreeEnemySources),
      sourcedLoot("common", "game-item.elixir", firstIifaTreeEnemySources),
      sourcedLoot("uncommon", "game-item.elixir", firstIifaTreeEnemySources),
      sourcedLoot("rare", "game-item.elixir", firstIifaTreeEnemySources),
    ],
    facts: [
      sourcedFact("type", "Undead", firstIifaTreeEnemySources),
      sourcedFact("elemental-weakness", "Fire and Holy", firstIifaTreeEnemySources),
      sourcedFact("elemental-resistance", "Shadow damage halved", firstIifaTreeEnemySources),
      sourcedFact("status-vulnerability", "Darkness, Sleep, and Slow", firstIifaTreeEnemySources),
      sourcedFact("attack", "LV5 Death", firstIifaTreeEnemySources, "KOs characters whose levels are multiples of five."),
      sourcedFact("attack", "Mustard Bomb", firstIifaTreeEnemySources, "Inflicts Heat; a character who acts while heated is KO'd. Body Temp prevents Heat."),
      sourcedFact("attack", "Shockwave and Leaf Swirl", firstIifaTreeEnemySources, "Party-wide damage."),
      sourcedFact("attack", "Fira", firstIifaTreeEnemySources, "Single-target Fire damage."),
      sourcedFact("attack", "Fire Blades counter", firstIifaTreeEnemySources, "Fire damage or a reflected Fira can trigger an accelerated phase that uses this powerful party-wide attack; Ice damage returns Soulcage to normal."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal before using Life", detail: "Attempt Oak Staff, Magician Cloak, and Brigandine before ending the one-time fight. Life defeats Soulcage immediately, so it closes the steal window; the nearby Brigandine chest remains a guaranteed copy.", sourceIds: firstIifaTreeEnemySources },
      { title: "Avoid Fire despite the listed weakness", detail: "Fire damage, including Soulcage's reflected Fira, triggers the Fire Blades counter. Use non-Fire damage or its Sleep, Slow, and Darkness vulnerabilities while Zidane steals; Life is a fast finish after stealing is complete.", sourceIds: firstIifaTreeEnemySources },
    ],
    routeObjectiveIds: [firstIifaTreeStealsObjectiveId],
    notes: ["GameFAQs, Jegged, and EliteGrindLab agree on level 26 and 9,765 HP. Published steal odds vary by rarity and rounding convention and are intentionally omitted. The Fire weakness is a tactical trap because Fire triggers the Fire Blades counter."],
  }, firstIifaTreeChapterId, firstIifaTreeEnemySources, [firstIifaTreeStealsMissableId], [firstIifaTreeStealsCutoffId]),
];

const battleIifaTreeEnemyRecords: EnemyRecord[] = [
  {
    ...chapterEnemy({
      id: "enemy.mistodon-a",
      name: "Mistodon [A] (Disc II)",
      encounterIds: ["encounter.iifa-tree-return.mistodon-upper-pair", "encounter.iifa-tree-return.mistodon-after-dagger", "encounter.iifa-tree-return.mistodon-reported-downhill-pool"],
      stats: [
        ...crossCheckedStats([["level", 19], ["HP", 1473]], [enemyListSourceId, "jegged-iifa-tree-revisited"]),
        ...sourcedStats([["MP", 602], ["EXP", 2548], ["AP", 2], ["Gil", 747]], [enemyListSourceId]),
      ],
      steals: [
        enemyLoot("common", "game-item.ore"),
        enemyLoot("uncommon", "game-item.hi-potion"),
        enemyLoot("semi-rare", null, "Nothing"),
        enemyLoot("rare", null, "Nothing"),
      ],
      drops: [
        enemyLoot("always", null, "Nothing"),
        enemyLoot("common", "game-item.peridot"),
        enemyLoot("uncommon", "game-item.ether"),
        enemyLoot("rare", "game-item.peridot"),
      ],
      facts: [
        enemyFact("type", "Undead"),
        enemyFact("elemental-weakness", "Fire and Holy"),
        enemyFact("elemental-resistance", "Shadow damage halved"),
        enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
        enemyFact("attack", "Mist", "Can inflict Sleep on the party."),
      ],
      blueMagic: [{ name: "Angel's Snack", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [battleIifaTreeAngelSnackObjectiveId] }],
      strategies: [{ title: "Prepare for Sleep and exploit its undead nature", detail: "Mist can put the party to Sleep, so equip Insomniac where available. Life or Phoenix Down defeats Mistodon quickly; use those only after any desired Hi-Potion/Ore steals or Quina's Angel's Snack Eat attempt.", sourceIds: battleIifaTreeEnemySources }],
      routeObjectiveIds: [battleIifaTreeMistodonStealsObjectiveId, battleIifaTreeAngelSnackObjectiveId],
      notes: ["GameFAQs and Jegged agree on the Disc II variant's level and HP. GameFAQs distinguishes this level-19 Mistodon [A] from the stronger Disc IV Mistodon [B]. The return-route sources disagree about whether the scripted waves can be repeated by leaving and re-entering; the linked story cutoff remains disputed, not a conclusive permanent-loss claim."],
    }, battleIifaTreeChapterId, battleIifaTreeEnemySources),
    missableIds: [battleIifaTreeMistodonStealsMissableId],
    cutoffIds: [battleIifaTreeMistodonStealsCutoffId],
  },
];

const returnMadainSariEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.scarlet-hair",
    name: "Scarlet Hair",
    encounterIds: ["encounter.return-madain-sari.scarlet-hair"],
    stats: [
      ...crossCheckedStats([["level", 22], ["EXP", 0], ["Gil", 4790]], ["gamefaqs-return-to-madain-sari-71891", "rpgclassics-bestiary-n-s", "elitegrindlab-madain-sari-eidolon-wall"]),
      ...crossCheckedStats([["AP", 9]], ["gamefaqs-return-to-madain-sari-71891", "elitegrindlab-madain-sari-eidolon-wall"]),
      { field: "MP", value: 5865, sourceIds: ["gamefaqs-return-to-madain-sari-71891", "elitegrindlab-madain-sari-eidolon-wall"], verification: "disputed" },
      { field: "HP", value: 8985, sourceIds: ["jegged-return-to-madain-sari", "rpgclassics-bestiary-n-s", "elitegrindlab-madain-sari-eidolon-wall"], verification: "disputed" },
      { field: "HP", value: 8986, sourceIds: ["gamefaqs-return-to-madain-sari-71891"], verification: "disputed" },
      { field: "HP", value: 18985, sourceIds: ["elitegrindlab-madain-sari-eidolon-wall"], verification: "disputed" },
      { field: "HP", value: 6800, sourceIds: ["elitegrindlab-madain-sari-eidolon-wall"], verification: "disputed" },
      { field: "MP", value: 5685, sourceIds: ["rpgclassics-bestiary-n-s"], verification: "disputed" },
    ],
    steals: [
      sourcedLoot("common", "game-item.ether", scarletHairSources),
      sourcedLoot("uncommon", "game-item.poison-knuckles", scarletHairSources),
      sourcedLoot("semi-rare", null, scarletHairSources, "Nothing"),
      sourcedLoot("rare", null, scarletHairSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.tent", scarletHairSources),
      sourcedLoot("common", null, scarletHairSources, "Nothing"),
      sourcedLoot("uncommon", null, scarletHairSources, "Nothing"),
      sourcedLoot("rare", null, scarletHairSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", scarletHairSources),
      sourcedFact("status-vulnerability", "Silence, Sleep, and Slow", ["gamefaqs-return-to-madain-sari-71891"]),
      sourcedFact("attack", "Physical attack and Counter", ["gamefaqs-return-to-madain-sari-71891"], "GameFAQs lists these as Scarlet Hair's two attacks; their damage depends on Zidane's current equipment."),
      sourcedFact("attack", "Evasive movement", ["gamefaqs-return-to-madain-sari-71891", "jegged-return-to-madain-sari", "gamerguides-revisiting-madain-sari"], "Scarlet Hair jumps around and is harder to hit while moving; use the spoken attack cue to time an attack or steal attempt."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Attempt both steals before winning", detail: "Ether is in the Common slot and Poison Knuckles in the Uncommon slot. The encounter is one-time, but both item types are obtainable from other sources; no steal odds or number of attempts is promised here.", sourceIds: scarletHairSources },
      { title: "Time attacks for the return cue", detail: "Scarlet Hair spends time jumping around with higher evasion. Use the spoken “Here I go” cue as an opening to attack or try another steal, and keep Zidane healed during the solo fight.", sourceIds: ["gamefaqs-return-to-madain-sari-71891", "jegged-return-to-madain-sari", "gamerguides-revisiting-madain-sari"] },
    ],
    routeObjectiveIds: [scarletHairStealsObjectiveId],
    notes: [
      "Published HP values conflict: sources list 8,985, 8,986, 18,985, and 6,800. No value is selected for the walkthrough.",
      "MP is listed as 5,865 by GameFAQs and EliteGrindLab's comparison, while RPGClassics prints 5,685. Level, EXP, AP, and Gil are cross-checked; steal odds vary by source and are intentionally omitted.",
    ],
  }, returnMadainSariChapterId, scarletHairSources, [scarletHairStealsMissableId], [scarletHairStealsCutoffId]),
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

const alexandriaEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.masked-man-opening",
    name: "Masked Man (opening Baku)",
    encounterIds: ["encounter.alexandria.masked-man-opening"],
    stats: [
      { field: "level", value: 1, sourceIds: ["gamefaqs-alexandria-71891"], verification: "single-source" },
      { field: "HP", value: 188, sourceIds: ["gamefaqs-alexandria-71891"], verification: "disputed" },
      { field: "HP", value: 160, sourceIds: ["gamefaqs-walkthrough-15690"], verification: "disputed" },
      { field: "MP", value: 223, sourceIds: ["gamefaqs-alexandria-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-alexandria-71891"], verification: "single-source" },
      { field: "AP", value: 0, sourceIds: ["gamefaqs-alexandria-71891"], verification: "single-source" },
      { field: "Gil", value: 0, sourceIds: ["gamefaqs-alexandria-71891"], verification: "single-source" },
    ],
    steals: [
      sourcedLoot("common", "game-item.potion", ["gamefaqs-alexandria-71891"]),
      sourcedLoot("uncommon", "game-item.wrist", ["gamefaqs-alexandria-71891"]),
      sourcedLoot("semi-rare", "game-item.mage-masher", ["gamefaqs-alexandria-71891"]),
      sourcedLoot("rare", null, ["gamefaqs-alexandria-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, ["gamefaqs-alexandria-71891"], "Nothing"),
      sourcedLoot("common", null, ["gamefaqs-alexandria-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-alexandria-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-alexandria-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", ["gamefaqs-alexandria-71891"]),
      sourcedFact("elemental-weakness", "None listed", ["gamefaqs-alexandria-71891"]),
      sourcedFact("elemental-resistance", "None listed", ["gamefaqs-alexandria-71891"]),
      sourcedFact("status-vulnerability", "None listed", ["gamefaqs-alexandria-71891"]),
      sourcedFact("attack", "Ow", ["gamefaqs-alexandria-71891"], "The Masked Man trips and loses his turn."),
    ],
    blueMagic: [],
    strategies: [{
      title: "Steal the three useful items before finishing the fight",
      detail: "Use Steal until Potion, Wrist, and Mage Masher are collected; Mage Masher is the strongest early weapon for Zidane. The items have later recovery routes, so these are valuable early copies rather than permanent item-type losses.",
      sourceIds: maskedManSources,
    }],
    routeObjectiveIds: ["disc-1.alexandria.masked-man-steals"],
    notes: [
      "GameFAQs 71891 lists 188 HP, while GheddonLN's older FAQ lists 160 HP for the opening Baku battle. The discrepancy is preserved; the older guide does not establish whether it reflects a different release or a table error.",
      "RPGClassics identifies the Masked Man as Baku after this encounter. Its later Crash Site fight has its own profile and different steal table.",
    ],
  }, alexandriaChapterId, maskedManSources, ["missable.disc-1.alexandria.masked-man-steals"], ["cutoff.alexandria.masked-man-steals"]),
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
    preparationGuidance: {
      suggestedLevelRange: { min: 3, max: 5 },
      levelRationale: "Optional comfort range summarized from secondary recommendations: VGKAMI suggests level 3, Jegged lists level 3–4, and a PlayStation no-equipment challenge guide suggests level 4–5. These are route recommendations, not a tested minimum or requirement; the 4–5 suggestion is specific to that challenge route.",
      optionalGrinding: "Monty's spring restores HP and MP for free, so a short grind is available if the fight feels risky. It is not needed for story progress; on an Excalibur II route, follow the selected timer and EXP plan instead of adding unbudgeted battles.",
      setupAdvice: "Arrive healed, keep Vivi able to act, use Fire and Fire Sword, and bring Eye Drops for Pollen's Darkness. Rubber Helm or Silk Shirts can reduce Thunder damage when available.",
      confidence: "partial",
      sourceIds: ["vgkami-evil-forest", "jegged-evil-forest", "gamefaqs-no-equipment-29826", "gamefaqs-perfect-game-41181"],
    },
    routeObjectiveIds: ["disc-1.evil-forest.plant-brain-steals"],
    notes: ["GameFAQs and Jegged agree on 916 HP. The Hellplant/Plant Brain type is not assigned because the inspected boss table does not list a type."],
  }, evilForestChapterId, [...evilForestBossSources, "vgkami-evil-forest", "gamefaqs-no-equipment-29826", "gamefaqs-perfect-game-41181"], ["missable.disc-1.evil-forest.plant-brain-steals"], ["cutoff.evil-forest.escape"]),
  chapterBoss({
    id: "enemy.baku-crash-site",
    name: "Baku (Prima Vista Crash Site)",
    encounterIds: ["encounter.evil-forest.baku-crash-site"],
    stats: [
      ...crossCheckedStats([["level", 2], ["MP", 1285], ["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-evil-forest-71891", "rpgclassics-bestiary-a-c"]),
      { field: "HP", value: 202, sourceIds: ["gamefaqs-evil-forest-71891", "rpgclassics-bestiary-a-c", "vgkami-evil-forest"], verification: "disputed" },
      { field: "HP", value: 160, sourceIds: ["gamefaqs-walkthrough-15690"], verification: "disputed" },
    ],
    steals: [
      sourcedLoot("common", "game-item.hi-potion", ["gamefaqs-evil-forest-71891", "rpgclassics-bestiary-a-c", "vgkami-evil-forest"]),
      sourcedLoot("uncommon", "game-item.iron-sword", ["gamefaqs-evil-forest-71891", "rpgclassics-bestiary-a-c", "vgkami-evil-forest"]),
      sourcedLoot("semi-rare", null, ["gamefaqs-evil-forest-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-evil-forest-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, ["gamefaqs-evil-forest-71891", "rpgclassics-bestiary-a-c"], "Nothing"),
      sourcedLoot("common", null, ["gamefaqs-evil-forest-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-evil-forest-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-evil-forest-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", ["gamefaqs-evil-forest-71891", "rpgclassics-bestiary-a-c"]),
      sourcedFact("elemental-weakness", "Fire", ["gamefaqs-evil-forest-71891", "rpgclassics-bestiary-a-c"]),
      sourcedFact("elemental-resistance", "None listed", ["gamefaqs-evil-forest-71891"]),
      sourcedFact("status-vulnerability", "Slow", ["gamefaqs-evil-forest-71891", "vgkami-evil-forest"]),
      sourcedFact("attack", "YEOWWW! / trip", ["vgkami-evil-forest"], "Baku falls over and loses his turn."),
      sourcedFact("attack", "Physical attacks", ["gamefaqs-evil-forest-71891", "vgkami-evil-forest"], "Baku's attacks target Zidane while he fights alone."),
    ],
    blueMagic: [],
    strategies: [{
      title: "Steal the Iron Sword, then heal as needed",
      detail: "Zidane fights alone. Attempt the Hi-Potion and Iron Sword steals before ending the battle; the Iron Sword is useful for Steiner after he joins. Heal with Potions if Zidane drops below roughly 60 HP.",
      sourceIds: ["gamefaqs-evil-forest-71891", "vgkami-evil-forest"],
    }],
    routeObjectiveIds: ["disc-1.evil-forest.baku-steals"],
    notes: [
      "GameFAQs, RPGClassics, and VGKAMI list 202 HP. GheddonLN's older FAQ estimates about 160 HP for this later fight; the old value is retained as a disputed claim.",
      "This post-crash fight is a separate profile from the opening Masked Man, even though both encounters involve Baku.",
    ],
  }, evilForestChapterId, crashSiteBakuSources, ["missable.disc-1.evil-forest.baku-steals"], ["cutoff.evil-forest.escape"]),
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
    preparationGuidance: {
      suggestedLevelRange: { min: 4, max: 5 },
      levelRationale: "This optional comfort range is for Zidane in the combined Ice Cavern boss encounter. A Japanese boss guide recommends Zidane at Lv. 5 or higher; the original PlayStation Excalibur II route recommends Lv. 4 Zidane and Lv. 3 supporting characters before the fight, while noting that lower levels can still win. These route and build contexts do not establish a universal minimum or a required level for inactive party members.",
      optionalGrinding: "The PlayStation Excalibur II route allows only two or three quick Ice Cavern encounters before the boss and says this is not a grinding challenge. Follow its timer and EXP plan if selected. In a standard run, extra encounters are optional; the references do not show that grinding is required.",
      setupAdvice: "Restore Zidane at Mois's save point, equip his strongest available weapon and armor, and bring Potions for the solo phase. The Japanese boss guide recommends entering with at least half the Trance gauge and healing before HP falls below 100; defeat Black Waltz 1 first, then use Tidal Flame if Trance is ready. The PlayStation route notes that Silk Shirt helps slightly against Sealion's Wing but makes Zidane weak to Black Waltz 1's Fire.",
      confidence: "partial",
      sourceIds: ["gamefaqs-ice-cavern-71891", "jegged-ice-cavern", "gamefaqs-ice-cavern-79143", "kamigame-ice-cavern-boss"],
    },
    routeObjectiveIds: [iceCavernStealsObjectiveId],
    notes: ["Orb-color behavior differs between the two walkthroughs: GameFAQs lists Blizzard and then Blizzara across phases, while Jegged gives regular attacks in blue and Blizzard in yellow. The exact spell timing is left source-specific."],
  }, iceCavernChapterId, iceCavernSealionSources, [iceCavernStealsMissableId], [iceCavernStealsCutoffId]),
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
    preparationGuidance: {
      levelRationale: "The normal-route references list Gizamaluke at Level 16, which is the boss's own stat, not a party target; they do not establish a recommended level for a standard party. A GameFAQs Single Character Challenge suggests Lv. 15 before entering the Grotto, but that target is specific to its challenge route and is not adopted as ordinary-play guidance.",
      optionalGrinding: "No reviewed normal-route guide requires a fixed grind quota. The party can use the overworld before entering the Grotto if extra encounters are desired; the Lv. 15 note belongs to the separate single-character challenge. Save with Mogmi and use a Tent before opening the Sacred Room.",
      setupAdvice: "Bring Potions or Hi-Potions and Echo Screens: Dagger is not in this party, and Silent Voice can silence a character. Use an available Glass Armlet to reduce Water damage, keep Zidane stealing while the others heal or attack, and let Freya Jump out of danger. Vivi can use Thunder, but damaging magic can draw Silent Voice. The optional Tent trick may inflict Darkness or Silence, yet can restore the boss to full HP if it fails.",
      confidence: "partial",
      sourceIds: gizamalukePreparationSources,
    },
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
    encounterIds: [
      "encounter.burmecia.suburb.mimic-chest-1",
      "encounter.burmecia.suburb.mimic-chest-2",
      "encounter.burmecia.uptown.mimic-chest",
      "encounter.disc4.burmecia.suburb.mimic-chest-1",
      "encounter.disc4.burmecia.suburb.mimic-chest-2",
      "encounter.disc4.burmecia.uptown.mimic-chest",
    ],
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
    notes: ["Burmecia's three chest-triggered Mimics are modeled as separate fixed optional encounters, not as members of its ordinary random pool. A first-hand Disc IV run also records those chests as available on the return route when still unopened; prior-open and release-specific behavior is not established."],
  }, burmeciaChapterId, [...burmeciaEnemySources, "megane-kangaroo-disc4-burmecia-recovery"]),
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
    encounterIds: ["encounter.burmecia-region.world-map-pool", "encounter.cleyra-trunk.quicksand.random-pool", "encounter.cleyra-trunk.quicksand-pit.sand-scorpion", "encounter.pinnacle-rocks.random-pool"],
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
    notes: ["Sand Scorpion is part of the world-map regional roster around Burmecia and Cleyra, not the indoor Burmecia pool. Cleyra's Trunk also lists it in the quicksand-pit area and uses it for a separate forced pit-fall battle. Pinnacle Rocks route references list the same enemy there."],
  }, journeyToBurmeciaChapterId, [...burmeciaRegionSources, "gamefaqs-abilities-71891", ...cleyraEncounterSources]),
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

const cleyraEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.carrion-worm",
    name: "Carrion Worm",
    encounterIds: [
      "encounter.cleyra-trunk.path-to-cleyra.random-pool",
      "encounter.cleyra-trunk.sand-fork.random-pool",
      "encounter.cleyra-trunk.quicksand.random-pool",
    ],
    stats: enemyStats([["level", 9], ["HP", 259], ["MP", 345], ["EXP", 329], ["AP", 2], ["Gil", 319]]),
    steals: [enemyLoot("common", "game-item.annoyntment"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", "game-item.potion"), enemyLoot("common", "game-item.eye-drops"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.phoenix-down")],
    facts: [
      enemyFact("type", "Bug"),
      enemyFact("elemental-weakness", "Ice and Water"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Trouble Juice", [enemyListSourceId], "Inflicts Trouble; the status persists after battle unless cured."),
    ],
    blueMagic: [{ name: "Auto-Life", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [cleyraBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Ice or Water and learn Auto-Life", detail: "Carrion Worm is weak to Ice and Water. Quina can learn Auto-Life with Eat; cure Trouble with an Annoyntment because Trouble can remain after the fight.", sourceIds: [enemyListSourceId, "gamefaqs-cleyra-71891", "jegged-cleyra"] }],
    routeObjectiveIds: [cleyraBlueMagicObjectiveId],
    notes: ["Carrion Worm's Cleyra data is taken from the GameFAQs enemy table; its Blue Magic and HP are also called out by the chapter walkthroughs. No encounter odds or formation counts are inferred."],
  }, cleyraChapterId, cleyraEnemySources),
  chapterEnemy({
    id: "enemy.dragonfly",
    name: "Dragonfly",
    encounterIds: [
      "encounter.cleyra-trunk.bottom-sand-base.random-pool",
      "encounter.cleyra-trunk.sandfall.random-pool",
      "encounter.cleyra-trunk.path-to-cleyra.random-pool",
      "encounter.cleyra-trunk.sand-fork.random-pool",
      "encounter.cleyra-trunk.quicksand.random-pool",
      "encounter.gargan-roo.random-pool",
    ],
    stats: enemyStats([["level", 8], ["HP", 348], ["MP", 295], ["EXP", 249], ["AP", 1], ["Gil", 307]]),
    steals: [enemyLoot("common", "game-item.eye-drops"), enemyLoot("uncommon", "game-item.tent"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "Bug and Aerial"),
      enemyFact("elemental-weakness", "Ice and Wind"),
      enemyFact("elemental-resistance", "Earth (nullified)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Buzz", [enemyListSourceId], "Can inflict Berserk."),
      sourcedFact("attack", "Fira and physical attacks", [enemyListSourceId], "Fira deals Fire-elemental magic damage; physical hits deal moderate damage."),
    ],
    blueMagic: [{ name: "Matra Magic", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [cleyraBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Ice or Wind and learn Matra Magic", detail: "Ice and Wind exploit Dragonfly's weaknesses. Quina can learn Matra Magic with Eat; watch for Buzz's Berserk and its Fira spell.", sourceIds: [enemyListSourceId, "gamefaqs-cleyra-71891", "jegged-cleyra"] }],
    routeObjectiveIds: [cleyraBlueMagicObjectiveId],
    notes: ["Dragonfly appears in every listed Cleyra Trunk pool and the Gargan Roo random pool. GameFAQs lists it alongside Carrion Worm and Sand Scorpion in the wider Cleyra reference, while room-specific routes distinguish the Trunk pools. Quina is absent during the Gargan Roo passage, so learn Matra Magic earlier in Cleyra if desired."],
  }, cleyraChapterId, [...cleyraEnemySources, ...garganRooEnemySources]),
  chapterEnemy({
    id: "enemy.sand-golem",
    name: "Sand Golem",
    encounterIds: [
      "encounter.cleyra-trunk.bottom-sand-base.random-pool",
      "encounter.cleyra-trunk.sandfall.random-pool",
      "encounter.cleyra-trunk.sand-fork.random-pool",
    ],
    stats: enemyStats([["level", 11], ["HP", 1091], ["MP", 377], ["EXP", 0], ["AP", 0], ["Gil", 0]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("rare", "game-item.hi-potion")],
    facts: [
      enemyFact("type", "None"),
      enemyFact("elemental-weakness", "Ice"),
      enemyFact("elemental-resistance", "Water (absorbs)"),
      enemyFact("status-vulnerability", "None listed"),
      sourcedFact("attack", "Body counters", [enemyListSourceId], "Attacking the main body triggers counters; target the Core with Ice-elemental magic."),
    ],
    blueMagic: [],
    strategies: [{ title: "Target the Core with Ice magic", detail: "The published stats are for the Core, not the main body. Select the Core directly and use Ice magic; attacking the body can trigger counters. Defeating the Core ends the encounter and grants the body's listed EXP, AP, and Gil rewards.", sourceIds: [enemyListSourceId, "jegged-cleyra"] }],
    routeObjectiveIds: [],
    notes: ["GameFAQs explicitly labels 1,091 HP, 377 MP, Level 11, and zero individual rewards as Core statistics; defeating it also defeats the Sand Golem body and awards 677 EXP, 2 AP, and 589 Gil plus possible drops. The record preserves the component/table distinction in its strategy."],
  }, cleyraChapterId, cleyraEnemySources),
  chapterEnemy({
    id: "enemy.zuu",
    name: "Zuu",
    encounterIds: [
      "encounter.cleyra-trunk.bottom-sand-base.random-pool",
      "encounter.cleyra-trunk.quicksand.random-pool",
    ],
    stats: enemyStats([["level", 8], ["HP", 1149], ["MP", 293], ["EXP", 320], ["AP", 2], ["Gil", 384]]),
    steals: [enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.ore"), enemyLoot("semi-rare", "game-item.hi-potion"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", "game-item.potion"), enemyLoot("common", "game-item.phoenix-down"), enemyLoot("uncommon", "game-item.ether"), enemyLoot("rare", "game-item.hi-potion")],
    facts: [
      enemyFact("type", "Aerial"),
      enemyFact("elemental-weakness", "Ice, Wind, and Water"),
      enemyFact("elemental-resistance", "Earth (nullified)"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Aera and Swallow", [enemyListSourceId], "Aera deals heavy Wind-elemental damage; Swallow ejects a character from battle."),
      sourcedFact("attack", "White Wind counter", [enemyListSourceId], "Zuu can counter damage with White Wind."),
    ],
    blueMagic: [{ name: "White Wind", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [cleyraBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Ice, Wind, or Water and learn White Wind", detail: "Zuu is weak to Ice, Wind, and Water but nullifies Earth. Quina can learn White Wind with Eat; beware Aera damage and Swallow's eject effect.", sourceIds: [enemyListSourceId, "gamefaqs-cleyra-71891", "jegged-cleyra"] }],
    routeObjectiveIds: [cleyraBlueMagicObjectiveId],
    notes: ["Zuu is listed in the bottom/sand-base and quicksand/upper-climb Cleyra pools. The Cleyra walkthroughs identify it as Quina's White Wind teacher."],
  }, cleyraChapterId, cleyraEnemySources),
  chapterEnemy({
    id: "enemy.soldier-a",
    name: "Soldier [A]",
    encounterIds: [
      "encounter.cleyra-trunk.return.whirlpool-soldiers",
      "encounter.cleyra-trunk.return.sand-pit-soldiers",
      "encounter.cleyra-trunk.return.bridge-cave-soldiers",
      "encounter.cleyra-assault.first-soldiers",
      "encounter.cleyra-assault.soldiers-and-type-b",
      "encounter.cleyra-assault.final-soldiers",
    ],
    stats: enemyStats([["level", 10], ["HP", 523], ["MP", 358], ["EXP", 400], ["AP", 1], ["Gil", 311]]),
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("semi-rare", "game-item.echo-screen"), enemyLoot("rare", "game-item.phoenix-pinion")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "Human"),
      enemyFact("elemental-weakness", "None listed"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
    ],
    blueMagic: [],
    strategies: [{ title: "Use Man Eater or status control", detail: "The Cleyra Soldier is a Human-type enemy and appears in fixed groups during the Trunk return and settlement assault. Man Eater and status control help shorten these fights; conserve MP and healing for Antlion and Beatrix.", sourceIds: [enemyListSourceId, "gamefaqs-cleyra-71891", "cavesofnarshe-cleyra-walkthrough"] }],
    routeObjectiveIds: [],
    notes: ["This is the Level 10, 523-HP Cleyra variant (Soldier [A]), distinct from Soldier [B], the Level 9, 459-HP Alexandria variant. GameFAQs enemy list and independent tables place Soldier [A] in Cleyra; settlement fight guides often shorten its name to Soldier."],
  }, cleyraChapterId, cleyraEnemySources),
  chapterEnemy({
    id: "enemy.type-b",
    name: "Type B",
    encounterIds: [
      "encounter.cleyra-assault.entrance-type-b",
      "encounter.cleyra-assault.first-type-b-pair",
      "encounter.cleyra-assault.soldiers-and-type-b",
    ],
    stats: enemyStats([["level", 10], ["HP", 526], ["MP", 361], ["EXP", 373], ["AP", 1], ["Gil", 321]]),
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.hi-potion"), enemyLoot("semi-rare", "game-item.ether"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.remedy"), enemyLoot("rare", "game-item.phoenix-down")],
    facts: [
      enemyFact("type", "Human"),
      enemyFact("elemental-weakness", "None listed"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
    ],
    blueMagic: [],
    strategies: [{ title: "Finish the scripted waves efficiently", detail: "Type B is a Human-type Black Mage and cannot be eaten by Quina. The Cleyra assault uses it in three fixed groups; Man Eater and ordinary attacks are effective options.", sourceIds: [enemyListSourceId, "gamefaqs-cleyra-71891", "jegged-cleyra"] }],
    routeObjectiveIds: [],
    notes: ["The Type B record uses the Cleyra enemy table's stats and loot. Its appearances are modeled as fixed assault groups rather than a random settlement pool."],
  }, cleyraChapterId, cleyraEnemySources),
  chapterBoss({
    id: "enemy.antlion-cleyra",
    name: "Antlion (Cleyra)",
    encounterIds: ["encounter.cleyra.antlion"],
    stats: [
      ...crossCheckedStats([["level", 16], ["HP", 3938], ["MP", 3950]], ["gamefaqs-cleyra-71891", "elitegrindlab-cleyra"]),
      ...sourcedStats([["EXP", 0], ["AP", 5], ["Gil", 1616]], cleyraBossSources),
    ],
    steals: [
      sourcedLoot("common", "game-item.annoyntment", cleyraBossSources),
      sourcedLoot("uncommon", "game-item.mythril-vest", cleyraBossSources),
      sourcedLoot("semi-rare", "game-item.gold-helm", cleyraBossSources),
      sourcedLoot("rare", null, cleyraBossSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.annoyntment", cleyraBossSources),
      sourcedLoot("common", "game-item.ether", cleyraBossSources),
      sourcedLoot("uncommon", "game-item.ether", cleyraBossSources),
      sourcedLoot("rare", "game-item.ether", cleyraBossSources),
    ],
    facts: [
      sourcedFact("type", "None", cleyraBossSources),
      sourcedFact("elemental-weakness", "Ice", cleyraBossSources),
      sourcedFact("elemental-resistance", "Water (absorbs)", cleyraBossSources),
      sourcedFact("status-vulnerability", "Darkness, Silence, Sleep, and Slow", cleyraBossSources),
      sourcedFact("attack", "Sandstorm", cleyraBossSources, "Reduces the whole party to single-digit HP and inflicts Darkness."),
      sourcedFact("attack", "Trouble Mucous, Fira, and Counter Horn", cleyraBossSources, "Trouble Mucous inflicts Trouble; Fira deals Fire damage; Counter Horn can retaliate against damage."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Slow or Sleep it while Zidane steals", detail: "Try to steal Annoyntment, Mythril Vest, and Gold Helm before ending this one-time fight. Slow or Sleep can buy time if they land; use Ice and avoid Water, cure Trouble with Annoyntment, and heal immediately after Sandstorm. Remove Counter if equipped so an automatic physical counter does not provoke Counter Horn.", sourceIds: ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra", "kamigame-antlion"] },
      { title: "Keep its drop table separate from steals", detail: "Annoyntment is the Always drop, while the three conditional drop slots list Ether. This is separate from the Annoyntment, Mythril Vest, and Gold Helm steal table.", sourceIds: ["gamefaqs-cleyra-71891", "elitegrindlab-cleyra", "cavesofnarshe-enemies"] },
    ],
    preparationGuidance: {
      levelRationale: "Antlion's listed Level 16 is the enemy stat, not a party-level target. The reviewed standard-route and boss guides do not provide a normal-party level recommendation, so this profile sets none.",
      difficultyAssessment: "One PlayStation boss FAQ labels Antlion Tough. This is a subjective single-source rating, not a cross-source or gameplay-tested assessment.",
      optionalGrinding: "The reviewed standard-route sources do not prescribe extra grinding or a party-level target. Optional Cleyra Trunk encounters can be used for desired Blue Magic or ability AP; no numeric grind target is supported.",
      setupAdvice: "The Cleyra Antlion party is Zidane, Freya, Vivi, and Quina, without Dagger's White Magic. Carry healing items and Phoenix Downs, Annoyntments for Trouble, and Remedies (or Quina's Angel's Snack if already learned) for Sandstorm's Darkness; Quina's White Wind helps restore party HP if learned from Zuu. Remove Counter from anyone who has it equipped and favor Vivi's Ice magic: Counter Horn can punish physical damage, and Antlion absorbs Water. Zidane can pursue the three listed steals, especially Gold Helm if needed. Slow and Sleep are listed vulnerabilities; when Antlion is asleep, avoid waking it with physical attacks. Heal promptly after Sandstorm, which drops the party to single-digit HP and inflicts Darkness. Kamigame also recommends Tents as a status tactic, but the guide does not rely on a guaranteed effect.",
      confidence: "partial",
      sourceIds: antlionPreparationSources,
    },
    routeObjectiveIds: [cleyraAntlionStealsObjectiveId],
    notes: ["The boss table's three named steal targets remain linked to the existing one-time objective and recovery paths. GameFAQs and independent sources differ on steal probabilities; this record stores the item slots without publishing odds. Caves of Narshe reports Ether in all three conditional drop slots."],
  }, cleyraChapterId, antlionPreparationSources, [cleyraAntlionStealsMissableId], [cleyraAntlionStealsCutoffId]),
  chapterBoss({
    id: "enemy.beatrix-cleyra",
    name: "Beatrix (Cleyra)",
    encounterIds: ["encounter.cleyra.beatrix"],
    stats: [
      ...crossCheckedStats([["level", 17], ["HP", 4736], ["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-cleyra-71891", "cavesofnarshe-enemies"]),
      { field: "MP", value: 3964, sourceIds: ["gamefaqs-cleyra-71891", "cavesofnarshe-enemies", "elitegrindlab-cleyra"], verification: "disputed" },
      { field: "MP", value: 3694, sourceIds: ["gamefaqs-boss-guide-31490"], verification: "disputed" },
    ],
    steals: [
      sourcedLoot("common", "game-item.phoenix-down", cleyraBossSources),
      sourcedLoot("uncommon", "game-item.thunder-gloves", cleyraBossSources),
      sourcedLoot("semi-rare", "game-item.ice-brand", cleyraBossSources),
      sourcedLoot("rare", null, cleyraBossSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, cleyraBossSources, "Nothing"),
      sourcedLoot("common", null, cleyraBossSources, "Nothing"),
      sourcedLoot("uncommon", null, cleyraBossSources, "Nothing"),
      sourcedLoot("rare", null, cleyraBossSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", cleyraBossSources),
      sourcedFact("elemental-weakness", "None listed", cleyraBossSources),
      sourcedFact("elemental-resistance", "None listed", cleyraBossSources),
      sourcedFact("status-vulnerability", "Slow", cleyraBossSources),
      sourcedFact("attack", "Shock and Stock Break", cleyraBossSources, "Shock deals heavy single-target damage. At the end of the scripted battle, Stock Break reduces the party to 1 HP."),
      sourcedFact("attack", "Cure", ["gamefaqs-cleyra-71891"], "Beatrix can heal herself during this encounter."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal during the scripted ten-turn window", detail: "Try for Phoenix Down, Thunder Gloves, and Ice Brand. Slow Beatrix, put vulnerable characters in the back row, and keep the party alive; the battle ends after ten turns or if her HP reaches zero, followed by Stock Break.", sourceIds: ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "elitegrindlab-cleyra"] },
      { title: "Treat Ice Brand as a meaningful one-time target", detail: "Ice Brand is in the Semi-Rare steal slot for this encounter. The window is still short, but the route sources consider it a reasonable target; the item remains obtainable later if missed.", sourceIds: ["gamefaqs-cleyra-71891", "gamefaqs-boss-guide-31490", "elitegrindlab-cleyra"] },
    ],
    routeObjectiveIds: [cleyraBeatrixStealsObjectiveId],
    notes: ["Cleyra Beatrix is distinct from her Burmecia profile. GameFAQs and Caves of Narshe cross-check Level 17, 4,736 HP, and 3,964 MP; the older Blackestmage boss guide prints 3,694 MP, retained here as a disputed claim. Sources agree on the one-time steal list, but published steal rates are omitted."],
  }, cleyraChapterId, [...cleyraBossSources, "gamefaqs-boss-guide-31490"], [cleyraBeatrixStealsMissableId], [cleyraBeatrixStealsCutoffId]),
];

const earlyDaliEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.carve-spider",
    name: "Carve Spider",
    encounterIds: ["encounter.nolrich-heights.world-map-pool", "encounter.lindblum-plateau.mountain-pool", "encounter.lindblum-plateau.forest-pool", "encounter.bentini-heights.world-map-pool"],
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
    encounterIds: ["encounter.nolrich-heights.world-map-pool", "encounter.gunitas-basin.world-map-pool", "encounter.bentini-heights.world-map-pool"],
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
    preparationGuidance: {
      suggestedLevelRange: { min: 5, max: 6 },
      levelRationale: "Kamigame recommends party Lv. 5–6 or higher as an HP buffer against Black Waltz 2's party-target Fira. This is a single Japanese source that does not identify its platform or build; the range is an optional benchmark, not a minimum or cap. The reviewed original PlayStation walkthroughs list the boss at Lv. 6 but do not establish a normal-route party-level target.",
      optionalGrinding: "No mandatory grinding is documented. Dali route sources emphasize steals, equipment, and healing rather than an encounter quota; if the party feels underprepared, extra leveling is optional and no fixed number of battles is supported.",
      setupAdvice: "Before boarding the Cargo Ship, equip Steiner with strong available gear and Bird Killer if learned. Keep the men healed before crossing Black Waltz 2 below half HP, which can trigger party-target Fira; avoid Silk Shirt on them if possible because it makes them weak to Fire. Use Dagger's Cure or Potions, avoid Vivi's Black Magic when it draws stronger -ara counters, and keep at least one male ally alive so Dagger cannot be left alone for Hypnotize.",
      confidence: "partial",
      sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali", "kamigame-dali-black-waltz-2"],
    },
    routeObjectiveIds: [blackWaltz2StealsObjectiveId],
    notes: [
      "Black Waltz 2's four drop slots all list Ether: one guaranteed slot plus up to three conditional additional copies. Caves of Narshe summarizes this as Ether ×4; several route summaries mention only one.",
      "GameFAQs lists Mini as a vulnerability, while Final Fantasy Wiki lists Mini among immunities. The catalog keeps the disagreement rather than resolving it without a direct game check.",
      "HP is listed as 1,030 by the cross-checked sources; StrategyWiki's 1,000 figure is an apparent rounding or transcription difference and is not selected as the record value.",
      "Walkthroughs differ on the encounter's field location. The dossier uses the Dali story chapter and keeps Observatory Mountain versus cargo-ship loading-area claims explicit in its encounter note.",
    ],
  }, daliChapterId, blackWaltz2PreparationSources, [blackWaltz2StealsMissableId], [blackWaltz2StealsCutoffId]),
];

const cargoShipEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.black-waltz-3-cargo-ship",
    name: "Black Waltz 3 (Cargo Ship)",
    encounterIds: ["encounter.cargo-ship.black-waltz-3"],
    stats: [
      { field: "level", value: 7, sourceIds: ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship", "rpgclassics-bestiary-a-c"], verification: "cross-checked" },
      { field: "HP", value: 1128, sourceIds: ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship", "rpgclassics-bestiary-a-c"], verification: "cross-checked" },
      { field: "MP", value: 2080, sourceIds: ["gamefaqs-cargo-ship-71891", "rpgclassics-bestiary-a-c"], verification: "cross-checked" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-cargo-ship-71891", "elitegrindlab-cargo-ship"], verification: "cross-checked" },
      { field: "AP", value: 0, sourceIds: ["gamefaqs-cargo-ship-71891", "elitegrindlab-cargo-ship"], verification: "cross-checked" },
      { field: "Gil", value: 0, sourceIds: ["gamefaqs-cargo-ship-71891", "elitegrindlab-cargo-ship"], verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.steepled-hat", ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship", "rpgclassics-bestiary-a-c", "elitegrindlab-cargo-ship"]),
      sourcedLoot("uncommon", "game-item.linen-cuirass", ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship", "rpgclassics-bestiary-a-c", "elitegrindlab-cargo-ship"]),
      sourcedLoot("semi-rare", "game-item.silver-gloves", ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship", "rpgclassics-bestiary-a-c", "elitegrindlab-cargo-ship"]),
      sourcedLoot("rare", null, ["gamefaqs-cargo-ship-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, ["gamefaqs-cargo-ship-71891"], "Nothing"),
      sourcedLoot("common", null, ["gamefaqs-cargo-ship-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-cargo-ship-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-cargo-ship-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human, Aerial", ["gamefaqs-cargo-ship-71891"]),
      sourcedFact("elemental-weakness", "None listed", ["gamefaqs-cargo-ship-71891"]),
      sourcedFact("elemental-weakness", "Wind (reported by other walkthroughs)", ["cavesofnarshe-cargo-ship", "elitegrindlab-cargo-ship"]),
      sourcedFact("elemental-resistance", "None listed", ["gamefaqs-cargo-ship-71891"]),
      sourcedFact("status-vulnerability", "Darkness, Mini, and Slow", ["gamefaqs-cargo-ship-71891"]),
      sourcedFact("attack", "Hit, Fira, Blizzard, and Thundara", ["gamefaqs-cargo-ship-71891"]),
      sourcedFact("attack", "Airborne Thundara", ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship"], "When airborne, its Thundara can target the entire party; standard physical attacks miss while it is in the air."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Attempt the three one-time steals before finishing the battle", detail: "Use Zidane to attempt Steepled Hat, Linen Cuirass, and Silver Gloves while Vivi and Steiner manage damage and healing. Silver Gloves is the rare steal; the encounter ends when Black Waltz 3 flees, and Lindblum later stocks all three item types.", sourceIds: cargoShipEnemySources },
      { title: "Prepare for its airborne Thundara", detail: "Keep the party's HP safe when Black Waltz 3 takes flight and casts Thundara on everyone. Standard physical attacks will miss while it is airborne; Vivi begins the battle in Trance.", sourceIds: ["gamefaqs-cargo-ship-71891", "jegged-cargo-ship"] },
    ],
    preparationGuidance: {
      levelRationale: "The reviewed original PlayStation GameFAQs route lists Black Waltz 3 at Level 7; that is the boss's own stat, not a party target. Jegged and the other reviewed route sources give tactics but do not establish a normal-route party-level recommendation. No numeric party target is published here.",
      optionalGrinding: "The Cargo Ship has no random encounters, shop, inn, or save moogle, so any optional leveling or supply check must happen in Dali before boarding. The reviewed routes do not require extra encounters or a fixed grind quota.",
      setupAdvice: "Before boarding, check Zidane, Vivi, and Steiner's gear, learned abilities, and healing items; Dagger is not in the battle party. The reviewed routes say Vivi starts in Trance and Black Waltz 3 does not counter his magic, so use his spells while Zidane attempts the three steals. Heal through party-wide Thundara when the boss is airborne; physical attacks miss until it lands. The level advice is limited to the boss's Level 7 stat, not a recommended party level.",
      confidence: "partial",
      sourceIds: cargoShipPreparationSources,
    },
    routeObjectiveIds: [cargoShipBlackWaltzStealsObjectiveId],
    notes: [
      "This Level 7, 1,128-HP record is the Cargo Ship form, distinct from the Level 9 South Gate rematch and its different three-item steal table.",
      "GameFAQs lists no elemental weakness, while Caves of Narshe and EliteGrindLab report Wind. The route does not depend on that disputed weakness. Published steal odds differ in wording and rounding, so only the source slot classes are modeled.",
      "RPGClassics' bestiary table lists Silver Gloves, matching GameFAQs, Jegged, and EliteGrindLab; its separate Cargo Ship walkthrough says Silver Greaves. The item route follows the cross-checked Gloves name and keeps the prose discrepancy visible.",
    ],
  }, cargoShipChapterId, cargoShipEnemySources, [cargoShipBlackWaltzStealsMissableId], [cargoShipBlackWaltzStealsCutoffId]),
];

const trenoGriffinEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.griffin-treno-arena",
    name: "Griffin (Treno arena)",
    encounterIds: ["encounter.treno.griffin-challenge"],
    stats: [
      { field: "level", value: 16, sourceIds: ["elitegrindlab-treno"], verification: "single-source" },
      { field: "HP", value: 1470, sourceIds: ["elitegrindlab-treno"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-weapon-shop-monsters-71891"], verification: "single-source" },
      { field: "AP", value: 0, sourceIds: ["gamefaqs-weapon-shop-monsters-71891"], verification: "single-source" },
      { field: "Gil", value: 0, sourceIds: ["gamefaqs-weapon-shop-monsters-71891"], verification: "single-source" },
    ],
    steals: [],
    drops: [],
    facts: [],
    blueMagic: [],
    strategies: [
      { title: "Use Steiner's recommended equipment", detail: "Jegged recommends Blood Sword, Gold Choker, and Bird Killer: the sword restores HP on each hit, the accessory halves Wind damage, and Bird Killer increases damage against the Griffin.", sourceIds: ["jegged-treno"] },
      { title: "Choose Quina if Twister is ready", detail: "RPGClassics also recommends fighting with Quina and casting Twister if the spell has been learned.", sourceIds: ["rpgclassics-treno-monsters"] },
    ],
    routeObjectiveIds: [trenoGriffinObjectiveId],
    notes: [
      "EliteGrindLab gives the arena form Level 16 and 1,470 HP. These match the ordinary Griffin's Enemy List profile, but this is a separate arena record because the arena version has different reward and battle-result behavior.",
      "GameFAQs says Treno arena monsters award no EXP, AP, Gil, or item drops beyond their fixed victory prize. The Tonberry Card is linked to the separate card objective; the normal Griffin's Ore steal and Peridot/Hi-Potion/Ether drops are not copied here. The reviewed arena sources do not provide a separate steal table.",
      "This is the first, Disc II Knight's House challenge. Skipping it permanently removes the arena fight and its direct reward event; the Tonberry Card type remains recoverable from other sources.",
    ],
  }, trenoChapterId, trenoGriffinSources, [trenoGriffinMissableId], [trenoGriffinCutoffId]),
];

const summitStationEnemyRecords: EnemyRecord[] = [
  chapterBoss({
    id: "enemy.black-waltz-3-rematch",
    name: "Black Waltz 3 (Summit Station rematch)",
    encounterIds: ["encounter.summit-station.black-waltz-3-rematch"],
    stats: [
      { field: "level", value: 9, sourceIds: ["gamefaqs-journey-to-treno-71891", "jegged-summit-station"], verification: "cross-checked" },
      { field: "HP", value: 1292, sourceIds: ["gamefaqs-journey-to-treno-71891", "jegged-summit-station"], verification: "disputed" },
      { field: "HP", value: 1300, sourceIds: ["strategywiki-summit-station"], verification: "disputed" },
      { field: "MP", value: 344, sourceIds: ["gamefaqs-journey-to-treno-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-journey-to-treno-71891"], verification: "single-source" },
      { field: "AP", value: 5, sourceIds: ["gamefaqs-journey-to-treno-71891", "elitegrindlab-south-gate"], verification: "cross-checked" },
      { field: "Gil", value: 864, sourceIds: ["gamefaqs-journey-to-treno-71891", "elitegrindlab-south-gate"], verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.steepled-hat", ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station"]),
      sourcedLoot("uncommon", "game-item.lightning-staff", ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station"]),
      sourcedLoot("semi-rare", "game-item.flame-staff", ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station"]),
      sourcedLoot("rare", null, ["gamefaqs-journey-to-treno-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, ["gamefaqs-journey-to-treno-71891"], "Nothing"),
      sourcedLoot("common", null, ["gamefaqs-journey-to-treno-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-journey-to-treno-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-journey-to-treno-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", ["gamefaqs-journey-to-treno-71891"]),
      sourcedFact("elemental-weakness", "None listed", ["gamefaqs-journey-to-treno-71891", "jegged-summit-station"]),
      sourcedFact("elemental-resistance", "None listed", ["gamefaqs-journey-to-treno-71891", "jegged-summit-station"]),
      sourcedFact("status-vulnerability", "Darkness, Mini, Sleep, and Slow", ["gamefaqs-journey-to-treno-71891"]),
      sourcedFact("attack", "Fire, Blizzard, Thunder, and Hit", ["gamefaqs-journey-to-treno-71891"], "The rematch retains the basic Level 1 elemental spells and physical Hit attack."),
      sourcedFact("attack", "Freeze", ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station"], "Inflicts Freeze; a physical hit while the target remains frozen causes an instant KO."),
      sourcedFact("attack", "Self-targeting attack", ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station"], "Black Waltz 3 does not target Dagger. If she is the only survivor, it attacks itself each turn."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal before ending the one-time fight", detail: "Have Marcus attempt Steepled Hat, Lightning Staff, and Flame Staff before attacking to finish the encounter. Exact steal percentages are omitted because the references differ in their labels and rates.", sourceIds: ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station"] },
      { title: "Let Dagger heal and protect frozen allies", detail: "Black Waltz 3 ignores Dagger, so use her to heal the others. Freeze prevents actions, and a normal physical hit can instantly KO a frozen ally; use Shell on Marcus and Steiner if available.", sourceIds: ["gamefaqs-journey-to-treno-71891", "jegged-summit-station", "gamerguides-summit-station"] },
    ],
    routeObjectiveIds: [summitStationBlackWaltzStealsObjectiveId],
    notes: [
      "The rematch is a distinct enemy version from the Cargo Ship fight. GameFAQs and Jegged list Level 9 and 1,292 HP; StrategyWiki reports 1,300 HP, which appears to be a rounded value.",
      "GameFAQs places Flame Staff in the semi-rare steal slot; Jegged and Gamer Guides describe it as the rare steal. Exact rates and this slot-label difference are retained as source disagreements rather than normalized.",
      "The enemy and encounter are based on PlayStation walkthrough sources; parity with remastered releases has not been audited.",
    ],
  }, summitStationChapterId, summitStationEnemySources, [summitStationBlackWaltzStealsMissableId], [summitStationBlackWaltzStealsCutoffId]),
  chapterEnemy({
    id: "enemy.trick-sparrow",
    name: "Trick Sparrow",
    encounterIds: ["encounter.bentini-heights.world-map-pool"],
    stats: [
      { field: "level", value: 5, sourceIds: [enemyListSourceId], verification: "single-source" },
      { field: "HP", value: 191, sourceIds: [enemyListSourceId], verification: "single-source" },
      { field: "MP", value: 250, sourceIds: [enemyListSourceId], verification: "single-source" },
      { field: "EXP", value: 65, sourceIds: [enemyListSourceId], verification: "single-source" },
      { field: "AP", value: 1, sourceIds: [enemyListSourceId], verification: "single-source" },
      { field: "Gil", value: 198, sourceIds: [enemyListSourceId], verification: "single-source" },
    ],
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId]),
      sourcedLoot("uncommon", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("uncommon", "game-item.echo-screen", [enemyListSourceId]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Aerial", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Wind", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "Earth (nullified)", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Drain", [enemyListSourceId], "The enemy table identifies Drain; damage depends on the encountered version and target."),
    ],
    blueMagic: [{ name: "Matra Magic", command: "Eat", sourceIds: [enemyListSourceId], objectiveIds: [] }],
    strategies: [
      { title: "Use Wind and watch for Drain", detail: "Wind exploits Trick Sparrow's listed weakness, while its Drain spell can recover HP. Quina can learn Matra Magic by eating it when she is in the party; she is not part of the immediate Summit Station team.", sourceIds: [enemyListSourceId, "gamefaqs-journey-to-treno-71891"] },
    ],
    routeObjectiveIds: [],
    notes: ["GameFAQs describes Trick Sparrow as the same enemy across areas and says the Festival version differs only in drops. Its separate Hunt record preserves the event-specific reward and steal disagreement; this profile records the ordinary enemy table."],
  }, summitStationChapterId, bentiniHeightsEnemySources),
];

const garganRooEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.crawler",
    name: "Crawler",
    encounterIds: ["encounter.gargan-roo.random-pool"],
    stats: enemyStats([["level", 10], ["HP", 625], ["MP", 358], ["EXP", 480], ["AP", 2], ["Gil", 323]]),
    steals: [
      enemyLoot("common", "game-item.antidote"),
      enemyLoot("uncommon", "game-item.phoenix-down"),
      enemyLoot("semi-rare", "game-item.hi-potion"),
      enemyLoot("rare", "game-item.phoenix-pinion"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"),
      enemyLoot("common", "game-item.ore"),
      enemyLoot("uncommon", "game-item.ether"),
      enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("type", "Bug"),
      enemyFact("elemental-weakness", "Ice"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Berserk, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      sourcedFact("attack", "Claws", [enemyListSourceId], "A physical attack that typically deals around 100 damage."),
      sourcedFact("attack", "Stomach", [enemyListSourceId], "A physical attack that typically deals around 100 damage; GameFAQs describes it as slightly stronger than Claws."),
      sourcedFact("attack", "Drain", [enemyListSourceId], "A physical attack that typically deals around 100 damage; GameFAQs describes it as slightly stronger than Claws."),
    ],
    blueMagic: [],
    strategies: [{ title: "Use Ice and defeat it before its attacks add up", detail: "Crawler is weak to Ice. Its Claws, Stomach, and Drain attacks can each deal roughly 100 damage, so remove it promptly if the party is under-geared.", sourceIds: [enemyListSourceId, "gamefaqs-treno-71891", "jegged-gargan-roo"] }],
    routeObjectiveIds: [],
    notes: ["The GameFAQs enemy table supplies the stat, steal, drop, type, and weakness profile. Gargan Roo is also described as an optional grinding area; its Crawler formations and encounter rates are not modeled here."],
  }, garganRooChapterId, garganRooEnemySources),
  chapterBoss({
    id: "enemy.ralvurahva",
    name: "Ralvurahva",
    encounterIds: ["encounter.gargan-roo.ralvurahva"],
    stats: [
      { field: "level", value: 13, sourceIds: ["gamefaqs-treno-71891", "jegged-gargan-roo", "elitegrindlab-gargan-roo"], verification: "cross-checked" },
      { field: "HP", value: 2296, sourceIds: ["gamefaqs-treno-71891", "jegged-gargan-roo", "elitegrindlab-gargan-roo"], verification: "disputed" },
      { field: "HP", value: 2200, sourceIds: ["elitegrindlab-gargan-roo"], verification: "disputed" },
      { field: "HP", value: 2500, sourceIds: ["elitegrindlab-gargan-roo"], verification: "disputed" },
      { field: "MP", value: 3649, sourceIds: ["gamefaqs-treno-71891"], verification: "single-source" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-treno-71891", "elitegrindlab-gargan-roo"], verification: "cross-checked" },
      { field: "AP", value: 0, sourceIds: ["gamefaqs-treno-71891", "elitegrindlab-gargan-roo"], verification: "cross-checked" },
      { field: "Gil", value: 0, sourceIds: ["gamefaqs-treno-71891", "elitegrindlab-gargan-roo"], verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.bone-wrist", garganRooBossSources),
      sourcedLoot("uncommon", "game-item.mythril-fork", garganRooBossSources),
      sourcedLoot("semi-rare", null, ["gamefaqs-treno-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-treno-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, garganRooBossSources, "Nothing"),
      sourcedLoot("common", null, garganRooBossSources, "Nothing"),
      sourcedLoot("uncommon", null, garganRooBossSources, "Nothing"),
      sourcedLoot("rare", null, garganRooBossSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "None", ["gamefaqs-treno-71891"]),
      sourcedFact("elemental-weakness", "Ice", ["gamefaqs-treno-71891", "elitegrindlab-gargan-roo"]),
      sourcedFact("elemental-resistance", "None listed", ["gamefaqs-treno-71891"]),
      sourcedFact("status-vulnerability", "Darkness and Slow", ["gamefaqs-treno-71891", "jegged-gargan-roo"]),
      sourcedFact("attack", "String", ["gamefaqs-treno-71891"], "Deals roughly 170 damage and can inflict Slow."),
      sourcedFact("attack", "Devil's Kiss", ["gamefaqs-treno-71891"], "Deals roughly 140 damage and can inflict Poison."),
      sourcedFact("attack", "Blizzara", ["gamefaqs-treno-71891"], "Deals roughly 125 damage."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Take the steals before reducing it to 0 HP", detail: "Marcus can use Attack, Steal, and Item but has no abilities. Keep him attempting Bone Wrist and Mythril Fork while Dagger heals with Cure or tries Blind; Steiner can handle most of the damage after the steals. Ralvurahva escapes at 0 HP and awards no spoils.", sourceIds: garganRooBossSources },
      { title: "Protect the temporary party from status effects", detail: "Equip Antibody on Dagger and Steiner if available. Blind and Slow are listed vulnerabilities; the boss can inflict Slow with String and Poison with Devil's Kiss.", sourceIds: ["gamefaqs-treno-71891", "jegged-gargan-roo", "gamerguides-gargan-roo"] },
    ],
    routeObjectiveIds: [garganRooRalvurahvaObjectiveId],
    notes: [
      "GameFAQs, Jegged, and EliteGrindLab's publisher comparison support Level 13 and HP 2,296. EliteGrindLab also reports outlier HP claims of 2,200 and 2,500 from other references, so all three values remain marked disputed.",
      "The boss's steal tiers are Bone Wrist then Mythril Fork, but published odds disagree: some route tables print 70%/23%, while other sources imply 100%/25%. The catalog records the items and tiers without encoding percentages.",
      "The temporary party is Dagger, Steiner, and Marcus. Quina is not available for the Gargan Roo Dragonfly encounter; the area random pool records the roster without formation probabilities.",
      "Ralvurahva escapes at 0 HP, so it grants no EXP, AP, Gil, or drops. The item steals are the only rewards from this encounter.",
      "The profile is based on PlayStation walkthrough sources; parity with remastered releases has not been audited.",
    ],
  }, garganRooChapterId, garganRooBossSources, [garganRooRalvurahvaMissableId], [garganRooRalvurahvaCutoffId]),
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
    encounterIds: ["encounter.lindblum-area.lowlands-pool", "encounter.bentini-heights.world-map-pool"],
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
    encounterIds: ["encounter.lindblum-area.lowlands-pool", "encounter.bentini-heights.world-map-pool"],
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
  chapterEnemy({
    id: "enemy.sahagin",
    name: "Sahagin",
    encounterIds: ["encounter.qus-marsh.outer-continent-disc-ii-pool"],
    stats: [
      ...crossCheckedStats([["HP", 1375]], [enemyListSourceId, "elitegrindlab-qus-marsh"]),
      ...sourcedStats([["level", 18], ["MP", 585], ["EXP", 1368], ["AP", 2], ["Gil", 684]], [enemyListSourceId]),
    ],
    steals: [enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", "game-item.ether")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Nothing"), enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether")],
    facts: [
      enemyFact("type", "None"), enemyFact("elemental-weakness", "Lightning"), enemyFact("elemental-resistance", "Water (absorbs)"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Water-Gun", "The enemy-list route warns that this attack can deal around 400 damage when Sahagin is first encountered on the Outer Continent."),
      enemyFact("attack", "Shell", "Sahagin can hide in its shell and negate physical attacks."),
      enemyFact("attack", "Water", "Uses the Water spell against the party."),
    ],
    blueMagic: [{ name: "Aqua Breath", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "flactem-disc-2-fossil-roo-outer-continent"], objectiveIds: [outerContinentMarshBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Lightning and watch its shell", detail: "Sahagin is weak to Lightning and absorbs Water. Water-Gun can be dangerous at the party's first Outer Continent visit, and its shell stance can negate physical attacks; Quina can learn Aqua Breath with Eat if it is still missing.", sourceIds: [enemyListSourceId, "elitegrindlab-qus-marsh", "flactem-disc-2-fossil-roo-outer-continent"] }],
    routeObjectiveIds: [outerContinentMarshBlueMagicObjectiveId],
    notes: ["Sahagin is the Outer Continent Qu's Marsh teacher for Aqua Breath; Axolotl teaches the same spell in the first, Mist Continent marsh. The profile keeps the later area-specific form and HP cross-check separate."],
  }, outerContinentMarshChapterId, outerContinentMarshSources),
  chapterEnemy({
    id: "enemy.gigan-toad-b",
    name: "Gigan Toad [B]",
    encounterIds: ["encounter.qus-marsh.outer-continent-disc-ii-pool"],
    stats: [
      ...crossCheckedStats([["level", 7], ["HP", 297]], [enemyListSourceId, "elitegrindlab-qus-marsh"]),
      ...sourcedStats([["MP", 280], ["EXP", 0], ["AP", 0], ["Gil", 0]], [enemyListSourceId]),
    ],
    steals: [enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", null, "Nothing"), enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing")],
    drops: [enemyLoot("always", null, "Nothing"), enemyLoot("common", "game-item.potion"), enemyLoot("uncommon", "game-item.echo-screen"), enemyLoot("rare", null, "Nothing")],
    facts: [
      enemyFact("type", "None"), enemyFact("elemental-weakness", "Lightning"), enemyFact("elemental-resistance", "Water (absorbs)"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Glowing Eyes", "Can inflict Sleep."),
      enemyFact("attack", "Water and Blizzara", "The enemy-list strategy cautions that both are less effective than expected against this form."),
    ],
    blueMagic: [{ name: "Frog Drop", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "flactem-disc-2-fossil-roo-outer-continent"], objectiveIds: [outerContinentMarshBlueMagicObjectiveId] }],
    strategies: [{ title: "Learn Frog Drop and use Lightning", detail: "This stronger, level-7 table is a later variant of Gigan Toad [A], not a replacement for the first-marsh form. It is weak to Lightning, absorbs Water, and can put a character to sleep with Glowing Eyes. Quina can learn Frog Drop by eating it if the skill is still missing.", sourceIds: [enemyListSourceId, "elitegrindlab-qus-marsh", "flactem-disc-2-fossil-roo-outer-continent"] }],
    routeObjectiveIds: [outerContinentMarshBlueMagicObjectiveId],
    notes: ["GameFAQs identifies Gigan Toad [B] as a distinct level-7 variant with 297 HP and a different steal/drop table from the level-6, 242-HP Gigan Toad [A]. EliteGrindLab independently distinguishes the higher-level later-marsh form. This record is scoped to the Outer Continent marsh encounter."],
  }, outerContinentMarshChapterId, outerContinentMarshSources),
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

const lanarMarshEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.anemone",
    name: "Anemone",
    encounterIds: ["encounter.lanar-island.qus-marsh.anemone-opportunity", "encounter.blairsurpass.qus-marsh.anemone-opportunity"],
    stats: [
      ...crossCheckedStats([["level", 31], ["HP", 3586], ["MP", 1045], ["EXP", 5080], ["Gil", 1137]], [enemyListSourceId, "gamefaqs-item-locations-54996"]),
      { field: "AP", value: 2, sourceIds: [enemyListSourceId], verification: "disputed" },
      { field: "AP", value: 3, sourceIds: ["gamefaqs-item-locations-54996"], verification: "disputed" },
    ],
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId, "gamefaqs-item-locations-54996"]),
      sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId, "gamefaqs-item-locations-54996"]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.hi-potion", [enemyListSourceId, "gamefaqs-item-locations-54996"]),
      sourcedLoot("uncommon", "game-item.eye-drops", [enemyListSourceId, "gamefaqs-item-locations-54996"]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "gamefaqs-item-locations-54996"]),
    ],
    facts: [
      sourcedFact("type", "None", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Lightning", [enemyListSourceId, "gamefaqs-item-locations-54996"]),
      sourcedFact("elemental-resistance", "Water (halved)", [enemyListSourceId, "gamefaqs-item-locations-54996"]),
      sourcedFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Water and Blizzara", [enemyListSourceId], "Water and ice-elemental damage."),
      sourcedFact("attack", "Muccus", [enemyListSourceId], "Can inflict Berserk."),
    ],
    blueMagic: [{ name: "Bad Breath", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "gamefaqs-on-the-high-seas-71891", "jegged-blue-narciss", "gamerguides-side-questing-2", "gamefaqs-forgotten-continent-71891", "gamefaqs-qus-marsh-60521", "rpgclassics-disc-3-walkthrough"], objectiveIds: [lostContinentBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Quina to learn Bad Breath", detail: "Anemone is a repeatable Bad Breath teacher inside both Lanar Island and Blairsurpass Plains Qu's Marsh. It is weak to Lightning and can use Muccus to inflict Berserk; no one-time battle window is documented.", sourceIds: anemoneMarshSources }],
    routeObjectiveIds: [lostContinentBlueMagicObjectiveId],
    notes: [
      "The GameFAQs Enemy List gives 2 AP; the GameFAQs Item Location Guide gives 2–3 AP. Both source claims are retained as disputed.",
      "The Item Location Guide lists Anemone in both Lanar Island and Blairsurpass Plains Qu's Marshes; both repeatable Bad Breath opportunities are now modeled. Neither scoped opportunity claims a complete marsh roster, and Gigan Toad variant placements remain unresolved.",
    ],
  }, lanarMarshChapterId, anemoneMarshSources),
];

const outerContinentEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.cactuar",
    name: "Cactuar",
    encounterIds: [
      "encounter.outer-continent.dirt-pool", "encounter.forgotten-continent.blairsurpass-dirt-pool",
      "encounter.forgotten-continent.seaways-dirt-pool", "encounter.forgotten-continent.seaways-sunrise-dirt-pool",
    ],
    stats: [
      { field: "level", value: 1, sourceIds: [enemyListSourceId], verification: "disputed" },
      { field: "level", value: 30, sourceIds: ["gamefaqs-monster-list-20490", "jegged-world-map-cactuar"], verification: "disputed" },
      { field: "HP", value: 1939, sourceIds: cactuarStatSources, verification: "cross-checked" },
      { field: "MP", value: 1018, sourceIds: cactuarStatSources, verification: "cross-checked" },
      { field: "EXP", value: 4208, sourceIds: cactuarStatSources, verification: "cross-checked" },
      { field: "AP", value: 2, sourceIds: [enemyListSourceId, "jegged-world-map-cactuar"], verification: "disputed" },
      { field: "AP", value: 3, sourceIds: ["gamefaqs-monster-list-20490"], verification: "disputed" },
      { field: "Gil", value: 1021, sourceIds: cactuarStatSources, verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.phoenix-down", [enemyListSourceId, "jegged-world-map-cactuar"]),
      sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId, "jegged-world-map-cactuar"]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "jegged-world-map-cactuar"]),
    ],
    drops: [
      sourcedLoot("always", "game-item.hi-potion", [enemyListSourceId, "jegged-world-map-cactuar"]),
      sourcedLoot("common", "game-item.phoenix-down", [enemyListSourceId, "jegged-world-map-cactuar"]),
      sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId, "jegged-world-map-cactuar"]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "jegged-world-map-cactuar"]),
    ],
    facts: [
      sourcedFact("type", "None", cactuarStatSources),
      sourcedFact("elemental-weakness", "Fire", cactuarStatSources),
      sourcedFact("elemental-resistance", "Water (absorbs)", cactuarStatSources),
      sourcedFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "1,000 Needles", [enemyListSourceId, "jegged-world-map-cactuar"], "GameFAQs describes it as a counter; its fixed damage can be dangerous this early."),
      sourcedFact("attack", "Confuse", [enemyListSourceId, "jegged-world-map-cactuar"], "Can disrupt the party while attempting to Eat the Cactuar."),
      sourcedFact("attack", "Haste", ["jegged-world-map-cactuar"], "Can cast Haste on itself."),
    ],
    blueMagic: [{ name: "1,000 Needles", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "jegged-world-map-cactuar"], objectiveIds: [outerContinentBlueMagicObjectiveId, forgottenContinentBlueMagicRecoveryObjectiveId] }],
    strategies: [{ title: "Eat before finishing the Cactuar", detail: "Quina can learn 1,000 Needles with Eat. Its 1,000 Needles counter and Confuse can make the attempt costly; use Fire, prepare to heal, and cure Confuse as needed.", sourceIds: [enemyListSourceId, "jegged-world-map-cactuar"] }],
    routeObjectiveIds: [outerContinentBlueMagicObjectiveId, forgottenContinentBlueMagicRecoveryObjectiveId],
    notes: ["The later GameFAQs Enemy List gives Level 1 and AP 2; Jegged and the older GameFAQs Monster List give Level 30, and that older list prints AP 2–3. HP, MP, EXP, and Gil agree. Jegged's broad location list includes Magdalene Forest, but the detailed GameFAQs terrain table does not list Cactuar in that forest roster; that location difference remains unresolved."],
  }, outerContinentChapterId, cactuarSources),
  chapterEnemy({
    id: "enemy.goblin-mage",
    name: "Goblin Mage",
    encounterIds: ["encounter.outer-continent.dirt-pool", "encounter.outer-continent.grass-pool", "encounter.conde-petie-mountain-path.lucid-plains-pool", "encounter.journey-to-iifa-tree.pualei-plains-pool"],
    stats: [
      { field: "level", value: 15, sourceIds: goblinMageStatSources, verification: "cross-checked" },
      { field: "HP", value: 983, sourceIds: goblinMageStatSources, verification: "cross-checked" },
      { field: "MP", value: 485, sourceIds: goblinMageStatSources, verification: "cross-checked" },
      { field: "EXP", value: 913, sourceIds: goblinMageStatSources, verification: "cross-checked" },
      { field: "AP", value: 0, sourceIds: [enemyListSourceId], verification: "disputed" },
      { field: "AP", value: 1, sourceIds: ["gamefaqs-monster-list-20490", "jegged-world-map-goblin-mage"], verification: "disputed" },
      { field: "AP", value: 2, sourceIds: ["gamefaqs-monster-list-20490", "jegged-world-map-goblin-mage"], verification: "disputed" },
      { field: "Gil", value: 568, sourceIds: goblinMageStatSources, verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.potion", [enemyListSourceId, "jegged-world-map-goblin-mage"]),
      sourcedLoot("uncommon", "game-item.ore", [enemyListSourceId, "jegged-world-map-goblin-mage"]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("uncommon", "game-item.echo-screen", [enemyListSourceId, "jegged-world-map-goblin-mage"]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "None", goblinMageStatSources),
      sourcedFact("elemental-weakness", "None listed", goblinMageStatSources),
      sourcedFact("elemental-resistance", "None listed", goblinMageStatSources),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Vanish", [enemyListSourceId, "jegged-world-map-goblin-mage"], "The GameFAQs table warns that it may cast Vanish on itself, making magic useful."),
      sourcedFact("attack", "Axe and Thundara", ["jegged-world-map-goblin-mage"]),
    ],
    blueMagic: [{ name: "Goblin Punch", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "jegged-world-map-goblin-mage"], objectiveIds: [outerContinentBlueMagicObjectiveId] }],
    strategies: [{ title: "Eat if Goblin Punch is missing", detail: "Weaken the Goblin Mage and use Quina's Eat command. It may cast Vanish on itself, so keep a magical attack available if it does." , sourceIds: [enemyListSourceId, "jegged-world-map-goblin-mage"] }],
    routeObjectiveIds: [outerContinentBlueMagicObjectiveId],
    notes: ["GameFAQs lists 0 AP, while the older Monster List and Jegged report 1 or 2 AP. Jegged's broad location list includes Magdalene Forest, but the detailed GameFAQs terrain table does not list Goblin Mage in that forest roster; that location difference remains unresolved. Both listed steals and the Echo Screen uncommon drop are retained; formation-dependent appearance counts are recorded only in the terrain notes."],
  }, outerContinentChapterId, goblinMageSources),
  chapterEnemy({
    id: "enemy.griffin",
    name: "Griffin",
    encounterIds: [
      "encounter.outer-continent.dirt-pool", "encounter.outer-continent.grass-pool",
      "encounter.outer-continent.marsh-pool", "encounter.outer-continent.forest-pool",
      "encounter.outer-continent.beach-pool", "encounter.magdalene-forest.outer-forest-pool",
      "encounter.magdalene-forest.dead-forest-pool", "encounter.fossil-roo.random-pool",
    ],
    stats: crossCheckedStats([["level", 16], ["HP", 1470], ["MP", 602], ["EXP", 1858], ["AP", 2], ["Gil", 602]], griffinStatSources),
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId, "jegged-world-map-griffin"]),
      sourcedLoot("uncommon", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.peridot", [enemyListSourceId, "jegged-world-map-griffin"]),
      sourcedLoot("common", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId, "jegged-world-map-griffin"]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "jegged-world-map-griffin"]),
    ],
    facts: [
      sourcedFact("type", "Aerial", griffinStatSources),
      sourcedFact("elemental-weakness", "Wind", griffinStatSources),
      sourcedFact("elemental-resistance", "Earth (nullifies)", griffinStatSources),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Aera", [enemyListSourceId, "jegged-world-map-griffin"], "GameFAQs calls Aera its main threat and recommends defeating the Griffin before it can do repeated damage."),
    ],
    blueMagic: [{ name: "White Wind", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "jegged-world-map-griffin", "rpgclassics-outer-continent", "jegged-fossil-roo", "rpgclassics-fossil-roo"], objectiveIds: [outerContinentBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Wind and eat it if White Wind is missing", detail: "Wind exploits the listed weakness. Quina can learn White Wind from Griffin in Fossil Roo or on the Outer Continent, or from Zemzelett in the Dead Forest if it was missed from Zuu in Cleyra's Trunk; Aera is the main danger if the fight lasts." , sourceIds: [...griffinSources, "gamefaqs-cleyra-71891", "jegged-cleyra", "jegged-fossil-roo", "rpgclassics-fossil-roo"] }],
    routeObjectiveIds: [outerContinentBlueMagicObjectiveId],
    notes: ["Griffin's published stats and table are also used for its Fossil Roo entry. Its Dead Forest appearance is a separate field encounter from the Outer Continent and Magdalene Forest world-map pools."],
  }, outerContinentChapterId, [...griffinSources, "gamefaqs-cleyra-71891", "jegged-cleyra", "jegged-fossil-roo", "rpgclassics-fossil-roo"]),
  chapterEnemy({
    id: "enemy.myconid",
    name: "Myconid",
    encounterIds: ["encounter.magdalene-forest.dead-forest-pool", "encounter.iifa-tree.tree-roots-pool"],
    stats: sourcedStats([["level", 20], ["HP", 1372], ["MP", 584], ["EXP", 1368], ["AP", 1], ["Gil", 726]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", "game-item.eye-drops", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.echo-screen", [enemyListSourceId]),
      sourcedLoot("uncommon", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    facts: [
      sourcedFact("type", "Aerial", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Fire and Wind", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "Earth (nullifies)", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Saw", [enemyListSourceId], "Moderate physical damage."),
      sourcedFact("attack", "Blizzara", [enemyListSourceId], "Ice-elemental damage."),
      sourcedFact("attack", "Spore", [enemyListSourceId], "Inflicts Darkness on the party."),
    ],
    blueMagic: [{ name: "Mighty Guard", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [outerContinentBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Fire and eat one for Mighty Guard", detail: "Myconid is weak to Fire and Wind, nullifies Earth, and Quina can learn Mighty Guard with Eat. Spore can inflict Darkness on the party.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [outerContinentBlueMagicObjectiveId],
    notes: ["The Enemy List's Dead Forest table lists Eye Drops and Tent steals, Echo Screen and Ether drop slots, and Mighty Guard as its Eat result. The Iifa Tree walkthrough also lists Myconid in its Tree Roots pool; this reuses the same enemy record rather than creating a duplicate."],
  }, magdaleneForestChapterId, [...deadForestEnemySources, "gamefaqs-iifa-tree-71891", "jegged-iifa-tree"]),
  chapterEnemy({
    id: "enemy.zemzelett",
    name: "Zemzelett",
    encounterIds: ["encounter.magdalene-forest.dead-forest-pool"],
    stats: sourcedStats([["level", 20], ["HP", 1571], ["MP", 625], ["EXP", 2093], ["AP", 2], ["Gil", 889]], [enemyListSourceId]),
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.eye-drops", [enemyListSourceId]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Aerial", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Wind", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "Earth (nullifies)", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "White Wind", [enemyListSourceId], "The spell heals the Zemzelett as well as being Quina's learnable Blue Magic."),
      sourcedFact("attack", "Rainbow Wind", [enemyListSourceId], "Deals multi-elemental damage; Earth resistance helps against it."),
      sourcedFact("attack", "Psychokinesis", [enemyListSourceId], "Used mainly as a counter to physical attacks."),
      sourcedFact("attack", "Aero", [enemyListSourceId]),
    ],
    blueMagic: [{ name: "White Wind", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [outerContinentBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Wind and eat one for White Wind", detail: "Wind exploits Zemzelett's listed weakness. It can counter physical attacks with Psychokinesis and can heal itself with White Wind; Quina can learn the spell with Eat.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [outerContinentBlueMagicObjectiveId],
    notes: ["The Dead Forest table lists Ore, Hi-Potion, and Ether steals, Hi-Potion and Eye Drops drop slots, and White Wind as its Eat result. Its printed status list includes Silence among its vulnerabilities."],
  }, magdaleneForestChapterId, deadForestEnemySources),
  chapterEnemy({
    id: "enemy.zaghnol-b",
    name: "Zaghnol [B] (regular world-map form)",
    encounterIds: [
      "encounter.outer-continent.dirt-pool", "encounter.outer-continent.grass-pool",
      "encounter.outer-continent.marsh-pool", "encounter.outer-continent.forest-pool",
      "encounter.outer-continent.beach-pool", "encounter.magdalene-forest.outer-forest-pool",
      "encounter.pinnacle-rocks.random-pool",
    ],
    stats: [
      { field: "level", value: 16, sourceIds: worldMapZaghnolStatSources, verification: "cross-checked" },
      { field: "HP", value: 1189, sourceIds: worldMapZaghnolStatSources, verification: "cross-checked" },
      { field: "MP", value: 489, sourceIds: [enemyListSourceId], verification: "disputed" },
      { field: "MP", value: 499, sourceIds: ["gamefaqs-monster-list-20490", "jegged-world-map-zaghnol"], verification: "disputed" },
      { field: "EXP", value: 1261, sourceIds: worldMapZaghnolStatSources, verification: "cross-checked" },
      { field: "AP", value: 2, sourceIds: [enemyListSourceId, "gamefaqs-monster-list-20490"], verification: "disputed" },
      { field: "AP", value: 3, sourceIds: ["jegged-world-map-zaghnol"], verification: "disputed" },
      { field: "Gil", value: 546, sourceIds: worldMapZaghnolStatSources, verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId, "jegged-world-map-zaghnol"]),
      sourcedLoot("uncommon", "game-item.tent", [enemyListSourceId, "jegged-world-map-zaghnol"]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "jegged-world-map-zaghnol"]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.eye-drops", [enemyListSourceId, "jegged-world-map-zaghnol"]),
      sourcedLoot("uncommon", "game-item.ether", [enemyListSourceId, "jegged-world-map-zaghnol"]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Beast", worldMapZaghnolStatSources),
      sourcedFact("elemental-weakness", "Water", worldMapZaghnolStatSources),
      sourcedFact("elemental-resistance", "Lightning (half damage)", worldMapZaghnolStatSources),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Thunder", [enemyListSourceId, "jegged-world-map-zaghnol"], "Can target one character or the party."),
      sourcedFact("attack", "Heave", ["jegged-world-map-zaghnol"]),
    ],
    blueMagic: [{ name: "Matra Magic", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "gamefaqs-monster-list-20490", "jegged-world-map-zaghnol", "rpgclassics-outer-continent"], objectiveIds: [outerContinentBlueMagicObjectiveId] }],
    strategies: [{ title: "Use Water and avoid Lightning", detail: "Water exploits Zaghnol's weakness, while it halves Lightning damage. Quina can learn Matra Magic from this world-map form if it was missed from Dragonfly in Cleyra's Trunk.", sourceIds: [...worldMapZaghnolSources, "gamefaqs-cleyra-71891", "jegged-cleyra"] }],
    routeObjectiveIds: [outerContinentBlueMagicObjectiveId],
    notes: ["This is the standard Zaghnol [B] table shared by the Outer Continent, Magdalene Forest world map, and Pinnacle Rocks area; it is not the one-time Festival of the Hunt boss. The Enemy List gives MP 489/AP 2; Jegged and the older Monster List give MP 499, while AP is printed as 3 by Jegged and 2–3 in the older Monster List."],
  }, outerContinentChapterId, [...worldMapZaghnolSources, "gamefaqs-cleyra-71891", "jegged-cleyra"]),
  {
    id: "enemy.friendly-ladybird",
    name: "Friendly Ladybird (Ladybug)",
    kind: "friendly",
    chapterId: outerContinentChapterId,
    versionScope: "PlayStation walkthrough data; the Friendly Creature label and name vary by version. Remastered parity has not been audited.",
    encounterIds: ["encounter.outer-continent.grass-pool", "encounter.outer-continent.forest-pool", "encounter.magdalene-forest.outer-forest-pool"],
    stats: sourcedStats([["level", 6], ["MP", 267], ["EXP", 0], ["AP", 20], ["Gil", 0]], ["gamefaqs-monster-list-20490"]),
    steals: [],
    drops: [],
    facts: [],
    blueMagic: [],
    strategies: [{ title: "Feed 2 Ore for the Friendly Creature reward", detail: "Offer 2 Ore to receive 20 AP and an Ether. This special non-hostile encounter is distinct from the ordinary Ladybird/Ladybug battle table.", sourceIds: outerContinentFriendlySources }],
    routeObjectiveIds: [outerContinentFriendlyLadybugObjectiveId],
    missableIds: [],
    cutoffIds: [],
    sourceIds: outerContinentFriendlySources,
    coverage: "partial",
    notes: ["The Out1 terrain roster labels this form Ladybird (F). The older Monster List prints no HP, 0 EXP/Gil, and 20 AP; its extra item/card result rows are not mapped to ordinary steal/drop slots because their exact trigger is not established here."],
  },
];

const forgottenContinentEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.adamantoise",
    name: "Adamantoise",
    encounterIds: ["encounter.forgotten-continent.blairsurpass-marsh-pool", "encounter.forgotten-continent.seaways-sunrise-dirt-pool"],
    stats: crossCheckedStats([["level", 31], ["HP", 3587], ["MP", 1043], ["EXP", 5096], ["AP", 3], ["Gil", 4433]], [enemyListSourceId, "gamefaqs-monster-list-20490"]),
    steals: [
      sourcedLoot("common", "game-item.tent", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      sourcedLoot("semi-rare", "game-item.phoenix-down", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      sourcedLoot("rare", null, [enemyListSourceId, "gamefaqs-monster-list-20490"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.potion", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      sourcedLoot("common", "game-item.hi-potion", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      sourcedLoot("uncommon", "game-item.echo-screen", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
    ],
    facts: [
      sourcedFact("type", "None", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Lightning", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      sourcedFact("elemental-resistance", "Water (half damage)", [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      sourcedFact("status-vulnerability", "Berserk, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Earth Shake", [enemyListSourceId], "Heavy Earth-elemental damage to the whole party; Float or Earth protection can help."),
      sourcedFact("attack", "Heave and Thundara", [enemyListSourceId], "Heave is physical; Thundara is described as less threatening at this stage."),
      sourcedFact("attack", "Limit Glove", [enemyListSourceId], "Only works when Adamantoise is at exactly 1 HP."),
    ],
    blueMagic: [{ name: "Earth Shake", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "jegged-desert-palace"], objectiveIds: ["disc-3.forgotten-continent.earth-shake"] }],
    strategies: [{ title: "Float or protect against Earth Shake", detail: "Earth Shake is the main threat. The Enemy List recommends Float or Earth protection; Quina can use Eat to learn it if the enemy is weak enough and Quina is in the party.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891", "jegged-desert-palace"] }],
    routeObjectiveIds: ["disc-3.forgotten-continent.earth-shake"],
    notes: ["The older map source lists Adamantoise in Blairsurpass Plains marsh and Seaways Canyon Sunrise dirt; Jegged also lists it in its Forgotten Continent area summary. The newer GameFAQs route's shorter enemy list omits it, so the field rosters are source-scoped rather than treated as one universal list."],
  }, forgottenContinentChapterId, forgottenContinentEnemySources),
  chapterEnemy({
    id: "enemy.armstrong",
    name: "Armstrong",
    encounterIds: [
      "encounter.forgotten-continent.blairsurpass-dirt-pool", "encounter.forgotten-continent.blairsurpass-mountain-pool",
      "encounter.forgotten-continent.blairsurpass-grass-pool", "encounter.forgotten-continent.blairsurpass-forest-pool",
      "encounter.forgotten-continent.seaways-dirt-pool", "encounter.forgotten-continent.seaways-sunrise-dirt-pool",
      "encounter.forgotten-continent.seaways-mountain-pool", "encounter.forgotten-continent.seaways-grass-pool",
      "encounter.forgotten-continent.seaways-sunrise-grass-pool", "encounter.forgotten-continent.seaways-forest-pool",
    ],
    stats: crossCheckedStats([["level", 33], ["HP", 4204], ["MP", 1165], ["EXP", 7150], ["AP", 2], ["Gil", 1456]], [enemyListSourceId, "gamefaqs-monster-list-20490"]),
    steals: [
      sourcedLoot("common", "game-item.ore", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("semi-rare", "game-item.ether", [enemyListSourceId]),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.phoenix-down", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.soft", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    facts: [
      sourcedFact("type", "None", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "None listed", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "None listed", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Cannon", [enemyListSourceId], "A physical counter that deals half the target's maximum HP."),
      sourcedFact("attack", "Matra Magic", [enemyListSourceId], "Can reduce one character to 1 HP; Quina can learn it with Eat."),
    ],
    blueMagic: [{ name: "Matra Magic", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId] }],
    strategies: [{ title: "Silence its main attacks", detail: "Silence removes most of Armstrong's arsenal. Cannon can halve a character's maximum HP, and Quina can learn Matra Magic with Eat if the skill is still missing.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    notes: ["The regional terrain table varies by land type; Armstrong appears across Blairsurpass Plains and Seaways Canyon. The shorter GameFAQs and Jegged area lists do not describe this full terrain distribution."],
  }, forgottenContinentChapterId, forgottenContinentEnemySources),
  chapterEnemy({
    id: "enemy.catoblepas",
    name: "Catoblepas",
    encounterIds: [
      "encounter.forgotten-continent.blairsurpass-dirt-pool", "encounter.forgotten-continent.blairsurpass-mountain-pool",
      "encounter.forgotten-continent.seaways-dirt-pool", "encounter.forgotten-continent.seaways-sunrise-dirt-pool",
      "encounter.forgotten-continent.seaways-mountain-pool",
    ],
    stats: crossCheckedStats([["level", 32], ["HP", 3727], ["MP", 1069], ["EXP", 6609], ["AP", 2], ["Gil", 1421]], [enemyListSourceId, "gamefaqs-monster-list-20490"]),
    steals: [
      sourcedLoot("common", "game-item.soft", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("semi-rare", "game-item.phoenix-pinion", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.ether", [enemyListSourceId]),
    ],
    drops: [
      sourcedLoot("always", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("common", "game-item.soft", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.hi-potion", [enemyListSourceId]),
    ],
    facts: [
      sourcedFact("type", "Beast", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "None listed", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "None listed", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Devil's Bell", [enemyListSourceId], "Can inflict Petrify on one character."),
      sourcedFact("attack", "Heave, Earthquake, Thundara, and Limit Glove", [enemyListSourceId], "Limit Glove only works at exactly 1 HP; the other attacks can deal heavy damage."),
    ],
    blueMagic: [{ name: "Limit Glove", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId] }],
    strategies: [{ title: "Equip Jelly and Beast Killer", detail: "Jelly protects against Devil's Bell's Petrify effect, and Beast Killer improves damage. Quina can learn Limit Glove with Eat when Catoblepas is at 1 HP.", sourceIds: [enemyListSourceId, "gamefaqs-forgotten-continent-71891"] }],
    routeObjectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    notes: ["These are the ordinary Forgotten Continent field stats and loot. Do not substitute them for Treno's separate Knight's House Catoblepas challenge, whose battle data is not established by this record."],
  }, forgottenContinentChapterId, forgottenContinentEnemySources),
  chapterEnemy({
    id: "enemy.jabberwock",
    name: "Jabberwock",
    encounterIds: ["encounter.forgotten-continent.blairsurpass-dirt-pool", "encounter.forgotten-continent.seaways-dirt-pool"],
    stats: [
      ...crossCheckedStats([["level", 30], ["HP", 3442], ["MP", 1019], ["AP", 2], ["Gil", 1156]], [enemyListSourceId, "gamefaqs-monster-list-20490"]),
      { field: "EXP", value: 4675, sourceIds: [enemyListSourceId], verification: "disputed" },
      { field: "EXP", value: 4685, sourceIds: ["gamefaqs-monster-list-20490"], verification: "disputed" },
    ],
    steals: [
      sourcedLoot("common", "game-item.echo-screen", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("semi-rare", null, [enemyListSourceId], "Nothing"),
      sourcedLoot("rare", null, [enemyListSourceId], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.potion", [enemyListSourceId]),
      sourcedLoot("common", "game-item.hi-potion", [enemyListSourceId]),
      sourcedLoot("uncommon", "game-item.phoenix-down", [enemyListSourceId]),
      sourcedLoot("rare", "game-item.echo-screen", [enemyListSourceId]),
    ],
    facts: [
      sourcedFact("type", "None", [enemyListSourceId]),
      sourcedFact("elemental-weakness", "Lightning and Shadow", [enemyListSourceId]),
      sourcedFact("elemental-resistance", "Water and Holy (half damage)", [enemyListSourceId]),
      sourcedFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom", [enemyListSourceId]),
      sourcedFact("attack", "Float", [enemyListSourceId], "It can add or remove Float from the party."),
      sourcedFact("attack", "Earthquake and Aera", [enemyListSourceId], "Their danger depends partly on whether the party is Floating."),
    ],
    blueMagic: [{ name: "Limit Glove", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId] }],
    strategies: [{ title: "Watch its Float changes", detail: "Jabberwock can change the party's Float status; Earthquake and Aera become more or less dangerous depending on that state. Quina can learn Limit Glove with Eat when the enemy is at 1 HP.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] }],
    routeObjectiveIds: [forgottenContinentBlueMagicRecoveryObjectiveId],
    notes: ["This is the hostile ordinary Jabberwock. The Friendly Jabberwock is a separate non-hostile Emerald exchange, gives 40 AP and a Moonstone, and has no combat loot table. GameFAQs' two Enemy List editions disagree on the ordinary Jabberwock's EXP: 4,675 versus 4,685."],
  }, forgottenContinentChapterId, forgottenContinentEnemySources),
  {
    id: "enemy.friendly-jabberwock",
    name: "Friendly Jabberwock",
    kind: "friendly",
    chapterId: forgottenContinentChapterId,
    versionScope: "PlayStation Friendly Creature route data; release and region parity have not been audited.",
    encounterIds: ["encounter.forgotten-continent.blairsurpass-forest-pool", "encounter.forgotten-continent.seaways-sunrise-grass-pool", "encounter.forgotten-continent.seaways-forest-pool"],
    stats: sourcedStats([["AP", 40]], ["gamefaqs-friendly-creatures-71891", "jegged-friendly-monsters"]),
    steals: [],
    drops: [],
    facts: [],
    blueMagic: [],
    strategies: [{ title: "Give it an Emerald", detail: "The friendly creature accepts an Emerald and rewards 40 AP and a Moonstone. This quest encounter is separate from the hostile Jabberwock battle table.", sourceIds: forgottenContinentFriendlyJabberwockSources }],
    routeObjectiveIds: ["disc-3.forgotten-continent.jabberwock"],
    missableIds: [],
    cutoffIds: [],
    sourceIds: forgottenContinentFriendlyJabberwockSources,
    coverage: "partial",
    notes: ["The Monster List marks the forest form as Jabberwock (F). This record models the non-hostile creature and quest reward only; it has no HP, steals, drops, or normal combat strategy."],
  },
];

const mountainPathEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.gnoll",
    name: "Gnoll",
    encounterIds: ["encounter.conde-petie-mountain-path.random-pool"],
    stats: enemyStats([["level", 18], ["HP", 1375], ["MP", 586], ["EXP", 1368], ["AP", 1], ["Gil", 691]]),
    steals: [
      enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", null, "Nothing"),
      enemyLoot("semi-rare", "game-item.phoenix-pinion"), enemyLoot("rare", "game-item.ether"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Sapphire"),
      enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("type", "None"),
      enemyFact("elemental-weakness", "None listed"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Blizzara and Gnoll Attack", "Both are direct attacks; Gnoll can also cast Vanish and Might on itself."),
      enemyFact("attack", "Vanish and Might", "Self-targeting support spells."),
    ],
    blueMagic: [{ name: "Vanish", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Defeat it before it buffs itself", detail: "GameFAQs warns that Gnoll can use Vanish and Might on itself; Blizzara and Gnoll Attack are its direct damage options. Quina leaves before the path's encounters begin, so this is not an Eat opportunity on the first pass.", sourceIds: mountainPathEnemySources }],
    routeObjectiveIds: [],
    notes: ["The Enemy List gives the four steal and four drop slots shown here. Vanish is also taught earlier by Hornet in Gizamaluke's Grotto; the Mountain Path re-entry window with Quina has not been established."],
  }, mountainPathChapterId, mountainPathEnemySources),
  chapterEnemy({
    id: "enemy.ochu",
    name: "Ochu",
    encounterIds: ["encounter.conde-petie-mountain-path.random-pool"],
    stats: enemyStats([["level", 16], ["HP", 3568], ["MP", 622], ["EXP", 2093], ["AP", 2], ["Gil", 845]]),
    steals: [
      enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", null, "Nothing"),
      enemyLoot("semi-rare", "game-item.phoenix-pinion"), enemyLoot("rare", "game-item.ether"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Nothing"),
      enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether"),
    ],
    facts: [
      enemyFact("type", "None"),
      enemyFact("elemental-weakness", "Fire"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Thorn Whip", "Single-target physical damage."),
      enemyFact("attack", "Blizzara", "Single-target Ice-elemental damage."),
      enemyFact("attack", "Slow", "Inflicts Slow."),
    ],
    blueMagic: [{ name: "LV3 Def-less", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Fire and watch for Slow", detail: "Ochu is weak to Fire. Thorn Whip and Blizzara deal damage, while Slow can reduce a character's turns. Quina leaves before the path's encounters begin, so this is not an Eat opportunity on the first pass.", sourceIds: mountainPathEnemySources }],
    routeObjectiveIds: [],
    notes: ["The Enemy List lists LV3 Def-less as Ochu's Eat result. Lamia in Gizamaluke's Grotto is an earlier teacher for this skill; the Mountain Path re-entry window with Quina has not been established."],
  }, mountainPathChapterId, mountainPathEnemySources),
  chapterEnemy({
    id: "enemy.troll",
    name: "Troll",
    encounterIds: ["encounter.conde-petie-mountain-path.random-pool", "encounter.conde-petie-mountain-path.lucid-plains-pool", "encounter.journey-to-iifa-tree.pualei-plains-pool"],
    stats: enemyStats([["level", 20], ["HP", 1469], ["MP", 623], ["EXP", 2093], ["AP", 1], ["Gil", 854]]),
    steals: [
      enemyLoot("common", "game-item.ore"), enemyLoot("uncommon", "game-item.tent"),
      enemyLoot("semi-rare", null, "Nothing"), enemyLoot("rare", null, "Nothing"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Nothing"),
      enemyLoot("uncommon", null, "Nothing"), enemyLoot("rare", null, "Nothing"),
    ],
    facts: [
      enemyFact("type", "None"),
      enemyFact("elemental-weakness", "None listed"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Spear", "Single-target physical damage."),
      enemyFact("attack", "Solution", "Physical damage that can inflict Berserk."),
      enemyFact("attack", "Blizzara", "Ice-elemental damage."),
      enemyFact("attack", "Counter", "Can counter damage with a physical attack."),
    ],
    blueMagic: [{ name: "Vanish", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Plan for its strong counterattacks", detail: "The source lists Spear, Blizzara, and Counter as damaging moves; Solution also inflicts Berserk. GameFAQs says Troll also appears around Madain Sari, including the Lucid Plains roster.", sourceIds: mountainPathEnemySources }],
    routeObjectiveIds: [],
    notes: ["Troll is listed in both the Mountain Path and Madain Sari/Lucid Plains encounter areas. It is also an alternate Vanish teacher, though Hornet is available earlier in Gizamaluke's Grotto."],
  }, mountainPathChapterId, mountainPathEnemySources),
  chapterEnemy({
    id: "enemy.blazer-beetle",
    name: "Blazer Beetle",
    encounterIds: ["encounter.conde-petie-mountain-path.lucid-plains-pool", "encounter.journey-to-iifa-tree.pualei-plains-pool", "encounter.madain-sari.banyano-shores-pool"],
    stats: enemyStats([["level", 19], ["HP", 1468], ["MP", 603], ["EXP", 1548], ["AP", 1], ["Gil", 740]]),
    steals: [
      enemyLoot("common", "game-item.hi-potion"), enemyLoot("uncommon", null, "Nothing"),
      enemyLoot("semi-rare", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"), enemyLoot("common", null, "Nothing"),
      enemyLoot("uncommon", "game-item.phoenix-down"), enemyLoot("rare", "game-item.ether"),
    ],
    facts: [
      enemyFact("type", "Bug"),
      enemyFact("elemental-weakness", "None listed"),
      enemyFact("elemental-resistance", "None listed"),
      enemyFact("status-vulnerability", "Berserk, Confuse, Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Fira and Charge", "The Enemy List describes both as dealing heavy damage."),
      enemyFact("attack", "Hit", "A physical attack."),
    ],
    blueMagic: [{ name: "Limit Glove", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [] }],
    strategies: [{ title: "Use Bug Killer and check Limit Glove", detail: "The Enemy List recommends Bug Killer against Blazer Beetle. Quina can learn Limit Glove with Eat if the skill is still missing, though Mandragora is an earlier teacher on the Lindblum Plateau.", sourceIds: mountainPathEnemySources }],
    routeObjectiveIds: [],
    notes: ["The Enemy List provides the stat, steal/drop, elemental, status, and attack table. RPGClassics also places Blazer Beetle on Banyano Shores and Pualei Plains; the Disc II route lists it on Lucid Plains. The shoreline roster is not claimed as complete."],
  }, mountainPathChapterId, [...lucidPlainsEnemySources, "rpgclassics-bestiary-a-c"]),
  chapterBoss({
    id: "enemy.hilgigars",
    name: "Hilgigars",
    encounterIds: ["encounter.conde-petie-mountain-path.hilgigars"],
    stats: [
      ...crossCheckedStats([["level", 28], ["HP", 8106]], ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"]),
      ...sourcedStats([["MP", 908], ["EXP", 0], ["AP", 9], ["Gil", 2136]], ["gamefaqs-conde-petie-mountain-path-71891"]),
    ],
    steals: [
      sourcedLoot("common", "game-item.phoenix-down", ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"]),
      sourcedLoot("uncommon", "game-item.mythril-fork", ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"]),
      sourcedLoot("semi-rare", null, ["gamefaqs-conde-petie-mountain-path-71891"], "Nothing"),
      sourcedLoot("rare", "game-item.fairy-flute", ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"]),
    ],
    drops: [
      sourcedLoot("always", "game-item.tent", ["gamefaqs-conde-petie-mountain-path-71891"]),
      sourcedLoot("common", "game-item.elixir", ["gamefaqs-conde-petie-mountain-path-71891"]),
      sourcedLoot("uncommon", "game-item.elixir", ["gamefaqs-conde-petie-mountain-path-71891"]),
      sourcedLoot("rare", "game-item.elixir", ["gamefaqs-conde-petie-mountain-path-71891"]),
    ],
    facts: [
      sourcedFact("type", "Human", ["gamefaqs-conde-petie-mountain-path-71891"]),
      sourcedFact("elemental-weakness", "None listed", ["gamefaqs-conde-petie-mountain-path-71891"]),
      sourcedFact("elemental-resistance", "None listed", ["gamefaqs-conde-petie-mountain-path-71891"]),
      sourcedFact("status-vulnerability", "Mini, Silence, and Slow", ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"]),
      sourcedFact("attack", "Hiphop and Knockdown", ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"], "Heavy physical attacks."),
      sourcedFact("attack", "Earthquake", ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"], "Earth-elemental attack; Float can protect the party."),
      sourcedFact("attack", "Curaga", ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"], "Self-healing spell that Silence can prevent."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Silence and Slow before attempting steals", detail: "Silence prevents Curaga and Slow reduces the boss's turns. Use Float to protect against Earthquake, and stop stealing if the party's survival is at risk.", sourceIds: ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"] },
      { title: "Fairy Flute is the rare steal", detail: "The steal table lists Phoenix Down, Mythril Fork, and Fairy Flute; Jegged describes Fairy Flute as a very rare target. The item-type recovery routes are linked from the existing steal objective.", sourceIds: ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path"] },
    ],
    routeObjectiveIds: [hilgigarsStealsObjectiveId],
    notes: ["The GameFAQs walkthrough's boss table lists Always Tent and three Elixir drop slots. Jegged's prose instead names Phoenix Down and Elixir without assigning slots, so the published drop-table disagreement is retained; this entry does not turn the conflict into a guaranteed extra item."],
  }, mountainPathChapterId, ["gamefaqs-conde-petie-mountain-path-71891", "jegged-conde-petie-mountain-path", "gamerguides-conde-petie-mountain-path"], [hilgigarsStealsMissableId], [hilgigarsStealsCutoffId]),
  {
    ...chapterEnemy({
      id: "enemy.friendly-yeti",
      name: "Friendly Yeti",
      encounterIds: ["encounter.conde-petie-mountain-path.friendly-yeti"],
      stats: sourcedStats([["level", 6], ["MP", 265], ["EXP", 0], ["AP", 20], ["Gil", 0]], ["gamefaqs-monster-list-20490"]),
      steals: [],
      drops: [],
      facts: [],
      blueMagic: [],
      strategies: [{ title: "Feed 2 Ore for the Friendly Creature reward", detail: "Give the friendly Yeti two Ore to receive 20 AP and an Elixir. This quest reward is kept in the strategy note rather than represented as a normal steal or battle drop.", sourceIds: friendlyYetiSources }],
      routeObjectiveIds: [mountainPathFriendlyYetiObjectiveId],
      notes: ["The older PlayStation Monster List marks the friendly form as Lucid Plains, Level 6, 265 MP, 20 AP, and no HP value. Its reward is distinct from the normal Yeti's combat table."],
    }, mountainPathChapterId, friendlyYetiSources),
    kind: "friendly" as const,
    versionScope: "Older PAL PlayStation Friendly Creature reference; release and region parity have not been audited.",
    missableIds: [],
    cutoffIds: [],
  },
];

const pualeiPlainsFriendlyEnemyRecords: EnemyRecord[] = [
  {
    ...chapterEnemy({
      id: "enemy.friendly-nymph",
      name: "Friendly Nymph",
      encounterIds: ["encounter.journey-to-iifa-tree.friendly-nymph"],
      stats: sourcedStats([["AP", 30]], pualeiFriendlyNymphSources),
      steals: [],
      drops: [],
      facts: [],
      blueMagic: [],
      strategies: [{ title: "Give 3 Ore for the Friendly Creature reward", detail: "Feed the Friendly Nymph three Ore to receive 30 AP and an Emerald. Keep the Emerald for the later Friendly Jabberwock exchange; the reward is a quest event, not a normal battle drop.", sourceIds: pualeiFriendlyNymphSources }],
      routeObjectiveIds: [pualeiFriendlyNymphObjectiveId],
      notes: ["This forest-only non-hostile form is separate from the ordinary Nymph battle record. The route says greeting the Friendly Yeti changes the Nymph's dialogue but does not make that greeting a prerequisite."],
    }, pualeiPlainsChapterId, pualeiFriendlyNymphSources),
    kind: "friendly",
    versionScope: "PlayStation Friendly Creature route data; release and region parity have not been audited.",
  },
];

const gimmeCatEnemyRecords: EnemyRecord[] = [
  chapterEnemy({
    id: "enemy.gimme-cat",
    name: "Gimme Cat",
    encounterIds: ["encounter.on-the-high-seas.gimme-cat-island-grass", "encounter.return-to-gaia.sacrobless-gimme-cat"],
    stats: enemyStats([["level", 36], ["HP", 4683], ["MP", 1240], ["EXP", 4], ["AP", 3], ["Gil", 5000]]),
    steals: [
      enemyLoot("common", "game-item.echo-screen"),
      enemyLoot("uncommon", "game-item.tent"),
      enemyLoot("semi-rare", null, "Nothing"),
      enemyLoot("rare", "game-item.ether"),
    ],
    drops: [
      enemyLoot("always", null, "Nothing"),
      enemyLoot("common", null, "Nothing"),
      enemyLoot("uncommon", "game-item.phoenix-down"),
      enemyLoot("rare", "game-item.ether"),
    ],
    facts: [
      enemyFact("type", "None"),
      enemyFact("elemental-resistance", "All elements absorbed"),
      enemyFact("status-vulnerability", "Darkness, KO, Doom, Freeze, Heat, Mini, Petrify, Poison, Silence, Sleep, Slow, Stop, Trouble, and Venom"),
      enemyFact("attack", "Meow! I'm Mad!", "A physical attack whose damage can vary widely."),
    ],
    blueMagic: [{ name: "Auto-Life", command: "Eat", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"], objectiveIds: [lostContinentBlueMagicObjectiveId] }],
    strategies: [
      { title: "Do not give it a Diamond", detail: "Gimme Cat asks for a Diamond, but the enemy reference says giving one has no reward. This hostile battle is not a Friendly Creature exchange.", sourceIds: [enemyListSourceId, "gamefaqs-on-the-high-seas-71891"] },
      { title: "Use non-elemental damage", detail: "Gimme Cat absorbs all elements. The GameFAQs enemy reference recommends non-elemental attacks and notes that it yields 5,000 Gil when defeated.", sourceIds: [enemyListSourceId] },
      { title: "Eat for Auto-Life", detail: "If Quina is in the active party and still needs Auto-Life, use Eat on a weakened Gimme Cat.", sourceIds: [enemyListSourceId, "gamefaqs-abilities-71891"] },
      { title: "Follow the attack-stance cue", detail: "The Disc III route warns that attacking too early may draw a Comet counter; wait for the reported stance change. Release-specific behavior remains unverified.", sourceIds: ["gamefaqs-on-the-high-seas-71891"] },
    ],
    routeObjectiveIds: [lostContinentBlueMagicObjectiveId],
    notes: [
      "GameFAQs lists the enemy under Daguerreo-area enemies; its Disc III route reports grass near Lanar Island/Salvage Archipelago, and RPGClassics lists Sacrobless Island. These broad location descriptions do not identify an exact encounter tile or complete local roster.",
      "GameFAQs also lists the Gimme Cat card. The Diamond request does not make this a Friendly Creature; the normal Friendly Creature records remain separate.",
    ],
  }, lanarMarshChapterId, gimmeCatSources),
];

const disc4WorldMapEncounterIdsByEnemy = new Map<string, string[]>();
for (const encounter of disc4WorldMapEncounters) {
  for (const { enemyId } of encounter.formation) {
    disc4WorldMapEncounterIdsByEnemy.set(enemyId, [...(disc4WorldMapEncounterIdsByEnemy.get(enemyId) ?? []), encounter.id]);
  }
}

const allEnemyRecords: EnemyRecord[] = [
  ...alexandriaEnemyRecords,
  ...evilForestEnemyRecords,
  ...iceCavernEnemyRecords,
  ...grottoEnemyRecords,
  ...burmeciaEnemyRecords,
  ...cleyraEnemyRecords,
  ...garganRooEnemyRecords,
  chapterBoss({
    id: "enemy.beatrix-alexandria",
    name: "Beatrix (Alexandria)",
    encounterIds: ["encounter.return-to-alexandria.beatrix"],
    stats: sourcedStats([["HP", 3352], ["MP", 4203], ["level", 19], ["EXP", 0], ["AP", 0], ["Gil", 0]], ["gamefaqs-return-to-alexandria-71891"]),
    steals: [
      sourcedLoot("common", "game-item.phoenix-down", alexandriaBeatrixBossSources),
      sourcedLoot("uncommon", "game-item.ice-brand", alexandriaBeatrixBossSources),
      sourcedLoot("semi-rare", "game-item.survival-vest", alexandriaBeatrixBossSources),
      sourcedLoot("rare", null, alexandriaBeatrixBossSources, "Nothing"),
    ],
    drops: [
      sourcedLoot("always", null, alexandriaBeatrixBossSources, "Nothing"),
      sourcedLoot("common", null, alexandriaBeatrixBossSources, "Nothing"),
      sourcedLoot("uncommon", null, alexandriaBeatrixBossSources, "Nothing"),
      sourcedLoot("rare", null, alexandriaBeatrixBossSources, "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Human", ["gamefaqs-return-to-alexandria-71891"]),
      sourcedFact("elemental-weakness", "None listed", ["gamefaqs-return-to-alexandria-71891"]),
      sourcedFact("elemental-resistance", "None listed", ["gamefaqs-return-to-alexandria-71891"]),
      sourcedFact("status-vulnerability", "Slow", ["gamefaqs-return-to-alexandria-71891"]),
    ],
    blueMagic: [],
    strategies: [{ title: "Attempt the steals, then survive the scripted battle", detail: "Slow Beatrix if available and attempt Phoenix Down, Ice Brand, and Survival Vest while keeping the party alive. GameFAQs describes the battle ending when her HP reaches zero or after her tenth turn; do not rely on a particular steal rate.", sourceIds: alexandriaBeatrixBossSources }],
    routeObjectiveIds: [alexandriaBeatrixStealsObjectiveId],
    notes: ["The published HP, MP, level, and steal tiers here come from GameFAQs' PlayStation walkthrough table. The other linked walkthroughs support the encounter and steal targets; release-specific battle behavior has not been audited."],
  }, returnToAlexandriaChapterId, alexandriaBeatrixBossSources, [alexandriaBeatrixStealsMissableId], [alexandriaBeatrixStealsCutoffId]),
  chapterBoss({
    id: "enemy.ralvuimago",
    name: "Ralvuimago",
    encounterIds: ["encounter.return-to-alexandria.ralvuimago"],
    stats: [
      { field: "level", value: 18, sourceIds: ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle", "elitegrindlab-gargan-roo", "cavesofnarshe-enemies"], verification: "cross-checked" },
      { field: "HP", value: 3352, sourceIds: ["jegged-return-to-alexandria-castle", "gamerguides-alexandria-castle-2", "elitegrindlab-gargan-roo", "cavesofnarshe-enemies"], verification: "disputed" },
      { field: "HP", value: 5709, sourceIds: ["gamefaqs-return-to-alexandria-71891"], verification: "disputed" },
      { field: "MP", value: 584, sourceIds: ["gamefaqs-return-to-alexandria-71891", "cavesofnarshe-enemies"], verification: "cross-checked" },
      { field: "EXP", value: 0, sourceIds: ["gamefaqs-return-to-alexandria-71891", "cavesofnarshe-enemies"], verification: "cross-checked" },
      { field: "AP", value: 7, sourceIds: ["gamefaqs-return-to-alexandria-71891", "cavesofnarshe-enemies"], verification: "cross-checked" },
      { field: "Gil", value: 1404, sourceIds: ["gamefaqs-return-to-alexandria-71891", "cavesofnarshe-enemies"], verification: "cross-checked" },
    ],
    steals: [
      sourcedLoot("common", "game-item.phoenix-down", ralvuimagoSources),
      sourcedLoot("uncommon", "game-item.adaman-vest", ralvuimagoSources),
      sourcedLoot("semi-rare", "game-item.oak-staff", ["gamefaqs-return-to-alexandria-71891"]),
      sourcedLoot("rare", null, ["gamefaqs-return-to-alexandria-71891"], "Nothing"),
    ],
    drops: [
      sourcedLoot("always", "game-item.ether", ["gamefaqs-return-to-alexandria-71891", "cavesofnarshe-enemies"]),
      sourcedLoot("common", "game-item.ether", ["gamefaqs-return-to-alexandria-71891", "elitegrindlab-gargan-roo"]),
      sourcedLoot("uncommon", null, ["gamefaqs-return-to-alexandria-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-return-to-alexandria-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "None", ["gamefaqs-return-to-alexandria-71891"]),
      sourcedFact("elemental-weakness", "Ice", ralvuimagoSources),
      sourcedFact("elemental-resistance", "Earth (absorbs)", ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle", "elitegrindlab-gargan-roo", "cavesofnarshe-enemies"]),
      sourcedFact("status-vulnerability", "Darkness, Mini, and Slow", ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle"]),
      sourcedFact("attack", "Stab and Thundara", ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle"], "Moderate physical and lightning-element attacks."),
      sourcedFact("attack", "Ultra Sound Wave", ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle"], "Can inflict Mini, reducing physical attack and defense."),
      sourcedFact("attack", "Earth Power counter", ["gamefaqs-return-to-alexandria-71891", "jegged-return-to-alexandria-castle", "elitegrindlab-gargan-roo"], "After a physical hit makes Ralvuimago curl into its compact form, further attacks trigger an Earth counter that damages the party and heals the boss. Avoid physical hits while it is curled up."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Steal while it is upright", detail: "Attempt Phoenix Down, Adaman Vest, and Oak Staff before finishing the fight. Oak Staff is the priority if Vivi still needs Bio; the item type is obtainable through other routes, but this is its only boss steal window.", sourceIds: ralvuimagoSources },
      { title: "Avoid its compact-form counter", detail: "Use Slow or Darkness if available and attack with Blizzara while Ralvuimago is upright. A physical hit makes it curl up; while compact, use steal or heal and avoid damaging actions. Remedy cures Mini from Ultra Sound Wave.", sourceIds: ralvuimagoCombatSources },
    ],
    preparationGuidance: {
      levelRationale: "The listed Level 18 is Ralvuimago's enemy stat, not a recommended party level. The reviewed normal-route and boss guides do not give a standard party-level target; GameFAQs' PS1 boss guide calls the fight Fair but does not tie that rating to a level.",
      difficultyAssessment: "One PS1 boss FAQ rates the fight Fair. This is a subjective, single-source label rather than a cross-source or gameplay-tested difficulty rating.",
      optionalGrinding: "No extra grinding is required by the reviewed normal-route guides, and the return ride moves directly into this boss. The earlier outbound Gargan Roo visit has an optional Crawler grind opportunity; it is a separate stop with a different party, not a required level target.",
      setupAdvice: "Use the control handoff after the castle party split to check Zidane, Dagger, and Vivi's equipment and bring Remedies for Mini. Dagger can use group Cure; Vivi's Blizzara exploits Ice weakness, and Slow can create steal turns. While Ralvuimago is compact, steal or heal and avoid damaging actions; sources differ on whether all damage or only physical hits trigger Earth Power, so save Blizzara for the open phase. Prioritize Oak Staff if Vivi still needs Bio.",
      confidence: "partial",
      sourceIds: ralvuimagoPreparationSources,
    },
    routeObjectiveIds: [ralvuimagoStealsObjectiveId],
    notes: [
      "HP differs substantially across the inspected PlayStation references: GameFAQs 71891 lists 5,709, while Jegged, Gamer Guides, Caves of Narshe, and EliteGrindLab list 3,352. Both values are kept as disputed claims rather than silently selecting one.",
      "GameFAQs 71891 labels Oak Staff Semi-Rare; Jegged calls it the Rare steal and prints a 6% rate. The catalog keeps the GameFAQs slot in its table and records the tier/rate disagreement here without normalizing odds.",
      "GameFAQs' table lists Ether in both the Always and Common drop slots, while some route prose names one Ether. Both source-listed slots are shown without promising the same realized quantity in every fight.",
      "Guides differ on whether all damage or only physical hits during the compact phase trigger Earth Power: GameFAQs, Jegged, and EliteGrindLab tie the counter to physical hits or the compact phase, while Kamigame recommends non-damaging actions. The route uses the conservative steal/heal approach while compact and reserves Ice damage for the open phase.",
      "RPGClassics' bestiary index spells the name Ralvuimahgo; this profile follows the common Ralvuimago spelling used by the walkthrough sources.",
      "The profile is based on PlayStation sources; modern-release parity has not been audited.",
    ],
  }, returnToAlexandriaChapterId, ralvuimagoPreparationSources, [ralvuimagoStealsMissableId], [ralvuimagoStealsCutoffId]),
  chapterBoss({
    id: "enemy.tantarian",
    name: "Tantarian",
    encounterIds: ["encounter.tantarian.disc-2-library", "encounter.tantarian.disc-3-library"],
    stats: [
      ...crossCheckedStats([["level", 41], ["HP", 21997]], ["gamefaqs-trouble-on-home-front-71891", "cavesofnarshe-tantarian", "jegged-trouble-on-home-front"]),
      ...crossCheckedStats([["MP", 1456], ["EXP", 12585], ["AP", 30], ["Gil", 4472]], ["gamefaqs-trouble-on-home-front-71891", "cavesofnarshe-tantarian"]),
    ],
    steals: [
      { slot: "common", itemId: "game-item.ether", sourceIds: tantarianSources, note: "Jegged lists a 70% chance per connected steal attempt." },
      { slot: "uncommon", itemId: "game-item.elixir", sourceIds: tantarianSources, note: "Jegged lists a 23% chance per connected steal attempt." },
      { slot: "semi-rare", itemId: "game-item.silver-fork", sourceIds: tantarianSources, note: "Jegged lists a 6% chance per connected steal attempt." },
      { slot: "rare", itemId: "game-item.demons-mail", sourceIds: tantarianSources, note: "Jegged lists a 0.4% chance per connected attempt; Master Thief raises this slot to 12.5%." },
    ],
    drops: [
      sourcedLoot("always", "game-item.running-shoes", ["gamefaqs-trouble-on-home-front-71891", "rpgclassics-bestiary-t-z", "cavesofnarshe-tantarian"]),
      sourcedLoot("common", null, ["gamefaqs-trouble-on-home-front-71891"], "Nothing"),
      sourcedLoot("uncommon", null, ["gamefaqs-trouble-on-home-front-71891"], "Nothing"),
      sourcedLoot("rare", null, ["gamefaqs-trouble-on-home-front-71891"], "Nothing"),
    ],
    facts: [
      sourcedFact("type", "Demon", tantarianSources),
      sourcedFact("elemental-weakness", "Holy", tantarianSources),
      sourcedFact("elemental-weakness", "Fire (only while exposed)", ["gamefaqs-trouble-on-home-front-71891", "jegged-trouble-on-home-front"]),
      sourcedFact("elemental-resistance", "Shadow damage halved", ["gamefaqs-trouble-on-home-front-71891", "cavesofnarshe-tantarian"]),
      sourcedFact("status-vulnerability", "Darkness, Mini, and Slow", ["gamefaqs-trouble-on-home-front-71891"]),
      sourcedFact("attack", "Edge, Paper Storm, and Doom", ["gamefaqs-trouble-on-home-front-71891", "jegged-trouble-on-home-front"], "Used from the closed-book form; Edge targets one character, Paper Storm hits the party, and Doom inflicts a death timer."),
      sourcedFact("attack", "Poison and Doom", ["gamefaqs-trouble-on-home-front-71891", "jegged-trouble-on-home-front"], "Used from the exposed form."),
    ],
    blueMagic: [],
    strategies: [
      { title: "Damage the book, then use magic while it is open", detail: "The closed book has very high defenses. Damage advances its page count until the exposed form appears around pages 150–200; use magic during that window because a physical hit closes it. The exposed form gains a Fire weakness and lower defenses.", sourceIds: ["gamefaqs-trouble-on-home-front-71891", "jegged-trouble-on-home-front"] },
      { title: "Use one of the two story windows", detail: "The first opportunity is during the timed Disc II rescue. If skipped, Tantarian can be fought in the Disc III library before following Dagger to the altar. Defeating it during the first window removes the later one; leaving the Disc III library closes the final chance.", sourceIds: ["gamefaqs-return-to-alexandria-71891", "gamefaqs-trouble-on-home-front-71891", "jegged-return-to-alexandria-castle", "jegged-trouble-on-home-front"] },
      { title: "Try the four steals while exposed", detail: "The source-listed slots are Ether, Elixir, Silver Fork, and Demon's Mail. Jegged gives 70%, 23%, 6%, and 0.4% per connected steal attempt respectively; Master Thief raises the rare Demon's Mail chance to 12.5%. Victory guarantees Running Shoes and lists a Ramuh Card.", sourceIds: tantarianSources },
    ],
    routeObjectiveIds: [tantarianObjectiveId],
    notes: [
      "The two library appearances are alternate chances to defeat the same optional boss, not separate victories or Running Shoes rewards. The Disc III warning and cutoff apply only if Tantarian was not defeated during the Disc II rescue.",
      "GameFAQs lists Ramuh as Tantarian's card reward; the walkthrough also records the earlier steeple stash and Taharka as separate Ramuh Card routes. Modern-release behavior has not been independently checked.",
    ],
  }, returnToAlexandriaChapterId, tantarianSources, [tantarianMissableId], [tantarianCutoffId]),
  ...earlyDaliEnemyRecords,
  ...cargoShipEnemyRecords,
  ...trenoGriffinEnemyRecords,
  ...summitStationEnemyRecords,
  ...lindblumEnemyRecords,
  ...lindblumAreaEnemyRecords,
  ...lanarMarshEnemyRecords,
  ...outerContinentEnemyRecords,
  ...forgottenContinentEnemyRecords,
  ...mountainPathEnemyRecords,
  ...pualeiPlainsFriendlyEnemyRecords,
  ...gimmeCatEnemyRecords,
  ...desertPalaceEnemyRecords,
  ...ipsensCastleEnemyRecords,
  ...earthGuardianEnemyRecords,
  ...pinnacleRocksEnemyRecords,
  ...fossilRooEnemyRecords,
  ...firstIifaTreeEnemyRecords,
  ...returnMadainSariEnemyRecords,
  ...battleIifaTreeEnemyRecords,
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
  ...disc4WorldMapEnemyRecords,
  ...pandemoniumEnemyRecords,
  ...iifaTreeEnemyRecords,
  ...memoriaEnemyRecords,
  ...finalBattleEnemyRecords,
  ...ozmaEnemyRecords,
];

export const enemyRecords: EnemyRecord[] = allEnemyRecords.map((enemy) => {
  const disc4EncounterIds = disc4WorldMapEncounterIdsByEnemy.get(enemy.id) ?? [];
  return disc4EncounterIds.length === 0
    ? enemy
    : { ...enemy, encounterIds: [...new Set([...enemy.encounterIds, ...disc4EncounterIds])] };
});

export const enemyCatalogCoverage = {
  status: "partial" as const,
  chapterIds: [alexandriaChapterId, evilForestChapterId, iceCavernChapterId, journeyToBurmeciaChapterId, burmeciaChapterId, cleyraChapterId, returnToAlexandriaChapterId, homeFrontChapterId, daliChapterId, cargoShipChapterId, trenoChapterId, summitStationChapterId, garganRooChapterId, lindblumChapterId, exploringLindblumChapterId, outerContinentChapterId, magdaleneForestChapterId, lanarMarshChapterId, forgottenContinentChapterId, mountainPathChapterId, pualeiPlainsChapterId, madainSariChapterId, desertPalaceChapterId, ipsensCastleChapterId, breakingSealChapterId, pinnacleRocksChapterId, fossilRooChapterId, firstIifaTreeChapterId, returnMadainSariChapterId, battleIifaTreeChapterId, returnToGaiaChapterId, mountGulugChapterId, pandemoniumChapterId, iifaTreeChapterId, memoriaChapterId, finalBattleChapterId, finalPreparationsChapterId],
  enemyIds: [...alexandriaEnemyRecords.map((enemy) => enemy.id), ...evilForestEnemyRecords.map((enemy) => enemy.id), ...iceCavernEnemyRecords.map((enemy) => enemy.id), ...grottoEnemyRecords.map((enemy) => enemy.id), ...burmeciaEnemyRecords.map((enemy) => enemy.id), ...cleyraEnemyRecords.map((enemy) => enemy.id), ...garganRooEnemyRecords.map((enemy) => enemy.id), "enemy.beatrix-alexandria", "enemy.ralvuimago", "enemy.tantarian", ...earlyDaliEnemyRecords.map((enemy) => enemy.id), ...cargoShipEnemyRecords.map((enemy) => enemy.id), ...trenoGriffinEnemyRecords.map((enemy) => enemy.id), ...summitStationEnemyRecords.map((enemy) => enemy.id), ...lindblumEnemyRecords.map((enemy) => enemy.id), ...lindblumAreaEnemyRecords.map((enemy) => enemy.id), ...lanarMarshEnemyRecords.map((enemy) => enemy.id), ...outerContinentEnemyRecords.map((enemy) => enemy.id), ...forgottenContinentEnemyRecords.map((enemy) => enemy.id), ...mountainPathEnemyRecords.map((enemy) => enemy.id), ...pualeiPlainsFriendlyEnemyRecords.map((enemy) => enemy.id), ...gimmeCatEnemyRecords.map((enemy) => enemy.id), ...desertPalaceEnemyRecords.map((enemy) => enemy.id), ...ipsensCastleEnemyRecords.map((enemy) => enemy.id), ...earthGuardianEnemyRecords.map((enemy) => enemy.id), ...pinnacleRocksEnemyRecords.map((enemy) => enemy.id), ...fossilRooEnemyRecords.map((enemy) => enemy.id), ...firstIifaTreeEnemyRecords.map((enemy) => enemy.id), ...returnMadainSariEnemyRecords.map((enemy) => enemy.id), ...battleIifaTreeEnemyRecords.map((enemy) => enemy.id), "enemy.red-dragon", "enemy.meltigemini", ...localEnemyRecords.map((enemy) => enemy.id), ...disc4WorldMapEnemyRecords.map((enemy) => enemy.id), ...pandemoniumEnemyRecords.map((enemy) => enemy.id), ...iifaTreeEnemyRecords.map((enemy) => enemy.id), ...memoriaEnemyRecords.map((enemy) => enemy.id), ...finalBattleEnemyRecords.map((enemy) => enemy.id), ...ozmaEnemyRecords.map((enemy) => enemy.id)],
  encounterIds: [...enemyEncounters.map((encounter) => encounter.id)],
  note: "Partial enemy reference for the opening Alexandria Masked Man and Crash Site Baku; Treno's Disc II Knight's House arena Griffin, Evil Forest, Ice Cavern/Nolrich Heights, Gizamaluke's Grotto, Burmecia and its surrounding world-map region, Cleyra, the Alexandria rescue, both Tantarian library windows, Dali, Cargo Ship, Summit Station, Lindblum Plateau and lowlands, Qu's Marsh, Outer Continent and Magdalene Forest, Forgotten Continent field terrains, Conde Petie Mountain Path/Lucid Plains the Pualei Plains return route, Desert Palace, Ipsen's Castle, Pinnacle Rocks, Fossil Roo, both Disc II Iifa Tree visits, the return to Madain Sari, scoped Lost Continent Feather Circle and Lanar Island/Blairsurpass Plains Anemone opportunities, Return to Gaia (Quale, the four source-listed Disc IV continent rosters (Mist, Outer, Lost, and Forgotten) and the scoped Sacrobless Island Gimme Cat opportunity), Mount Gulug, Pandemonium, the Disc IV Iifa Tree battle, Memoria, Final Preparations, and the final battle. Evil Forest covers its source-listed trail pool, both Prison Cage rescue fights, the post-crash Baku battle, Plant Brain, and the three-Plant-Spider escape battle; the second Prison Cage HP disagreement remains explicit. Ice Cavern covers the three mist-jet enemy types and the combined Black Waltz 1/Sealion battle; the boss HP and levels are cross-checked, and the Sealion orb-phase spell disagreement is kept source-specific. Gizamaluke's Grotto covers Hornet, Lamia, Skeleton, Type A, two scripted Type A pairs, and Gizamaluke; the Dali Skeleton listing remains separately disputed, and the boss's three one-time steals link to the existing warning and later item recovery. Burmecia separates its Basilisk/Ironite/Magic Vice random pool, the three optional Mimic chest fights, the fixed Type A pair, Beatrix's one-time boss steals, and the wider Burmecia/Cleyra regional pool. Beatrix's level/HP/MP and scripted end condition remain disputed; Magic Vice's first steal slot and Type A's EXP/steal-table printings retain source conflicts. The regional pool includes the Daines-horse Basin Night opportunity and its separately listed Skeleton appearance without implying encounter rates. Cleyra adds five room-specific Trunk pools, a forced Sand Scorpion pit battle, three forced Soldier return fights, five fixed assault waves, Antlion, and Beatrix. Carrion Worm, Dragonfly, and Zuu link to Quina's existing Blue Magic objective; the Sand Golem table is explicitly for its Core, Soldier [A] is distinct from Alexandria's Soldier [B], and Beatrix's Cleyra MP disagreement remains source-marked. Both bosses connect their one-time steals to existing warnings, cutoffs, and item paths. The Alexandria rescue adds Beatrix's third boss battle with its source-listed Phoenix Down, Ice Brand, and Survival Vest steals and links the encounter to its existing cutoff. Tantarian now has separate Disc II timed and Disc III final-library encounters sharing one boss profile, steal table, guaranteed Running Shoes drop, Ramuh Card note, and defeat objective; the final library window links to its conditional missable warning and cutoff. Its Level 41/21,997 HP profile is cross-checked, open-book behavior and combat facts are recorded, and Jegged's steal probabilities are labeled per connected attempt. The return Gargan Roo ride adds Ralvuimago as a separate boss profile and encounter linked to its existing three-steal warning, cutoff, and item recovery paths; HP, Oak Staff tier, and Ether-drop count differences remain source-marked. Nolrich Heights is a separate world-map pool for Carve Spider, Mu, and Python; the adjacent Gunitas Basin pool additionally includes Goblin. Mu's Friendly Monster appearance remains separate from its combat data. Dali's optional underground pool distinguishes the door-triggered Ghost/Vice encounters from the disputed Skeleton listing and records the reported Skeleton + Vice/Ghost-only formations. Black Waltz 2 is a separate one-time boss encounter linked to its steal objective, cutoff, and recovery warning; its field location, Mini vulnerability, and four-Ether drop table preserve source-specific differences. Summit Station adds the Disc II Black Waltz 3 rematch as a distinct boss record and encounter, linked to its existing three-steal objective, warning, and cutoff. GameFAQs and Jegged cross-check Level 9 and 1,292 HP; StrategyWiki reports 1,300, while GameFAQs and Jegged differ on the Flame Staff steal-slot label. Freeze behavior and Dagger’s protected role are recorded. Cargo Ship now has its own first Black Waltz 3 profile and encounter, separate from the later rematch; its three steals link to the existing cutoff and recovery routes. GameFAQs lists no weakness while Caves of Narshe and EliteGrindLab list Wind, and the RPGClassics walkthrough says Silver Greaves where its bestiary and other guides say Silver Gloves. Release parity remains unverified. Bentini Heights now has a world-map encounter pool using the existing Carve Spider, Mu, Ladybird, and Mandragora records plus ordinary Trick Sparrow. GameFAQs lists Mu, Mandragora, and Trick Sparrow; Jegged's wider regional enemy list also names Carve Spider and Ladybird, and the friendly Ghost is kept separate from hostile encounters. Trick Sparrow's ordinary stats, loot, Wind weakness, Earth nullification, and Matra Magic teacher entry are modeled separately from the Festival variant; Quina is not in the immediate Summit Station party. Gargan Roo now separates its Crawler/Dragonfly random pool from the outbound Ralvurahva boss and connects the two steals to the existing warning, cutoff, and item recovery paths. The boss HP alternatives and steal-rate disagreement remain explicit, and the temporary party's Quina limitation is recorded. Lindblum separates Plateau mountain/forest pools, lowland enemies around Dragon's Gate and Chocobo Forest, and the first Qu's Marsh Axolotl/Gigan Toad [A] pool; the later Outer Continent marsh has its own Sahagin/Gigan Toad [B] pool, while Lanar Island and Blairsurpass Plains each have a scoped Anemone Bad Breath opportunity; full pond rosters and Gigan Toad variant placements remain unresolved. Outer Continent models dirt, grass, marsh, forest, and beach rosters across Donna Plains, Dyshnose Shores, Gegalrich Shores, Kognish Shores, and a separate Magdalene Forest world-map pool. Forgotten Continent keeps Blairsurpass Plains and Seaways Canyon terrain pools separate, including overworld Adamantoise and Friendly Jabberwock, with the shorter GameFAQs/Jegged roster differences and ordinary Jabberwock EXP disagreement retained. Friendly Ladybird is distinct from ordinary Ladybird; Cactuar level/AP, Goblin Mage AP, and Zaghnol MP/AP differences remain explicit. The Outer Continent world-map teachers and Dead Forest Myconid/Zemzelett teachers link to the shared Blue Magic objective; White Wind and Matra Magic remain available if missed in Cleyra. The Dead Forest field area is modeled separately, with Griffin, Myconid, and Zemzelett in its own pool; Myconid and Zemzelett link to the shared Mighty Guard and White Wind checklist. Conde Petie Mountain Path and Lucid Plains have separate random rosters, Hilgigars is linked to its existing one-fight steal warning and item routes, and the Lucid Plains Friendly Yeti remains distinct from the ordinary Yeti. The Pualei Plains return route has its own Blazer Beetle/Goblin Mage/Troll pool and a forest-only Friendly Nymph encounter for 3 Ore, 30 AP, and an Emerald; the friendly form remains separate from hostile Nymph. Quina leaves when the Mountain Path begins, so the local Eat entries are not available on that first traversal; alternate earlier teachers and uncertain re-entry are documented. Hilgigars' GameFAQs drop slots and Jegged's prose list remain in conflict. Pinnacle Rocks has a separate Sand Scorpion/Seeker Bat/Zaghnol [B] pool; the standard Zaghnol record is shared with the Outer Continent areas and distinct from the Festival opponent. Seeker Bat's Night Eat result is recorded, and the reported Caves of Narshe steal/drop transposition remains explicit. Fossil Roo adds Abomination, Feather Circle, and a shared Griffin/Seeker Bat area pool; Night and LV4 Holy/White Wind opportunities link to their existing checklists. The hostile Feather Circle's Water resistance conflict remains source-marked, and its ordinary form stays separate from Friendly Feather Circle. Lost Continent Feather Circle entries are scoped Blue Magic and friendly-creature opportunities, not a complete regional roster. The Disc II Iifa Tree first visit has separate Tree Roots and Inner Roots pools, fixed Zombie/Dracozombie descent fights, and Soulcage's one-time steals; Dracozombie and Zombie retain unresolved elemental-read conflicts, while Stroper and Dracozombie link to the existing LV5 Death objective. Return to Madain Sari adds Scarlet Hair's Zidane-only boss duel with HP/MP source conflicts and one-time Ether/Poison Knuckles steals. The next Iifa Tree return adds Mistodon [A] with a fixed upper-perch pair, Jegged's separately reported solo after Dagger leaves, and a downhill encounter pool whose random/story-wave status and repeat access remain disputed. Its sourced profile, steal/drop table, Sleep attack, and optional Angel's Snack Eat opportunity link to the return route and cutoff. Quale is a separate optional boss tied to the shared 99-frog objective, with its four Elixir drop slots, steals, and Gastro Fork quest reward recorded. The Festival uses Hunt-only Fang and Mu variants and a separate Zaghnol boss. Trick Sparrow reward/steal claims, Mu's elemental traits, and Zaghnol's event steals preserve their source conflicts. Mount Gulug covers its source-listed random enemy families, three fixed Red Dragon groups, and Meltigemini. Pandemonium distinguishes its random variants, Mover trio, three scripted party-split fights, and Silver Dragon/Garland/Kuja sequence. Nova Dragon's one-time fight includes the conditional Grand Armor steal. Memoria adds Hades, the four revived guardians, Deathguise, and Kraken's two tentacle components; their disputed HP, Hades shop trigger, right-tentacle steal, and move-side assignments remain explicit. Final Preparations adds Ozma with its Friendly Creatures-dependent reach and Shadow affinity. Trance Kuja's HP and Necron's steal tiers preserve source differences. Ipsen's Castle separates the initial, stairwell/lift, mural-room, and treasure-route pools from fixed Taharka. Cerberus, Gargoyle, and Veteran link Auto-Life, Mighty Guard, and Doom to Quina's checklist. Tonberry HP and Ice weakness, Veteran MP, and Taharka's stats/card/steal data retain source-level distinctions; the inspected GameFAQs and RPGClassics references agree on Taharka's 29,186 HP. The Earth Shrine's fixed Earth Guardian encounter now records its cross-checked stats, Earth Shake teacher entry, one-time Avenger/Rubber Suit steals, Atomos card, and guaranteed Phoenix Pinion. Other areas and release-by-release parity remain to be researched.",
};
