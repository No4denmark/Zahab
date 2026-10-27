type P = { size?: number; className?: string };
const S = ({ size = 20, className, children }: P & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {children}
  </svg>
);

export const IconSearch = (p: P) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></S>;
export const IconBell = (p: P) => <S {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></S>;
export const IconUser = (p: P) => <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></S>;
export const IconMenu = (p: P) => <S {...p}><path d="M4 6h16M4 12h16M4 18h16" /></S>;
export const IconClose = (p: P) => <S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>;
export const IconChevron = (p: P) => <S {...p}><path d="m6 9 6 6 6-6" /></S>;
export const IconArrow = (p: P) => <S {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></S>;
export const IconGlobe = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></S>;
export const IconMail = (p: P) => <S {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></S>;
export const IconChart = (p: P) => <S {...p}><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 6-7" /></S>;
export const IconBars = (p: P) => <S {...p}><path d="M3 20h18M5 20l2-6h4l2 6M11 20l2-6h4l2 6M8 14l2-6h4l2 6" /></S>;
export const IconCoins = (p: P) => <S {...p}><circle cx="9" cy="9" r="6" /><path d="M15.5 6.5a6 6 0 1 1-9 9" /></S>;
export const IconExchange = (p: P) => <S {...p}><path d="M7 7h12l-3-3M17 17H5l3 3" /></S>;
export const IconShield = (p: P) => <S {...p}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></S>;
export const IconBolt = (p: P) => <S {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></S>;
export const IconSpark = (p: P) => <S {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></S>;
export const IconInfo = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v5h1" /></S>;
export const IconNews = (p: P) => <S {...p}><path d="M4 5h13v14H6a2 2 0 0 1-2-2z" /><path d="M17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5M8 17h3" /></S>;
export const IconHelp = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" /></S>;
export const IconPulse = (p: P) => <S {...p}><path d="M3 12h4l2-6 4 12 2-6h6" /></S>;
export const IconLayers = (p: P) => <S {...p}><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></S>;
export const IconSilver = (p: P) => <S {...p}><path d="M4 18h16l-3-8H7z" /><path d="M8 10 10 5h4l2 5" /></S>;

export function CalcIcon({ id, size = 26 }: { id: string; size?: number }) {
  switch (id) {
    case "sell": return <S size={size}><path d="M12 2v20M17 6.5C17 4.6 14.8 3 12 3S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5" /></S>;
    case "convert": return <S size={size}><path d="M4 7h13l-3-3M20 17H7l3 3" /></S>;
    case "value": return <S size={size}><path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0zM19 7l-3 7a4 4 0 0 0 6 0z" /></S>;
    case "buy": return <S size={size}><path d="M6 6h15l-2 9H8z" /><path d="M6 6 5 3H2" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></S>;
    case "zakat": return <S size={size}><path d="M12 3a6 6 0 0 0 6 9 7 7 0 1 1-6-9z" /><path d="m17 4 .7 1.6L19.5 6l-1.6.7L17 8.5l-.7-1.8L14.5 6l1.8-.4z" /></S>;
    case "r2g": return <S size={size}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></S>;
    case "inst": return <S size={size}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4M8 14h2M14 14h2M8 17h2" /></S>;
    default: return <S size={size}><circle cx="12" cy="12" r="9" /></S>;
  }
}

/** Brand mark: a gold bar with a rising price line breaking out of it — "gold, live". */
export const LOGO_PATHS = {
  barTop: "M8.6 18.4h14.8l2.2 3.6H6.4z",
  barFront: "M6.4 22h19.2l-1.4 4.6H7.8z",
  line: "M5 15.2l5.6-4.6 4.2 2.8 7.6-7.4",
  arrow: "M17.6 5.6h5.2v5.2",
};

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d={LOGO_PATHS.barTop} fill="currentColor" opacity=".6" />
      <path d={LOGO_PATHS.barFront} fill="currentColor" />
      <path d={LOGO_PATHS.line} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d={LOGO_PATHS.arrow} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
