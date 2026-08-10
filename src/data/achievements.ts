import type { Achievement } from "@/types";

/**
 * Achievements render from this list into the timeline. Add a `image` path
 * (drop the file in /public/images/achievements) to show a photo/trophy.
 */
export const achievements: Achievement[] = [
  {
    id: "square-hacks",
    title: "Top 10 National Finalist",
    organization: "Square Hacks 2.0 · IIT Delhi",
    date: "2026",
    category: "Hackathon",
    highlight: "Top 10",
    description:
      "Selected among thousands of participants as a national finalist during the student exchange initiative at IIT Delhi.",
    image: "/images/achievements/square-hacks.jpg",
  },
  {
    id: "techjam",
    title: "National Runner-up",
    organization: "TechJam 2.0 · Microsoft, Noida HQ",
    date: "2026",
    category: "Hackathon",
    highlight: "Rank #2",
    description:
      "Earned a podium finish at TechJam 2.0, hosted at the Microsoft Noida headquarters.",
    image: "/images/achievements/techjam.jpg",
  },
  {
    id: "codeblock",
    title: "Top 13 Winner",
    organization: "CODEBLOCK Hackathon · University of Allahabad",
    date: "2025",
    category: "Hackathon",
    highlight: "Top 13",
    description:
      "Recognised in elite standing for outstanding AI and Blockchain architecture.",
    image: "/images/achievements/codeblock.jpg",
  },
  {
    id: "technothlon",
    title: "City Topper",
    organization: "Technothlon · IIT Guwahati",
    date: "2023",
    category: "Competition",
    highlight: "City Rank #1",
    description:
      "Attained the top city rank in Technothlon, the international school championship administered by IIT Guwahati.",
    image: "/images/certificates/CityTopper.jpg",
  },
  {
    id: "campus-ambassador",
    title: "Campus Ambassador — Corporate Relations",
    organization: "Renaissance 2025 · E-Cell, MNNIT",
    date: "2025",
    category: "Leadership",
    highlight: "Ambassador",
    description:
      "Appointed to the corporate-relations campus ambassador role for Renaissance 2025 through E-Cell MNNIT.",
    image: "/images/events/renaissance.jpg",
  },
  {
    id: "varsity-athlete",
    title: "Varsity Athlete — State & North Zone",
    organization: "Inter-University Tournaments",
    date: "2024 — 2025",
    category: "Sports",
    highlight: "Varsity",
    description:
      "Represented the university in State-level and North Zone Inter-University tournaments for Basketball and Kabaddi.",
    image: "/images/achievements/varsity.jpg",
  },
];
