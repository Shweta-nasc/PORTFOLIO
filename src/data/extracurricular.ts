import { FaBasketball, FaPersonRunning, FaMicrophoneLines, FaCode } from "react-icons/fa6";
import type { Extracurricular } from "@/types";

export const extracurriculars: Extracurricular[] = [
  {
    id: "basketball",
    title: "Basketball",
    category: "Varsity Sport",
    icon: FaBasketball,
    accent: "#f97316",
    description:
      "Represented the university at State-level and North Zone Inter-University tournaments.",
    highlights: ["State-level competitor", "North Zone Inter-University", "Team play & endurance"],
  },
  {
    id: "kabaddi",
    title: "Kabaddi",
    category: "Varsity Sport",
    icon: FaPersonRunning,
    accent: "#22c55e",
    description:
      "Competed for the university across State and North Zone Inter-University fixtures.",
    highlights: ["State-level competitor", "North Zone Inter-University", "Strategy & agility"],
  },
  {
    id: "public-speaking",
    title: "Public Speaking",
    category: "Communication",
    icon: FaMicrophoneLines,
    accent: "#a855f7",
    description:
      "Delivered competitive technical pitches and represented events in corporate-facing roles.",
    highlights: ["Hackathon pitch delivery", "Corporate relations outreach", "Audience engagement"],
  },
  {
    id: "competitive-programming",
    title: "Competitive Programming",
    category: "Problem Solving",
    icon: FaCode,
    accent: "#38bdf8",
    description:
      "An ongoing habit of daily problem solving across LeetCode, Codeforces, and GeeksforGeeks.",
    highlights: ["500+ problems solved", "Regular contest participation", "DSA fluency"],
  },
];
