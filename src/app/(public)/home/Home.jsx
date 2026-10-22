import HomeNavbar from './components/HomeNavbar/HomeNavbar';
import HeroSection from './components/HeroSection/HeroSection';
import SolucionSection from './components/SolucionSection/SolucionSection';
import SalasRapidasBanner from './components/SalasRapidasBanner/SalasRapidasBanner';
import BentoSection from './components/BentoSection/BentoSection';
import ComparativaSection from './components/ComparativaSection/ComparativaSection';
import CtaBanner from './components/CtaBanner/CtaBanner';
import HomeFooter from './components/HomeFooter/HomeFooter';
import './Home.scss';

export default function Home() {
  return (
    <div className="home">
      <a className="home__skip" href="#contenido">Saltar al contenido</a>
      <HomeNavbar />
      <main id="contenido">
        <HeroSection />
        <SolucionSection />
        <SalasRapidasBanner />
        <BentoSection />
        <ComparativaSection />
        <CtaBanner />
      </main>
      <HomeFooter />
    </div>
  );
}
