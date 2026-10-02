import { Chess, type Square } from "chess.js";
import {
  ARCHIVE_START_ISO,
  LICHESS_PUZZLES,
  type LichessPuzzleRecord,
} from "@/data/lichess-puzzles";

export const STARTING_HEARTS = 5;
export const STORAGE_KEY = "daily-gambit-v2";
export const STORAGE_VERSION = 3;
export const BASE_POINTS = 1000;
export const TIME_PENALTY_PER_SEC = 2;
export const MISTAKE_PENALTY = 150;
export const MIN_SCORE = 100;

const THEME_LABELS: Record<string, string> = {
  mateIn1: "Mate in 1",
  mateIn2: "Mate in 2",
  mateIn3: "Mate in 3",
  operaMate: "Opera Mate",
  anastasiaMate: "Anastasia's Mate",
  pillsburysMate: "Pillsbury's Mate",
  swallowstailMate: "Swallow's Tail Mate",
  arabianMate: "Arabian Mate",
  backRankMate: "Back-Rank Mate",
  pin: "Pin",
  fork: "Fork",
  sacrifice: "Sacrifice",
  discoveredCheck: "Discovered Check",
  discoveredAttack: "Discovered Attack",
  deflection: "Deflection",
  attraction: "Attraction",
  promotion: "Promotion",
  advancedPawn: "Advanced Pawn",
  kingsideAttack: "Kingside Attack",
  queensideAttack: "Queenside Attack",
  hangingPiece: "Hanging Piece",
  middlegame: "Middlegame",
  endgame: "Endgame",
  opening: "Opening",
  master: "Master Game",
  rookEndgame: "Rook Endgame",
  queenEndgame: "Queen Endgame",
  oneMove: "One Move",
  short: "Short",
  long: "Long",
};

export interface BoardSnapshot {
  fen: string;
  solutionIndex: number;
  lastMove: { from: string; to: string } | null;
}

export interface DayProgress {
  seconds: number;
  mistakes: number;
  completed: boolean;
  board?: BoardSnapshot | null;
}

export interface GambitSession {
  version: number;
  lastSelectedKey: string | null;
  days: Record<string, DayProgress>;
}

export interface ResolvedPuzzle {
  id: string;
  rating: number;
  plays: number;
  themes: string[];
  fen: string;
  lastMove: { from: string; to: string } | null;
  solution: string[];
  playerColor: "w" | "b";
  isMateInOne: boolean;
  sourceUrl: string;
}

export function emptyProgress(): DayProgress {
  return { seconds: 0, mistakes: 0, completed: false, board: null };
}

export function emptySession(): GambitSession {
  return { version: STORAGE_VERSION, lastSelectedKey: null, days: {} };
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / 86_400_000);
}

export function archiveStartDate(): Date {
  return parseDateKey(ARCHIVE_START_ISO);
}

export function getArchiveIndex(date: Date): number | null {
  const idx = daysBetween(archiveStartDate(), date);
  if (idx < 0 || LICHESS_PUZZLES.length === 0) return null;
  return idx % LICHESS_PUZZLES.length;
}

export function canAccessDate(date: Date, today: Date): boolean {
  if (startOfDay(date).getTime() > startOfDay(today).getTime()) return false;
  return getArchiveIndex(date) !== null;
}

export function getPuzzleForDate(date: Date): LichessPuzzleRecord | null {
  const idx = getArchiveIndex(date);
  if (idx === null) return null;
  return LICHESS_PUZZLES[idx] ?? null;
}

export function uciParts(uci: string): { from: Square; to: Square; promotion?: string } {
  return {
    from: uci.slice(0, 2) as Square,
    to: uci.slice(2, 4) as Square,
    promotion: uci.length > 4 ? uci[4] : undefined,
  };
}

function playPgn(pgn: string): Chess {
  const chess = new Chess();
  const tokens = pgn
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0 && !/^\d+\.+$/.test(token));

  for (const san of tokens) {
    const played = chess.move(san);
    if (!played) {
      throw new Error(`Illegal SAN "${san}" in PGN`);
    }
  }
  return chess;
}

export function resolvePuzzle(record: LichessPuzzleRecord): ResolvedPuzzle {
  const fromPgn = playPgn(record.pgn);
  const lastFromPgn = fromPgn.history({ verbose: true }).at(-1);
  const fen = record.fen ?? fromPgn.fen();

  const board = new Chess(fen);
  const playerColor = board.turn();

  if (record.fen) {
    const presented = fen.split(" ").slice(0, 2).join(" ");
    const derived = fromPgn.fen().split(" ").slice(0, 2).join(" ");
    if (presented !== derived) {
      throw new Error(
        `Puzzle ${record.id}: API FEN (${presented}) does not match PGN-derived FEN (${derived})`,
      );
    }
  }

  const probe = new Chess(fen);
  for (const uci of record.solution) {
    const { from, to, promotion } = uciParts(uci);
    const played = probe.move({ from, to, promotion });
    if (!played) {
      throw new Error(`Puzzle ${record.id}: illegal solution move ${uci} from ${probe.fen()}`);
    }
  }

  const lastMove = record.lastMove
    ? { from: record.lastMove.slice(0, 2), to: record.lastMove.slice(2, 4) }
    : lastFromPgn
      ? { from: lastFromPgn.from, to: lastFromPgn.to }
      : null;

  return {
    id: record.id,
    rating: record.rating,
    plays: record.plays,
    themes: record.themes,
    fen,
    lastMove,
    solution: record.solution,
    playerColor,
    isMateInOne: record.themes.includes("mateIn1"),
    sourceUrl: `https://lichess.org/training/${record.id}`,
  };
}

export function formatTime(totalSec: number): string {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${pad2(secs)}`;
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function themeLabel(theme: string): string {
  return THEME_LABELS[theme] ?? theme;
}

export function primaryTheme(themes: string[]): string {
  const preferred = themes.find(
    (t) => t.startsWith("mate") || t.endsWith("Mate") || t.includes("Mate"),
  );
  return themeLabel(preferred ?? themes[0] ?? "Tactics");
}

export function scoreBreakdown(rating: number, seconds: number, mistakes: number) {
  const base = BASE_POINTS + Math.round(rating / 10);
  const timeDeduction = seconds * TIME_PENALTY_PER_SEC;
  const mistakeDeduction = mistakes * MISTAKE_PENALTY;
  const total = Math.max(MIN_SCORE, base - timeDeduction - mistakeDeduction);
  return { base, timeDeduction, mistakeDeduction, total };
}

export function heartsRemaining(mistakes: number): number {
  return Math.max(0, STARTING_HEARTS - mistakes);
}

export function currentStreak(progress: Record<string, DayProgress>, todayKey: string): number {
  let streak = 0;
  let cursor = parseDateKey(todayKey);
  // Chess.com: a streak can still include today if solved, otherwise count back from yesterday
  if (!progress[todayKey]?.completed) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (progress[toDateKey(cursor)]?.completed) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function sanitizeLastMove(value: unknown): { from: string; to: string } | null {
  if (!value || typeof value !== "object") return null;
  const from = (value as { from?: unknown }).from;
  const to = (value as { to?: unknown }).to;
  if (typeof from !== "string" || typeof to !== "string") return null;
  return { from, to };
}

function sanitizeBoard(value: unknown): BoardSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const fen = (value as { fen?: unknown }).fen;
  const solutionIndex = (value as { solutionIndex?: unknown }).solutionIndex;
  if (typeof fen !== "string" || typeof solutionIndex !== "number" || !Number.isFinite(solutionIndex)) {
    return null;
  }
  return {
    fen,
    solutionIndex: Math.max(0, Math.floor(solutionIndex)),
    lastMove: sanitizeLastMove((value as { lastMove?: unknown }).lastMove),
  };
}

function sanitizeDay(value: unknown): DayProgress {
  if (!value || typeof value !== "object") return emptyProgress();
  const seconds = (value as { seconds?: unknown }).seconds;
  const mistakes = (value as { mistakes?: unknown }).mistakes;
  const completed = (value as { completed?: unknown }).completed;
  return {
    seconds: typeof seconds === "number" && Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0,
    mistakes: typeof mistakes === "number" && Number.isFinite(mistakes) ? Math.max(0, Math.floor(mistakes)) : 0,
    completed: completed === true,
    board: sanitizeBoard((value as { board?: unknown }).board),
  };
}

function sanitizeDays(value: unknown): Record<string, DayProgress> {
  if (!value || typeof value !== "object") return {};
  const days: Record<string, DayProgress> = {};
  for (const [key, day] of Object.entries(value as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    days[key] = sanitizeDay(day);
  }
  return days;
}

export function loadSession(): GambitSession {
  if (typeof window === "undefined") return emptySession();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySession();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return emptySession();

    const record = parsed as Record<string, unknown>;
    if (record.version === STORAGE_VERSION && record.days && typeof record.days === "object") {
      return {
        version: STORAGE_VERSION,
        lastSelectedKey: typeof record.lastSelectedKey === "string" ? record.lastSelectedKey : null,
        days: sanitizeDays(record.days),
      };
    }

    return {
      version: STORAGE_VERSION,
      lastSelectedKey: null,
      days: sanitizeDays(parsed),
    };
  } catch {
    return emptySession();
  }
}

export function saveSession(session: GambitSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        lastSelectedKey: session.lastSelectedKey,
        days: session.days,
      } satisfies GambitSession),
    );
  } catch {
    // Private mode or quota — keep the in-memory session either way.
  }
}

export function loadProgress(): Record<string, DayProgress> {
  return loadSession().days;
}

export function saveProgress(progress: Record<string, DayProgress>): void {
  const current = loadSession();
  saveSession({ ...current, days: progress });
}

export function shiftDateKey(key: string, deltaDays: number): string {
  const next = parseDateKey(key);
  next.setDate(next.getDate() + deltaDays);
  return toDateKey(next);
}

/** Newest unlocked date that still has an unsolved puzzle, skipping `exceptKey`. */
export function mostRecentUnsolvedKey(
  progress: Record<string, DayProgress>,
  todayKey: string,
  exceptKey?: string | null,
): string | null {
  const start = archiveStartDate();
  const cursor = parseDateKey(todayKey);
  while (startOfDay(cursor).getTime() >= start.getTime()) {
    const key = toDateKey(cursor);
    if (key !== exceptKey && getPuzzleForDate(cursor) && !progress[key]?.completed) {
      return key;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return null;
}

export function monthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = first.getDay();
  const cells: Array<number | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function verifyArchive(): string[] {
  const errors: string[] = [];
  for (const record of LICHESS_PUZZLES) {
    try {
      const resolved = resolvePuzzle(record);
      if (resolved.solution.length === 0) {
        errors.push(`${record.id}: empty solution`);
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return errors;
}
