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
  },
};

app.get("/", (req: Request, res: Response) => {
  res.json("erm hello");
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
  //   do logic to update position of current player X or O
  games[id].board[itemId][rowId] = player;
  //   game.board logic
  const currentBoardState = checkBoard(game.board);
  console.log(currentBoardState);
  game.winState.outcome = currentBoardState.outcome;
  game.winState.winner = currentBoardState.winner;
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

  res.json({ game });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
