import { useId, type SVGProps } from "react";

type NextStepLogoProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  /** "full" = icon + wordmark, "icon" = just the stair-step mark */
  variant?: "full" | "icon";
  /** Show "Find • Analyze • Take Action" (only applies to the full variant) */
  tagline?: boolean;
  /** Colour of "Next" — pass "#fff" on dark backgrounds */
  darkText?: string;
  /** Optional explicit size. Usually easier to size with className (e.g. "h-8 w-auto") */
  width?: number | string;
  height?: number | string;
};

// Uses the CSS variables that next/font already sets up in layout.tsx
const WORDMARK_FONT = "var(--font-poppins), Poppins, 'Segoe UI', Arial, sans-serif";
const TAGLINE_FONT = "var(--font-plus-jakarta), 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";

export default function NextStepLogo({
  variant = "full",
  tagline = false,
  darkText = "#0A1A33",
  width,
  height,
  ...props
}: NextStepLogoProps) {
  const gid = useId().replace(/:/g, "");
  const isIcon = variant === "icon";

  const viewBox = isIcon
    ? "205 305 290 300"
    : tagline
      ? "200 300 1140 340"
      : "200 300 1140 280";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      role="img"
      aria-label="NextStep"
      {...props}
    >
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="215" y1="600" x2="482" y2="412">
          <stop offset="0" stopColor="#1533A0" />
          <stop offset="0.55" stopColor="#1265E8" />
          <stop offset="1" stopColor="#0A84FF" />
        </linearGradient>
      </defs>

      {/* Sparkle */}
      <path
        fill="#1A7BFF"
        d="M439 316 Q447 348 481 356 Q447 364 439 397 Q431 364 398 356 Q431 348 439 316 Z"
      />

      {/* Steps */}
      <g fill={`url(#${gid})`}>
        <path d="M395 412 H482 V452 Q482 478 448 493 V468 Q448 453 430 453 H360 V447 Q360 412 395 412 Z" />
        <path d="M316 468 H432 V512 Q432 538 385 558 V530 Q385 510 368 510 H281 V503 Q281 468 316 468 Z" />
        <path d="M250 526 H368 V565 Q368 600 330 600 H215 V561 Q215 526 250 526 Z" />
      </g>

      {!isIcon && (
        <>
          {/* Wordmark */}
          <g style={{ fontFamily: WORDMARK_FONT }} fontWeight={800} fontSize={186}>
            <text x="535" y="532" fill={darkText} textLength="391" lengthAdjust="spacingAndGlyphs">
              Next
            </text>
            <text x="935" y="532" fill="#1557FF" textLength="390" lengthAdjust="spacingAndGlyphs">
              Step
            </text>
          </g>

          {/* Tagline */}
          {tagline && (
            <>
              <g style={{ fontFamily: TAGLINE_FONT }} fontSize={45} fill="#5A6B8F">
                <text x="535" y="622" textLength="95" lengthAdjust="spacingAndGlyphs">Find</text>
                <text x="722" y="622" textLength="175" lengthAdjust="spacingAndGlyphs">Analyze</text>
                <text x="988" y="622" textLength="258" lengthAdjust="spacingAndGlyphs">Take Action</text>
              </g>
              <circle cx="676" cy="608" r="6" fill="#1557FF" />
              <circle cx="943" cy="608" r="6" fill="#1557FF" />
            </>
          )}
        </>
      )}
    </svg>
  );
}