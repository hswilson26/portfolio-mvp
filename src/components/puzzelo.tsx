import { PUZZELO_K, STARTING_PUZZELO } from "@/lib/daily-puzzle";

export function PuzzEloShowcase({
  rating,
  lastDelta,
  puzzleRating,
}: {
  rating: number;
  lastDelta: number | null;
  puzzleRating: number | null;
}) {
  const deltaLabel =
    lastDelta == null ? "Awaiting first result" : lastDelta >= 0 ? `+${lastDelta}` : String(lastDelta);
  const deltaTone =
    lastDelta == null ? "text-[#7a5b28]" : lastDelta >= 0 ? "text-[#2f6b45]" : "text-[#8a4b12]";

  return (
    <section className="overflow-hidden rounded-sm border-2 border-[#c6a046] bg-[#0f241c] shadow-xl">
      <div
        className="relative px-5 pt-5 pb-4"
        style={{
          background:
            "radial-gradient(circle at 18% 0%, rgba(198,160,70,0.28), transparent 46%), linear-gradient(180deg, #173528 0%, #0f241c 100%)",
        }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c6a046]"
          style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
        >
          Daily Gambit ELO
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="font-mono text-6xl font-bold leading-none tracking-tight tabular-nums text-[#f0d48a] transition-all duration-300">
            {rating}
          </p>
          <p className={`min-w-[4.5rem] pb-1 text-right font-mono text-xl font-semibold tabular-nums ${deltaTone}`}>
            {deltaLabel}
          </p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#e6d5b0]">
          Your tactics rating. Each daily is treated as a rated opponent.
        </p>
      </div>
      <dl className="grid grid-cols-2 divide-x divide-[#c6a046]/20 border-t border-[#c6a046]/25 bg-[#143326]">
        <div className="px-4 py-3">
          <dt className="text-[10px] uppercase tracking-[0.16em] text-[#b8a888]">You</dt>
          <dd className="mt-0.5 font-mono text-lg tabular-nums text-[#f3e6c9]">{rating}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className="text-[10px] uppercase tracking-[0.16em] text-[#b8a888]">This puzzle</dt>
          <dd className="mt-0.5 font-mono text-lg tabular-nums text-[#f3e6c9]">{puzzleRating ?? "—"}</dd>
        </div>
      </dl>
    </section>
  );
}

export function PuzzEloIntro({
  onBegin,
  titleId,
}: {
  onBegin: () => void;
  titleId: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1812]/85 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg overflow-hidden rounded-sm border-2 border-[#c6a046] bg-[#f3e6c9] text-[#2c2419] shadow-2xl"
      >
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(198,160,70,0.35), transparent 55%), #173528",
          }}
        >
          <p className="text-3xl text-[#c6a046]">♞</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c6a046]">
            Introducing
          </p>
          <h2
            id={titleId}
            className="mt-1 text-3xl text-[#f6ead0] sm:text-4xl"
            style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
          >
            Daily Gambit ELO
          </h2>
          <p className="mt-4 font-mono text-7xl font-bold leading-none text-[#f0d48a]">{STARTING_PUZZELO}</p>
          <p className="mt-2 text-sm text-[#e6d5b0]">Your starting rating</p>
        </div>
        <div className="space-y-4 px-6 py-5 text-sm leading-relaxed">
          <p>
            Every Daily Gambit is a rated match against that puzzle’s Lichess Elo. You begin at{" "}
            <strong>{STARTING_PUZZELO}</strong>.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-sm border border-[#c6a046]/40 bg-[#fff8e8] px-2 py-3">
              <p className="font-semibold text-[#5c3317]">Solve</p>
              <p className="mt-1 text-[#5c4a32]">Counts as a win</p>
            </div>
            <div className="rounded-sm border border-[#c6a046]/40 bg-[#fff8e8] px-2 py-3">
              <p className="font-semibold text-[#5c3317]">Misses</p>
              <p className="mt-1 text-[#5c4a32]">Shrink the result</p>
            </div>
            <div className="rounded-sm border border-[#c6a046]/40 bg-[#fff8e8] px-2 py-3">
              <p className="font-semibold text-[#5c3317]">Clock</p>
              <p className="mt-1 text-[#5c4a32]">Slow solves pay less</p>
            </div>
          </div>
          <p className="rounded-sm bg-[#fff8e8] px-3 py-2 font-mono text-[11px] leading-relaxed text-[#5c3317]">
            Δ = {PUZZELO_K} × (your result − expected)
            <br />
            expected = 1 / (1 + 10^((puzzle − you) / 400))
          </p>
          <p className="text-xs text-[#5c4a32]">
            Harder puzzles than your rating are worth more. A countdown starts the clock so every
            second is fair.
          </p>
          <button
            type="button"
            onClick={onBegin}
            className="w-full rounded-sm border-2 border-[#5c3317] bg-[#c6a046] px-4 py-3 text-base font-semibold text-[#2c2419] hover:bg-[#d4b056]"
          >
            Begin with {STARTING_PUZZELO}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PuzzleCountdown({
  value,
}: {
  value: number | "go";
}) {
  return (
    <div className="gambit-overlay-in absolute inset-0 z-20 flex items-center justify-center rounded-sm bg-[#0a1812]/72">
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c6a046]">
          {value === "go" ? "On the clock" : "Get ready"}
        </p>
        <p
          key={value}
          className="gambit-countdown-pop mt-2 font-mono text-7xl font-bold text-[#f0d48a] sm:text-8xl"
        >
          {value === "go" ? "Solve" : value}
        </p>
        <p className="mt-3 min-h-[1.25rem] text-sm text-[#e6d5b0]">
          {value === "go" ? "The clock is running." : "The clock starts after this countdown."}
        </p>
      </div>
    </div>
  );
}
