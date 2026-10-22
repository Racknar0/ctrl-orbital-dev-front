import HomeNavbar from '../home/components/HomeNavbar/HomeNavbar';
import HomeFooter from '../home/components/HomeFooter/HomeFooter';
import SugerenciasView from './components/SugerenciasView/SugerenciasView';
import '../home/Home.scss';

export default function SugerenciasPage() {
  return (
    <div className="home">
      <HomeNavbar />
      <main id="contenido" className="suggestions-page">
        <SugerenciasView />
      </main>
      <HomeFooter />
    </div>
  );
}
