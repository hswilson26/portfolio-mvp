/**
 * Curated slice of the Lichess public puzzle database (CC0).
 * https://database.lichess.org/#puzzles
 *
 * Each record is a real Lichess puzzle. `pgn` is the game up to and including
 * the opponent's last move. `solution` is UCI, starting with the player's move
 * (Lichess JSON API format). Optional `fen` / `lastMove` come from the API
 * when available and are used as the position to present.
 *
 * Mapped 1:1 to local calendar dates starting 2026-09-01.
 */
export interface LichessPuzzleRecord {
  id: string;
  rating: number;
  plays: number;
  themes: string[];
  pgn: string;
  solution: string[];
  fen?: string;
  lastMove?: string;
}

export const ARCHIVE_START_ISO = "2026-09-01";

export const LICHESS_PUZZLES: LichessPuzzleRecord[] = [
  {
    id: "IRLlk",
    rating: 1329,
    plays: 1292,
    themes: ["operaMate", "mateIn1", "middlegame"],
    fen: "r1b1kb1r/pp3pp1/1np1p2p/8/2B1N2B/2P5/PPP2PPP/R2R2K1 w kq - 1 1",
    lastMove: "d7b6",
    solution: ["d1d8"],
    pgn: "e4 c6 Nf3 d5 Nc3 dxe4 Ng5 Nf6 Bc4 e6 O-O Nd5 Ngxe4 Nxc3 dxc3 Qxd1 Rxd1 Nd7 Bg5 h6 Bh4 Nb6",
  },
  {
    id: "5RhsW",
    rating: 1338,
    plays: 2993,
    themes: ["mateIn2", "middlegame", "fork"],
    solution: ["h5g6", "g7h8", "g6h6"],
    pgn: "e4 c6 Bc4 d5 Bb3 e5 d4 exd4 exd5 Nf6 Qxd4 cxd5 Nc3 Nc6 Qh4 Be7 Bg5 Be6 Nf3 O-O O-O-O h6 Bxh6 gxh6 Qxh6 Ng4 Qh5 Nxf2 Bxd5 Nxd1 Rxd1 Qa5 Ng5 Bf5 Bxf7+ Kg7 Ne6+ Bxe6",
  },
  {
    id: "dQxQk",
    rating: 1391,
    plays: 3386,
    themes: ["mateIn1", "middlegame"],
    solution: ["h4h5"],
    pgn: "e4 e5 Nf3 d6 Bc4 c6 d4 exd4 Qxd4 c5 Bxf7+ Kxf7 Ng5+ Kg6 Qd5 Qf6 h4 h6",
  },
  {
    id: "HctVG",
    rating: 1377,
    plays: 4434,
    themes: ["mateIn2", "middlegame", "sacrifice"],
    solution: ["c1h6", "g7h6", "d7h7"],
    pgn: "e4 g6 d4 Bg7 Nf3 d6 c4 Nd7 Bd3 e5 d5 Ngf6 O-O h6 Nc3 a5 Rb1 O-O a3 Nc5 Bc2 b6 Be3 Kh8 Qc1 Ng8 b4 axb4 axb4 Nd7 c5 bxc5 bxc5 Nxc5 Bxc5 dxc5 Na4 Qd6 Bb3 Ne7 Nxc5 f5 exf5 gxf5 h3 e4 Nh2 Nxd5 Bxd5 Qxd5 Rd1 Qe5 Nd7 Bxd7 Rxd7 c5 Rbb7 Rg8",
  },
  {
    id: "9IP0v",
    rating: 1379,
    plays: 3389,
    themes: ["mateIn1", "middlegame"],
    solution: ["e8f7"],
    pgn: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 Be7 Qf3 Qc7 O-O-O Nbd7 g4 h6 h4 hxg5 hxg5 Rxh1 Qxh1 Ng8 g6 Ndf6 g5 Ng4 gxf7+ Kf8 fxg8=Q+ Kxg8 Qh5 Ne3 g6 Bf6 e5 dxe5 fxe5 Qxe5 Nf5 exf5 Qh7+ Kf8 Qh8+ Ke7 Qd8+ Ke6 Qe8+ Be7",
  },
  {
    id: "92rAk",
    rating: 1334,
    plays: 5951,
    themes: ["mateIn2", "middlegame", "fork", "sacrifice"],
    solution: ["d5e7", "f8e7", "f6g7"],
    pgn: "d4 Nf6 Nc3 d5 Bf4 c6 Nf3 Bf5 h3 e6 g4 Bg6 Ne5 Nbd7 Nxg6 hxg6 Bg2 Qb6 Rb1 c5 Na4 Qa5+ c3 cxd4 b4 Qb5 O-O dxc3 Nxc3 Qc6 Rc1 Bxb4 Ne4 Qa6 Ng5 O-O e4 e5 Bg3 d4 Nf3 Bd6 Re1 Qxa2 Nxd4 Rfd8 Nb5 Bf8 Qf3 a6 Nc3 Qa3 Ra1 Qc5 Rac1 Qe7 h4 Qe6 Bh3 b5 g5 Qxh3 gxf6 gxf6 Nd5 Kg7 Rc7 Rac8 Rxd7 Qxd7 Qxf6+ Kg8 Bxe5 Qg4+ Kh2 Qh5",
  },
  {
    id: "h8c8M",
    rating: 1423,
    plays: 7170,
    themes: ["mateIn1", "master", "middlegame"],
    solution: ["g6f6"],
    pgn: "d4 Nf6 Nc3 e5 dxe5 Ng4 e4 Nxe5 f4 Ng6 Be3 Bb4 Nf3 Bxc3+ bxc3 O-O Bd3 Nc6 O-O d6 h3 Nh4 Rb1 Nxf3+ Qxf3 b6 Rb5 Bb7 Rg5 g6 h4 Qf6 h5 Rae8 Qg3 Qxc3 hxg6 fxg6 e5 Ne7 Bxg6 hxg6 Rxg6+ Kf7",
  },
  {
    id: "M6QcZ",
    rating: 1299,
    plays: 7138,
    themes: ["mateIn2", "middlegame", "sacrifice"],
    solution: ["c4a3", "b1b2", "c8c3"],
    pgn: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Bd3 a6 Be3 e6 Nc3 Be7 f3 b5 Qd2 Qc7 O-O-O Bb7 g4 Nc6 h4 Ne5 h5 Nc4 Bxc4 Qxc4 g5 Nd7 g6 hxg6 hxg6 Rxh1 gxf7+ Kxf7 Rxh1 Rc8 Kb1 Ne5 Rf1 d5 Rg1 b4 Na4 dxe4 Nb6 Qc7 Nxc8 Qxc8 fxe4 Bxe4 Rf1+ Kg8 Bf4 Nc4 Qe2 Bd5 Rg1 Bf6 Nb3 Bxb2 Bc1",
  },
  {
    id: "bBn0c",
    rating: 1330,
    plays: 2519,
    themes: ["mateIn1", "middlegame"],
    solution: ["f5h5"],
    pgn: "Nf3 f5 Nc3 Nf6 d4 d5 Bf4 e6 a3 Bd6 e3 Nh5 Be5 Nc6 Ba6 bxa6 Qe2 Nf6 O-O Bxe5 dxe5 Ne4 Na4 Rb8 c4 Ne7 Nd4 Bd7 f3 Bxa4 fxe4 dxe4 Nxe6 Qd3 Nxg7+ Kf7 Qh5+ Kxg7 Qg5+ Ng6 Qf6+ Kg8 Qe6+ Kg7 Qf6+ Kh6 Rxf5 Qxe3+ Kh1 Rxb2 g4 Rf8",
  },
  {
    id: "8KsFF",
    rating: 1382,
    plays: 3348,
    themes: ["mateIn2", "middlegame", "kingsideAttack"],
    solution: ["h8h1", "g1g2", "f5h3"],
    pgn: "c4 f5 Nc3 Nf6 Nf3 e6 g3 c6 Bg2 d5 O-O Bd6 d3 O-O Re1 e5 Bg5 d4 Nb1 h6 Bxf6 Qxf6 Nbd2 a5 Nf1 Na6 a3 Nc7 Rb1 a4 Qc2 Ne6 e3 c5 exd4 cxd4 N3d2 Nc5 h4 g5 hxg5 hxg5 Nh2 Rf7 Nhf3 Rh7 Rbd1 g4 Nh4 Rxh4 gxh4 Qxh4 Nf1 f4 Re2 Bf5 Ree1 Kg7 f3 Rh8 Qf2 g3 Qd2 Nxd3 Qa5 Nf2 Rxe5 Qh1+ Bxh1",
  },
  {
    id: "Eqd7Q",
    rating: 1479,
    plays: 2484,
    themes: ["mateIn1", "middlegame", "pin"],
    solution: ["g5g2"],
    pgn: "e4 e5 g3 Nc6 Bg2 Nf6 Ne2 Bc5 O-O d6 h3 Be6 c3 d5 d4 Bb6 dxe5 Nxe5 Bg5 Qd7 Bxf6 gxf6 exd5 Bxh3 Nf4 Bg4 Qc2 O-O-O Nd2 Rdg8 Ne4 Qf5 a4 a5 c4 Nf3+ Bxf3 Rg5 Bxg4 Qxg4 Nxg5 Qxg3+ Ng2 Qxg5 c5 Rg8 f3 Bxc5+ Rf2",
  },
  {
    id: "dnDhA",
    rating: 1585,
    plays: 11952,
    themes: ["mateIn2", "anastasiaMate", "endgame"],
    solution: ["g3e2", "g1h2", "f4h4"],
    pgn: "Nf3 e6 d4 Nf6 c4 d5 cxd5 exd5 Nc3 Bd6 Bg5 O-O Qc2 h6 Bh4 c6 e3 Re8 Bd3 Nbd7 O-O Nf8 Rab1 Ne6 b4 Be7 a4 Nc7 b5 Ne4 Bg3 Bd6 Nxe4 dxe4 Bxe4 Bxg3 hxg3 cxb5 axb5 Nd5 Ne5 Nf6 Bf5 Be6 Bxe6 Rxe6 Rfc1 g6 Qc7 Re7 Qxd8+ Rxd8 Ra1 b6 Nc6 Rdd7 Nxe7+ Rxe7 Rc8+ Kg7 Ra8 Nd5 R1xa7 Re6 Rd8 Nc3 Rdd7 Rf6 Rab7 Nxb5 e4 h5 f4 Kg8 e5 Rf5 Rxb6 Nc3 d5 Ne4 Kh2 h4 gxh4 Rxf4 Rbb7 Rxh4+ Kg1 Rf4 d6 Ng3 Rdc7",
  },
  {
    id: "0ARjd",
    rating: 1326,
    plays: 1811,
    themes: ["mateIn1", "pillsburysMate", "discoveredCheck", "kingsideAttack"],
    solution: ["g7f6"],
    pgn: "e4 d6 d4 e5 Nf3 Nd7 Bc4 c6 Nc3 Be7 Be3 Ngf6 h3 O-O Qd2 b5 Bb3 b4 Ne2 Nxe4 Qd3 Nef6 O-O-O e4 Qc4 exf3 gxf3 Bb7 Rhg1 a5 Bh6 d5 Bxg7 dxc4",
  },
  {
    id: "PyTO2",
    rating: 1408,
    plays: 5913,
    themes: ["mateIn2", "endgame", "queenEndgame"],
    solution: ["b4b5", "a6a5", "e3a7"],
    pgn: "f4 c6 Nf3 d5 b3 Nf6 Bb2 Bg4 e3 Bxf3 Qxf3 e6 h4 h5 g3 Nbd7 Bh3 a5 a4 c5 g4 hxg4 Bxg4 Nxg4 Qxg4 Nf6 Qf3 Be7 Nc3 g6 Nb5 Rh5 O-O-O Qb6 Rdg1 O-O-O Rg5 Rh7 d4 Ne4 Rg2 Kb8 h5 Rdh8 dxc5 Bxc5 Bxh8 Bxe3+ Kb2 Rxh8 Re2 Bd4+ Nxd4 Qxd4+ c3 Qf6 Rxe4 dxe4 Qxe4 Rxh5 Rxh5 gxh5 Qh7 Qf5 Qg8+ Ka7 Qg3 Qg4 Qe3+ Ka6 b4 axb4 cxb4 Qg2+ Ka3 h4",
  },
  {
    id: "ZY7pz",
    rating: 1337,
    plays: 5022,
    themes: ["mateIn1", "master", "middlegame"],
    solution: ["a6d3"],
    pgn: "e4 c5 d4 cxd4 Nf3 g6 Qxd4 Nf6 Bb5 Nc6 Bxc6 dxc6 Qxd8+ Kxd8 Nc3 Bg7 Bf4 Nh5 O-O-O+ Ke8 Be5 f6 Bc7 Be6 h3 Rc8 Bh2 Bh6+ Kb1 Nf4 Rhg1 Rd8 Nd4 Bc8 h4 e5 Nb3 Rxd1+ Nxd1 Ke7 g3 Ne6 c3 Rd8 Kc2 b6 Rf1 Ba6 Re1",
  },
  {
    id: "wRvSq",
    rating: 1628,
    plays: 4192,
    themes: ["mateIn2", "endgame", "fork", "deflection"],
    solution: ["c5b6", "b7c8", "b6c6"],
    pgn: "d4 d5 c4 e6 Nc3 a6 cxd5 exd5 Nf3 c6 Bf4 Bd6 Be5 Nf6 e3 Qe7 Bd3 Bg4 Qc2 Bxf3 Bxd6 Qxd6 gxf3 Nbd7 O-O-O O-O-O Kb1 Kb8 e4 Qf4 Rhg1 g6 Qb3 Ka7 Na4 Qxf3 Rg3 Qxf2 Bf1 Nxe4 Rf3 Nd2+ Rxd2 Qxd2 Rxf7 Rhf8 Nc5 b5 Qa3 a5 Nxd7 Rxf7 Qc5+ Kb7",
  },
  {
    id: "njDUY",
    rating: 1465,
    plays: 2017,
    themes: ["mateIn1", "master", "endgame", "queenEndgame"],
    solution: ["g4c8"],
    pgn: "Nc3 d5 e4 dxe4 d4 exd3 Bxd3 Nf6 Nf3 Nc6 Qe2 Bg4 Bg5 Nd4 Qe3 Nxf3+ gxf3 Bh5 O-O-O c6 Bxf6 gxf6 Bf5 Qc7 Bd7+ Qxd7 Rxd7 Kxd7 Rd1+ Ke8 Kb1 e6 Ne4 Be7 Qc3 e5 a3 Bg6 Qc4 Bxe4 fxe4 Rg8 Ka2 Rd8 Rxd8+ Bxd8 Qb4 Bb6 Qd6 Rg2 Qb8+ Ke7 Qxb7+ Kf8 Qxc6 Rxf2 b4 Rxh2 Kb3 Rf2 a4 h5 a5 Bd4 b5 h4 b6 axb6 axb6 Rf3+ Kb4 Bxb6 Qxb6 h3 Qd8+ Kg7 Qd7 Rg3 Qd2 Rg2 Qe3 h2 Qh3 Rxc2 Kb3 Rd2 Kc3 Ra2 Kb3 Rd2 Kb4 Rd4+ Kc5 Rd2 Qg4+ Kf8 Qh3 Ke7 Kc6 Rd6+ Kc7 Rd2 Kc6 Rc2+ Kb5 Rd2 Kc4 f5 exf5 e4 Qh4+ Ke8 Qxe4+ Kf8 Qh4 Rg2 f6 Rg4+ Qxg4 h1=Q",
  },
  {
    id: "xriyV",
    rating: 1353,
    plays: 6336,
    themes: ["mateIn2", "rookEndgame", "endgame"],
    solution: ["f7f8", "b8a7", "f8a8"],
    pgn: "e4 e5 Nf3 Nc6 Bc4 f5 d3 Bc5 Bg5 Nf6 Nc3 fxe4 dxe4 d6 Nd5 Rf8 Bxf6 gxf6 Qd2 Bg4 Qh6 Bxf3 gxf3 Nd4 O-O-O c6 Ne3 Qc7 c3 Nxf3 Qh5+ Kd7 Qxf3 b5 Bb3 Kc8 Nf5 a5 Be6+ Kb7 a3 b4 cxb4 axb4 axb4 Bxb4 Qb3 Qb6 Kc2 Qxf2+ Rd2 Qc5+ Kb1 Kc7 Rxd6 Ra1+ Kxa1 Qa5+ Kb1 Bxd6 Nxd6 Kxd6 Bc4 Ra8 Rd1+ Kc7 Kc2 Qc5 Qc3 Ra4 Bd5 Qxc3+ Kxc3 cxd5 Rxd5 Rxe4 Rc5+ Kd6 Ra5 Rh4 Ra6+ Ke7 b4 Rxh2 b5 Kd7 b6 Kc8 Ra7 Kb8 Rf7 Rh6 Kc4 e4 Kb5 Rh1 Rxf6 e3 Rf8+ Kb7 Rf7+ Kb8 Rf8+ Kb7 Rf7+ Kc8 b7+ Kb8 Kb6 Rb1+ Kc6 e2",
  },
  {
    id: "MxgvS",
    rating: 1325,
    plays: 10704,
    themes: ["mateIn1", "endgame", "queensideAttack"],
    solution: ["b3b2"],
    pgn: "d4 d5 Bf4 Nf6 e3 e6 Nd2 Be7 Ngf3 O-O c3 b6 Bd3 Bb7 Qc2 h6 h4 c5 Ng5 Nbd7 Be5 cxd4 exd4 Ne4 Ndxe4 dxe4 Nxe4 Nxe5 dxe5 Bxe4 Bxe4 Rc8 Bd3 Bxh4 O-O-O Bg5+ Kb1 Qc7 g3 a5 f4 Be7 Rh3 f6 Qb3 Kh8 Qxe6 Rcd8 Qf5 Rxd3 Qxd3 fxe5 f5 Bg5 Rdh1 Rd8 Qe4 b5 Rh5 Qe7 a3 a4 Re1 Bf6 g4 Qf7 Rhh1 Rd2 Rhg1 Qb3 Re2",
  },
  {
    id: "eJFpQ",
    rating: 1366,
    plays: 1264,
    themes: ["mateIn2", "endgame", "promotion", "advancedPawn"],
    solution: ["e7e8q", "d8e8", "e2e8"],
    pgn: "c4 e5 g3 d6 Bg2 Nf6 e3 c6 Ne2 Be6 b3 d5 cxd5 cxd5 O-O Bd6 d4 O-O Bb2 Nc6 h3 Rc8 Nbc3 a6 dxe5 Bxe5 Rb1 b5 a4 b4 Na2 Bxb2 Rxb2 a5 Rd2 Qb6 Nf4 Ne7 Nxe6 fxe6 Kh2 Nf5 Nc1 Nd6 f3 Rc3 e4 Nh5 exd5 Nf5 dxe6 Ne3 Qe2 Nxf1+ Bxf1 Rxc1 e7 Re8 Rd8 Rxd8",
  },
  {
    id: "uPhZt",
    rating: 1434,
    plays: 1239,
    themes: ["mateIn1", "middlegame", "queensideAttack"],
    solution: ["c8c2"],
    pgn: "e4 e5 Nf3 Nc6 Bc4 Bc5 d3 h6 h3 Nd4 a3 Nxf3+ Qxf3 Nf6 Nc3 c6 Bd2 d5 exd5 cxd5 Nxd5 Be6 Nxf6+ gxf6 Qxb7 Rb8 Qc6+ Qd7 Qxc5 Bxc4 Qxc4 Rc8 Qb3 O-O Bxh6 Rfe8 O-O-O Rb8 Qc3 Rec8 Qd2 Qb7 b3 Qxb3 Qe3",
  },
  {
    id: "8K69G",
    rating: 1420,
    plays: 9308,
    themes: ["mateIn2", "endgame"],
    solution: ["d1a1", "c6c3", "a1c3"],
    pgn: "e4 d5 e5 d4 f4 Bf5 d3 e6 Nf3 h6 c3 dxc3 Nxc3 Bb4 a3 Ba5 b4 Bb6 d4 Nc6 Nb5 a6 d5 Nxb4 axb4 axb5 Rxa8 Qxa8 Bxb5+ c6 dxc6 bxc6 Qd6 cxb5 Qxb6 Qe4+ Be3 Qb1+ Kf2 Qc2+ Kg3 Ne7 Rc1 Qd3 Bc5 O-O Bxe7 Re8 Bd6 Be4 Rc7 Bxf3 gxf3 Qg6+ Kh3 Qh5+ Kg3 Qg6+ Kf2 Qh5 Kg2 Qg6+ Kh1 Qh5 Qc6 f6 exf6 gxf6 Rb7 Qg6 Rxb5 Qb1+ Kg2 Qg6+ Kf2 f5 Ke3 Qg1+ Kd3 Qf1+ Kd4 Qd1+ Ke5",
  },
  {
    id: "wYHyd",
    rating: 1419,
    plays: 917,
    themes: ["mateIn1", "master", "middlegame"],
    solution: ["f5e7"],
    pgn: "e4 Nc6 d4 e6 d5 exd5 exd5 Ne5 Nf3 Bd6 Nxe5 Bxe5 f4 Bd6 Be2 Nf6 O-O O-O c4 Bc5+ Kh1 d6 a3 a6 b4 Ba7 Nd2 Bf5 Bb2 c5 dxc6 bxc6 Nb3 Ne4 Nd4 Bd7 Bf3 d5 cxd5 cxd5 Qd3 Bf5 Nxf5 Nf2+ Rxf2 Bxf2 Qxd5 Qb6 Nxg7 Rad8 Nf5 Rxd5",
  },
  {
    id: "a6L4K",
    rating: 1347,
    plays: 888,
    themes: ["mateIn2", "middlegame"],
    solution: ["e7h4", "f2f1", "g7g1"],
    pgn: "e4 e5 Nc3 Nf6 f4 d5 d3 d4 Nce2 Bg4 f5 Nc6 Bg5 Bb4+ Kf2 Qd6 h3 Bxe2 Bxe2 h6 Bc1 g6 a3 Ba5 b4 Bb6 g4 gxf5 gxf5 O-O-O Bd2 Rdg8 b5 Na5 Bb4 Qd7 a4 Rg7 Qd2 Rhg8 Bf3 Nh5 Bxa5 Nf4 Rh2 Qe7 Bxb6",
  },
  {
    id: "ppvOf",
    rating: 1391,
    plays: 2507,
    themes: ["mateIn1", "master", "middlegame"],
    solution: ["h5h1"],
    pgn: "c4 d5 cxd5 Qxd5 Nc3 Qa5 g3 c6 Bg2 Nf6 d3 Bf5 Bd2 Qc7 Nf3 Nbd7 O-O e6 a3 Bd6 Rc1 a6 b4 h5 Na4 h4 Nc5 hxg3 hxg3 Bxg3 fxg3 Qxg3 Qe1 Qg6 Nxd7 Nxd7 Qf2 Nf6 Ne5 Qh5 Bf3 Bg4 Bxg4",
  },
  {
    id: "wGVoB",
    rating: 1532,
    plays: 1144,
    themes: ["mateIn2", "endgame"],
    solution: ["g3f2", "g1h1", "f2f1"],
    pgn: "e4 e5 f4 exf4 Nf3 d5 exd5 Nf6 c4 Bc5 d4 Bb4+ Nc3 O-O Bxf4 Re8+ Be2 c6 dxc6 Nxc6 d5 Ne7 O-O Nf5 Bd3 Bxc3 bxc3 Ne3 Bxe3 Rxe3 Bc2 Qb6 Kh1 Ng4 Qd2 Bd7 h3 Qh6 Rae1 Rae8 Rxe3 Rxe3 Re1 Rxe1+ Qxe1 Nf6 Ne5 Bxh3 gxh3 Qxh3+ Kg1 g6 Nd3 Ng4 Qe2 Ne3 Nf4 Qg3+ Ng2 Ng4 Qe8+ Kg7 Qe4",
  },
  {
    id: "Zzqn2",
    rating: 1487,
    plays: 4604,
    themes: ["mateIn1", "middlegame", "pin"],
    solution: ["c7c8"],
    pgn: "e4 Nf6 Nc3 c6 Bc4 a5 d4 d5 Bd3 g6 e5 Ng8 Nf3 Bg4 h3 Bxf3 Qxf3 e6 h4 Bg7 Bg5 Qb6 O-O Qxd4 Ne2 Qxe5 Bf4 Qf6 g3 e5 Qe3 h6 Rfe1 Ne7 Qb6 Nd7 Qxb7 Rb8 Qc7 exf4 Nxf4 Rc8",
  },
  {
    id: "Gx7Ub",
    rating: 1310,
    plays: 17057,
    themes: ["mateIn1", "pin", "master", "middlegame"],
    fen: "2r1r1k1/5ppp/pp6/2bR2B1/2P5/2R5/P4QPP/6K1 b - - 0 1",
    lastMove: "f1f2",
    solution: ["e8e1"],
    pgn: "e3 Nf6 d4 c5 Nf3 b6 c4 e6 Be2 cxd4 Nxd4 Bb7 Bf3 Qc8 b3 Bb4+ Bd2 Be7 O-O O-O Nc3 Nc6 Rc1 Nxd4 exd4 Rd8 d5 a6 Qe2 Re8 Rfd1 Ba3 Rc2 exd5 Qf1 dxc4 Bxb7 Qxb7 bxc4 Rac8 Bg5 Ne4 Nxe4 Qxe4 Rc3 Bc5 Rxd7 Qf5 Rd5 Qxf2+ Qxf2",
  },
];
