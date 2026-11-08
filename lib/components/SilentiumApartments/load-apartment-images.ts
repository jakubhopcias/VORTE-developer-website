import fs from "node:fs";
import path from "node:path";
import type { Apartment, ApartmentImage } from "./apartments";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

function labelFromFilename(filename: string) {
  const stem = filename
    .replace(IMAGE_EXT, "")
    .replace(/[_-]+/g, " ")
    .replace(/\d+$/g, "")
    .trim()
    .toLowerCase();
  const known: Record<string, string> = {
    "living room": "Living",
    living: "Living",
    balcony: "Balcony",
    kitchen: "Kitchen",
    bedroom: "Bedroom",
  };
  return known[stem] ?? "";
}

function publicSrc(folder: string, filename: string) {
  return `/${folder}/${filename.split("/").map(encodeURIComponent).join("/")}`;
}

/** Read every image in `public/<folder>` and merge optional per-file copy. */
export function loadApartmentImages(apartment: Apartment): ApartmentImage[] {
  const dir = path.join(process.cwd(), "public", apartment.folder);
  if (!fs.existsSync(dir)) return [];

  const priority = ["living-room", "living", "kitchen", "balcony", "courtyard", "bedroom"];

  const files = fs
    .readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name) && !/floorplan/i.test(name))
    .sort((a, b) => {
      const stem = (name: string) =>
        name.replace(IMAGE_EXT, "").replace(/\d+$/g, "").toLowerCase();
      const rank = (name: string) => {
        const key = stem(name);
        const i = priority.findIndex(
          (p) => key === p || key.startsWith(`${p}-`) || key.startsWith(p),
        );
        return i === -1 ? priority.length : i;
      };
      const diff = rank(a) - rank(b);
      if (diff !== 0) return diff;
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });

  return files.map((filename) => {
    const meta = apartment.imageMeta?.[filename] ?? {};
    const room = meta.room ?? labelFromFilename(filename);
    return {
      src: publicSrc(apartment.folder, filename),
      alt: meta.alt ?? `${apartment.name}${room ? ` — ${room}` : ""}`,
      room,
      caption: meta.caption ?? "",
    };
  });
}
