import React, { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

const SnakeGame = ({ onExit }: { onExit: () => void }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || 
          newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        setFood({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': setDirection({ x: 1, y: 0 }); break;
        case 'Escape': onExit(); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onExit]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return (
    <div className="text-terminal-text font-mono">
      <div className="mb-2">Score: {score} | Press ESC to exit</div>
      <div className="grid grid-cols-20 gap-0 w-80 h-80 border border-terminal-cursor">
        {Array.from({ length: 400 }).map((_, i) => {
          const x = i % 20;
          const y = Math.floor(i / 20);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          
          return (
            <div
              key={i}
              className={`w-4 h-4 ${
                isSnake ? 'bg-terminal-cursor' : 
                isFood ? 'bg-red-500' : 
                'bg-transparent'
              }`}
            />
          );
        })}
      </div>
      {gameOver && (
        <div className="mt-2 text-red-500">
          Game Over! Final Score: {score}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;