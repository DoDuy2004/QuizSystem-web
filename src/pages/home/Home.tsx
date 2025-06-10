import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import TrustedSection from "./components/TrustedSection";

const Home = () => {
  return (
    <div className="flex flex-col gap-y-12">
      <div
        className="bg-cover bg-no-repeat w-full"
        style={{ backgroundImage: `url(/assets/images/BG.1.svg)` }}
      >
        <HeroSection />
      </div>
      <TrustedSection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
