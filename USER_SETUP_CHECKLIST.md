# User setup checklist

Last updated: 2026-10-25

This is the consolidated list of actions that need the project owner's GitHub or Firebase account, a real sign-in, or a second device. The app currently stores progress in this browser only. Codex will complete and test the implementation that does not require your account before moving the Firebase steps to **Ready for User**.

Statuses use the project vocabulary: **Not Started**, **Blocked**, **Ready for User**, **In Progress**, and **Completed**. Do not send passwords, access tokens, service-account JSON, or Firebase config values in chat. Firebase web-app config is included in browser builds, so it is public configuration rather than a secret; access must be protected by Authentication, Firestore rules, and domain/API restrictions.

## Current project milestone
Ralvuimago’s one-time steals are now modeled as encounter copies with later recovery. Phoenix Down remains shop-buyable; Adaman Vest is equipped by Amarant and has five later shop paths; Oak Staff has Chocograph #11, Soulcage, and five shop paths. Added the optional Need 7/2 targets and five abilities: Bird Killer, Stone Killer, Bio, Drain, and Stop. Current counts: 44 chapters, 133 missables, 608 objectives, 297 sources, 188 items, 674 paths, 36 recipes, 67 targets, and 136 ability claims. Lint and production build pass; data audit reports 0 errors and 175 coverage warnings; JavaScript is 1,593.57 kB (394.70 kB gzip) and CSS is 59.99 kB (12.73 kB gzip), with Vite’s chunk-size advisory. Tests and direct game/release/UI verification were not run. No account-owner action changed.

Zorn and Thorn now have four modeled one-time steals, the Pinnacle Rocks Mythril Armlet chest, and later shop recovery paths for all four items. The catalog records optional Need targets 2/2/3/7 and eight associated ability claims; the Mythril Armor steal-owner conflict remains explicit. Ice Brand is also cataloged with its Alexandria chest, both Beatrix steals, five shop routes, and Need 2 separate from end-inventory #0. Current counts: 44 chapters, 133 missables, 608 objectives, 296 sources, 186 items, 658 paths, 36 recipes, 65 targets, and 131 ability claims. Lint and data audit pass with 0 errors and 175 coverage warnings; typecheck/build pass; JavaScript is 1,590.46 kB (393.98 kB gzip) and CSS is 59.99 kB (12.73 kB gzip), with Vite’s existing chunk-size advisory. Tests and direct game/release/UI verification were not run. No account-owner action changed.

A prior B05 follow-up resolved three Disc IV Black Cat recipes: Rune Tooth from two Mythril Daggers for 2,000 Gil, Gauntlets from Mythril Gloves + Dragon Wrist for 8,000 Gil, and Brave Suit from Mythril Vest + Mythril Rod for 26,000 Gil. GameFAQs Shops lists 1,000 Gil for Rune Tooth and 20,000 Gil for Brave Suit; RPGClassics, Fandom, and FFUniverse list 2,000/26,000 Gil. Gauntlets is distinct from RPGClassics' mislabeled Circlet formula. The item table's 1,900-Gil Rune Tooth and 11,250-Gil Brave Suit figures are sell prices. Mountain Crack #2 also rewards Gauntlets; Treno Disc IV Mythril Gloves and Esto Gaza Mythril Rod routes support the recipe inputs. The slice adds three Need targets and four ability claims. Earlier in the slice, Magus Hat, Rubber Helm, and Cachusha were added: six Magus Hat shop paths, Freya's guest Rubber Helm, the wrecked Prima Vista Cargo Room in the Evil Forest chapter, and Dali/Summit Station shop sources, repeatable Hot & Cold digging, the Dali windmill chest, and five 1,000-Gil synthesis windows. Priest's Racket extends that chain at Black Cat on Disc IV: Air Racket + Cachusha for 11,000 Gil, Need 3, and Silence/Might claims. Need and end-inventory figures remain distinct, and the earlier equipment ability claims are recorded. The Dali chest's earliest access remains disputed between Disc II and III, and the digging guide spells Cachusha as “Cachusa.” Yellow Scarf and Feather Hat remain linked through the Cleyra pickup, guest equipment, eight 400-Gil recipes, Need targets, and abilities. At that B05 checkpoint, the catalog had 173 items, 590 paths across 38 slices, 36 recipes, 60 inventory targets, 122 ability claims, and 295 sources. Lint, data audit (0 errors, 175 coverage warnings), typecheck/build, and whitespace checks pass; the production bundle is 1,562.17 kB JavaScript (389.37 kB gzip) and 59.99 kB CSS (12.73 kB gzip). Tests and game/release/UI verification were not run. No account-owner action changed. The latest B01/B02 follow-up clarifies Lindblum's partial recovery: during the Disc II return after Pinnacle Rocks and before the Journey to the Outer Continent, GameFAQs documents the Business and Theater districts and shop plaza, while the church alley remains blocked; neither reviewed route establishes trolley access or full-area reopening. Lint, data audit, typecheck/build, and whitespace checks pass with 0 audit errors and 175 coverage warnings; tests and in-game/release verification were not run. No owner-side setup action changed. The preceding Black Waltz 3 correction clarifies the train-car cutoff: its three steals are available only during the one-time encounter, but GameFAQs item/shop references document later purchase routes for Steepled Hat, Flame Staff, and Lightning Staff. Lint, typecheck, data audit, production build, and whitespace checks pass with 0 audit errors and 175 coverage warnings; tests and game/UI/version verification were not run. No owner-side setup action changed. At that earlier verification point, the catalog had 143 partial items, 538 acquisition paths across 38 chapter slices, 18 recipes, 40 inventory targets, and 89 ability claims across 292 sources. A follow-up Mistodon source check adds a second GameFAQs route describing random encounters on the story return, while leaving post-clear farming of the exact steal table unresolved against EliteGrindLab. The preceding B05 slice adds nine sourced Steepled Hat paths, its Protect claim, and the source-specific Need 7 inventory target; Atla's Mogshop is the documented Disc IV purchase recovery for 260 Gil. The exact Steepled Hat Buy/Synth and retained-copy arithmetic, plus access to other Burmecia pickup rooms, remain under review. The preceding B01 slice separates Disc III Alexandria's Vivi phase from Zidane's later city phase: Hippaul, Stiltzkin #5, and four ATEs close at Ruby's play, while the Nero Brothers and final two ATEs belong to the later free-roam window. Lint, typecheck, data audit, and production build pass with 0 audit errors and 175 coverage warnings; tests were not added or run. In-game and release verification remain open, and no account-owner action is needed. The preceding B01 slice clarifies Cleyra's separate cutoff phases: first-visit ATEs and shops, Freya's post-Antlion Emerald and Stiltzkin window, the required Trunk return for missed chests, and evacuation rewards before departure. GameFAQs and Gamer Guides support this sequence, while source descriptions of the final closure remain disputed. Lint, typecheck, data audit, and production build pass; tests were not added or run. No account-owner action is needed. The preceding B01/B02 slice records Memoria's entrance-light exit to Gaia for Nero Family checkpoints and other Disc IV errands, its Iifa Tree portal re-entry, the required party reform with Zidane outside, and the distinct one-way Crystal World warp back to the dungeon entrance. It also updates Quina's Twister warning to show that missed Mount Gulug Red Dragons can be recovered by eating the revived Tiamat in Crystal World. The graph has 68 links across 44 chapters: 41 required story gates, two optional detours, thirteen optional returns, and twelve rejoins. Lint, typecheck, data audit, and production build pass with 0 audit errors and 175 coverage warnings across 44 chapters, 133 missables, 608 objectives, and 287 sources. Tests were not added or run; the new recovery route has not received browser or release verification. No GitHub or Firebase account is needed, so no owner-side setup step changed. At the earlier Memoria route check, catalog counts were 138 partial items, 502 acquisition paths, 15 recipes, 33 inventory targets, and 77 ability claims; repository, Pages, and Firebase statuses remain below.

The preceding B01 cutoff slice links all 133 missable warnings to 85 cutoff windows in the Route Map, including all 79 high/critical records. Lint, typecheck, data audit, and production build pass with 0 audit errors and 175 coverage warnings; tests were not added or run. This work does not require a GitHub or Firebase account, so no owner-side step became ready or changed.

## Dependency order

| Order | Task | Priority | Status | Dependency |
| --- | --- | --- | --- | --- |
| 1 | Create the GitHub repository | Required | Ready for User | None |
| 2 | Enable GitHub Pages | Required | Blocked | Task 1 and a deployable commit |
| 3 | Create the Firebase project and web app | Required for cross-device sync | Blocked | Codex completes Firebase integration contract |
| 4 | Enable the implemented Authentication provider and domains | Required for cross-device sync | Blocked | Task 3 and Codex's provider-specific implementation |
| 5 | Create Firestore and apply reviewed rules/indexes | Required for cross-device sync | Blocked | Task 3 and Codex's tested rules/index files |
| 6 | Add production Firebase web config to GitHub Actions | Required for cloud-enabled deployment | Blocked | Tasks 3–5 and Codex updates the workflow |
| 7 | Run live account, sync, and multi-device acceptance checks | Required for production functionality | Blocked | Tasks 2–6 and a deployed release candidate |
| 8 | Enable optional App Check | Optional hardening | Blocked | Cloud sync is live and Firebase App Check support is implemented |

## 1. Create the GitHub repository

**Priority:** Required before push and deployment

**Status:** Ready for User

**Purpose:** The checkout contains the guide's local Git history on `main`, but no remote is configured. GitHub API lookup and a direct push attempt to the expected `Appl3Tree/FFIX-Guide` URL returned 404. That response does not establish whether the repository is missing or the connected account lacks access; the owner needs to create the repository or grant access.

### Exact instructions

1. Open [GitHub's new repository page](https://github.com/new) while signed into the `Appl3Tree` account.
2. Set **Owner** to `Appl3Tree` and **Repository name** to `FFIX-Guide`.
3. Set visibility to **Public** so the repository matches the expected public Pages URL: [https://appl3tree.github.io/FFIX-Guide/](https://appl3tree.github.io/FFIX-Guide/).
4. Leave **Add a README**, **.gitignore**, and **license** unchecked. The local checkout already contains these files; an empty remote avoids unrelated initial-commit conflicts.
5. Create the repository. Do not paste a personal access token into chat or a Git remote URL.
6. Tell Codex `Continue`. Codex will connect the repository to the existing local history, push the reviewed commits, verify the remote, and inspect Actions. Do not initialize another local repository or create a competing first commit.

**Required values:** Owner `Appl3Tree`; repository `FFIX-Guide`; public visibility; empty repository; intended default branch `main`. No credential value is needed in this file.  
**Depends on:** None.  
**Verification:** The repository opens at `https://github.com/Appl3Tree/FFIX-Guide`, and Codex confirms it can read the repository and publish a commit.  
**Codex follow-up:** Once the repository is created or visible to the connected account, add it as the remote, push the existing local commit history, verify the remote commit, and inspect Actions. Do not create another local repository or competing first commit.

## 2. Enable GitHub Pages

**Priority:** Required for a live guide  
**Status:** Blocked  
**Purpose:** The repository includes a GitHub Actions workflow that validates the app and deploys the `main` branch to Pages.

### Exact instructions

1. After task 1 and Codex's first push, open `Appl3Tree/FFIX-Guide` on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open **Actions → Build and deploy FFIX Guide** and confirm the `main` run succeeds after Codex has confirmed the workflow's checks.
5. Open [https://appl3tree.github.io/FFIX-Guide/](https://appl3tree.github.io/FFIX-Guide/) and confirm the guide loads.

**Required values:** Pages source `GitHub Actions`; deployment branch `main`; expected URL `https://appl3tree.github.io/FFIX-Guide/`. No GitHub secret is required for the current Pages workflow.  
**Depends on:** Task 1 and a deployable commit.  
**Verification:** A green `Build and deploy FFIX Guide` run and a working published URL.  
**Codex follow-up:** Confirm the deployed version and run the release smoke checks; repair any workflow or base-path issue.

## 3. Create the Firebase project and web app

**Priority:** Required for full cross-device functionality  
**Status:** Blocked until Codex finishes and locally tests the Firebase integration  
**Purpose:** The app does not yet initialize Firebase or use the blank values in `.env.example`. Creating a project before the implementation contract and rules are ready would leave an unused project and may require rework.

### Exact instructions when unblocked

1. Open the [Firebase console](https://console.firebase.google.com/) with the Google account that should own the project.
2. Select **Add project** and create a project for this guide. Choose the project ID and Firestore data region deliberately; record both in your own password manager or project notes, not in this checklist or chat.
3. In **Project settings → General → Your apps**, add a **Web app** named `FFIX Guide`.
4. Copy the web app configuration values into your local ignored `.env.local` file using the exact variable names below. Never commit `.env.local`.
5. Codex will identify which values are required and whether Analytics is used before changing this task to **Ready for User**.

**Required values:** The current template names are `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, and optional `VITE_FIREBASE_MEASUREMENT_ID`. Their values come from the web app config; do not invent them or send them to Codex. These browser config values are not service-account credentials.  
**Depends on:** Codex's Firebase initialization, data schema, and documented config contract.  
**Verification:** Codex confirms local development initializes the intended Firebase project and test/emulator suites pass without exposing credentials.  
**Codex follow-up:** Add the exact `.env.local` keys to the template documentation, complete integration, and update the deployment workflow. Firebase setup guidance: [Add Firebase to a JavaScript project](https://firebase.google.com/docs/web/setup).

## 4. Enable Authentication and authorized domains

**Priority:** Required for cross-device sync  
**Status:** Blocked until the sign-in method is selected in the implemented app  
**Purpose:** Users need an account to access their own cloud-synced profiles. The current app has no sign-in interface, so the provider list and OAuth details must match Codex's implementation rather than be guessed here.

### Exact instructions when unblocked

1. In Firebase Console, open **Authentication → Sign-in method** (the console may label the section **Authentication → Providers**).
2. Enable only the provider or providers named in the release instructions from Codex. Save the provider settings.
3. Open **Authentication → Settings → Authorized domains** and add `appl3tree.github.io` for the deployed guide. Add `localhost` only if the local Firebase sign-in flow needs it; Firebase does not necessarily include localhost in new projects by default.
4. If the selected provider uses an OAuth client, use the exact redirect URI shown by Firebase. Do not substitute a guessed Firebase project hostname.
5. Keep account recovery and provider support settings aligned with the implemented UI.

**Required values:** Deployed authorized domain `appl3tree.github.io`; any local domain and provider-specific OAuth redirect URI will be listed by Codex after implementation. Do not put OAuth client secrets in Vite variables.  
**Depends on:** Task 3 and the implemented provider-specific sign-in flow.  
**Verification:** Codex's test account can sign in and out on the deployed origin, survives page reload, and cannot read another user's data. Firebase's [Google sign-in guide](https://firebase.google.com/docs/auth/web/google-signin) documents provider setup; Codex will link the correct provider documentation if another provider is implemented.  
**Codex follow-up:** Verify authorized-domain behavior, persistence, account isolation, and any email/OAuth callback path.

## 5. Create Firestore and apply security rules/indexes

**Priority:** Required for cross-device sync  
**Status:** Blocked until Codex has authored and emulator-tested the schema, rules, and indexes  
**Purpose:** The app must synchronize private user data without allowing unauthenticated access or cross-user reads and writes.

### Exact instructions when unblocked

1. In Firebase Console, open **Firestore Database** and choose **Create database**.
2. Select **Production mode**, then choose the region documented by Codex. Do not start with open/test rules.
3. Open **Firestore Database → Rules** and publish the exact reviewed contents of the repository's `firestore.rules`, or follow Codex's Firebase CLI command if deployment through the CLI is selected.
4. Apply `firestore.indexes.json` only if Codex documents required composite indexes. No index values are specified until actual queries require them.
5. Do not add an Admin SDK service-account key to the browser app, repository, or chat. The web client must be protected by Authentication and Firestore Security Rules.

**Required values:** Database region and rules/index contents will be selected or authored by Codex and recorded here before this becomes **Ready for User**. Never use `allow read, write: if true` in production.  
**Depends on:** Task 3 and Codex's tested `firestore.rules`, schema, and any index file.  
**Verification:** Emulator tests prove owner-only reads/writes, deny unauthenticated access, deny cross-user access, reject malformed/oversized data, and allow valid same-user sync. Codex then verifies a production smoke test. See Firebase's [Firestore Rules testing guide](https://firebase.google.com/docs/firestore/security/test-rules-emulator).  
**Codex follow-up:** Confirm deployed rules and indexes match the tested source, and check the Firebase console for errors.

## 6. Configure production web-app values in GitHub Actions

**Priority:** Required if the deployed cloud-enabled app reads Firebase config at build time  
**Status:** Blocked until the integration and workflow are ready  
**Purpose:** The Pages build needs the same Firebase web app config used in local development. These values are public client configuration, not private credentials.

### Exact instructions when unblocked

1. Open the repository's **Settings → Secrets and variables → Actions → Variables**.
2. Add the exact `VITE_FIREBASE_*` variable names listed by Codex and copy each corresponding value from **Firebase Console → Project settings → General → Your apps → Firebase SDK snippet → Config**.
3. Do not create service-account secrets for a browser-only Firebase client. If Codex later proves a private deployment credential is needed, Codex will document the exact secret, scope, rotation, and reason before asking you to add it.
4. After the workflow uses the correct variables, run **Actions → Build and deploy FFIX Guide** and confirm it completes.

**Required values:** The current template lists `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, and optional `VITE_FIREBASE_MEASUREMENT_ID`. Codex must confirm the required subset and switch the workflow to the appropriate public-variable mechanism before this step is unblocked.  
**Depends on:** Tasks 3–5 and Codex's checked-in workflow change.  
**Verification:** The Pages build succeeds, initializes the expected Firebase project, and contains no private key or service-account data.  
**Codex follow-up:** Inspect build logs, deployment, Auth callbacks, and Firestore connectivity.

## 7. Perform live production acceptance checks

**Priority:** Required for production functionality  
**Status:** Blocked until the release candidate is deployed and cloud sync is implemented  
**Purpose:** Only the owner can verify their real account, browser policies, and second-device behavior.

### Exact instructions

1. Open the deployed URL in a desktop browser and a mobile browser.
2. Create a new guide profile, select a goal/route/platform, mark an objective, reload, and confirm the mark persists.
3. Export the profile data. Create a second profile and verify the two profiles remain separate. Restore the export and confirm the expected backup behavior.
4. Sign in with the configured provider and confirm that the app clearly reports whether changes are local, syncing, synced, or failed.
5. Open the same account on a second device or private browser session. Confirm the same profile and objective mark arrive; make a change on each device and confirm conflict resolution preserves both checked and unchecked changes.
6. Sign out and confirm private profiles are not accessible through another account. Confirm offline edits queue safely and sync after reconnecting.
7. Check narrow mobile, tablet, and desktop layouts; keyboard navigation; visible focus; and screen-reader labels using the acceptance list Codex supplies with the release candidate.
8. Report any failed check to Codex before declaring the release accepted.

**Required values:** A real account using the implemented provider and access to a second device or isolated browser session. Do not send passwords or authentication codes to Codex.  
**Depends on:** Tasks 1–6 and a deployed release candidate.  
**Verification:** Record pass/fail for each step; Codex will inspect automated evidence and reproduce reported failures.  
**Codex follow-up:** Fix issues, rerun the full suite and deployment, then repeat any affected acceptance steps.

## 8. Optional App Check hardening

**Priority:** Optional  
**Status:** Blocked pending a working production sync release and a verified App Check integration  
**Purpose:** Add an additional abuse-resistance layer after normal Authentication and Firestore rules are proven. App Check does not replace user authentication or database rules.

**Exact instructions:** Codex will identify the supported provider and exact Firebase Console steps after verifying App Check with the deployed app. Do not enforce App Check before the app has been tested with valid attestation; premature enforcement can reject legitimate users.  
**Required values:** The provider-specific site key or registration values, if any, will be supplied by Codex only after the implementation is tested.  
**Depends on:** Tasks 3–7.  
**Verification:** Codex confirms valid clients pass and unverified requests are rejected without blocking ordinary browsers.  
**Codex follow-up:** Verify the enforcement metrics and update the operational notes.

## Manual tasks Codex will not assign to you

Codex owns local Git initialization and ordinary commits, source and Firestore-rule implementation, automated tests, data research, browser automation, deploy-workflow maintenance, and deployment diagnostics wherever the connected tools permit. Your participation is limited to account ownership/permissions, console actions that cannot be performed by the available integrations, real-account and second-device validation, and release acceptance.
