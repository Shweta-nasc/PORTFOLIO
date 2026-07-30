import type { Certification } from "@/types";

/**
 * Certificate entries reused by the Certificates carousel.
 *
 * PLACEHOLDERS: images point at /public/images/certificates/*.jpg and issuer
 * logos at /public/images/logos/*.png — drop the real files there and they
 * appear automatically (SmartImage shows a labelled placeholder until then).
 * `credentialLink` is "#" where no verification URL exists yet; the modal's
 * "Verify" button only renders once a real URL is filled in.
 */
export const certifications: Certification[] = [
  {
    id: "cert-ml",
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.AI · Coursera",
    date: "2025",
    category: "AI",
    credentialId: "",
    credentialLink: "#",
    image: "/images/certificates/machine-learning.jpg",
    logo: "/images/logos/coursera.png",
    skills: ["Supervised Learning", "Neural Networks", "Model Tuning"],
  },
  {
    id: "cert-gcp",
    title: "Google Cloud Fundamentals: Core Infrastructure",
    issuer: "Google Cloud",
    date: "2025",
    category: "Cloud",
    credentialId: "",
    credentialLink: "#",
    image: "/images/certificates/gcp-fundamentals.jpg",
    logo: "/images/logos/google-cloud.png",
    skills: ["GCP", "Compute", "Cloud Storage"],
  },
  {
    id: "cert-react",
    title: "Front-End Development with React",
    issuer: "Meta · Coursera",
    date: "2025",
    category: "Web Development",
    credentialId: "",
    credentialLink: "#",
    image: "/images/certificates/react.jpg",
    logo: "/images/logos/meta.png",
    skills: ["React", "Hooks", "Component Design"],
  },
  {
    id: "cert-dsa",
    title: "Data Structures & Algorithms",
    issuer: "GeeksforGeeks",
    date: "2025",
    category: "Programming",
    credentialId: "",
    credentialLink: "#",
    image: "/images/certificates/dsa.jpg",
    logo: "/images/logos/gfg.png",
    skills: ["DSA", "Problem Solving", "Complexity Analysis"],
  },
  {
    id: "cert-python",
    title: "Python for Data Science",
    issuer: "IBM · Coursera",
    date: "2024",
    category: "AI",
    credentialId: "",
    credentialLink: "#",
    image: "/images/certificates/python-ds.jpg",
    logo: "/images/logos/ibm.png",
    skills: ["Python", "Pandas", "NumPy"],
  },
  {
    id: "cert-git",
    title: "Version Control with Git",
    issuer: "Atlassian · Coursera",
    date: "2024",
    category: "Programming",
    credentialId: "",
    credentialLink: "#",
    image: "/images/certificates/git.jpg",
    logo: "/images/logos/git.png",
    skills: ["Git", "Branching", "Collaboration"],
  },
];
