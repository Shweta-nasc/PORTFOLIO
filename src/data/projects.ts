import type { Project } from "@/types";

/**
 * Projects are rendered directly from this list. To add a project, append a
 * new object — no component changes required. Drop cover/gallery images into
 * /public/images/projects and reference them by path.
 */
export const projects: Project[] = [
  {
    id: "parkvision-saathi",
    title: "ParkVision-Saathi",
    tagline: "AI-Powered Parking Enforcement Intelligence",
    period: "Jun 2026",
    category: "AI · Smart City",
    status: "Prototype",
    cover: "/images/projects/parkvision-cover.png",
    gallery: [
      "/images/projects/parkvision-1.png",
      "/images/projects/parkvision-2.png",
    ],
    description:
      "A decision-intelligence system built for the Bengaluru Traffic Police that quantifies illegal parking and recommends where to deploy limited patrol teams.",
    problem:
      "Traffic authorities lack an objective way to rank which zones suffer most from illegal parking, so patrol resources are allocated reactively instead of where impact is highest.",
    approach:
      "Designed a proprietary 6-factor Congestion Impact Score (0–100) per zone, then layered predictive analytics to forecast violation hotspots and a Stackelberg game-theory optimizer with waterbed-spillover simulation to allocate patrols.",
    challenges:
      "Modelling enforcement as a leader–follower game meant reasoning about how offenders relocate when one zone is patrolled — the spillover simulation had to stay stable while optimising across scarce teams under a 3-day hackathon clock.",
    outcome:
      "Delivered a scalable open-source (MIT) prototype that projects up to a 25% reduction in parking-induced congestion through proactive deployment.",
    features: [
      "6-factor Congestion Impact Score per zone",
      "Predictive violation-hotspot forecasting",
      "Stackelberg game-theory patrol optimizer",
      "Waterbed spillover simulation",
      "FastAPI service with an analyst dashboard",
    ],
    stack: ["Python", "FastAPI", "Machine Learning", "Game Theory", "Pandas"],
    metrics: [
      { label: "Congestion reduction", value: "≈25%" },
      { label: "Build time", value: "3 days" },
      { label: "Impact factors", value: "6" },
    ],
    links: {
      github: "https://github.com/gdgshweta/parkvision-saathi",
      demo: "#",
      caseStudy: "#projects",
    },
    featured: true,
  },
  {
    id: "sentinel",
    title: "SENTINEL",
    tagline: "Autonomous Spacecraft FDIR Agent",
    period: "Jun 2026",
    category: "AI · Aerospace",
    status: "Prototype",
    cover: "/images/projects/sentinel-cover.png",
    gallery: [
      "/images/projects/sentinel-1.png",
      "/images/projects/sentinel-2.png",
    ],
    description:
      "A Gemini-first, model-agnostic fault detection, isolation and recovery (FDIR) agent that helps ground operators diagnose spacecraft safe-mode events.",
    problem:
      "When a spacecraft enters safe mode, operators manually sift through raw telemetry and crash dumps — a slow, error-prone process during safety-critical windows.",
    approach:
      "Combined statistical Z-score anomaly detection over crash dumps and pre-fault telemetry with a hybrid RAG pipeline grounded in ECSS standards, so every recommendation traces back to an auditable procedure.",
    challenges:
      "Safety-critical reasoning cannot hallucinate. Grounding the LLM in retrieved ECSS procedures while keeping latency low — and surfacing the causal chain transparently — was the core engineering tension.",
    outcome:
      "Cut manual telemetry analysis time by an estimated 80% and shipped an interactive UI featuring a Causal DAG and a Risk-Assessed Recovery Plan with streamed reasoning traces.",
    features: [
      "Z-score anomaly detection on raw telemetry",
      "Hybrid RAG over ECSS standards",
      "Causal DAG visualisation",
      "Risk-assessed recovery planning",
      "Streaming, auditable reasoning traces",
    ],
    stack: ["Python", "RAG", "LLM", "Anomaly Detection", "Gemini"],
    metrics: [
      { label: "Analysis time saved", value: "≈80%" },
      { label: "Grounding source", value: "ECSS" },
      { label: "Model strategy", value: "Agnostic" },
    ],
    links: {
      github: "https://github.com/gdgshweta/sentinel",
      demo: "#",
      caseStudy: "#projects",
    },
    featured: true,
  },
  {
    id: "nagarsetu",
    title: "NagarSetu",
    tagline: "AI-Driven Civic Architecture Platform",
    period: "Dec 2025",
    category: "Full-Stack · Civic Tech",
    status: "Live",
    cover: "/images/projects/nagarsetu-cover.png",
    gallery: [
      "/images/projects/nagarsetu-1.png",
      "/images/projects/nagarsetu-2.png",
    ],
    description:
      "A full-stack, REST-compliant platform for real-time tracking, triage and automated cloud reporting of regional civic infrastructure issues.",
    problem:
      "Municipal issue reporting is fragmented and slow — citizen complaints pile up without prioritisation, delaying response to the problems that matter most.",
    approach:
      "Built a containerised React + Node stack with asynchronous geo-tagging via Google Maps API and image classification through Google Vision on GCP, feeding a backend priority-sorting algorithm that ranks incoming issues.",
    challenges:
      "Coordinating asynchronous geo-telemetry, automated visual validation and a fair prioritisation model — while keeping the whole stack reproducible across environments through Docker — required careful service boundaries.",
    outcome:
      "Accelerated municipal response metrics by over 40% and was delivered by a 4-member agile squad I led through sprint planning, architecture and the final technical pitch.",
    features: [
      "Real-time civic issue tracking & triage",
      "Async geo-tagging with Google Maps API",
      "Automated validation via Google Vision API",
      "Priority-sorting algorithm for response",
      "Fully Dockerised, cross-platform stack",
    ],
    stack: ["React.js", "Node.js", "MongoDB", "Docker", "GCP", "Google Vision"],
    metrics: [
      { label: "Faster response", value: "40%+" },
      { label: "Team size", value: "4 (lead)" },
      { label: "Deploy", value: "Containerised" },
    ],
    links: {
      github: "https://github.com/gdgshweta/nagarsetu",
      demo: "#",
      caseStudy: "#projects",
    },
    featured: true,
  },
];
