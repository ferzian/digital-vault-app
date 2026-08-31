import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { GoodsPreviewSection } from "@/components/home/goods-preview-section";
import { FeaturesSection } from "@/components/home/features-section";
import { SecurityCtaSection } from "@/components/home/security-cta-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <GoodsPreviewSection />
        <FeaturesSection />
        <SecurityCtaSection />
      </main>
      <Footer />
    </div>
  );
}
