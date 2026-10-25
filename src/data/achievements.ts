import { movieCriticEligibleEvents } from "./ates.ts";

export type SteamAchievement = {
  id: string;
  objectiveId: string;
  sourceId: string;
  name: string;
  criteria: string;
  guideObjectiveIds?: string[];
  guideChapterIds?: string[];
  guideNote?: string;
  guideSourceIds?: string[];
};

export type PlatformAchievement = Omit<SteamAchievement, "sourceId"> & {
  platform: "ps4" | "xbox";
  sourceId: string;
  /** Steam record used to compare the shared gameplay criterion across services. */
  parityId: string;
};

export type AchievementRecord = SteamAchievement | PlatformAchievement;

const steamAchievementSource = [
  { id: "getting-emotional", name: "Getting Emotional", criteria: "Enter Trance for the first time." },
  { id: "a-round-of-applause", name: "A Round of Applause", criteria: "Have the nobles demand an encore." },
  { id: "its-all-in-the-cards-i", name: "It's All in the Cards I", criteria: "Win a Tetra Master match." },
  { id: "let-the-bodies-hit-the-floor-i", name: "Let the Bodies Hit the Floor I", criteria: "Defeat 100 enemies." },
  { id: "sticky-fingers", name: "Sticky Fingers", criteria: "Use the Steal command 50 times." },
  { id: "coming-together-i", name: "Coming Together I", criteria: "Synthesize 10 items." },
  { id: "going-for-the-gold", name: "Going for the Gold", criteria: "Successfully catch a golden frog." },
  { id: "bring-on-the-thunder", name: "Bring on the Thunder", criteria: "Summon the eidolon Ramuh." },
  { id: "that-old-black-magic", name: "That Old Black Magic", criteria: "Use Black Magic spells 100 times." },
  { id: "wolf-insanity", name: "Wolf Insanity", criteria: "Summon the eidolon Fenrir." },
  { id: "peek-a-boo", name: "Peek-A-Boo", criteria: "Free Kuppo from a wall in Fossil Roo." },
  { id: "take-to-the-skies", name: "Take to the Skies", criteria: "Obtain an airship." },
  { id: "the-best-offense", name: "The Best Offense", criteria: "Use the Defend command 50 times." },
  { id: "out-of-harms-way", name: "Out of Harm's Way", criteria: "Guide all the residents of Cleyra to safety." },
  { id: "youre-cold-as-ice", name: "You're Cold as Ice", criteria: "Summon the eidolon Shiva." },
  { id: "heat-of-the-moment", name: "Heat of the Moment", criteria: "Summon the eidolon Ifrit." },
  { id: "king-of-dragons", name: "King of Dragons", criteria: "Summon the eidolon Bahamut." },
  { id: "bringing-down-the-house", name: "Bringing Down the House", criteria: "Summon the eidolon Atomos." },
  { id: "surfs-up", name: "Surf's Up", criteria: "Summon the eidolon Leviathan." },
  { id: "here-to-help", name: "Here to Help", criteria: "Summon the eidolon Carbuncle." },
  { id: "putting-out-the-fire", name: "Putting Out the Fire", criteria: "Defeat Maliris, the Guardian of Fire." },
  { id: "gone-with-the-winds", name: "Gone with the Winds", criteria: "Defeat Tiamat, the Guardian of Wind." },
  { id: "overly-emotional", name: "Overly Emotional", criteria: "Enter trance 50 times." },
  { id: "rise-from-the-ashes", name: "Rise from the Ashes", criteria: "Summon the eidolon Phoenix." },
  { id: "all-washed-up", name: "All Washed Up", criteria: "Defeat Kraken, the Guardian of Water." },
  { id: "hitting-rock-bottom", name: "Hitting Rock Bottom", criteria: "Defeat Lich, the Guardian of Earth." },
  { id: "its-all-in-the-cards-ii", name: "It's All in the Cards II", criteria: "Win 10 Tetra Master matches. (Certain NPCs can be re-challenged to increase your win count after progressing through the game.)" },
  { id: "the-dim-mak", name: "The Dim Mak", criteria: "Summon the eidolon Odin." },
  { id: "coming-together-ii", name: "Coming Together II", criteria: "Synthesize 30 items." },
  { id: "alls-well-that-ends-well", name: "All's Well That Ends Well", criteria: "Complete FINAL FANTASY IX." },
  { id: "a-healing-touch", name: "A Healing Touch", criteria: "Use White Magic spells 200 times." },
  { id: "auctioneer", name: "Auctioneer", criteria: "Win 10 items at the Treno Auction House." },
  { id: "the-ultimate-flute", name: "The Ultimate Flute", criteria: "Obtain the Angel Flute." },
  { id: "path-of-the-samurai", name: "Path of the Samurai", criteria: "Obtain the complete set of Genji armor." },
  { id: "the-ultimate-claws", name: "The Ultimate Claws", criteria: "Obtain the Rune Claws." },
  { id: "the-ultimate-rod", name: "The Ultimate Rod", criteria: "Obtain the Whale Whisker." },
  { id: "wolf-in-mogs-clothing", name: "Wolf in Mog's Clothing", criteria: "Summon the eidolon Madeen." },
  { id: "the-ultimate-mace", name: "The Ultimate Mace", criteria: "Obtain the Mace of Zeus." },
  { id: "skip-to-my-lou", name: "Skip to My Lou", criteria: "Jump rope 100 times without tripping." },
  { id: "end-of-the-road", name: "End of the Road", criteria: "Attain level 99 with at least one character." },
  { id: "the-ultimate-racket", name: "The Ultimate Racket", criteria: "Obtain the Tiger Racket." },
  { id: "diggin-it", name: "Diggin' It", criteria: "Locate all hidden treasures on the world map." },
  { id: "close-but-no-cigar", name: "Close But No Cigar", criteria: "Obtain the Tower." },
  { id: "the-b-team", name: "The B-Team", criteria: "Form a party with four male characters." },
  { id: "you-called", name: "You Called?", criteria: "Summon Eidolons 50 times." },
  { id: "the-ultimate-dual-blade", name: "The Ultimate Dual Blade", criteria: "Obtain the Ultima Weapon." },
  { id: "earning-the-queens-favor", name: "Earning the Queen's Favor", criteria: "Receive 10 rewards from Queen Stella." },
  { id: "kains-legacy", name: "Kain's Legacy", criteria: "Obtain Kain's Lance." },
  { id: "whats-your-sign", name: "What's Your Sign?", criteria: "Obtain the Hammer." },
  { id: "sword-of-kings", name: "Sword of Kings", criteria: "Obtain the sacred blade Excalibur." },
  { id: "my-little-airship", name: "My Little Airship", criteria: "Obtain a miniature copy of the Prima Vista." },
  { id: "your-lucky-day", name: "Your Lucky Day", criteria: "Receive a Very Good Omen from a color fortune." },
  { id: "one-nag-too-many", name: "One Nag Too Many", criteria: "Cause Moguo to have a tantrum." },
  { id: "track-star", name: "Track Star", criteria: "Obtain Athlete Queen." },
  { id: "frog-wrangler", name: "Frog Wrangler", criteria: "Successfully catch 99 frogs." },
  { id: "hail-to-the-king", name: "Hail to the King", criteria: "Jump rope 1000 times without tripping and obtain King of Jump Rope." },
  { id: "firin-mah-lazer", name: "Firin' Mah Lazer", criteria: "Summon the eidolon Ark." },
  { id: "the-ultimate-fork", name: "The Ultimate Fork", criteria: "Obtain the Gastro Fork." },
  { id: "well-lubricated", name: "Well Lubricated", criteria: "Obtain a bottle of Superslick." },
  { id: "the-one-ring", name: "The One Ring", criteria: "Obtain Madain's Ring via mining." },
  { id: "mister-nice-guy", name: "Mister Nice Guy", criteria: "Gain the favor of all friendly enemies." },
  { id: "back-online", name: "Back Online", criteria: "Repair the machine at Mognet Central." },
  { id: "let-the-bodies-hit-the-floor-ii", name: "Let the Bodies Hit the Floor II", criteria: "Defeat 1000 enemies." },
  { id: "a-hunting-we-will-go", name: "A-Hunting We Will Go", criteria: "Win with Vivi during the Festival of the Hunt." },
  { id: "taking-the-black", name: "Taking the Black", criteria: "Play the blackjack minigame." },
  { id: "another-mans-treasure", name: "Another Man's Treasure", criteria: "Receive certification as a Rank S Treasure Hunter." },
  { id: "backstabber", name: "Backstabber", criteria: "Receive 30 back attacks." },
  { id: "driving-the-hard-bargain", name: "Driving the Hard Bargain", criteria: "Purchase all items available from Stiltzkin." },
  { id: "im-so-blue", name: "I'm So Blue", criteria: "Use Blue Magic spells 100 times." },
  { id: "follow-your-nose", name: "Follow Your Nose", criteria: "Raise your chocobo's beak level to 99." },
  { id: "to-ozma-and-back", name: "To Ozma and Back", criteria: "Defeat Ozma." },
  { id: "cracking-the-code", name: "Cracking the Code", criteria: "Uncover the secret of the Eidolon Wall." },
  { id: "dragon-lady", name: "Dragon Lady", criteria: "Defeat Behemoth in the Treno weapon shop using Dagger." },
  { id: "still-i-rise", name: "Still I Rise", criteria: "Activate the Rebirth Flame ability when all party members are incapacitated." },
  { id: "femme-fatales", name: "Femme Fatales?", criteria: "Form a party with Quina Quen and three female characters." },
  { id: "over-the-moon", name: "Over the Moon", criteria: "Obtain 4 moonstones." },
  { id: "a-pillar-of-support", name: "A Pillar of Support", criteria: "Acquire all available support abilities." },
  { id: "the-ultimate-sword", name: "The Ultimate Sword", criteria: "Obtain Excalibur II." },
  { id: "beach-bum", name: "Beach Bum", criteria: "Visit every beach in Gaia." },
  { id: "beating-the-ragtime-blues", name: "Beating the Ragtime Blues", criteria: "Correctly answer all the questions in Ragtime Mouse's pop quiz." },
  { id: "found-in-the-shuffle", name: "Found in the Shuffle", criteria: "Beat the Nero Brothers' shuffling game nine times in a row." },
  { id: "a-clean-bill-of-health", name: "A Clean Bill of Health", criteria: "Have a single character affected by all status ailments. (both beneficial and detrimental)." },
  { id: "its-all-in-the-cards-iii", name: "It's All in the Cards III", criteria: "Win 100 Tetra Master matches. (Certain NPCs can be re-challenged to increase your win count after progressing through the game.)" },
  { id: "movie-critic", name: "Movie Critic", criteria: "View 79 Active Time Events." },
  { id: "let-the-bodies-hit-the-floor-iii", name: "Let the Bodies Hit the Floor III", criteria: "Defeat 10000 enemies." },
] as const;

const steamAchievementGuideMap: Record<string, Pick<SteamAchievement, "guideObjectiveIds" | "guideChapterIds" | "guideNote" | "guideSourceIds">> = {
  "a-round-of-applause": { guideObjectiveIds: ["disc-1.alexandria.swordfight.applause"] },
  "getting-emotional": { guideObjectiveIds: ["disc-1.evil-forest.getting-emotional"] },
  "its-all-in-the-cards-i": { guideChapterIds: ["disc-1.alexandria", "disc-3.card-tournament"] },
  "going-for-the-gold": { guideObjectiveIds: ["disc-1.exploring-lindblum-kingdom.frog-catching"] },
  "bring-on-the-thunder": { guideObjectiveIds: ["disc-2.pinnacle-rocks.ramuh"] },
  "peek-a-boo": { guideObjectiveIds: ["disc-2.journey-to-outer-continent.peek-a-boo"] },
  "out-of-harms-way": { guideObjectiveIds: ["disc-2.cleyra.out-of-harms-way"] },
  "putting-out-the-fire": { guideObjectiveIds: ["disc-4.memoria.maliris-achievement"] },
  "gone-with-the-winds": { guideObjectiveIds: ["disc-4.memoria.tiamat-achievement"] },
  "all-washed-up": { guideObjectiveIds: ["disc-4.memoria.kraken-achievement"] },
  "hitting-rock-bottom": { guideObjectiveIds: ["disc-4.memoria.lich-achievement"] },
  "its-all-in-the-cards-ii": { guideChapterIds: ["disc-3.card-tournament"] },
  "alls-well-that-ends-well": { guideObjectiveIds: ["disc-4.the-final-battle.complete-game"] },
  auctioneer: { guideChapterIds: ["disc-2.treno"] },
  "the-ultimate-flute": { guideObjectiveIds: ["disc-4.memoria.angel-flute"] },
  "the-ultimate-claws": { guideObjectiveIds: ["disc-4.memoria.rune-claws"] },
  "the-ultimate-rod": { guideChapterIds: ["disc-4.memoria", "disc-4.final-preparations"] },
  "the-ultimate-mace": { guideObjectiveIds: ["disc-4.memoria.mace-of-zeus"] },
  "skip-to-my-lou": { guideObjectiveIds: ["disc-1.alexandria.jump-rope-king"] },
  "end-of-the-road": { guideChapterIds: ["disc-4.final-preparations"] },
  "the-ultimate-racket": { guideChapterIds: ["disc-4.memoria"] },
  "diggin-it": { guideChapterIds: ["disc-2.journey-to-outer-continent", "disc-3.aerial-exploration"] },
  "the-ultimate-dual-blade": { guideChapterIds: ["disc-4.memoria"] },
  "earning-the-queens-favor": { guideObjectiveIds: ["disc-2.treno.stellazzio-rewards", "disc-3.card-tournament.stellazzio-rewards"] },
  "kains-legacy": { guideObjectiveIds: ["disc-4.memoria.kains-lance"] },
  "whats-your-sign": { guideObjectiveIds: ["disc-3.card-tournament.stellazzio-rewards", "disc-4.final-preparations.hammer-ending"] },
  "sword-of-kings": { guideObjectiveIds: ["disc-4.return-to-gaia.magical-fingertip"] },
  "your-lucky-day": { guideObjectiveIds: ["disc-1.village-of-dali.your-lucky-day"] },
  "track-star": { guideChapterIds: ["disc-3.the-home-front"] },
  "frog-wrangler": { guideObjectiveIds: ["disc-4.return-to-gaia.frog-catching"] },
  "hail-to-the-king": { guideObjectiveIds: ["disc-1.alexandria.jump-rope-king"] },
  "firin-mah-lazer": { guideObjectiveIds: ["disc-4.final-preparations.ozma-rewards"] },
  "the-one-ring": { guideObjectiveIds: ["disc-2.journey-to-outer-continent.one-ring"] },
  "mister-nice-guy": { guideObjectiveIds: [
    "disc-1.ice-cavern.mu-friendly-monster",
    "disc-2.journey-to-treno.friendly-ghost",
    "disc-2.outer-continent.friendly-ladybug",
    "disc-2.conde-petie-mountain-path.friendly-yeti",
    "disc-2.journey-to-iifa-tree.nymph",
    "disc-3.forgotten-continent.jabberwock",
    "disc-3.lost-continent.feather-circle",
    "disc-3.aerial-exploration.garuda",
    "disc-3.aerial-exploration.friendly-yan",
  ], guideNote: "The first eight creatures can be befriended in any order if you have the requested item. Friendly Yan is the exception: it checks that all eight are complete and must be done last. Keep Garuda's Diamond for Yan.", guideSourceIds: ["gamefaqs-aerial-exploration-71891", "jegged-friendly-monsters", "gamerguides-side-questing-3"] },
  "back-online": { guideObjectiveIds: ["disc-4.return-to-gaia.mognet-central"] },
  "a-hunting-we-will-go": { guideObjectiveIds: ["disc-1.lindblum.festival-vivi-win"] },
  "taking-the-black": { guideChapterIds: ["disc-4.the-final-battle"] },
  "another-mans-treasure": { guideChapterIds: ["disc-4.final-preparations"] },
  "driving-the-hard-bargain": { guideObjectiveIds: [
    "disc-1.burmecia.stiltzkin-1",
    "disc-2.cleyra.stiltzkin-2",
    "disc-2.fossil-roo.stiltzkin-3",
    "disc-2.conde-petie-mountain-path.stiltzkin-4",
    "disc-3.the-home-front.stiltzkin-5",
    "disc-3.forgotten-continent.stiltzkin-6",
    "disc-3.portal-to-another-world.stiltzkin-7",
    "disc-4.return-to-gaia.stiltzkin-eighth-bundle",
  ] },
  "follow-your-nose": { guideObjectiveIds: ["disc-3.on-the-high-seas.chocographs", "disc-3.aerial-exploration.sky-chocobo"] },
  "to-ozma-and-back": { guideObjectiveIds: ["disc-4.final-preparations.ozma-achievement"] },
  "cracking-the-code": { guideObjectiveIds: ["disc-4.return-to-gaia.eidolon-wall"] },
  "dragon-lady": { guideObjectiveIds: ["disc-4.return-to-gaia.behemoth"] },
  "femme-fatales": { guideChapterIds: ["disc-4.final-preparations"] },
  "over-the-moon": { guideObjectiveIds: [
    "disc-1.alexandria.swordfight.moonstone-1",
    "disc-2.conde-petie-mountain-path.moonstone",
    "disc-3.forgotten-continent.jabberwock",
    "disc-3.lost-continent.feather-circle",
  ] },
  "the-ultimate-sword": { guideObjectiveIds: ["advanced.excalibur-ii.acquire"] },
  "beach-bum": { guideObjectiveIds: ["disc-4.return-to-gaia.chocobo-beach"] },
  "beating-the-ragtime-blues": { guideObjectiveIds: ["disc-3.aerial-exploration.ragtime-mouse"] },
  "found-in-the-shuffle": { guideObjectiveIds: ["disc-3.the-home-front.found-in-the-shuffle"] },
  "its-all-in-the-cards-iii": { guideChapterIds: ["disc-3.card-tournament"] },
  "movie-critic": { guideObjectiveIds: [
    "disc-1.evil-forest.movie-critic-ates",
    "disc-1.village-of-dali.movie-critic-ates",
    "disc-1.lindblum.movie-critic-ates",
    "disc-1.burmecia.wei-kal-ate-prerequisite",
    "disc-2.treno.ates",
    "disc-2.cleyra.movie-critic-ates",
    "disc-2.return-to-alexandria.friendship-ate",
    "disc-2.outer-continent.conde-petie-ates",
    "disc-2.magdalene-forest.ates",
    "disc-2.conde-petie-mountain-path.nuptial-joy",
    "disc-2.return-to-lindblum.ates",
    "disc-2.madain-sari.ates",
    "disc-3.the-home-front.ates",
    "disc-3.the-aftermath.ates",
    "disc-3.lost-continent.lindblum-ates",
    "disc-3.card-tournament.ates",
    "disc-3.portal-to-another-world.bran-bal-ates",
    "disc-3.portal-to-another-world.elevator-ate",
    ...movieCriticEligibleEvents.map((event) => event.objectiveId),
  ], guideSourceIds: ["steam-community-ate-guide", "gamerguides-movie-critic-guide", "playstationtrophies-movie-critic", "xboxachievements-movie-critic"] },
  "let-the-bodies-hit-the-floor-i": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Cumulative battle count for this save. It has no unique story trigger; check the total near the end and use repeatable encounters only if you still need progress.",
  },
  "sticky-fingers": {
    guideChapterIds: ["disc-4.memoria"],
    guideNote: "Use Steal repeatedly in battles. This is a cumulative action count with no one-time chapter window.",
  },
  "coming-together-i": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Synthesize at any synthesis shop and track the cumulative total. The guide's full synthesis database is still being built.",
  },
  "that-old-black-magic": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Cast Black Magic in battles as you progress. This is cumulative and has no unique story cutoff.",
  },
  "wolf-insanity": {
    guideChapterIds: ["disc-2.return-to-madain-sari", "disc-2.conde-petie-mountain-path"],
    guideNote: "After Eiko joins, summon Fenrir in any battle. The Hilgigars encounter is an early convenient opportunity.",
    guideSourceIds: ["jegged-achievements"],
  },
  "take-to-the-skies": { guideObjectiveIds: ["disc-3.aerial-exploration.take-to-the-skies"] },
  "the-best-offense": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Use Defend in battles until the cumulative counter reaches 50; there is no one-time window.",
  },
  "youre-cold-as-ice": {
    guideObjectiveIds: ["disc-3.the-home-front.garnet-eidolons"],
    guideNote: "The Home Front route supplies an Opal for Dagger's Shiva. Equip the gem, learn the summon, then use Shiva in battle.",
  },
  "heat-of-the-moment": {
    guideObjectiveIds: ["disc-3.the-home-front.garnet-eidolons"],
    guideNote: "The Home Front route supplies a Topaz for Dagger's Ifrit. Equip the gem, learn the summon, then use Ifrit in battle.",
  },
  "king-of-dragons": {
    guideObjectiveIds: ["disc-3.lost-continent.garnet-bahamut"],
    guideNote: "Equip the story Garnet to learn Bahamut, then summon it in battle.",
  },
  "bringing-down-the-house": {
    guideObjectiveIds: ["disc-3.the-home-front.garnet-eidolons"],
    guideNote: "The Home Front route supplies an Amethyst for Dagger's Atomos. Equip the gem, learn the summon, then use Atomos in battle.",
  },
  "surfs-up": { guideObjectiveIds: ["disc-2.battle-of-iifa-tree.aquamarine"] },
  "here-to-help": {
    guideObjectiveIds: ["disc-2.iifa-tree.carbuncle-ruby"],
    guideNote: "The Iifa Tree story reward Ruby teaches Eiko Carbuncle when equipped. Summon Carbuncle in battle after learning it.",
  },
  "overly-emotional": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Enter Trance 50 times in the same playthrough. Trance carries no chapter deadline; this is a cumulative grind criterion.",
  },
  "rise-from-the-ashes": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Have Eiko learn Phoenix from a Phoenix Pinion, then summon it in battle. Keep a Pinion available if you also want the separate Still I Rise trigger.",
  },
  "the-dim-mak": { guideObjectiveIds: ["disc-3.card-tournament.dark-matter"] },
  "coming-together-ii": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Synthesize at any synthesis shop and track the cumulative total. The guide's full synthesis database is still being built.",
  },
  "a-healing-touch": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Cast White Magic in battles as you progress. This is cumulative and has no unique story cutoff.",
  },
  "path-of-the-samurai": {
    guideChapterIds: ["disc-4.memoria"],
    guideNote: "Collect the three Genji pieces: Armor, Helmet, and Gloves. The Guardian steals are covered in Memoria; verify all three in inventory.",
    guideSourceIds: ["gamefaqs-achievements-71891"],
  },
  "wolf-in-mogs-clothing": { guideObjectiveIds: ["disc-3.lost-continent.mog-ribbon-madeen"] },
  "close-but-no-cigar": { guideObjectiveIds: ["disc-4.memoria.the-tower"] },
  "the-b-team": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Before the final battle, form a four-man party such as Zidane, Steiner, Vivi, and Amarant. The final-preparation checklist is the last free party-change point.",
  },
  "you-called": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Summon Eidolons 50 times over the playthrough. Repeated summons count; there is no single encounter or cutoff.",
  },
  "my-little-airship": { guideObjectiveIds: ["disc-3.preparing-to-leave.morrid-coffees"] },
  "one-nag-too-many": { guideObjectiveIds: ["disc-1.evil-forest.one-nag-too-many"] },
  "the-ultimate-fork": {
    guideObjectiveIds: ["disc-4.return-to-gaia.frog-catching"],
    guideNote: "The Gastro Fork is Quina's 99-frog reward. Use the frog-catching route and claim Quale's reward when the counter reaches 99.",
  },
  "well-lubricated": { guideObjectiveIds: ["disc-4.return-to-gaia.mognet-central"] },
  "let-the-bodies-hit-the-floor-ii": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Cumulative battle count for this save. Check it near the end; the target has no one-time story trigger.",
  },
  "backstabber": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Receive 30 back attacks across the playthrough. This is cumulative and cannot be routed to one specific encounter.",
  },
  "im-so-blue": {
    guideChapterIds: ["disc-1.exploring-lindblum-kingdom", "disc-4.final-preparations"],
    guideNote: "Use Quina's Blue Magic in battles until the cumulative count reaches 100. Learning spells and casting them are separate actions.",
  },
  "still-i-rise": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "The emergency Rebirth Flame is random when Eiko is in the party and the party is wiped out; Phoenix Pinions raise its chance. TrueSteamAchievements reports 99 Pinions as a 38.67% chance. Do not rely on this as a planned battle safety net.",
    guideSourceIds: ["truesteamachievements-still-i-rise"],
  },
  "a-pillar-of-support": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Acquire every support ability by learning from equipment and checking each character's Ability menu. The complete ability-source database is still in progress.",
  },
  "a-clean-bill-of-health": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Have one character experience every positive and negative status over the playthrough; they do not need to be active together. The status-effect checklist is still being audited.",
    guideSourceIds: ["gamefaqs-achievements-71891"],
  },
  "let-the-bodies-hit-the-floor-iii": {
    guideChapterIds: ["disc-4.final-preparations"],
    guideNote: "Cumulative battle count for this save. Check progress near the end and use repeatable encounters only if needed; no unique story window applies.",
  },
};

export const steamAchievements: SteamAchievement[] = steamAchievementSource.map((achievement) => ({
  ...achievement,
  objectiveId: `achievement.steam.${achievement.id}`,
  sourceId: "steam-achievements",
  ...steamAchievementGuideMap[achievement.id],
}));

// PS4 and Xbox list the same 51 gameplay criteria. The console lists call
// Steam's 10,000-enemy criterion "Bloodlust"; all other shared records retain
// the same title and requirement. Keep these slugs explicit so the parity
// audit catches additions or accidental omissions from either platform.
const consoleSharedAchievementIds = [
  "let-the-bodies-hit-the-floor-iii",
  "driving-the-hard-bargain",
  "cracking-the-code",
  "one-nag-too-many",
  "follow-your-nose",
  "beach-bum",
  "diggin-it",
  "back-online",
  "well-lubricated",
  "frog-wrangler",
  "going-for-the-gold",
  "auctioneer",
  "sword-of-kings",
  "beating-the-ragtime-blues",
  "mister-nice-guy",
  "to-ozma-and-back",
  "my-little-airship",
  "earning-the-queens-favor",
  "whats-your-sign",
  "another-mans-treasure",
  "dragon-lady",
  "hail-to-the-king",
  "skip-to-my-lou",
  "a-round-of-applause",
  "a-hunting-we-will-go",
  "alls-well-that-ends-well",
  "end-of-the-road",
  "the-one-ring",
  "peek-a-boo",
  "track-star",
  "found-in-the-shuffle",
  "its-all-in-the-cards-i",
  "its-all-in-the-cards-ii",
  "its-all-in-the-cards-iii",
  "a-clean-bill-of-health",
  "overly-emotional",
  "movie-critic",
  "over-the-moon",
  "kains-legacy",
  "close-but-no-cigar",
  "the-ultimate-claws",
  "the-ultimate-flute",
  "the-ultimate-mace",
  "the-ultimate-fork",
  "the-ultimate-sword",
  "the-ultimate-rod",
  "the-ultimate-racket",
  "the-ultimate-dual-blade",
  "path-of-the-samurai",
  "your-lucky-day",
  "out-of-harms-way",
] as const;

function buildConsoleCatalog(platform: PlatformAchievement["platform"], sourceId: string): PlatformAchievement[] {
  return consoleSharedAchievementIds.map((parityId) => {
    const sharedRecord = steamAchievements.find((achievement) => achievement.id === parityId);
    if (!sharedRecord) throw new Error(`Console achievement parity record is missing: ${parityId}`);
    const isConsoleBloodlust = parityId === "let-the-bodies-hit-the-floor-iii";
    const id = isConsoleBloodlust ? "bloodlust" : sharedRecord.id;
    return {
      ...sharedRecord,
      platform,
      id,
      objectiveId: `achievement.${platform}.${id}`,
      sourceId,
      name: isConsoleBloodlust ? "Bloodlust" : sharedRecord.name,
      guideSourceIds: [...new Set([
        ...(sharedRecord.guideSourceIds ?? []),
        "gamefaqs-achievements-71891",
        sourceId,
      ])],
      parityId,
    };
  });
}

const ps4GameplayTrophies = buildConsoleCatalog("ps4", "playstationtrophies-FFIX-list");
const ps4Platinum: PlatformAchievement = {
  platform: "ps4",
  id: "heroes-of-gaia",
  objectiveId: "achievement.ps4.heroes-of-gaia",
  sourceId: "playstationtrophies-FFIX-list",
  parityId: "ps4-platinum",
  name: "Heroes of Gaia",
  criteria: "Collect all trophies.",
  guideChapterIds: ["disc-4.the-final-battle"],
  guideNote: "The Platinum trophy is awarded automatically after earning the other 51 PS4 trophies.",
  guideSourceIds: ["playstationtrophies-FFIX-list", "gamefaqs-achievements-71891"],
};

export const ps4Trophies: PlatformAchievement[] = [...ps4GameplayTrophies, ps4Platinum];
export const xboxAchievements: PlatformAchievement[] = buildConsoleCatalog("xbox", "xboxachievements-FFIX-list");

export const achievementCatalogs = {
  steam: steamAchievements,
  ps4: ps4Trophies,
  xbox: xboxAchievements,
} satisfies Record<"steam" | "ps4" | "xbox", AchievementRecord[]>;
