import React, { useEffect, useState } from "react";
import { FaKey, FaVolumeUp, FaVolumeMute, FaArrowLeft } from "react-icons/fa";
import "./DesertAdventureGame.css";

// 5x5 grid logic, similar to GameLevel but adapted
const GRID_SIZE = 7;
const INITIAL_DOTS = 4;
const GUESS_DOTS = 3;
const GUESS_TIME = 20;
const NEXT_LEVEL_DELAY = 8;
import levels from "../data/levels.json";
import { useNavigate } from "react-router-dom";

const DesertAdventureGame = () => {
  const navigate = useNavigate();
  const [gamePhase, setGamePhase] = React.useState("start");
  const [currentGameLevel, setCurrentGameLevel] = React.useState(() => {
    const savedLevel = localStorage.getItem('currentGameLevel');
    const level = savedLevel ? parseInt(savedLevel, 10) : 0;
    return level < levels.length ? level : 0;
  });
  const [sequence, setSequence] = React.useState([]);
  const [revealedDots, setRevealedDots] = React.useState([]);
  const [userGuesses, setUserGuesses] = React.useState([]);
  const [wrongGuess, setWrongGuess] = React.useState(null);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(GUESS_TIME);
  const [countdown, setCountdown] = React.useState(NEXT_LEVEL_DELAY);
  const [hint, setHint] = React.useState(null);
  const [showHint, setShowHint] = React.useState(false);
  const [hintCountdown, setHintCountdown] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const timerRef = React.useRef();
  const countdownRef = React.useRef();
  const hintCountdownRef = React.useRef();

  const winAudioRef = React.useRef();
  const loseAudioRef = React.useRef();
  const hintAudioRef = React.useRef();
  const clickAudioRef = React.useRef();
  const gameplayAudioRef = React.useRef();

  const playSound = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.log("Audio play failed:", error));
    }
  };

  const startGame = (levelIndex) => {
    clearInterval(countdownRef.current);
    const levelData = levels[levelIndex];
    setSequence(levelData.sequence);
    setCurrentGameLevel(levelIndex);
    setGamePhase("showing");
    setRevealedDots([]);
    setUserGuesses([]);
    setWrongGuess(null);
    setCurrentStep(0);
    setTimeLeft(GUESS_TIME);
  };

  React.useEffect(() => {
    if (gameplayAudioRef.current) {
      gameplayAudioRef.current.loop = true;
      gameplayAudioRef.current.volume = 0.2;
      gameplayAudioRef.current.play().catch(e => console.log("gameplay audio failed", e));
    }
    startGame(currentGameLevel);
    return () => {
      if (gameplayAudioRef.current) {
        gameplayAudioRef.current.pause();
      }
    }
    // eslint-disable-next-line
  }, [currentGameLevel]);

  React.useEffect(() => {
    if (gameplayAudioRef.current) {
      gameplayAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  React.useEffect(() => {
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
    // eslint-disable-next-line
  }, [gamePhase]);

  React.useEffect(() => {
    if (gamePhase === "showing") {
      if (currentStep < INITIAL_DOTS) {
        const showTimer = setTimeout(() => {
          setRevealedDots((prev) => [...prev, sequence[currentStep] - 1]);
          setCurrentStep((prev) => prev + 1);
        }, 700);
        return () => clearTimeout(showTimer);
      } else {
        setTimeout(() => {
          setGamePhase("readyToGuess");
          setCurrentStep(0);
        }, 700);
      }
    }
    // eslint-disable-next-line
  }, [gamePhase, currentStep, sequence]);

  React.useEffect(() => {
    if (gamePhase === "guessing" && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGamePhase("timeOver");
            playSound(loseAudioRef);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [gamePhase, isPaused]);

  const handleTileClick = (index) => {
    if (gamePhase !== "guessing") return;
    const correctGuess = sequence[INITIAL_DOTS + currentStep] - 1;
    if (index === correctGuess) {
      playSound(clickAudioRef);
      const newGuesses = [...userGuesses, index];
      setUserGuesses(newGuesses);
      setRevealedDots([...revealedDots, index]);
      setCurrentStep(currentStep + 1);
      setTimeLeft(GUESS_TIME);
      if (newGuesses.length === GUESS_DOTS) {
        if (currentGameLevel === levels.length - 1) {
          setGamePhase("gameCompleted");
          playSound(winAudioRef);
          localStorage.setItem('currentGameLevel', 0); // Reset for next playthrough
        } else {
          setGamePhase("won");
          playSound(winAudioRef);
          const nextLevel = currentGameLevel + 1;
          localStorage.setItem('currentGameLevel', nextLevel);
        }
      }
    } else {
      setWrongGuess(index);
      setGamePhase("gameOver");
      playSound(loseAudioRef);
      setTimeout(() => setWrongGuess(null), 1000);
    }
  };

  const handleLevelChange = (direction) => {
    let nextLevel = currentGameLevel + direction;
    if (nextLevel < 0) nextLevel = 0;
    if (nextLevel >= levels.length) nextLevel = 0;
    setCurrentGameLevel(nextLevel);
  };

  const handleHintClick = () => {
    if (hintCountdown > 0) return;
    setIsPaused(true);
    setHintCountdown(7);
    hintCountdownRef.current = setInterval(() => {
      setHintCountdown(prev => {
        if (prev <= 1) {
          clearInterval(hintCountdownRef.current);
          setHint(levels[currentGameLevel].hint);
          setShowHint(true);
          playSound(hintAudioRef);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCloseHint = () => {
    setShowHint(false);
    setIsPaused(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const renderGrid = () => {
    const tiles = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const isRevealed = revealedDots.includes(i);
      const isUserGuess = userGuesses.includes(i);
      let tileClass = "desert-adv-cell";
      if (isRevealed) tileClass += " desert-adv-blue";
      if (wrongGuess === i) tileClass += " desert-adv-dark";
      tiles.push(
        <div
          key={i}
          className={tileClass}
          onClick={() => handleTileClick(i)}
        >
          {(isRevealed || isUserGuess) && <div className="desert-adv-dot" />}
        </div>
      );
    }
    return (
      <div className="desert-adv-board">
        {[...Array(GRID_SIZE)].map((_, rIdx) => (
          <div className="desert-adv-row" key={rIdx}>
            {tiles.slice(rIdx * GRID_SIZE, (rIdx + 1) * GRID_SIZE)}
          </div>
        ))}
      </div>
    );
  };

  // Render popup for all phases with detailed info
  const renderPopup = () => {
    if (gamePhase === 'readyToGuess') {
      return (
        <div className="desert-adv-popup-overlay">
          <div className="desert-adv-popup">
            <h2>Ready?</h2>
            <p>Memorize the dots, then click below to start guessing!</p>
            <button onClick={() => setGamePhase('guessing')}>Start Game</button>
          </div>
        </div>
      );
    }
    if (gamePhase === 'gameOver') {
      return (
        <div className="desert-adv-popup-overlay">
          <div className="desert-adv-popup">
            <h2>Game Over</h2>
            <p>You selected an incorrect tile. Try again!</p>
            <button onClick={() => startGame(currentGameLevel)}>Retry</button>
          </div>
        </div>
      );
    }
    if (gamePhase === 'timeOver') {
      return (
        <div className="desert-adv-popup-overlay">
          <div className="desert-adv-popup">
            <h2>Time Over</h2>
            <p>You ran out of time. Try again!</p>
            <button onClick={() => startGame(currentGameLevel)}>Retry</button>
          </div>
        </div>
      );
    }
    if (gamePhase === 'won') {
      return (
        <div className="desert-adv-popup-overlay">
          <div className="desert-adv-popup">
            <h2>Level Complete!</h2>
            <p>Congratulations! You completed this level.<br/>Next level in {countdown}s</p>
            <button onClick={() => handleLevelChange(1)}>Next Level</button>
          </div>
        </div>
      );
    }
    if (gamePhase === 'gameCompleted') {
      return (
        <div className="desert-adv-popup-overlay">
          <div className="desert-adv-popup">
            <h2>Congratulations!</h2>
            <p>You've completed all 20 levels of Desert Adventure!</p>
            <button onClick={() => startGame(0)}>Play Again</button>
          </div>
        </div>
      );
    }
    if (showHint) {
      return (
        <div className="desert-adv-popup-overlay">
          <div className="desert-adv-popup">
            <h2>Hint</h2>
            <p>{hint}</p>
            <button onClick={handleCloseHint}>Close</button>
          </div>
        </div>
      );
    }
    return null;
  };

  const progress = (timeLeft / GUESS_TIME) * 100;

  return (
    <div className="desert-adv-container">
      <div className="desert-adv-header">
        <button className="desert-adv-back" onClick={() => navigate("/")}><FaArrowLeft /></button>
        <div className="desert-adv-level">Level {levels[currentGameLevel].level}</div>
        <button className="desert-adv-gear" onClick={toggleMute}>{isMuted ? <FaVolumeMute style={{ color: 'red' }} /> : <FaVolumeUp />}</button>
      </div>
      <div className="desert-adv-progress-row">
        <div className="desert-adv-progress-bar">
          <div className="desert-adv-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="desert-adv-timer">00:{String(timeLeft).padStart(2, "0")}</div>
      </div>
      <div className="desert-adv-info-row">
        <div className="desert-adv-key"><FaKey /> <span>1</span></div>
        <div className="desert-adv-score">Score: 0</div>
      </div>
      {renderPopup()}
      <div className="desert-adv-board">
        {renderGrid()}
      </div>
      <button className="desert-adv-hint" onClick={handleHintClick}>
        {hintCountdown > 0 ? `Hint in ${hintCountdown}s` : "Hint"}
      </button>
      <audio ref={winAudioRef} src="/won.mp3" preload="auto" />
      <audio ref={loseAudioRef} src="/losegame.mp3" preload="auto" />
      <audio ref={hintAudioRef} src="/hint.mp3" preload="auto" />
      <audio ref={clickAudioRef} src="/martixclick.mp3" preload="auto" />
      <audio ref={gameplayAudioRef} src="/gameplay.mp3" preload="auto" />
    </div>
  );
};

export default DesertAdventureGame;
