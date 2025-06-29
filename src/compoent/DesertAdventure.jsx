import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DesertAdventure.css";
import levels from "../data/levels.json";

const DesertAdventure = () => {
  const [progressLevels, setProgressLevels] = React.useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedLevel = localStorage.getItem('currentGameLevel');
    const currentLevelIndex = savedLevel !== null ? parseInt(savedLevel, 10) : 0;
    const currentLevelNumber = currentLevelIndex + 1;
    const newLevels = levels.map(level => ({
      id: level.level,
      status: level.level < currentLevelNumber
        ? "completed"
        : level.level === currentLevelNumber
        ? "current"
        : "locked",
      stars: 1 // TODO: Replace with real stars if available
    }));
    setProgressLevels(newLevels);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio('/background.mp3');
    audioRef.current.volume = 0.1;
    audioRef.current.loop = true;

    if (!isMuted) {
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay was prevented.');
      });
    }

    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(error => {
          console.log('Audio play was prevented.');
        });
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="desert-adventure-wrapper">
      <div className="desert-adventure-sky">
        <div className="desert-adventure-sun">
          {/* Sun SVG */}
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="47" cy="45" r="24" fill="#FFE066" />
            <g stroke="#FFE066" strokeWidth="3">
              <line x1="40" y1="5" x2="40" y2="20" />
              <line x1="40" y1="60" x2="40" y2="75" />
              <line x1="5" y1="40" x2="20" y2="40" />
              <line x1="60" y1="40" x2="75" y2="40" />
              <line x1="15" y1="15" x2="25" y2="25" />
              <line x1="65" y1="65" x2="55" y2="55" />
              <line x1="65" y1="15" x2="55" y2="25" />
              <line x1="15" y1="65" x2="25" y2="55" />
            </g>
          </svg>
          <div className="desert-adventure-sun-face">😊</div>
        </div>
        <div className="desert-adventure-title">Desert Adventure</div>
        <div className="desert-adventure-settings">
          <button onClick={toggleMute} className="desert-adventure-mute-button">
            {isMuted ? '🔇' : '🔊'}
          </button>
          {/* Settings gear icon (SVG) */}
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="8" fill="#fff" stroke="#bbb" strokeWidth="2" />
            <g stroke="#bbb" strokeWidth="2">
              <line x1="16" y1="2" x2="16" y2="8" />
              <line x1="16" y1="24" x2="16" y2="30" />
              <line x1="2" y1="16" x2="8" y2="16" />
              <line x1="24" y1="16" x2="30" y2="16" />
              <line x1="6" y1="6" x2="10" y2="10" />
              <line x1="22" y1="22" x2="26" y2="26" />
              <line x1="22" y1="10" x2="26" y2="6" />
              <line x1="6" y1="26" x2="10" y2="22" />
            </g>
          </svg>
        </div>
      </div>
      <div className="desert-adventure-map">
        {/* Planks */}
        <div className="desert-adventure-plank desert-adventure-plank1"></div>
        <div className="desert-adventure-plank desert-adventure-plank2"></div>
        <div className="desert-adventure-plank desert-adventure-plank3"></div>
        <div className="desert-adventure-plank desert-adventure-plank4"></div>
        {/* Cacti */}
        <div className="desert-adventure-cactus desert-adventure-cactus1"></div>
        <div className="desert-adventure-cactus desert-adventure-cactus2"></div>
        <div className="desert-adventure-cactus desert-adventure-cactus3"></div>
        <div className="desert-adventure-cactus desert-adventure-cactus4"></div>
        {/* Sand */}
        <div className="desert-adventure-sand"></div>
        {/* Levels */}
        <div className="desert-adventure-levels">
          {progressLevels.map((level, idx) => {
            // For mobile zig-zag: odd idx left, even idx right
            const zigzagClass = idx % 2 === 0 ? 'desert-adventure-level-left' : 'desert-adventure-level-right';
            return (
              <div
                key={level.id}
                className={`desert-adventure-level desert-adventure-level-${level.status} desert-adventure-level-${level.id} ${zigzagClass}`}
                onClick={() => {
                  if (level.status !== "locked") navigate("/newgame");
                }}
                style={{ cursor: level.status !== "locked" ? "pointer" : "not-allowed" }}
              >
                <div className="desert-adventure-level-inner">
                  <span className="desert-adventure-level-number">{level.id}</span>
                  {level.status === "locked" && (
                    <span className="desert-adventure-level-lock">🔒</span>
                  )}
                  {level.status === "current" && (
                    <span className="desert-adventure-level-flag">🚩</span>
                  )}
                  {level.stars > 0 && (
                    <div className="desert-adventure-level-stars">
                      {[...Array(level.stars)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DesertAdventure;
