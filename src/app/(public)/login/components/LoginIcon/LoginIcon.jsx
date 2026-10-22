import './LoginIcon.scss';

const paths = {
  arrowLeft: 'M19 12H5m6 6-6-6 6-6',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  mail: 'M3 5h18v14H3zM3 5l9 7 9-7',
  user: 'M5 21a7 7 0 0 1 14 0',
  house: 'm3 10 9-7 9 7v11h-6v-8H9v8H3Z',
  key: 'M15 7a4 4 0 1 1-3.8 5.2L3 20H1v-3l7.8-8.2A4 4 0 0 1 15 7Zm1 3h.01',
  clock: 'M12 8v5l3 2',
  moon: 'M20 15a9 9 0 0 1-11-11 9 9 0 1 0 11 11Z',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1',
  sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
};

export default function LoginIcon({ name }) {
  return (
    <svg className="login-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
      {name === 'clock' && <circle cx="12" cy="12" r="9" />}
      {name === 'sun' && <circle cx="12" cy="12" r="4" />}
      {name === 'user' && <circle cx="12" cy="7" r="4" />}
    </svg>
  );
}
