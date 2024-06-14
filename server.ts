import express, { Express, Request, Response } from "express";
import cors from "cors";
import { checkBoard } from "./src/game";

const app: Express = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

let games = {
  ["tictactoe"]: {
    id: "tictactoe",
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
    winState: { outcome: null, winner: null },
    player1: { token: "X", id: "" },
    player2: { token: "O", id: "" },
    gameOn: true,
  },
  ["tictactoe2"]: {
    id: "tictactoe2",
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
    winState: { outcome: null, winner: null },
    player1: { token: "X", id: "123" },
    player2: { token: "O", id: "" },
    gameOn: true,
  },
  ["tictactoe3"]: {
    id: "tictactoe3",
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
    winState: { outcome: null, winner: null },
    player1: { token: "X", id: "456" },
    player2: { token: "O", id: "" },
    gameOn: true,
  },
};

app.get("/", (req: Request, res: Response) => {
  res.json("erm hello");
});

app.get("/games", (req: Request, res: Response) => {
  res.json({ games: games });
});

// Get a game by ID
app.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const game = games[id];
  if (!game) {
    return res.status(400).send("game not found");
  }
  res.json({ game: game });
});

// Post req to make a move on the current game
app.post("/game/:id/move", (req: Request, res: Response) => {
  const id = req.params.id;
  const game = games[id];

  if (!game) {
    return res.status(400).send("game not found");
  }

  const rowId = req.body.rowId;
  const itemId = req.body.itemId;
  const player = game.currentPlayer;
  //   do logic to update position of current player X or O, do nothing if the spot is already filled
  if (
    games[id].board[itemId][rowId] == "X" ||
    games[id].board[itemId][rowId] == "O"
  ) {
    return;
  }
  games[id].board[itemId][rowId] = player;
  //   game.board logic
  const currentBoardState = checkBoard(game.board);
  game.winState.outcome = currentBoardState.outcome;
  game.winState.winner = currentBoardState.winner;
  if (game.winState.outcome == "win" || game.winState.outcome == "tie") {
    game.gameOn = false;
  }
  game.currentPlayer = player === "X" ? "O" : "X";

  res.json({ game });
});

// restart game
app.post("/game/:id/restart", (req: Request, res: Response) => {
  const id = req.params.id;
  const game = games[id];

  if (!game) {
    return res.status(400).send("game not found");
  }
  //   do logic to update position of current player X or O
  games[id].board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  games[id].winState.outcome = null;
  games[id].winState.winner = null;
  games[id].gameOn = true;

  res.json({ game });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
