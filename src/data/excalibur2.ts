export type ExcaliburCheckpoint = {
  id: string;
  label: string;
  targetSeconds: number;
  chapterId: string;
};

const clock = (hours: number, minutes: number, seconds = 0) => hours * 3600 + minutes * 60 + seconds;

// Source-reported original PlayStation NTSC targets for baseline paths A, B, and Level 1.
// The source route has not been reproduced in-game by this project.
export const excalibur2Checkpoints: ExcaliburCheckpoint[] = [
  { id: "alexandria-steeple", label: "Alexandria Steeple", targetSeconds: clock(0, 8, 25), chapterId: "disc-1.alexandria" },
  { id: "alexandria-guardhouse", label: "Alexandria Guardhouse", targetSeconds: clock(0, 17, 32), chapterId: "disc-1.alexandria" },
  { id: "prima-vista-crash", label: "Prima Vista crash site", targetSeconds: clock(0, 31, 33), chapterId: "disc-1.evil-forest" },
  { id: "evil-forest-spring", label: "Evil Forest spring", targetSeconds: clock(0, 42, 43), chapterId: "disc-1.evil-forest" },
  { id: "gunitas-basin", label: "Gunitas Basin", targetSeconds: clock(0, 50, 33), chapterId: "disc-1.evil-forest" },
  { id: "ice-cavern-exit", label: "Ice Cavern after the boss", targetSeconds: clock(1, 2, 14), chapterId: "disc-1.ice-cavern" },
  { id: "dali-storage", label: "Dali Storage Area", targetSeconds: clock(1, 14, 22), chapterId: "disc-1.village-of-dali" },
  { id: "lindblum-inn", label: "Lindblum Inn", targetSeconds: clock(1, 35, 48), chapterId: "disc-1.cargo-ship" },
  { id: "lindblum-guest-room", label: "Lindblum Castle Guest Room", targetSeconds: clock(1, 51, 20), chapterId: "disc-1.lindblum" },
  { id: "lindblum-dragons-gate", label: "Lindblum Dragon's Gate", targetSeconds: clock(2, 7, 43), chapterId: "disc-1.lindblum" },
  { id: "eunorus-plains-disc-1", label: "Eunorus Plains", targetSeconds: clock(2, 24, 30), chapterId: "disc-1.exploring-lindblum-kingdom" },
  { id: "daines-horse-basin", label: "Daines-Horse Basin", targetSeconds: clock(2, 33, 43), chapterId: "disc-1.journey-to-burmecia" },
  { id: "oak-staff-detour", label: "Oak Staff detour", targetSeconds: clock(2, 39, 43), chapterId: "disc-1.journey-to-burmecia" },
  { id: "disc-2-start", label: "Start of Disc II", targetSeconds: clock(2, 51, 5), chapterId: "disc-1.burmecia" },
  { id: "bentini-heights", label: "Bentini Heights", targetSeconds: clock(3, 0, 5), chapterId: "disc-2.journey-to-treno" },
  { id: "gargan-roo", label: "Gargan Roo", targetSeconds: clock(3, 17, 19), chapterId: "disc-2.treno" },
  { id: "cleyras-trunk", label: "Cleyra's Trunk", targetSeconds: clock(3, 29, 3), chapterId: "disc-2.journey-to-cleyra" },
  { id: "cleyra-inn", label: "Cleyra Inn", targetSeconds: clock(3, 39, 57), chapterId: "disc-2.cleyra" },
  { id: "cleyra-sandpit", label: "Cleyra Sandpit", targetSeconds: clock(3, 46, 7), chapterId: "disc-2.cleyra" },
  { id: "red-rose-cabin", label: "Red Rose Cabin", targetSeconds: clock(4, 0, 48), chapterId: "disc-2.return-to-alexandria" },
  { id: "alexandria-chapel", label: "Alexandria Chapel", targetSeconds: clock(4, 7, 59), chapterId: "disc-2.return-to-alexandria" },
  { id: "alexandria-rescue", label: "Alexandria Rescue", targetSeconds: clock(4, 24, 34), chapterId: "disc-2.return-to-alexandria" },
  { id: "eunorus-plains-disc-2", label: "Eunorus Plains", targetSeconds: clock(4, 43, 21), chapterId: "disc-2.return-to-lindblum" },
  { id: "fossil-roo", label: "Fossil Roo Cavern", targetSeconds: clock(4, 55, 41), chapterId: "disc-2.journey-to-outer-continent" },
  { id: "magdalene-forest", label: "Magdalene Forest", targetSeconds: clock(5, 6, 24), chapterId: "disc-2.outer-continent" },
  { id: "conde-petie", label: "Conde Petie", targetSeconds: clock(5, 15, 44), chapterId: "disc-2.magdalene-forest" },
  { id: "lucid-plains-disc-2", label: "Lucid Plains", targetSeconds: clock(5, 21, 46), chapterId: "disc-2.conde-petie-mountain-path" },
  { id: "iifa-tree-roots", label: "Iifa Tree Roots", targetSeconds: clock(5, 33, 38), chapterId: "disc-2.journey-to-iifa-tree" },
  { id: "lucid-plains-2", label: "Lucid Plains 2", targetSeconds: clock(5, 51, 23), chapterId: "disc-2.iifa-tree" },
  { id: "pualei-plains", label: "Pualei Plains", targetSeconds: clock(6, 5, 10), chapterId: "disc-2.return-to-madain-sari" },
  { id: "disc-3-start", label: "Start of Disc III", targetSeconds: clock(6, 17, 31), chapterId: "disc-2.battle-of-iifa-tree" },
  { id: "treno-knights-house", label: "Treno Knight's House", targetSeconds: clock(7, 47, 47), chapterId: "disc-3.card-tournament" },
  { id: "desert-palace", label: "Desert Palace", targetSeconds: clock(8, 36, 57), chapterId: "disc-3.forgotten-continent" },
  { id: "esto-gaza", label: "Esto Gaza", targetSeconds: clock(8, 52, 28), chapterId: "disc-3.desert-palace" },
  { id: "lindblum-guest-room-disc-3", label: "Lindblum Castle Guest Room", targetSeconds: clock(9, 12, 20), chapterId: "disc-3.lost-continent" },
  { id: "ipsens-castle", label: "Ipsen's Castle", targetSeconds: clock(9, 25, 45), chapterId: "disc-3.aerial-exploration" },
  { id: "blairsurpass-plains", label: "Blairsurpass Plains", targetSeconds: clock(9, 44, 56), chapterId: "disc-3.breaking-the-seal" },
  { id: "bran-bal", label: "Bran Bal", targetSeconds: clock(9, 56, 27), chapterId: "disc-3.portal-to-another-world" },
  { id: "pandemonium", label: "Pandemonium", targetSeconds: clock(10, 10, 47), chapterId: "disc-3.portal-to-another-world" },
  { id: "disc-4-start", label: "Start of Disc IV", targetSeconds: clock(10, 28, 25), chapterId: "disc-3.portal-to-another-world" },
  { id: "memoria-entrance", label: "Memoria entrance", targetSeconds: clock(10, 40, 40), chapterId: "disc-4.second-battle-of-iifa-tree" },
  { id: "memoria-the-past", label: "Memoria — The Past", targetSeconds: clock(11, 1, 10), chapterId: "disc-4.memoria" },
  { id: "memoria-portal", label: "Memoria portal", targetSeconds: clock(11, 6, 12), chapterId: "disc-4.memoria" },
  { id: "memoria-time-warp", label: "Memoria — Time Warp", targetSeconds: clock(11, 10, 59), chapterId: "disc-4.memoria" },
  { id: "excalibur-ii-pickup", label: "Excalibur II after Lich", targetSeconds: clock(11, 13, 7), chapterId: "disc-4.memoria" },
];

export function formatClock(seconds: number | null) {
  if (seconds === null) return "";
  const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor(seconds % 3600 / 60).toString().padStart(2, "0");
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${remainder}`;
}

export function parseClock(value: string): number | null | undefined {
  if (!value.trim()) return null;
  const match = value.trim().match(/^(\d{1,5}):([0-5]?\d)(?::([0-5]?\d))?$/);
  if (!match) return undefined;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

export const EXCALIBUR_II_CUTOFF_SECONDS = 12 * 60 * 60;
export const EXCALIBUR_II_SIGNIFICANT_DELAY_SECONDS = 5 * 60;
