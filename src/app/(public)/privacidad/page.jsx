import LegalDocument from '../components/LegalDocument/LegalDocument';

export const metadata = {
  title: 'Política de privacidad | Orbital Ctrl',
  description: 'Información sobre los datos utilizados por Orbital Ctrl y las opciones de privacidad.',
  robots: { index: false, follow: true },
};

export default function PrivacidadPage() {
  return <LegalDocument type="privacy" />;
}
