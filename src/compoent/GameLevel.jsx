import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./GameLevel.css";
import levels from "../data/levels.json";
import { FaHome, FaRedo, FaArrowRight, FaArrowLeft, FaClock, FaCheckCircle } from 'react-icons/fa';

const GRID_SIZE = 7;
const INITIAL_DOTS = 4;
const GUESS_DOTS = 3;
const GUESS_TIME = 15;
const NEXT_LEVEL_DELAY = 8;

export default function GameLevel() {
  const [gamePhase, setGamePhase] = useState("start"); // 'start', 'showing', 'guessing', 'gameOver', 'won'
  const [currentGameLevel, setCurrentGameLevel] = useState(() => {
    const savedLevel = localStorage.getItem('currentGameLevel');
    return savedLevel !== null ? parseInt(savedLevel, 10) : 0;
  });
  const [sequence, setSequence] = useState([]);
  const [revealedDots, setRevealedDots] = useState([]);
  const [userGuesses, setUserGuesses] = useState([]);
  const [wrongGuess, setWrongGuess] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GUESS_TIME);
  const [countdown, setCountdown] = useState(NEXT_LEVEL_DELAY);

  const timerRef = useRef();
  const countdownRef = useRef();

  const startGame = (levelIndex) => {
    clearInterval(countdownRef.current);
    const levelData = levels[levelIndex];
    // Convert 1-based sequence to 0-based for internal use
    const zeroBasedSequence = levelData.sequence.map(num => num - 1);
    setSequence(zeroBasedSequence);
    setCurrentGameLevel(levelIndex);
    setGamePhase("showing");
    setRevealedDots([]);
    setUserGuesses([]);
    setWrongGuess(null);
    setCurrentStep(0);
    setTimeLeft(GUESS_TIME);
  };

  useEffect(() => {
    localStorage.setItem('currentGameLevel', currentGameLevel);
    startGame(currentGameLevel);
  }, [currentGameLevel]);

  useEffect(() => {
    if (gamePhase === "won") {
      setCountdown(NEXT_LEVEL_DELAY);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            handleLevelChange(1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdownRef.current);
    }
    return () => clearInterval(countdownRef.current);
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === "showing") {
      if (currentStep < INITIAL_DOTS) {
        const showTimer = setTimeout(() => {
          setRevealedDots((prev) => [...prev, sequence[currentStep]]);
          setCurrentStep((prev) => prev + 1);
        }, 700);
        return () => clearTimeout(showTimer);
      } else {
        setTimeout(() => {
          // Do NOT clear revealedDots; keep initial dots visible
          setGamePhase("readyToGuess"); // Wait for user to start
          setCurrentStep(0); // Reset step for guessing phase
        }, 700)
      }
    }
  }, [gamePhase, currentStep, sequence]);

  useEffect(() => {
    if (gamePhase === "guessing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGamePhase("gameOver");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gamePhase]);

  const handleTileClick = (index) => {
    if (gamePhase !== "guessing") return;

    const correctGuess = sequence[INITIAL_DOTS + currentStep];
    if (index === correctGuess) {
      const newGuesses = [...userGuesses, index];
      setUserGuesses(newGuesses);
      setRevealedDots([...revealedDots, index]);
      setCurrentStep(currentStep + 1);
      setTimeLeft(GUESS_TIME); // Reset timer for next guess

      if (newGuesses.length === GUESS_DOTS) {
        setGamePhase("won");
      }
    } else {
      setWrongGuess(index);
      setGamePhase("gameOver");
      setTimeout(() => setWrongGuess(null), 1000);
    }
  };

  const handleLevelChange = (direction) => {
    let nextLevel = currentGameLevel + direction;
    if(nextLevel < 0) nextLevel = 0;
    if(nextLevel >= levels.length) nextLevel = 0; // Or loop to first level
    setCurrentGameLevel(nextLevel);
  }

  const renderGrid = () => {
    const tiles = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const isRevealed = revealedDots.includes(i);
      const isUserGuess = userGuesses.includes(i);
      let tileClass = "gamelevel-tile";
      if(isRevealed) tileClass += " gamelevel-tile-active";
      if(wrongGuess === i) tileClass += " gamelevel-tile-wrong";

      tiles.push(
        <div
          key={i}
          className={tileClass}
          onClick={() => handleTileClick(i)}
        >
          {(isRevealed || isUserGuess) && <div className="gamelevel-dot" />}
        </div>
      );
    }
    return tiles;
  };

  const renderPopup = () => {
    if (gamePhase === 'readyToGuess') {
      return (
        <div className="gamelevel-popup-overlay">
          <div className="gamelevel-popup">
            <h2>Ready?</h2>
            <p>Memorize the dots, then click below to start guessing!</p>
            <div className="popup-controls">
              <button className="gamelevel-btn gamelevel-btn-retry" onClick={() => setGamePhase('guessing')}>
                Start Game
              </button>
            </div>
          </div>
        </div>
      );
    }

    if(gamePhase !== 'gameOver' && gamePhase !== 'won') return null;

    const isGameOver = gamePhase === 'gameOver';
    const title = isGameOver ? "Game Over" : "Level Complete!";
    const message = isGameOver ? (timeLeft <= 0 ? "Time's up!" : "Wrong guess!") : `Next level in ${countdown}s`;

    return (
      <div className="gamelevel-popup-overlay">
        <div className="gamelevel-popup">
          <div className="popup-icon">{isGameOver ? <FaClock/> : <FaCheckCircle/>}</div>
          <h2>{title}</h2>
          <p>{message}</p>
          <div className="popup-controls">
            {isGameOver ? (
              <button className="gamelevel-btn gamelevel-btn-retry" onClick={() => startGame(currentGameLevel)}>
                <FaRedo /> Play Again
              </button>
            ) : (
              <>
                <Link to="/"><button className="gamelevel-btn"><FaHome/> Home</button></Link>
                <button className="gamelevel-btn" onClick={() => handleLevelChange(1)}><FaArrowRight/> Next Level</button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gamelevel-container">
      {renderPopup()}

      <div className="gamelevel-header">
        <div className="gamelevel-level-badge">Level {levels[currentGameLevel].level}</div>
      </div>

      <div className="gamelevel-timer-stars">
        <div className="gamelevel-timer-container">
          <div className="gamelevel-timer-label">Time Left:</div>
          <div className={`gamelevel-timer-value${timeLeft <= 5 ? " gamelevel-timer-red" : ""}`}>
            {`00:${String(timeLeft).padStart(2, "0")}`}
          </div>
        </div>
      </div>

      <div className="gamelevel-grid-container">
        <div className="gamelevel-grid">{renderGrid()}</div>
      </div>

      <div className="gamelevel-controls">
        <button className="gamelevel-btn" onClick={() => handleLevelChange(-1)}><FaArrowLeft/> Prev</button>
        <button className="gamelevel-btn gamelevel-btn-retry" onClick={() => startGame(currentGameLevel)} disabled={gamePhase === 'showing'}>
          <FaRedo /> Retry
        </button>
        <button className="gamelevel-btn" onClick={() => handleLevelChange(1)}><FaArrowRight/> Next</button>
      </div>
    </div>
  );
}
