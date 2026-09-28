"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Chess, type Square } from "chess.js";
import { Libre_Baskerville, Playfair_Display } from "next/font/google";
import { ChessPieceSvg } from "@/components/chess-piece";
import {
  STARTING_HEARTS,
  TIME_PENALTY_PER_SEC,
  MISTAKE_PENALTY,
  canAccessDate,
  currentStreak,
  emptyProgress,
  formatDisplayDate,
  formatTime,
  getPuzzleForDate,
  heartsRemaining,
  loadProgress,
  monthGrid,
  parseDateKey,
  primaryTheme,
  resolvePuzzle,
  saveProgress,
  scoreBreakdown,
  shiftDateKey,
  themeLabel,
  toDateKey,
  verifyArchive,
  type DayProgress,
} from "@/lib/daily-puzzle";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-chess-display",
});

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-chess-serif",
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

function playSound(freq: number, type: OscillatorType = "sine", duration = 0.12) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio blocked
  }
}

export default function DailyChessPage() {
  const calendarTitleId = useId();
  const resultsTitleId = useId();

  const [mounted, setMounted] = useState(false);
  const [todayKey, setTodayKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, DayProgress>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarCursor, setCalendarCursor] = useState({ year: 2026, month: 8 });

  const [gameFen, setGameFen] = useState<string | null>(null);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [shakeSquare, setShakeSquare] = useState<string | null>(null);
  const [isOpponentMoving, setIsOpponentMoving] = useState(false);
  const [coachNote, setCoachNote] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedSquareRef = useRef<string | null>(null);
  const solutionIndexRef = useRef(0);
  const gameFenRef = useRef<string | null>(null);

  selectedSquareRef.current = selectedSquare;
  solutionIndexRef.current = solutionIndex;
  gameFenRef.current = gameFen;

  const selectedDate = selectedKey ? parseDateKey(selectedKey) : null;
  const todayDate = todayKey ? parseDateKey(todayKey) : null;
  const rawPuzzle = selectedDate ? getPuzzleForDate(selectedDate) : null;
  const puzzle = useMemo(() => (rawPuzzle ? resolvePuzzle(rawPuzzle) : null), [rawPuzzle]);

  const dayStats = selectedKey ? (progress[selectedKey] ?? emptyProgress()) : emptyProgress();
  const isCompleted = dayStats.completed;
  const heartsLeft = heartsRemaining(dayStats.mistakes);
  const scoring = puzzle
    ? scoreBreakdown(puzzle.rating, dayStats.seconds, dayStats.mistakes)
    : null;
  const streak = todayKey ? currentStreak(progress, todayKey) : 0;
  const isToday = Boolean(todayKey && selectedKey === todayKey);

  const chess = useMemo(() => {
    try {
      return new Chess(gameFen ?? puzzle?.fen);
    } catch {
      return new Chess();
    }
  }, [gameFen, puzzle?.fen]);

  const legalMovesForSelected = useMemo(() => {
    if (!selectedSquare) return [];
    try {
      return chess.moves({ square: selectedSquare as Square, verbose: true });
    } catch {
      return [];
    }
  }, [selectedSquare, chess]);

  const legalDestinationSquares = useMemo(() => {
    return new Set<string>(legalMovesForSelected.map((move) => move.to));
  }, [legalMovesForSelected]);

  const resetBoardToStart = useCallback(() => {
    if (!puzzle) return;
    selectedSquareRef.current = null;
    solutionIndexRef.current = 0;
    gameFenRef.current = puzzle.fen;
    setGameFen(puzzle.fen);
    setSolutionIndex(0);
    setSelectedSquare(null);
    setLastMove(puzzle.lastMove);
    setShakeSquare(null);
    setIsOpponentMoving(false);
    setCoachNote(null);
    playSound(260, "sine", 0.08);
  }, [puzzle]);

  useEffect(() => {
    const now = new Date();
    const key = toDateKey(now);
    setTodayKey(key);
    setSelectedKey(key);
    setCalendarCursor({ year: now.getFullYear(), month: now.getMonth() });
    setProgress(loadProgress());
    setMounted(true);

    if (process.env.NODE_ENV === "development") {
      const errors = verifyArchive();
      if (errors.length) console.error("Puzzle archive errors", errors);
    }
  }, []);

  useEffect(() => {
    if (!puzzle) return;
    const alreadySolved = Boolean(progress[selectedKey ?? ""]?.completed);
    if (alreadySolved) {
      const finished = new Chess(puzzle.fen);
      for (const uci of puzzle.solution) {
        finished.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          promotion: uci[4],
        });
      }
      const finale = puzzle.solution.at(-1);
      gameFenRef.current = finished.fen();
      solutionIndexRef.current = puzzle.solution.length;
      setGameFen(finished.fen());
      setSolutionIndex(puzzle.solution.length);
      setLastMove(
        finale
          ? { from: finale.slice(0, 2), to: finale.slice(2, 4) }
          : puzzle.lastMove,
      );
    } else {
      gameFenRef.current = puzzle.fen;
      solutionIndexRef.current = 0;
      setGameFen(puzzle.fen);
      setSolutionIndex(0);
      setLastMove(puzzle.lastMove);
    }
    selectedSquareRef.current = null;
    setSelectedSquare(null);
    setShakeSquare(null);
    setIsOpponentMoving(false);
    setCoachNote(null);
    setShowResults(alreadySolved);
    setCopiedShare(false);
    // Timer and mistake counts live in `progress` and must not reset here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle?.id, selectedKey]);

  useEffect(() => {
    if (!mounted) return;
    saveProgress(progress);
  }, [progress, mounted]);

  useEffect(() => {
    if (!mounted || !selectedKey || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const current = prev[selectedKey] ?? emptyProgress();
        if (current.completed) return prev;
        return {
          ...prev,
          [selectedKey]: { ...current, seconds: current.seconds + 1 },
        };
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mounted, selectedKey, isCompleted]);

  const selectDate = (key: string) => {
    if (!todayDate) return;
    const next = parseDateKey(key);
    if (!canAccessDate(next, todayDate)) return;
    setSelectedKey(key);
    setCalendarOpen(false);
  };

  const completePuzzle = useCallback(() => {
    if (!selectedKey) return;
    setProgress((prev) => {
      const current = prev[selectedKey] ?? emptyProgress();
      return { ...prev, [selectedKey]: { ...current, completed: true } };
    });
    setShowResults(true);
    playSound(784, "triangle", 0.28);
  }, [selectedKey]);

  const registerMistake = (square: string) => {
    if (!selectedKey) return;
    setProgress((prev) => {
      const current = prev[selectedKey] ?? emptyProgress();
      return { ...prev, [selectedKey]: { ...current, mistakes: current.mistakes + 1 } };
    });
    setShakeSquare(square);
    setTimeout(() => setShakeSquare(null), 450);
    setCoachNote("A legal try, but not the winning idea. The clock keeps running.");
    playSound(196, "sawtooth", 0.12);
    setSelectedSquare(null);
  };

  const handleSquareClick = (sq: string) => {
    if (!puzzle || isCompleted || isOpponentMoving) return;

    const board = new Chess(gameFenRef.current ?? puzzle.fen);
    const clickedPiece = board.get(sq as Square);
    const currentSelected = selectedSquareRef.current;

    if (!currentSelected) {
      if (clickedPiece && clickedPiece.color === puzzle.playerColor) {
        selectedSquareRef.current = sq;
        setSelectedSquare(sq);
        playSound(440, "triangle", 0.05);
      }
      return;
    }

    if (currentSelected === sq) {
      selectedSquareRef.current = null;
      setSelectedSquare(null);
      return;
    }

    if (clickedPiece && clickedPiece.color === puzzle.playerColor) {
      selectedSquareRef.current = sq;
      setSelectedSquare(sq);
      playSound(440, "triangle", 0.05);
      return;
    }

    const legalFromSelected = board.moves({
      square: currentSelected as Square,
      verbose: true,
    });
    const candidate = legalFromSelected.find((move) => move.to === sq);
    if (!candidate) {
      selectedSquareRef.current = null;
      setSelectedSquare(null);
      return;
    }

    const expected = puzzle.solution[solutionIndexRef.current];
    const playedUci = `${candidate.from}${candidate.to}${candidate.promotion ?? ""}`;
    const probe = new Chess(board.fen());
    probe.move({
      from: candidate.from,
      to: candidate.to,
      promotion: candidate.promotion,
    });
    const isMate = probe.isCheckmate();
    const isCorrect =
      playedUci === expected || (puzzle.isMateInOne && isMate);

    if (!isCorrect) {
      selectedSquareRef.current = null;
      registerMistake(currentSelected);
      return;
    }

    playSound(659.25, "sine", 0.14);
    selectedSquareRef.current = null;
    gameFenRef.current = probe.fen();
    setGameFen(probe.fen());
    setLastMove({ from: candidate.from, to: candidate.to });
    setSelectedSquare(null);
    setCoachNote(null);

    const opponentUci = puzzle.solution[solutionIndexRef.current + 1];
    if (!opponentUci) {
      completePuzzle();
      return;
    }

    setIsOpponentMoving(true);
    window.setTimeout(() => {
      const replyGame = new Chess(probe.fen());
      const parts = {
        from: opponentUci.slice(0, 2) as Square,
        to: opponentUci.slice(2, 4) as Square,
        promotion: opponentUci[4],
      };
      replyGame.move(parts);
      gameFenRef.current = replyGame.fen();
      setGameFen(replyGame.fen());
      setLastMove({ from: parts.from, to: parts.to });
      playSound(330, "sine", 0.12);
      solutionIndexRef.current += 2;
      setSolutionIndex((idx) => idx + 2);
      setIsOpponentMoving(false);
    }, 520);
  };

  const shareText = puzzle && selectedDate && scoring
    ? `♟️ Daily Gambit — ${formatDisplayDate(selectedDate)}
${"♥".repeat(heartsLeft)}${"♡".repeat(STARTING_HEARTS - heartsLeft)}
⏱️ ${formatTime(dayStats.seconds)} · ${scoring.total} pts
Lichess ${puzzle.id} · ${primaryTheme(puzzle.themes)}`
    : "";

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // clipboard unavailable
    }
  };

  const playerIsBlack = puzzle?.playerColor === "b";
  const ranks = playerIsBlack ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const files = playerIsBlack ? [...FILES].reverse() : [...FILES];

  const prevKey = selectedKey ? shiftDateKey(selectedKey, -1) : null;
  const nextKey = selectedKey ? shiftDateKey(selectedKey, 1) : null;
  const canGoPrev = Boolean(todayDate && prevKey && canAccessDate(parseDateKey(prevKey), todayDate));
  const canGoNext = Boolean(todayDate && nextKey && canAccessDate(parseDateKey(nextKey), todayDate));

  return (
    <div
      className={`${playfair.variable} ${baskerville.variable} relative min-h-screen overflow-hidden bg-[#143326] text-[#f3e6c9]`}
      style={{ fontFamily: "var(--font-chess-serif), 'Palatino Linotype', Palatino, serif" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(198,160,70,0.16), transparent 42%), repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 4px)",
        }}
      />

      <header className="relative z-10 border-b border-[#c6a046]/25 bg-[#0f241c]/95 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded border border-[#c6a046]/30 bg-[#173528] px-3 py-1.5 text-xs tracking-wide text-[#e6d5b0] transition hover:border-[#c6a046] hover:text-[#fff8e8]"
            >
              ← Portfolio
            </Link>
            <div className="hidden h-4 w-px bg-[#c6a046]/30 sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xl text-[#c6a046]">♞</span>
              <span
                className="text-lg tracking-tight text-[#f6ead0] sm:text-xl"
                style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
              >
                Daily Gambit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              title="Consecutive days solved"
              className="flex items-center gap-1.5 rounded border border-[#c6a046]/25 bg-[#173528] px-2.5 py-1 text-xs"
            >
              <span>🔥</span>
              <span className="font-mono text-[#c6a046]">{streak}</span>
            </div>
            <div
              title="The clock does not reset if you restart the board or browse another day"
              className="flex items-center gap-1.5 rounded border border-[#c6a046]/25 bg-[#173528] px-2.5 py-1 text-xs"
            >
              <span className="hidden sm:inline text-[#d9c9a6]">Clock</span>
              <span className="font-mono font-semibold text-[#f0d48a]">
                {formatTime(dayStats.seconds)}
              </span>
            </div>
            <div className="flex items-center gap-0.5 rounded border border-[#c6a046]/25 bg-[#173528] px-2 py-1 text-sm">
              {Array.from({ length: STARTING_HEARTS }, (_, i) => (
                <span
                  key={i}
                  className={i < heartsLeft ? "text-[#c45c4a]" : "text-[#3d2a24]"}
                >
                  ♥
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c6a046]">
              {isToday ? "Today’s Puzzle" : "Archive Puzzle"}
            </p>
            <h1
              className="mt-1 text-3xl text-[#f7eed8] sm:text-4xl"
              style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
            >
              {puzzle ? primaryTheme(puzzle.themes) : "Daily Puzzle"}
            </h1>
            <p className="mt-1 text-sm italic text-[#d7c7a4]">
              {puzzle
                ? `${puzzle.playerColor === "w" ? "White" : "Black"} to play · Lichess ${puzzle.id} · ${puzzle.rating} Elo`
                : "Loading the daily position…"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() => prevKey && selectDate(prevKey)}
              className="rounded border border-[#c6a046]/30 bg-[#173528] px-2.5 py-2 text-sm text-[#e6d5b0] disabled:opacity-30"
              aria-label="Previous day’s puzzle"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className="min-w-[220px] rounded border border-[#c6a046]/40 bg-[#f3e6c9] px-4 py-2 text-sm text-[#2c2419] shadow-md"
            >
              {selectedDate ? formatDisplayDate(selectedDate) : "Select a date"}
              <span className="ml-2 text-[11px] uppercase tracking-wider text-[#7a5b28]">
                Calendar
              </span>
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => nextKey && selectDate(nextKey)}
              className="rounded border border-[#c6a046]/30 bg-[#173528] px-2.5 py-2 text-sm text-[#e6d5b0] disabled:opacity-30"
              aria-label="Next day’s puzzle"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-sm border-[10px] border-[#5c3317] bg-[#3d2212] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="mb-2 flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.18em] text-[#e6d3a8]">
                <span>Staunton Club Board</span>
                <span>{isCompleted ? "Solved" : isOpponentMoving ? "Reply…" : "Your move"}</span>
              </div>
              <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-sm border-2 border-[#2a170c] shadow-inner">
                {ranks.map((rank, rIdx) =>
                  files.map((file, fIdx) => {
                    const sq = `${file}${rank}`;
                    const isDark = (fIdx + rIdx) % 2 === 1;
                    const piece = chess.get(sq as Square);
                    const isSelected = selectedSquare === sq;
                    const isLast = lastMove?.from === sq || lastMove?.to === sq;
                    const isLegal = legalDestinationSquares.has(sq);

                    let squareBg = isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]";
                    if (isSelected) squareBg = "bg-[#c6a046] ring-4 ring-[#5c3317] ring-inset";
                    else if (isLast) squareBg = isDark ? "bg-[#c0a06a]" : "bg-[#e6c27a]";

                    return (
                      <button
                        key={sq}
                        type="button"
                        onClick={() => handleSquareClick(sq)}
                        aria-label={`Square ${sq}`}
                        className={`relative flex items-center justify-center ${squareBg} ${
                          shakeSquare === sq ? "animate-bounce bg-red-800/70" : ""
                        }`}
                      >
                        {fIdx === 0 && (
                          <span
                            className={`absolute top-0.5 left-1 text-[9px] font-bold ${
                              isDark ? "text-[#f0d9b5]/70" : "text-[#7a4f2a]"
                            }`}
                          >
                            {rank}
                          </span>
                        )}
                        {rIdx === 7 && (
                          <span
                            className={`absolute right-1 bottom-0.5 text-[9px] font-bold ${
                              isDark ? "text-[#f0d9b5]/70" : "text-[#7a4f2a]"
                            }`}
                          >
                            {file}
                          </span>
                        )}
                        {piece ? <ChessPieceSvg type={piece.type} color={piece.color} /> : null}
                        {isLegal && !piece && (
                          <span className="size-3.5 rounded-full bg-[#1a1511]/40" />
                        )}
                        {isLegal && piece && (
                          <span className="absolute inset-0.5 rounded-full border-4 border-[#1a1511]/45" />
                        )}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#d7c7a4]">
              <p className="italic">
                {coachNote ??
                  "Select your piece. Dots appear only on moves that are legal in this position."}
              </p>
              <button
                type="button"
                onClick={resetBoardToStart}
                className="rounded border border-[#c6a046]/40 bg-[#173528] px-3 py-1.5 text-xs tracking-wide text-[#f3e6c9] hover:border-[#c6a046]"
              >
                Reset board
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[#b8a888]">
              Resetting the board restores the starting position only. Time, hearts, and
              misses stay with this date — same if you open an earlier puzzle.
            </p>
          </div>

          <aside className="flex flex-col gap-5 lg:col-span-5">
            <section className="rounded-sm border border-[#c6a046]/35 bg-[#f3e6c9] p-5 text-[#2c2419] shadow-xl">
              <div className="flex items-center justify-between">
                <h2
                  className="text-sm uppercase tracking-[0.18em] text-[#7a5b28]"
                  style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
                >
                  Live score
                </h2>
                <span className="font-mono text-xl font-bold text-[#5c3317]">
                  {scoring?.total ?? "—"}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Base ({puzzle ? `${puzzle.rating} Elo` : "—"})</dt>
                  <dd className="font-mono">+{scoring?.base ?? 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Clock (−{TIME_PENALTY_PER_SEC} / sec)</dt>
                  <dd className="font-mono text-[#8a4b12]">
                    −{scoring?.timeDeduction ?? 0} ({formatTime(dayStats.seconds)})
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Misses (−{MISTAKE_PENALTY} / heart)</dt>
                  <dd className="font-mono">
                    −{scoring?.mistakeDeduction ?? 0} ({dayStats.mistakes})
                  </dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-[#c6a046]/40 pt-3 text-xs leading-relaxed text-[#5c4a32]">
                Everyone gets the same position at local midnight. Five hearts. A wrong
                legal move costs a heart, not the clock. Future dates stay locked.
              </p>
            </section>

            <section className="rounded-sm border border-[#c6a046]/25 bg-[#0f241c] p-5">
              <h2
                className="text-sm uppercase tracking-[0.18em] text-[#c6a046]"
                style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
              >
                The position
              </h2>
              {puzzle ? (
                <ul className="mt-3 space-y-2 text-sm text-[#e6d5b0]">
                  <li>Theme: {puzzle.themes.map(themeLabel).join(" · ")}</li>
                  <li>
                    Source:{" "}
                    <a
                      href={puzzle.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#f0d48a] underline decoration-[#c6a046]/50 underline-offset-2"
                    >
                      Lichess puzzle {puzzle.id}
                    </a>
                  </li>
                  <li>{puzzle.plays.toLocaleString()} recorded solves on Lichess</li>
                </ul>
              ) : (
                <p className="mt-3 text-sm text-[#d7c7a4]">No puzzle for this date.</p>
              )}
            </section>

            <section className="rounded-sm border border-[#c6a046]/20 bg-[#173528]/80 p-5 text-sm leading-relaxed text-[#d7c7a4]">
              <h2
                className="text-sm uppercase tracking-[0.18em] text-[#c6a046]"
                style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
              >
                How the daily works
              </h2>
              <p className="mt-3">
                One tactic a day, same for every visitor — the Chess.com Daily Puzzle
                model. Open the date to browse the archive; only today and past days
                unlock. Positions come from the public Lichess puzzle database, not
                hand-built mates.
              </p>
            </section>
          </aside>
        </div>
      </main>

      {calendarOpen && todayDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1812]/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={calendarTitleId}
            className="w-full max-w-md rounded-sm border border-[#c6a046]/50 bg-[#f3e6c9] p-5 text-[#2c2419] shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2
                id={calendarTitleId}
                className="text-lg"
                style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
              >
                Puzzle calendar
              </h2>
              <button
                type="button"
                onClick={() => setCalendarOpen(false)}
                className="text-sm text-[#7a5b28]"
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setCalendarCursor((c) => {
                    const d = new Date(c.year, c.month - 1, 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  })
                }
                className="px-2 py-1"
              >
                ‹
              </button>
              <p className="text-sm tracking-wide">
                {new Date(calendarCursor.year, calendarCursor.month, 1).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" },
                )}
              </p>
              <button
                type="button"
                onClick={() =>
                  setCalendarCursor((c) => {
                    const d = new Date(c.year, c.month + 1, 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  })
                }
                className="px-2 py-1"
              >
                ›
              </button>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-[#7a5b28]">
              {WEEKDAYS.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {monthGrid(calendarCursor.year, calendarCursor.month).map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const date = new Date(calendarCursor.year, calendarCursor.month, day);
                const key = toDateKey(date);
                const accessible = canAccessDate(date, todayDate);
                const solved = progress[key]?.completed;
                const isSelected = key === selectedKey;
                const isTodayCell = key === todayKey;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!accessible}
                    onClick={() => selectDate(key)}
                    title={
                      accessible
                        ? formatDisplayDate(date)
                        : startOfDayCompare(date, todayDate) > 0
                          ? "Available when that day arrives"
                          : "No archive puzzle"
                    }
                    className={`relative flex h-10 items-center justify-center rounded-sm text-sm ${
                      !accessible
                        ? "cursor-not-allowed text-[#b7a78a]/50"
                        : isSelected
                          ? "bg-[#173528] text-[#f3e6c9]"
                          : isTodayCell
                            ? "border border-[#c6a046] text-[#5c3317]"
                            : "hover:bg-[#e6d5b0]"
                    }`}
                  >
                    {day}
                    {solved && (
                      <span className="absolute bottom-0.5 text-[9px] text-[#2f6b45]">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#5c4a32]">
              Future days stay sealed. Solved days show a check. The highlighted date is
              the puzzle on the board.
            </p>
          </div>
        </div>
      )}

      {showResults && isCompleted && puzzle && scoring && selectedDate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0a1812]/75 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={resultsTitleId}
            className="w-full max-w-md rounded-sm border-2 border-[#c6a046] bg-[#f3e6c9] p-6 text-center text-[#2c2419] shadow-2xl"
          >
            <p className="text-[#c6a046]">♚</p>
            <h2
              id={resultsTitleId}
              className="mt-2 text-2xl"
              style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
            >
              Puzzle solved
            </h2>
            <p className="mt-1 text-sm italic text-[#5c4a32]">
              {formatDisplayDate(selectedDate)} · {primaryTheme(puzzle.themes)}
            </p>
            <div className="mt-5 rounded-sm border border-[#c6a046]/50 bg-[#fff8e8] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7a5b28]">Final score</p>
              <p className="mt-1 font-mono text-4xl font-bold text-[#5c3317]">{scoring.total}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  Clock
                  <p className="font-mono text-sm font-semibold">{formatTime(dayStats.seconds)}</p>
                </div>
                <div>
                  Hearts left
                  <p className="font-mono text-sm font-semibold">
                    {heartsLeft}/{STARTING_HEARTS}
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 font-mono tracking-[0.3em] text-[#c45c4a]">
              {"♥".repeat(heartsLeft)}
              {"♡".repeat(STARTING_HEARTS - heartsLeft)}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyShare}
                className="rounded-sm bg-[#5c3317] px-4 py-3 text-sm text-[#f3e6c9] hover:bg-[#7a4420]"
              >
                {copiedShare ? "Copied scorecard" : "Copy scorecard"}
              </button>
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="rounded-sm border border-[#5c3317]/30 px-4 py-2 text-sm"
              >
                Back to the board
              </button>
              {canGoNext && nextKey && (
                <button
                  type="button"
                  onClick={() => {
                    setShowResults(false);
                    selectDate(nextKey);
                  }}
                  className="text-sm text-[#7a5b28]"
                >
                  Next available day →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function startOfDayCompare(a: Date, b: Date): number {
  return (
    Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) -
    Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  );
}
