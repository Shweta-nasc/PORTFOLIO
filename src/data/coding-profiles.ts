import { SiLeetcode, SiCodeforces, SiGeeksforgeeks, SiCodechef } from "react-icons/si";
import type { CodingProfile } from "@/types";
import { links } from "./config";

/**
 * Update the `stats` values with your current numbers. The LeetCode card can
 * also pull live stats client-side when NEXT_PUBLIC_LEETCODE_USERNAME is set.
 */
export const codingProfiles: CodingProfile[] = [
  {
    id: "leetcode",
    platform: "LeetCode",
    handle: "@gdgshweta",
    icon: SiLeetcode,
    accent: "#FFA116",
    url: links.leetcode,
    stats: [
      { label: "Problems Solved", value: "350+" },
      { label: "Contest Rating", value: "1750" },
      { label: "Global Rank", value: "Top 15%" },
    ],
    badges: ["100 Days Badge", "SQL 50", "Top Interview 150"],
  },
  {
    id: "codeforces",
    platform: "Codeforces",
    handle: "@gdgshweta",
    icon: SiCodeforces,
    accent: "#1F8ACB",
    url: links.codeforces,
    stats: [
      { label: "Max Rating", value: "1400+" },
      { label: "Rank", value: "Specialist" },
      { label: "Contests", value: "25+" },
    ],
    badges: ["Div 2 Regular", "Virtual Contests"],
  },
  {
    id: "geeksforgeeks",
    platform: "GeeksforGeeks",
    handle: "@gdgshweta",
    icon: SiGeeksforgeeks,
    accent: "#2F8D46",
    url: links.geeksforgeeks,
    stats: [
      { label: "Problems Solved", value: "200+" },
      { label: "Coding Score", value: "600+" },
      { label: "Streak", value: "80 days" },
    ],
    badges: ["DSA Self-Paced", "POTD Streak"],
  },
  {
    id: "codechef",
    platform: "CodeChef",
    handle: "@gdgshweta",
    icon: SiCodechef,
    accent: "#5B4638",
    url: "https://www.codechef.com/users/gdgshweta",
    stats: [
      { label: "Rating", value: "3★" },
      { label: "Contests", value: "15+" },
      { label: "Global Rank", value: "Top 20%" },
    ],
    badges: ["Long Challenge", "Cook-Off"],
  },
];
