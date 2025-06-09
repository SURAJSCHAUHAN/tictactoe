"use client";

import { useEffect, useState, use } from "react";
import { db } from "@/utils/db";
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from "firebase/firestore";

const emptyBoard = Array(9).fill(null);
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function GamePage({ params }) {
  const { gameId } = use(params);
  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [mySymbol, setMySymbol] = useState("");
  const [winner, setWinner] = useState("");

  useEffect(() => {
    if (!gameId) return;
    joinGame(gameId);
  }, [gameId]);

  const joinGame = async (id) => {
    const gameRef = doc(db, "games", id);
    const snap = await getDoc(gameRef);

    if (!snap.exists()) {
      await setDoc(gameRef, {
        board: emptyBoard,
        currentPlayer: "X",
        players: ["X"],
        winner: "",
      });
      setMySymbol("X");
    } else {
      const data = snap.data();
      const players = data.players || [];
      let symbol = "O";
      if (!players.includes("O")) {
        players.push("O");
        await updateDoc(gameRef, { players });
      } else if (!players.includes("X")) {
        symbol = "X";
        players.push("X");
        await updateDoc(gameRef, { players });
      } else {
        symbol = players[0];
      }
      setMySymbol(symbol);
    }

    onSnapshot(gameRef, (docSnap) => {
      const data = docSnap.data();
      if (data) {
        setBoard(data.board);
        setCurrentPlayer(data.currentPlayer);
        setWinner(data.winner);
      }
    });
  };

  const checkWinner = (newBoard) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    return newBoard.every((cell) => cell !== null) ? "Draw" : "";
  };

  const handleClick = async (index) => {
    if (board[index] || currentPlayer !== mySymbol || winner) return;
    const newBoard = [...board];
    newBoard[index] = mySymbol;
    const winCheck = checkWinner(newBoard);
    const nextPlayer = mySymbol === "X" ? "O" : "X";

    await updateDoc(doc(db, "games", gameId), {
      board: newBoard,
      currentPlayer: winCheck ? currentPlayer : nextPlayer,
      winner: winCheck || "",
    });
  };

  const restartGame = async () => {
    const gameRef = doc(db, "games", gameId);
    await updateDoc(gameRef, {
      board: emptyBoard,
      currentPlayer: "X",
      winner: "",
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl mb-4">Tic Tac Toe</h1>
      <p className="text-lg mb-2">
        Game ID: <span className="font-mono text-yellow-400">{gameId}</span>
      </p>
      <p className="text-lg mb-2">
        You are: <span className="text-blue-400">{mySymbol}</span>
      </p>
      <p className="text-lg mb-4">
        {!winner && currentPlayer === mySymbol
          ? "Your Turn"
          : !winner
          ? `Waiting for ${currentPlayer}`
          : null}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="w-24 h-24 flex items-center justify-center bg-gray-700 rounded text-2xl cursor-pointer hover:bg-gray-600"
          >
            {cell}
          </div>
        ))}
      </div>

      {winner && (
        <p className="text-xl mt-4">
          {winner === "Draw" ? "It's a Draw!" : `${winner} wins!`}
        </p>
      )}

      {winner && (
        <button
          onClick={restartGame}
          className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Restart Game
        </button>
      )}
    </main>
  );
}
