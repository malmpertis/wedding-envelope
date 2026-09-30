type WaxSealProps = {
  className?: string;
  size?: number;
};

export function WaxSeal({ className = "", size = 128 }: WaxSealProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="waxFill" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f0d78a" />
          <stop offset="35%" stopColor="#d4b05e" />
          <stop offset="70%" stopColor="#b8923f" />
          <stop offset="100%" stopColor="#8a6a2e" />
        </radialGradient>
        <radialGradient id="waxShine" cx="35%" cy="28%" r="45%">
          <stop offset="0%" stopColor="#fff6d0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff6d0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="url(#waxFill)"
        style={{ filter: "drop-shadow(0 6px 8px rgba(10,24,18,0.45))" }}
      />
      <circle cx="100" cy="100" r="88" fill="url(#waxShine)" />
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="#7a5c28"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <circle
        cx="100"
        cy="100"
        r="68"
        stroke="#f3e2a8"
        strokeWidth="1.5"
        fill="none"
        opacity="0.55"
      />
      {/* Laurel left */}
      <path
        d="M78 130 C62 112 60 88 72 68 C66 86 68 108 78 124 Z"
        fill="#7a5c28"
        opacity="0.55"
      />
      <ellipse
        cx="68"
        cy="78"
        rx="7"
        ry="11"
        transform="rotate(-28 68 78)"
        fill="#8a6a2e"
        opacity="0.75"
      />
      <ellipse
        cx="64"
        cy="96"
        rx="7"
        ry="11"
        transform="rotate(-10 64 96)"
        fill="#8a6a2e"
        opacity="0.75"
      />
      <ellipse
        cx="66"
        cy="114"
        rx="7"
        ry="11"
        transform="rotate(12 66 114)"
        fill="#8a6a2e"
        opacity="0.75"
      />
      {/* Laurel right */}
      <path
        d="M122 130 C138 112 140 88 128 68 C134 86 132 108 122 124 Z"
        fill="#7a5c28"
        opacity="0.55"
      />
      <ellipse
        cx="132"
        cy="78"
        rx="7"
        ry="11"
        transform="rotate(28 132 78)"
        fill="#8a6a2e"
        opacity="0.75"
      />
      <ellipse
        cx="136"
        cy="96"
        rx="7"
        ry="11"
        transform="rotate(10 136 96)"
        fill="#8a6a2e"
        opacity="0.75"
      />
      <ellipse
        cx="134"
        cy="114"
        rx="7"
        ry="11"
        transform="rotate(-12 134 114)"
        fill="#8a6a2e"
        opacity="0.75"
      />
      <circle
        cx="100"
        cy="94"
        r="24"
        stroke="#6e5224"
        strokeWidth="2.2"
        fill="none"
      />
      <circle
        cx="100"
        cy="94"
        r="19"
        stroke="#f3e2a8"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <text
        x="100"
        y="101"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="22"
        fontWeight="700"
        fill="#5c441c"
      >
        Ι&Β
      </text>
    </svg>
  );
}
