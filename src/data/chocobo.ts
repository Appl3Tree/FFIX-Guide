export const chocoboBeachLocations = [
  { id: "makiki-beach", name: "Makiki Beach", region: "Mist Continent" },
  { id: "metalark-shores", name: "Metalark Shores", region: "Mist Continent" },
  { id: "nomarania-beach", name: "Nomarania Beach", region: "Mist Continent" },
  { id: "tuhanda-shores", name: "Tuhanda Shores", region: "Mist Continent" },
  { id: "eesistern-coast", name: "Eesistern Coast", region: "Mist Continent" },
  { id: "togull-beach", name: "Togull Beach", region: "Mist Continent" },
  { id: "derek-beach", name: "Derek Beach", region: "Mist Continent" },
  { id: "banyano-shores", name: "Banyano Shores", region: "Outer Continent" },
  { id: "kognish-shores", name: "Kognish Shores", region: "Outer Continent" },
  { id: "gegalrish-shores", name: "Gegalrish Shores", region: "Outer Continent" },
  { id: "falstead-coast", name: "Falstead Coast", region: "Outer Continent" },
  { id: "shengalasta-shores", name: "Shengalasta Shores", region: "Outer Continent" },
  { id: "dyshnose-shores", name: "Dyshnose Shores", region: "Outer Continent" },
  { id: "lost-continent-northwest", name: "Northwestern Lost Continent coastline", region: "Lost Continent" },
  { id: "lost-continent-north", name: "Northern Lost Continent coastline", region: "Lost Continent" },
  { id: "lanshake-island", name: "Lanshake Island beach", region: "Island beaches", location: "Island south of the Mist Continent" },
  { id: "commure-shores", name: "Commure Shores", region: "Island beaches", location: "Mognet Central island; GameFAQs spells the name Conmure Shores" },
  { id: "everlang-island", name: "Everlang Island beach", region: "Island beaches", location: "West side of the Forgotten Continent" },
  { id: "lanar-island", name: "Lanar Island beach", region: "Island beaches", location: "South of Everlang Island" },
  { id: "salvage-archipelago", name: "Salvage Archipelago beach", region: "Island beaches", location: "Southwest of Lanar Island, near Chocobo's Lagoon" },
  { id: "palmnell-island", name: "Palmnell Island beach", region: "Island beaches", location: "Island that contains Chocobo's Lagoon" },
] as const;

export const chocoboBeachObjectivePrefix = "disc-4.return-to-gaia.chocobo-beach";

export const chocoboBeachObjectiveId = (locationId: string) => `${chocoboBeachObjectivePrefix}.${locationId}`;

export const chocoboBeachObjectiveIds = chocoboBeachLocations.map(({ id }) => chocoboBeachObjectiveId(id));
