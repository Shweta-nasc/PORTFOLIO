# Image Assets

Drop your images into the matching folder, then reference the path in the
corresponding file under `src/data/`. No component changes are needed — until a
real image exists, the UI shows a gradient placeholder automatically.

## Folder map

| Folder          | Used by / data file                    | Example path                              |
| --------------- | -------------------------------------- | ----------------------------------------- |
| `profile/`      | About portrait (`config` / About)      | `/images/profile/portrait.jpg`            |
| `projects/`     | `data/projects.ts` (cover + gallery)   | `/images/projects/sentinel-cover.png`     |
| `certificates/` | `data/certifications.ts`               | `/images/certificates/machine-learning.jpg` |
| `achievements/` | `data/achievements.ts`                 | `/images/achievements/techjam.jpg`        |
| `gallery/`      | `data/gallery.ts` (College Life, etc.) | `/images/gallery/campus-1.jpg`            |
| `hackathons/`   | `data/gallery.ts` (Hackathons)         | `/images/hackathons/square-hacks.jpg`     |
| `sports/`       | `data/gallery.ts` (Sports)             | `/images/sports/basketball.jpg`           |
| `events/`       | `data/gallery.ts` (Events)             | `/images/events/renaissance.jpg`          |
| `travel/`       | `data/gallery.ts` (Travel)             | `/images/travel/hills.jpg`                |
| `leadership/`   | leadership visuals (optional)          | `/images/leadership/team.jpg`             |
| `blogs/`        | future blog thumbnails                 | `/images/blogs/post-1.jpg`                |
| `companies/`    | experience/company logos               | `/images/companies/logo.png`              |
| `logos/`        | certificate issuer logos               | `/images/logos/coursera.png`              |

## Tips

- **Formats**: prefer `.webp` or `.avif` for photos, `.png` for logos/diagrams.
- **Aspect ratios**: project covers look best at 16:9 or 2:1; the portrait uses 4:5.
- **Optimize** large photos before adding them (keep individual files < ~500 KB where possible).
- **Social preview**: add `/images/og-image.png` (1200×630) for link previews.

> The `.gitkeep` files just keep empty folders in version control — you can leave them or delete them once a folder has real images.
