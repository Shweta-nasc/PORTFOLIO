/**
 * ─────────────────────────────────────────────────────────────────────────
 *  CENTRALIZED SITE CONFIGURATION — single source of truth
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Every piece of personal data on the site lives in the `@/data/*` modules
 *  and is aggregated here into one object, so a component can pull anything it
 *  needs from a single import:
 *
 *      import { siteConfig } from "@/config/site";
 *      siteConfig.personal.email
 *      siteConfig.certifications
 *
 *  ...or grab a specific slice via the named re-exports:
 *
 *      import { personal, certifications } from "@/config/site";
 *
 *  RULE: never hardcode personal information (name, contact, links, resume,
 *  achievements, certificates, coding profiles, images, dates …) inside a
 *  component. Add it here / in the data layer and read it from this config.
 *
 *  NOTE: the data intentionally stays split across `@/data/*` files by domain
 *  for maintainability; this module is the unified entry point that composes
 *  them. Data modules must never import from here (would create a cycle).
 */

import {
  personal,
  education,
  links,
  socials,
  navItems,
  siteMeta,
} from "@/data/config";
import {
  bio,
  mission,
  coreValues,
  funFacts,
  interests,
  currentlyBuilding,
  learningNow,
} from "@/data/about";
import { stats } from "@/data/stats";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { experiences } from "@/data/experience";
import { achievements } from "@/data/achievements";
import { certifications } from "@/data/certifications";
import { profile, codingPlatforms } from "@/config/profile";
import { leadershipRoles } from "@/data/leadership";
import { extracurriculars } from "@/data/extracurricular";
import { faqs } from "@/data/faq";
import { galleryItems, categoryEmoji } from "@/data/gallery";
import { testimonials } from "@/data/testimonials";
import { moments } from "@/data/moments";
import { journalPages, journalMeta } from "@/data/journal";

/** The complete, unified site configuration. */
export const siteConfig = {
  // Identity & contact
  personal,
  education,
  links,
  socials,
  contact: {
    email: personal.email,
    phone: personal.phone,
    location: personal.location,
    availability: personal.availability,
  },
  resume: personal.resumePath,

  // Navigation & metadata
  nav: navItems,
  meta: siteMeta,

  // Narrative
  about: {
    bio,
    mission,
    coreValues,
    funFacts,
    interests,
    currentlyBuilding,
    learningNow,
  },

  // Content collections
  stats,
  projects,
  skills: skillCategories,
  experience: experiences,
  achievements,
  certifications,
  /** Coding platform usernames + presentation meta (live stats fetched at runtime). */
  profile,
  codingPlatforms,
  leadership: leadershipRoles,
  extracurricular: extracurriculars,
  gallery: { items: galleryItems, categoryEmoji },
  testimonials,
  faqs,
  moments,
  journal: { pages: journalPages, meta: journalMeta },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Named re-exports — a component can import exactly the slice it needs from
 * this single module instead of reaching into individual data files.
 */
export {
  // identity & contact
  personal,
  education,
  links,
  socials,
  navItems,
  siteMeta,
  // narrative
  bio,
  mission,
  coreValues,
  funFacts,
  interests,
  currentlyBuilding,
  learningNow,
  // collections
  stats,
  projects,
  skillCategories,
  experiences,
  achievements,
  certifications,
  profile,
  codingPlatforms,
  leadershipRoles,
  extracurriculars,
  faqs,
  galleryItems,
  categoryEmoji,
  testimonials,
  moments,
  journalPages,
  journalMeta,
};
