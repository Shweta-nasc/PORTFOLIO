import type { MetadataRoute } from "next";
import { personal, siteMeta } from "@/data/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${personal.name} — Portfolio`,
    short_name: personal.name,
    description: siteMeta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#09090f",
    theme_color: "#09090f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
