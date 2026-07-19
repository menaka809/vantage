import KineticHero from "@/components/KineticHero";
import IntroReveal from "@/components/IntroReveal";
import WorkGallery from "@/components/WorkGallery";
import ServicesMarquee from "@/components/ServicesMarquee";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <KineticHero />
      <IntroReveal />
      <WorkGallery />
      <ServicesMarquee />
      <About />
      <Footer />
    </>
  );
}
