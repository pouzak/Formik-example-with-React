import React, { useState, useCallback, useRef } from "react";
import "./App.css";
import produce from "immer";
const numRows = 42;
const numCols = 95;
const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1]
];
const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 30);
  }, []);
  // console.log(grid);

  const restart = () => {
    setGrid(() => {
      const rows = [];
      for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0));
      }
      return rows;
    });
  };

  const siaip = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => Math.random() * 10));
    }
    console.log(rows);
  };
  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          runningRef.current = true;
          runSimulation();
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          restart();
        }}
      >
        restart
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
            );
          }
          setGrid(rows);
        }}
      >
        random
      </button>
      <button
        onClick={() => {
          siaip();
        }}
      >
        siaip
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              key={`${i}-${k}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "pink" : undefined,
                border: "solid 1px black"
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
};

export default App;
