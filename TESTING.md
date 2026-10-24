# Testing and quality checks

Last updated: 2026-10-24

## Latest change status

All 44 walkthrough chapters have authored, source-linked content from Alexandria through Necron and the ending, but remain partial. The latest B01 route expansion adds the Disc II Dali/Observatory return from Alexandria Station and rejoin at South Gate, bringing the graph to 54 links: 41 required-story gates, two optional detours, five optional returns, and six rejoins. The route includes the Oeilvert/Desert Palace party split and the optional return to Gaia after Deathguise. The latest B05 work adds 74 item records and 100 paths across 12 chapter slices, including the Disc III and Disc IV shop stock, 24 source-specific Disc III inventory targets, and 11 partial ability claims. B02 now tracks Diamond Armor's source-backed Daguerreo-only Disc III window as an item-specific, version-scoped warning. The data audit requires limited-window paths with a recommended cutoff chapter to link to a missable objective with a warning and walkthrough checklist step in that chapter; all 39 Disc III final-stock shop paths point to the Preparing to Leave checkpoint. `npm run typecheck`, `npm run lint`, `npm run audit:data`, `npm run build`, and `git diff --check` passed. The audit reported 0 errors and 167 coverage warnings across 44 authored chapter headings, 125 missable records, 598 objectives, and 267 sources. The production build emitted 1,194.37 kB JavaScript (314.07 kB gzip) and 48.89 kB CSS (10.72 kB gzip); Vite's chunk-size advisory remains. The unit suite was not run. No app components changed; the current Route Map rendering and expanded 54-link graph remain unverified.

An internal item data slice was added with 14 item records and 20 source-linked acquisition paths across three chapters. Typecheck, lint, audit, build, and diff checks passed after the addition. The audit remains at 0 errors and 166 coverage warnings; the data rules validate item/path IDs, chapter/objective/source links, quantities, and costs. The slice adds no browser-visible behavior, and the catalog remains partial with no reference UI.

Browser inspection of the current localhost app was denied by browser policy before the Route Map could be read, so the 44-chapter/52-link expansion has no new UI or responsive verification. Earlier browser evidence applies to the 24-chapter/29-link route slice only. The project still needs browser review for the expanded route and full UI/accessibility scenarios. The data audit validates the complete 44-chapter route scope, allowed relationships, endpoint and source integrity, unique links, and route reachability.

## Automated checks

The repository defines:

- `npm run lint` — ESLint on the project.
- `npm run typecheck` — TypeScript project checks.
- `npm test` — progress schema, tombstone merge, and deterministic conflict-order unit tests.
- `npm run audit:data` — duplicate IDs, source/objective/item references, missable fields, warning-to-checklist chapter links, limited-window item path-to-cutoff warning links, item-shop metadata, source inventory targets, ability-claim provenance, and coverage-state warnings.
- `npm run build` — typecheck, data audit, and Vite production build.

The audit reports incomplete content as warnings. It should fail on broken IDs/relationships, not on honestly documented unresearched categories.

The data audit also requires each of the three Teach Me, Mogster! tutorial objectives to remain side-content, have exactly one walkthrough pointer in its correct chapter, and stay outside achievement catalog mappings. It validates the 44-chapter source-ordered sequence, all 43 adjacent guide-order edges, their source links, and the distinction between guide order and game prerequisites. It also validates the 44-chapter/52-link game-route scope, supported relationships, endpoints, sources, unique links, and reachability; the 83-event ATE index, all 80 eligible event objectives, the three excluded tutorials, every chapter/source/prerequisite link, the 14-edge objective dependency graph (including endpoints, sources, duplicates, and cycles), and the 79-view Movie Critic target with its single exclusive branch.

## Production build

`npm run build` passed typecheck, reported 0 data-audit errors and 167 coverage warnings, and completed the Vite production build. The latest JavaScript bundle is 1,194.37 kB (314.07 kB gzip), and CSS is 48.89 kB (10.72 kB gzip). The JavaScript bundle is above Vite's 500 kB advisory threshold; the size warning is advisory, not a build failure.

## Browser checks completed in this phase

The local Vite app was opened in the Codex in-app browser. Cleyra, Return to Alexandria, Pinnacle Rocks, and Return to Lindblum were individually expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels. Their page widths did not exceed the viewport. Pinnacle Rocks showed 15 source links and nine checklist controls; Return to Alexandria showed six checklist controls and 14 source links; Return to Lindblum showed eight checklist controls and 17 source links. The browser reported no error-level console messages after these checks.

Outer Continent was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels. The document widths were 305, 360, 753, 1009, and 1425 pixels respectively, so none exceeded the viewport. Its first-visit ATE checklist appeared for the Comprehensive profile when Steam / PC was selected. The profile was returned to “Choose platform” after the check; no objective was marked complete. The browser console contained no error-level messages.

Magdalene Forest was expanded and checked at the same five widths. Its document widths were 305, 360, 753, 1009, and 1425 pixels, so none exceeded the viewport. The six-ATE objective appeared for the Comprehensive profile when Steam / PC was selected. The profile was returned to “Choose platform” after the check; no objective was marked complete. The browser console contained no error-level messages.

Conde Petie Mountain Path was expanded in Disc II and verified with its second-visit ATE, Diamond recovery, party transition, chests, Oglop detour, separate Mognet letters, Stiltzkin #4 purchase, Hilgigars, colored-stone Moonstone, and Yeti objective visible. The page was checked at 320, 375, 768, 1024, and 1440 CSS pixels; document widths were 305, 360, 753, 1009, and 1425 pixels. With Steam selected, Nuptial Joy, the Mountain Path Moonstone, and Stiltzkin #4 objectives appeared. The profile was returned to “Choose platform,” the viewport override was reset, no checkboxes were marked, and the browser console contained no error-level messages.

Journey to the Iifa Tree was expanded in Disc II and checked for the Mountain Path return, Nymph's forest location and reward, the Mogryo-to-Mocchi reminder, and three working source links. The page was checked at 320, 375, 768, 1024, and 1440 CSS pixels; document widths were 305, 360, 753, 1009, and 1425 pixels. The expanded chapter measured 273, 328, 654, 686, and 1006.81 pixels wide, with no document overflow. A narrow-screen screenshot confirmed the steps and sources wrap within the viewport. The Steam / PC selector showed Madain Sari's five-ATE checklist; the platform selector was restored to “Choose platform,” the viewport override was reset, zero checkboxes were marked, and the browser console contained no error-level messages.

Iifa Tree was expanded in Disc II and checked for the seal/Ruby, Mogryo's letter delivery, both hidden switches, all eight fixed chests, the two scripted descent battles, Soulcage's steals and Fire Blades counter, the Quina LV5 Death follow-up, and four linked section sources. The chapter was checked at 320, 375, 768, 1024, and 1440 CSS pixels; document widths were 305, 360, 753, 1009, and 1425 pixels, while the expanded chapter measured 273, 328, 654, 686, and 1006.81 pixels. No page-level overflow appeared, and a 320 px screenshot confirmed route text, checkboxes, and source links wrap within the viewport. The viewport was reset to the default 903 px width, the platform selector remained at “Choose platform,” no checkboxes were marked, and the browser console had no error-level messages.

Battle of the Iifa Tree, The Home Front, and Card Tournament were checked at 320, 375, 768, 1024, and 1440 CSS pixels. Each document fit within its viewport at widths 305, 360, 753, 1009, and 1425 pixels; the expanded chapter widths were 273, 328, 654, 686, and 1006.81 pixels. With Steam / PC selected, Battle of the Iifa Tree showed 3 unchecked controls and 18 HTTP links; The Home Front showed 8 unchecked controls and 31 links; Card Tournament showed 9 unchecked controls and 30 links. A 320 px screenshot confirmed Card Tournament instructions wrap within the page after closing the mobile navigation drawer. The platform selector was restored to “Choose platform,” the viewport override was reset, and the browser console had no error-level messages.

Trouble on the Home Front was expanded and checked at the same five widths. Document widths were 305, 360, 753, 1009, and 1425 pixels; the chapter measured 273, 328, 654, 686, and 1006.81 pixels. Its two controls remained unchecked and its 14 HTTP source links were present at every width. A 320 px screenshot confirmed the route and source text wrap inside the page. The profile remained at “Choose platform,” the viewport override was reset, and the browser console had no error-level messages.

The Aftermath was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels. Document widths were 305, 360, 753, 1009, and 1425 pixels; the chapter measured 273, 328, 654, 686, and 1006.81 pixels. Its 13 checklist controls remained unchecked and all 19 HTTP source links were present at each width. A 320 px screenshot confirmed route text and links wrap within the viewport. The browser console had no error-level messages. The viewport override was reset to the native 320-by-900 baseline, and no checklist or platform-selection state was changed.

On the High Seas was expanded and checked at the same five widths. Document widths were 305, 360, 753, 1009, and 1425 pixels; the chapter measured 273, 328, 654, 686, and 1006.81 pixels. Its 20 checklist controls remained unchecked and all 35 HTTP source links were present at each width. No horizontal overflow or browser console errors appeared. The viewport was reset to 320 by 900; no checklist or platform selection was changed.

Picking Up the Trail was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels. Document widths were 305, 360, 753, 1009, and 1425 pixels; the expanded chapter measured 273, 328, 654, 686, and 1006.81 pixels. Its two checklist controls remained unchecked and all four HTTP source links were present at each width. No horizontal overflow or browser console errors appeared. The viewport was reset to 320 by 900; no profile or progress mark was changed.

The following interaction checks passed:

- Standard route explains that Excalibur II is optional for the current profile.
- Selecting the Excalibur II route reveals the route deadline; the manual clock accepts `11:45:00` and survives reload.
- Checking the Excalibur II objective in the missable view updates the overview tracker, and unchecking it clears the mark.
- Search for “Moonstone” returns the relevant walkthrough steps; opening the result shows the Alexandria chapter and its source links.
- Checking and unchecking the Moonstone objective in the chapter updates the same profile mark used by the warning summary.
- The chapter's “Set current area” action updates the overview selector to Alexandria; the test-only value was reset to “Not started.”
- In an achievement-profile browser check, the Steam-only Getting Emotional objective appeared on Steam / PC and was hidden on PlayStation 4. The original Comprehensive Playthrough / Choose platform settings were restored afterward.
- Ice Cavern's Mois-letter checkbox was checked and unchecked; the accessibility tree confirmed both state changes and the final unchecked state.
- The mobile navigation drawer opens, navigates, and closes after selection.
- The achievements view lists exact product/platform choices; the 320 px achievements page had no horizontal overflow.
- The browser console had no error-level messages during the check.

The Playwright CLI wrapper could not retrieve its package metadata in the restricted network environment. The in-app browser's documented Playwright page API was used for viewport, search, checkbox, and current-area checks. This is a focused smoke check, not the full release review.

Ipsen's Castle and Breaking the Seal were expanded in the in-app browser at its current 903×1034 viewport. Both chapters rendered with their source sections; the document width was 888 px and the main panel was 670 px, with no horizontal overflow. Breaking the Seal showed its fixed shrine party assignments, Earth Shrine route, Earth Guardian fight, and the pre-Terra handoff. No checkbox or profile setting was changed, and the browser reported no error-level console messages. This is a single viewport check, not a responsive-width pass.

Preparing to Leave was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels after allowing each viewport reflow to settle. Document widths were 305, 360, 753, 1009, and 1425 px; the expanded chapter measured 273, 328, 654, 686, and 1006.81 px, with no document or chapter overflow. Its eight controls remained unchecked and all 28 HTTP source links were present. A 320 px screenshot confirmed the route text and source links wrap within the viewport. The default 903 px viewport was restored, no progress or profile setting changed, and the browser reported no error-level console messages.

Portal to Another World was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels after allowing each viewport reflow to settle. Document widths were 305, 360, 753, 1009, and 1425 px; the expanded chapter measured 273, 328, 654, 686, and 1006.81 px, with no document or chapter overflow. Its 16 checklist controls remained unchecked and all 25 HTTP source links were present. The viewport returned to 903 px, no progress or profile setting changed, and the browser reported no error-level console messages.

After authoring Pandemonium, Portal to Another World was checked again at 320, 375, 768, 1024, and 1440 CSS pixels. Document widths were 305, 360, 753, 1009, and 1425 px; the chapter stayed within its content width at every size. All 37 visible checklist controls remained unchecked, all 39 HTTP source links rendered, and the new Mozme and final-boss sections were present. The viewport was reset to 903 px, no profile or progress mark changed, and the browser reported no error-level console messages.

Return to Gaia was opened in Disc IV and visually reviewed at the current 903 px viewport. The page showed all eight sections from the Invincible arrival through the Iifa Tree handoff, the new Nero Family warning, and 28 source links; profile progress was not changed, and the browser reported no error-level console messages. This is a content/render check at one viewport, not a new responsive-width pass.

Second Battle of the Iifa Tree was expanded and reviewed at the current 903 px viewport. All three sections rendered, including the Grand Armor warning, three source-linked combat/route groups, and the Memoria handoff. Five visible objective controls remained unchecked; the Missables count showed 105, and no error-level console messages appeared. No profile, platform, or progress mark was changed. This is a content/render check at one viewport, not a new responsive-width pass.

Memoria was expanded and reviewed at a 320 px mobile viewport and 1440 px desktop viewport. All six sections rendered, the chapter's source links were present, and the 17 Nero checkpoint objective controls appeared. Document widths were 305 and 1425 px, with no horizontal overflow. The Missables count showed 115; all 48 visible controls remained unchecked, and the browser console had no error-level messages. The viewport was restored and no profile, platform, or progress mark was changed.

Final Preparations and The Final Battle were expanded and checked at 320 px and 1440 px. The document widths were 305 and 1425 px; each chapter measured 273 and 1006.81 px, with no horizontal overflow. Final Preparations rendered 10 source links and 19 unchecked controls; The Final Battle rendered eight source links and nine unchecked controls. The mobile layout wrapped route and source text within the viewport. No browser console errors appeared, and the viewport was reset after review.

The Achievements page shows the Steam count (85), PS4 count (52, including Platinum), and Xbox count (51), with links to their lists and notes about remaining research. The Steam tracker was reviewed at 320, 375, 768, 1024, and 1440 CSS pixels. Document widths were 305, 360, 753, 1009, and 1425 px, with no horizontal overflow; all 85 entries rendered at every width. At 1440 px, the Steam entries exposed 137 walkthrough links and 9 direct missable cutoff notes plus 3 expandable groups; no achievement marks were set. The My Little Airship row showed Morrid's Shimmering Island deadline, and Carbuncle's route no longer inherited the unrelated Iifa Tree treasure warning. The Movie Critic entry expanded to 17 chapter links. Opening One Nag Too Many now expands Evil Forest and displays the 17-call Moguo route.

The individual ATE Tracker rendered all 83 scene records at the current desktop viewport, with 80 eligible choices, three tutorial rows, a 79-scene counter, and four source links. Marking the Card Tournament chapter checklist recorded nine scenes and one Treno branch; selecting the alternate branch cleared the first without increasing the count. The branch and count persisted after reload. Clearing the group returned the QA profile to zero ATE marks. Responsive-width checks for the new tracker remain outstanding.

The new PS4 and Xbox catalogs were reviewed at the current browser viewport. Their headings and totals showed 52 trophies (including Heroes of Gaia Platinum) and 51 achievements respectively; every displayed entry had a walkthrough pointer, all rows were unmarked, and shared console criteria used separate platform progress IDs. The One Nag Too Many objective is shown for all three supported catalogs. Switching back to Steam showed its 85-entry catalog and zero marked unlocks. The profile was restored to Comprehensive Playthrough / Choose platform / Not started, Overview, and an empty search. No objective marks were changed. The browser had no error-level console messages. New console-catalog responsive-width checks remain to be run; Switch and mobile achievement coverage remain unresolved.

## Required browser validation before release

Responsive testing is mandatory at 320, 375, 768, 1024, and 1440 CSS pixels. Check narrow and wide layouts, long chapter labels, search results, expanded warnings, profile creation/switching, export/restore, and time-entry input. Verify that no page-level horizontal scrolling or clipped controls remain. For the new missable state logic, change the current story area across Alexandria, Burmecia, and Cleyra; confirm earlier unmarked cutoffs show as past, current/future cutoffs remain on chapter rows, completed objectives disappear from warning counts, profile goal filters work, and Excalibur II appears only on a selected timed route.

Accessibility review must cover keyboard-only use, visible focus, heading order, screen-reader names, labels, checkbox state, navigation landmark, warning semantics beyond color, text contrast, reduced motion, mobile tap targets, and zoom/reflow. Use automated axe or equivalent checks plus manual review; neither replaces the other.

The current layout includes responsive breakpoints, semantic buttons and labels, status text alongside color, keyboard focus styles, Escape-close behavior for search, and reduced-motion handling. Earlier browser QA reviewed the then-current 29-link story graph at 320/375/768/1024/1440 CSS pixels with no document or route-row overflow; those results predate the present 52-link graph. The current expanded graph needs browser inspection, and browser policy denied access to the local tab during this update. Automated axe/equivalent checks, keyboard-only review, screen-reader review, zoom/reflow review, and full profile/export/restore scenarios remain outstanding.

## Manual playthrough scenarios

1. **Passed:** Start a Standard/Comprehensive profile and confirm that Excalibur II is not treated as a required completion objective.
2. **Passed in the UI smoke check:** Select the Excalibur II route; verify the deadline appears and that the objective mark updates.
3. **Partially passed:** Enter a manual game clock and reload; the value persists. Clear and reload the field as part of the full release pass.
4. Create two profiles; change goal, platform, and marks independently; export and restore the full library.
5. **Partially passed:** Search for an authored walkthrough fact and navigate to its chapter; the Alexandria Moonstone check synchronizes with the missable warning state. Evil Forest content and responsive behavior are checked, but its profile-specific interactions still need a direct UI scenario.
6. **Unit tests passed:** A newer uncheck wins as a tombstone, equal-timestamp merges resolve deterministically, and both exact and legacy platform selections survive normalization. Cross-device sync and conflict review UI do not exist yet.
7. Run the entire standard walkthrough and Excalibur II route with chapter exit gates, source links, treasure/ATE/achievement trackers, and no impossible completion states.

Scenarios 4–7 remain incomplete overall because profile management, content, and cloud sync systems are unfinished. Do not report them as passed.

## Automated checks

The repository defines:

- `npm run lint` — ESLint on the project.
- `npm run typecheck` — TypeScript project checks.
- `npm test` — progress schema, tombstone merge, and deterministic conflict-order unit tests.
- `npm run audit:data` — duplicate IDs, source references, objective references, missable fields, warning-to-checklist chapter links, and coverage-state warnings.
- `npm run build` — typecheck, data audit, and Vite production build.

The audit reports incomplete content as warnings. It should fail on broken IDs/relationships, not on honestly documented unresearched categories.

The data audit also requires each of the three Teach Me, Mogster! tutorial objectives to remain side-content, have exactly one walkthrough pointer in its correct chapter, and stay outside achievement catalog mappings. It validates the 44-chapter source-ordered sequence, all 43 adjacent guide-order edges, their source links, and the distinction between guide order and game prerequisites. It also validates the 44-chapter/52-link game-route scope, supported relationships, endpoints, sources, unique links, and reachability; the 83-event ATE index, all 80 eligible event objectives, the three excluded tutorials, every chapter/source/prerequisite link, the 14-edge objective dependency graph (including endpoints, sources, duplicates, and cycles), and the 79-view Movie Critic target with its single exclusive branch.

## Production build

`npm run build` passed typecheck, reported 0 data-audit errors and 167 coverage warnings, and completed the Vite production build. The latest JavaScript bundle is 1,194.37 kB (314.07 kB gzip), and CSS is 48.89 kB (10.72 kB gzip). The JavaScript bundle is above Vite's 500 kB advisory threshold; the size warning is advisory, not a build failure.

## Browser checks completed in this phase

The local Vite app was opened in the Codex in-app browser. Cleyra, Return to Alexandria, Pinnacle Rocks, and Return to Lindblum were individually expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels. Their page widths did not exceed the viewport. Pinnacle Rocks showed 15 source links and nine checklist controls; Return to Alexandria showed six checklist controls and 14 source links; Return to Lindblum showed eight checklist controls and 17 source links. The browser reported no error-level console messages after these checks.

Outer Continent was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels. The document widths were 305, 360, 753, 1009, and 1425 pixels respectively, so none exceeded the viewport. Its first-visit ATE checklist appeared for the Comprehensive profile when Steam / PC was selected. The profile was returned to “Choose platform” after the check; no objective was marked complete. The browser console contained no error-level messages.

Magdalene Forest was expanded and checked at the same five widths. Its document widths were 305, 360, 753, 1009, and 1425 pixels, so none exceeded the viewport. The six-ATE objective appeared for the Comprehensive profile when Steam / PC was selected. The profile was returned to “Choose platform” after the check; no objective was marked complete. The browser console contained no error-level messages.

Conde Petie Mountain Path was expanded in Disc II and verified with its second-visit ATE, Diamond recovery, party transition, chests, Oglop detour, separate Mognet letters, Stiltzkin #4 purchase, Hilgigars, colored-stone Moonstone, and Yeti objective visible. The page was checked at 320, 375, 768, 1024, and 1440 CSS pixels; document widths were 305, 360, 753, 1009, and 1425 pixels. With Steam selected, Nuptial Joy, the Mountain Path Moonstone, and Stiltzkin #4 objectives appeared. The profile was returned to “Choose platform,” the viewport override was reset, no checkboxes were marked, and the browser console contained no error-level messages.

Journey to the Iifa Tree was expanded in Disc II and checked for the Mountain Path return, Nymph's forest location and reward, the Mogryo-to-Mocchi reminder, and three working source links. The page was checked at 320, 375, 768, 1024, and 1440 CSS pixels; document widths were 305, 360, 753, 1009, and 1425 pixels. The expanded chapter measured 273, 328, 654, 686, and 1006.81 pixels wide, with no document overflow. A narrow-screen screenshot confirmed the steps and sources wrap within the viewport. The Steam / PC selector showed Madain Sari's five-ATE checklist; the platform selector was restored to “Choose platform,” the viewport override was reset, zero checkboxes were marked, and the browser console contained no error-level messages.

Iifa Tree was expanded in Disc II and checked for the seal/Ruby, Mogryo's letter delivery, both hidden switches, all eight fixed chests, the two scripted descent battles, Soulcage's steals and Fire Blades counter, the Quina LV5 Death follow-up, and four linked section sources. The chapter was checked at 320, 375, 768, 1024, and 1440 CSS pixels; document widths were 305, 360, 753, 1009, and 1425 pixels, while the expanded chapter measured 273, 328, 654, 686, and 1006.81 pixels. No page-level overflow appeared, and a 320 px screenshot confirmed route text, checkboxes, and source links wrap within the viewport. The viewport was reset to the default 903 px width, the platform selector remained at “Choose platform,” no checkboxes were marked, and the browser console had no error-level messages.

Battle of the Iifa Tree, The Home Front, and Card Tournament were checked at 320, 375, 768, 1024, and 1440 CSS pixels. Each document fit within its viewport at widths 305, 360, 753, 1009, and 1425 pixels; the expanded chapter widths were 273, 328, 654, 686, and 1006.81 pixels. With Steam / PC selected, Battle of the Iifa Tree showed 3 unchecked controls and 18 HTTP links; The Home Front showed 8 unchecked controls and 31 links; Card Tournament showed 9 unchecked controls and 30 links. A 320 px screenshot confirmed Card Tournament instructions wrap within the page after closing the mobile navigation drawer. The platform selector was restored to “Choose platform,” the viewport override was reset, and the browser console had no error-level messages.

Trouble on the Home Front was expanded and checked at the same five widths. Document widths were 305, 360, 753, 1009, and 1425 pixels; the chapter measured 273, 328, 654, 686, and 1006.81 pixels. Its two controls remained unchecked and its 14 HTTP source links were present at every width. A 320 px screenshot confirmed the route and source text wrap inside the page. The profile remained at “Choose platform,” the viewport override was reset, and the browser console had no error-level messages.

The Aftermath was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels. Document widths were 305, 360, 753, 1009, and 1425 pixels; the chapter measured 273, 328, 654, 686, and 1006.81 pixels. Its 13 checklist controls remained unchecked and all 19 HTTP source links were present at each width. A 320 px screenshot confirmed route text and links wrap within the viewport. The browser console had no error-level messages. The viewport override was reset to the native 320-by-900 baseline, and no checklist or platform-selection state was changed.

On the High Seas was expanded and checked at the same five widths. Document widths were 305, 360, 753, 1009, and 1425 pixels; the chapter measured 273, 328, 654, 686, and 1006.81 pixels. Its 20 checklist controls remained unchecked and all 35 HTTP source links were present at each width. No horizontal overflow or browser console errors appeared. The viewport was reset to 320 by 900; no checklist or platform selection was changed.

Picking Up the Trail was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels. Document widths were 305, 360, 753, 1009, and 1425 pixels; the expanded chapter measured 273, 328, 654, 686, and 1006.81 pixels. Its two checklist controls remained unchecked and all four HTTP source links were present at each width. No horizontal overflow or browser console errors appeared. The viewport was reset to 320 by 900; no profile or progress mark was changed.

The following interaction checks passed:

- Standard route explains that Excalibur II is optional for the current profile.
- Selecting the Excalibur II route reveals the route deadline; the manual clock accepts `11:45:00` and survives reload.
- Checking the Excalibur II objective in the missable view updates the overview tracker, and unchecking it clears the mark.
- Search for “Moonstone” returns the relevant walkthrough steps; opening the result shows the Alexandria chapter and its source links.
- Checking and unchecking the Moonstone objective in the chapter updates the same profile mark used by the warning summary.
- The chapter's “Set current area” action updates the overview selector to Alexandria; the test-only value was reset to “Not started.”
- In an achievement-profile browser check, the Steam-only Getting Emotional objective appeared on Steam / PC and was hidden on PlayStation 4. The original Comprehensive Playthrough / Choose platform settings were restored afterward.
- Ice Cavern's Mois-letter checkbox was checked and unchecked; the accessibility tree confirmed both state changes and the final unchecked state.
- The mobile navigation drawer opens, navigates, and closes after selection.
- The achievements view lists exact product/platform choices; the 320 px achievements page had no horizontal overflow.
- The browser console had no error-level messages during the check.

The Playwright CLI wrapper could not retrieve its package metadata in the restricted network environment. The in-app browser's documented Playwright page API was used for viewport, search, checkbox, and current-area checks. This is a focused smoke check, not the full release review.

Ipsen's Castle and Breaking the Seal were expanded in the in-app browser at its current 903×1034 viewport. Both chapters rendered with their source sections; the document width was 888 px and the main panel was 670 px, with no horizontal overflow. Breaking the Seal showed its fixed shrine party assignments, Earth Shrine route, Earth Guardian fight, and the pre-Terra handoff. No checkbox or profile setting was changed, and the browser reported no error-level console messages. This is a single viewport check, not a responsive-width pass.

Preparing to Leave was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels after allowing each viewport reflow to settle. Document widths were 305, 360, 753, 1009, and 1425 px; the expanded chapter measured 273, 328, 654, 686, and 1006.81 px, with no document or chapter overflow. Its eight controls remained unchecked and all 28 HTTP source links were present. A 320 px screenshot confirmed the route text and source links wrap within the viewport. The default 903 px viewport was restored, no progress or profile setting changed, and the browser reported no error-level console messages.

Portal to Another World was expanded and checked at 320, 375, 768, 1024, and 1440 CSS pixels after allowing each viewport reflow to settle. Document widths were 305, 360, 753, 1009, and 1425 px; the expanded chapter measured 273, 328, 654, 686, and 1006.81 px, with no document or chapter overflow. Its 16 checklist controls remained unchecked and all 25 HTTP source links were present. The viewport returned to 903 px, no progress or profile setting changed, and the browser reported no error-level console messages.

After authoring Pandemonium, Portal to Another World was checked again at 320, 375, 768, 1024, and 1440 CSS pixels. Document widths were 305, 360, 753, 1009, and 1425 px; the chapter stayed within its content width at every size. All 37 visible checklist controls remained unchecked, all 39 HTTP source links rendered, and the new Mozme and final-boss sections were present. The viewport was reset to 903 px, no profile or progress mark changed, and the browser reported no error-level console messages.

Return to Gaia was opened in Disc IV and visually reviewed at the current 903 px viewport. The page showed all eight sections from the Invincible arrival through the Iifa Tree handoff, the new Nero Family warning, and 28 source links; profile progress was not changed, and the browser reported no error-level console messages. This is a content/render check at one viewport, not a new responsive-width pass.

Second Battle of the Iifa Tree was expanded and reviewed at the current 903 px viewport. All three sections rendered, including the Grand Armor warning, three source-linked combat/route groups, and the Memoria handoff. Five visible objective controls remained unchecked; the Missables count showed 105, and no error-level console messages appeared. No profile, platform, or progress mark was changed. This is a content/render check at one viewport, not a new responsive-width pass.

Memoria was expanded and reviewed at a 320 px mobile viewport and 1440 px desktop viewport. All six sections rendered, the chapter's source links were present, and the 17 Nero checkpoint objective controls appeared. Document widths were 305 and 1425 px, with no horizontal overflow. The Missables count showed 115; all 48 visible controls remained unchecked, and the browser console had no error-level messages. The viewport was restored and no profile, platform, or progress mark was changed.

Final Preparations and The Final Battle were expanded and checked at 320 px and 1440 px. The document widths were 305 and 1425 px; each chapter measured 273 and 1006.81 px, with no horizontal overflow. Final Preparations rendered 10 source links and 19 unchecked controls; The Final Battle rendered eight source links and nine unchecked controls. The mobile layout wrapped route and source text within the viewport. No browser console errors appeared, and the viewport was reset after review.

The Achievements page shows the Steam count (85), PS4 count (52, including Platinum), and Xbox count (51), with links to their lists and notes about remaining research. The Steam tracker was reviewed at 320, 375, 768, 1024, and 1440 CSS pixels. Document widths were 305, 360, 753, 1009, and 1425 px, with no horizontal overflow; all 85 entries rendered at every width. At 1440 px, the Steam entries exposed 137 walkthrough links and 9 direct missable cutoff notes plus 3 expandable groups; no achievement marks were set. The My Little Airship row showed Morrid's Shimmering Island deadline, and Carbuncle's route no longer inherited the unrelated Iifa Tree treasure warning. The Movie Critic entry expanded to 17 chapter links. Opening One Nag Too Many now expands Evil Forest and displays the 17-call Moguo route.

The individual ATE Tracker rendered all 83 scene records at the current desktop viewport, with 80 eligible choices, three tutorial rows, a 79-scene counter, and four source links. Marking the Card Tournament chapter checklist recorded nine scenes and one Treno branch; selecting the alternate branch cleared the first without increasing the count. The branch and count persisted after reload. Clearing the group returned the QA profile to zero ATE marks. Responsive-width checks for the new tracker remain outstanding.

The new PS4 and Xbox catalogs were reviewed at the current browser viewport. Their headings and totals showed 52 trophies (including Heroes of Gaia Platinum) and 51 achievements respectively; every displayed entry had a walkthrough pointer, all rows were unmarked, and shared console criteria used separate platform progress IDs. The One Nag Too Many objective is shown for all three supported catalogs. Switching back to Steam showed its 85-entry catalog and zero marked unlocks. The profile was restored to Comprehensive Playthrough / Choose platform / Not started, Overview, and an empty search. No objective marks were changed. The browser had no error-level console messages. New console-catalog responsive-width checks remain to be run; Switch and mobile achievement coverage remain unresolved.

## Required browser validation before release

Responsive testing is mandatory at 320, 375, 768, 1024, and 1440 CSS pixels. Check narrow and wide layouts, long chapter labels, search results, expanded warnings, profile creation/switching, export/restore, and time-entry input. Verify that no page-level horizontal scrolling or clipped controls remain. For the new missable state logic, change the current story area across Alexandria, Burmecia, and Cleyra; confirm earlier unmarked cutoffs show as past, current/future cutoffs remain on chapter rows, completed objectives disappear from warning counts, profile goal filters work, and Excalibur II appears only on a selected timed route.

Accessibility review must cover keyboard-only use, visible focus, heading order, screen-reader names, labels, checkbox state, navigation landmark, warning semantics beyond color, text contrast, reduced motion, mobile tap targets, and zoom/reflow. Use automated axe or equivalent checks plus manual review; neither replaces the other.

The current layout includes responsive breakpoints, semantic buttons and labels, status text alongside color, keyboard focus styles, Escape-close behavior for search, and reduced-motion handling. Earlier browser QA reviewed the then-current 29-link story graph at 320/375/768/1024/1440 CSS pixels with no document or route-row overflow; those results predate the present 52-link graph. The current expanded graph needs browser inspection, and browser policy denied access to the local tab during this update. Automated axe/equivalent checks, keyboard-only review, screen-reader review, zoom/reflow review, and full profile/export/restore scenarios remain outstanding.

## Manual playthrough scenarios

1. **Passed:** Start a Standard/Comprehensive profile and confirm that Excalibur II is not treated as a required completion objective.
2. **Passed in the UI smoke check:** Select the Excalibur II route; verify the deadline appears and that the objective mark updates.
3. **Partially passed:** Enter a manual game clock and reload; the value persists. Clear and reload the field as part of the full release pass.
4. Create two profiles; change goal, platform, and marks independently; export and restore the full library.
5. **Partially passed:** Search for an authored walkthrough fact and navigate to its chapter; the Alexandria Moonstone check synchronizes with the missable warning state. Evil Forest content and responsive behavior are checked, but its profile-specific interactions still need a direct UI scenario.
6. **Unit tests passed:** A newer uncheck wins as a tombstone, equal-timestamp merges resolve deterministically, and both exact and legacy platform selections survive normalization. Cross-device sync and conflict review UI do not exist yet.
7. Run the entire standard walkthrough and Excalibur II route with chapter exit gates, source links, treasure/ATE/achievement trackers, and no impossible completion states.

Scenarios 4–7 remain incomplete overall because profile management, content, and cloud sync systems are unfinished. Do not report them as passed.
