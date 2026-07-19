"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Magnetic from "./Magnetic";
import { useCursor } from "./Cursor";

const schema = z.object({
  name: z.string().min(1, "Your name?"),
  email: z.string().min(1, "Your email?").pipe(z.email("Check that email")),
  service: z.string().min(1, "Pick one"),
  message: z.string().min(1, "Tell us a little"),
});
type Values = z.infer<typeof schema>;

const SERVICES = [
  "Motion Design",
  "Interactive Web",
  "Brand Identity",
  "Art Direction",
];

export default function ContactForm() {
  const { setVariant } = useCursor();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: "onTouched" });

  const v = watch();
  const valid = {
    name: !!v.name?.trim(),
    email: /^\S+@\S+\.\S+$/.test(v.email || ""),
    service: !!v.service,
    message: !!(v.message && v.message.trim().length >= 2),
  };
  const done = Object.values(valid).filter(Boolean).length;

  const hoverInput = {
    onMouseEnter: () => setVariant("link"),
    onMouseLeave: () => setVariant("default"),
  };

  if (isSubmitSuccessful) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start gap-6 py-10"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent"
        >
          <Check className="h-8 w-8 text-bg" strokeWidth={3} />
        </motion.span>
        <p className="font-display text-4xl font-medium tracking-tight text-offwhite md:text-5xl">
          Brief received.
          <br />
          <span className="text-muted">We&rsquo;ll reply within two days.</span>
        </p>
        <button
          onClick={() => reset()}
          onMouseEnter={() => setVariant("link")}
          onMouseLeave={() => setVariant("default")}
          className="text-xs uppercase tracking-widest text-muted underline decoration-border underline-offset-4 transition-colors hover:text-offwhite"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onNoop)} noValidate className="space-y-9">
      {/* Completion progress */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-muted">
            Your brief
          </span>
          <span className="text-xs text-muted">
            <span className="text-offwhite">{done}</span> / 4
          </span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i < done ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <Field num="01" label="What should we call you?" error={errors.name?.message} valid={valid.name}>
        <input
          {...register("name")}
          {...hoverInput}
          placeholder="Full name"
          className="w-full bg-transparent pr-8 font-display text-2xl text-offwhite outline-none placeholder:text-muted/40 md:text-3xl"
        />
      </Field>

      <Field num="02" label="Where can we reach you?" error={errors.email?.message} valid={valid.email}>
        <input
          {...register("email")}
          {...hoverInput}
          type="email"
          placeholder="you@company.com"
          className="w-full bg-transparent pr-8 font-display text-2xl text-offwhite outline-none placeholder:text-muted/40 md:text-3xl"
        />
      </Field>

      <div>
        <FieldLabel num="03" label="What do you need?" error={errors.service?.message} valid={valid.service} />
        <div className="flex flex-wrap gap-2.5 pt-1">
          {SERVICES.map((s) => (
            <label
              key={s}
              onMouseEnter={() => setVariant("link")}
              onMouseLeave={() => setVariant("default")}
              className="cursor-pointer"
            >
              <input type="radio" value={s} {...register("service")} className="peer sr-only" />
              <span className="inline-block rounded-full border border-border px-4 py-2.5 text-sm text-muted transition-all duration-300 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-bg hover:border-offwhite/40 hover:text-offwhite">
                {s}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Field num="04" label="Tell us about it" error={errors.message?.message} valid={valid.message}>
        <textarea
          {...register("message")}
          {...hoverInput}
          rows={2}
          placeholder="A few lines about the project…"
          className="w-full resize-none bg-transparent pr-8 text-lg text-offwhite outline-none placeholder:text-muted/40"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <Magnetic strength={0.35}>
          <button
            type="submit"
            disabled={isSubmitting}
            onMouseEnter={() => setVariant("link")}
            onMouseLeave={() => setVariant("default")}
            className={`group flex items-center gap-3 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors disabled:opacity-70 ${
              done === 4
                ? "bg-accent text-bg"
                : "bg-offwhite text-bg hover:bg-accent"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Send it
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </Magnetic>
        <span className="text-xs text-muted">
          {done < 4 ? (
            <>
              <span className="text-offwhite">{4 - done}</span> to go — or email{" "}
              <a
                href="mailto:hello@vantage.studio"
                className="text-offwhite underline decoration-border underline-offset-4 transition-colors hover:decoration-accent"
              >
                hello@vantage.studio
              </a>
            </>
          ) : (
            "Looks good — send it over."
          )}
        </span>
      </div>
    </form>
  );
}

async function onNoop() {
  await new Promise((r) => setTimeout(r, 1000));
}

function FieldLabel({
  num,
  label,
  error,
  valid,
}: {
  num: string;
  label: string;
  error?: string;
  valid?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center gap-4">
      <span className={`font-display text-sm ${valid ? "text-accent" : "text-muted"}`}>
        {num}
      </span>
      <label className="text-xs uppercase tracking-widest text-muted">
        {label}
      </label>
      <AnimatePresence mode="wait">
        {error ? (
          <motion.span
            key="err"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ml-auto text-xs text-accent"
          >
            {error}
          </motion.span>
        ) : valid ? (
          <motion.span
            key="ok"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-accent"
          >
            <Check className="h-3 w-3 text-bg" strokeWidth={3} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Field({
  num,
  label,
  error,
  valid,
  children,
}: {
  num: string;
  label: string;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <FieldLabel num={num} label={label} error={error} valid={valid} />
      <div className="relative pb-3">
        {children}
        <span className="absolute bottom-0 left-0 h-px w-full bg-border" />
        <span
          className={`pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent transition-transform duration-500 ease-out ${
            valid ? "scale-x-100" : "scale-x-0 group-focus-within:scale-x-100"
          }`}
        />
      </div>
    </div>
  );
}
