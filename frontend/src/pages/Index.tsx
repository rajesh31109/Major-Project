import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import LoginOptions from "@/components/LoginOptions";
import DataFlowSection from "@/components/DataFlowSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <LoginOptions />
        <DataFlowSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
