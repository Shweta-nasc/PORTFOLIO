# Shweta Singh — Personal Portfolio

A premium, highly interactive portfolio for a Computer Science undergraduate specializing in Artificial Intelligence. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Three.js — dark, futuristic, and fully content-driven.

> All content lives in `src/data/*.ts`. Update those files (and drop images into `public/images`) to personalize the site — you rarely need to touch a component.

---

## ✨ Highlights

- **Immersive hero** with a Three.js scene, animated typing effect, particle constellation background, and mouse parallax.
- **17 handcrafted sections** — each with a distinct layout: About, Skills, Currently, Projects (with case-study modal), Journey timeline, Experience, Achievements, Coding Profiles, Certifications, Leadership, Beyond-the-Code, Gallery (masonry + lightbox), Testimonials, FAQ, Contact.
- **Special features**: command palette (⌘K / Ctrl+K), custom cursor glow, scroll progress bar, animated loader, dark/light theme toggle, back-to-top, custom scrollbar.
- **Content-driven**: centralized data files + a `SmartImage` component that shows a tasteful gradient placeholder until you add real images.
- **Production-ready**: type-safe, accessible, SEO-optimized (Open Graph, Twitter cards, JSON-LD, sitemap, robots), and one-click deployable to Vercel or Netlify.

---

## 🧱 Tech Stack

| Area        | Tooling                                             |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 14 (App Router)                             |
| Language    | TypeScript                                          |
| Styling     | Tailwind CSS + custom design tokens                 |
| Animation   | Framer Motion                                       |
| 3D          | Three.js · @react-three/fiber · @react-three/drei   |
| Icons       | lucide-react · react-icons                          |
| Email       | @emailjs/browser (contact form)                     |
| Analytics   | @vercel/analytics                                   |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- npm 9+

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.example .env.local
# (optional — the site runs fine without it; see "Environment Variables")

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally   |
| `npm run lint`  | Run ESLint                           |

---

## 📁 Project Structure

```
.
├── public/
│   ├── images/            # Drop your images here (see public/images/README.md)
│   └── resume.pdf         # Replace with your real résumé
├── src/
│   ├── app/               # Next.js App Router (layout, page, SEO routes, globals)
│   │   ├── layout.tsx     # Fonts, metadata, JSON-LD, providers
│   │   ├── page.tsx       # Section composition
│   │   ├── globals.css    # Theme tokens, glassmorphism, scrollbar
│   │   ├── icon.svg       # Favicon
│   │   ├── sitemap.ts · robots.ts · manifest.ts
│   ├── components/
│   │   ├── layout/        # Navbar, Footer, ThemeToggle
│   │   ├── sections/      # One file per page section
│   │   ├── effects/       # Loader, CursorGlow, ParticleField, Hero3D, CommandPalette…
│   │   ├── ui/            # Reusable primitives (Button, Badge, TiltCard, SmartImage…)
│   │   └── providers/     # ThemeProvider
│   ├── data/              # ← ALL editable content lives here
│   ├── hooks/             # useTypewriter, useCounter, useActiveSection, useMediaQuery
│   ├── lib/               # cn() util, animation variants
│   └── types/             # Shared TypeScript interfaces
├── .env.example
└── tailwind.config.ts
```

---

## ✏️ Personalizing the Portfolio

Everything is data-driven. Edit files in `src/data/`:

| File                    | Controls                                              |
| ----------------------- | ----------------------------------------------------- |
| `config.ts`             | Name, roles, contact info, **social URLs**, nav, SEO  |
| `about.ts`              | Bio, mission, values, fun facts, "currently building" |
| `skills.ts`             | Skill categories, proficiency levels                  |
| `projects.ts`           | Featured projects + case-study details                |
| `experience.ts`         | Work / open-source timeline                           |
| `achievements.ts`       | Awards, hackathons, competitions                      |
| `certifications.ts`     | Certificates (starter entries — replace with yours)   |
| `coding-profiles.ts`    | LeetCode / Codeforces / GFG / CodeChef stats          |
| `leadership.ts`         | Leadership roles                                      |
| `extracurricular.ts`    | Sports, speaking, hobbies                             |
| `gallery.ts`            | Photo gallery items + categories                      |
| `moments.ts`            | Journey timeline                                      |
| `testimonials.ts`       | Quotes (replace with real ones)                       |
| `faq.ts`                | Recruiter FAQ                                          |
| `stats.ts`              | Animated quick-stat counters                          |

> **Action required:** the social links in `config.ts` use the placeholder handle `gdgshweta`. Replace them with your real profile URLs. Some certifications, testimonials, and coding stats are starter placeholders — swap in your real data.

### Adding images (drag & drop friendly)

1. Drop the file into the matching `public/images/<folder>` (e.g. `public/images/projects/`).
2. Reference its path in the relevant data file (e.g. `cover: "/images/projects/my-app.png"`).

That's it — no component edits. Until an image exists, a gradient placeholder is shown automatically. See `public/images/README.md` for the folder map.

---

## 🔐 Environment Variables

The site works with **zero configuration** — the contact form falls back to a `mailto:` link if EmailJS isn't set up.

To enable direct-send email, create `.env.local` (copy from `.env.example`):

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Get EmailJS values from [emailjs.com](https://www.emailjs.com/). Never commit `.env.local` — it's already git-ignored.

---

## ☁️ Deployment

### Vercel (recommended)

1. Push this repo to GitHub/GitLab.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add your environment variables in the project settings.
4. Deploy — Next.js is auto-detected. No extra config needed.

### Netlify

1. New site from Git.
2. Build command `npm run build`, publish directory `.next`.
3. Add the official **Next.js Runtime** plugin (`@netlify/plugin-nextjs`) and your env vars.

---

## ♿ Accessibility & Performance

- Semantic HTML, ARIA labels, and keyboard-navigable menus, modals, and command palette.
- Respects `prefers-reduced-motion` (animations and particles gracefully reduce).
- Lazy-loaded 3D scene (client-only) and images; static-generated pages for fast first load.
- Custom focus states and sufficient contrast in both themes.

> Note: full WCAG conformance should be verified with manual assistive-technology testing.

---

## 🛠️ Troubleshooting

| Problem                            | Fix                                                                 |
| ---------------------------------- | ------------------------------------------------------------------- |
| Images don't show                  | Confirm the file exists in `public/images/...` and the path matches. |
| Contact form opens the mail app    | Expected without EmailJS env vars — add them to send directly.       |
| 3D scene looks blank               | It's client-only; ensure JS is enabled. It's hidden on small screens. |
| `npm run build` fails after edits  | Run `npm run lint` and check the reported file/line.                 |

---

## 📄 License

Personal portfolio. Content © Shweta Singh. Feel free to use the structure as a reference for your own site.
