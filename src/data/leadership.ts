import { Megaphone, Users, GitPullRequest } from "lucide-react";
import type { LeadershipRole } from "@/types";

export const leadershipRoles: LeadershipRole[] = [
  {
    id: "campus-ambassador",
    title: "Corporate Relations — Campus Ambassador",
    organization: "Renaissance 2025 · E-Cell, MNNIT",
    period: "2025",
    description:
      "Represented the fest to industry partners and drove campus outreach for one of the region's flagship entrepreneurship events.",
    impact: [
      "Owned corporate-relations outreach and partner communication",
      "Amplified event reach across the campus network",
      "Bridged student teams with external stakeholders",
    ],
    icon: Megaphone,
  },
  {
    id: "team-lead",
    title: "Project Lead — 4-Member Agile Squad",
    organization: "NagarSetu · University of Allahabad",
    period: "2025",
    description:
      "Commanded a four-person development team from ideation to a competitive technical pitch, owning architecture and delivery.",
    impact: [
      "Ran sprint planning and architectural decisions",
      "Delivered a 40%+ faster municipal-response system",
      "Presented the final competitive technical pitch",
    ],
    icon: Users,
  },
  {
    id: "oss-collaborator",
    title: "Open Source Collaborator",
    organization: "GirlScript Summer of Code 2026",
    period: "2026 — Present",
    description:
      "Worked alongside maintainers and remote developer cohorts, contributing code and documentation to production repositories.",
    impact: [
      "Coordinated with maintainers via Git workflows",
      "Resolved merge conflicts across active branches",
      "Improved documentation for multi-layered modules",
    ],
    icon: GitPullRequest,
  },
];
