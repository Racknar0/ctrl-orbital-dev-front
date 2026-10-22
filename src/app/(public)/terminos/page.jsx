import LegalDocument from '../components/LegalDocument/LegalDocument';

export const metadata = {
  title: 'Términos y condiciones | Orbital Ctrl',
  description: 'Condiciones de uso de Orbital Ctrl y de sus espacios de gastos compartidos.',
  robots: { index: false, follow: true },
};

export default function TerminosPage() {
  return <LegalDocument type="terms" />;
}
