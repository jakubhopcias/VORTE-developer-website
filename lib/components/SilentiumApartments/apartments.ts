export type ApartmentImage = {
  src: string;
  alt: string;
  room: string;
  caption: string;
};

export type Apartment = {
  name: string;
  /** Folder under /public — gallery images are read from here at build/request time. */
  folder: string;
  /** Short concrete pitch under the name. */
  summary: string;
  area: string;
  /** Only set when the unit has a real outdoor space (e.g. rooftop). */
  outdoor?: string;
  ceilingHeight: string;
  layout: string;
  access: string;
  floorplan: string;
  /** Optional copy keyed by filename (with extension). Missing files still show. */
  imageMeta?: Record<
    string,
    Partial<Pick<ApartmentImage, "alt" | "room" | "caption">>
  >;
};

export const apartments: Apartment[] = [
  {
    name: "The Obsidian Penthouse",
    folder: "obsidian",
    summary:
      "Upper-floor residence, 285 m². Closed street facade, open view once inside, private elevator access.",
    area: "285 m²",
    outdoor: "90 m² rooftop terrace",
    ceilingHeight: "3.80 m",
    layout: "Open living zone, 3 en-suite bedrooms, master wardrobe",
    access: "Direct private elevator with cryptographic key",
    floorplan: "/obsidian/floorplan.pdf",
    imageMeta: {
      "living-room.jpg": {
        alt: "Living room with closed facade and open interior view",
        room: "Living",
        caption: "Closed street facade; the view opens only once inside.",
      },
      "balcony1.jpg": {
        alt: "Rooftop terrace above the tree line",
        room: "Terrace",
        caption: "90 m² rooftop terrace, kept off the street.",
      },
      "bedroom.jpg": {
        alt: "Bedroom opening onto the rooftop terrace",
        room: "Bedroom",
        caption: "Master suite on the quiet side, door to terrace.",
      },
    },
  },
  {
    name: "Monolith Garden",
    folder: "monolith-garden",
    summary:
      "160 m² inward-facing apartment. Main rooms turn away from the street; private gate, separate from the core.",
    area: "160 m²",
    ceilingHeight: "3.40 m",
    layout: "Open living room, 2 en-suite bedrooms, gallery kitchen",
    access: "Private gate, separate from the street core",
    floorplan: "/monolith-garden/floorplan.pdf",
    imageMeta: {
      "living-room.jpg": {
        alt: "Living room oriented away from the street",
        room: "Living",
        caption: "Main rooms face inward, not the street.",
      },
      "balcony.jpg": {
        alt: "Balcony with outdoor seating",
        room: "Balcony",
        caption: "Private balcony off the living zone.",
      },
      "bedroom.jpg": {
        alt: "Bedroom set back from the street core",
        room: "Bedroom",
        caption: "Sleeping rooms behind the mass, away from the gate.",
      },
    },
  },
  {
    name: "The Silent Horizon",
    folder: "silent-horizon",
    summary:
      "Single-level, 110 m². Tree-line apartment — one floor, no shared corridor.",
    area: "110 m²",
    ceilingHeight: "3.20 m",
    layout: "Single-level plan, 2 bedrooms",
    access: "Discrete stair entry, no shared corridor",
    floorplan: "/silent-horizon/floorplan.pdf",
    imageMeta: {
      "living-room.jpg": {
        alt: "Living room with concrete, timber, and tree-line view",
        room: "Living",
        caption: "Single floor; tree line as the only outlook.",
      },
      "kitchen1.jpg": {
        alt: "Kitchen with stone island and daylight",
        room: "Kitchen",
        caption: "Daylit island; no corridor to reach it.",
      },
      "bedroom.jpg": {
        alt: "Bedroom facing the tree line",
        room: "Bedroom",
        caption: "Bedroom on the quiet side of the plan.",
      },
    },
  },
];
