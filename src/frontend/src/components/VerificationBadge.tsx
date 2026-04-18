interface VerificationBadgeProps {
  size?: number;
  className?: string;
}

/**
 * Meta/Facebook-style spiked verification badge.
 * A starburst/sunburst shape with 12 pointed spikes, solid blue (#1877F2),
 * white bold checkmark inside — identical to Facebook/Instagram/Twitter.
 * Sizes: 14px (comments), 16px (feed/messages/header), 22px (profile).
 */
export function VerificationBadge({
  size = 18,
  className = "",
}: VerificationBadgeProps) {
  // Build a 12-point starburst polygon (alternating inner/outer radii)
  // Center is (12, 12), viewBox is 24×24
  const cx = 12;
  const cy = 12;
  const outerR = 11.5; // outer spike tip
  const innerR = 8.2; // inner valley between spikes
  const numSpikes = 12;
  const points: string[] = [];

  for (let i = 0; i < numSpikes * 2; i++) {
    const angle = (Math.PI / numSpikes) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(3)},${y.toFixed(3)}`);
  }
  const polygonPoints = points.join(" ");

  return (
    <span
      role="img"
      aria-label="Verified account"
      title="Verified account"
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size, lineHeight: 0 }}
      data-ocid="verification-badge"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        {/* 12-spike starburst — identical shape to Meta/Facebook verified badge */}
        <polygon points={polygonPoints} fill="#1877F2" />
        {/* Bold white checkmark centered inside */}
        <path
          d="M7.5 12.2L10.5 15.2L16.5 9"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
