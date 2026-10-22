'use client';

import { useRouter } from 'next/navigation';
import HomeNavbar from '../home/components/HomeNavbar/HomeNavbar';
import HomeFooter from '../home/components/HomeFooter/HomeFooter';
import SalasRapidasBanner from '../home/components/SalasRapidasBanner/SalasRapidasBanner';
import '../home/Home.scss';

export default function SalasRapidasPage() {
  const router = useRouter();

  return (
    <div className="home">
      <HomeNavbar />
      <main id="contenido" className="quick-rooms-page">
        <SalasRapidasBanner initialOpen onClose={() => router.push('/')} />
      </main>
      <HomeFooter />
    </div>
  );
}
