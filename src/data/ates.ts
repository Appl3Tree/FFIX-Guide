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

  scene("dali-vivi-confused", "Vivi, Confused", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — inn", "View the first prompt after Zidane wakes alone."),
  scene("dali-dagger-tries", "Dagger Tries", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — inn", "View the inn prompt before moving through town."),
  scene("dali-cats-eye", "Cat's Eye", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — village road", "View near the windmill."),
  scene("dali-cats-eye-2", "Cat's Eye 2", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — village road", "View the innkeeper prompt during the town sweep."),
  scene("dali-dagger-tries-harder", "Dagger Tries Harder", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — weapon shop", "View after Dagger Tries; the screen route can vary.", { prerequisites: ["ate.dali-dagger-tries"] }),
  scene("dali-queen-brahnes-steiner", "Queen Brahne's Steiner", "disc-1.village-of-dali", "disc-1.village-of-dali.movie-critic-ates", "Dali — inn/pub", "Talk to Dagger in the weapon shop after Dagger Tries Harder and Cat's Eye, then return to the inn.", { prerequisites: ["ate.dali-dagger-tries-harder", "ate.dali-cats-eye"] }),

  scene("lindblum-small-town-knight", "Small-Town Knight In A Big City", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Business District", "View while Steiner is lost in the district."),
  scene("lindblum-vivi-shopping", "Vivi's Shopping", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Business District air-cab station", "Enter the station when the prompt appears; the ATE awards a Kupo Nut."),
  scene("lindblum-steam-engine", "Steam Engine", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Theater District station", "View during the first district sweep."),
  scene("lindblum-what-can-i-do", "What Can I Do?", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Tantalus Hideout", "View after Zidane leaves the hideout."),
  scene("lindblum-baku-and-his-crew", "Baku And His Crew", "disc-1.lindblum", "disc-1.lindblum.movie-critic-ates", "Lindblum — Theater Avenue", "View before leaving the first Lindblum visit."),
  scene("mogster-lesson-3", "Teach Me, Mogster! My First Synthesis Lesson", "disc-1.lindblum", "disc-1.lindblum.mogster-lesson-3", "Lindblum — inn", "View the synthesis tutorial at the inn.", { objectiveId: "disc-1.lindblum.mogster-lesson-3", countsTowardMovieCritic: false }),

  scene("treno-tradition", "Treno Tradition", "disc-2.treno", "disc-2.treno.ates", "Treno — gate/walkway", "Follow Dagger's path left from the gate."),
  scene("treno-pursuit", "Pursuit", "disc-2.treno", "disc-2.treno.ates", "Treno — walkway", "Follow Dagger toward the Bishop's House."),
  scene("treno-confusion", "Confusion", "disc-2.treno", "disc-2.treno.ates", "Treno — Bishop's House", "Follow Dagger toward the Knight's House, then down and right."),
  scene("treno-unexpected-visitor", "Unexpected Visitor", "disc-2.treno", "disc-2.treno.ates", "Treno — Card Stadium/Auction House", "Go up the stairs to the right when the prompt appears."),
  scene("treno-ambition", "Ambition", "disc-2.treno", "disc-2.treno.ates", "Treno — Knight's House", "Go up the stairs/tower, then down."),
  scene("treno-meeting-place", "Meeting Place", "disc-2.treno", "disc-2.treno.ates", "Treno — pub/slum", "View the prompt, then find Dagger to continue."),
  scene("treno-crime-and-punishment", "Crime And Punishment", "disc-2.treno", "disc-2.treno.ates", "Treno — walkway/Summit Station", "Take the stairs back toward town from Tot's Residence; the prompt may also appear during the Gargan Roo transition."),

  scene("cleyra-no-yummie-yummies", "No Yummie-Yummies!", "disc-2.cleyra", "disc-2.cleyra.movie-critic-ates", "Cleyra — town area", "View Quina's prompt during the settlement visit."),
  scene("cleyra-there-a-mushroom", "There A Mushroom!", "disc-2.cleyra", "disc-2.cleyra.movie-critic-ates", "Cleyra — observation point", "View Quina near the Water Mill; then find Quina at the sandpit."),
  scene("cleyra-dont-hate-me", "Don't Hate Me", "disc-2.cleyra", "disc-2.cleyra.movie-critic-ates", "Cleyra — Water Mill area", "View Vivi's prompt in one of the listed settlement screens."),
  scene("cleyra-i-havent-hurt-anyone", "I-I Haven't Hurt Anyone", "disc-2.cleyra", "disc-2.cleyra.movie-critic-ates", "Cleyra — Water Mill area/inn", "View Vivi's prompt before the evacuation cutoff."),

  scene("alexandria-friendship", "Friendship", "disc-2.return-to-alexandria", "disc-2.return-to-alexandria.friendship-ate", "Alexandria Castle — chapel", "View during the rescue sequence before the countdown ends."),

  scene("lindblum-third-jewel", "The Third Jewel", "disc-2.return-to-lindblum", "disc-2.return-to-lindblum.ates", "Lindblum — Business District", "Explore the city after meeting Cid."),
  scene("lindblum-brahnes-fleet", "Brahne's Fleet Arrives", "disc-2.return-to-lindblum", "disc-2.return-to-lindblum.ates", "Lindblum — Business District square", "Talk to the waiting man in the square."),
  scene("lindblum-how-infuriating", "(Gwok-gwok!) How Infuriating!", "disc-2.return-to-lindblum", "disc-2.return-to-lindblum.ates", "Lindblum — Base Level / Serpent's Gate", "Check the soldiers at Serpent's Gate."),

  scene("conde-petie-vivi-and-couple", "Vivi And The Couple", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — corridor", "View before going upstairs or entering later shop screens."),
  scene("conde-petie-quina-accused", "Quina Accused", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — pathway", "View before entering the Item Shop."),
  scene("conde-petie-quina-cant-communicate", "Quina Can't Communicate", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — inn", "View before going right in the Item Shop."),
  scene("conde-petie-dagger-and-william", "Dagger And William", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — shrine", "View before triggering Hungry Bryan."),
  scene("conde-petie-hungry-bryan", "Hungry Bryan", "disc-2.outer-continent", "disc-2.outer-continent.conde-petie-ates", "Conde Petie — shrine", "Talk to Vivi after the earlier Quina scenes and Dagger And William.", { prerequisites: ["ate.conde-petie-vivi-and-couple", "ate.conde-petie-quina-accused", "ate.conde-petie-quina-cant-communicate", "ate.conde-petie-dagger-and-william"] }),

  scene("bmv-everyday-life", "Everyday Life", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — entrance", "Take the upper-right path toward the shop after entering."),
  scene("bmv-life-on-the-run", "Life On The Run", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — Item Shop/inn path", "Follow the upper-right route and check the item-shop screen."),
  scene("bmv-gourmands-nose", "Gourmand's Nose", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — pond/stable path", "Take the route through the shop doors before going to the lower-right path."),
  scene("bmv-different-language", "Different Language", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — Water Mill/cemetery path", "From the entrance take the lower-right route toward the stable, then follow the cemetery path."),
  scene("bmv-visitor-not-invader", "Visitor, Not Invader / Intruder", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — cemetery", "Reach the cemetery from the synthesis-shop side."),
  scene("bmv-life-cycle", "Life Cycle", "disc-2.magdalene-forest", "disc-2.magdalene-forest.ates", "Black Mage Village — synthesis shop", "Enter after viewing the preceding village scenes."),

  scene("mountain-path-nuptial-joy", "Nuptial Joy", "disc-2.conde-petie-mountain-path", "disc-2.conde-petie-mountain-path.nuptial-joy", "Conde Petie — shrine", "After the ceremony, answer “Why don't you guys get married, too?” to Vivi and Quina."),

  scene("madain-vivis-feelings", "Vivi's Feelings", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — open area", "View during the first-visit sequence before agreeing to rest."),
  scene("madain-daggers-feelings", "Dagger's Feelings", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — right path", "Return left from the entrance when the prompt appears."),
  scene("madain-eikos-feelings", "Eiko's Feelings", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — kitchen/open area", "Follow Morrison after trying to enter the kitchen."),
  scene("madain-eikos-kitchen", "Eiko's Kitchen", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — kitchen", "View during Eiko's dinner preparation."),
  scene("madain-eikos-kitchen-2", "Eiko's Kitchen 2", "disc-2.madain-sari", "disc-2.madain-sari.ates", "Madain Sari — kitchen", "Requires Quina to return to the kitchen; choose Quina's advice.", { prerequisites: ["ate.madain-eikos-kitchen"] }),

  scene("alexandria-its-so-big", "It's So Big", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — Main Street", "Check the street by the pub during the Disc III return."),
  scene("alexandria-long-time-no-see", "Long Time No See!", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — Main Street", "Check the opposite side of the pub during the Disc III return."),
  scene("alexandria-to-fly-high", "To Fly High", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — square", "Check the alley in the square."),
  scene("alexandria-artemicion", "Artemicion", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — steeple", "Check the steeple during the city visit."),
  scene("alexandria-i-forgot", "I Forgot!", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — Ruby's theatre", "View after Vivi rejoins Zidane."),
  scene("alexandria-clowns-on-a-dark-night", "Clowns On A Dark Night", "disc-3.the-home-front", "disc-3.the-home-front.ates", "Alexandria — location varies by route", "Check the prompt during the Disc III city sequence.", { note: "The effect of Madain Sari cooking choices on I Forgot! is reported as uncertain; this route detail needs in-game verification." }),

  scene("treno-eiko-talks-life", "Eiko Talks Life", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Tot's Residence walkway", "View after regaining control in Treno."),
  scene("treno-how-he-ended-up-here", "How He Ended Up Here", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Tot's Residence stairs/gate", "View before choosing Vivi's next destination."),
  scene("treno-home-sweet-home", "Home Sweet Home", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Quan's Dwelling", "Choose “Stop by at home” for Vivi, then meet the card-match condition.", { exclusiveGroupId: "ate.treno.vivi-choice", note: "This and Hippo's Prize are alternative Vivi outcomes. One eligible view is needed on a save." }),
  scene("treno-hippos-prize", "Hippo's Prize", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — walkway", "Choose “Stay in Treno” for Vivi.", { exclusiveGroupId: "ate.treno.vivi-choice", note: "This and Home Sweet Home are alternative Vivi outcomes. One eligible view is needed on a save." }),
  scene("treno-memories-by-the-water", "Memories By The Water", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — walkway/gate/Bishop's House", "View during the tournament route before City People."),
  scene("treno-city-people", "City People", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Card Stadium/Bishop's House", "View after Memories By The Water; the event leads to a Chimera Armlet.", { prerequisites: ["ate.treno-memories-by-the-water"] }),
  scene("treno-good-old-days", "Good Old Days", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Bishop's or Knight's House", "View after Zidane's first card match."),
  scene("treno-lessons-of-life", "Lessons of Life", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Bishop's or Knight's House", "Choose “Of course I'm interested” in Good Old Days.", { prerequisites: ["ate.treno-good-old-days"] }),
  scene("treno-hallucination", "Hallucination", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Card Stadium", "View after Zidane's second card match; this is a prerequisite for a later Lindblum ATE."),
  scene("treno-premonition", "Premonition", "disc-3.card-tournament", "disc-3.card-tournament.ates", "Treno — Knight's House", "View after Zidane's second card match."),

  scene("lindblum-something-washed-ashore", "Something Washed Ashore", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — hallway/harbor", "View after Hallucination.", { prerequisites: ["ate.treno-hallucination"] }),
  scene("lindblum-my-bad-fault", "My Bad / Fault", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — telescope", "Choose “Where's Dagger?” and do not speak to Blank again while searching."),
  scene("lindblum-self-reproach", "Self-reproach", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — conference room", "View while Zidane talks to Regent Cid."),
  scene("lindblum-deep-anger", "Deep Anger", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — conference room", "View during the conference-room conversation."),
  scene("lindblum-my-hammer", "My Hammer", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — hall", "View during the post-attack return."),
  scene("lindblum-the-rally", "The Rally", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum — Theater District station", "Talk to Wei and Kal, then check the station prompt.", { prerequisites: ["disc-1.burmecia.wei-kal-ate-prerequisite"] }),
  scene("lindblum-no-free-lunch", "No Free Lunch", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum Castle — hall/business district", "After Cid's conference, collect Quina in the Business District with less than 50 Gil."),
  scene("lindblum-give-me-my-money", "Give Me My Money", "disc-3.the-aftermath", "disc-3.the-aftermath.ates", "Lindblum — harbor", "View after No Free Lunch when Baku appears; keep Gil below the scene's threshold.", { prerequisites: ["ate.lindblum-no-free-lunch"], note: "The guide sources differ on the exact Gil condition. The under-50-Gil route is conservative; verify the live trigger if the ATE does not appear." }),

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
