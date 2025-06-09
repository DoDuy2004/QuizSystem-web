import HeroSection from "./components/HeroSection";


const Home = () => {

  return (
    <div
      className="bg-cover bg-no-repeat w-full"
      style={{ backgroundImage: `url(/assets/images/BG.1.svg)` }}
    >
        <HeroSection />
    </div>
  );
};

export default Home;
