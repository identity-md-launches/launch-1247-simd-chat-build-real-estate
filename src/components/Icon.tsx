import type { CSSProperties } from "react";
export type IconName =
  | "arrow"
  | "arrow-up"
  | "chevron"
  | "search"
  | "pin"
  | "home"
  | "area"
  | "bed"
  | "bath"
  | "heart"
  | "close"
  | "menu"
  | "check"
  | "building"
  | "key"
  | "chart"
  | "mail"
  | "phone"
  | "download"
  | "plus";
const paths: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </>
  ),
  "arrow-up": (
    <>
      <path d="M5 19 19 5M5 5h14v14" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  home: (
    <>
      <path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8" />
    </>
  ),
  area: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 9h4M4 14h3M9 4v4M14 4v3" />
    </>
  ),
  bed: (
    <>
      <path d="M3 17v4m18-4v4M3 17h18V9H3v8ZM5 9V4h14v5M8 9V6h8v3" />
    </>
  ),
  bath: (
    <>
      <path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3ZM6 12V5a2 2 0 0 1 4 0M6 20v2m12-2v2" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  check: <path d="m5 12 4 4L19 6" />,
  building: (
    <>
      <path d="M3 21h18M5 21V7l7-4v18M12 9h7v12M8 9v1m0 3v1m0 3v1m8-6v1m0 3v1" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="5" />
      <path d="m12 12 9 9m-6-6 3-3m0 6 3-3" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16M7 14l4-4 4 2 5-7M16 5h4v4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  phone: (
    <path d="m8 3 3 5-3 3c1.5 2.5 2.5 3.5 5 5l3-3 5 3c0 3-2 5-5 5C9 21 3 15 3 8c0-3 2-5 5-5Z" />
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
    </>
  ),
  plus: <path d="M12 4v16M4 12h16" />,
};
export function Icon({
  name,
  size = 20,
  className = "",
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {paths[name]}
    </svg>
  );
}
