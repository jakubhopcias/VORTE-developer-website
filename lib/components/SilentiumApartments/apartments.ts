export type ApartmentImage = {
  src: string;
  alt: string;
  room: string;
  caption: string;
};

export type Apartment = {
  name: string;
  headline: string[];
  images: ApartmentImage[];
  area: string;
  outdoor: string;
  ceilingHeight: string;
  layout: string;
  access: string;
};

export const apartments: Apartment[] = [
  {
    name: "The Obsidian Penthouse",
    headline: [
      "Enter the 285",
      "square meters of",
      "pure silence....",
    ],
    area: "285 m²",
    outdoor: "90 m² rooftop terrace",
    ceilingHeight: "3.80 m",
    layout: "Open living zone, 3 en-suite bedrooms, master wardrobe",
    access: "Direct private elevator with cryptographic key",
    images: [
      {
        src: "/obsidian/Gemini_Generated_Image_6pbccc6pbccc6pbc.jpg",
        alt: "Stone kitchen island opening onto the hills",
        room: "Kitchen",
        caption: "Designed for maximum space gain and styled for eco brutalism.",
      },
      {
        src: "/obsidian/Gemini_Generated_Image_t6zzdkt6zzdkt6zz.jpg",
        alt: "Living room with a closed facade and a lake view",
        room: "Living",
        caption: "A closed street facade. The view opens only once you are inside.",
      },
      {
        src: "/obsidian/balcony.jpg",
        alt: "Private rooftop terrace above the tree line",
        room: "Terrace",
        caption: "Ninety square meters of roof, planted and kept off the street.",
      },
    ],
  },
  {
    name: "Monolith Garden",
    headline: ["A courtyard", "the street", "never enters."],
    area: "160 m²",
    outdoor: "70 m² private courtyard",
    ceilingHeight: "3.40 m",
    layout: "Courtyard living room, 2 en-suite bedrooms, gallery kitchen",
    access: "Private courtyard gate, separate from the street core",
    images: [
      {
        src: "/monolith-garden/kitchen.jpg",
        alt: "Dark stone kitchen in Monolith Garden",
        room: "Kitchen",
        caption: "A gallery kitchen cut from one block of stone.",
      },
      {
        src: "/monolith-garden/Gemini_Generated_Image_azy184azy184azy1.jpg",
        alt: "Living room opening toward the private courtyard",
        room: "Living",
        caption: "The room turns inward, onto the courtyard, not the street.",
      },
      {
        src: "/monolith-garden/Gemini_Generated_Image_azy184azy184azy1%20(2).jpg",
        alt: "Bedroom with a dark timber wardrobe",
        room: "Bedroom",
        caption: "Sleeping rooms sit behind the mass, away from the gate.",
      },
    ],
  },
  {
    name: "The Silent Horizon",
    headline: ["One level,", "facing nothing", "but the trees."],
    area: "110 m²",
    outdoor: "45 m² tree-line terrace",
    ceilingHeight: "3.20 m",
    layout: "Single-level plan, 2 bedrooms, sleeping room on the trees",
    access: "Discrete stair from the garden, no shared corridor",
    images: [
      {
        src: "/silent-horizon/living-room.jpg",
        alt: "Living room with concrete, timber, and plants",
        room: "Living",
        caption: "A single floor. The garden is the only neighbour.",
      },
      {
        src: "/silent-horizon/Gemini_Generated_Image_y6bc1ay6bc1ay6bc.jpg",
        alt: "Bedroom with a timber headboard and hanging plants",
        room: "Bedroom",
        caption: "The sleeping room sits on the tree line, one step from the terrace.",
      },
      {
        src: "/silent-horizon/Gemini_Generated_Image_y6bc1ay6bc1ay6bc%20(1).jpg",
        alt: "Kitchen with a stone island and hanging plants",
        room: "Kitchen",
        caption: "Daylight across the island, and no corridor to reach it.",
      },
    ],
  },
];
