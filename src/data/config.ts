import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaDiscord,
  FaEnvelope,
} from "react-icons/fa6";
import { SiLeetcode, SiCodeforces, SiGeeksforgeeks } from "react-icons/si";
import type { NavItem, SocialLink } from "@/types";

/**
 * Single source of truth for personal information.
 * Update the values here and the entire site reflects the change.
 */
export const personal = {
  name: "Shweta Singh",
  firstName: "Shweta",
  lastName: "Singh",
  initials: "SS",
  title: "Computer Science Undergraduate",
  subtitle: "Artificial Intelligence Major",
  tagline:
    "I build AI-driven systems and full-stack products that turn ambitious ideas into resilient, real-world software.",
  location: "Prayagraj, Uttar Pradesh, India",
  email: "gdgshweta@gmail.com",
  phone: "+91 8707377565",
  availability: "Open to Summer 2027 internships & collaborations",
  resumePath: "/resume.pdf",
  /** Roles cycled through by the hero typing animation. */
  roles: [
    "AI Engineer",
    "Software Developer",
    "Problem Solver",
    "Open Source Contributor",
    "Tech Explorer",
    "Cloud Enthusiast",
  ],
  /** Short descriptors shown beneath the name in the hero. */
  descriptors: [
    "Computer Science Student",
    "AI Enthusiast",
    "Software Developer",
    "Open Source Contributor",
    "Competitive Programmer",
  ],
  /** Professional headline — used in metadata & schema.org structured data. */
  jobTitle: "AI Engineer & Software Developer",
  /** Areas of expertise — feeds schema.org `knowsAbout`. */
  expertise: [
    "Artificial Intelligence",
    "Machine Learning",
    "Full-Stack Development",
    "Competitive Programming",
  ],
  /** Portrait assets (kept here so no component hardcodes an image path). */
  portrait: "/images/profile/portrait.png", // transparent cutout — hero
  photo: "/images/profile/portrait.jpg", // framed photo — about card
} as const;

export const education = {
  institute: "J.K. Institute of Applied Physics & Technology",
  university: "University of Allahabad",
  degree: "B.Tech, Computer Science & Engineering (AI Major)",
  duration: "2024 — 2028",
  sgpa: "7.80 / 10",
  location: "Prayagraj, India",
  school: [
    { level: "Class XII (Senior Secondary)", score: "89%" },
    { level: "Class X (Secondary)", score: "93%" },
  ],
} as const;

/**
 * External profile URLs.
 * NOTE: Replace the placeholder handles with the real profile URLs.
 */
export const links = {
  github: "https://github.com/Shweta-nasc",
  linkedin: "https://www.linkedin.com/in/shweta-singh-903188329/",
  leetcode: "https://leetcode.com/u/Rookie_engicoder/",
  codeforces: "https://codeforces.com/profile/RookieCodes_0805",
  geeksforgeeks: "https://www.geeksforgeeks.org/profile/shwetasi85do",
  codechef: "https://www.codechef.com/users/gdgshweta",
  twitter: "https://twitter.com/gdgshweta",
  discord: "https://discord.com/users/gdgshweta",
  email: "mailto:gdgshweta@gmail.com",
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", href: links.github, icon: FaGithub, handle: "@gdgshweta" },
  {
    label: "LinkedIn",
    href: links.linkedin,
    icon: FaLinkedinIn,
    handle: "Shweta Singh",
  },
  {
    label: "LeetCode",
    href: links.leetcode,
    icon: SiLeetcode,
    handle: "@gdgshweta",
  },
  {
    label: "Codeforces",
    href: links.codeforces,
    icon: SiCodeforces,
    handle: "@gdgshweta",
  },
  {
    label: "GeeksforGeeks",
    href: links.geeksforgeeks,
    icon: SiGeeksforgeeks,
    handle: "@gdgshweta",
  },
  { label: "Email", href: links.email, icon: FaEnvelope, handle: personal.email },
  { label: "Twitter", href: links.twitter, icon: FaXTwitter, handle: "@gdgshweta" },
  { label: "Discord", href: links.discord, icon: FaDiscord, handle: "gdgshweta" },
];

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Coding", href: "#coding" },
  { label: "Leadership", href: "#leadership" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export const siteMeta = {
  title: "Shweta Singh — AI Engineer & Software Developer",
  description:
    "Portfolio of Shweta Singh, a Computer Science undergraduate specializing in Artificial Intelligence. AI systems, full-stack engineering, open source, and competitive programming.",
  keywords: [
    "Shweta Singh",
    "AI Engineer",
    "Software Developer",
    "Machine Learning",
    "Computer Science Portfolio",
    "Open Source",
    "Full Stack Developer",
    "University of Allahabad",
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shwetasingh.dev",
  ogImage: "/images/og-image.png",
} as const;
