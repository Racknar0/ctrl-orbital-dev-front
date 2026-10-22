import HomeNavbar from '../home/components/HomeNavbar/HomeNavbar';
import HomeFooter from '../home/components/HomeFooter/HomeFooter';
import QuickRoomsView from './components/QuickRoomsView/QuickRoomsView';
import '../home/Home.scss';

export default function SalasRapidasPage() {
  return (
    <div className="home">
      <HomeNavbar />
      <main id="contenido" className="quick-rooms-page">
        <QuickRoomsView />
      </main>
      <HomeFooter />
    </div>
  );
}
