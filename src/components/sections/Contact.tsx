"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { personal, socials, links } from "@/data/config";
import { slideInLeft, slideInRight } from "@/lib/animations";
import { DeviceShowcase } from "@/components/effects/showcase/DeviceShowcase";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

type Status = "idle" | "sending" | "success" | "error";

const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    // If EmailJS is configured, send through it. Otherwise fall back to mailto.
    if (EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey) {
      try {
        setStatus("sending");
        setError("");
        const { default: emailjs } = await import("@emailjs/browser");
        await emailjs.sendForm(
          EMAILJS.serviceId,
          EMAILJS.templateId,
          form,
          EMAILJS.publicKey,
        );
        setStatus("success");
        form.reset();
      } catch {
        setStatus("error");
        setError("Something went wrong. Please email me directly.");
      }
    } else {
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
      setStatus("success");
    }
  }

  const contactInfo = [
    { icon: Mail, label: "Email", value: personal.email, href: links.email },
    { icon: Phone, label: "Phone", value: personal.phone, href: `tel:${personal.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Location", value: personal.location },
  ];

  return (
    <Section id="contact">
      <SectionHeading
        index="10"
        eyebrow="Contact"
        title="Let's build something great together"
        description="Have a role, a project, or an idea? My inbox is open — I usually reply within a day."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Info */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-4"
        >
          <div className="card-surface p-6">
            <div className="mb-5 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-emerald-400">{personal.availability}</span>
            </div>

            <div className="flex flex-col gap-4">
              {contactInfo.map((c) => {
                const content = (
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                      <p className="text-sm font-medium">{c.value}</p>
                    </div>
                  </div>
                );
                return c.href ? (
                  <a key={c.label} href={c.href} className="transition-opacity hover:opacity-80">
                    {content}
                  </a>
                ) : (
                  <div key={c.label}>{content}</div>
                );
              })}
            </div>
          </div>

          <div className="card-surface p-6">
            <p className="mb-4 text-sm font-semibold">Find me online</p>
            <div className="grid grid-cols-4 gap-3">
              {socials.slice(0, 8).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group flex aspect-square items-center justify-center rounded-2xl border border-white/8 bg-white/[0.02] text-muted-foreground transition-all hover:-translate-y-1 hover:border-accent/40 hover:text-accent"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="card-surface flex flex-col gap-5 p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" placeholder="Your name" required />
            <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <Field label="Subject" name="subject" placeholder="What's this about?" />
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="Tell me about the opportunity or idea..."
              className="resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/50 focus:bg-white/[0.05]"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember-from to-ember-to px-6 py-3.5 font-medium text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Send Message
              </>
            )}
          </button>

          {status === "success" && (
            <p className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Thanks — your message is on its way.
            </p>
          )}
          {status === "error" && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
        </motion.form>
      </div>

      {/* Premium 3D device showcase — the section's final visual flourish.
          Boundary-wrapped so a WebGL failure never breaks the contact form. */}
      <ErrorBoundary name="DeviceShowcase">
        <DeviceShowcase />
      </ErrorBoundary>
    </Section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent/50 focus:bg-white/[0.05]"
      />
    </div>
  );
}
