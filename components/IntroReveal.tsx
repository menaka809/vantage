"use client";

import { motion, type Variants } from "framer-motion";

const TEXT =
  "We turn brands into experiences people can feel — through motion, interaction, and relentless craft.";
const ACCENT = new Set(["motion,", "interaction,", "craft."]);

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const word: Variants = {
  hidden: { y: "115%" },
  show: {
    y: "0%",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function IntroReveal() {
  return (
    <section id="studio" className="px-6 py-24 sm:py-32 md:px-10 md:py-52">
      <div className="mx-auto max-w-5xl">
        <p className="mb-8 text-xs uppercase tracking-widest text-muted sm:mb-10">
          The studio
        </p>
        <motion.h2
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
          className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-offwhite sm:text-5xl md:text-7xl"
        >
          {TEXT.split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
              <motion.span
                variants={word}
                className={`inline-block ${ACCENT.has(w) ? "text-accent" : ""}`}
              >
                {w}
                {" "}
              </motion.span>
            </span>
          ))}
        </motion.h2>
      </div>
    </section>
  );
}
