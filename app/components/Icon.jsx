const paths = {
  city: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V9l5-3v15" />
      <path d="M10 21V3l9 4v14" />
      <path d="M13 9h3M13 13h3M13 17h3M7 12h1M7 16h1" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 21h18M4 18h16" />
      <path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7" />
      <path d="M3 11h18L12 4 3 11z" />
    </>
  ),
  mosque: (
    <>
      <path d="M3 21h18" />
      <path d="M6 21v-7a6 6 0 0 1 12 0v7" />
      <path d="M12 8V4" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
      <path d="M3 21V10M21 21V10" />
    </>
  ),
  tree: (
    <>
      <path d="M12 21v-6" />
      <path d="M12 3c-4 0-7 3-7 6.5S8 15 12 15s7-2 7-5.5S16 3 12 3z" />
      <path d="M8 21c1-2 2.5-3 4-3s3 1 4 3" />
    </>
  ),
  wave: (
    <>
      <path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <circle cx="17" cy="5" r="2" />
    </>
  ),
  palm: (
    <>
      <path d="M12 21c0-5 1-9 0-13" />
      <path d="M12 8c-2-3-6-3-8-1 3 0 5 1 8 1z" />
      <path d="M12 8c2-3 6-3 8-1-3 0-5 1-8 1z" />
      <path d="M12 8c-1-3 1-5 3-5-1 2-2 3-3 5z" />
      <path d="M4 21h16" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-9 5-14 15-15-1 10-6 15-15 15z" />
      <path d="M5 19 13 11" />
    </>
  ),
  cup: (
    <>
      <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 3c0 2 2 2 2 4M12 3c0 2 2 2 2 4" />
    </>
  ),
  boat: (
    <>
      <path d="M3 15h18l-3 5H6l-3-5z" />
      <path d="M12 15V4l6 8h-6" />
      <path d="M2 21c1.5 0 1.5-1 3-1s1.5 1 3 1" />
    </>
  ),
  mountain: (
    <>
      <path d="m3 20 6-10 4 6 3-4 5 8H3z" />
      <path d="m7.5 12.5 1.5 1 1.5-1" />
      <circle cx="17" cy="6" r="2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9 16h6" />
    </>
  ),
  sim: (
    <>
      <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <rect x="8.5" y="11" width="7" height="6" rx="1" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7h15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7z" />
      <path d="M4 7V6a2 2 0 0 1 2-2h11v3" />
      <path d="M16 13.5h1" />
    </>
  ),
  bus: (
    <>
      <rect x="4" y="3" width="16" height="15" rx="2" />
      <path d="M4 11h16M8 21v-3M16 21v-3" />
      <circle cx="8" cy="14.5" r=".6" />
      <circle cx="16" cy="14.5" r=".6" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  pin: (
    <>
      <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  plane: (
    <path d="M10.5 13.5 3 11l1.5-1.5 8 1 4-4.5a2 2 0 0 1 3 3l-4.5 4 1 8L15 22.5l-2.5-7.5-3 3V21L8 22l-1-3.5L3.5 17l1-1.5H7l3.5-3z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12 5 5 9-10" />,
  sound: (
    <>
      <path d="M4 9h4l5-4v14l-5-4H4V9z" />
      <path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  swap: <path d="M7 4 3 8l4 4M3 8h14M17 12l4 4-4 4M21 16H7" />,
  sparkle: (
    <path d="M12 3c.7 4.3 2 5.6 6 6.3-4 .7-5.3 2-6 6.3-.7-4.3-2-5.6-6-6.3 4-.7 5.3-2 6-6.3zM19 15c.3 1.7.8 2.2 2 2.5-1.2.3-1.7.8-2 2.5-.3-1.7-.8-2.2-2-2.5 1.2-.3 1.7-.8 2-2.5z" />
  ),
  cloud: <path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z" />,
  rain: (
    <>
      <path d="M7 15h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 6.5 4.3 4.3 0 0 0 7 15z" />
      <path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" />
    </>
  ),
  storm: (
    <>
      <path d="M7 15h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 6.5 4.3 4.3 0 0 0 7 15z" />
      <path d="m12 15-2 4h4l-2 4" />
    </>
  ),
  fog: <path d="M4 10h16M6 14h12M4 18h16M7 6h10" />,
  food: (
    <>
      <path d="M3 12h18a9 9 0 0 1-18 0z" />
      <path d="M8 8c0-2 2-2 2-4M12 8c0-2 2-2 2-4" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4V5z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />,
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
};

export default function Icon({ name, size = 22, className = "", strokeWidth = 1.8 }) {
  return (
    <svg
      className={`icon-svg ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.sparkle}
    </svg>
  );
}
