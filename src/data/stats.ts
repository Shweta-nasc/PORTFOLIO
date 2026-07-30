import {
  Rocket,
  Code2,
  Trophy,
  GitPullRequest,
  BadgeCheck,
  CalendarClock,
} from "lucide-react";
import type { StatItem } from "@/types";

/** Quick stats shown as animated counters. Update the numbers as they grow. */
export const stats: StatItem[] = [
  { id: "projects", label: "Projects Built", value: 15, suffix: "+", icon: Rocket },
  { id: "problems", label: "DSA Problems Solved", value: 500, suffix: "+", icon: Code2 },
  { id: "hackathons", label: "Hackathons", value: 6, suffix: "+", icon: Trophy },
  { id: "prs", label: "Open Source PRs", value: 20, suffix: "+", icon: GitPullRequest },
  { id: "certs", label: "Certifications", value: 6, suffix: "+", icon: BadgeCheck },
  { id: "years", label: "Years Coding", value: 3, suffix: "+", icon: CalendarClock },
];
