import { Hammer, GraduationCap, BookMarked, ScrollText, Target } from "lucide-react";
import type { IconComponent } from "@/types";

export interface JournalEntry {
  label: string;
  note?: string;
}

export interface JournalPage {
  id: string;
  title: string;
  icon: IconComponent;
  entries: JournalEntry[];
}

/**
 * Content for the interactive engineering journal. Add/edit entries here —
 * the book renders straight from this list.
 */
export const journalPages: JournalPage[] = [
  {
    id: "building",
    title: "Currently Building",
    icon: Hammer,
    entries: [
      { label: "GeoVigil", note: "Geospatial anomaly monitoring" },
      { label: "ParkVision", note: "AI parking-enforcement intelligence" },
      { label: "This Portfolio", note: "A living, cinematic journal" },
      { label: "Current progress", note: "Shipping weekly, iterating fast" },
    ],
  },
  {
    id: "learning",
    title: "Learning",
    icon: GraduationCap,
    entries: [
      { label: "Computer Vision", note: "Detection & segmentation" },
      { label: "System Design", note: "Scalable, resilient services" },
      { label: "AWS", note: "Cloud architecture & deployment" },
      { label: "MLOps", note: "From notebook to production" },
      { label: "Backend", note: "APIs, data, performance" },
    ],
  },
  {
    id: "books",
    title: "On the Shelf",
    icon: BookMarked,
    entries: [
      { label: "Designing Machine Learning Systems", note: "Chip Huyen" },
      { label: "Clean Code", note: "Robert C. Martin" },
      { label: "Designing Data-Intensive Applications", note: "Martin Kleppmann" },
      { label: "Grokking Algorithms", note: "Aditya Bhargava" },
      { label: "The Pragmatic Programmer", note: "Hunt & Thomas" },
    ],
  },
  {
    id: "research",
    title: "Research Papers",
    icon: ScrollText,
    entries: [
      { label: "Interesting AI papers", note: "Weekly reading list" },
      { label: "System Design papers", note: "Real-world architectures" },
      { label: "LLM research", note: "Reasoning & alignment" },
      { label: "RAG", note: "Grounded, citable retrieval" },
      { label: "Optimization", note: "Game theory & scheduling" },
    ],
  },
  {
    id: "goals",
    title: "Goals",
    icon: Target,
    entries: [
      { label: "Summer roadmap", note: "Depth over breadth" },
      { label: "Upcoming projects", note: "Two ships in the pipeline" },
      { label: "Hackathons", note: "Chasing the next podium" },
      { label: "Career goals", note: "Research-grade AI engineering" },
    ],
  },
];

export const journalMeta = {
  title: "My Engineering Journal",
  subtitle: "Projects • Learning • Research",
} as const;
