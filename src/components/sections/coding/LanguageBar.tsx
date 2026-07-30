"use client";

import { motion } from "framer-motion";
import type { GitHubLanguage } from "@/services/coding/types";

/** Well-known language brand colors; anything else falls back to the accent. */
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
  Dockerfile: "#384d54",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Vue: "#41b883",
  Dart: "#00B4AB",
  SCSS: "#c6538c",
};

export function LanguageBar({
  languages,
  accent,
}: {
  languages: GitHubLanguage[];
  accent: string;
}) {
  if (languages.length === 0) return null;
  const color = (name: string) => LANG_COLORS[name] ?? accent;

  return (
    <div>
      {/* Stacked proportion bar */}
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        {languages.map((l, i) => (
          <motion.span
            key={l.name}
            initial={{ width: 0 }}
            whileInView={{ width: `${l.percent}%` }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: color(l.name) }}
            title={`${l.name} · ${l.percent}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
        {languages.map((l) => (
          <li key={l.name} className="flex items-center gap-1.5 text-[11px] text-foreground/75">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color(l.name) }} />
            {l.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
