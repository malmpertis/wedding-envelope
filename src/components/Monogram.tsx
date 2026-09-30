type MonogramProps = {
  className?: string;
  size?: number;
};

/** Minimal circular monogram — modern stand-in for a wax seal */
export function Monogram({ className = "", size = 112 }: MonogramProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="#fffcf8"
        stroke="#8a6f5c"
        strokeWidth="1.25"
      />
      <circle
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke="#c4b2a3"
        strokeWidth="0.75"
      />
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="28"
        fontStyle="italic"
        fontWeight="500"
        fill="#171412"
        letterSpacing="0.04em"
      >
        Ι · Β
      </text>
    </svg>
  );
}
