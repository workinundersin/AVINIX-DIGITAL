interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
}

export function BrandLogo({ variant = 'light', size = 'md' }: BrandLogoProps) {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#0B1730]';
  const iconSize = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} shrink-0`}
        aria-hidden="true"
      >
        <rect
          width="36"
          height="36"
          rx="8"
          fill={isDark ? '#2563EB' : '#0B1730'}
        />
        <path
          d="M18 7L28 27H22.8L18 16.8L13.2 27H8L18 7Z"
          fill="#FFFFFF"
        />
        <path
          d="M13.5 22.5L18 19.5L22.5 22.5"
          stroke={isDark ? '#0B1730' : '#60A5FA'}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`font-display text-base sm:text-lg font-extrabold tracking-tight ${textColor} whitespace-nowrap`}
      >
        AVENIX <span className="text-[#2563EB]">DIGITAL</span>
      </span>
    </span>
  );
}
