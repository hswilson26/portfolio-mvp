/**
 * Traditional Staunton silhouettes based on Colin M. L. Burnett's chess set
 * (Wikimedia Commons, CC BY-SA / GPL), the same geometry Wikipedia uses.
 */
const PIECE_BOX =
  "pointer-events-none absolute inset-[8%] size-auto drop-shadow-md";

export function ChessPieceSvg({ type, color }: { type: string; color: "w" | "b" }) {
  const isWhite = color === "w";
  const fill = isWhite ? "#fff8eb" : "#1c1410";
  const stroke = "#1a120c";
  const detail = isWhite ? "#1a120c" : "#f0e6d4";

  switch (type.toLowerCase()) {
    case "k":
      return (
        <svg viewBox="0 0 45 45" preserveAspectRatio="xMidYMid meet" className={PIECE_BOX}>
          <g
            fill="none"
            fillRule="evenodd"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter" />
            <path
              d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
              fill={fill}
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
            <path
              d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"
              fill={fill}
            />
            {isWhite ? (
              <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
            ) : (
              <>
                <path
                  d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5l.01 2.1-.01-2.1C20 18 9.906 14 6.997 19.85c-2.497 5.65 4.853 9 4.853 9"
                  stroke={detail}
                />
                <path
                  d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
                  stroke={detail}
                />
              </>
            )}
          </g>
        </svg>
      );
    case "q":
      return (
        <svg viewBox="0 0 45 45" preserveAspectRatio="xMidYMid meet" className={PIECE_BOX}>
          <g
            fill={fill}
            fillRule="evenodd"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6" cy="12" r="2.75" />
            <circle cx="14" cy="9" r="2.75" />
            <circle cx="22.5" cy="8" r="2.75" />
            <circle cx="31" cy="9" r="2.75" />
            <circle cx="39" cy="12" r="2.75" />
            <path
              d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"
              strokeLinecap="butt"
            />
            <path
              d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
              strokeLinecap="butt"
            />
            <path d="M11 38.5a35 35 1 0 0 23 0" fill="none" strokeLinecap="butt" />
            <path
              d="M11 29a35 35 1 0 1 23 0M12.5 31.5h20M11.5 34.5a35 35 1 0 0 22 0M10.5 37.5a35 35 1 0 0 24 0"
              fill="none"
              stroke={isWhite ? stroke : detail}
            />
          </g>
        </svg>
      );
    case "r":
      return (
        <svg viewBox="0 0 45 45" preserveAspectRatio="xMidYMid meet" className={PIECE_BOX}>
          <g
            fill={fill}
            fillRule="evenodd"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5H12.5zM12 36v-4h21v4H12z" strokeLinecap="butt" />
            <path d="M14 29.5v-13h17v13H14z" strokeLinecap="butt" strokeLinejoin="miter" />
            <path d="M14 16.5 11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" strokeLinecap="butt" />
            {!isWhite && (
              <path
                d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23"
                fill="none"
                stroke={detail}
                strokeWidth="1"
                strokeLinejoin="miter"
              />
            )}
          </g>
        </svg>
      );
    case "b":
      return (
        <svg viewBox="0 0 45 45" preserveAspectRatio="xMidYMid meet" className={PIECE_BOX}>
          <g
            fill="none"
            fillRule="evenodd"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g fill={fill} strokeLinecap="butt">
              <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" />
              <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
              <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
            </g>
            <path
              d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"
              stroke={isWhite ? stroke : detail}
              strokeLinejoin="miter"
            />
          </g>
        </svg>
      );
    case "n":
      return (
        <svg viewBox="0 0 45 45" preserveAspectRatio="xMidYMid meet" className={PIECE_BOX}>
          <g
            fill="none"
            fillRule="evenodd"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Pedestal / neck — Staunton horse body */}
            <path d="M22 10C32.5 11 38.5 18 38 39H15C15 30 25 32.5 23 18" fill={fill} />
            {/* Horse head: snout, ear, mane, jaw */}
            <path
              d="M24 18C24.38 20.91 18.45 25.37 16 27C13 29 13.18 31.34 11 31C9.958 30.06 12.41 27.96 11 28C10 28 11.19 29.23 10 30C9 30 5.997 31 6 26C6 24 12 14 12 14C12 14 13.89 12.1 14 10.5C13.27 9.506 13.5 8.5 13.5 7.5C14.5 6.5 16.5 10 16.5 10H18.5C18.5 10 19.28 8.008 21 7C22 7 22 10 22 10"
              fill={fill}
            />
            {/* Nostril */}
            <path d="M9.5 25.5A0.5 0.5 0 1 1 8.5 25.5A0.5 0.5 0 1 1 9.5 25.5z" fill={detail} stroke={detail} />
            {/* Eye */}
            <path
              d="M15 15.5A0.5 1.5 0 1 1 14 15.5A0.5 1.5 0 1 1 15 15.5z"
              transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
              fill={detail}
              stroke={detail}
            />
            {!isWhite && (
              <path
                d="M24.55 10.4 24.1 11.85 24.6 12C27.75 13 30.25 14.49 32.5 18.75C34.75 23.01 35.75 29.06 35.25 39L35.2 39.5H37.45L37.5 39C38 28.94 36.62 22.15 34.25 17.66C31.88 13.17 28.46 11.02 25.06 10.5Z"
                fill={detail}
                stroke="none"
              />
            )}
          </g>
        </svg>
      );
    case "p":
      return (
        <svg viewBox="0 0 45 45" preserveAspectRatio="xMidYMid meet" className={PIECE_BOX}>
          <path
            d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
