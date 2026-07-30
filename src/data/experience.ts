import type { ExperienceItem } from "@/types";

export const experiences: ExperienceItem[] = [
  {
    id: "gssoc-2026",
    role: "Open Source Contributor",
    organization: "GirlScript Summer of Code (GSSoC 2026)",
    location: "Remote",
    period: "May 2026 — Present",
    type: "Open Source",
    summary:
      "Full-stack engineering and version-control contributor across production-ready open-source repositories.",
    highlights: [
      "Identified structural layout anomalies, debugged modular code blocks, and improved codebase architectural compliance.",
      "Collaborated with maintainers and remote developer cohorts using advanced Git workflows — branching, merge-conflict resolution, and pull requests.",
      "Refactored client-side components to speed up asynchronous asset rendering and expanded developer documentation across multi-layered modules.",
    ],
    stack: ["Git", "React", "JavaScript", "Documentation", "Code Review"],
  },
  {
    id: "nagarsetu-lead",
    role: "Project Lead & Full-Stack Engineer",
    organization: "NagarSetu — Civic Tech Platform",
    location: "University of Allahabad",
    period: "Dec 2025",
    type: "Leadership",
    summary:
      "Led a 4-member agile squad building an AI-driven civic infrastructure reporting platform end to end.",
    highlights: [
      "Directed sprint planning, system architecture, and the final competitive technical pitch.",
      "Architected a backend priority-sorting algorithm that accelerated municipal response metrics by over 40%.",
      "Containerised the full stack with Docker and integrated Google Maps and Vision APIs on GCP.",
    ],
    stack: ["React.js", "Node.js", "MongoDB", "Docker", "GCP"],
  },
];
