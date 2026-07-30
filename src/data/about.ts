import {
  Sparkles,
  Target,
  Compass,
  ShieldCheck,
  Lightbulb,
  Coffee,
} from "lucide-react";
import type { IconComponent } from "@/types";

export const bio: string[] = [
  "I'm Shweta — a Computer Science undergraduate at the University of Allahabad, majoring in Artificial Intelligence. I like building systems that sit at the intersection of intelligent models and real, messy problems.",
  "Most of my work starts with a question: what decision is a human making manually today, and can software make it faster, fairer, or more transparent? That thread runs from spacecraft fault recovery to city parking enforcement.",
  "When I'm not shipping code, I'm on the basketball court, grinding competitive programming, or contributing to open source with maintainers around the world.",
];

export const mission =
  "To build AI systems that are not just accurate, but trustworthy — grounded, auditable, and genuinely useful to the people who depend on them.";

export interface ValueItem {
  title: string;
  description: string;
  icon: IconComponent;
}

export const coreValues: ValueItem[] = [
  {
    title: "Build with intent",
    description: "Every feature earns its place. I optimise for clarity over cleverness.",
    icon: Target,
  },
  {
    title: "Grounded intelligence",
    description: "AI should cite its reasoning. I favour auditable, explainable systems.",
    icon: ShieldCheck,
  },
  {
    title: "Stay curious",
    description: "From game theory to aerospace standards, I follow the problem wherever it leads.",
    icon: Compass,
  },
  {
    title: "Ship and iterate",
    description: "A working prototype in three days beats a perfect plan that never ships.",
    icon: Lightbulb,
  },
];

export const funFacts: string[] = [
  "Built an award-winning prototype in just 3 days at a hackathon.",
  "Varsity athlete in both Basketball and Kabaddi.",
  "Reduced spacecraft telemetry analysis time by ~80% with SENTINEL.",
  "Led a 4-member squad to a 40%+ faster civic-response system.",
];

export const interests: string[] = [
  "Applied AI & LLM systems",
  "Game theory & optimisation",
  "System design",
  "Open source",
  "Competitive programming",
  "Cloud & DevOps",
];

export interface CurrentlyBuildingItem {
  title: string;
  description: string;
  progress: number;
  tag: string;
}

export const currentlyBuilding: CurrentlyBuildingItem[] = [
  {
    title: "Grounded RAG toolkit",
    description: "A reusable retrieval layer for auditable, citation-first LLM answers.",
    progress: 62,
    tag: "AI",
  },
  {
    title: "GSSoC contributions",
    description: "Ongoing pull requests and documentation across production OSS repos.",
    progress: 78,
    tag: "Open Source",
  },
  {
    title: "DSA mastery track",
    description: "Pushing past 500 solved problems and climbing contest ratings.",
    progress: 70,
    tag: "Problem Solving",
  },
];

export interface LearningItem {
  title: string;
  type: "Book" | "Course" | "Paper" | "Focus";
  icon: IconComponent;
}

export const learningNow: LearningItem[] = [
  { title: "Designing Machine Learning Systems", type: "Book", icon: Sparkles },
  { title: "Retrieval-Augmented Generation research", type: "Paper", icon: Lightbulb },
  { title: "Distributed Systems fundamentals", type: "Course", icon: Compass },
  { title: "Advanced C++ for competitive programming", type: "Focus", icon: Coffee },
];
