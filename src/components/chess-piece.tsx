export function ChessPieceSvg({ type, color }: { type: string; color: "w" | "b" }) {
  const isWhite = color === "w";
  const fill = isWhite ? "#f8f1e3" : "#1a1511";
  const stroke = isWhite ? "#3f2f1e" : "#d9cbb3";

  switch (type.toLowerCase()) {
    case "k":
      return (
        <svg viewBox="0 0 45 45" className="size-11 sm:size-12 drop-shadow-md">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 11.63V6M20 8h5" />
            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
            <path d="M11.5 37c5.5 3.5 16.5 3.5 22 0V27s3-4.5 1.5-7c-1.5-2.5-6-1.5-6-1.5s-2.5 2.5-6.5 2.5-6.5-2.5-6.5-2.5-4.5-1-6 1.5c-1.5 2.5 1.5 7 1.5 7v10z" />
            <path d="M11.5 30c5.5-2 16.5-2 22 0M11.5 33.5c5.5-2 16.5-2 22 0M11.5 37c5.5-2 16.5-2 22 0" />
          </g>
        </svg>
      );
    case "q":
      return (
        <svg viewBox="0 0 45 45" className="size-11 sm:size-12 drop-shadow-md">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-6-11-2.5 11-2.5-11-6 11-7-11 2 12z" />
            <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 18 1 24.5 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4" />
            <circle cx="6" cy="12" r="2" />
            <circle cx="14" cy="9" r="2" />
            <circle cx="22.5" cy="8" r="2" />
            <circle cx="31" cy="9" r="2" />
            <circle cx="39" cy="12" r="2" />
          </g>
        </svg>
      );
    case "r":
      return (
        <svg viewBox="0 0 45 45" className="size-10 sm:size-11 drop-shadow-md">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
            <path d="M34 14l-3 3H14l-3-3M14 17v12h17V17H14z" />
            <path d="M14 29c0 1.5-1.5 3-2 3h21c-.5 0-2-1.5-2-3H14z" />
          </g>
        </svg>
      );
    case "b":
      return (
        <svg viewBox="0 0 45 45" className="size-10 sm:size-11 drop-shadow-md">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
            <path d="M17.5 26h10M22.5 21v10" />
          </g>
        </svg>
      );
    case "n":
      return (
        <svg viewBox="0 0 45 45" className="size-10 sm:size-11 drop-shadow-md">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10c-3 0-5 2-6 4-2 3-3 7-2 11 1 2 3 3 5 3 .5 1 .5 3-1 4-1.5 1-3.5 1.5-5.5 1.5-2 0-3-.5-4-1 0 1.5 1 3 2.5 4 2.5 1.5 6 1.5 9 .5 3-1 5-3.5 6-6.5 1-3 1-6 0-9 1.5-1 2-2.5 2-4.5 0-2-1.5-3.5-3-3.5s-2.5 1-3 2c0-1.5-1-2.5-2-2.5z" />
            <circle cx="15.5" cy="17.5" r="1.5" fill={stroke} />
            <path d="M9.5 39.5c3.5 1 9.5 1.5 15.5 0 4-1 7.5-3 10.5-6v-3.5c-3 1-6.5 1.5-10.5 1.5-6 0-11-.5-15.5-1.5v9.5z" />
          </g>
        </svg>
      );
    case "p":
      return (
        <svg viewBox="0 0 45 45" className="size-9 sm:size-10 drop-shadow-md">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.93 3.84 2.38 5.03-3.15 1.34-5.38 4.45-5.38 8.09 0 1.05.19 2.05.53 2.97 3.09.91 6.57 1.41 10.47 1.41 3.9 0 7.38-.5 10.47-1.41.34-.92.53-1.92.53-2.97 0-3.64-2.23-6.75-5.38-8.09 1.45-1.19 2.38-3 2.38-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
            <path d="M12 39c4 1 16 1 20 0" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}
