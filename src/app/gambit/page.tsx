"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Chess, type Square } from "chess.js";
import { Libre_Baskerville, Playfair_Display } from "next/font/google";
import { ChessPieceSvg } from "@/components/chess-piece";
import { PuzzleCountdown, PuzzEloIntro, PuzzEloShowcase } from "@/components/puzzelo";
import {
  STARTING_HEARTS,
  STARTING_PUZZELO,
  TIME_PENALTY_PER_SEC,
  MISTAKE_PENALTY,
  applyPuzzElo,
  canAccessDate,
  currentStreak,
  emptyProgress,
  formatDisplayDate,
  formatTime,
  getPuzzleForDate,
  heartsRemaining,
  loadSession,
  monthGrid,
  parseDateKey,
  primaryTheme,
  resolvePuzzle,
  saveSession,
  STORAGE_VERSION,
  scoreBreakdown,
  shiftDateKey,
  mostRecentUnsolvedKey,
  themeLabel,
  toDateKey,
  uciMatches,
  verifyArchive,
  type BoardSnapshot,
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
const PROMOTION_CHOICES = ["q", "r", "b", "n"] as const;
const SOLVE_REVEAL_MS = 1800;
const OPPONENT_REPLY_MS = 700;

type MoveFeedback = {
  tone: "wrong" | "correct" | "solved";
  san: string;
  from: string;
  to: string;
  message: string;
};

let sharedAudio: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudio) sharedAudio = new AudioCtx();
  if (sharedAudio.state === "suspended") {
    void sharedAudio.resume();
  }
  return sharedAudio;
}

function playSound(freq: number, type: OscillatorType = "sine", duration = 0.12, volume = 0.08) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio blocked
  }
}

function playCountdownTick(step: number | "go") {
  if (step === 3) playSound(392, "square", 0.14, 0.07);
  else if (step === 2) playSound(494, "square", 0.14, 0.08);
  else if (step === 1) playSound(587, "square", 0.16, 0.09);
  else playSound(784, "triangle", 0.32, 0.1);
}

export default function DailyChessPage() {
  const calendarTitleId = useId();
  const resultsTitleId = useId();
  const eloIntroTitleId = useId();

  const [mounted, setMounted] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
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
  const [moveFeedback, setMoveFeedback] = useState<MoveFeedback | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [playUrl, setPlayUrl] = useState("");
  const [puzzElo, setPuzzElo] = useState(STARTING_PUZZELO);
  const [seenEloIntro, setSeenEloIntro] = useState(true);
  const [countdown, setCountdown] = useState<number | "go" | null>(null);
  const [clockLive, setClockLive] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(
    null,
  );
  const [dragGhost, setDragGhost] = useState<{
    from: string;
    type: string;
    color: "w" | "b";
    x: number;
    y: number;
    size: number;
    over: string | null;
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedSquareRef = useRef<string | null>(null);
  const solutionIndexRef = useRef(0);
  const gameFenRef = useRef<string | null>(null);
  const lastMoveRef = useRef<{ from: string; to: string } | null>(null);
  const persistReadyRef = useRef(false);
  const selectedKeyRef = useRef<string | null>(null);
  const resultsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartRef = useRef<{
    from: string;
    type: string;
    color: "w" | "b";
    x: number;
    y: number;
    size: number;
    pointerId: number;
  } | null>(null);
  const dragMovedRef = useRef(false);
  const suppressClickRef = useRef(false);
  const stopDragListenersRef = useRef<(() => void) | null>(null);

  selectedSquareRef.current = selectedSquare;
  solutionIndexRef.current = solutionIndex;
  gameFenRef.current = gameFen;
  lastMoveRef.current = lastMove;
  selectedKeyRef.current = selectedKey;

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
  const showEloIntro = mounted && !seenEloIntro;
  const boardLocked =
    isCompleted || isOpponentMoving || !clockLive || showEloIntro || Boolean(pendingPromotion);

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
    if (!puzzle || !selectedKey) return;
    selectedSquareRef.current = null;
    solutionIndexRef.current = 0;
    gameFenRef.current = puzzle.fen;
    lastMoveRef.current = puzzle.lastMove;
    setGameFen(puzzle.fen);
    setSolutionIndex(0);
    setSelectedSquare(null);
    setLastMove(puzzle.lastMove);
    setShakeSquare(null);
    setIsOpponentMoving(false);
    setMoveFeedback(null);
    setDragGhost(null);
    setPendingPromotion(null);
    dragStartRef.current = null;
    dragMovedRef.current = false;
    setProgress((prev) => {
      const current = prev[selectedKey] ?? emptyProgress();
      return {
        ...prev,
        [selectedKey]: {
          ...current,
          board: {
            fen: puzzle.fen,
            solutionIndex: 0,
            lastMove: puzzle.lastMove,
          },
        },
      };
    });
    playSound(260, "sine", 0.08);
  }, [puzzle, selectedKey]);

  useEffect(() => {
    const now = new Date();
    const key = toDateKey(now);
    const session = loadSession();
    const lastKey = session.lastSelectedKey;
    const lastDate = lastKey ? parseDateKey(lastKey) : null;
    const resumeKey =
      lastKey && lastDate && canAccessDate(lastDate, now) ? lastKey : key;

    setTodayKey(key);
    setSelectedKey(resumeKey);
    setCalendarCursor({
      year: (resumeKey !== key && lastDate ? lastDate : now).getFullYear(),
      month: (resumeKey !== key && lastDate ? lastDate : now).getMonth(),
    });
    setProgress(session.days);
    setPuzzElo(session.puzzElo);
    setSeenEloIntro(session.seenPuzzEloIntro);
    setPlayUrl(`${window.location.origin}/gambit`);
    setMounted(true);
    setSessionReady(true);
    persistReadyRef.current = true;

    if (process.env.NODE_ENV === "development") {
      const errors = verifyArchive();
      if (errors.length) console.error("Puzzle archive errors", errors);
    }
  }, []);

  useEffect(() => {
    if (!puzzle) return;
    const stats = selectedKey ? progress[selectedKey] : undefined;
    const alreadySolved = Boolean(stats?.completed);
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
      const last = finale
        ? { from: finale.slice(0, 2), to: finale.slice(2, 4) }
        : puzzle.lastMove;
      gameFenRef.current = finished.fen();
      solutionIndexRef.current = puzzle.solution.length;
      lastMoveRef.current = last;
      setGameFen(finished.fen());
      setSolutionIndex(puzzle.solution.length);
      setLastMove(last);
    } else {
      let fen = stats?.board?.fen ?? puzzle.fen;
      let idx = stats?.board?.solutionIndex ?? 0;
      let last = stats?.board?.lastMove ?? puzzle.lastMove;
      try {
        const restored = new Chess(fen);
        if (idx % 2 === 1 && puzzle.solution[idx]) {
          const uci = puzzle.solution[idx];
          restored.move({
            from: uci.slice(0, 2),
            to: uci.slice(2, 4),
            promotion: uci[4],
          });
          fen = restored.fen();
          idx += 1;
          last = { from: uci.slice(0, 2), to: uci.slice(2, 4) };
        }
      } catch {
        fen = puzzle.fen;
        idx = 0;
        last = puzzle.lastMove;
      }
      gameFenRef.current = fen;
      solutionIndexRef.current = idx;
      lastMoveRef.current = last;
      setGameFen(fen);
      setSolutionIndex(idx);
      setLastMove(last);
    }
    selectedSquareRef.current = null;
    setSelectedSquare(null);
    setShakeSquare(null);
    setIsOpponentMoving(false);
    setMoveFeedback(null);
    setDragGhost(null);
    setPendingPromotion(null);
    dragStartRef.current = null;
    dragMovedRef.current = false;
    setShowResults(false);
    setCopiedShare(false);
    setClockLive(false);
    setCountdown(null);
    if (resultsTimerRef.current) {
      clearTimeout(resultsTimerRef.current);
      resultsTimerRef.current = null;
    }
    // Timer and mistake counts live in `progress` and must not reset here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle?.id, selectedKey]);

  useEffect(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (!sessionReady || !mounted || showEloIntro || !puzzle || !selectedKey || isCompleted) {
      setCountdown(null);
      setClockLive(false);
      return;
    }

    setClockLive(false);
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown((current) => {
        if (current === 3) return 2;
        if (current === 2) return 1;
        if (current === 1) return "go";
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
        setClockLive(true);
        return null;
      });
    }, 900);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [sessionReady, mounted, showEloIntro, puzzle?.id, selectedKey, isCompleted]);

  useEffect(() => {
    if (countdown === null) return;
    playCountdownTick(countdown);
  }, [countdown]);

  useEffect(() => {
    if (!mounted || !persistReadyRef.current) return;
    saveSession({
      version: STORAGE_VERSION,
      lastSelectedKey: selectedKey,
      days: progress,
      puzzElo,
      seenPuzzEloIntro: seenEloIntro,
    });
  }, [progress, selectedKey, mounted, puzzElo, seenEloIntro]);

  useEffect(() => {
    if (!mounted || !selectedKey || isCompleted || !clockLive || showEloIntro) {
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
  }, [mounted, selectedKey, isCompleted, clockLive, showEloIntro]);

  useEffect(() => {
    return () => {
      if (resultsTimerRef.current) clearTimeout(resultsTimerRef.current);
    };
  }, []);

  const selectDate = (key: string) => {
    if (!todayDate) return;
    const next = parseDateKey(key);
    if (!canAccessDate(next, todayDate)) return;
    setSelectedKey(key);
    setCalendarOpen(false);
  };

  const persistBoard = useCallback(
    (snapshot: BoardSnapshot, dayKey: string | null = selectedKey) => {
      if (!dayKey) return;
      setProgress((prev) => {
        const current = prev[dayKey] ?? emptyProgress();
        return { ...prev, [dayKey]: { ...current, board: snapshot } };
      });
    },
    [selectedKey],
  );

  const completePuzzle = useCallback((dayKey: string, revealDelayMs: number) => {
    const snapshot: BoardSnapshot = {
      fen: gameFenRef.current ?? "",
      solutionIndex: solutionIndexRef.current,
      lastMove: lastMoveRef.current,
    };
    const record = getPuzzleForDate(parseDateKey(dayKey));
    setProgress((prev) => {
      const current = prev[dayKey] ?? emptyProgress();
      if (current.completed) return prev;
      const update = record
        ? applyPuzzElo(puzzElo, record.rating, current.mistakes, current.seconds)
        : null;
      if (update) {
        queueMicrotask(() => setPuzzElo(update.next));
      }
      return {
        ...prev,
        [dayKey]: {
          ...current,
          completed: true,
          board: snapshot.fen ? snapshot : current.board,
          eloDelta: update?.delta ?? current.eloDelta ?? null,
          eloAfter: update?.next ?? current.eloAfter ?? null,
        },
      };
    });
    playSound(784, "triangle", 0.28);
    window.setTimeout(() => playSound(988, "triangle", 0.22), 140);
    if (resultsTimerRef.current) clearTimeout(resultsTimerRef.current);
    if (revealDelayMs <= 0) {
      setShowResults(true);
      return;
    }
    resultsTimerRef.current = setTimeout(() => {
      resultsTimerRef.current = null;
      if (selectedKeyRef.current !== dayKey) return;
      setShowResults(true);
    }, revealDelayMs);
  }, [puzzElo]);

  const registerMistake = (from: string, to: string, san: string) => {
    if (!selectedKey) return;
    setProgress((prev) => {
      const current = prev[selectedKey] ?? emptyProgress();
      return { ...prev, [selectedKey]: { ...current, mistakes: current.mistakes + 1 } };
    });
    setShakeSquare(to);
    setTimeout(() => setShakeSquare(null), 500);
    setMoveFeedback({
      tone: "wrong",
      san,
      from,
      to,
      message: "Legal, but not the winning idea. You lose a heart; the clock keeps running.",
    });
    playSound(196, "sawtooth", 0.12);
    setSelectedSquare(null);
  };

  const squareFromPoint = (x: number, y: number) => {
    const node = document.elementFromPoint(x, y);
    if (!(node instanceof Element)) return null;
    return node.closest("[data-square]")?.getAttribute("data-square") ?? null;
  };

  const clearDrag = () => {
    stopDragListenersRef.current?.();
    stopDragListenersRef.current = null;
    dragStartRef.current = null;
    dragMovedRef.current = false;
    setDragGhost(null);
  };

  const playUserMove = (from: string, to: string, promotion?: string) => {
    if (!puzzle || isCompleted || isOpponentMoving || !clockLive || showEloIntro || !selectedKey) {
      return;
    }
    if (from === to) return;
    const dayKey = selectedKey;

    const board = new Chess(gameFenRef.current ?? puzzle.fen);
    const legalFrom = board.moves({
      square: from as Square,
      verbose: true,
    });
    const destMoves = legalFrom.filter((move) => move.to === to);
    if (destMoves.length === 0) {
      selectedSquareRef.current = null;
      setSelectedSquare(null);
      setPendingPromotion(null);
      setMoveFeedback({
        tone: "wrong",
        san: `${from}→${to}`,
        from,
        to,
        message: `${from} to ${to} is not legal from this position.`,
      });
      setShakeSquare(to);
      window.setTimeout(() => setShakeSquare(null), 450);
      playSound(160, "square", 0.08);
      return;
    }

    const promoOptions = destMoves.filter((move) => Boolean(move.promotion));
    if (promoOptions.length > 1 && !promotion) {
      setPendingPromotion({ from, to });
      selectedSquareRef.current = null;
      setSelectedSquare(null);
      playSound(523, "triangle", 0.08);
      return;
    }

    const expected = puzzle.solution[solutionIndexRef.current];
    const expectedPromo = expected && expected.length > 4 ? expected[4].toLowerCase() : "q";
    const candidate =
      destMoves.find((move) =>
        promotion
          ? (move.promotion ?? "").toLowerCase() === promotion.toLowerCase()
          : !move.promotion || (move.promotion ?? "").toLowerCase() === expectedPromo,
      ) ??
      destMoves.find((move) => (move.promotion ?? "").toLowerCase() === "q") ??
      destMoves[0];

    const playedUci = `${candidate.from}${candidate.to}${candidate.promotion ?? ""}`;
    const probe = new Chess(board.fen());
    probe.move({
      from: candidate.from,
      to: candidate.to,
      promotion: candidate.promotion,
    });
    const isMate = probe.isCheckmate();
    const isCorrect =
      (Boolean(expected) && uciMatches(playedUci, expected)) || (puzzle.isMateInOne && isMate);
    const san = candidate.san || `${from}→${to}`;
    const opponentName = puzzle.playerColor === "w" ? "Black" : "White";
    setPendingPromotion(null);

    if (!isCorrect) {
      selectedSquareRef.current = null;
      registerMistake(from, to, san);
      return;
    }

    playSound(659.25, "sine", 0.14);
    selectedSquareRef.current = null;
    const playerLast = { from: candidate.from, to: candidate.to };
    gameFenRef.current = probe.fen();
    lastMoveRef.current = playerLast;
    solutionIndexRef.current += 1;
    setGameFen(probe.fen());
    setLastMove(playerLast);
    setSolutionIndex(solutionIndexRef.current);
    setSelectedSquare(null);
    persistBoard(
      {
        fen: probe.fen(),
        solutionIndex: solutionIndexRef.current,
        lastMove: playerLast,
      },
      dayKey,
    );

    const opponentUci = puzzle.solution[solutionIndexRef.current];
    if (!opponentUci) {
      setMoveFeedback({
        tone: "solved",
        san,
        from,
        to,
        message: isMate ? "Checkmate." : "Puzzle solved.",
      });
      completePuzzle(dayKey, SOLVE_REVEAL_MS);
      return;
    }

    setMoveFeedback({
      tone: "correct",
      san,
      from,
      to,
      message: `That's the idea. ${opponentName} has to reply.`,
    });

    const afterPlayerIndex = solutionIndexRef.current;
    setIsOpponentMoving(true);
    window.setTimeout(() => {
      const replyGame = new Chess(probe.fen());
      const parts = {
        from: opponentUci.slice(0, 2) as Square,
        to: opponentUci.slice(2, 4) as Square,
        promotion: opponentUci[4],
      };
      const reply = replyGame.move(parts);
      const replyLast = { from: parts.from, to: parts.to };
      const afterOppIndex = afterPlayerIndex + 1;
      persistBoard(
        {
          fen: replyGame.fen(),
          solutionIndex: afterOppIndex,
          lastMove: replyLast,
        },
        dayKey,
      );
      if (selectedKeyRef.current !== dayKey) return;
      gameFenRef.current = replyGame.fen();
      lastMoveRef.current = replyLast;
      solutionIndexRef.current = afterOppIndex;
      setGameFen(replyGame.fen());
      setLastMove(replyLast);
      setSolutionIndex(afterOppIndex);
      playSound(330, "sine", 0.12);
      setIsOpponentMoving(false);
      const replySan = reply?.san ? ` ${reply.san}` : "";
      setMoveFeedback({
        tone: "correct",
        san,
        from,
        to,
        message: `It stood up. ${opponentName} played${replySan}. Your turn — finish it.`,
      });
    }, OPPONENT_REPLY_MS);
  };

  const handlePiecePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    sq: string,
    piece: { type: string; color: "w" | "b" },
  ) => {
    if (!puzzle || boardLocked) return;
    if (piece.color !== puzzle.playerColor) return;
    if (event.button !== 0 && event.pointerType === "mouse") return;

    clearDrag();

    const rect = event.currentTarget.getBoundingClientRect();
    const pointerId = event.pointerId;
    dragStartRef.current = {
      from: sq,
      type: piece.type,
      color: piece.color,
      x: event.clientX,
      y: event.clientY,
      size: rect.width,
      pointerId,
    };
    dragMovedRef.current = false;

    try {
      event.currentTarget.setPointerCapture(pointerId);
    } catch {
      // Synthetic or already-released pointers can throw; window listeners still track the drag.
    }

    const onMove = (moveEvent: PointerEvent) => {
      const start = dragStartRef.current;
      if (!start || start.pointerId !== moveEvent.pointerId) return;
      if (moveEvent.buttons === 0) {
        onUp(moveEvent);
        return;
      }

      const dx = moveEvent.clientX - start.x;
      const dy = moveEvent.clientY - start.y;
      if (!dragMovedRef.current) {
        if (Math.hypot(dx, dy) < 8) return;
        dragMovedRef.current = true;
        selectedSquareRef.current = start.from;
        setSelectedSquare(start.from);
        moveEvent.preventDefault();
      }

      setDragGhost({
        from: start.from,
        type: start.type,
        color: start.color,
        x: moveEvent.clientX,
        y: moveEvent.clientY,
        size: start.size,
        over: squareFromPoint(moveEvent.clientX, moveEvent.clientY),
      });
    };

    const onUp = (upEvent: PointerEvent) => {
      const start = dragStartRef.current;
      if (!start || start.pointerId !== upEvent.pointerId) return;
      const moved = dragMovedRef.current;
      const over = squareFromPoint(upEvent.clientX, upEvent.clientY);
      clearDrag();
      if (!moved) return;
      suppressClickRef.current = true;
      if (over && over !== start.from) {
        playUserMove(start.from, over);
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    stopDragListenersRef.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  };

  const handleSquareClick = (sq: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (!puzzle || boardLocked) return;

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

    playUserMove(currentSelected, sq);
  };

  const shareText = puzzle && selectedDate && scoring
    ? `♟️ Daily Gambit — ${formatDisplayDate(selectedDate)}
${"♥".repeat(heartsLeft)}${"♡".repeat(STARTING_HEARTS - heartsLeft)}
⏱️ ${formatTime(dayStats.seconds)} · ${scoring.total} pts
Lichess ${puzzle.id} · ${primaryTheme(puzzle.themes)}
Play it: ${playUrl || "/gambit"}`
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
  const sideToMove = chess.turn();
  const turnIsWhite = sideToMove === "w";
  const dimOpponents = Boolean(puzzle) && !isCompleted && clockLive && !isOpponentMoving;
  const ranks = playerIsBlack ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const files = playerIsBlack ? [...FILES].reverse() : [...FILES];

  const prevKey = selectedKey ? shiftDateKey(selectedKey, -1) : null;
  const nextKey = selectedKey ? shiftDateKey(selectedKey, 1) : null;
  const canGoPrev = Boolean(todayDate && prevKey && canAccessDate(parseDateKey(prevKey), todayDate));
  const canGoNext = Boolean(todayDate && nextKey && canAccessDate(parseDateKey(nextKey), todayDate));
  const latestUnsolvedKey = todayKey
    ? mostRecentUnsolvedKey(progress, todayKey, selectedKey)
    : null;

  const playNextAvailablePuzzle = () => {
    if (!latestUnsolvedKey) return;
    setShowResults(false);
    selectDate(latestUnsolvedKey);
  };

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
          <div className="flex items-center gap-2">
            <span className="text-xl text-[#c6a046]">♞</span>
            <span
              className="text-lg tracking-tight text-[#f6ead0] sm:text-xl"
              style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
            >
              Daily Gambit
            </span>
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
              title="Daily Gambit ELO updates when you finish a daily"
              className="flex items-center gap-1.5 rounded border border-[#c6a046]/40 bg-[#173528] px-2.5 py-1 text-xs"
            >
              <span className="hidden text-[#d9c9a6] sm:inline">Daily Gambit ELO</span>
              <span className="font-mono font-semibold text-[#f0d48a]">{puzzElo}</span>
            </div>
            <div
              title="The clock does not reset if you restart the board or browse another day"
              className={`flex w-[9.75rem] items-center justify-between gap-1.5 rounded border px-2.5 py-1 text-xs transition-colors duration-300 ${
                clockLive && !isCompleted
                  ? "border-[#c6a046] bg-[#5c3317]"
                  : "border-[#c6a046]/25 bg-[#173528]"
              }`}
            >
              <span className="text-[#d9c9a6]">
                {clockLive && !isCompleted
                  ? "On clock"
                  : countdown !== null
                    ? "Ready"
                    : "Clock"}
              </span>
              <span className="w-10 text-right font-mono font-semibold tabular-nums text-[#f0d48a]">
                {countdown !== null && countdown !== "go"
                  ? countdown
                  : formatTime(dayStats.seconds)}
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
              className="mt-1 min-h-[2.5rem] text-3xl text-[#f7eed8] sm:min-h-[2.75rem] sm:text-4xl"
              style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
            >
              {puzzle ? primaryTheme(puzzle.themes) : "Daily Puzzle"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              {puzzle ? (
                <TurnBadge
                  color={isCompleted ? puzzle.playerColor : sideToMove}
                  status={isCompleted ? "solved" : isOpponentMoving ? "reply" : "play"}
                />
              ) : (
                <p className="text-sm italic text-[#d7c7a4]">Loading the daily position…</p>
              )}
              {puzzle ? (
                <p className="text-sm text-[#d7c7a4]">
                  Lichess {puzzle.id} · {puzzle.rating} Elo
                </p>
              ) : null}
            </div>
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
            <div
              className={`relative rounded-sm border-[10px] border-[#5c3317] bg-[#3d2212] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-[box-shadow] duration-300 ${
                isCompleted
                  ? "ring-4 ring-[#c6a046]/70"
                  : turnIsWhite
                    ? "ring-4 ring-[#fff8eb]"
                    : "ring-4 ring-[#1a120c]"
              }`}
            >
              <div className="mb-2 flex h-6 items-center justify-between gap-3 px-1 text-[11px] uppercase tracking-[0.18em] text-[#e6d3a8]">
                <span>Staunton Club Board</span>
                <TurnBadge
                  color={isCompleted && puzzle ? puzzle.playerColor : sideToMove}
                  status={isCompleted ? "solved" : isOpponentMoving ? "reply" : "play"}
                  compact
                />
              </div>
              <div className="relative">
              {moveFeedback?.tone === "solved" && !showResults && (
                <div className="gambit-overlay-in pointer-events-none absolute inset-x-2 top-2 z-10 rounded-sm border-2 border-[#c6a046] bg-[#0f241c]/92 px-4 py-2 text-center">
                  <p className="font-mono text-2xl font-bold tracking-wide text-[#f0d48a]">
                    {moveFeedback.san}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c6a046]">
                    {moveFeedback.san.includes("#") ? "Checkmate" : "Puzzle solved"}
                  </p>
                </div>
              )}
              <div
                key={puzzle?.id ?? "empty"}
                className="gambit-fade-in grid aspect-square grid-cols-8 grid-rows-8 overflow-hidden rounded-sm border-2 border-[#2a170c] shadow-inner [grid-template-rows:repeat(8,minmax(0,1fr))] [grid-template-columns:repeat(8,minmax(0,1fr))]"
              >
                {ranks.map((rank, rIdx) =>
                  files.map((file, fIdx) => {
                    const sq = `${file}${rank}`;
                    const isDark = (fIdx + rIdx) % 2 === 1;
                    const piece = chess.get(sq as Square);
                    const isSelected = selectedSquare === sq;
                    const isLast = lastMove?.from === sq || lastMove?.to === sq;
                    const isLegal = legalDestinationSquares.has(sq);
                    const isFeedbackFrom = moveFeedback?.from === sq;
                    const isFeedbackTo = moveFeedback?.to === sq;
                    const isFeedbackMove = Boolean(moveFeedback && (isFeedbackFrom || isFeedbackTo));

                    const isDragOver = dragGhost?.over === sq && dragGhost.from !== sq;
                    const canDrag =
                      Boolean(piece) &&
                      !boardLocked &&
                      piece?.color === puzzle?.playerColor;

                    const isSuccessHighlight =
                      ((moveFeedback?.tone === "correct" || moveFeedback?.tone === "solved") &&
                        isFeedbackMove) ||
                      (isCompleted && isLast);

                    let squareBg = isDark ? "bg-[#b58863]" : "bg-[#f0d9b5]";
                    if (isSelected) squareBg = "bg-[#c6a046] ring-4 ring-[#5c3317] ring-inset";
                    else if (isDragOver && isLegal) squareBg = "bg-[#c6a046]/80";
                    else if (moveFeedback?.tone === "wrong" && isFeedbackMove) {
                      squareBg = isFeedbackTo
                        ? "bg-[#9b2c2c] ring-4 ring-[#f3e6c9]/40 ring-inset"
                        : "bg-[#7f1d1d]/90";
                    } else if (isSuccessHighlight) {
                      const isLanding =
                        (moveFeedback && isFeedbackTo) ||
                        (isCompleted && lastMove?.to === sq);
                      squareBg = isLanding
                        ? "bg-[#2d8a4a] ring-4 ring-[#e8f6e8]/50 ring-inset"
                        : "bg-[#1d5c32]/90";
                    } else if (isLast) squareBg = isDark ? "bg-[#c0a06a]" : "bg-[#e6c27a]";

                    return (
                      <button
                        key={sq}
                        type="button"
                        data-square={sq}
                        draggable={false}
                        onClick={() => handleSquareClick(sq)}
                        onPointerDown={
                          piece ? (event) => handlePiecePointerDown(event, sq, piece) : undefined
                        }
                        aria-label={`Square ${sq}`}
                        className={`relative flex min-h-0 min-w-0 touch-none items-center justify-center overflow-hidden transition-colors duration-200 ${squareBg} ${
                          shakeSquare === sq ? "animate-bounce bg-red-800/70" : ""
                        } ${canDrag ? (dragGhost ? "cursor-grabbing" : "cursor-grab") : ""}`}
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
                        {piece ? (
                          <span
                            className={`flex h-full w-full items-center justify-center ${
                              dimOpponents && piece.color !== sideToMove ? "opacity-80" : ""
                            } ${dragGhost?.from === sq ? "opacity-20" : ""}`}
                          >
                            <ChessPieceSvg type={piece.type} color={piece.color} />
                          </span>
                        ) : null}
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
              {countdown !== null && !isCompleted && (
                <PuzzleCountdown value={countdown} />
              )}
              {pendingPromotion && puzzle && (
                <div className="gambit-overlay-in absolute inset-0 z-20 flex items-center justify-center rounded-sm bg-[#0a1812]/72">
                  <div className="mx-3 w-full max-w-sm rounded-sm border-2 border-[#c6a046] bg-[#f3e6c9] p-4 text-center text-[#2c2419] shadow-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a5b28]">
                      Promote pawn
                    </p>
                    <p className="mt-1 text-sm text-[#5c4a32]">
                      Choose the piece for {pendingPromotion.from}→{pendingPromotion.to}.
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {PROMOTION_CHOICES.map((piece) => (
                        <button
                          key={piece}
                          type="button"
                          onClick={() =>
                            playUserMove(pendingPromotion.from, pendingPromotion.to, piece)
                          }
                          className="relative flex aspect-square items-center justify-center rounded-sm border-2 border-[#5c3317]/30 bg-[#fff8e8] hover:border-[#c6a046]"
                          aria-label={`Promote to ${piece === "q" ? "queen" : piece === "r" ? "rook" : piece === "b" ? "bishop" : "knight"}`}
                        >
                          <ChessPieceSvg type={piece} color={puzzle.playerColor} />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingPromotion(null)}
                      className="mt-3 text-sm text-[#7a5b28]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {isCompleted && latestUnsolvedKey && (
                <div className="gambit-overlay-in absolute inset-x-2 bottom-2 z-20">
                  <button
                    type="button"
                    onClick={playNextAvailablePuzzle}
                    className="w-full rounded-sm border-2 border-[#c6a046] bg-[#c6a046] px-4 py-3 text-base font-semibold tracking-wide text-[#2c2419] shadow-[0_8px_24px_rgba(0,0,0,0.45)] hover:bg-[#d4b056]"
                  >
                    Play Next Available Puzzle
                  </button>
                </div>
              )}
              </div>
            </div>

            <div className="mt-4 min-h-[3.5rem]">
            {isCompleted && !showResults && (
              <button
                type="button"
                onClick={() => setShowResults(true)}
                className={`gambit-overlay-in w-full rounded-sm border-2 px-4 py-3 text-base font-semibold tracking-wide shadow-lg ${
                  latestUnsolvedKey
                    ? "border-[#c6a046]/50 bg-[#173528] text-[#f3e6c9] hover:border-[#c6a046]"
                    : "border-[#c6a046] bg-[#c6a046] text-[#2c2419] hover:bg-[#d4b056]"
                }`}
              >
                View scorecard
              </button>
            )}
            </div>

            <div
              role="status"
              aria-live="polite"
              className={`mt-4 flex min-h-[3.25rem] flex-wrap items-center justify-between gap-3 rounded-sm border px-3 py-2.5 text-sm transition-colors duration-300 ${
                moveFeedback?.tone === "wrong"
                  ? "border-[#c45c4a]/70 bg-[#3a1512] text-[#f6d5d0]"
                  : moveFeedback?.tone === "solved"
                    ? "border-[#c6a046] bg-[#173528] text-[#f6ead0]"
                    : moveFeedback?.tone === "correct"
                      ? "border-[#4d8a5c]/80 bg-[#143326] text-[#d7f0d4]"
                      : "border-transparent text-[#d7c7a4]"
              }`}
            >
              {moveFeedback ? (
                <p>
                  <span className="mr-2 font-mono text-base font-bold tracking-wide">
                    {moveFeedback.tone === "wrong" ? "✗" : "✓"} {moveFeedback.san}
                  </span>
                  {moveFeedback.message}
                </p>
              ) : (
                <p className="italic">
                  Select a piece, or drag it. Dots appear only on moves that are legal in
                  this position.
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={resetBoardToStart}
                  disabled={isCompleted}
                  className="rounded border border-[#c6a046]/40 bg-[#173528] px-3 py-1.5 text-xs tracking-wide text-[#f3e6c9] hover:border-[#c6a046] disabled:opacity-40"
                >
                  Reset board
                </button>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[#b8a888]">
              Resetting the board restores the starting position only. Time, hearts, and
              misses stay with this date — same if you open an earlier puzzle.
            </p>
          </div>

          <aside className="flex flex-col gap-5 lg:col-span-5">
            <PuzzEloShowcase
              rating={puzzElo}
              lastDelta={dayStats.eloDelta ?? null}
              puzzleRating={puzzle?.rating ?? null}
            />
            <section className="rounded-sm border border-[#c6a046]/35 bg-[#f3e6c9] p-5 text-[#2c2419] shadow-xl">
              <h2
                className="text-sm uppercase tracking-[0.18em] text-[#7a5b28]"
                style={{ fontFamily: "var(--font-chess-display), Georgia, serif" }}
              >
                Live score
              </h2>
              <p className="mt-2 font-mono text-5xl font-bold leading-none tracking-tight tabular-nums text-[#5c3317] sm:text-6xl">
                {scoring?.total ?? "—"}
              </p>
              {isCompleted && !showResults && (
                <button
                  type="button"
                  onClick={() => setShowResults(true)}
                  className="mt-4 w-full rounded-sm border-2 border-[#5c3317] bg-[#5c3317] px-4 py-3 text-sm font-semibold tracking-wide text-[#f3e6c9] hover:bg-[#7a4420]"
                >
                  View scorecard
                </button>
              )}
              <dl className="mt-5 space-y-2 text-sm">
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
                  <li className="flex items-center gap-2">
                    Side to move:
                    <TurnBadge
                      color={isCompleted ? puzzle.playerColor : sideToMove}
                      status={isCompleted ? "solved" : isOpponentMoving ? "reply" : "play"}
                      compact
                    />
                  </li>
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
          </aside>
        </div>
      </main>

      {dragGhost && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
          style={{
            left: dragGhost.x,
            top: dragGhost.y,
            width: dragGhost.size,
            height: dragGhost.size,
          }}
        >
          <div className="relative h-full w-full">
            <ChessPieceSvg type={dragGhost.type} color={dragGhost.color} />
          </div>
        </div>
      )}

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

      {showEloIntro && (
        <PuzzEloIntro
          titleId={eloIntroTitleId}
          onBegin={() => {
            getAudioContext();
            setSeenEloIntro(true);
          }}
        />
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
              <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
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
                <div>
                  Daily Gambit ELO
                  <p className="font-mono text-sm font-semibold">
                    {dayStats.eloDelta == null
                      ? "—"
                      : `${dayStats.eloDelta >= 0 ? "+" : ""}${dayStats.eloDelta}`}
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
              {playUrl && (
                <p className="text-xs text-[#5c4a32]">
                  Includes {playUrl}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="rounded-sm border border-[#5c3317]/30 px-4 py-2 text-sm"
              >
                Back to the board
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResults(false);
                  setCalendarOpen(true);
                }}
                className="rounded-sm border border-[#c6a046] bg-[#fff8e8] px-4 py-2.5 text-sm font-medium text-[#5c3317] hover:bg-[#f3e6c9]"
              >
                Play a previous day’s puzzle
              </button>
              {latestUnsolvedKey && (
                <button
                  type="button"
                  onClick={playNextAvailablePuzzle}
                  className="rounded-sm border border-[#c6a046] bg-[#c6a046] px-4 py-2.5 text-sm font-semibold text-[#2c2419] hover:bg-[#d4b056]"
                >
                  Play Next Available Puzzle
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TurnBadge({
  color,
  status,
  compact = false,
}: {
  color: "w" | "b";
  status: "play" | "reply" | "solved";
  compact?: boolean;
}) {
  const isWhite = color === "w";
  const label =
    status === "solved"
      ? "Solved"
      : status === "reply"
        ? `${isWhite ? "White" : "Black"} replies`
        : `${isWhite ? "White" : "Black"} to move`;

  if (status === "solved") {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-sm border-2 border-[#c6a046] bg-[#173528] font-semibold tracking-[0.12em] text-[#f6ead0] uppercase ${
          compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs"
        }`}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-sm border-2 font-semibold tracking-[0.14em] uppercase ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs sm:text-sm"
      } ${
        isWhite
          ? "border-[#f6ead0] bg-[#fff8eb] text-[#2c2419] shadow-[0_0_0_1px_#5c3317]"
          : "border-[#c6a046] bg-[#1c1410] text-[#f6ead0] shadow-[0_0_12px_rgba(0,0,0,0.45)]"
      }`}
    >
      <span
        aria-hidden
        className={`rounded-full border-2 ${compact ? "size-3" : "size-4"} ${
          isWhite ? "border-[#5c3317] bg-[#fff8eb]" : "border-[#c6a046] bg-[#1c1410]"
        }`}
      />
      {label}
    </span>
  );
}

function startOfDayCompare(a: Date, b: Date): number {
  return (
    Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) -
    Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  );
}
