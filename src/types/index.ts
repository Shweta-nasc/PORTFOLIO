import type { ComponentType, SVGProps } from "react";

/**
 * Unified icon component type. Both `react-icons` and `lucide-react`
 * icons are SVG components that accept `className`, `size`, etc., so this
 * type lets the two libraries be used interchangeably in the data layer.
 */
export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: string | number; title?: string }
>;

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: IconComponent;
  handle?: string;
}

/* -------------------------------------------------------------------------- */
/*  Skills                                                                    */
/* -------------------------------------------------------------------------- */

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  name: string;
  level: SkillLevel;
  /** 0 - 100 proficiency used for the animated meter. */
  proficiency: number;
  icon?: IconComponent;
  color?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: IconComponent;
  accent: string;
  skills: Skill[];
}

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  period: string;
  category: string;
  status: "Live" | "In Progress" | "Archived" | "Prototype";
  cover: string;
  gallery?: string[];
  description: string;
  problem: string;
  approach: string;
  challenges: string;
  outcome: string;
  features: string[];
  stack: string[];
  metrics: ProjectMetric[];
  links: {
    github?: string;
    demo?: string;
    caseStudy?: string;
  };
  featured: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Experience & timeline                                                     */
/* -------------------------------------------------------------------------- */

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: "Open Source" | "Internship" | "Freelance" | "Leadership" | "Teaching";
  summary: string;
  highlights: string[];
  stack: string[];
}

/* -------------------------------------------------------------------------- */
/*  Achievements                                                              */
/* -------------------------------------------------------------------------- */

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  category: string;
  description: string;
  image?: string;
  link?: string;
  highlight?: string;
}

/* -------------------------------------------------------------------------- */
/*  Certifications                                                            */
/* -------------------------------------------------------------------------- */

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  credentialId?: string;
  credentialLink?: string;
  image?: string;
  logo?: string;
  skills: string[];
}

/* -------------------------------------------------------------------------- */
/*  Coding profiles                                                           */
/* -------------------------------------------------------------------------- */

export interface CodingProfile {
  id: string;
  platform: string;
  handle: string;
  icon: IconComponent;
  accent: string;
  url: string;
  stats: { label: string; value: string }[];
  badges?: string[];
}

/* -------------------------------------------------------------------------- */
/*  Leadership & extracurricular                                              */
/* -------------------------------------------------------------------------- */

export interface LeadershipRole {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  impact: string[];
  icon: IconComponent;
}

export interface Extracurricular {
  id: string;
  title: string;
  category: string;
  icon: IconComponent;
  accent: string;
  description: string;
  highlights: string[];
}

/* -------------------------------------------------------------------------- */
/*  Gallery                                                                   */
/* -------------------------------------------------------------------------- */

export type GalleryCategory =
  | "All"
  | "Hackathons"
  | "Achievements"
  | "College Life"
  | "Sports"
  | "Events"
  | "Travel";

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: Exclude<GalleryCategory, "All">;
  date?: string;
  /** Short subtitle shown on the card (e.g. venue / level). */
  location?: string;
  /** Longer copy shown in the fullscreen modal. */
  description?: string;
  tags?: string[];
}

/* -------------------------------------------------------------------------- */
/*  Stats, testimonials, FAQ                                                  */
/* -------------------------------------------------------------------------- */

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: IconComponent;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  relationship: string;
  quote: string;
  avatarInitials: string;
  accent: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TimelineMoment {
  id: string;
  year: string;
  title: string;
  description: string;
  tag: string;
}
