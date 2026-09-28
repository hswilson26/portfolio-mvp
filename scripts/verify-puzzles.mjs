import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const { Chess } = require("chess.js");

const src = fs.readFileSync(path.resolve("src/data/lichess-puzzles.ts"), "utf8");
const start = src.indexOf("export const LICHESS_PUZZLES");
const bracket = src.indexOf("[", start);
const end = src.lastIndexOf("];");
const puzzles = eval(src.slice(bracket, end + 1));

function playPgn(pgn) {
  const chess = new Chess();
  const tokens = pgn.trim().split(/\s+/).filter((t) => t && !/^\d+\.+$/.test(t));
  for (const san of tokens) {
    const played = chess.move(san);
    if (!played) throw new Error(`Illegal SAN "${san}"`);
  }
  return chess;
}

function uciParts(uci) {
  return { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] };
}

const errors = [];

for (const record of puzzles) {
  try {
    const fromPgn = playPgn(record.pgn);
    if (record.fen) {
      const presented = record.fen.split(" ").slice(0, 2).join(" ");
      const derived = fromPgn.fen().split(" ").slice(0, 2).join(" ");
      if (presented !== derived) {
        throw new Error(`FEN mismatch API=${presented} PGN=${derived}`);
      }
    }
    const board = new Chess(record.fen ?? fromPgn.fen());
    for (const uci of record.solution) {
      const played = board.move(uciParts(uci));
      if (!played) throw new Error(`Illegal solution ${uci} at ${board.fen()}`);
    }
    const mateish = record.themes.some((t) => t.startsWith("mate"));
    if (mateish && !board.isCheckmate()) {
      throw new Error(`Expected checkmate after solution, got ${board.fen()}`);
    }
    console.log(`OK  ${record.id.padEnd(6)}  ${String(record.themes[0]).padEnd(16)}  ${record.rating}`);
  } catch (error) {
    errors.push(`${record.id}: ${error.message}`);
    console.error(`FAIL ${record.id}: ${error.message}`);
  }
}

if (errors.length) {
  console.error(`\n${errors.length} puzzle(s) failed`);
  process.exit(1);
}

console.log(`\nVerified ${puzzles.length} Lichess puzzles`);
