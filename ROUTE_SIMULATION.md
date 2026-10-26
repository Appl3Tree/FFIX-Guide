# Route simulation log

Last updated: 2026-10-26

## Method and scope

This is a static playthrough simulation using the authored walkthrough data and cited source notes. It follows one save in chronological order, checks profile/platform objective links, and tests whether the route warns before known cutoffs, party changes, one-time encounters, and conditional branches. No FFIX game executable or emulator is part of this workspace, so these entries do not claim hands-on gameplay verification.

The static standard-route simulation covers all 44 chapters from Alexandria through the ending. The Excalibur II route has a source-based static trace from Alexandria through the pickup after Lich at 11:13:07; it has not been independently timed, and the target schedule below is not evidence of a validated speed route.

## Movie Critic single-save route simulation

The automated route check builds two versions of the eligible ATE plan: one selects **Home Sweet Home**, and the other selects **Hippo's Prize**. Each plan includes 79 of the 80 eligible ATEs, excludes the unchosen Treno branch, and maps to the Movie Critic entry in all three supported catalogs: Steam, PS4, and Xbox. It also checks the source-supported Treno order (Tradition → Pursuit → Confusion → Ambition → Meeting Place → Unexpected Visitor → Crime and Punishment), Conde Petie's five first-visit ATE order, each modeled prerequisite before its dependent scene, and the Wei and Kal prerequisite in Burmecia before The Rally in Lindblum.

This is a static feasibility check of the authored event order, dependency graph, and achievement pointers. It does not verify every scene trigger through gameplay or establish service parity for every release. Those checks remain open in B03.

The Home Sweet Home variant distributes its 79 eligible scenes as follows:

| Chapter | Scenes |
| --- | ---: |
| Evil Forest | 6 |
| Village of Dali | 6 |
| Lindblum | 5 |
| Treno | 7 |
| Cleyra | 4 |
| Return to Alexandria | 1 |
| Return to Lindblum | 3 |
| Outer Continent | 5 |
| Magdalene Forest | 6 |
| Conde Petie Mountain Path | 1 |
| Madain Sari | 5 |
| The Home Front | 6 |
| Card Tournament | 9 |
| The Aftermath | 8 |
| Lost Continent | 2 |
| Portal to Another World | 5 |
| **Total** | **79** |

The alternative Hippo's Prize route replaces Home Sweet Home in Card Tournament; every other chapter count stays the same. Automated coverage lives in `test/ate-route.test.mjs` and checks both branch plans against all three achievement catalogs.

## Chapter coverage matrix

| Disc | Chapter | Standard route simulation | Excalibur II route |
| --- | --- | --- | --- |
| I | Alexandria | Static route reviewed; pass with the reward and cutoff checks below | Source trace through Steeple and Guardhouse splits; target jump-rope branch recorded, not live timed |
| I | Evil Forest | Static route reviewed; pass after correcting ATE tutorial placement | Source trace through crash, spring, and Gunitas Basin splits; encounter/EXP branches recorded, not live timed |
| I | Ice Cavern | Static route reviewed; pass with the Dali return window below | Source trace to 01:02:14 boss exit, including 00:54:48 setup split; not live timed |
| I | Village of Dali | Static route reviewed; pass through factory and Cargo Ship cutoff | Source trace through the 01:14:22 Dali Storage split; route pickups and store plan recorded, not live timed |
| I | Cargo Ship | Static route reviewed; pass through Lindblum arrival | Source trace through the 01:35:48 Lindblum Inn split, including Black Waltz #2/#3 route; not live timed |
| I | Lindblum | Static route reviewed; pass with the five eligible ATEs, theater cutoff, Festival branch, and Base Level exit | Source trace through 01:51:20 Castle Guest Room and 02:07:43 Dragon's Gate; stat/Festival branches recorded, not live timed |
| I | Exploring Lindblum Kingdom | Static route reviewed; pass through the Quina/Blue Magic/chocograph detours and pre-Grotto check | Source trace through 02:24:30 Eunorus Plains, including Quina, Chocobo, Hot & Cold, and Limit Glove route; not live timed |
| I | Journey to Burmecia | Static route reviewed; pass through the Grotto, South Gate party split, basin detours, and Burmecia entrance | Source trace through 02:39:43 Oak Staff detour and Daines-Horse Basin; not live timed |
| I | Burmecia | Static route reviewed; pass through the 11 listed pickups, Wei/Kal prerequisite, Atla/Mognet and Stiltzkin handoffs, Beatrix steals, and Disc II transition | Source target 02:51:05 at Disc II; source says to skip most Burmecia items, so completion compatibility remains unresolved |
| II | Journey to Treno | Static route reviewed; pass through Nazna's letter handoff, Black Waltz 3 rematch, Dali return, South Gate chest, and Bentini Heights detours | Source trace through 03:00:05 Bentini Heights; Dali restock and Coral Ring/Lightning Staff branch recorded, not live timed |
| II | Treno | Static route reviewed; pass through six pre-story ATEs in the supported screen order, Power Belt intercept, full pickup/coin sweep, Griffin reward, Supersoft, and final ATE | Source trace through 03:17:19 Gargan Roo, including shop loop, auctions, and Nazna letter; not live timed |
| II | Journey to Cleyra | Static route reviewed; pass through the Gargan Roo chest/Mognet cutoff, Ralvurahva, optional Kupo Nut exchange and the return through Gizamaluke's Grotto to Qu's Marsh for Frog Catching, then Cleyra entrance | Source trace through 03:29:03 Cleyra's Trunk; route uses Ralvurahva and Atla's letter path, not live timed |
| II | Cleyra | Static route reviewed; pass through the Trunk and settlement, three Mopli checks, conditional Kupo Nut, shop and treasure windows, post-Antlion Emerald/Stiltzkin, evacuation rewards, Quina handoff, and Beatrix steals | Source trace through 04:00:48 Red Rose Cabin, including Antlion, evacuation battles/rewards, and Beatrix; not live timed |
| II | Return to Alexandria | Static route reviewed; pass through Serino's letter handoff, Marcus equipment transfer, 30-minute escape, Tent/Ice Brand chests, Tantarian deferral, Zorn/Thorn and Beatrix steals, Friendship, Mosh's letter, Steiner handoff, and Ralvuimago | Source trace through 04:24:34 Alexandria Rescue; guard-avoidance route and timer budget recorded, not live timed |
| II | Pinnacle Rocks | Static route reviewed; pass through Mosh's letter, all five fragments, three interior chests, Ramuh's story, Stiltzkin's letter, and Lindblum departure | Source trace as part of D2-09; all five fragments and Monty's letter are mapped before 04:43:21 Dragon's Gate, not live timed |
| II | Return to Lindblum | Static route reviewed; pass through The Third Jewel, all city pickups, Ruby/Serino/Mooden letters, Chain Mail check, shops, Kupo Nut handoff, and Dragon's Gate departure | Source trace completes at 04:43:21 Dragon's Gate; Exploda/Lowell and letter order recorded, not live timed |
| II | Journey to the Outer Continent | Static route reviewed; pass through Quina's reunion, Frog Catching and Kupo Nut detours, Lani steals, Stiltzkin #3, all Fossil Roo branches, mining checks, and final Gargant | Source trace through 04:55:41 Fossil Roo; Moguta Elixir and Lani route recorded, five random encounters expected, not live timed |
| II | Outer Continent | Static route reviewed; pass through Chocograph #5, Friendly Ladybug, the Outer Continent marsh, five ordered ATEs, pickups, Mogmatt's letter, and the forest departure | Source trace through 05:06:24 outside Black Mage Village; Conde Petie and Chocobo route mapped, not live timed |
| II | Magdalene Forest | Static route reviewed; pass through the owl puzzle, all six village ATEs, Mogryo's letter, village pickups and Black Belt, rest, Virgo, and Stiltzkin's letter | Source trace through 05:15:44 Conde Petie; shop loop, Mogryo letter, rest, Diamond, and wedding route mapped, not live timed |
| II | Conde Petie Mountain Path | Static route reviewed; pass through Nuptial Joy, the Diamond recovery, Eiko's handoff, all four stones and chests, Stiltzkin #4, Suzuna's letter, Hilgigars steals, and Lucid Plains | Source trace through 05:21:46 Lucid Plains; Eiko/Oglop and Hilgigars route recorded, remaining path chests deferred, not live timed |
| II | Madain Sari | Static route reviewed; pass through the no-save warning, five ATEs, Libra/Tent, Eidolon Wall scene, dinner choices, coffee and chests, mandatory rest, Virgo, and Morrison's shop | Source trace includes dinner; Eiko's Kitchen 2 is a +01:30 branch outside the source target, not live timed |
| II | Journey to the Iifa Tree | Static route reviewed; pass through the Mountain Path north exit, forest-only Friendly Nymph, 3-Ore Emerald reward, and letter carried to Mocchi | Source trace through 05:33:38 Iifa Tree Roots; colored-stone Moonstone detour and one random encounter included, not live timed |
| II | Iifa Tree | Static route reviewed; pass through the Ruby, Mognet/save stop, both hidden switches, eight chests, fixed descent fights, Soulcage steals and fire counter, and story cutoff | Source trace through 05:51:23 Lucid Plains; Zombie EXP-avoidance/Trance setup and encounter assumptions recorded, not live timed |
| II | Return to Madain Sari | Static route reviewed; pass through the hidden-room chests, Eidolon Wall gifts/heal, Scarlet Hair's solo steal window, Memory Earring, Amarant recruitment, and party setup | Source trace through 06:05:10 Pualei Plains; no-heal/Lucky Seven and Lv. 1 Amarant branch recorded, not live timed |
| II | Battle of the Iifa Tree | Static route reviewed; pass through both party prompts, Insomniac prep, Mistodon steals, Mocchi's save/Stiltzkin letter, Aquamarine, and Disc III transition | Source trace through 06:17:31 Disc III start; Stop/Silence EXP-avoidance branch recorded, not live timed |
| III | The Home Front | Static route reviewed; pass through Hippaul level 80, ATE and Stiltzkin windows, steeple cards/Mognet, summon gems, reunion, shuffle game, and castle sweep | Source trace reaches D3-01 at 06:57:02; Hippaul +11:00 branch, Alexandria pickups, and Treno approach recorded, not live timed |
| III | Card Tournament | Static route reviewed; pass through nine ATE slots, branch-specific Namingway, Chimera Armlet, two early wins, Dali coffee/key detour, Treno side stops, and final match | Source route takes Rebirth Ring/Chimera Armlet, two tournament wins, and selected ATEs; full nine-slot route and 10th Promist Ring auction branch are not in baseline target |
| III | Trouble on the Home Front | Static route reviewed; pass through the four correct Knight assignments, seven Mistodon fights, Alexander scenes, and the final Tantarian library window | Source route uses Beatrix/Mistodon sequence and Tantarian at 07:16:46, then reaches Lindblum at 07:22:32; stat strategy recorded, not live timed |
| III | The Aftermath | Static route reviewed; pass through eight conditional ATEs, Mogki's letter, city pickups/potions, the under-50-Gil gate, and Blue Narciss departure | Source route collects potion and hideout/studio items, then boards Blue Narciss by D3-04; complete ATE and under-50-Gil routes are not budgeted |
| III | On the High Seas | Static route reviewed; pass through delayed hideout Gil, Quina's frog/Blue Magic route, Kupo Nut, Esto Gaza stock, Alexandria ruins, Chocobo ability gates, South Gates, and Treno auction | Source route uses Blue Narciss for Chocobo Lagoon/Chocographs and Mountain transformation; broad world-map and Blue Magic detours are excluded |
| III | Picking Up the Trail | Static route reviewed; pass through No. 288's two conversations, pre-entry checks, four sinkholes, no-sand story pit, and physical/magic party split | Source reaches the no-sand sinkhole at 08:16:48 with the Oeilvert party selected; zero random encounters reported, not live timed |
| III | Forgotten Continent | Static route reviewed; pass through Chocobo/Jabberwock detours, Mimoza/Mognet, Stiltzkin #6, eight Oeilvert chests, anti-magic light puzzle, Ark steals, and Gulug Stone cutoff | Source trace through Mimoza/Stiltzkin, Oeilvert treasure and Ark steals to Gulug Stone; the target continues through Cid's escape at 08:36:57, not live timed |
| III | Desert Palace | Static route reviewed; pass through Cid's escape, all six bloodstones and the Fairy Earrings chest, Mogsam/Kupo Nut timing, Valia Pira, Namingway Card, and the exit check | D3-07 starts at the Desert Palace Rack at 08:36:57; source route sweeps the bloodstones, takes the Promist Ring (the 10th only if the optional +21:00 Treno auction detour was completed), Fairy Earrings, and final Namingway Card, defeats Valia Pira, and reaches Esto Gaza at 08:52:28 with 2 random encounters; not live timed |
| III | Lost Continent | Static route reviewed; pass through Feather Circle, Esto Gaza stock/letter, Mount Gulug pickups and Mognet, Quina's Frost/Bad Breath/Twister opportunities, fixed Red Dragons, Meltigemini, and Lindblum return | D3-08 starts at Esto Gaza at 08:52:28; source buys its planned stock, clears the Mount Gulug treasure and letter circuit, fights fixed Red Dragons and Meltigemini, reports 0 random encounters, and reaches the Lindblum Guest Room at 09:12:20; not live timed |
| III | Aerial Exploration | Static route reviewed; pass through Hilda Garde pickups, Friendly Garuda/Diamond-to-Yan chain, Sky Chocobo/Air Garden, Ragtime Mouse, optional Running Shoes, Daguerreo stock, and open-world handoff | D3-09 targets Ipsen's Castle at 09:25:45 with 0 random encounters after the ship/Pinnacle Rocks pickups and Treno Amdusias Running Shoes fight. Path C adds +11:00 for Chocobo's Lagoon, Sky transformation, Air Garden and Fairy Island Chocograph; Combined adds +26:00 for its larger Chocobo/10,000-point Robe of Lords route; neither detour is in the baseline target |
| III | Ipsen's Castle | Static route reviewed; pass through the reversed weapon rule, Kumool letter/shop, route chests and fresco, four mirrors, Taharka steals, post-boss treasures, and Amarant's solo return | D3-10 begins at Ipsen's Castle at 09:25:45; source uses weak weapons, takes the castle route treasures and four mirrors, steals Orichalcon from Taharka, returns for Amarant, and moves on to the shrines; not live timed |
| III | Breaking the Seal | Static route reviewed; pass through post-Ipsen equipment restore, fixed Water/Fire/Wind party drop-offs, Earth Shrine timed corridor, Guardian steals/Earth Shake, and the airship regroup | The D3-10 route drops off the fixed Water/Fire/Wind pairs, fights Earth Guardian with Zidane/Quina, steals Rubber Suit and Avenger for sale, and regroups at Blairsurpass Plains at 09:44:56 with 0 random encounters; not live timed |
| III | Preparing to Leave | Static route reviewed; pass through coffee delivery, Treno Amdusias, colored-stone Moonstone, Oglop trade, final shop/ability audit, prior cutoff review, and saved Shimmering Island gate | No separate baseline target split: the source route enters Terra from the Forgotten Continent after the shrine route, leaving the guide's broader pre-departure checks outside the timed target |
| III | Portal to Another World | Static route reviewed; pass through Terra's seven chests, Bran Bal's pickups/ATEs/Stiltzkin/Mognet checks, Pandemonium's party-split fights and five pickups, the final boss steals, and the Invincible escape | D3-11 enters Terra and reaches Bran Bal Storage at 09:56:27 after 3 random encounters. D3-12 reaches Pandemonium at 10:10:47 with 0 random encounters after the three forced party-split fights; D3-13 collects Pandemonium's five treasures, defeats Silver Dragon/Garland/Kuja, escapes to Bran Bal, and reaches the Disc IV transition at 10:28:25 with 0 random encounters; not live timed |
| IV | Return to Gaia | Static route reviewed; pass through the changed Gaia map, Disc IV Chocobo/frog rewards, Stiltzkin #8, Stellazzio/Hammer, Treno and shop updates, Mognet Central, Eidolon Wall, Magical Fingertip, Nero Family start, and Iifa Tree gate | Source trace reaches the Memoria entrance target at 10:40:40; optional content beyond the perfect-save route is excluded |
| IV | Second Battle of the Iifa Tree | Static route reviewed; pass the Gaia-side Grand Armor fallback check, Nova Dragon steal/drop window, and Memoria entrance handoff | Source trace reaches Memoria entrance at 10:40:40 with 0 random encounters reported for D4-01; target includes two Tantalus return detours |
| IV | Memoria | Static route reviewed; pass through five hidden weapons and card Phantoms, four Guardian steal windows, Hades, Excalibur II check, Nero Family checkpoints, and Deathguise | Source trace reaches Excalibur II after Lich at 11:13:07; guardian steals and Nero returns are represented in the static target, not live timed |
| IV | Final Preparations | Static trace reviewed from Deathguise's Crystal World save through the optional Gaia cleanup window, Ozma checks, Hades's last Running Shoes steal, Hammer choice, and pre-Kuja commit gate | Run 38 returns through Memoria for optional work, then comes back to the Crystal World save point before the final transition; this is not live or timed verification |
| IV | The Final Battle | Static trace reviewed through Trance Kuja's steals, the one party-change screen, Necron's steal/battle, ending scene, and completion check | Run 39 saves and prepares before Kuja, finishes both consecutive battles and their steal windows, then checks the Hammer scene and release-scoped achievement; no post-battle free roam or direct-game verification |

## Excalibur II route — source target schedule

This checkpoint schedule is transcribed from the original PlayStation Excalibur II Perfect Game Guide by Atomos199. Its target times are for the guide's NTSC route and its baseline stat paths A, B, and Level 1; they have not been reproduced in this project or verified for PAL, Steam, console remasters, mobile releases, boosters, or mods. The time remaining below is calculated from the source target and the 12:00:00 cutoff. Treat each number as a checkpoint to compare against, not a guarantee of feasibility on another release.

| Route checkpoint | Source target | Time remaining to 12:00:00 |
| --- | ---: | ---: |
| Alexandria Steeple | 00:08:25 | 11:51:35 |
| Alexandria Guardhouse | 00:17:32 | 11:42:28 |
| Prima Vista crash site | 00:31:33 | 11:28:27 |
| Evil Forest spring | 00:42:43 | 11:17:17 |
| Gunitas Basin | 00:50:33 | 11:09:27 |
| Ice Cavern after Black Waltz #1 and Sealion | 01:02:14 | 10:57:46 |
| Dali Storage Area | 01:14:22 | 10:45:38 |
| Lindblum Inn | 01:35:48 | 10:24:12 |
| Lindblum Castle Guest Room | 01:51:20 | 10:08:40 |
| Lindblum Dragon's Gate | 02:07:43 | 09:52:17 |
| Eunorus Plains | 02:24:30 | 09:35:30 |
| Daines-Horse Basin | 02:33:43 | 09:26:17 |
| Oak Staff detour | 02:39:43 | 09:20:17 |
| Start of Disc II | 02:51:05 | 09:08:55 |
| Bentini Heights | 03:00:05 | 08:59:55 |
| Gargan Roo | 03:17:19 | 08:42:41 |
| Cleyra's Trunk | 03:29:03 | 08:30:57 |
| Cleyra Inn | 03:39:57 | 08:20:03 |
| Cleyra Sandpit | 03:46:07 | 08:13:53 |
| Red Rose Cabin | 04:00:48 | 07:59:12 |
| Alexandria Chapel | 04:07:59 | 07:52:01 |
| Alexandria Rescue | 04:24:34 | 07:35:26 |
| Eunorus Plains | 04:43:21 | 07:16:39 |
| Fossil Roo Cavern | 04:55:41 | 07:04:19 |
| Magdalene Forest | 05:06:24 | 06:53:36 |
| Conde Petie | 05:15:44 | 06:44:16 |
| Lucid Plains | 05:21:46 | 06:38:14 |
| Iifa Tree Roots | 05:33:38 | 06:26:22 |
| Lucid Plains 2 | 05:51:23 | 06:08:37 |
| Pualei Plains | 06:05:10 | 05:54:50 |
| Start of Disc III | 06:17:31 | 05:42:29 |
| Treno Knight's House | 07:47:47 | 04:12:13 |
| Desert Palace | 08:36:57 | 03:23:03 |
| Esto Gaza | 08:52:28 | 03:07:32 |
| Lindblum Castle Guest Room | 09:12:20 | 02:47:40 |
| Ipsen's Castle | 09:25:45 | 02:34:15 |
| Blairsurpass Plains | 09:44:56 | 02:15:04 |
| Bran Bal | 09:56:27 | 02:03:33 |
| Pandemonium | 10:10:47 | 01:49:13 |
| Start of Disc IV | 10:28:25 | 01:31:35 |
| Memoria entrance | 10:40:40 | 01:19:20 |
| Memoria — The Past | 11:01:10 | 00:58:50 |
| Memoria portal | 11:06:12 | 00:53:48 |
| Memoria — Time Warp | 11:10:59 | 00:49:01 |
| Excalibur II after Lich | 11:13:07 | 00:46:53 |

The source guide says the route is intended to preserve the perfect-save objectives while collecting Excalibur II; it is not a minimalist weapon-only run. Its route branches by stat plan: the baseline paths have 46:53 of target-time buffer, Path C adds 14:45 of detours and leaves 32:08, while the Combined path adds 39:45 and leaves 7:08. Those margins are source-reported, not independently tested here. The guide says the stat path should be chosen before starting, although it can be deferred to Treno; the Combined and Path C options are especially sensitive to early delays.

Route constraints identified so far: make a fresh save and choose the selected stat path first; skip dialogue and most ATEs/FMVs where the chosen release permits; minimize random encounters and flee unless the route explicitly needs a battle; pause when planning because the source guide says the in-game clock stops while paused; and use multiple rotating saves so a mistaken route choice does not overwrite the run. The source notes that 12-hour timing is particularly tight on PAL because the game runs at 50 Hz while the clock continues at real time. Do not apply NTSC target times to PAL or assume modern booster behavior without version-specific verification. The source-based static trace now covers Alexandria through the Excalibur II pickup after Lich at 11:13:07. Remaining route gaps include the full-pickup budget for the Excalibur II branch, full achievement/optional-content budgeting, and version-specific timer verification.

## Excalibur II route static run 1 — Alexandria through Ice Cavern

### Starting state

- Start a new save on the original PlayStation NTSC route assumed by the GameFAQs Excalibur II Perfect Game Guide; use its baseline Path A, B, or Level 1 target schedule. Other stat paths have separate detours.
- This is a source-based route trace. No gameplay timer was run in this workspace, and modern-release timer/booster behavior remains unverified.
- The source route is a perfect-save itinerary, not a minimal weapon-only sprint. Its time targets also do not automatically cover every modern-platform achievement; Jump Rope is a separately budgeted branch.

### Trace and checks

1. **Alexandria Steeple — target 00:08:25:** Set the source's fast menu/configuration options, collect the two starting room chests, and steal Mage Masher from the Masked Man before ending the fight. Follow Vivi's source route, collect Kupo's letter, and use the Kupo/Mosh exchange path required for the selected letter goal. The source defers recoverable pub/house pickups to Disc III and skips Ruby's optional secret scene, which costs about three minutes. Jump Rope has a separate time branch: the source lists +1:30 for 50 jumps and +8:00 for 1,000; adding the 1,000-jump branch to the 11:13:07 baseline yields a source-derived 11:21:07 pickup estimate with 38:53 remaining, before other detours. This is arithmetic from the source schedule, not a verified end-to-end achievement run.
2. **Alexandria Castle Guardhouse — target 00:17:32:** Follow the rooftops and collect the listed Gil, finish the King Leo scene, complete the 49-prompt sword fight at 100/100, then claim Moonstone #1 from Brahne. Search Mosh's letter if the Jump Rope route generated it, and complete the Knights of Pluto/Elixir route if that copy is selected. The source target assumes the Moonstone prize route; failed sword-fight attempts consume time, so retry only while the scene remains open and respect the split.
3. **Prima Vista crash site — target 00:31:33:** Collect the castle/engine-room pickups and Elixir, follow the scripted escape, and take the two Steiner steals on the first battle only if they match the selected save goal. Finish the forced encounters and save at the crash. The source's route target allows zero random encounters; the named story fights are scripted and do not count as random encounters.
4. **Evil Forest spring — target 00:42:43:** Sweep the source-listed wreckage pickups, resolve both Prison Cage fights, search the required rooms, and skip the optional extra Garnet scene. Do not spend time stealing from Plant Brain. Carry Kupo's letter to Monty, read Monty's Stiltzkin letter, and save at the spring.
5. **Gunitas Basin — target 00:50:33:** Defeat Plant Brain with the source's fast phase transition, handle forced EXP according to the selected stat path, and take the short path toward Ice Cavern. The Level 1 branch has a stricter Plant Spider reset/EXP rule; the source's baseline-stat branch can let Steiner absorb forced EXP. Avoid optional grinding.
6. **Ice Cavern — target 01:02:14:** Target 00:54:48 at the Mois setup/save split. Collect the listed cave chests, avoid the white wind and use extra screen changes to keep the source's zero-random-encounter target, accept Mois's letter for Gumo, and prepare Zidane/Steiner before the boss. Steal Mythril Dagger and Ether from Sealion, defeat Black Waltz #1 and Sealion, then return to Mois and save. The Dali storage segment is the next route slice.

### Result and unresolved checks

The opening route has source checkpoints mapped to the existing Alexandria, Evil Forest, and Ice Cavern chapters. The GameFAQs guide reports zero random encounters for these segments and explicit branch costs for Jump Rope; this trace does not prove those counts or split targets on hardware. The exact inclusion basis for the 50-jump cost remains unresolved. The route's coverage of modern achievement criteria also remains open.

## Excalibur II route static run 2 — Dali Storage through the Disc II transition

### Starting state

- Continue the original-PlayStation NTSC source route after the 01:02:14 Ice Cavern split. The target schedule assumes one of the source's baseline stat plans; Path C and Combined have separately reported detours.
- This is still a source comparison, not a timer run. The guide's zero-encounter entries refer to random encounters, not required or deliberately triggered story/ability fights.
- The source is a perfect-save challenge with its own item and stat goals. It does not budget modern platform achievements, a full eligible Movie Critic ATE route, or every optional objective in this interactive guide.

### Trace and checks

1. **Dali Storage — target 01:14:22:** From the Ice Cavern, run to Dali, sweep the source-listed village and underground pickups, deliver Mois's letter to Gumo, then carry Kumop's letter to Mogki and save. The source sells Phoenix Pinions and buys a large stock of Wrist, Feather Hats, and Leather Shirts; its route reports zero random encounters. The interactive route's Dali ATE and Color Fortune achievement branches are extra goals without a source time allowance.
2. **Dali departure to Lindblum Inn — target 01:35:48:** Open the three chests in the Mist room, flee the door encounter, visit Morrid, and defeat Black Waltz #2. The source departs immediately after the required scene, then uses the scripted Black Waltz #3 encounter on the Cargo Ship and reads Ruby's letter after arrival. The source's Black Waltz #2 plan also uses its Ether drop if Zidane missed the Sealion steal. Preserve the existing chapter warnings for one-time boss steals; the source split does not prove this route's steal outcomes.
3. **Lindblum city sweep — target 01:51:20 at the Castle Guest Room:** The source route follows its perfect-save shopping plan, including bulk Steepled Hat/Cotton Robe transactions, and completes the first city sweep before returning to the Guest Room. The comprehensive guide's first-visit ATE, Autograph, Moogle Suit, and achievement checks should be compared one by one; a PS1 perfect-save route does not validate those branches.
4. **Castle Guest Room to Dragon's Gate — target 02:07:43:** Complete the scheduled castle scenes, then run the Festival route selected for the stat plan, including the required Zaghnol steal/finishing blow. The Festival's 12-minute event clock is separate from the cumulative game timer. After the post-Festival scenes, take the scheduled trolley route, collect the Serpent's Gate chest, reach Dragon's Gate, and read Moodon's Stiltzkin letter. Optional Lindblum returns and shopping are not included as free time.
5. **Dragon's Gate to Eunorus Plains — target 02:24:30:** Take the Dragon's Gate Tent, recruit Quina and catch one frog, then follow the source's shortened route that skips the Frog Catching minigame. Enter Gizamaluke's Grotto for the first bell and the forced Type A encounter, then use the early Chocobo/Hot & Cold route to obtain the required Chocographs. The source marks intermediate checks at 02:12:37 (first bell), 02:15:28 (after the forced encounter), and 02:22:55 (after Chocobo digging); learn Limit Glove from Mandragora and return to the Grotto. Full Frog Catching, Blue Magic, and platform achievement goals need additional budgeting.
6. **Gizamaluke and South Gate — target 02:33:43 at Daines-Horse Basin:** Re-enter the Grotto, collect the remaining bells, use Quina's Limit Glove for Gizamaluke, and follow the Steiner/Dagger South Gate sequence. Take the listed Multina Racket and Potion, carry Grimo's letter to Nazna, ride the cable car, then save on the route toward Cleyra. These are fixed route objectives; any randomized steal or enemy skill result is not established by a target split.
7. **Oak Staff detour — target 02:39:43:** Spend the source's additional six minutes on the Reef transformation and Chocograph route, returning to equip Vivi with Oak Staff. This is a scheduled perfect-save detour rather than spare time for unrelated sidequests.
8. **Start of Disc II — target 02:51:05:** Continue through the Grotto and Burmecia to the disc transition. At D1-14 the source names Ether, Lightning Staff, Mythril Spear, and Germinas Boots, then says to ignore other Burmecia items. That is the timed route's item scope; the Comprehensive Playthrough still sweeps the full city. If both Excalibur II and full exploration are selected, the guide must budget the extra sweep or verify later pickup-room access. The source's Disc IV return to Atla's Vault does not establish access to every skipped pickup, so do not promise those copies are recoverable. This leaves compatibility unverified, not categorically impossible.

### Result and unresolved checks

The source-based static trace now reaches the start of Disc II with all first-disc source splits mapped into the corresponding chapters. It does not show that the time targets are reproducible, that random encounters will remain at zero, or that the listed combat RNG will cooperate. The source's item/EXP goals differ from modern-platform achievement criteria. Its four named Burmecia targets and skip direction define the timed route's scope; whether the full exploration sweep also fits or can be completed after the deadline remains unverified.

## Excalibur II route static run 3 — Bentini Heights through Alexandria Rescue

### Starting state

- Continue from the 02:51:05 Disc II split after the route reaches the source's D1-14 state. The source collects four named Burmecia items and skips the rest on its timed route; compatibility with the separate full-exploration objective remains unverified.
- The following are source-reported original-PlayStation NTSC checkpoints and route choices. No live timer or battle RNG was tested.

### Trace and checks

1. **Summit Station and Bentini Heights — target 03:00:05:** Refit Garnet/Steiner, deliver Grimo's letter to Nazna, accept Nazna's letter, and take the cable car. Defeat the South Gate Black Waltz #3 rematch; if the Festival did not award Coral Ring, the source assigns a Lightning Staff steal. Return to Dali for another 99 Wrist and the farm Elixir, then collect the South Gate 1,610 Gil chest and save at dusk. The route lists an intermediate Dali check at 02:58:00 and reports zero random encounters.
2. **Treno and Gargan Roo — target 03:17:19:** In Treno, claim the Power Belt, perform the Cotton Robe shop loop, read Mogrich's Stiltzkin letter, earn the Griffin reward, then use auctions for Magician Robe, Madain's Ring, and Reflect Ring. Combined stat route adds Pearl Rouge. After the attempted Tantalus robbery, revisit Dali to restock, take the Mythril Dagger from Doctor Tot's tower, carry Nazna's letter to Mochos, and enter Gargan Roo. Source intermediate checks are 03:04:07 (Griffin), 03:08:07 (auction), and 03:12:03 (departure from Treno).
3. **Gargan Roo and Cleyra's Trunk — target 03:29:03:** Follow the source's switch/chest path through Gargan Roo, handle Ralvurahva, collect the deferred upper-trunk pickups, deliver Atla's letter to Monev, and reach Cleyra. Refuse the optional Oracle tour, make the scheduled shop/ATE stops, then return through the branch chests. The guide's route data records its critical path and selected pickups, not every sidequest in this interactive checklist.
4. **Cleyra Inn — target 03:39:57:** Re-enter the Trunk for the source's deferred chest route, then visit the inn and save. At 03:31:15 it targets Antlion; the source exploits the fight to set Quina to 1 HP for Limit Glove. After the battle, collect the High Priest's Emerald, buy Stiltzkin's bundle, accept Monev's letter, and save.
5. **Cleyra Sandpit — target 03:46:07:** Descend the Trunk for the remaining scheduled chests and resolve the fixed Soldier/Type B fights with the planned Bio/Stop/Needle Fork approach. Accept Mopli's letter at the sinkhole save point. The source labels the next resident-placement battles as EXP-critical; preserve the selected stat plan and do not treat them as optional random encounters.
6. **Red Rose Cabin — target 04:00:48:** Follow the evacuation path, make the source's resident-placement choices, collect the survivor rewards, deliver the Serino/Mopli exchange, and use Limit Glove in the second Beatrix battle. Then follow the Red Rose scenes, deliver the letter, accept Serino's reply, and save. Its 14:41 segment budget is reported by the source; execution speed and combat RNG are unverified.
7. **Alexandria Chapel — target 04:07:59:** Escape the Red Rose without starting a battle, avoid the guards in the timed castle sequence, remove Marcus's equipment before the next story segment, and reach the secret passage/church. Use the source's Zorn and Thorn setup, then read Mosh's letter from Kupo and save. The source sets a 26:00 progress mark inside the 30-minute story escape.
8. **Alexandria Rescue — target 04:24:34:** Follow the source's Beatrix rescue and escape sequence within the separate 30-minute countdown. This cumulative checkpoint is a separate clock from the local story timer. The EII guide treats the segment as difficult; this static trace does not validate the escape timing, full boss-steal list, or the optional first Tantarian window.

### Result and unresolved checks

The static source trace now reaches 04:24:34 at Alexandria Rescue. It records the Dali restock, Treno shop/auction plan, Cleyra's EXP-sensitive fixed battles, Red Rose evacuation, and the timed Alexandria escape. It does not verify a successful run or establish that the source route completes every modern achievement/profile goal. Run 4 continues with D2-09 Eunorus Plains at 04:43:21, keeping the optional Pinnacle Rocks and Mognet branches visible.

## Excalibur II route static run 4 — Eunorus Plains through the Disc III transition

### Starting state

- Continue from Alexandria Rescue at 04:24:34 on the source's original-PlayStation NTSC route. The D1-14 skip remains a route-scope difference; the guide has not verified a full Burmecia sweep against the source time budget or proven access to all omitted pickups later.
- These are source-reported cumulative checkpoints, not a live timer run. The route follows a baseline stat path; Path C and Combined have separate detours.

### Trace and checks

1. **Pinnacle Rocks and Lindblum return — target 04:43:21 at Dragon's Gate:** Steal the Adaman Vest from Ralvuimago, finish the Hero's Tale, deliver Mosh's letter to Monty, then take Pinnacle Rocks' five fragments, story pieces, and listed chests. Return to Lindblum, deliver Serino's letter, accept Moodon's letter, read Ruby's letter, collect the city and Tantalus/Studio pickups, buy Exploda, and recruit Lowell before the Dragon's Gate handoff. The source's intermediate target is 04:32:54 after the Rocks sequence. It avoids the black-mage crowd scene and does not budget the full eligible ATE/achievement route.
2. **Outer Continent and Fossil Roo — target 04:55:41 at the Fossil Roo moogles:** Take the source's two-minute Kupo Nut trip to Moguta for the fixed Elixir, reunite with Quina, and defeat Lani using the route's Lucky Seven setup. Return through the Armodullahan cage route for its Elixir and teach Quina Night from an Abomination while using the expected fights. The source expects five random encounters on this stretch (four is possible; six is acceptable). Skipping the Fossil Roo Elixir can save about seven minutes, but it forfeits a treasure and is not included in the target.
3. **Fossil Roo exit and Black Mage Village approach — target 05:06:24 outside the village:** Finish the listed Fossil Roo pickups, exit by Gargant, collect Conde Petie's entrance Gil, Phoenix Pinion, and Suzuna letter, speak with Vivi, then ride Choco to the Black Mage Village and save. The source target assumes zero random encounters on this approach.
4. **Black Mage Village and Conde Petie — target 05:15:44 at Conde Petie:** Use the forest shortcut, complete the Cotton Robe/Steepled Hat shop loop, take Mogryo's letter for Mocchi, view “Different Language,” and rest so Stiltzkin's letter appears overnight. Finish the village pickups/shop transactions, return to Conde Petie for Diamond and the wedding, and save. The source allows one random encounter; its ATE route does not establish the comprehensive guide's complete eligible Movie Critic sequence.
5. **Mountain Path and first Madain Sari approach — target 05:21:46 on Lucid Plains:** Enter the Mountain Path, recruit Lv. 1 Eiko, catch an Oglop and trade it for the Oglop Card, then return for the remaining route pickups, Stiltzkin's fourth bundle, and Mogmatt's letter to Suzuna. Fight Hilgigars for the planned steals and continue toward Madain Sari. The source defers some Mountain Path treasure to its return circuit.
6. **Madain Sari and Iifa Tree approach — target 05:33:38 at Iifa Tree Roots:** Follow the source's ATE/dinner sequence, visit the Eidolon Wall, collect the hidden Tent and Kirman Coffee, and rest before leaving. Its optional “Eiko's Kitchen 2” scene is outside the target and costs +01:30. The source's later four-colored-stone exchange for a Moonstone is included in the 05:33:38 target (+01:00); skipping that exchange subtracts a minute. One random encounter is included on the route to the roots.
7. **Iifa Tree and return to Madain Sari — target 05:51:23 on Lucid Plains:** Deliver Mogryo's letter to Mocchi, gather the Iifa Tree treasures, and use the source's EXP-free setup: zombify Garnet with a Dracozombie, build Zidane's Trance gauge against Zombies, then complete the forced undead/Soulcage sequence. The source reports six random encounters for this circuit, including the Dracozombie setup and excluding forced battles. Return to Madain Sari without the Wall's healing so Zidane retains the low-HP Lucky Seven setup for Scarlet Hair; collect the two house chests, finish the story scenes, recruit Lv. 1 Amarant, and save. The source's intermediate return target is 05:50:19 at the Iifa Tree exit.
8. **Madain Sari return and Pualei Plains — target 06:05:10:** Use the Mountain Path return, complete the Amarant party setup, and reach the source's base-stat checkpoint. The source allows no random encounters for this leg. Its EXP rules are specific to the selected challenge route and should not be applied to a standard playthrough.
9. **Battle of the Iifa Tree and Disc III transition — target 06:17:31:** Re-enter the Iifa Tree, pass the three forced Mistodon fights without EXP using Stop/Silence, and read Stiltzkin's letter at Mocchi before descending. The source's intermediate save target is 06:12:22; it budgets one random encounter after the save on the way to the Disc III transition. Its advice for the forced fights is to rely on Stop rather than the earlier Zombie setup.

### Result and unresolved checks

The source trace now covers every Disc II checkpoint through the start of Disc III, leaving 05:42:29 before the 12-hour cutoff at that split. The source target for Excalibur II remains 11:13:07 with 46:53 to the cutoff. This is a static comparison, not proof that the time targets or encounter counts are reproducible. The full ATE/achievement branch, Friendly Creature and Quina Blue Magic detours, platform-specific timer behavior, and compatibility of the full Burmecia pickup sweep with this timed route remain unresolved. Continue with D3-01 Bentini Heights at 06:57:02.

## Excalibur II route static run 5 — Disc III opening through Desert Palace

### Starting state

- Continue from the Disc III transition at 06:17:31. This source route assumes its original-PlayStation NTSC timing and a selected stat path; no timer or game executable was run here.
- Source targets below cover a perfect-save challenge itinerary, but not the full eligible ATE/achievement sequence or every optional branch in the interactive guide.

### Trace and checks

1. **Alexandria and Treno — target 06:57:02 at Bentini Heights:** Complete Hippaul's one-time race to level 80 for Athlete Queen; the source allocates +11:00 for the minigame and saves between milestones. On the Alexandria sweep, view “Artemicion,” collect the bell-tower cards and remaining house/pub items, deliver Kuppo's letter to Kupo, buy Stiltzkin's Disc III bundle, and read his reply. Collect the castle/dock items, including the Phoenix Pinion the source marks as missable. In Treno, claim the Champion's Rebirth Ring, watch “Memories By the Water” and “City People,” take the Chimera Armlet, win the first two tournament rounds, and read Mogrich's letter. The route may add a +02:00 Dark Matter auction on selected stat paths. The target lists zero random encounters; it does not budget every ATE, card, or platform achievement branch.
2. **Dali detour — target 07:01:33:** Buy the source's bulk Wrist, Leather Hat, and Leather Shirt stock; retrieve Mini-Brahne and Mayor's Key, open the Chocobo pen for 30,000 Gil and Burman Coffee, then take Cachusha and Elixir from the windmill. Visit Observatory Mountain to register it on the world map and turn in the coffees to Morrid for the Mini Prima Vista. This +00:30 coffee-sidequest branch is included in the target; keeping the three Coffee key items means skipping the turn-in and subtracting 00:30.
3. **Lindblum attack and Tantarian — target 07:22:32 at the Castle Guest Room:** Follow the source's Mistodon avoidance and Beatrix party setup through the attack, then use its stat-path-specific Tantarian strategy at the 07:16:46 intermediate mark. Take Mogki's letter and the guest-room pickups after waking in Lindblum. The source reports zero random encounters for this section. The timing does not include the complete eight-slot ATE and under-50-Gil route from the comprehensive Aftermath chapter.
4. **Lindblum return, Blue Narciss, and Chocobo — target 07:47:47 at Treno's Knight's House:** Collect the potion/treasure items from the Tantalus hideout and Artist Michael's studio, get Alice's Beautiful Potion, and use the Cotton Robe/Desert Boots synthesis loop. Board the Blue Narciss, dig the needed Chocographs at Chocobo's Lagoon, claim the Dawn Lagoon treasure, obtain Mountain transformation, and return by mountain to Treno. A second consecutive Hot & Cold game adds about +00:30 if needed. The source delays Mogki's letter delivery until after the challenge; the broader open-world sidequest route is not included.
5. **Treno and Kiera Desert — target 08:16:48 at the correct sinkhole:** Challenge Catoblepas with Quina and complete the Treno stock liquidation. The optional tenth Promist Ring branch requires nine auction purchases and adds +21:00 (and substantial Gil); it is outside the baseline checkpoint. Visit both South/North Gate pickup routes, dig the Forbidden Forest Chocograph, and collect Moguta's fixed Disc III Extension (+00:30, included). Sail to the Outer Continent, visit Black Mage Village, then save beside the no-sand sinkhole. The source reports zero random encounters and directs the player to assign Steiner, Eiko, and Amarant to Oeilvert.
6. **Oeilvert and Desert Palace escape — target 08:36:57 at Desert Palace Rack:** Choose the magic-capable team for Kuja's Desert Palace and send Steiner, Eiko, and Amarant to Oeilvert. If an encounter occurs on the airship route, the source says to limit it to one and use the chance to prepare Zidane's Trance gauge. On the Forgotten Continent, dig Dusk Plains, buy the planned equipment from Mimoza, take her letter to Mooel, and purchase Stiltzkin's bundle before clearing Oeilvert's route, pickups, hologram puzzle, and Ark steal window. After taking the Gulug Stone, use Cid's escape game, choose the source's scale solution, take Mogsam's letter, and save. The escape minigame has its own six-minute countdown; the source says it resets and does not consume the cumulative route timer while paused. This checkpoint does not replace the comprehensive guide's full Desert Palace treasure/bloodstone sweep.

### Result and unresolved checks

The source trace reaches the Desert Palace Rack at 08:36:57, with 03:23:03 before the 12-hour cutoff. Its baseline Excalibur II target remains 11:13:07; the optional tenth Promist Ring branch adds 21 minutes, leaving a source-derived 25:53 before that cutoff. These are arithmetic comparisons against source targets, not proof of timing. Full Movie Critic and platform achievement coverage, the optional-stat branches' complete cost arithmetic, the remaining Disc III/IV route, timer/version behavior, and the full-pickup route budget remain open. Continue with D3-07 Gulug Mountains at 08:52:28.

## Excalibur II route static run 6 — Desert Palace through the Disc IV transition

### Starting state

- Continue from the Desert Palace Rack split at 08:36:57. This is a static trace of the original PlayStation NTSC source route, not an in-game timer run.
- Preserve the selected stat path and its EXP plan. Path C and Combined use separate Chocobo detours, while broader full-completion checks can add time beyond the source targets.

### Trace and checks

1. **Desert Palace completion — target 08:52:28 at Esto Gaza:** Finish the bloodstone route and take the Promist Ring, Fairy Earrings, the remaining equipment rewards, and the final Namingway Card. This Desert Palace ring is the 10th copy only if the optional +21:00 Treno auction detour for nine earlier copies was completed; the baseline target excludes that detour. Defeat Valia Pira after the source's Berserk Freya/Night setup, then choose the source's party for Kuja's chamber and exit to the Lost Continent. This split reports 2 random encounters.
2. **Mount Gulug — target 09:12:20 at Lindblum Castle Guest Room:** Buy the planned equipment in Esto Gaza, carry Mogrika's letter to Moolan and continue the Mognet chain to Mogtaka, then clear Mount Gulug's pickups, levers, fixed Red Dragon groups, and Meltigemini. The source reports 0 random encounters for this segment. Eiko receives Mog's Ribbon automatically in the story. This is a one-pass collection window; the target does not represent every optional Quina or completion detour.
3. **Lindblum, Treno, and open-world branch — target 09:25:45 at Ipsen's Castle:** Take the Hilda Garde and Pinnacle Rocks pickups, then win the Treno Amdusias battle with Amarant for Running Shoes. Path C adds +11:00 for the Lagoon/Ocean Chocographs, Sky transformation, Air Garden, and Fairy Island Chocograph. Combined adds +26:00 for the larger Chocobo route and Robe of Lords goal (10,000 Hot & Cold points); the optional Forgotten Island Chocograph and second Rebirth Ring are not included in either target. The baseline reports 0 random encounters.
4. **Ipsen's Castle and four shrines — target 09:44:56 at Blairsurpass Plains:** Use weak weapons for Ipsen's reversed damage rule, deliver Kumool's letter, follow the treasure route, steal Orichalcon from Taharka, and return for Amarant after the first exit. The source then drops the assigned pairs at Water, Fire, and Wind Shrines and sends Zidane/Quina through Earth Shrine. Steal both Rubber Suit and Avenger from Earth Guardian, then sell them for the route's Gil requirement. The segment reports 0 random encounters; its broader free-exploration errands remain outside this split.
5. **Terra and Bran Bal — target 09:56:27 at Bran Bal Storage:** Enter Terra with Garnet and Steiner in the selected party, follow the source route through the local treasures, then reach Bran Bal. The source reports 3 random encounters for the segment; its Combined stat route specifies a Hecteyes battle as part of that segment. The interactive chapter has additional ATE, Mognet, Stiltzkin, shop, and pickup checks that the timed route must not be assumed to cover automatically.
6. **Pandemonium entry — target 10:10:47:** Pass Bran Bal's gate and follow the forced party-split sequence through Amdusias, Abadon, and Shell Dragon. Keep each character's equipment and EXP assignment matched to the selected stat plan. The source reports 0 random encounters and reaches Pandemonium after the reunion.
7. **Pandemonium and Disc IV transition — target 10:28:25:** Complete the lift/teleporter route and take the five listed treasures: Elixir, Carabini Mail, Battle Boots, 20,007 Gil, and Holy Miter. The source marks an intermediate save at Mozme at 10:17:35, then takes the consecutive Silver Dragon, Garland, and Kuja battles and escapes to Bran Bal. It reports 0 random encounters for this segment and marks the Disc IV transition at 10:28:25.

### Result and unresolved checks

At the Disc IV transition the source schedule leaves 01:31:35 before the 12-hour cutoff; its baseline Excalibur II pickup target is 11:13:07, leaving 46:53. Adding only the optional tenth Promist Ring branch projects 11:34:07 with 25:53 remaining. The source's cumulative stat-path budgets are Path C +14:45 (32:08 remaining) and Combined +39:45 (7:08 remaining); these totals are source-reported arithmetic, not verified playthroughs. Continue with Disc IV checkpoint/source verification, full achievement and optional-content budgeting, timer/version verification, and verification of later Burmecia pickup access.

## Excalibur II route static run 7 — Memoria entrance through Excalibur II

### Starting state

- Continue from the Disc IV transition at 10:28:25. This source-based trace follows the original PlayStation NTSC perfect-save route; it was not run in the game.
- The selected stat plan and the route's Nero Family checkpoints determine party composition, EXP, and detour timing. The broader Disc IV sidequest sweep is not part of this timed itinerary.

### Trace and checks

1. **Memoria Entrance — target 10:40:40:** Form Quina/Freya/Amarant and make the first Tantalus Hideout return for the Nero Family sequence (+02:30). Fight Nova Dragon, then exit Memoria, reform the party, return to Tantalus for the next quest step (+02:40), and save at the entrance orb. The source reports 0 random encounters for D4-01. The optional quest detours are included in this perfect-save route's target.
2. **Memoria — The Past — target 11:01:10:** Take The Tower and prepare for Maliris; steal Genji Armor before ending the fight. Complete the next Nero Family return route (+16:15), preserving the source's party and HP setup for the next Chaos Guardian. This segment reports 4 random encounters.
3. **Memoria Portal — target 11:06:12:** Take Rune Claws and steal Blood Sword from Tiamat. The source records an intermediate save at 11:04:29 and reports 1 random encounter by the portal checkpoint.
4. **Memoria — Time Warp — target 11:10:59:** Defeat Kraken and steal Genji Helmet before ending the battle. Reach the secret save point; the source reports 0 random encounters for this segment.
5. **Excalibur II — target 11:13:07 after Lich:** Reach Lich's chamber without progressing beyond it first, steal Genji Gloves, then defeat Lich. Examine the broken column on the right side of the chamber to collect Excalibur II and the associated note. The source target leaves 00:46:53 before the 12-hour cutoff; a valid pickup still requires the save timer to be below 12:00:00.

### Result and unresolved checks

This completes the source checkpoint trace through the Excalibur II pickup. The guide source explicitly leaves substantial Disc IV content for after the deadline; its “Leftovers” section includes further Chocobo, Gil, and stat/EXP work, which still needs route integration against this project's selected completion goals. The trace remains static and NTSC-specific. A manually entered save clock and source-checkpoint comparison are now part of the profile; live in-game timing, platform/booster behavior, alternative stat-path checkpoint budgets, and compatibility with the full Burmecia pickup objective remain unresolved.

## Standard route run 1 — Alexandria through Ice Cavern

### Starting assumptions

- New save; Comprehensive Playthrough profile; standard route.
- Achievement checklist may be enabled on Steam, PS4, or Xbox. Platform-only objectives must not appear as shared objectives on unsupported releases.
- Optional steals and exploration are attempted when the walkthrough gives a safe window. No experience grind is assumed.

### Trace and checks

1. **Alexandria:** The route starts with the Masked Man battle, then changes to Vivi's town route. The sword-fight checklist distinguishes the 80-point achievement from the 100-point Moonstone result; the Moonstone instruction also requires claiming the reward from Brahne before the castle escape. Knights of Pluto and ship chests are in the route before the crash transition.
2. **Evil Forest — first cage:** The route warns that Garnet's KO causes Game Over and labels the Trance achievement Steam-only. Prison Cage's second fight includes both steal targets before the escape sequence.
3. **Evil Forest — ATEs:** Source review found that GameFAQs groups Ice Cavern's Lesson 2 under its Evil Forest list. The Moogle FAQ and area routes place Lesson 2 after freeing Mois in Ice Cavern. The data now tracks six eligible Crash Site/Evil Forest ATEs for Movie Critic and Lesson 1 as a separate tutorial objective; Lesson 2 is tracked only in Ice Cavern. The Lindblum checklist similarly tracks five eligible scenes separately from Lesson 3.
4. **Evil Forest — party and cutoff:** Kupo's letter is accepted in Alexandria and completed at Monty; the objective is attached to the delivery. The route includes the Plant Brain steal window, the spring, Blank's last equipment pause, the forest treasure sweep, then One Nag Too Many after the Moogle's Flute is received. The 17-call route is linked for Steam, PS4, and Xbox.
5. **Ice Cavern — route and return:** All eight chest locations are listed. Mois's Lesson 2 and letter are separate objectives; the tutorial is explicitly excluded from Movie Critic. The waterfall battle is a one-time steal window. The cave remains reachable from the world map until Dali departure, so missed chests can be recovered after the boss. Take Mois's letter on the first pass: one Steam guide says to backtrack if missed, but the GameFAQs Excalibur II route accepts it before the boss and its later Mois visit does not confirm recovery; EliteGrindLab reports no other publisher mentions the letter backtrack.
6. **Dali — return, ATEs, and factory:** The trace returns to Ice Cavern for any missed chests before boarding. It collects Mois's letter on the first pass and delivers it to Gumo; if missed, a post-boss return is only a best-effort attempt because sources disagree. All six Dali ATEs are placed before the first departure; the initial either/or prompt is resolved by returning for the other scene. The Underground preflight precedes its one-time crate closure and covers eleven pickups plus Kumop's letter. Observatory pickups and Morrid's coffee request are rechecked before Black Waltz 2; the boss steals are handled before the fight ends. After the inn rest, the last gate checks the Ice Cavern chests and the letter status before boarding.

### Result

The first static run passes the inspected handoffs: Alexandria → Evil Forest → Ice Cavern → Dali. It ends at Dali's Cargo Ship departure gate; the second run below continues from that point. Dali's first-departure ATE and factory gates are reached after the Ice Cavern return check. The ATE mismatch is corrected in the source notes, objective model, walkthrough text, and missables warning. The Movie Critic count is reconciled at 83 total scenes, three excluded tutorials, 80 eligible scenes, and 79 required in one playthrough because one eligible pair is mutually exclusive.

This does not prove exact trigger ordering in a live game, the full 79-event route, item-rank effects, or the Excalibur II timer. Those remain open.

## Standard route run 2 — Cargo Ship through Lindblum Kingdom

### Starting state

- Continue from the Dali departure gate after the optional return to Ice Cavern and delivery of Mois's letter.
- Comprehensive Playthrough profile; no Excalibur II timer assumed.
- Treat early boss steals as optional item-copy opportunities where Lindblum later sells the item type.

### Trace and checks

1. **Cargo Ship interior:** Boarding closes the Ice Cavern return window. The lower deck has three dialogue-only scenery checks but no pickups, save point, shop, or recovery stop. The walkthrough labels these checks optional and reaches the bridge after the story scenes.
2. **Black Waltz 3:** Before the one-time deck battle, the route checks the three active characters' equipment and healing items; Dagger is absent. Zidane has one steal opportunity for each of Steepled Hat, Linen Cuirass, and Silver Gloves. Lindblum has later copies, so the route records the boss window without claiming permanent loss of the item types. The battle data and strategy distinguish this Level 7 encounter from the later South Gate rematch and do not rely on disputed weakness or steal-rate tables.
3. **Lindblum arrival and Mognet:** The first city gate starts with the guest-room Glass Armlet and Ether, delivery of Kumop's letter, and acceptance of Mogki's letter to Atla. The route then follows the forced story rest to the Business District and checks Moodon's letter before progressing.
4. **First-visit ATEs and district order:** Business District covers Lesson 3, Small-Town Knight in a Big City, and Vivi's Shopping; the route then sweeps the Industrial District before Theater District's Steam Engine, What Can I Do?, and Baku and His Crew. The Movie Critic objective counts the five eligible scenes and excludes Lesson 3. The achievement guides corroborate that all three Mogster tutorials are excluded; one later eligible ATE is mutually exclusive, leaving 79 required from 80 eligible scenes.
5. **Theater cutoff:** Lowell's Autograph and the Moogle Suit are collected before entering the Tantalus Hideout. Inside, the route views What Can I Do?, collects all three Gil chests and Mini-Burmecia, then checks Baku and His Crew after exiting. The local ATE check sits after the final prompt and before returning to the castle.
6. **Festival branch:** The route saves before the one-time 12-minute Hunt, records the three mutually exclusive prizes, and includes a Zaghnol steal window near 4:30 remaining. The Comprehensive route can choose Freya for the Coral Ring; the achievement route can choose Vivi. Either winner receives Master Hunter. The winner instruction and platform achievement are separate objectives, so a player can use a pre-event save to unlock Vivi's achievement before restoring the desired comprehensive-save branch.
7. **After the Festival and Base Level:** After the party changes, the route reviews Freya's equipment/abilities, visits Dragoo's before the Javelin stock cutoff, and checks the Serpent's Gate Wyerd Card, Dragon's Gate Stiltzkin letter, save point, Tent, and merchant before the world-map exit. The item sweep is explicitly partial pending a complete Treasure Hunter/version audit.
8. **Lindblum Kingdom detour:** Before entering Gizamaluke's Grotto, the route recruits Quina at Qu's Marsh, starts Frog Catching while preserving a breeding pair, and optionally learns the nine Blue Magic skills available in this region. It then catches Choco, unlocks Hot & Cold, collects the Streamside and Between Mountains treasures, takes the Ether and Moccha Coffee at Bohden Arch, and visits Pinnacle Rocks for its Elixir and Phoenix Down.
9. **Pre-Grotto gate:** The optional world-map route returns to Dragon's Gate and checks that any remaining city/trolley work is complete before crossing the Grotto threshold. Sources differ on the exact wording of when the city access lockout begins, so the guide keeps the conservative check before entry.

### Result

The static route passes the reviewed chapter handoffs: Dali → Cargo Ship → Lindblum → Lindblum Kingdom → pre-Grotto gate. The Cargo Ship item list and boss are separated from the later South Gate fight; the Lindblum scene count distinguishes the six local ATE prompts from the five Movie Critic-eligible scenes; the Festival's mutually exclusive outcomes remain separate; and Quina, coffee, Chocobo, and early regional Blue Magic are reached before the Grotto gate.

The Lindblum pickup list, full Treasure Hunter route, exact ATE trigger sequence, regional enemy/skill completeness, and live-game behavior remain partial. This is a source-based static trace, not emulator verification. Run 3 below continues the route into Journey to Burmecia.

## Standard route run 3 — Journey to Burmecia

### Starting state

- Continue from the Lindblum Kingdom pre-Grotto checkpoint after finishing the trolley and city checklist.
- Quina and Choco have been recruited on the comprehensive route; optional skills and treasure are attempted when available.
- No specific party level is assumed.

### Trace and checks

1. **Grotto approach and cutoff:** The route places the Lindblum trolley check before entering Gizamaluke's Grotto. It then collects the first bell from the soldier and opens the entry door. The chapter's source notes preserve disagreement about whether city access closes at entry or after the Grotto sequence, so the route takes the earlier safe cutoff.
2. **Bell route and hidden gear:** The route opens the left small door first for the Bronze Vest and the next bell, then the far-right small door for Mythril Gloves and Magus Hat, then the large central door. It checks the first soldier's body for a spare bell rather than depending on one published total; after the great bell chest it visits the moogles and uses the required Kupo Nut/Holy Bell sequence. The recipient is phrased neutrally because references name Mogmi or Moguta differently.
3. **Mognet and boss:** The route checks Mogmi's Mognet for Moodon's Festival letter if it is present, then saves and rests before the boss. It identifies the one-time Elixir, Magus Hat, and Ice Staff steals with later item-source recovery notes, and warns that the proposed Tent status tactic has a source-reported healing risk. The boss fight is not given an invented minimum level.
4. **South Gate split:** After Gizamaluke, the walkthrough follows Steiner and Dagger at Bohden Gate, takes the Multina Racket before the story alley, resolves the worker sequence for the Gate Pass, then collects the station Potion and accepts Grimo's letter for Nazna. It includes the local shop, save, and shared-equipment review before boarding. The temporary station cutoff is distinguished from permanent item loss because both item types have later sources.
5. **Daines-horse Basin detours:** Back with Zidane's party, the route visits Burmecia Arch for the Hi-Potion, Tent, and optional dialogue; learns Night from a Nymph if Quina is available; and avoids the Grotto vine route that leads to Popos Heights and its dangerous encounters.
6. **Healing Shore dependency:** The Chocograph #4 instruction now includes the missing prerequisite: return to Chocobo's Forest and dig up Healing Shore if it is not already in Key Items, then return to the Basin tracks and search the shore for the Reef Ability treasure. This closes the prior route gap where the walkthrough sent the player to a treasure before telling them to obtain its map.
7. **Chapter handoff:** After the optional pickups and skill, the route crosses the north basin and stops at Burmecia's entrance; the internal city sweep and its ATE prerequisite belong to the following chapter.

### Result

The static route passes the reviewed handoffs: Lindblum Kingdom → Gizamaluke's Grotto → South Gate → Daines-horse Basin → Burmecia entrance. The door order preserves the three hidden Grotto pickups; the Kupo Nut and Holy Bell gate is included; the Mognet letter and party equipment handoff precede the cable car; and the Reef treasure cannot be attempted until its Chocograph is dug up at the Forest.

The complete enemy list, all Grotto encounters, exact boss-status behavior, South Gate later-access timing, Chocograph/reward inventory beyond this objective, and live-game behavior remain partial. This is a source-based static trace, not emulator verification. The next chapter is Burmecia.

## Standard route run 4 — Burmecia through Summit Station

### Starting state

- Continue from the Burmecia entrance after the Journey to Burmecia route's basin detours and pre-entry check.
- Quina is in the party on this route; Blue Magic collection is optional for other profiles.
- No specific party level is assumed, and no Excalibur II timer is active.

### Trace and checks

1. **Suburb entry and pickups:** Search behind the overturned cart for Cancer. After the two Type A Black Mages, the route enters the left ground-level doorway for the Potion and Soft, checks behind the stairwell for the second Soft, and proceeds upstairs while avoiding the Mimic. If Quina is present, Eat weakened Ironites for Angel's Snack and a weakened Magic Vice for Magic Hammer; the low-HP Vice may flee.
2. **Germinas Boots and Protection Bell:** Walk across the crumbling balcony and open the Germinas Boots chest before running over that floor. Run afterward to drop the platform, then return to the lower entrance and cross the dropped route. Skip the Mimic chest, speak with the wounded soldier, and search the far side of the bed for the Protection Bell and behind the shelf for the Ether. Use the bell on the locked balcony door.
3. **Uptown prerequisite and courtyard:** Enter the ground-floor room to see Wei and Kal before climbing or leaving Uptown; this unlocks their later Lindblum ATE but is not itself an ATE. Cross the broken-statue bridge for the Tent and Phoenix Down, then leave through the far doorway without opening the Mimic.
4. **Square and Vault:** Take Freya's Mythril Spear in the left armory. In the right Vault, open the Lightning Staff chest to trigger Stiltzkin, then buy his 333-Gil Soft/Hi-Potion/Ether bundle. Deliver Mogki's letter to Atla, accept the Kupo Nut and Atla's letter for Monev, check the Mogshop, and save. The optional Kupo Nut exchange returns to Moguta before the next Kupo Nut is accepted; Atla's letter for Monev is carried into the later Cleyra route.
5. **Palace gate and Beatrix:** Use a Tent and save with Atla before going to the palace. At the story prompt, choose “Leave her alone” to advance. In the fight, use Zidane to steal Phoenix Down and Chain Plate; the Mythril Sword is a very rare optional attempt. Use Slow if available, defend/heal, and avoid attacking unless the desired steals are complete. The battle ends after Beatrix's tenth turn or when her HP reaches zero, and the finisher leaves the party at 1 HP.
6. **Chapter handoff:** Watch the post-battle scenes and continue to Disc II at Summit Station. This handoff preserves the earlier Grimo-to-Nazna letter for the next chapter and keeps the Summit Station route separate from Burmecia's city sweep.

### Result

The static route passes the reviewed handoffs: Burmecia entrance → Suburb → Uptown → Vault → palace → Summit Station. All 11 local pickups are reached before leaving, the balcony trap is handled before it closes, Wei and Kal are seen before the later ATE window, Atla's Stiltzkin purchase and Mognet exchanges are placed before the story transition, and Beatrix's finite steal window is treated as a survival encounter. The Monev letter remains queued for its later delivery.

The exact room labels and some Mimic placement descriptions vary between guides; the route follows the cross-checked pickup path and avoids unneeded Mimic chests. The city's later chest accessibility remains disputed, and this is a source-based static trace rather than emulator verification. Summit Station is the next checkpoint.

## Standard route run 5 — Journey to Treno

### Starting state

- Continue after Beatrix's first battle and the party handoff to Dagger and Steiner at Summit Station.
- Carry Grimo's Mognet letter from the Disc I South Gate stop and Atla's letter for Monev from Burmecia.
- No specific party level is assumed; the optional Dali and Bentini Heights detours are included in the comprehensive route.

### Trace and checks

1. **Summit Station:** Take the Phoenix Down from the rest-area chest. Speak with Nazna to deliver Grimo's letter, then speak with her again to accept the reply for Mochos. If Atla's Kupo Nut was returned to Moguta, collect the conditional new nut. Check the shop, equip Dagger and Steiner, and save before speaking to the attendant and continuing the story. GameFAQs flags totals of four Silver Gloves and three Iron Helms as a last chance; the independent sources confirm the stock but not a permanent cutoff, so the route treats this as a cautious inventory check.
2. **Train and Black Waltz 3:** After Cinna and Marcus arrive and the train departs, speak with Marcus to start the rematch. Marcus attempts the Steepled Hat, Lightning Staff, and Flame Staff steals; Dagger is not targeted and can heal. If Freeze lands, do not hit that character physically until it clears. The fight is a one-time window; sources report 1,292 HP or a rounded 1,300, and the route does not require a level or fixed number of attempts.
3. **Alexandria Station and Dali:** After the battle, Marcus joins the route. Part-Time Worker Mary has a supply shop. Take the left fork and use the Gate Pass to revisit Dali; the former garden blocker is gone, so collect the Elixir from the crop field. Return to the station fork and continue on the right branch.
4. **South Gate route:** Equip Marcus with useful current gear, pass the guard with the Gate Pass, and take the right fork. Jump the broken bridge, follow the stairs down to the 1,610 Gil chest, and continue through the gate to the world map.
5. **Bentini Heights:** If the friendly Ghost appears, give it an Ore for a Hi-Potion and 10 AP. At Quan's Dwelling, take all three Ethers, collect the hidden Scorpio near the spring, use the spring to restore HP/MP, and inspect the far-right room for the later Vivi-related story flag. The cave has no battles, but random encounters can occur on the forest approach.
6. **Chapter handoff:** Return to Treno and stop at its entrance. The next chapter begins with the first-visit ATE route, so the outside-city save and ordered screen sequence remain ahead of the player.

### Result

The static route passes the reviewed handoffs: Summit Station → train rematch → Alexandria Station → Dali return → South Gate → Bentini Heights → Treno entrance. The Nazna reply is accepted before leaving, the three boss steals are identified as an optional one-time window, the Dali Elixir is collected on the temporary return visit, and the route reaches the Treno ATE chapter with the Mognet handoff to Mochos and Atla's Monev letter still in the party's queue.

The Summit Station Silver Gloves/Iron Helm deadline remains disputed, the later Lightning Staff replacement and full steal-item progression are not mapped, and enemy encounters on the world-map detour were not simulated. This is a source-based static trace rather than emulator verification. Treno is the next checkpoint.

## Standard route run 6 — Treno through the Gargan Roo entrance

### Starting state

- Continue from the Treno entrance with Dagger, Steiner, and Marcus after the Summit Station rematch and optional world-map detours.
- Keep the outside-Treno save until the ATE sequence is complete if preserving Movie Critic progress.
- No fixed character level is assumed; the optional Griffin fight is treated as a one-time reward opportunity.

### Trace and checks

1. **First six ATEs:** On regaining control of Steiner, view Treno Tradition and hit the action prompt over Dagger to reduce the Gil loss. Follow Dagger west for Pursuit, down the stairs for Confusion, south to the Card Stadium area for Ambition, back to the entrance and east for Meeting Place, then north for Unexpected Visitor. Keep city pickups and the Auction House story screen until the first six are viewed.
2. **Power Belt intercept:** Return along the Four-Armed Man's route, pass the Card Stadium, and enter the indicated hallway/Synthesis Shop to speak with him before he leaves. This secures the early Power Belt; later synthesis sources exist if the intercept is missed.
3. **First-visit pickups and Mognet:** Throw 10 Gil into the fountain 13 times for Gemini. In the Slums, take the Yeti Card and 1 Gil chests and collect Taurus behind the Item Shop. Speak with Mogrich and read Stiltzkin's letter; check the Weapon Shop. The perfect-inventory guide lists several shop-stock cutoffs, but only one source claims they are permanent, so this remains a cautious quantity check.
4. **Auction-side cache and Queen Stella:** Search both sides of the Auction House window for 2,225 Gil, then follow the circular path past the Card Stadium to the confirmed riverbank Ether. Visit Queen Stella to turn in current Stellazzio and receive the appropriate reward ladder items. Search her room for a possible second Ether, which remains disputed.
5. **Griffin challenge and story scenes:** Equip Steiner for the solo Griffin fight and challenge the Weapon Shop owner before leaving; victory awards the Tonberry Card. Then use the Auction House for the story scene, find Marcus at the Inn, and continue to the docks and Doctor Tot's tower. The first Auction House entry is story-only; bidding is a later visit.
6. **Supersoft and ATE cutoff:** Collect the Mythril Dagger from the west approach to Doctor Tot's tower, speak with Tot to receive Supersoft and open Gargan Roo, then climb back out to trigger Crime and Punishment. Confirm all seven ATEs before going back down the hatch.
7. **Chapter handoff:** Descend into Gargan Roo. The next chapter covers Mochos's letter handoff, both chest branches, the Gargant controls, and Ralvurahva.

### Result

The static route passes the reviewed sequence: Treno entrance → six ATEs → Power Belt → pickups/Mognet/coins → Griffin → story scenes → Mythril Dagger/Supersoft → Crime and Punishment → Gargan Roo. The ATEs are placed before screen changes can close them, the confirmed riverbank Ether is included, and the Griffin's one-time Tonberry Card reward is reached before the story departure.

The second Ether in Queen Stella's room, several weapon-shop stock deadlines, and some later item replacement paths remain disputed or incomplete. The exact Mythril Dagger map label also differs among sources; the route uses the broad tower-approach sweep. This is a source-based static trace rather than emulator verification. Gargan Roo is the next checkpoint.

## Standard route run 7 — Journey to Cleyra

### Starting state

- Continue from the Gargan Roo hatch after Treno with Dagger, Steiner, and Marcus; Nazna's letter should be in inventory if accepted at Summit Station.
- Keep Atla's letter for Monev with Zidane's party. Nazna's Kupo Nut is conditional on meeting Moguta and having an empty nut slot; if carrying a nut, trade it before Cleyra.
- No specific character level or optional grinding is assumed.

### Trace and checks

1. **Mochos and first-ride preparation:** At the entrance save point, deliver Nazna's letter to Mochos if present, equip Antibody on Dagger and Steiner if available, and save. This is the last walkable chance for that handoff; its effect on Mognet Central is still unknown.
2. **Chest sweep and controls:** Search the southwest passage for the Chain Plate and Phoenix Down and pull the nearby lever. GameFAQs and Gamer Guides place both chests there; RPGClassics describes the Phoenix Down as central, so check the central room if the pickup count is short. Take the southeast route to Doctor Tot, pull the route lever after his explanation, return to the entrance room, use the Feed lever to stop the Gargant, and board.
3. **Ralvurahva:** During the one-time ride battle, have Marcus try for the Bone Wrist and Mythril Fork while Dagger heals. Blind can reduce pressure if learned; Antibody helps Dagger and Steiner against poison. The steal targets are consistent across the inspected routes, but the reported probabilities and some enemy values vary. Do not require a fixed level or delay a safe victory for repeated attempts.
4. **Party handoff:** Continue through the Alexandria scenes until control returns to Zidane's party in Burmecia. Update equipment with useful Treno items before crossing the world map west toward Cleyra.
5. **Optional Burmecia, Kupo Nut, and frog stops:** Flactem documents an optional Disc II return through Burmecia to Atla's Mogshop before Cleyra; restock there if useful, then return through Gizamaluke's Grotto. This confirms Atla's shop access, not access to every Disc I chest room. If carrying a Kupo Nut from Atla or Nazna, trade it to Moguta before entering Cleyra; only one nut can be held at a time. For the third Frog Catching visit, backtrack through Gizamaluke's Grotto to Qu's Marsh in Lindblum Basin, preserve one adult male and one adult female frog and the golden frog if present, then return through the Grotto to Burmecian territory.
6. **Chapter handoff:** Return to Burmecian territory, save outside Cleyra, then enter the sandstorm. The next chapter begins with the one-way Cleyra's Trunk sweep.

### Result

The static route passes the reviewed handoffs: Treno hatch → Mochos → two Gargan Roo chests and controls → Ralvurahva → Alexandria capture scenes → Zidane's party outside Burmecia → optional Atla Mogshop, Kupo Nut exchange, and Qu's Marsh return → Burmecian territory rejoin → Cleyra entrance. The optional Lindblum Basin branch and return are also represented in the game-route graph. It preserves Nazna's letter opportunity and the two boss steal targets, describes the lever order, carries Atla's letter forward for Monev, and reaches the next chapter before the Cleyra cutoff.

The precise Phoenix Down room remains disputed, as do Ralvurahva's steal rates and some enemy values. The Nazna-to-Mochos letter's effect on the later Mognet Central chain and replacement paths for both boss steals are still unverified. This is a source-based static trace, not emulator verification. Cleyra is the next checkpoint.

## Standard route run 8 — Cleyra

### Starting state

- Enter Cleyra after the Journey to Cleyra detours, with Quina in the active party and Atla's letter for Monev carried from Burmecia if it was accepted.
- If holding a Kupo Nut from an earlier Mognet delivery, trade it to Moguta before entering so a later Moogle can offer another; only one nut can be held at a time.
- Use the Comprehensive Playthrough profile. Attempt one-time steals when safe; no level target or grind is assumed.

### Trace and checks

1. **Cleyra's Trunk:** Open the Phoenix Down, Magician Shoes, Ice Staff, and Ether chests before activating the sandfall hole that seals the entrance. Continue through the sandfalls for Needle Fork and Tent, deliver Atla's letter to Monev, and take his Kupo Nut only if Moguta has been met and the inventory slot is free. Sweep Flame Staff, Remedy, Desert Boots, Mythril Vest, Mythril Gloves, Potion, Elixir, 900 Gil, Hi-Potion, and Gysahl Greens. Eat Carrion Worm, Dragonfly, and Zuu for Quina's Auto-Life, Matra Magic, and White Wind if those abilities are in the completion profile.
2. **First settlement visit:** Keep Quina in the party for the two gated ATEs and follow the pond / observatory trigger route for all four. Speak with Quina at the rubbish pit beside the town entrance to reach the Silk Robe and second Magician Shoes above the Trunk entrance. Collect the separate 970-Gil garbage pit reward and sweep the stair, pond, Inn, Windmill, grass, flower, and Cathedral pickups.
3. **Mognet and shops before Antlion:** Check Mopli at the Inn for the pending message. The Inn letter sender differs in published lists, and GameFAQs describes a second new message on the post-Antlion return; both checks are recorded. Visit both Soldier Dan's weapon shop and Nina's item shop before Antlion, buy needed party equipment and Annoyntments, then save and prepare for Trouble and Sandstorm.
4. **Antlion and Freya control:** Try the three Antlion steals before ending the fight. After control switches to Freya, search the Cathedral rear harp room for Ether, Ore, and Phoenix Pinion and speak to the High Priest for the one-time Emerald. At the Inn, buy Stiltzkin's 444-Gil bundle and check Mopli's Mognet again. Return to the settlement entrance and rejoin Zidane, Vivi, and Quina.
5. **Trunk return and town attack:** Follow the forced soldier encounters down the Trunk and cross the bridge; the story returns the party to town automatically. After the forced Type B battle, visit Mopli in the sandpit area for the letter to Serino, then save and continue the assault.
6. **Evacuation:** Direct the residents Right, Left, then across the bridge to the Right. Choose Not Yet at the final safety question. Speak with every rescued resident in the Cathedral lobby for all reported rewards; the reward lists differ by one Phoenix Pinion, so clear every NPC.
7. **Quina and Beatrix:** Before leaving the Cathedral, remove Quina's Add-on and any gear needed by the remaining party. Save and attempt Phoenix Down, Thunder Gloves, and Ice Brand steals from Beatrix while focusing on survival. Published routes agree on a ten-turn window, but differ on whether reducing her HP to zero can end the encounter sooner.

### Result

The static route passes Cleyra's one-way Trunk entrance, four ATEs, two otherwise unreachable pit chests, Mognet and conditional Kupo Nut checkpoints, both shops, Antlion steals, Freya's Emerald and Stiltzkin window, the automatic return trip, attack letter, evacuation, survivor rewards, Quina gear handoff, and Beatrix steals. It carries Mopli's letter into the next chapter for delivery to Serino aboard the Red Rose.

The Inn Mognet sender, exact final closure point, shop-item replacement paths, survivor reward list, Kupo Nut eligibility, and Beatrix's exact end condition remain partial where sources disagree or omit details. This is a source-based static trace, not emulator verification. Return to Alexandria is the next checkpoint.

## Standard route run 9 — Return to Alexandria

### Starting state

- Continue from Cleyra aboard the Red Rose with Zidane, Vivi, and Freya; Quina is no longer in the active party.
- Deliver Mopli's letter to Serino and accept Serino's letter for Mooden before the viewpoint switches to Steiner and Marcus.
- No Excalibur II timer or optional grinding is assumed. The rescue's 30:00 timer begins only after Steiner rejoins the party.

### Trace and checks

1. **Red Rose and Mognet:** Watch the scenes and follow Vivi around the balcony. Use Mognet with Serino, deliver Mopli's letter from the Cleyra attack, accept Serino's next letter for Mooden, and save before continuing.
2. **Cage escape and equipment handoff:** Rock the suspended cage in its current direction when Marcus calls out. After it breaks, equip Steiner, then remove Marcus's transferable gear and replace his weapon with a spare Broadsword or Iron Sword before he leaves. The short guard encounters before the ladder occur before the rescue timer starts.
3. **Timed castle route:** After Steiner rejoins Zidane, Vivi, and Freya, note the 30:00 timer. Skip the optional Tantarian fight in the library during this first window. Avoid contact with chasing Alexandrian soldiers and follow East Tower → Courtyard → main castle balcony → Queen's Room. Open the purple candelabra passage.
4. **Queen's Room chests and Zorn/Thorn:** Use the rotating platform to open the Tent and Ice Brand chests, then enter the northern door. Try all four steals from Zorn and Thorn while the timer runs. Slow is useful; attack whichever clown just received power to interrupt its spell. The fight ends when either clown is defeated or reaches critical HP, so finish after the desired steals or if the countdown is low.
5. **Friendship and first Mosh check:** Approach Dagger after the fight and view the mandatory Friendship ATE; the rescue timer stops after this scene. Speak with Mosh in the chapel, use Mognet to read the new letters, and save before carrying Dagger back toward the Queen's Room.
6. **Beatrix and Freya's fight:** Remove Freya's Add-on before the third Beatrix battle. Try Phoenix Down, Ice Brand, and Survival Vest while keeping the party alive; Slow can help. Sources describe a ten-turn limit, but differ on whether reducing Beatrix's HP to zero can end the fight earlier. After her scripted end, control Freya and Beatrix for the Bandersnatch battle.
7. **Castle descent and Steiner handoff:** Back with Zidane's party, equip Dagger, then descend past the optional chasing Bandersnatch, three Type C mages, and two more Bandersnatches. Remove Steiner's Add-on before he leaves; finish his lone Bandersnatch, then clear Freya's two Bandersnatch battles, with Steiner joining the second. Control returns to Zidane's party.
8. **Second Mosh check and Ralvuimago:** Return to the chapel for Mosh's newly available letter to Monty and save. Enter Gargan Roo, try to steal Phoenix Down, Adaman Vest, and Oak Staff from Ralvuimago, and prioritize Oak Staff if Vivi still needs Bio. Slow helps; avoid physical attacks while the boss is curled, use Ice when it is upright, and cure Mini with Remedy.
9. **Chapter handoff:** Continue through the Gargant and story scenes to Pinnacle Rocks, carrying Mosh's letter to Monty.

### Result

The static route passes both Mognet handoffs, the Marcus gear transfer, the timed castle path, the Tent and Ice Brand chests, all three one-time boss steal opportunities, the mandatory Friendship ATE, both Mosh checks, the Freya/Steiner equipment handoffs, and the transition through Ralvuimago to Pinnacle Rocks. The optional Tantarian encounter is deferred to its later opportunity so the route does not spend its rescue timer on that fight.

Exact boss HP and steal rates, later replacement paths for all three chest/boss item sets, and Beatrix's exact end condition remain partial. This is a source-based static trace, not emulator verification. Pinnacle Rocks is the next checkpoint.

## Standard route run 10 — Pinnacle Rocks

### Starting state

- Continue after Ralvuimago and the Gargant scenes with Zidane, Dagger, and Vivi at Pinnacle Rocks.
- Carry Mosh's letter for Monty from the Alexandria Castle chapel. The separate entrance-side Elixir and Phoenix Down may have been collected on the earlier Lindblum Plateau detour; if not, keep them distinct from the story-area chests.
- No fixed character level or optional grinding is assumed. Complete Ramuh's story on this comprehensive route so the post-scene Stiltzkin letter becomes available.

### Trace and checks

1. **Crash site and Mognet:** Speak to Monty, deliver Mosh's letter, save, and heal. Open the nearby lower-path Mythril Vest chest. Check the crash-site path and ledge above Monty for the Ramuh manifestations as you start the sweep.
2. **Five fragments and two interior chests:** Search the connected upper paths, creek, and lower ledges until all five labels are recorded: Beginning, Cooperation, Silence, Human, and Hero. Open The Ogre chest by the Cooperation manifestation. On the upper bridge route, use the field prompt to reach the Mythril Armlet chest, then follow the connected lower path and check for any remaining manifestation before climbing back.
3. **Ramuh's story:** At the exit, assemble Beginning → Cooperation → Silence → either Human or Hero. The omitted piece is the one that does not belong to the selected version of the story. Receive the Peridot; equip it to Dagger if you want her to learn Ramuh now.
4. **Stiltzkin and last checks:** Return to Monty after Ramuh's scene and use Mognet to read Stiltzkin's new letter. Before the final departure, confirm Mosh's letter is delivered, all three story-area chests are open, and the new letter is read if pursuing Mognet completion. If the early Elixir/Phoenix Down are still missing, check the separate entrance pair; GameFAQs says these remain collectible on a later visit.
5. **Chapter handoff:** Take the final jump to Lindblum and continue after the attack scenes. The interior story route closes at this transition; the entrance treasure pair follows a different availability window.

### Result

The static route passes the Mosh-to-Monty handoff, Mythril Vest/The Ogre/Mythril Armlet chest sweep, all five Ramuh manifestations, the accepted four-part answer, Peridot reward, Stiltzkin's post-Ramuh letter, and the jump to Lindblum. It keeps the two earlier entrance chests separate from the three story-area chests.

Guides describe the manifestation locations and traversal order differently, so the trace uses a full branch sweep and named-fragment checklist. The interior cutoff and the recoverable entrance pair are also described as one area by some sources and two schedules by others. Ramuh is optional for story progress, and other Peridot sources exist; Mognet's later completion effect remains unverified. This is a source-based static trace, not emulator verification. Return to Lindblum is the next checkpoint.

## Standard route run 11 — Return to Lindblum

### Starting state

- Continue after Ramuh's story with Zidane and Dagger in Lindblum; Vivi rejoins later during the castle departure sequence.
- Dagger has Ramuh's Peridot if the Ramuh sequence was completed. Keep Serino's letter for Mooden from the Red Rose, and Ruby's and Mooden's outgoing letters remain separate Mognet checks.
- The comprehensive route clears the city before using the fountain exit; the Dragon's Gate departure locks the other districts for a long story stretch.

### Trace and checks

1. **Regent and Gil:** Follow the north route through the damaged streets and Shopping Area to Minister Artania and Regent Cid. Take the 3,000 Gil, return to the city square, and equip Peridot on Dagger in an open Add-on slot if she still needs to learn Ramuh.
2. **Manual ATE and Business District sweep:** Before speaking with the man by the fountain, leave the shop square through its south exit and view The Third Jewel. Return to Card Freak Gon's residence for the Ether and Phoenix Pinion chests, then search the rubble by the blocked church alley for the Lindblum Card.
3. **Mognet letters:** Visit Moodon at the Inn. Deliver Serino's letter, read Ruby's letter to Zidane, and accept Moodon's letter for Moonte at Dragon's Gate. If carrying Monev's Cleyra Kupo Nut, trade it to Moguta first so the later nut from Moonte can enter the Key Item inventory.
4. **Theater District:** Take the air cab to the Theater District. Collect the Ore in Michael's Studio, tell Lowell to work at Ruby's theater in Alexandria, and open all three Tantalus hideout chests (340, 993, and 262 Gil). Return by air cab to the Business District.
5. **City stock and optional return:** Before leaving, check the selected perfect-inventory plan's Chain Mail requirement; GameFAQs specifies 15 copies before Dragon's Gate, counting up to 12 Power Belts toward the total. Shop and synthesize as needed, including Exploda for Zidane and Barette for Dagger/Cura. If the earlier Lindblum Plateau detour was skipped, use Hunter's Gate to collect Pinnacle Rocks' entrance-side Elixir and Phoenix Down; these are separate from its three interior chests.
6. **Departure ATEs and castle handoff:** When the city sweep is complete, tell the fountain-area guide you are ready. View Brahne's Fleet Arrives, collect the World Map from Cid at Base Level, and view the automatic <Gwok-gwok!> How Infuriating! ATE on the route to Dragon's Gate.
7. **Dragon's Gate and final Mognet:** Speak with Moonte, open the hidden Bandana chest behind the platform, and check the merchant. If Monev's Kupo Nut is still held, leave for Gizamaluke's Grotto and trade it to Moguta before delivering Moodon's letter; return to deliver the letter and then trade Moonte's new nut if pursuing the repeat reward. Complete the gate-side cutoff check before leaving for the Outer Continent.

### Result

The static route preserves all three ATEs (The Third Jewel before departure, then the two automatic scenes), the Business and Theater District pickups, Lowell's move, the Serino-to-Moodon and Moodon-to-Moonte handoffs, the Chain Mail inventory warning, city shop access, the optional Pinnacle entrance chests, and the Dragon's Gate Bandana. It carries the Kupo Nut trade outside the letter handoff so a full Key Item slot cannot block the next nut reward.

Exact Chain Mail synthesis planning remains conditional on a perfect-inventory route, and the full return availability of Lindblum shops is not mapped here. The Kupo Nut loop is optional and its reward after the fixed Cleyra trade varies. This is a source-based static trace, not emulator verification. Journey to the Outer Continent is the next checkpoint.

## Standard route run 12 — Journey to the Outer Continent

### Starting state

- Leave Dragon's Gate with Zidane, Dagger, and Vivi; return to Qu's Marsh near the gate and reunite with Quina before trying to enter Fossil Roo.
- Resolve Moodon's letter to Moonte and any selected Kupo Nut trade before committing to the dungeon. If Choco is available, dig up Chocograph #5 now; its Outer Continent treasure can be collected after the exit.
- Frog Catching is optional for story progress. This route preserves the adult male/female pair and golden frog, noting that GameFAQs recommends clearing the pond before the long absence.

### Trace and checks

1. **Marsh and party preparation:** Reunite with Quina at the pond. Catch frogs toward the next selected reward if desired, visit Quale's house for the optional conversation, and leave east when Quina reveals the Fossil Roo approach. On the approach, learn LV4 Holy from Feather Circle or White Wind from Griffin only if those Blue Magic skills are still missing.
2. **Armodullahan and Lani:** Move through the trap hall by watching the swinging blades; the chase ends when Armodullahan falls through the pit. During the one-time Lani fight, try Ether, Gladius, and Coral Sword steals while keeping Dagger alive. After she retreats, backtrack through the axes to the room where Armodullahan appeared and collect the Elixir, then return to Lani's arena.
3. **Enter Fossil Roo and take Stiltzkin's bundle:** Pick yellow flowers and use them to slow and board the first Gargant. At Mogki's area, buy Stiltzkin's 555-Gil bundle (Phoenix Pinion, Remedy, Ether), read Kuppo's letter, check the Mogshop, and save. This is purchase #3 of eight for the supported Driving the Hard Bargain achievement/trophy route. Separately, buy any desired stock from the Treasure Hunter's shop during the Fossil Roo visit; original PlayStation route evidence supports the final Gargant as the safe last-buy cutoff, while newer-release access remains unverified.
4. **Near Reaches branches:** Ride the southern route for Fairy Earrings and return to Mogki. On the northern route, use the numbered track switches to reach the Ether chest and the second switch branch, then return to the central area. Use the on-screen switch labels to confirm each Gargant destination; save with Mogki before moving to the Nest.
5. **Nest and central caverns:** Visit the miner's Mogshop if supplies are needed, operate switch No. 4, and take its branch to Lamia's Tiara. Restore the switch route, continue through the vine chamber, and use the upper-right exit to reach the mining site. The water stream may push Zidane into the lower pool; climb out and continue.
6. **Mining site:** Trade one Potion for the pickaxe, free Kuppo at the cracked wall, read his letter for Kupo, and save. If the selected Steam/PS4/Xbox profile includes Peek-A-Boo, this rescue is its trigger. Mine the central pillar for Madain's Ring only if pursuing The One Ring; item discovery is random. Leave through the southeast passage for the Survival Vest, then return to the vine chamber.
7. **Final cutoff and Outer Continent:** Before using switch No. 3, confirm the Elixir, Fairy Earrings, both Ethers, Lamia's Tiara, and Survival Vest; verify that any desired Treasure Hunter purchase is complete, along with Stiltzkin #3, both Kuppo letters, Lani's selected steals, and any mining objectives. Flip No. 3, return to the lower-right exit, and board the final Gargant to leave Fossil Roo.

### Result

The static route passes Quina's required reunion, the selected Frog Catching and Chocograph detours, Lani's one-time steal window and Elixir backtrack, Stiltzkin #3, the Mognet checks with Mogki and Kuppo, every listed chest branch, the nine modeled Treasure Hunter shop paths as a pre-exit buying check, the mining achievements, the Survival Vest, and the final one-way switch/Gargant transition.

Published Frog Catching advice conflicts on whether to clear or preserve this pond; this trace follows the repeatable breeding guidance. Lani's exact stats and steal odds, the detailed random mining yield, replacement sources for every Fossil Roo pickup, and Treasure Hunter shop access on newer releases remain unverified. This is a source-based static trace, not emulator verification. Outer Continent is the next checkpoint.

## Standard route run 13 — Outer Continent

### Starting state

- Continue from the Fossil Roo exit with Zidane, Dagger, Vivi, and Quina together. Chocograph #5 should have been dug up before Fossil Roo if you want to claim its treasure on this visit.
- The first Conde Petie visit has five order-sensitive ATEs. Save on the world map before entering town and view them before collecting items or speaking to optional party members.
- No minimum level or optional grinding is assumed. Frog Catching and the Friendly Creature sequence remain optional side content.

### Trace and checks

1. **World-map detours:** Follow the plateau north, then east to the northeastern Qu's Marsh. Preserve a male/female frog pair and the golden frog if present; the Frog Catching source disagrees with GameFAQs' clear-the-pond recommendation. If Quina still needs them, Eat a Goblin Mage for Goblin Punch and a Cactuar for 1,000 Needles. With Choco and Chocograph #5, search the tracks northeast of the marsh and the beach south of them for Abandoned Beach's treasure (9 Phoenix Pinions, 5 Phoenix Downs, 12 Peridots, Diamond Gloves). Give Friendly Ladybug 2 Ore for 20 AP and an Ether if it appears.
2. **Reach Conde Petie:** Loop around the plateau, pass beneath the raised bridge, and climb to town from the east. Save before entering. After the arrival split, view Vivi and the Couple immediately.
3. **First three ATEs:** From the entrance, follow the safe corridor to Quina Accused without entering the screen with Wendy Grocer's Item Shop. Then enter the Inn and view Quina Can't Communicate. Only after that, enter the Item Shop screen and view Dagger and William.
4. **Final ATE:** Go upstairs from the Item Shop and speak with Vivi to trigger Hungry Bryan. This completes the five first-visit ATE list; the later Nuptial Joy ATE is a separate return-visit scene.
5. **Town pickups and letters:** Search the dark corner by the entrance for 2,700 Gil, the Inn's lower-left bed for 1,800 Gil, the bottom of the Item Shop stairs for a Phoenix Pinion, and the back of the central Kirkboat altar for a Diamond. In the Item Shop, accept Mogmatt's letter for Suzuna on Conde Petie Mountain Path.
6. **Shops and departure:** Check Wendy Grocer and Thomas Goldpiler's weapon stall for needed stock; Poison Knuckles are for a character not yet recruited. Finish any selected optional conversations, then follow Vivi and the dwarf's directions and leave southeast toward the Magdalene Forest.

### Result

The static route passes the Outer Continent side detours, the Chocograph #5 treasure, the Friendly Ladybug reward opportunity, all five first-visit Conde Petie ATEs in a safe order, the four town pickup groups, Mogmatt's letter, the shop window, and the southeast story exit. It carries the Suzuna letter into the next chapter.

The frog-pool advice conflicts, pickup directions vary slightly, and the Diamond has a later recovery opportunity before Shimmering Island. This is a source-based static trace, not emulator verification. Magdalene Forest is the next checkpoint.

## Standard route run 14 — Magdalene Forest and Black Mage Village

### Starting state

- Continue from Conde Petie with Zidane, Dagger, Vivi, and Quina, carrying Mogmatt's letter for Suzuna. Save on the world map before entering the Dead Forest if preserving a retry point for the village ATEs.
- The first three Black Mage Village ATEs can be viewed before collecting Mogryo's letter to Mocchi. Read that letter before triggering the remaining three ATEs or advancing the village story.
- The forest's later re-entry status is not established. Do not rely on returning for anything left behind.

### Trace and checks

1. **Forest approach:** Travel southeast around Conde Petie's cliff, enter the raised forest in the southwest clearing, and follow the Dead Forest signs by taking the branch with fewer owls: right, right, left, right. If Friendly Ladybug appears in the forest, give it 2 Ore for 20 AP and an Ether.
2. **First three ATEs:** After the party separates and Zidane regains control, view Everyday Life immediately. Take the raised plank path toward the next screen, stopping before the Chocobo Stable, and view Life On The Run. Enter the Item Shop from its rear entrance and leave through the opposite exit to view Gourmand's Nose.
3. **Mogryo's letter and final ATEs:** Return to the entrance, go to Mogryo by the northeast stable, and accept his letter for Mocchi. Then view Different Language, go to the west cemetery for Visitor, Not Invader, and enter the Synthesis Shop for Life Cycle. This completes all six local first-visit ATEs before the Inn story rest.
4. **Village pickups and hidden Black Belt:** Collect Gysahl Greens in the Chocobo Stable; the Elixir outside the Weapon Shop; the 2,000-Gil chest and 843-Gil roof pickup in the Synthesis Shop; and the hidden Ether in the Item Shop. Eavesdrop on the Black Mages from the Synthesis Shop roof, ask Item Shop owner No. 163 for “the usual,” and take the Black Belt from the upper shop area. Check ordinary shop and synthesis stock if needed.
5. **Rest and post-rest checks:** After the ATEs and chosen village sweep, approach Vivi at the Inn and choose Rest when Dagger asks. Collect Virgo beside the beds, then return to Mogryo and read the separate Stiltzkin letter that appears after the rest. Stiltzkin has no bundle for sale in this village.
6. **Chapter handoff:** Confirm the six ATEs, Mogryo's letter for Mocchi, selected pickups/Black Belt, Virgo, and Stiltzkin's post-rest letter. Leave for the world map and return to Conde Petie for the Mountain Path.

### Result

The static route follows the four owl signs, preserves the safe first-three ATE and letter sequence, views all six Black Mage Village scenes, collects Mogryo's letter for its later Iifa Tree delivery, sweeps the hidden pickups and Black Belt, completes the mandatory rest, and reads Mogryo's post-rest letter from Stiltzkin.

Whether the Dead Forest can be re-entered remains unconfirmed, and the exact full-game ATE route remains under review despite the local six-scene checklist. The specific timing of the hidden shop response is kept separate from the Life Cycle ATE. This is a source-based static trace, not emulator verification. Conde Petie Mountain Path is the next checkpoint.

## Standard route run 15 — Conde Petie Mountain Path

### Starting state

- Return from Black Mage Village to Conde Petie with Zidane, Dagger, Vivi, and Quina. Carry Mogmatt's letter for Suzuna and Mogryo's separate letter for Mocchi at the Iifa Tree.
- If holding a Kupo Nut from Moonte or Cleyra, trade it to Moguta before Suzuna's Mognet reward so the one-nut limit does not block another nut.
- Remove any gear you want Quina to keep before leaving town; Quina exits during the Mountain Path opening and Eiko joins.

### Trace and checks

1. **Second visit and Nuptial Joy:** Speak with a guard blocking the Mountain Path, then find David Heavenguard near the Inn to restart the ceremony. Choose “Why don't you guys get married, too?” for Vivi and Quina and view Nuptial Joy. Recover the Diamond from the ceremony dais if it was missed on the first visit; its reported later window extends through Disc III.
2. **Eiko and first stones:** Leave Conde Petie for the path. After Quina leaves and Eiko joins, equip Eiko with useful current gear and passives. Climb the vine to collect the Remedy chest and Blue Stone, then take the lower route, climb the next vine, and collect the Tent chest and Red Stone.
3. **Optional Oglop card:** Catch an Oglop on the path with the Action button. If pursuing its optional card, backtrack to Conde Petie and trade it to Bryan Rootrunner before continuing.
4. **Suzuna, Kupo Nut, and Stiltzkin #4:** At Suzuna's stop, buy the 666-Gil Magic Tag/Tent/Ether bundle and use Mognet to deliver Mogmatt's letter; collect Suzuna's Kupo Nut if the Key Item slot is clear. Keep Mogryo's letter for Mocchi in the mailbag, then heal/save and prepare the party for Hilgigars.
5. **Hilgigars:** Try Phoenix Down, Mythril Fork, and Fairy Flute steals. Silence prevents Curaga and Slow reduces its turns; group-cast Float protects the party from Earthquake. Do not spend an unsafe number of turns on the very rare Fairy Flute steal.
6. **Four stones and Moonstone:** After the fight, take the Yellow Stone. At the next fork, use the lower/right branch for the Ether chest and Green Stone. Return to Suzuna and insert Blue, Red, Yellow, and Green at the large statue for the Moonstone; this is one of the four Moonstone opportunities.
7. **Lucid Plains exit:** Return to the post-boss fork and take the upper route out. On the forested approach toward Madain Sari, give Friendly Yeti 2 Ore for 20 AP and an Elixir if it appears.
8. **Chapter handoff:** Confirm Nuptial Joy, the Diamond, Remedy/Tent/Ether chests, Stiltzkin's one-time purchase, Suzuna's letter handoff, the Moonstone, and any chosen Oglop card or Hilgigars steal attempt. Continue across Lucid Plains toward Madain Sari.

### Result

The static route covers the second-visit ATE, the recoverable Diamond, Quina-to-Eiko equipment handoff, all three chests, the four-stone Moonstone reward, Mogmatt's delivery to Suzuna, Stiltzkin #4, Hilgigars' steal and status strategy, and the optional Friendly Yeti. Mogryo's Mocchi letter remains distinct and is carried to the later Iifa Tree stop.

The Mountain Path's post-exit re-entry status remains unconfirmed. Hilgigars' no-weakness report is supported by most inspected references, while a single guide recommends Thunder; the route does not rely on that disputed weakness. This is a source-based static trace, not emulator verification. Madain Sari is the next checkpoint.

## Standard route run 16 — Madain Sari

### Starting state

- Continue from Lucid Plains with Zidane, Dagger, Vivi, and Eiko; Quina remains at Black Mage Village. Carry Mogryo's letter for Mocchi to the Iifa Tree.
- Save on the world map before entering Madain Sari; no save moogle is available inside. If Friendly Yeti did not appear on the previous approach, check the forested area and give it 2 Ore for an Elixir and 20 AP.
- Track all five first-visit ATEs before entering the kitchen as Zidane or agreeing to sleep. Published routes differ on the exact order and best-dinner Moogles; this trace follows the GameFAQs/Jegged/RPGClassics choices and retains the Gamer Guides alternative in the guide notes.

### Trace and checks

1. **Entry and first scenes:** Enter and let the party introduction play. View Vivi's Feelings, then collect Libra behind the fountain. Take the fountain-to-Eidolon-Wall route for Dagger's Feelings and speak with Moco; Quina's splashdown scene follows. Return to the fountain plaza for Eiko's Feelings.
2. **Cooking assignments:** During Eiko's Feelings, assign Momatose to fishing, Mocha to potatoes, and Chimomo to kitchen help. Gamer Guides assigns Chimomo to fishing and Momatose to the kitchen; these choices affect the meal/story scene, not item rewards.
3. **Tent and Eiko's Kitchen:** Open the Tent chest near the fountain bench. Go west to Vivi and try the doorway to follow Morrison toward the Eidolon Wall. Return to the fountain for Eiko's Kitchen; answer 11 people, leave the Oglop out, and choose Chimomo to cook and lend a hand. If asked about releasing the fish, tell Momatose not to release it.
4. **Eiko's Kitchen 2 and ATE check:** Speak with Dagger near the entrance, take her back to Morrison at the Wall, let her examine the murals, then leave the Wall area to view Eiko's Kitchen 2. Ask Quina for advice when prompted. Confirm Vivi's Feelings, Dagger's Feelings, Eiko's Feelings, Eiko's Kitchen, and Eiko's Kitchen 2 are all viewed before entering the kitchen as Zidane.
5. **Dinner, pickups, and coffee:** Speak to Mog and enter for dinner. After the scene, collect Ore and Phoenix Pinion from the two resting-room chests, carry Eiko's pot into the kitchen, and search the left kitchen supplies for Kirman Coffee, the second of Morrid's three coffees.
6. **Mandatory rest:** Attempt to leave the house and accept Momatose's offer to sleep. Watch the night scenes; in the morning, Eiko stays in the fourth party slot and Quina remains in Madain Sari. Collect Virgo beside the bedroom bunks.
7. **Morrison's shop and exit:** Re-enter Madain Sari and speak to Morrison for his shop. Stock Magic Tags and Softs if needed for the Iifa Tree route, then leave and make a fresh world-map save. Keep Mogryo's letter for Mocchi; there is no Mognet or Stiltzkin stop here.

### Result

The static route protects the no-save entry, all five first-visit ATEs, Libra and Tent, the Eidolon Wall story scene, the best-supported dinner choices, Ore/Phoenix Pinion, Kirman Coffee, the mandatory rest and party change, Virgo, and Morrison's post-rest shop. It keeps Mogryo's letter for the separate Iifa Tree handoff.

ATE order descriptions and the Moogle task assignments differ among guides, and whether Kirman Coffee is refreshed on a later visit is not established; collect it now. The full Eidolon Wall inscription is a separate later-disc activity. This is a source-based static trace, not emulator verification. Journey to the Iifa Tree is the next checkpoint.

## Standard route run 17 — Journey to the Iifa Tree

### Starting state

- Continue from Madain Sari after the morning rest and Morrison shop visit. Zidane, Dagger, Vivi, and Eiko are active; Quina remains at Black Mage Village.
- Carry Mogryo's letter from Black Mage Village for Mocchi inside the Iifa Tree. Mogmatt's earlier letter to Suzuna is already a separate completed handoff.
- No fixed item pickup or permanent cutoff is recorded on the overland approach. Keep at least 3 Ore available if taking the Friendly Nymph reward.

### Trace and checks

1. **Return through Mountain Path:** Leave Madain Sari, re-enter Conde Petie Mountain Path, and retrace to the main fork where Hilgigars attacked. Take the north exit to Pualei Plains rather than the earlier route back toward Conde Petie.
2. **Friendly Nymph:** Search the forest beside the Mountain Path exit for Nymph; the open plains do not produce this encounter. Give Nymph 3 Ore for 30 AP and an Emerald. Keep the Emerald for Friendly Jabberwock later. A previous greeting with Friendly Yeti changes dialogue but is not a prerequisite for this reward.
3. **Iifa Tree arrival:** Cross the plains and enter the tree when ready. Keep Mogryo's letter in the mailbag for Mocchi; the letter delivery, save point, and interior one-time chest route occur in the next chapter.

### Result

The static route uses the north Mountain Path exit, checks the forest-only Friendly Nymph opportunity, records the 3-Ore/30-AP/Emerald exchange, and carries the correct letter to the Iifa Tree. The route sources list no fixed pickup or permanent cutoff on this overland approach. This is a source-based static trace, not emulator verification. The Iifa Tree descent is the next checkpoint.

## Standard route run 18 — Iifa Tree

### Starting state

- Enter from Pualei Plains with Zidane, Dagger, Vivi, and Eiko. Keep the Emerald from Nymph for Friendly Jabberwock and carry Mogryo's letter for Mocchi.
- No save point is available at the entrance. Use the save moogle before beginning the elevator descent, and bring a Tent for the same stop.
- The inner-root branches and lower-floor chests form a one-time route. Complete the entire item sweep before defeating Soulcage and leaving the story sequence.

### Trace and checks

1. **Outer seal and Ruby:** Examine the force field and ask Eiko to break the seal. After the scene, collect the Ruby story reward, which teaches Eiko Carbuncle when equipped. Random encounters include undead Dracozombies and Zombies, plus Stropers that are vulnerable to Soft.
2. **Mocchi and the save point:** Follow the linear roots to Mocchi. Deliver Mogryo's letter through Mognet, then use a Tent and save before moving past him to the circular elevator. This is distinct from Mogmatt's delivery to Suzuna and the separate Stiltzkin letter on the later Iifa Tree visit.
3. **Upper-root sweep:** Before riding the elevator, take the second right offshoot on the next screen and activate the hidden switch; return to the previous branch for the Phoenix Down it reveals. Collect the Hi-Potion farther down. On the following screen, find the west-side switch and return for its revealed Healing Rod chest. Then search the right alcove for the disputed hidden Ether and take the lower-left branch for Lamia's Flute and the partially concealed Remedy. Confirm all six upper-root pickups before leaving the area.
4. **Fixed descent fights and lower chests:** Step onto the elevator when ready. Clear the fixed three-Zombie fight and the subsequent Dracozombie fight, then search the lower stairs for the Elixir and behind the central divider for the Brigandine. The lower chests and the boss arena are part of the one-time story route.
5. **Soulcage preparation:** Before triggering the far-left field icon and speaking to Dagger, equip Body Temp where available and check whether any active character's level is divisible by five, since Soulcage uses LV5 Death. Heat from Mustard Bomb KOs a character who takes an action while affected.
6. **Steal window and battle:** If pursuing the optional copies, have Zidane steal Oak Staff, Magician Cloak, and the rare Brigandine before ending the battle; the lower-floor Brigandine chest already provides a guaranteed copy. Avoid Fire attacks: despite the weakness, Fire triggers Soulcage's dangerous Fire Blades counter. Blind, Sleep, and Slow can help control it; after the steals, Life defeats the undead boss. The fight pays 3,800 Gil and 9 AP, no EXP, and drops Phoenix Pinion and Elixir.
7. **Story exit and optional Blue Magic:** Watch the Mist-clearing scenes and return to Madain Sari. Confirm Ruby, the eight fixed chests, Mogryo's letter delivery, and any selected steals. Quina is not in this party; if learning LV5 Death, return to the lower-root encounter screens later with Quina and Eat a Stroper or Dracozombie.

### Result

The static route records the Ruby, Mogryo-to-Mocchi delivery, Tent/save stop, both hidden switches and their revealed chests, all six upper-root pickups, the two lower chests, both fixed descent battles, Soulcage's three optional steals, and the story departure. The hidden Ether is supported by GameFAQs and EliteGrindLab but omitted by Jegged and Gamer Guides. GameFAQs describes the post-elevator route as closing after progression; EliteGrindLab distinguishes the closed chest/boss route from lower-root encounter screens that remain accessible for Quina's Blue Magic. This is a source-based static trace, not emulator verification. Return to Madain Sari is the next checkpoint.

## Standard route run 19 — Return to Madain Sari

### Starting state

- Continue after the first Soulcage sequence. Retrace through Conde Petie Mountain Path toward Madain Sari and save on the world map before entering.
- The encounter is a one-on-one Zidane fight. Use the entrance moogle's healing offer before accepting Eiko's rescue prompt.
- The two hidden-room chests and Eidolon Wall gifts are fixed pickups; Scarlet Hair's Ether/Poison Knuckles steals are optional copies with other sources.

### Trace and checks

1. **Return route and hidden room:** Take the return branch through Conde Petie Mountain Path toward Lucid Plains, save, and enter Madain Sari. Follow Eiko to her home and search the newly opened room under the kitchen for the Survival Vest and Phoenix Down chests.
2. **Eidolon Wall rewards and recovery:** Go to the Eidolon Wall entrance and ask the guarding moogle to let Zidane peek inside. Accept the Exploda and Elixir, then take the moogle's full heal before agreeing to rescue Eiko.
3. **Solo Scarlet Hair fight:** Equip Zidane defensively and keep Hi-Potions ready; he fights alone. If desired, steal the Ether and Poison Knuckles before winning. The boss also drops a Tent. Attack when Scarlet Hair is not jumping; the exact HP varies among guides, so no number or fixed turn count is assumed. The stolen items have alternate sources and are not treated as permanent losses.
4. **Memory Earring and story scenes:** After the fight, return to the hidden room under the kitchen to receive the Memory Earring from Eiko. Follow Dagger's song and the landing scene, then accept Amarant's recruitment.
5. **First party setup and departure:** Zidane is fixed; choose three of Dagger, Vivi, Eiko, and Amarant. Quina remains unavailable. Review Amarant's equipment and learnable abilities, use Morrison's shop or Momatose's healing if needed, and prepare to return to the Iifa Tree.

### Result

The static route collects both hidden-room chests and the two Eidolon Wall gifts, uses the available full heal, records Scarlet Hair's solo steal/drop opportunities without overstating their value, receives the Memory Earring, recruits Amarant, and confirms the first party selection. Scarlet Hair's HP and some movement/attack descriptions differ among guides; the route does not depend on them. This is a source-based static trace, not emulator verification. The Battle of the Iifa Tree is the next checkpoint.

## Standard route run 20 — Battle of the Iifa Tree

### Starting state

- Return from Madain Sari through Conde Petie Mountain Path and take the north exit to the Iifa Tree. On entry, review gear and choose the active party.
- Equip Insomniac where available and bring recovery options. Dagger may leave during the sequence, so do not build the descent plan around her remaining active.
- Mistodon steal opportunities occur during mandatory story fights. Sources disagree on whether the waves can be repeated by exiting and re-entering; do not count on a farming loop.

### Trace and checks

1. **Entry setup and outer roots:** Choose a prepared party and follow the outer-root path. The story carries the party up the trunk at the fourth screen; use the second party prompt at the upper perch before the forced Mistodon fight.
2. **First Mistodon battle and party change:** Try to steal Hi-Potion and Ore if these drops matter to the selected completion goals. Mistodons are undead, but finish the steals before using Life or other curative damage. After the scenes, Dagger leaves if selected; recheck the remaining party and keep Insomniac active to prevent Sleep.
3. **Mocchi and Stiltzkin's letter:** Find Mocchi behind the root after the story battle sequence. Use a Tent and save, then check Mognet and read Stiltzkin's “Blessing or Curse?” letter. This is a new Stiltzkin-to-Mocchi letter, separate from Mogryo's earlier delivery.
4. **Descent and later Mistodon fights:** Continue down the only route and handle the scripted undead encounters. Steal any desired Hi-Potion/Ore during the forced fights; do not assume an exit-and-return sequence will reproduce them. Use Insomniac against Sleep where possible and Life/curative damage after finishing steals.
5. **Aquamarine and disc handoff:** At the Leviathan statue, let Dagger receive the Aquamarine story reward, which teaches Leviathan when equipped. Continue through the scenes and save at the Disc III transition. Confirm the Stiltzkin letter and any selected enemy steals; no fixed chest sweep is listed here.

### Result

The static route accounts for both party prompts, sleep preparation, Dagger's departure, the forced Mistodon encounters and chosen steals, Mocchi's Tent/save/Mognet stop, the Aquamarine, and the Disc III transition. GameFAQs describes the story Mistodon battles as repeatable by leaving and returning; EliteGrindLab reports that the story waves cannot be farmed. This route treats repeat access as unverified and captures desired steals during the forced fights. This is a source-based static trace, not emulator verification. The Home Front is the next checkpoint.

## Standard route run 21 — The Home Front

### Starting state

- Continue from the Disc III opening. The first playable stretch is Vivi in Alexandria; finish the Vivi-only activities before accepting Ruby's play invitation.
- Hippaul's level-80 Athlete Queen reward and Stiltzkin's fifth bundle are both tied to Vivi's phase. Do not leave Alexandria's opening sequence until these are done if they are part of the selected goals.
- Keep the Kupo Nut inventory limit in mind before delivering any held Kuppo-to-Kupo letter. Read Mogrika's letter, and save with Kupo while in the steeple.

### Trace and checks

1. **Hippaul and first ATEs:** As Vivi, race Hippaul to level 80 for Athlete Queen, then view the four available ATEs: It's So Big!, Long Time No See!, To Fly High, and Artemicion. The later I Forgot! and Clowns on a Dark Night scenes wait until Vivi rejoins Zidane.
2. **Docks, steeple, and letters:** Sweep the dock stairways for Phoenix Pinion and Gil. Go up the steeple, buy Stiltzkin's fifth Phoenix Pinion/Hi-Potion/Elixir bundle for 777 Gil, save with Kupo, and read Mogrika's letter. Pull the steeple bell rope for Shiva and Ramuh cards after confirming the deck has room. Avoid a Kupo Nut exchange that would conflict with the current one-item slot.
3. **Play and summon gems:** Once the race, four ATEs, Stiltzkin bundle, letter, and bell cards are handled, meet Blank and Marcus at the mini-theater and agree to see Ruby's play. Receive Opal, Topaz, and Amethyst during Dagger's coronation scenes. Eiko's brief castle passage has no separate pickup sweep.
4. **Reunion and city phase:** When Zidane regains control, view I Forgot! on the route outside the pub, collect 2,680 Gil inside Ruby's theater, and meet Freya and Amarant at the docks. Review the party and visit the reopened Item, Weapon, and Synthesis shops before taking the gondola.
5. **Optional shuffle and final ATE:** If pursuing the supported Found in the Shuffle achievement, save before attempting nine consecutive shell-game wins with Genero/Benero/Zenero in the Weapon Shop. View Clowns on a Dark Night at its story prompt; confirm all six local ATEs before leaving Alexandria.
6. **Castle sweep and handoff:** At the castle dock, collect the Ether and Phoenix Pinion beside the bells and Lapis Lazuli behind the fountain. Sweep the West Tower approach for its Phoenix Pinion, then take Leo from the Neptune statue room before entering the castle story sequence. This moves the party to Treno for the tournament chapter.

### Result

The static route protects Hippaul's level-80 reward and Stiltzkin #5, covers the six local ATEs across both party-control phases, reads Mogrika's letter, collects the steeple cards and castle-side pickups, receives Dagger's three summon gems, and checks the shop/shuffle windows before the Treno transition. Exact Gil placement and the broader Alexandria cutoff wording differ among guides, so the route completes every local errand before advancing. This is a source-based static trace, not emulator verification. Card Tournament is the next checkpoint.

## Standard route run 22 — Card Tournament

### Starting state

- Continue at Doctor Tot's house in Treno after the coronation. The tournament's final match advances the story; preserve every local ATE and the Dali Key/Burman Coffee detour first.
- Choose whether Vivi stays in Treno or visits Quan's Dwelling. This choice determines one mutually exclusive ATE and affects the round-two opponent/Namingway Card opportunity.
- Do not start round three until all nine ATE slots, Dali's one-time key and coffee sweep, and selected Treno side activities are finished.

### Trace and checks

1. **Arrival ATEs and branch:** View Eiko Talks Life, then How He Ended Up Here. Choose whether Vivi stays in Treno or goes home to Quan's Dwelling. Continue down the tower route for Memories by the Water, then reach the Card Stadium screen and view City People. Collect the Chimera Armlet after the ATE. If Vivi stays, view Hippo's Prize before entering the stadium; the home branch's Home Sweet Home appears after the first win.
2. **Tournament rounds one and two:** Register with the card seller and win the first two matches. After round one, exit the stadium and view Good Old Days; answer that Zidane is interested in Amarant's past, then change screens to view Lessons of Life. If Vivi went home, view Home Sweet Home when available. If Vivi stayed and Hippo's Prize was seen, try to win Mario's Namingway Card in round two.
3. **Narrow post-round-two ATEs:** Immediately after the second win, exit the stadium and view Hallucination before changing screens; then move to the next screen and view Premonition. These, the earlier scenes, and the selected Vivi branch complete the nine-slot chapter ATE set. Do not go to Quan's Dwelling early on Zidane while any Treno ATE remains.
4. **Quan's Dwelling and Dali detour:** If Vivi took the home branch, visit Quan's Dwelling now to rejoin him. Travel to Dali through South Gate. In the Mayor's House, repeatedly inspect the desk to obtain Mini-Brahne and wait for the child to fall asleep, then inspect the heater for Mayor's Key. In the windmill, climb for Cachusha and Elixir, unlock the rear door, take 30,000 Gil, and inspect the chest again to collect Burman Coffee. If Moccha and Kirman are also in Key Items, visit Morrid on Observatory Mountain to complete the coffee quest.
5. **Treno side stops:** Return to Treno and save with Mogrich. Read any available letter, especially Mogrika's if Athlete Queen was earned. Complete any desired Catoblepas challenge and steals before collecting its 15,000-Gil reward; visit Queen Stella with Leo and other coins, check auction stock such as Dark Matter, and do needed shop/synthesis shopping.
6. **Final match and transition:** Before the champion, confirm the ATEs, Chimera Armlet, optional Namingway Card, Mognet letter, Mini-Brahne, Mayor's Key, Burman Coffee, and selected side stops. Save with Mogrich, then play the third match for the early Rebirth Ring if desired. Continue the tournament scenes to the Alexandria response.

### Result

The static route protects the mutually exclusive Vivi ATE branch, the nine-slot Treno ATE route, City People's Chimera Armlet, the post-round-two Hallucination/Premonition order, Dali's Mini-Brahne/Mayor's Key/Burman Coffee window, and the optional Namingway/Card Tournament prize and Treno activities before the final match. Losing the last match can still advance the story, and the Rebirth Ring has later sources; this trace does not label it permanently missable. This is a source-based static trace, not emulator verification. Trouble on the Home Front is the next checkpoint.

## Standard route run 23 — Trouble on the Home Front

### Starting state

- Continue after the tournament and Alexandria attack scenes. The first control section is Dagger in the castle; the defense assignments happen once.
- Assign all four Knight pairs correctly to receive the best reward, Angel Earrings. The reward ladder's intermediate values are source-reported rather than tested here.
- Later in the chapter, Tantarian is available only if it was skipped during the Disc II castle rescue. Save before entering the library.

### Trace and checks

1. **Knights of Pluto orders:** Assign Blutzen and Kohel to gather information, Weimar and Haagen to protect townspeople, Breireicht and Laudo to contact Lindblum, and Dojebon and Mullenkedheim to prepare the cannons. Take Beatrix's reward; all four correct pairs yield Angel Earrings.
2. **Steiner and Beatrix defense:** When control shifts to Steiner, review his gear and set Insomniac/Undead Killer if available. Beatrix is a temporary party member; remove any valuable or limited-copy Add-Ons before she leaves, while keeping her fixed Save the Queen weapon in mind. Defeat the seven scripted Mistodon encounters, with the final four battles back-to-back. Mistodons are undead, so Beatrix's Life can end them quickly after any desired actions.
3. **Dagger's route to the altar:** Follow the castle route through the balcony, left-side passage, and newly opened path to the altar. Watch the Alexander defense scenes; control then returns to Zidane's party in the castle.
4. **Final Tantarian window:** Save with Mosh in the second-floor Guardhouse. If Tantarian was not defeated during the Disc II rescue, inspect the lower-left standing bookshelf in the main-floor library and fight it now before leaving for the altar. Try for Ether, Elixir, Silver Fork, and Demon's Mail steals, then earn Running Shoes and the Ramuh Card. Tantarian will not appear again after the library window closes.
5. **Story handoff:** If Tantarian was already defeated, skip the library fight and follow the altar route. Otherwise, complete the encounter before continuing. The story moves the party to Lindblum Grand Castle for the next chapter.

### Result

The static route earns the all-correct Knights reward, preserves useful gear from temporary Beatrix, follows all seven Mistodon fights, and places the final Tantarian opportunity after the Alexander scenes and before leaving the library area. The intermediate Knights reward ladder is supported by Jegged and EliteGrindLab but not stated by every source; the Ramuh Card's later recovery path remains under review. This is a source-based static trace, not emulator verification. The Aftermath is the next checkpoint.

## Standard route run 24 — The Aftermath

### Starting state

- Continue in Lindblum Grand Castle after Alexander's defense. Start in the guest room with Zidane and read Mogki's letter for Moodon.
- This chapter has eight ATE slots with prior-scene and Gil conditions. Choose “Where's Dagger?” when Blank stops Zidane, then complete the telescope sequence before entering the throne room.
- Keep the three Tantalus Hideout Gil chests closed until Give Me My Money triggers aboard the Blue Narciss. The potions must be delivered to Cid while Zidane has fewer than 50 Gil for the full ATE route.

### Trace and checks

1. **Guest-room order and castle pickups:** Open the Elixir and Egoist's Armlet chests, accept Mogki's Moodon letter, and save. When Blank blocks the stairs, choose “Where's Dagger?” and leave the room. View Something Washed Ashore if it appears; it requires Hallucination from Treno.
2. **Base Level and telescope ATE:** Take the trolley to Dragon's Gate for the Remedy and Serpent's Gate for the Chimera Armlet, then return to the Upper Level. Speak with Dagger at the telescope for My Bad before entering the throne room or speaking to Blank a second time.
3. **Cid's meeting and business district:** Meet Blank and continue to the Royal Chamber. View Self-Reproach and Deep Anger, follow the prompt to find Dagger in the guest room, and take My Hammer when it appears after the meeting. Deliver Mogki's letter to Moodon at the Business District inn; collect Sagittarius, the refreshed Card Freak Gon Elixir/Remedy chests, and Alice's Beautiful Potion. Shop if needed, while keeping control of Gil.
4. **Theater District potions:** If Kal and Wei were rescued in Burmecia, view The Rally. Collect the Lapis Lazuli in Michael's studio and the Strange Potion near the stairs; collect the Unusual Potion from Cinna at the Tantalus Hideout. Leave its 1,273-, 970-, and 4,826-Gil chests closed.
5. **Under-50-Gil setup and No Free Lunch:** Before returning the three potions to Cid, spend or sell down to fewer than 50 Gil. Return to the Royal Chamber and deliver the potions. Leave and view No Free Lunch if it appears; its availability depends on the earlier Something Washed Ashore event.
6. **Quina and ship departure:** Keep fewer than 50 Gil, visit the Business District town square to trigger Quina's scene, then return to the castle Base Level and board the Blue Narciss at Serpent's Gate. Give Me My Money triggers aboard the ship. Only after it has played should you return in the next chapter for the three Tantalus Gil chests.

### Result

The static route sweeps the castle and city pickups, completes the Mogki-to-Moodon delivery, collects Sagittarius and all three potions, tracks the eight ATE conditions, preserves the under-50-Gil threshold, and boards the Blue Narciss for Give Me My Money. GameFAQs and Jegged both place the final Gil chests after that ship ATE; the next chapter contains the safe return pickup. This is a source-based static trace, not emulator verification. On the High Seas is the next checkpoint.

## Standard route run 25 — On the High Seas

### Starting state

- Continue aboard the Blue Narciss after Give Me My Money has triggered. Set the party with Regent Cid; keep Quina active for the marsh and Blue Magic circuit.
- Return to the Theater District and collect the three Tantalus Hideout Gil chests only now. If Give Me My Money did not trigger, leave them closed and preserve its under-50-Gil condition.
- The chapter is an open-world route with optional sidequest branches. Complete any selected detours before heading to Black Mage Village and advancing the story.

### Trace and checks

1. **Post-ATE Gil and party:** After the ship ATE, collect 1,273, 970, and 4,826 Gil from the Tantalus Hideout if still unopened. Set Quina in the party for the third frog pond and regional Blue Magic; the ship allows further party changes between stops.
2. **Marsh and Blue Magic detours:** Visit Lanar Island's Qu's Marsh and preserve at least one male and one female frog plus the golden frog. If missing, pursue Quina's available regional skills: Earth Shake, Bad Breath, Auto-Life, Roulette near the Iifa Tree, LV5 Death from a Whale Zombie, and LV4 Holy from a Feather Circle. Use the enemy-by-enemy reference and skip any skill Quina already knows.
3. **Kupo Nut and Esto Gaza:** If carrying a Kupo Nut, return to Moguta in Gizamaluke's Grotto for the Extension reward. Then land on the Lost Continent's southern beach and visit Esto Gaza. Buy any desired gear and any Mythril Sword quantity required by the chosen inventory plan; the current five-sword synthesis target uses this last documented shop window before later story progression removes the stock.
4. **Alexandria ruins and Kuppo letter:** Sweep the accessible harbor, town, and Steeple for the listed gemstones, Gil, Remedy, Ether, Tent, and Alexandria Card. If Kuppo's letter is still in the mailbag and the one-Nut inventory slot is empty, deliver it to Kupo for the Kupo Nut reward. Do not attempt to enter the closed castle.
5. **Chocobo progression:** With Reef ability, unlock Chocobo's Lagoon and collect the available Forest/Lagoon maps and treasures. Gain Mountain from Chocograph #12, then Ocean from #14; collect the newly reachable treasure maps and four current Dive Spots. Use Dead Pepper at Mountain Crack #1 only after Mountain ability is learned. Keep dug maps and recovered treasure objectives separate, and leave inaccessible treasure coordinates for later chapters.
6. **South Gate and Treno checks:** Revisit Bohden Arch for the wagon chest and any Multina Racket left behind; sweep the valley-level South Gate for its Elixirs and Gil. Check Treno's updated auction stock and buy only selected items within the planned Gil reserve.
7. **Story handoff:** Finish selected optional travel and Chocobo detours, then sail to the Outer Continent and continue to Black Mage Village. The next chapter picks up the trail toward the Desert Palace.

### Result

The static route preserves the Give Me My Money Gil condition, completes the optional Lanar frog and Quina skill checks, delivers any ready Kupo Nut/letter reward, checks Esto Gaza's Mythril Sword window, sweeps Alexandria's accessible ruins, advances Chocobo's Reef-to-Ocean access and current Dive Spots, and revisits the available South Gate and Treno stops before returning to the story. Chocograph digging and treasure recovery remain distinct, and this broad optional route is not a timed itinerary. This is a source-based static trace, not emulator verification. Picking Up the Trail is the next checkpoint.

## Standard route run 26 — Picking Up the Trail

### Starting state

- Continue from the Blue Narciss route and return to Black Mage Village. If any Friendly Creatures through Nymph were postponed for a later party's AP, their earlier locations are still available before the sinkhole sequence.
- No. 288's directions require two village conversations: cemetery first, then the Chocobo stable. Complete any desired free-roam and equipment preparation before using the story sinkhole.
- The correct sandpit begins a temporary story lock-in. The sources do not establish that it permanently removes every unfinished optional activity.

### Trace and checks

1. **No. 288 directions:** Speak with No. 288 at the cemetery, then again at the Chocobo stable. Travel to the four sandpits on the far eastern side of the Outer Continent; the southern beach is a convenient landing spot, and a Mountain Chocobo can also reach the area overland.
2. **Pre-entry sweep:** Finish selected world-map stops and distribute equipment/Add-Ons before committing. Do not rely on a non-Zidane character keeping a piece another party may need. The desert has four sinkholes; entering any wrong pit starts an Antlion battle and allows you to return to the map.
3. **Choose the story sinkhole:** Enter the pit with no sand rising from it. After the scenes, select three characters to join Zidane for Oeilvert; the four not selected form the Desert Palace team. Free movement pauses during this two-party sequence.
4. **Plan the two teams:** Use a physically capable Oeilvert group because Black, White, Summon, and Blue Magic are sealed there. Keep reliable mages and a healer in the Desert Palace party; Quina's LV5 Death can handle many ordinary enemies there but not its boss. A common split is Zidane/Dagger/Freya/Amarant for Oeilvert and Steiner/Vivi/Eiko/Quina for the Desert Palace, adjusted for learned abilities and current gear. Equip Locomotion and Insomniac where available.
5. **Hilda Garde handoff:** Board the Hilda Garde and continue through the story scenes to the Forgotten Continent. The next route begins at its landing point and carries the Oeilvert party to the Gulug Stone.

### Result

The static route obtains No. 288's directions, checks delayed Friendly Creature rewards, avoids the three false sinkholes unless their Antlion encounters are wanted, and commits only after the open-world and equipment sweep. It treats the lock-in as temporary and prepares both party rosters for Oeilvert's anti-magic seal and the Desert Palace's magic-dependent route. This is a source-based static trace, not emulator verification. Forgotten Continent is the next checkpoint.

## Standard route run 27 — Forgotten Continent and Oeilvert

### Starting state

- Land at Blairsurpass Plains with the four-person Oeilvert party and the remaining four characters assigned to the Desert Palace. The Hilda Garde has a basic item shop.
- Resolve selected Chocobo, Frog Catching, and Friendly Creature detours before the Oeilvert route. Oeilvert disables magic and its local Stiltzkin purchase is a one-time window.
- The Gulug Stone triggers Ark and closes the Oeilvert story route. Finish the Mognet, Stiltzkin, shop, and eight-chest checks first.

### Trace and checks

1. **Forgotten Continent detours:** If Quina was assigned to Zidane's party, visit the northern Qu's Marsh and preserve a male/female pair and any golden frog. With Mountain ability, collect Chocograph #15 and #16 treasures if their maps were found earlier, then open both Mountain Cracks by their landmarks; their #2/#3 labels differ across sources. In the Seaways Canyon forest, give the friendly Jabberwock an Emerald for 40 AP and a Moonstone. Do not spend the Emerald first if this reward is part of the route.
2. **Mimoza's shop and letter:** At Oeilvert, check Mimoza's Mogshop for useful equipment for both teams and accept her letter for Mooel. Save and use a Tent outside before entering; shop availability after the story sequence is described differently, so buy before committing.
3. **Stiltzkin and first chests:** From the entrance hall, go east before opening other rooms and buy Stiltzkin's sixth 888-Gil Hi-Potion/Emerald/Elixir bundle. Deliver Mimoza's letter to Mooel for a Kupo Nut if the inventory slot is available, and open the Gaia Gear chest opposite them. Return to the entrance for the Remedy under the stairs and the Rising Sun above.
4. **Orb and planetarium sweep:** On the west route, touch the blue orb and open the Elixir chest behind it. Approach the floor circle from the south for the planetarium hologram, then collect Diamond Sword and Shield Armor. In the lower room, collect Power Vest and Feather Boots; activate the four lights in order: upper-left, upper-right, lower-right, lower-left.
5. **Face room and save:** Follow the opened light route to the large orb, view its hologram, and continue to the faces-room scene. Return to Mooel for a Tent and save; Stiltzkin is gone, but Mooel remains available for recovery.
6. **Ark fight:** Equip Clear Headed against Confuse, Bird Killer, and any available Wind protection. Magic commands do not work under Oeilvert's seal. Zidane may steal Elixir, Power Vest, and Holy Lance. Ark is level 38 with 20,002 HP; Photon leaves a target at 1 HP, Whirlwind inflicts Float, and Propeller can cause Confuse. Defeat it with physical/non-magic abilities; it drops Pumice Piece and Ether. Equip Pumice Piece on Dagger and Eiko in turn if teaching Boost to both is a goal.
7. **Gulug Stone cutoff:** Before taking the Stone, verify all eight location chests: Remedy, Rising Sun, Elixir, Gaia Gear, Diamond Sword, Shield Armor, Power Vest, and Feather Boots. Confirm Stiltzkin #6, Mimoza's letter, the party gear handoff, and any selected steals; then take the Gulug Stone to move the story to the Desert Palace.

### Result

The static route covers the Forgotten Continent's optional frog/Chocobo/creature rewards, Mimoza's shop and letter, Stiltzkin #6, all eight Oeilvert chests, the anti-magic switch puzzle, Ark's three steals and mechanics, and the Gulug Stone point of no return. The two Mountain Crack numbering schemes conflict, so the route uses landmarks and reward sets. GameFAQs and other guides differ on how long the Mogshop remains available; the route buys needed gear before entering. This is a source-based static trace, not emulator verification. Desert Palace is the next checkpoint.

## Standard route run 28 — Desert Palace

### Starting state

- Continue immediately after taking the Gulug Stone at Oeilvert. The story shifts to Cid and the four characters assigned to Kuja's Desert Palace; the four Oeilvert characters are not available for this section.
- Cid's escape puzzle has a six-minute timer. Complete the stealth and scale sections to free the party; there is no score prize for a fast or clean attempt.
- Mojito's and Mogsam's letter/Kupo Nut handoff has to respect the one-Kupo-Nut inventory limit. Keep a held nut or the Mognet delivery in mind before accepting another reward.

### Trace and checks

1. **Cid's escape and party preparation:** Follow the south/east route into the Hourglass Key minigame. Creep forward only while the Hedgehog Pie is looking away; at the scales, add Clay, Stone, and Iron but leave Wood off. After freeing the party, review the actual four-character roster, equipment, status protection, and abilities before entering the maze. The prescribed Oeilvert split is flexible; no fixed Desert Palace lineup is required.
2. **Mojito, shop, and first stone:** Before entering the main palace, visit Mojito on the right for the Mogshop and his letter for Mogsam. In the lobby, light the left candle and collect the Promist Ring from the revealed bloodstone. This first stone suppresses Valia Pira's elemental-resistance enhancement.
3. **Light and Fire Chambers:** In the statue room, run past the right statue and then the left to raise the light staircase; light the upper candle and return for the Fairy Earrings chest below. In the Fire Chamber, follow the candle/statue sequence to the Anklet stone, then light the single easy-to-miss hallway candle for Shield Armor. Light the upper candle at the camera turn to open the library route.
4. **Library, Mogsam, and remaining stones:** Light the rear-left library candles to move the bookshelf and take the N-Kai Armlet stone. Complete the middle-level, upper stair, lower-floor, and hidden-bookshelf candle route to reveal Mogsam. Tent and save there. Deliver Mojito's letter only when the Kupo Nut slot is clear if the nut reward is wanted; otherwise defer delivery for the later return route. In the Shadow Chamber, collect the Black Hood and Venetia Shield stones, then use the final candle route to prepare for the boss.
5. **Optional Blue Magic and boss gate:** If Quina is in this party, attempt Vanish from Drakan, Night from Grimlock, Matra Magic from Ogre, and LV4 Holy from Torama before defeating the enemies. Return to Mogsam for another Tent/save and equip Body Temp and Bird Killer where available. Confirm all six stones—Promist Ring, Anklet, Shield Armor, N-Kai Armlet, Black Hood, and Venetia Shield—before triggering Valia Pira.
6. **Valia Pira and return to Zidane:** Defeat the magic-focused security boss. The six stones reduce its opening enhancements; no steal window is listed. GameFAQs and Flactem list an Elixir reward from the fight, with Flactem also reporting a possible Ether. Published HP and weakness data conflict, so this trace relies on the stone puzzle, Heat/Freeze protection, healing, and reliable attacks rather than exact stat claims. Afterward remove any gear Eiko should not retain, use the teleporter, and follow the scenes back to Zidane.
7. **Card, deferred Mognet, and departure:** After the party prompt, inspect the table in Kuja's quarters and collect Namingway Card if the shared objective is still open. If Mojito's letter was deferred for a Kupo Nut, use the northeastern teleporter to return to Mogsam once the slot is free. Before lowering the exit ladder and leaving by the dock, verify the Fairy Earrings chest, all six stones, the card, and any selected Mognet handoff. Leaving places the Blue Narciss near the Lost Continent.

### Result

The static route passes Cid's two-part escape, the Desert Palace shop and letter, six bloodstone rewards, the sole ordinary chest, the Mogsam save/Kupo Nut constraint, optional Quina skills, Valia Pira, the Namingway fallback, and the deferred-letter route before departure. GameFAQs confirms the puzzle sequence, all bloodstones, the Fairy Earrings chest, and the card on Kuja's table; its detailed Valia Pira stats and weakness are not treated as settled because the local source register records conflicts. This is a source-based static trace, not emulator verification. Lost Continent is the next checkpoint.

## Standard route run 29 — Lost Continent and Mount Gulug

### Starting state

- Continue from Desert Palace after the Blue Narciss moves to the Lost Continent. Use the open-world window for selected optional checks before the story route through Esto Gaza.
- Vivi must be in the active party for the Esto Gaza story; Eiko is unavailable until the Mount Gulug sequence. If Quina is selected for optional skills, include them in the party.
- Mount Gulug is a one-pass story dungeon. Finish its local pickups, Mognet handoffs, fixed encounters, and selected Blue Magic before entering the broken wall and fighting Meltigemini.

### Trace and checks

1. **Field detours and party:** If selected, visit the snowy-field Friendly Feather Circle for the Moonstone trade (Lapis Lazuli and 30 AP) and learn LV4 Holy from ordinary Feather Circles or LV5 Death from Whale Zombies with Quina. Keep the Friendly Creature and ordinary encounter identities separate. Clear any held Kupo Nut at Moguta in Gizamaluke's Grotto before accepting another nut reward.
2. **Esto Gaza:** Enter the central building with Vivi for the story scene. Use the restocked shop to buy Vaccines and any goal-relevant equipment; GameFAQs and RPGClassics list Octagon Rod as the only equipment source for Firaga, Blizzaga, and Thundaga in their PlayStation ability tables. One retained copy teaches all three spells, and Daguerreo remains another Disc III purchase opportunity. Collect the hidden Wing Edge behind the counter. In the back, read Artemicion's letter from Mogrika, accept her letter for Moolan, then save before entering Mount Gulug. The shop remains available later in Disc III, so this stop is a stock checkpoint rather than the last chance to shop.
3. **Upper Mount Gulug sweep:** At the entrance fork, clear the left building for 9,693 Gil and Ether, then take the outside ladder down for the hidden Red Hat. In the right building, jump past the well to the Golden Hairpin chest and return without descending. The isolated 9,963-Gil route typo is contradicted by the same guide's item listing and independent routes; use 9,693 Gil.
4. **Moolan and the first dragon pair:** Descend the well, deliver Mogrika's letter to Moolan, accept Moolan's letter for Mogtaka, and claim the optional Kupo Nut only if the inventory slot is free. Search the bottom-right corner for the hidden Wing Edge, then follow the right-hand platforms to Gaia Gear. On the return, use Quina's Eat on Wraith (Blue) for Frost and Worm Hydra for Bad Breath if either is still missing; Eat a Red Dragon for Twister during the fixed pair before the battle ends. Heal/save as needed, then collect Demon's Mail from the building off the left path. GameFAQs' Memoria walkthrough explicitly confirms a later recovery from the revived Tiamat in Crystal World, so this local Red Dragon window is the earlier opportunity rather than the final chance to learn Twister.
5. **Mogtaka, solo dragon, and lower route:** Deliver Moolan's letter to Mogtaka and check the Mogshop/save point. In the next building, defeat the solo Red Dragon rather than fleeing, then take the Elixir chest that follows the fight. Return to Mogtaka to Tent/save, go back to the well, pull the lever down three times, and descend to the final fixed Red Dragon pair. Attempt Twister here if Quina still needs it; if missed in Mount Gulug, use Eat on the revived Tiamat in Crystal World before Deathguise.
6. **Ribbon and Meltigemini:** Before crossing the broken wall, confirm the local sweep and equip Antibody where available. The story gives Eiko Mog's Ribbon automatically and sets her up to learn Madeen; this is not a dungeon chest. During Meltigemini, Zidane may steal Vaccine, Golden Hairpin, and Demon's Vest before ending the fight. Keep Vaccines ready for Virus and Antibody for Venom/Poison; then defeat the boss. A route source labels the rare armor steal Demon's Mail, but the independent tables agree on Demon's Vest, while Demon's Mail is separately collected from a chest.
7. **Lindblum return:** After the story returns the party to Lindblum, speak to Mogki and check Mognet for the letter to Kumool, then follow the forced scenes and view the Team and Recovery ATEs. Take Garnet, equip it to Dagger so she can learn Bahamut, and select the active party for the Hilda Garde 3. Recheck the party's equipment and any selected Mognet objectives before beginning the free-flight Aerial Exploration chapter.

### Result

The static route covers the Friendly Feather Circle and optional field skills, Esto Gaza's story/shop/hidden pickup/Mognet, Mount Gulug's treasure and letter route, Quina's Frost/Bad Breath/Twister learning opportunities, each fixed Red Dragon encounter, the automatic Ribbon, Meltigemini's steals and status threats, and the Lindblum story/ATE/summon handoff. Jegged's Mount Gulug route corroborates the 9,693 Gil, upper and hidden pickups, Red Dragon fights, Elixir-after-solo-dragon condition, three lever pulls, automatic Ribbon, Meltigemini steal set, and Lindblum return. This is a source-based static trace, not emulator verification. Aerial Exploration is the next checkpoint.

## Standard route run 30 — Aerial Exploration

### Starting state

- Continue at Lindblum after Mount Gulug with the Hilda Garde 3 available. The story does not force an immediate visit to Ipsen's Castle; this is a broad optional travel window.
- The airship lands on grass, while the Sky Chocobo reaches forests and the moving Air Garden. Switch party members on the bridge as optional activity requirements demand.
- Some shop and ability goals have later gates. In particular, check Daguerreo's Disc III gear and learn desired abilities before the later Shimmering Island portal transition; do not treat that portal as part of this chapter.

### Trace and checks

1. **Airship orientation and pickups:** Fly the Hilda Garde for the first time, then land at Lindblum Castle to collect the outer-deck Elixir; the lower-hold Tent is available wherever the ship is parked. Use the bridge sailor to change party and Erin to fly. This completes the first-flight achievement condition on Steam; the ship itself is story-granted and not a missable.
2. **Grotto, Garuda, and frogs:** If holding a Kupo Nut, turn it in to Moguta before taking another. Climb to Popos Heights and give Friendly Garuda a Lapis Lazuli for 40 AP and a Diamond. Preserve that Diamond for Friendly Yan; do not give it to a Gimme Cat. With Quina, visit the four Qu's Marsh ponds as needed, preserving a breeding pair and the golden frog when practical; save before a final catch that reaches 99.
3. **Ragtime Mouse:** Check the remaining quiz count and finish up to all sixteen questions correctly if the selected profile wants the full result. Once all are answered, find Ragtime Mouse again for the final reward; at least thirteen correct answers are the threshold cited for Protect Ring. Use the separate answer reference rather than guessing.
4. **Sky Chocobo and Air Garden:** With Ocean ability, dig the six available Chocograph fragments in the Forest/Lagoon until #20 (Mist Ocean) is complete, then find its world-map treasure to unlock Sky. Chocograph #22 (Outer Island 2) is an Ocean-ability Lagoon map; collect its treasure if still open. Use the moving black shadow and a Dead Pepper to enter the Air Garden, then dig its three maps (#21, #23, and #24) and collect their world treasures. Sources disagree whether there are five or six candidate locations, so follow the shadow rather than a fixed count.
5. **Friendly Yan and optional stops:** After all eight earlier Friendly Creatures have been helped, take the Diamond to the forest on Vile Island for Yan's Rosetta Ring and 50 AP; save before roaming there because ordinary Yans are dangerous. Visit Quan's Dwelling with Vivi and Quina for the Running Shoes, Treno's post-Gulug Amdusias for the second Running Shoes, and Queen Stella for the available Stellazzio turn-ins. Chocobo's Paradise is accessible with Sky but its final Dive Spot waits until Disc IV.
6. **Daguerreo and shop audit:** Land at Sacrobless Island, collect Capricorn, and save before any card wins you still need from the Four-Armed Man. After the treasure sweep, check your Treasure Hunter rank and collect the Rank S Medal by the entrance if awarded. Search the library area for both Elixirs and the Aquamarine exchange, then fix the lower hydrolift to reach the weapons shop. Buy and learn any goal-relevant Disc III stock before entering the later Shimmering Island portal; the sources disagree on the complete list of final ability-teaching equipment, so use the chapter's compared inventory notes rather than assuming one guide's list is exhaustive. The card dialogue/item disagreement also remains open.
7. **Reopened shops and story gate:** Check Black Mage Village's reopened Item and Synthesis shops for goal-relevant gear. The optional Cotton Robe Gil loop is available if needed, but do not treat it as a completion objective. Carry Mogki's letter to Kumool if it was accepted in Lindblum. Once chosen world-map checks are complete, fly to Ipsen's Castle; the remaining optional quests can be handled later when their access conditions permit.

### Result

The static route checks the airship's location-specific Elixir and portable Tent, Friendly Garuda's Diamond reservation, all-marsh Frog Catching, Ragtime Mouse's remaining quiz, Sky Chocobo and Air Garden access, the Friendly Yan prerequisite chain, the two Running Shoes, Queen Stella, Daguerreo pickups/shop, reopened Black Mage Village stock, and Mogki's letter handoff. The story remains open throughout this sweep; the later portal is the shop-stock gate. GameFAQs confirms the airship and sidequest availability, Garuda's Lapis Lazuli-to-Diamond reward, the two Running Shoes routes, and the Sky Chocobo/Air Garden progression. This is a source-based static trace, not emulator verification. Ipsen's Castle is the next checkpoint.

## Standard route run 31 — Ipsen's Castle

### Starting state

- Continue from the selected Aerial Exploration checks with Mogki's letter for Kumool if carrying it. Land at the northwestern Forgotten Continent castle.
- Zidane is mandatory. Amarant leaves regardless of the dialogue choice, so choose the other three characters for the castle party.
- Equip each physical attacker with a weak weapon before entering. The Attack command's weapon-power relationship is reversed inside; abilities and magic keep their normal damage rules.

### Trace and checks

1. **Entry and preparation:** Approach the entrance, resolve Amarant's leave-alone conversation (either answer has the same result), and set the party. Review weak weapons, Soft items, HP/MP, and abilities before going inside. A suggested formation is not required, and there is no supported minimum level.
2. **Foyer and Kumool:** Take the Dagger chest by the left entrance and Aquarius behind the right-side pillar. In Kumool's room, deliver Mogki's letter if available; receive a Kupo Nut only when the one-item inventory slot is open. Tent/save, check the Mogshop for supplies or second-weakest weapons, and take Cat's Claws from the back corner before using the pole.
3. **Optional Quina skills:** During the castle's encounters, Quina can Eat Cerberus for Auto-Life, Gargoyle for Mighty Guard, and Veteran for Doom. The castle can be revisited, so these skills do not require bringing Quina for the whole first route. Use Soft to remove Gargoyles and do not let a Tonberry reach its lethal Knife attack if the fight is taking too long.
4. **Ladder weapons and fresco:** Follow the ladder branches for Javelin, Broadsword, and Rod. At the fresco, choose Examine, Push, Pound, Think, Push, Pound, Try Something Drastic, then Rest. Take Barette from the opened passage before returning to the elevator room.
5. **Mirrors and Taharka:** In the mural room, collect the Fire, Wind, Earth, and Water Mirrors. Check the party and weak-weapon setup before trying to leave; Taharka attacks at that point. Zidane can attempt Elixir, Mythril Claws, and Orichalcon steals during this one-time encounter. The weakness/status plan and inverted basic-attack rule are documented; disputed HP precision is not used. The item types have later sources, so do not risk the party with endless steal attempts.
6. **Post-boss treasure sweep:** Return to Kumool's room and take the trapdoor route to Maiden Prayer. Revisit the fresco stair for Air Racket, then ride the lift for Golem's Flute. Move the two pots counterclockwise until the sword's energy reaches Ancient Aroma, which teaches Dagger Odin's Sword. Return via the pole for Mage Staff and Fork from the chandelier.
7. **Amarant reunion:** Exit the castle once and watch for the story scene. Re-enter as Zidane alone, return to Kumool's room, slide to the lower room, and search the southern foreground for Amarant. Talk to him, leave together, and review the party's weapons; restore normal equipment in the following shrine chapter.

### Result

The static route records the weak-weapon setup, Amarant's mandatory temporary departure and solo recovery, Kumool's letter/shop/save and Kupo Nut constraint, all route pickups, Quina's three skills, the fresco sequence, four mirrors, Taharka's nonrepeatable steals, and the post-boss treasure sweep. GameFAQs and Jegged corroborate the inverse weapon rule, the ladder/fresco/mirror route, and the solo Amarant return; the castle itself remains revisitable after the story. This is a source-based static trace, not emulator verification. Breaking the Seal is the next checkpoint.

## Standard route run 32 — Breaking the Seal

### Starting state

- Continue after Amarant rejoins at Ipsen's Castle. Zidane and Quina are assigned together to the only playable shrine; restore their normal weapons after the castle's reversed Attack rule.
- Quina needs a current equipment/ability check. If Doom is missing, Ipsen's Castle remains accessible for a return visit with Quina; the Blue Magic detour is optional.
- The Water, Fire, and Wind shrine scenes are fixed party drop-offs. The Earth Shrine is the only player-controlled shrine route and leads directly into the one-time Earth Guardian fight.

### Trace and checks

1. **Loadout and optional prep:** On the Hilda Garde, replace the weak Ipsen weapons, equip Quina's abilities and gear, and choose whether to finish optional Frog Catching or a Kupo Nut delivery to Moguta. If Quina still needs Doom, return to Ipsen and Eat a Veteran before the shrine route; do not bring Quina solely for this if other plans are preferred.
2. **Water, Fire, and Wind drop-offs:** Fly to the Water Shrine south of Ipsen's Castle and leave Dagger/Eiko; fly to the Fire Shrine north of Esto Gaza and leave Freya/Amarant; fly southeast of Oeilvert to the Wind Shrine and leave Steiner/Vivi. The assignments are story-fixed and these are map scenes, not playable shrine dungeons.
3. **Earth Shrine approach:** Land southwest of the Desert Palace on the Outer Continent. Keep Zidane and Quina active; equip Earth protection such as Gaia Gear, Feather Boots, or Auto-Float where available. Auto-Reflect and Devil Killer are optional supports. Move through the corridor and answer both closing-wall jump prompts when their field icons appear.
4. **Mirror and Earth Guardian:** Place the Earth Mirror to start the boss immediately. Zidane can attempt Avenger and Rubber Suit steals; both have later item sources, so stop stealing if survival suffers. Earth Guardian absorbs Earth and is vulnerable to Wind/Holy and statuses. Quina can use Bad Breath or Night with Insomniac equipped to protect the party from its own Night, and can Eat the weakened Guardian for Earth Shake if missing it. The fight awards a Phoenix Pinion.
5. **Airship regroup:** After the Guardian, follow the shrine scenes and choose the active party again aboard the Hilda Garde. Save and pause in Gaia's open world; completing the shrines does not force the Terra transition. Move to Preparing to Leave for the final Disc III checklist.

### Result

The static route restores the Ipsen loadout, records any optional Quina/Kupo/Frog checks, follows the three fixed party drop-offs, prepares Zidane and Quina for the Earth corridor, and handles the one-time Earth Guardian steal/Blue Magic window without turning optional steal attempts into a required risk. Jegged's shrine walkthrough corroborates the required loadout reset, Quina preparation, fixed shrine route, Earth Guardian steals/drop, and post-battle open-world pause. This is a source-based static trace, not emulator verification. Preparing to Leave is the next checkpoint.

## Standard route run 33 — Preparing to Leave

### Starting state

- Continue after the shrine scenes with the Hilda Garde 3 and the active party restored. The next flight to Shimmering Island changes or closes multiple Disc III shops, locations, and optional activities.
- Treat this as the final pre-Terra gate. Use earlier chapter completion marks for locations already closed; do not assume every listed area can still be revisited.
- Finish selected missables and purchase/learn selected gear before triggering the story transition. Save before departure.

### Trace and checks

1. **Restore equipment and coffee quest:** Replace Zidane and Quina's weak Ipsen weapons and recheck Quina's gear. If all three coffees—Moccha, Kirman, and Burman—are in Key Items, take them to Morrid at Observatory Mountain now and then check the Tantalus Hideout for the Mini Prima-Vista model. The turn-in and supported achievement close at Shimmering Island; Burman's Dali pickup had its earlier cutoff.
2. **Treno and Conde Petie errands:** In Treno's Weapon Shop, defeat Amdusias and take its Running Shoes if it has not already been replaced by Disc IV's Behemoth. If the four colored stones are ready, trade them at the monument west of Suzuna on Conde Petie Mountain Path for the Moonstone; this reward closes at the portal and counts toward the selected four-Moonstone goal. If wanted, catch an Oglop on the path and trade it to Bryan Rootrunner for the Oglop Card while the town/path route remains open.
3. **Final shop and ability audit:** Compare current inventory and learned abilities against the selected high-completion stock list at Black Mage Village, the Oeilvert/Desert Palace Mogshops, Esto Gaza, and Daguerreo. Buy the copies and ability sources required by the profile, including any ability-teaching pieces that become unavailable after the portal. Source lists disagree on the complete unique ability-source set; inspect each character's ability screen and do not buy duplicates solely from an unverified list.
4. **Location and Treasure Hunter review:** Review the relevant earlier checks for Conde Petie's Diamond, the Mountain Path Moonstone, Desert Palace Namingway Card, Esto Gaza/Mount Gulug, North/South Gate items, Morrid's coffees, Oeilvert, Fossil Roo, Ice Cavern, Iifa Tree, and Pinnacle Rocks. Some routes—such as Oeilvert after the Gulug Stone and Fossil Roo's inner path—already closed earlier; use their recorded results instead of planning an impossible return. The item/location list can affect Treasure Hunter Rank, so resolve any still-open, reachable objective now.
5. **Saved Shimmering Island gate:** Once goal-selected tasks are complete or deliberately excluded, save in a separate slot if possible. Fly to Shimmering Island and choose to continue only after reviewing cutoff warnings. This advances into the Portal to Another World chapter.

### Result

The static route checks the equipment reset, Morrid's final coffee turn-in, Treno's remaining Amdusias reward, the colored-stone Moonstone, Oglop trade, final shop/ability list, earlier location states, and a save before Shimmering Island. Jegged and GameFAQs describe this as the last major Disc III sidequest/shop window, and the local walkthrough keeps already-closed locations distinct from the reachable final checks. This is a source-based static trace, not emulator verification. Portal to Another World is the next checkpoint.

## Standard route run 34 — Portal to Another World

### Starting state

- Continue from the saved Shimmering Island gate after the Disc III cutoff review. Zidane is forced into the Terra party; choose the other three characters with Dagger and Steiner's later Bran Bal absence in mind.
- Comprehensive Playthrough profile; no Excalibur II timer assumed.
- Treat the Bran Bal green-light gate as the end of its free exploration window. Save and finish selected village checks before following Mikoto.

### Trace and checks

1. **Terra's seven chests:** At the first fork, take the side branch for Coronet and Dragon Wrist, then return for the straight-path Elixir. On the web-ladder screen, collect Remedy two levels down, return to the middle platform for Mythril Racket, then descend for Demon's Vest. On the spiral, take the apparent left-wall path to Minerva's Plate before completing the ascent. The route keeps the partly obscured and hidden paths in the pickup order.
2. **Bran Bal party and pickups:** After the scenes remove Dagger and Steiner from the active party, fill both slots. Before the green gate, collect the hidden Flash Hat beneath the entrance stairs, both Elixirs (the Inn chest after its scene and the laboratory basement hole), Wing Edge in the Storage room, and the hidden Angel Earrings on the north/northwest pond shore. The local walkthrough orders these free village checks slightly differently from GameFAQs and Jegged; all are checked before leaving the village.
3. **Moorock, Stiltzkin, and the village ATEs:** In Storage, free Moorock, take his letter for Mozme, review the late-game stock, and save. Leave and re-enter to buy Stiltzkin #7's Diamond/Ether/Elixir set for 2,222 Gil. In Eiko's sequence, view Place to Call Home, Where the Heart Is, Came Into the World (also titled Came Into This World), and then The Truth. Reunite the party, review equipment, and follow Mikoto through the green light only after the selected checks are complete.
4. **Three party-split fights:** Amdusias starts with Zidane alone; keep him alive until Freya and Amarant join. Steiner and Quina start against Abadon, with Zidane joining later. Zidane starts against Shell Dragon before Dagger joins; Float can protect against Earth Shake, and heal promptly after Smash leaves a character at 1 HP. The sources disagree on some fixed-encounter statistics, so the guide does not require a level or HP value.
5. **Reunite, save, and collect Holy Miter:** Return through the rooms to the throne area, reform the party, and use Moorock for a save, Tent, party change, and shop review. Check the final Mogshop stock before leaving it, then examine the throne for Holy Miter.
6. **Timed orbs and Elevator ATE:** Activate the blue-orb room's switch and take the outer route to the bridge before 30 seconds expire; a lit-orb encounter consumes the remaining timer, so return to the switch and retry if needed. At the elevator, cycle the forcefield routes and change its heading enough to trigger The Elevator ATE. View it for the eligible Movie Critic route; the published trigger descriptions vary in detail.
7. **Elevator and maze pickups:** Set heading 3 and collect 20,007 Gil from the upper chest. Return to the control, set heading 4, and use both blue-pad branches for Carabini Mail and Elixir. Backtrack through the red pad, take the southern fork for Battle Boots, then follow the northern branch to Mozme. Deliver Moorock's letter; the Kupo Nut reward depends on the earlier handoff.
8. **Boss preparation and steals:** Save with Mozme, use a Tent, settle the party, and equip Wind/Lightning protection and Locomotion where available. Attempt Silver Dragon's Elixir, Dragon Mail, and Kaiser Knuckles steals; Garland's Battle Boots, Ninja Gear, and Dark Gear; then Kuja's Ether, Carabini Mail, and Light Robe. Shell helps against Kuja's magic; avoid Reflect and Carbuncle's Reflect effect because Kuja counters with Flare Star. The fights are consecutive, so the route places the save and equipment check before Silver Dragon.
9. **Disc IV handoff:** After the scripted Kuja finale, follow the linear story path back through Bran Bal. Complete the Zidane-and-Dagger Genome scenes and continue to the escape aboard the Invincible. This is the transition into Return to Gaia, not a free return to Bran Bal's earlier exploration.

### Result

The static trace passes the Terra and Bran Bal pickup sweeps, Stiltzkin #7, Moorock's letter, all four Bran Bal ATEs, the three forced fights, the timed room, Elevator ATE, Mozme handoff, boss steals, and Disc IV transition. Pandemonium has five fixed pickups after the party-split fights: Holy Miter, 20,007 Gil, Carabini Mail, Elixir, and Battle Boots. GameFAQs also lists Wing Edge in its Observatory items; Jegged identifies that Wing Edge as Silver Dragon's guaranteed drop, not a sixth chest. The Kupo Nut from Mozme remains conditional on the prior Kupo Nut handoff. This is a source-based static route review, not live gameplay verification.

## Standard route run 35 — Return to Gaia

### Starting state

- Continue after the Invincible escape and the arrival near Black Mage Village. The Disc IV map is open for optional travel, although Iifa Tree roots block some earlier routes.
- Comprehensive Playthrough profile; no Excalibur II timer assumed.
- Treat Morrid's Coffees, Conde Petie's Colored Stones, Dali's Oglop trade, and Treno's Disc III Amdusias fight as closed. Do not confuse these with still-open shops and quests.

### Trace and checks

1. **Orient and check changed shops:** Use the Invincible bridge to change the party or take off, then begin the optional route from Black Mage Village. Check its Item, Weapon, and Black Cat Synthesis shops and Daguerreo's Weapon Shop for Disc IV stock; other named towns and shops remain accessible with their previous stock. The exact Disc IV inventory still belongs to the pending item-database audit.
2. **World map and Chocobo route:** If Choco has Dive, visit Dive Spot #5 for 10 Aquamarines, Ultima Weapon, Maximillian, and Invincible Card. Continue Frog Catching while leaving a male and female frog in a pond and preserving a golden frog if present; make a separate save before catch 99. Land on Vile Island to check Friendly Yan if its earlier chain and Diamond are ready. After all 24 Chocographs and eight Dead Pepper cracks, visit Chocobo's Paradise and finish the Beach quest using the beach locations Choco identifies. If the conditional Mozme Kupo Nut was received, deliver it to Moguta at Gizamaluke's Grotto for the Aloha T-shirt.
3. **Stiltzkin and Stellazzio rewards:** Buy Stiltzkin's final Alexandria steeple set—Moonstone, Ruby, and Elixir for 5,555 Gil—and speak to him again for Ribbon if the previous seven sets were purchased. Then collect Pisces from the Invincible bridge, complete Queen Stella's remaining standard coin rewards, find Ophiucus in the lower cave at Quan's Dwelling, and return it for the unique Hammer. The route keeps the conditional Ribbon and the original Japanese release difference explicit.
4. **Treno and late-game errands:** Fight the Disc IV Behemoth in Treno's Weapon Shop for Circlet; on supported versions, use Dagger for the Dragon Lady achievement. Check the changed auction pool, including Ribbon, and the card players' new card pools. Start Magical Fingertip with the Daguerreo old man, confirm the four auction artifacts have been sold to their buyers, win Magical Fingertip (budget at least 40,000 Gil), and return it for Steiner's Excalibur and the supported Sword of Kings achievement. The former Amdusias/Running Shoes event is not presented as recoverable here.
5. **Repair Mognet Central:** Start with Kupo in Alexandria’s steeple and follow Atla in Burmecia, Mogryo in Black Mage Village, Kumool in Ipsen’s Castle, Mois at Qu’s Marsh’s Fossil Roo entrance (bring Quina), Noggy in Daguerreo, then Kupo again. At Kumool, inspect the Disc IV stock: icksmehl’s table lists 11 consumables, omits Remedy, and calls Magic Tag “Talisman” at 150 Gil versus the English tables’ 100 Gil. The Final Fantasy Wiki supports the item-name mapping; platform/build behavior remains unverified. Go to Ruby in Alexandria’s Mini-Theater for Superslick; ride an Ocean Chocobo to the island north of the Outer Continent, use a Dead Pepper at its mountain crack, and speak with Artemicion upstairs in Mognet Central for Protect Ring. This Disc IV chain can complete even if earlier Mognet deliveries were skipped; the two supported achievement checks are Ruby’s Superslick handoff and the repair.
6. **Madain Sari and Eidolon Wall:** Visit the fishing area with Dagger in the party for the first scene. Return with neither Dagger nor Amarant, speak with the old friend twice, and inspect the nearby room's action point before going to the wall. Starting at its entrance, alternate full clockwise and counterclockwise circuits until nine dings; then inspect every painting and inspect Ifrit again for the hidden message and supported achievement. The ninth ding also restores HP/MP and clears status ailments.
7. **Start Nero Family and depart:** Before the final dungeon, visit Tantalus Hideout in Lindblum's Theater District and speak to Zenero and Benero for checkpoint one. The challenge can record up to 18 checkpoints and requires nine for Protect Ring; return at the later Memoria checkpoints because they replace one another. Save, review the selected objectives, and fly to the Iifa Tree when ready for the next chapter.

### Result

The static route distinguishes closed Disc III opportunities from the reopened Disc IV map and covers the selected Chocobo, frog, Friendly Yan, Kupo Nut, Stiltzkin, Stellazzio, Treno, Mognet Central, Eidolon Wall, Magical Fingertip, and Nero Family checks before the Iifa Tree transition. The chapter is a broad optional-content window rather than a newly identified one-way cutoff. GameFAQs and RPGClassics corroborate the changed Gaia map and major activity list; Jegged independently confirms the Disc IV Mognet Central letter chain and its rewards. This is a source-based static review, not live gameplay verification.

## Standard route run 36 — Second Battle of the Iifa Tree

### Starting state

- Continue from the Iifa Tree departure gate after the selected Gaia-side checks. Fly the Invincible to the purple orb above the tree; the Sky Chocobo cannot enter it.
- Comprehensive Playthrough profile; no Excalibur II timer assumed.
- Decide before entering whether the save has a Mythril Sword for the Grand Armor synthesis fallback. The boss encounter does not repeat.

### Trace and checks

1. **Check the conditional Grand Armor route:** If Mythril Sword and Mythril Armor are available, synthesize Grand Armor at Black Mage Village for 45,000 Gil before departure if the goal is one copy without relying on a very rare steal. If the sword is gone, the cited item sources do not document another post-Esto-Gaza acquisition; prioritize the steal during Nova Dragon.
2. **Prepare the party and approach:** Choose four characters on the Invincible and equip Wind resistance first, then Water resistance. Bird Killer and Master Thief help if available. Sleep can create a safer steal window; Ultima Weapon lets Zidane apply Sleep with Soul Blade. There is no party menu or shop between the purple orb and the encounter.
3. **Nova Dragon:** Attempt Remedy, Dragon Wrist, and Grand Armor steals before defeating the dragon. The Grand Armor slot is very rare, and the route keeps trying only while the party can safely sustain the fight. Nova Dragon is vulnerable to Sleep, Darkness, Silence, and Slow; protect against Twister/Aerial Slash and Tidal Wave. Exact HP and level numbers vary across sources, so the trace does not rely on them.
4. **Battle reward and Memoria handoff:** After securing the desired steals, defeat Nova Dragon for its guaranteed Wing Edge drop; Ether and Elixir are additional possible drops. The fight closes the encounter's steal table. Continue through the entrance scene, speak with Garland, select the party for Memoria, and use its colored save orb before heading toward the castle.

### Result

The route preserves the one-time Grand Armor decision and records the alternate synthesis path only when the required Mythril Sword is still in inventory. GameFAQs labels the boss steal as a missable opportunity; its separate item-location reference and Jegged support Disc IV synthesis at Black Mage Village when the retained sword and Mythril Armor are available. Wing Edge is the guaranteed boss drop. The static trace reaches Memoria's entrance and party/save setup, not a validated timed Excalibur II run or hands-on gameplay result.

## Standard route run 37 — Memoria

### Starting state

- Continue from the Memoria entrance after Nova Dragon. The entrance light returns to the Invincible; the colored orbs handle saving, Tent recovery, and party changes. If a Nero Family checkpoint or another Gaia errand is due, the party can leave here, reform with Zidane outside, then fly the Invincible to the Iifa Tree and use its portal to resume Memoria.
- Comprehensive Playthrough profile; no Excalibur II timer assumed. The under-12-hour Excalibur II pickup is a separate timed-route branch, not evidence that this collection route meets the timer.
- Bring Zidane for the boss steal tables. Log each Nero Family return before a later scene or fight replaces its checkpoint.

### Trace and checks

1. **Entrance, Kain's Lance, and first Phantom:** Use the entrance orb, save, and search the right wall nook for Kain's Lance. Challenge the Master Phantom by the Stairs of Time, then take The Tower from the small Recollection outcrop. Keep Zidane in the party before continuing to Maliris if collecting the boss steals.
2. **Maliris and checkpoint 3:** Equip Fire protection and Body Temp. Attempt Genji Armor, Ultima Sword, and Masamune steals; Sleep can hold Maliris while Zidane works. Heal before the final hit because Raining Swords damages the whole party. After the fight, register Nero Family checkpoint 3 if still needed; the entry scene was checkpoint 2.
3. **The Past through Tiamat:** In The Past, take Angel Flute and use the hidden save point (checkpoint 4). In Recollection, register checkpoint 5 and challenge the Defense Phantom; cross the bridge for checkpoint 6. In Time Interval, take Rune Claws and register checkpoint 7. Before Tiamat, equip Wind protection, Body Temp, and Loudmouth. Steal Blood Sword, Feather Boots, and Grand Helm; use Sleep and avoid attacking while a character has Float because Tiamat can counter with Snort. After victory, checkpoint 8 is available; Wing Edge is the listed guaranteed drop.
4. **Ruins, Birth, and Hades:** Follow the ruins path, challenge Strong Phantom near the pots, then register checkpoint 9 after the two-planets scene. The Birth scene is checkpoint 10. Hades is optional and hidden behind the coral/rock formation: search repeatedly until the encounter starts. Attempt Robe of Lords, Battle Boots, Running Shoes, and Reflect Ring steals. GameFAQs says the Master Synthesist opens after victory; RPGClassics describes a two-Pumice-Piece handoff first, so this trigger remains unresolved pending in-game verification. Hades remains available for the later Final Preparations window if skipped now.
5. **Kraken and checkpoint 12:** Register checkpoint 11 after the Ocean exit scene. Prepare Water resistance, Body Temp, and Zidane; steal Genji Helmet, Wizard Rod, and Glutton's Robe from Kraken. Water protection reduces the main threat; avoid Return Magic reflecting Waterga back into the boss. Register checkpoint 12 after victory; Phoenix Pinion is the listed guaranteed drop.
6. **Time Warp, Mace of Zeus, and checkpoint 14:** Use the hidden save point in Time Warp and challenge the Rare Phantom. The Gaia's Birth scene is checkpoint 13. Take Mace of Zeus and challenge the Dark Phantom. At Gate to Space, prepare for Earth and status attacks; remove characters at levels divisible by five where possible and equip Antibody and Locomotion. Enter the brief Nero Family checkpoint 14 room, then return to Lindblum before triggering Lich if that checkpoint is still needed.
7. **Lich and Excalibur II condition:** Steal Genji Gloves, Siren's Flute, and Black Robe from Lich. Earth protection helps against its attacks; LV5 Death targets levels divisible by five, while Death, Doom, Stop, and Venom remain risks. Do not cast Doomsday because Lich absorbs it. After victory, register checkpoint 15 and use the hidden save point. If the total game timer is under 12:00:00, take Excalibur II from the area to the right of the doorway; the standard route makes no claim that this timed condition is met. Go through the next door for checkpoint 16.
8. **Crystal World and Deathguise:** In the linear Crystal World, the reborn Guardians are weaker and do not use their original boss steal/drop tables; use any missing Quina Eat opportunities, including Doom, Angel's Snack, Frost, Auto-Life, Mustard Bomb, Twister, and LV5 Death. Register checkpoint 17 at the Crystal World save point. Its warp returns to Memoria's entrance and is one-way; if used, returning to the save point requires retracing cleared rooms, though defeated bosses do not repeat. Before the Deathguise portal, save, heal, finalize the party, equip Wind protection, and keep Zidane for steals. Steal Elixir, Black Belt, and Duel Claws; use Sleep/Slow and Ice or Wind damage. Defeat Deathguise for its guaranteed Wing Edge drop, then register checkpoint 18 if needed.
9. **Stop before Kuja:** Save after Deathguise and complete the checkpoint return for Protect Ring once nine visits have been recorded. For the optional final-preparation window, use the one-way warp to reach the Memoria entrance, leave through its light to the Invincible, and visit Gaia without approaching Kuja. Return through the Iifa Tree portal and retrace Memoria to the Crystal World save point; bosses remain defeated. Do not approach Kuja until the next chapter's selected goals and final-battle checks are complete.

### Result

The trace accounts for all five hidden weapons, the five Tetra Master Phantoms, each of the four Chaos Guardian steal tables, Hades, the Crystal World Blue Magic opportunities, Deathguise, and Nero Family checkpoints 2–18. The route graph now separates the entrance-light exit for early Gaia errands from the post-Deathguise preparation branch and records the Iifa Tree portal re-entry. Excalibur II is recorded only as a conditional pickup after Lich when the total timer is below 12 hours; this collection trace does not validate the required route time. GameFAQs and Jegged corroborate the ordered Memoria rooms, steal/drop windows, and timer condition; RPGClassics independently confirms the hidden weapons, card players, Hades detour, and Deathguise handoff. GameFAQs and RPGClassics differ on whether Hades's synthesis shop opens immediately after victory or after a Pumice Piece exchange. The return route combines the published entry and exit directions; it is not live gameplay or release verification.

## Standard route run 38 — Final Preparations

### Starting state

- Continue from the Crystal World save point after Deathguise. The party can return through Memoria to the Invincible and Gaia before starting the final battle.
- Comprehensive Playthrough profile; no Excalibur II timer assumed.
- Do not approach Kuja until the selected sidequests, steals, collection checks, and ending-scene choice are settled.

### Trace and checks

1. **Open return window:** Save at the Crystal World orb. Return through Memoria and use the entrance light to board the Invincible if needed. Revisit Gaia and any reachable location for selected objectives; use each chapter's recovery notes for exceptions where an earlier opportunity is already closed.
2. **Last cleanup and growth:** Review remaining sidequests, pickups, shop stock, cards, Mognet, Chocobo treasures, Frog Catching, ATEs, achievements, and abilities. If frog catch 99 is still a goal, preserve the breeding pair and use a separate save. There is no required party level; use Grand Dragons with LV5 Death for optional levels, repeated Crystal World guardians for AP, or the documented Gil methods only if your selected goals need them.
3. **Ozma, if selected:** Complete Friendly Creatures first if possible, then save/heal and fly the Sky Chocobo to Chocobo's Air Garden. On the rear platform away from Mene, inspect the rock-like structure and finish Mene's prompts. Prepare Shadow/status protection and Master Thief, then attempt Elixir, Robe of Lords, Dark Matter, and Pumice Piece steals before victory. After defeating Ozma, claim the Pumice drop and check Mene for the Ozma Card and Strategy Guide. It is an optional superboss, not a story requirement.
4. **Hades and synthesis:** If Hades is still undefeated, return to the underwater Birth room and interact behind the rock formation. Attempt Running Shoes, Robe of Lords, Reflect Ring, and Battle Boots steals before victory; GameFAQs calls Running Shoes the last copy available from an enemy. If you have a Hammer, make the choice before synthesis: spending it on Tin Armor forfeits the extra ending scene, while keeping it preserves that scene. The synthesis-shop unlock is described differently by GameFAQs and RPGClassics, so follow the in-game prompt rather than treating the two-Pumice-piece claim as settled.
5. **Final commit check:** Return to the Crystal World save point, heal and save, check the remaining objective and warning panels, and confirm the Hammer choice. Approaching Kuja from this save point begins the consecutive Trance Kuja and Necron battles; the route has no later return to Gaia or sidequest window.

### Result

The static route uses the post-Deathguise window to finish selected optional goals, accounts for the last enemy source of Running Shoes and the Ozma rewards, and makes the Hammer's synthesis/ending-scene tradeoff explicit before the final point of no return. [GameFAQs' Final Preparations chapter](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/final-preparations) confirms the late cleanup window and identifies Hades's Running Shoes steal as the last copy; [Jegged's final showdown walkthrough](https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-4/45-Kuja-and-Necron-Final-Showdown.html) independently requires retracing Memoria after sidequest visits. The standard route now reaches the final commit gate; this is not an Excalibur II speedrun or live gameplay verification.

## Standard route run 39 — The Final Battle

### Starting state

- Continue from the Crystal World save point after the final audit. If you completed optional content on Gaia, walk back through Memoria to the Crystal World before approaching Kuja.
- Comprehensive Playthrough profile; no Excalibur II timer assumed. Keep Hammer in inventory if the extra ending scene is selected.
- Confirm Zidane is available for both steal tables, and know that after approaching Kuja there is no return to free roam or another save.

### Trace and checks

1. **Commit and prepare for Trance Kuja:** Save, heal, and select the opening party at the Crystal World orb. An offensive group such as Zidane, Dagger, Vivi, and Steiner is one cited option. Equip Holy resistance, add Shadow resistance only if using Doomsday, and remove Auto-Reflect. Run toward Kuja to trigger the first fight.
2. **Trance Kuja steal window:** With Zidane, attempt Ether, White Robe, and Rebirth Ring before defeating Kuja. The Rebirth Ring is a rare steal, but this is not the only acquisition path for the item. Slow can help; Kuja uses Flare and Holy, can use Curaga and Reflect, and can retaliate with Flare Star. Avoid Reflect effects and keep the party healthy. Kuja's scripted Ultima transitions to the next scene after defeat.
3. **Change party before Necron:** At the Hill of Despair menu, choose a suitable four-character party and reconfigure equipment and abilities. Favor broad status protection plus Fire, Ice, Lightning, and Holy resistance; prepare rapid recovery with a healer, Remedies, Angel's Snack, Phoenix Down, and Magic Tags. Leaving the menu begins Necron immediately, so finish setup there.
4. **Necron's steal and battle:** If collecting extra Elixirs, have Zidane attempt all four steal slots; each slot contains an Elixir. Necron is weak to Wind and Holy, nullifies Earth, and is vulnerable to Slow. After Grand Cross, restore HP and cure statuses quickly because Neutron Ring follows; Zombie specifically requires a Magic Tag. Grand Cross cannot occur on consecutive turns. Use Dark Matter for its guaranteed 9,999 damage if desired, and only use Doomsday with Shadow protection.
5. **Ending and completion checks:** Defeat Necron to finish the story. With Hammer still in inventory, watch for its extra ending scene; synthesizing Tin Armor with Hammer earlier spends that copy and forfeits the scene. Confirm All's Well that Ends Well on supported achievement releases after the ending. GameFAQs documents a Blackjack Easter egg at the Prelude screen and says some later releases move access to the title menu; platform-specific availability should be checked for the selected release. There is no post-battle free-roam route, so use the pre-Kuja save if you need to resume unfinished objectives.

### Result

The final trace reaches both consecutive boss fights, records the last steal tables and the one party-change window, and carries the Hammer choice into the ending. [GameFAQs' final-battle chapter](https://gamefaqs.gamespot.com/ps/197338-final-fantasy-ix/faqs/71891/the-final-battle) and [Jegged's final showdown walkthrough](https://jegged.com/Games/Final-Fantasy-IX/Walkthrough/Disc-4/45-Kuja-and-Necron-Final-Showdown.html) support the encounter order, Kuja steals, Necron's Elixir steal, the party reconfiguration before Necron, and Grand Cross preparation. This static route is not hands-on gameplay verification, and it does not establish a timed Excalibur II route.

## Next checkpoints

1. Build and independently trace the Excalibur II route, with explicit cumulative timer checkpoints and any content intentionally sacrificed.
2. Build the remaining item, enemy, ability, and sidequest reference databases, then audit their acquisition paths against the completed single-save route.
3. Continue source and release audits for achievements, cutoffs, and postgame variants; the standard route remains a source-based static review rather than a live gameplay test.
