import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Vantage",
  description: "Start a project with Vantage. We make brands move.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 pt-32 pb-20 md:px-10 md:pt-40">
      <div className="mx-auto grid max-w-[1500px] gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mb-8 text-xs uppercase tracking-widest text-muted">
            Start a project
          </p>
          <h1 className="font-display text-6xl font-semibold leading-[0.9] tracking-tight text-offwhite md:text-8xl">
            Let&rsquo;s make
            <br />
            <span className="text-accent">something.</span>
          </h1>
          <p className="mt-8 max-w-sm text-muted">
            Tell us what you&rsquo;re building. We take on a handful of projects
            at a time — the ambitious ones.
          </p>

          <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest text-offwhite">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for new projects
          </div>

          <div className="mt-12 space-y-4 border-t border-border pt-8 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Email</span>
              <a
                href="mailto:hello@vantage.studio"
                className="text-offwhite hover:text-accent"
              >
                hello@vantage.studio
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Studios</span>
              <span className="text-offwhite">London · Berlin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Response</span>
              <span className="text-offwhite">Within 2 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Back</span>
              <Link href="/" className="text-offwhite hover:text-accent">
                ← Home
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:pt-4">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
