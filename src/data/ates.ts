export type ActiveTimeEvent = {
  id: string;
  objectiveId: string;
  title: string;
  chapterId: string;
  groupObjectiveId: string;
  location: string;
  trigger: string;
  countsTowardMovieCritic: boolean;
  exclusiveGroupId?: string;
  prerequisites?: string[];
  note?: string;
  sourceIds: string[];
};

const routeSources = ["steam-community-ate-guide", "gamerguides-movie-critic-guide"];
const achievementSources = ["playstationtrophies-movie-critic", "xboxachievements-movie-critic"];

function scene(
  slug: string,
  title: string,
  chapterId: string,
  groupObjectiveId: string,
  location: string,
  trigger: string,
  options: Partial<Pick<ActiveTimeEvent, "countsTowardMovieCritic" | "exclusiveGroupId" | "prerequisites" | "note" | "objectiveId" | "sourceIds">> = {},
): ActiveTimeEvent {
  const objectiveId = options.objectiveId ?? `ate.${slug}`;
  const eligible = options.countsTowardMovieCritic ?? true;
  return {
    id: `ate-${slug}`,
    objectiveId,
    title,
    chapterId,
    groupObjectiveId,
    location,
    trigger,
    countsTowardMovieCritic: eligible,
    ...(options.exclusiveGroupId ? { exclusiveGroupId: options.exclusiveGroupId } : {}),
    ...(options.prerequisites ? { prerequisites: options.prerequisites } : {}),
    ...(options.note ? { note: options.note } : {}),
    sourceIds: [...routeSources, ...achievementSources, ...(options.sourceIds ?? [])],
  };
}

const events: ActiveTimeEvent[] = [
  scene("forest-keeper", "The Forest Keeper", "disc-1.evil-forest", "disc-1.evil-forest.movie-critic-ates", "Prima Vista — crash site", "After the crash, view the prompt before leaving the room."),
  scene("time-to-escape", "Time To Escape", "disc-1.evil-forest", "disc-1.evil-forest.movie-critic-ates", "Prima Vista — hallway", "View the hallway prompt during the escape."),
  scene("girl-left-behind", "Girl Who Was Left Behind", "disc-1.evil-forest", "disc-1.evil-forest.movie-critic-ates", "Prima Vista — hallway", "View the hallway prompt during the escape."),
  scene("my-little-baby", "My Little Baby", "disc-1.evil-forest", "disc-1.evil-forest.movie-critic-ates", "Prima Vista — hallway", "View after Time To Escape, while Cinna is outside the ship.", { prerequisites: ["ate.time-to-escape"] }),
  scene("orchestra-in-the-forest", "Orchestra In The Forest", "disc-1.evil-forest", "disc-1.evil-forest.movie-critic-ates", "Evil Forest — trail", "View after entering the forest route."),
  scene("do-as-i-say-not-as-i-do", "Do As I Say, Not As I Do", "disc-1.evil-forest", "disc-1.evil-forest.movie-critic-ates", "Evil Forest — spring", "View at the spring during the camp sequence."),
  scene("mogster-lesson-1", "Teach Me, Mogster! Lesson 1", "disc-1.evil-forest", "disc-1.evil-forest.mogster-lesson-1", "Gunitas Basin — campsite", "View the tutorial after leaving the Evil Forest.", { objectiveId: "disc-1.evil-forest.mogster-lesson-1", countsTowardMovieCritic: false }),
  scene("mogster-lesson-2", "Teach Me, Mogster! Lesson 2", "disc-1.ice-cavern", "disc-1.ice-cavern.mogster-lesson-2", "Ice Cavern — cave", "View the tutorial after freeing Mois.", { objectiveId: "disc-1.ice-cavern.mogster-lesson-2", countsTowardMovieCritic: false }),

  scene("dali-vivi-confused", "Vivi, Confused", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — inn", "When Zidane wakes alone, view this or Dagger Tries first; leave the bedroom to view the other.", { sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali"] }),
  scene("dali-dagger-tries", "Dagger Tries", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — inn", "When Zidane wakes alone, view this or Vivi, Confused first; leave the bedroom to view the other.", { sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali"] }),
  scene("dali-cats-eye", "Cat's Eye", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — village road", "Leave the inn after viewing both opening ATEs; view Cat's Eye before its follow-up.", { sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali"] }),
  scene("dali-cats-eye-2", "Cat's Eye 2", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — village screens", "After Cat's Eye and speaking with Vivi, change screens until the prompt appears; do not wait in the inn reception.", { prerequisites: ["ate.dali-cats-eye"], sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali"] }),
  scene("dali-dagger-tries-harder", "Dagger Tries Harder", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — village screens", "After Dagger Tries, move between town screens until this appears; view it before entering the Weapon Shop.", { prerequisites: ["ate.dali-dagger-tries"], sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali"] }),
  scene("dali-queen-brahnes-steiner", "Queen Brahne's Steiner", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — inn", "After Dagger Tries Harder and Cat's Eye, speak with Dagger in the Weapon Shop, return to the inn, and talk to her; this ATE triggers automatically.", { prerequisites: ["ate.dali-dagger-tries-harder", "ate.dali-cats-eye"], sourceIds: ["gamefaqs-dali-71891", "jegged-dali", "gamerguides-dali"] }),

  scene("lindblum-small-town-knight", "Small-Town Knight In A Big City", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Business District", "View while Steiner is lost in the district."),
  scene("lindblum-vivi-shopping", "Vivi's Shopping", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Business District air-cab station", "Enter the station when the prompt appears; the ATE awards a Kupo Nut."),
  scene("lindblum-steam-engine", "Steam Engine", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Theater District station", "View during the first district sweep."),
  scene("lindblum-what-can-i-do", "What Can I Do?", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Tantalus Hideout", "View after Zidane leaves the hideout."),
  scene("lindblum-baku-and-his-crew", "Baku And His Crew", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Theater Avenue", "View before leaving the first Lindblum visit."),
  scene("mogster-lesson-3", "Teach Me, Mogster! My First Synthesis Lesson", "disc-1.lindblum", "disc-1.lindblum.mogster-lesson-3", "Lindblum — inn", "View the synthesis tutorial at the inn.", { objectiveId: "disc-1.lindblum.mogster-lesson-3", countsTowardMovieCritic: false }),

  scene("treno-tradition", "Treno Tradition", "disc-2.treno", "disc-2.treno.ates", "Treno — entrance", "View before leaving the entrance. Press the Action button at Dagger's exclamation prompt to reduce the pickpocket loss from 1,000 to 500 Gil.", { sourceIds: ["gamefaqs-treno-71891", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno"] }),
  scene("treno-pursuit", "Pursuit", "disc-2.treno", "disc-2.treno.ates", "Treno — west walkway", "After Treno Tradition, go west from the entrance and view Pursuit.", { sourceIds: ["gamefaqs-treno-71891", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno"] }),
  scene("treno-confusion", "Confusion", "disc-2.treno", "disc-2.treno.ates", "Treno — stairs below the west walkway", "After Pursuit, follow Dagger down the stairs and view Confusion before leaving this route.", { sourceIds: ["gamefaqs-treno-71891", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno"] }),
  scene("treno-ambition", "Ambition", "disc-2.treno", "disc-2.treno.ates", "Treno — Card Stadium approach", "After Confusion, head south/southeast toward the Card Stadium and view Ambition.", { sourceIds: ["gamefaqs-treno-71891", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno"], note: "The safe four-source route places Ambition before Meeting Place and Unexpected Visitor. A TrueAchievements route appears to swap Ambition and Unexpected Visitor; this ordering follows GameFAQs, Jegged, Gamer Guides, and EliteGrindLab." }),
  scene("treno-meeting-place", "Meeting Place", "disc-2.treno", "disc-2.treno.ates", "Treno — right-hand stairs from the entrance", "Return to the entrance by the route you came, take the right-hand stairs/east path, and view Meeting Place.", { sourceIds: ["gamefaqs-treno-71891", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno"] }),
  scene("treno-unexpected-visitor", "Unexpected Visitor", "disc-2.treno", "disc-2.treno.ates", "Treno — north screen past the right-hand stairs", "After Meeting Place, go north one screen and view Unexpected Visitor before entering the Auction House or sweeping up city items.", { sourceIds: ["gamefaqs-treno-71891", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno"], note: "GameFAQs says the Auction House screen closes unviewed ATEs except Unexpected Visitor and Crime and Punishment. The safe route views this sixth scene before exploring." }),
  scene("treno-crime-and-punishment", "Crime And Punishment", "disc-2.treno", "disc-2.treno.ates", "Treno — Doctor Tot's Tower exit", "After Doctor Tot opens the Gargan Roo hatch, climb back through the tower and leave it to trigger Crime and Punishment; view it before descending into Gargan Roo.", { sourceIds: ["gamefaqs-treno-71891", "jegged-treno", "gamerguides-treno", "elitegrindlab-treno"] }),

  scene("cleyra-no-yummie-yummies", "No Yummy-Yummies!", "disc-2.cleyra", "disc-2.cleyra.movie-critic-ates", "Cleyra — Water Mill/pond area", "With Quina in the party, enter the pond area and view the prompt.", { note: "This and There A Mushroom! are the two Quina ATEs needed to open the rubbish-pit route to the Silk Robe and second Magician Shoes.", sourceIds: ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "gamerguides-movie-critic-guide", "elitegrindlab-cleyra"] }),
  scene("cleyra-dont-hate-me", "Don't Hate Me", "disc-2.cleyra", "disc-2.cleyra.movie-critic-ates", "Cleyra — Water Mill/pond area", "View the second prompt available on the pond-area route.", { sourceIds: ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "gamerguides-movie-critic-guide", "elitegrindlab-cleyra"] }),
  scene("cleyra-i-havent-hurt-anyone", "I-I Haven't Hurt Anyone", "disc-2.cleyra", "disc-2.cleyra.movie-critic-ates", "Cleyra — Water Mill/pond area", "After leaving the pond area, re-enter it and view the prompt before advancing the story.", { sourceIds: ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "gamerguides-movie-critic-guide", "elitegrindlab-cleyra"] }),
  scene("cleyra-there-a-mushroom", "There A Mushroom!", "disc-2.cleyra", "disc-2.cleyra.movie-critic-ates", "Cleyra — town observatory", "With Quina in the party, enter the observatory area and view the prompt before returning to the entrance-side rubbish pit.", { sourceIds: ["gamefaqs-cleyra-71891", "jegged-cleyra", "gamerguides-cleyra", "gamerguides-movie-critic-guide", "elitegrindlab-cleyra"], note: "GameFAQs' event list says There a Mushroom!, while its route prose calls it There's a Mushroom!; the ATE list and the other walkthroughs use There A Mushroom!. This and No Yummy-Yummies! are the two Quina ATEs needed to open the rubbish-pit route to the Silk Robe and second Magician Shoes. GameFAQs and Gamer Guides place it second, before the Quina rubbish-pit detour; Jegged's exact area route triggers it at the observatory after the pond prompts. Keep Quina in the party and view all four before continuing toward Antlion." }),

  scene("alexandria-friendship", "Friendship", "disc-2.return-to-alexandria", "disc-2.return-to-alexandria.friendship-ate", "Alexandria Castle — chapel", "View during the rescue sequence before the countdown ends."),

  scene("lindblum-third-jewel", "The Third Jewel", "disc-2.return-to-lindblum", "disc-2.return-to-lindblum.ates", "Lindblum — Business District", "Explore the city after meeting Cid."),
  scene("lindblum-brahnes-fleet", "Brahne's Fleet Arrives", "disc-2.return-to-lindblum", "disc-2.return-to-lindblum.ates", "Lindblum — Business District square", "Talk to the waiting man in the square."),
  scene("lindblum-how-infuriating", "(Gwok-gwok!) How Infuriating!", "disc-2.return-to-lindblum", "disc-2.return-to-lindblum.ates", "Lindblum — Base Level / Serpent's Gate", "Check the soldiers at Serpent's Gate."),

  scene("conde-petie-vivi-and-couple", "Vivi And The Couple", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — entrance", "View as soon as control returns, before moving to another screen.", { sourceIds: ["gamefaqs-outer-continent-71891", "jegged-conde-petie", "gamerguides-movie-critic-guide", "elitegrindlab-conde-petie"] }),
  scene("conde-petie-quina-accused", "Quina Accused", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — entrance-side corridor", "After Vivi and the Couple, follow the entrance-side route to Quina Accused. Do not enter Wendy Grocer's Item Shop screen before the prompt appears.", { prerequisites: ["ate.conde-petie-vivi-and-couple"], sourceIds: ["gamefaqs-outer-continent-71891", "jegged-conde-petie", "gamerguides-movie-critic-guide", "elitegrindlab-conde-petie"], note: "GameFAQs places the prompt east of the entrance; Jegged and Gamer Guides describe the route through the left-side passage/Inn. Preserve the named prompt before entering the Item Shop screen rather than relying on compass directions." }),
  scene("conde-petie-quina-cant-communicate", "Quina Can't Communicate", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — Inn/side-door route", "After Quina Accused, check the Inn and adjacent side doors for Quina Can't Communicate. Do not enter the Item Shop screen until this prompt has appeared.", { prerequisites: ["ate.conde-petie-quina-accused"], sourceIds: ["gamefaqs-outer-continent-71891", "jegged-conde-petie", "gamerguides-movie-critic-guide", "elitegrindlab-conde-petie"] }),
  scene("conde-petie-dagger-and-william", "Dagger And William", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — eastern corridor/Item Shop approach", "After Quina Can't Communicate, return to the entrance and go east toward the Item Shop to view Dagger and William before speaking to shopkeepers or going upstairs.", { prerequisites: ["ate.conde-petie-quina-cant-communicate"], sourceIds: ["gamefaqs-outer-continent-71891", "jegged-conde-petie", "gamerguides-movie-critic-guide", "elitegrindlab-conde-petie"] }),
  scene("conde-petie-hungry-bryan", "Hungry Bryan", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — stairs above the Item Shop", "After the four earlier ATEs, go upstairs and speak with Vivi; view Hungry Bryan when the prompt appears.", { prerequisites: ["ate.conde-petie-vivi-and-couple", "ate.conde-petie-quina-accused", "ate.conde-petie-quina-cant-communicate", "ate.conde-petie-dagger-and-william"], sourceIds: ["gamefaqs-outer-continent-71891", "jegged-conde-petie", "gamerguides-movie-critic-guide", "elitegrindlab-conde-petie"] }),

  scene("bmv-everyday-life", "Everyday Life", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — entrance", "View this first as soon as Zidane regains control, before taking another village route.", { sourceIds: ["gamefaqs-magdalene-forest-71891", "jegged-black-mage-village", "gamerguides-movie-critic-guide"] }),
  scene("bmv-life-on-the-run", "Life On The Run", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — raised plank path", "After Everyday Life, climb the stairs behind Zidane and follow the plank around the hut to the next screen; do not take the far-right stable path yet.", { prerequisites: ["ate.bmv-everyday-life"], sourceIds: ["gamefaqs-magdalene-forest-71891", "jegged-black-mage-village", "gamerguides-movie-critic-guide"], note: "GameFAQs describes the exit as north-northeast and Gamer Guides as one screen right; both distinguish it from the far-right stable route." }),
  scene("bmv-gourmands-nose", "Gourmand's Nose", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — Item Shop exits", "After Life On The Run, enter the Item Shop through its rear entrance and leave through the western/normal exit. Do this before visiting the stable.", { prerequisites: ["ate.bmv-life-on-the-run"], sourceIds: ["gamefaqs-magdalene-forest-71891", "jegged-black-mage-village", "gamerguides-movie-critic-guide"], note: "The Item Shop route is the critical trigger: visiting the stable first closes this ATE." }),
  scene("bmv-different-language", "Different Language", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — route between the shops and stable/cemetery", "After collecting Mogryo's letter, follow the route toward the stable and view Different Language when its named prompt appears, before going to the cemetery or synthesis shop.", { prerequisites: ["ate.bmv-gourmands-nose"], sourceIds: ["gamefaqs-magdalene-forest-71891", "jegged-black-mage-village", "gamerguides-movie-critic-guide"], note: "The letter must be collected after the first three ATEs and before this scene. Directions differ: GameFAQs places it on the stable route and also describes triggering it west of the Synthesis Shop entrance; Jegged says to pass left of a door after Gourmand's Nose; Gamer Guides says return to the entrance and take the far-right path. Follow the named ATE prompt." }),
  scene("bmv-visitor-not-invader", "Visitor, Not Invader / Intruder", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — far-west cemetery", "After Different Language, reach the far-west cemetery from the left-side route and view Visitor, Not Invader before entering the Synthesis Shop.", { prerequisites: ["ate.bmv-different-language"], sourceIds: ["gamefaqs-magdalene-forest-71891", "jegged-black-mage-village", "gamerguides-movie-critic-guide"], note: "Screen directions vary among guides; retain the named cemetery ATE as the checkpoint." }),
  scene("bmv-life-cycle", "Life Cycle", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — Synthesis Shop", "After Visitor, Not Invader, enter the Synthesis Shop and view Life Cycle when Dagger leaves.", { prerequisites: ["ate.bmv-visitor-not-invader"], sourceIds: ["gamefaqs-magdalene-forest-71891", "jegged-black-mage-village", "gamerguides-movie-critic-guide"] }),

  scene("mountain-path-nuptial-joy", "Nuptial Joy", "disc-2.conde-petie-mountain-path", "disc-2.conde-petie-mountain-path.nuptial-joy", "Conde Petie — shrine", "After the ceremony, answer “Why don't you guys get married, too?” to Vivi and Quina."),

  scene("madain-vivis-feelings", "Vivi's Feelings", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — open area", "View this first-visit prompt before heading north toward the Eidolon Wall path.", { sourceIds: ["gamefaqs-madain-sari-71891", "jegged-madain-sari", "gamerguides-madain-sari", "rpgclassics-madain-sari"] }),
  scene("madain-daggers-feelings", "Dagger's Feelings", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — Eidolon Wall path", "After Vivi's Feelings, head north from the fountain toward the blocked Eidolon Wall entrance and view the prompt.", { prerequisites: ["ate.madain-vivis-feelings"], sourceIds: ["gamefaqs-madain-sari-71891", "jegged-madain-sari", "gamerguides-madain-sari", "rpgclassics-madain-sari"], note: "The source-majority route puts this before Eiko's Feelings; Jegged's prose gives a different order. Screen labels and task details vary by walkthrough." }),
  scene("madain-eikos-feelings", "Eiko's Feelings", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — fountain/open area", "After Dagger's Feelings, speak with Moco by the blocked Eidolon Wall entrance so Quina appears, then return to the fountain and view the prompt.", { prerequisites: ["ate.madain-daggers-feelings"], sourceIds: ["gamefaqs-madain-sari-71891", "jegged-madain-sari", "gamerguides-madain-sari", "rpgclassics-madain-sari"], note: "This follows the order supported by GameFAQs, Gamer Guides, and RPGClassics. Jegged places Eiko's Feelings earlier in its prose; keep the event order unverified in game." }),
  scene("madain-eikos-kitchen", "Eiko's Kitchen", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — kitchen/Eidolon Wall route", "After Eiko's Feelings, speak to Vivi and try entering Eiko's house; follow Morrison toward the Eidolon Wall and view the prompt on that route. Do not enter the kitchen as Zidane yet.", { prerequisites: ["ate.madain-eikos-feelings"], sourceIds: ["gamefaqs-madain-sari-71891", "jegged-madain-sari", "gamerguides-madain-sari", "rpgclassics-madain-sari"], note: "GameFAQs describes returning to the fountain after the doorway attempt; Gamer Guides and RPGClassics describe the prompt along Morrison's route. The safe route follows the doorway attempt and escort, then confirms the named ATE before continuing." }),
  scene("madain-eikos-kitchen-2", "Eiko's Kitchen 2", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — Eidolon Wall exit", "After taking Dagger to the Eidolon Wall and letting her inspect the murals, leave the area and view the prompt before going to dinner.", { prerequisites: ["ate.madain-eikos-kitchen"], sourceIds: ["gamefaqs-madain-sari-71891", "jegged-madain-sari", "gamerguides-madain-sari", "rpgclassics-madain-sari"] }),

  scene("alexandria-its-so-big", "It's So Big", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — Main Street", "Check the street by the pub during the Disc III return."),
  scene("alexandria-long-time-no-see", "Long Time No See!", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — Main Street", "Check the opposite side of the pub during the Disc III return."),
  scene("alexandria-to-fly-high", "To Fly High", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — square", "Check the alley in the square."),
  scene("alexandria-artemicion", "Artemicion", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — steeple", "Check the steeple during the city visit."),
  scene("alexandria-i-forgot", "I Forgot!", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — Ruby's theatre", "View after Vivi rejoins Zidane."),
  scene("alexandria-clowns-on-a-dark-night", "Clowns On A Dark Night", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — location varies by route", "Check the prompt during the Disc III city sequence.", { note: "The effect of Madain Sari cooking choices on I Forgot! is reported as uncertain; this route detail needs in-game verification." }),

  scene("treno-eiko-talks-life", "Eiko Talks Life", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Tot's Residence walkway", "View after regaining control in Treno.", { sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"] }),
  scene("treno-how-he-ended-up-here", "How He Ended Up Here", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Tot's Residence stairs/gate", "View before choosing Vivi's next destination.", { sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"] }),
  scene("treno-hippos-prize", "Hippo's Prize", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Tot's Residence exit", "If Vivi stays in Treno, view this before Memories By The Water or changing screens.", { exclusiveGroupId: "ate.treno.vivi-choice", sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"], note: "This and Home Sweet Home are alternative Vivi outcomes. Gamer Guides says to view Hippo's Prize before Memories By The Water; only one branch ATE is available on a save." }),
  scene("treno-memories-by-the-water", "Memories By The Water", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Tot's Residence exit/walkway", "After Hippo's Prize if Vivi stayed, view this before moving on to City People.", { sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"], note: "In Vivi's stay branch, Gamer Guides warns that the next screen can close Hippo's Prize; view it before taking the route to this event." }),
  scene("treno-city-people", "City People", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Card Stadium/Bishop's House", "After Memories By The Water, view this near the Card Stadium before starting the tournament; the event leads to a Chimera Armlet.", { prerequisites: ["ate.treno-memories-by-the-water"], sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"] }),
  scene("treno-good-old-days", "Good Old Days", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Card Stadium route", "View after Zidane's first card match.", { sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"] }),
  scene("treno-lessons-of-life", "Lessons of Life", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Card Stadium route", "Choose “Of course I'm interested” in Good Old Days, then change screens and view this ATE.", { prerequisites: ["ate.treno-good-old-days"], sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"] }),
  scene("treno-home-sweet-home", "Home Sweet Home", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Card Stadium route", "Only if Vivi went home: after Good Old Days and Lessons of Life, view this ATE; do not visit Quan's Dwelling as Zidane before it appears.", { exclusiveGroupId: "ate.treno.vivi-choice", prerequisites: ["ate.treno-good-old-days", "ate.treno-lessons-of-life"], sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"], note: "This and Hippo's Prize are alternative Vivi outcomes. Gamer Guides places Home Sweet Home after Good Old Days and Lessons of Life; only one branch ATE is available on a save." }),
  scene("treno-hallucination", "Hallucination", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Card Stadium", "After Zidane's second card match, view this before leaving the screen; it is also a prerequisite for a later Lindblum ATE.", { sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"] }),
  scene("treno-premonition", "Premonition", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — tournament route", "After Hallucination, change screens and view this before starting the final match.", { sourceIds: ["gamefaqs-card-tournament-71891", "jegged-treno-tournament", "gamerguides-treno-tournament", "elitegrindlab-treno-tournament"] }),

  scene("lindblum-something-washed-ashore", "Something Washed Ashore", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — hallway/harbor", "View after Hallucination.", { prerequisites: ["ate.treno-hallucination"] }),
  scene("lindblum-my-bad-fault", "My Bad / Fault", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — Guest Room and telescope", "When Blank interrupts Zidane in the Guest Room, choose “Where's Dagger?”; view Something Washed Ashore if available, then go straight to the telescope and speak with Dagger to view My Bad.", { note: "A Steam community route warns not to speak with Blank again during the search; Gamer Guides confirms the Guest Room choice and telescope conversation. Follow the direct route to preserve the trigger.", sourceIds: ["gamefaqs-the-aftermath-71891", "jegged-the-aftermath", "gamerguides-the-aftermath"] }),
  scene("lindblum-self-reproach", "Self-reproach", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — conference room", "View while Zidane talks to Regent Cid."),
  scene("lindblum-deep-anger", "Deep Anger", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — conference room", "View during the conference-room conversation."),
  scene("lindblum-my-hammer", "My Hammer", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — hall", "View during the post-attack return."),
  scene("lindblum-the-rally", "The Rally", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum — Theater District station", "If Wei and Kal's Burmecia scene was viewed, enter the Theater District to trigger their reunion scene and The Rally ATE automatically.", { prerequisites: ["disc-1.burmecia.wei-kal-ate-prerequisite"], sourceIds: ["gamefaqs-the-aftermath-71891", "jegged-the-aftermath", "gamerguides-the-aftermath"] }),
  scene("lindblum-no-free-lunch", "No Free Lunch", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — Royal Chamber exit hall", "After returning all three potions to Cid, leave the Royal Chamber and view the ATE prompt; have fewer than 50 Gil when you deliver the potions.", { note: "GameFAQs, Jegged, and Gamer Guides specify fewer than 50 Gil before or at the potion handoff. An older spoiler-free guide says below 100 Gil; the guide uses below 50 as the conservative condition. No Free Lunch forfeits the Gil Zidane is carrying.", sourceIds: ["gamefaqs-the-aftermath-71891", "jegged-the-aftermath", "gamerguides-the-aftermath", "deis-spoiler-free-walkthrough"] }),
  scene("lindblum-give-me-my-money", "Give Me My Money", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum — Business District pickle seller, then Serpent's Gate", "After viewing No Free Lunch, keep fewer than 50 Gil, revisit the Business District's pickle-seller screen and trigger the separate Quina scene, then board the Blue Narciss at Serpent's Gate to view this ATE automatically.", { prerequisites: ["ate.lindblum-no-free-lunch"], note: "The pickle-seller scene is setup, not the ATE; the ATE appears when boarding the ship. GameFAQs, Jegged, and Gamer Guides specify fewer than 50 Gil. An older spoiler-free guide says below 100, so the route keeps the stricter under-50 balance and leaves the renewed Tantalus Gil chests closed until after the ATE.", sourceIds: ["gamefaqs-the-aftermath-71891", "jegged-the-aftermath", "gamerguides-the-aftermath", "deis-spoiler-free-walkthrough"] }),

  scene("lindblum-team", "Team", "disc-3.lost-continent", "disc-3.lost-continent.lindblum-ates", "Lindblum — return route", "View the forced ATE after the Mount Gulug sequence."),
  scene("lindblum-recovery", "Recovery", "disc-3.lost-continent", "disc-3.lost-continent.lindblum-ates", "Lindblum — return route", "View the second forced ATE during the same return sequence."),

  scene("bran-bal-place-to-call-home", "Place To Call Home", "disc-3.portal-to-another-world", "disc-3.portal-to-another-world.bran-bal-ates", "Bran Bal — Inn", "View the prompt after gaining control of Eiko inside the Inn.", { sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-bran-bal", "rpgclassics-bran-bal"] }),
  scene("bran-bal-where-the-heart-is", "Where The Heart Is", "disc-3.portal-to-another-world", "disc-3.portal-to-another-world.bran-bal-ates", "Bran Bal — pond", "Leave the Inn, then view the prompt outside.", { sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-bran-bal", "rpgclassics-bran-bal"] }),
  scene("bran-bal-came-into-this-world", "Came Into This World", "disc-3.portal-to-another-world", "disc-3.portal-to-another-world.bran-bal-ates", "Bran Bal — screen east of the Inn", "Move one screen right/east of the Inn and view the prompt.", { note: "GameFAQs titles this ATE 'Came Into the World'; Jegged and RPGClassics use 'Came Into This World.'", sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-bran-bal", "rpgclassics-bran-bal"] }),
  scene("bran-bal-the-truth", "The Truth", "disc-3.portal-to-another-world", "disc-3.portal-to-another-world.bran-bal-ates", "Bran Bal — northern Meeting Hall", "After viewing the first three Bran Bal ATEs, enter the northern Meeting Hall.", { prerequisites: ["ate.bran-bal-place-to-call-home", "ate.bran-bal-where-the-heart-is", "ate.bran-bal-came-into-this-world"], sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-bran-bal", "rpgclassics-bran-bal"] }),
  scene(
    "pandemonium-the-lift",
    "The Lift — Both Groups Work Together",
    "disc-3.portal-to-another-world",
    "disc-3.portal-to-another-world.elevator-ate",
    "Pandemonium — elevator-control room and lift room",
    "At the controls, set Standard Heading to 0. Enter the lift room and try each of its three accessible boarding ledges; the force field blocks all three. Return to the controls, set Heading to 2, and try all three ledges again. Go back to the controls for the scene, then return to the lift room and view The Lift ATE.",
    {
      note: "Gamer Guides gives the explicit 0 → three blocked ledges → 2 → repeat → return to controls → re-enter lift room sequence. Jegged and RPGClassics describe repeated elevator attempts more generally; GameFAQs lists the event without the same step-by-step trigger. Verify the prompt on the active version before advancing. Some achievement guides call this event The Elevator.",
      sourceIds: ["gamefaqs-portal-to-another-world-71891", "jegged-pandemonium"],
    },
  ),
];

export const activeTimeEvents = events;
export const movieCriticEligibleEvents = activeTimeEvents.filter((event) => event.countsTowardMovieCritic);
export const movieCriticTarget = 79;
export const movieCriticExclusiveGroupId = "ate.treno.vivi-choice";

export const activeTimeEventObjectives = activeTimeEvents
  .filter((event) => event.countsTowardMovieCritic)
  .map((event) => ({
    id: event.objectiveId,
    title: `View ATE: ${event.title}`,
    category: "side-content" as const,
    sourceIds: event.sourceIds,
    chapterIds: [event.chapterId],
    verification: "partial" as const,
  }));
