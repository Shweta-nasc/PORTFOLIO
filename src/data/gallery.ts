import type { GalleryItem, GalleryCategory } from "@/types";

/** Emoji used on the carousel category badge. */
export const categoryEmoji: Record<Exclude<GalleryCategory, "All">, string> = {
  Hackathons: "💻",
  Achievements: "🏆",
  "College Life": "🎓",
  Sports: "🏀",
  Events: "🎪",
  Travel: "✈️",
};

/**
 * Moments shown in the 3D cylinder carousel. To add one, drop a photo in the
 * matching /public/images/<folder> and append an object here — no UI changes.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "Square Hacks 2.0",
    image: "/images/hackathons/square-hacks.jpg",
    category: "Hackathons",
    location: "IIT Delhi · National",
    description:
      "Selected among thousands as a Top 10 national finalist during the student-exchange initiative at IIT Delhi.",
    date: "2026",
    tags: ["Top 10", "National", "AI"],
  },
  {
    id: "g2",
    title: "TechJam 2.0",
    image: "/images/achievements/techjam.jpg",
    category: "Hackathons",
    location: "Microsoft, Noida HQ",
    description:
      "Earned a national runner-up podium at TechJam 2.0, hosted at the Microsoft Noida headquarters.",
    date: "2026",
    tags: ["Runner-up", "Microsoft"],
  },
  {
    id: "g3",
    title: "National Runner-up",
    image: "/images/achievements/techjam-podium.jpg",
    category: "Achievements",
    location: "TechJam 2.0",
    description: "On the podium — second place at a national-level engineering showdown.",
    date: "2026",
    tags: ["Podium", "Award"],
  },
  {
    id: "g4",
    title: "Inter-University Basketball",
    image: "/images/sports/basketball.jpg",
    category: "Sports",
    location: "University of Allahabad",
    description:
      "Represented the university at State-level and North Zone Inter-University basketball tournaments.",
    date: "2025",
    tags: ["Varsity", "North Zone"],
  },
  {
    id: "g5",
    title: "Campus Life",
    image: "/images/gallery/campus-1.jpg",
    category: "College Life",
    location: "Allahabad",
    description: "Late-night builds, chai breaks, and the people who make the grind worth it.",
    date: "2025",
    tags: ["Friends", "Campus"],
  },
  {
    id: "g6",
    title: "Renaissance 2025",
    image: "/images/events/renaissance.png",
    category: "Events",
    location: "E-Cell, MNNIT",
    description:
      "Served as corporate-relations Campus Ambassador for one of the region's flagship entrepreneurship fests.",
    date: "2025",
    tags: ["Ambassador", "E-Cell"],
  },
  {
    id: "g7",
    title: "CODEBLOCK Hackathon",
    image: "/images/achievements/codeblock.jpg",
    category: "Hackathons",
    location: "University of Allahabad",
    description: "Top 13 finish, recognised for outstanding AI and Blockchain architecture.",
    date: "2025",
    tags: ["Top 13", "AI", "Blockchain"],
  },
  {
    id: "g8",
    title: "Inter-University Kabaddi",
    image: "/images/sports/kabaddi.jpg",
    category: "Sports",
    location: "University of Allahabad",
    description: "Competed across State and North Zone Inter-University kabaddi fixtures.",
    date: "2025",
    tags: ["Varsity", "Strategy"],
  },
  {
    id: "g9",
    title: "Team Pitch Day",
    image: "/images/events/pitch-day.jpg",
    category: "Events",
    location: "NagarSetu",
    description: "Leading a four-member squad through the final competitive technical pitch.",
    date: "2025",
    tags: ["Leadership", "Pitch"],
  },
  {
    id: "g10",
    title: "Technothlon",
    image: "/images/achievements/technothlon.jpg",
    category: "Achievements",
    location: "IIT Guwahati",
    description: "City topper in Technothlon, the international school championship by IIT Guwahati.",
    date: "2023",
    tags: ["City Topper"],
  },
  {
    id: "g11",
    title: "College Fest",
    image: "/images/gallery/campus-2.jpg",
    category: "College Life",
    location: "Allahabad",
    description: "Festival lights, music, and a break from the terminal.",
    date: "2025",
    tags: ["Fest", "Memories"],
  },
  {
    id: "g12",
    title: "Into the Hills",
    image: "/images/travel/hills.jpg",
    category: "Travel",
    location: "Himalayan foothills",
    description: "Trading screens for ridgelines — the landscape that inspires this very portfolio.",
    date: "2024",
    tags: ["Travel", "Mountains"],
  },
];
