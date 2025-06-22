import React from "react";
import { FaUserCircle, FaStar, FaCheckCircle, FaRegClock, FaChevronDown, FaMedal, FaTrophy, FaCrown, FaUser } from "react-icons/fa";
import "./NeuralNexusChallenge.css";

const progressNodes = [
  { id: 1, completed: true },
  { id: 2, completed: true },
  { id: 3, completed: true },
  { id: 4, completed: true },
  { id: 5, completed: true },
  { id: 6, completed: true },
  { id: 7, current: true },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
  { id: 14 },
  { id: 15 },
  { id: 16 },
  { id: 17 },
  { id: 18 },
  { id: 19 },
  { id: 20 },
];

const leaderboard = [
  { rank: 1, name: "James Donovan", level: 20, stars: 4892, last: "2 hours ago", icon: <FaCrown className="leaderboard-icon gold" /> },
  { rank: 2, name: "Emily Liu", level: 19, stars: 4756, last: "5 hours ago", icon: <FaMedal className="leaderboard-icon silver" /> },
  { rank: 3, name: "Robert Kim", level: 18, stars: 4523, last: "1 day ago", icon: <FaMedal className="leaderboard-icon bronze" /> },
  { rank: 4, name: "Alicia Patel", level: 17, stars: 4201, last: "2 days ago", icon: <FaTrophy className="leaderboard-icon" /> },
  { rank: 42, name: "You", level: 7, stars: 1240, last: "Just now", icon: <FaUser className="leaderboard-icon you" /> },
];

const NeuralNexusChallenge = () => {
  return (
    <div className="nnc-root">
      {/* Header */}
      <header className="nnc-header">
        <div className="nnc-logo">logo</div>
        <nav className="nnc-nav">
          <span>Home</span>
          <span>Levels</span>
          <span>Achievements</span>
          <span>Profile</span>
        </nav>
        <div className="nnc-user-info">
          <FaUserCircle className="nnc-user-avatar" />
          <span className="nnc-user-stars"><FaStar /> 1,240</span>
          <button className="nnc-play-btn">Play Now</button>
        </div>
      </header>

      {/* Title & Path */}
      <main className="nnc-main">
        <section className="nnc-title-path">
          <h1 className="nnc-title">Neural Nexus Challenge</h1>
          <p className="nnc-desc">Train your brain through a journey of increasingly complex puzzles. Complete all 20 levels to master your cognitive abilities.</p>
          <div className="nnc-progress-legend">
            <span><span className="nnc-dot completed"></span>Completed</span>
            <span><span className="nnc-dot current"></span>Current</span>
            <span><span className="nnc-dot locked"></span>Locked</span>
          </div>
          <div className="nnc-path">
            {progressNodes.map((node, idx) => (
              <span
                key={node.id}
                className={`nnc-path-node${node.completed ? " completed" : ""}${node.current ? " current" : ""}`}
              >
                {node.completed && <FaCheckCircle />}
                {node.current && !node.completed && <FaRegClock />}
                {!node.completed && !node.current && <span className="nnc-node-lock" />}
              </span>
            ))}
          </div>
          <div className="nnc-secret">
            <span>Secret to explore</span>
            <FaChevronDown />
          </div>
        </section>

        {/* Challenge Details */}
        <section className="nnc-challenge-details">
          <div className="nnc-challenge-info">
            <h2>Current Challenge: Level 7</h2>
            <div className="nnc-challenge-tags">
              <span className="nnc-tag">Memory</span>
              <span className="nnc-tag">Spatial Recognition</span>
              <span className="nnc-tag">Pattern Recall</span>
            </div>
            <div className="nnc-challenge-meta">
              <span>⏱️ Time Limit: 60 seconds</span>
              <span>🧠 Difficulty: Medium</span>
            </div>
          </div>
          <div className="nnc-challenge-record">
            <div>Best Score:<span>720 points</span></div>
            <div>Best Time:<span>42 seconds</span></div>
            <button className="nnc-start-btn">Start Challenge</button>
          </div>
        </section>

        {/* Progress & Activity */}
        <section className="nnc-progress-activity">
          <div className="nnc-progress-bars">
            <h3>Your Progress</h3>
            <div className="nnc-progress-row">
              <span>Overall Completion</span>
              <div className="nnc-bar"><div className="nnc-bar-fill" style={{ width: "30%" }} /></div>
              <span>30%</span>
            </div>
            <div className="nnc-progress-row">
              <span>Memory Skills</span>
              <div className="nnc-bar"><div className="nnc-bar-fill" style={{ width: "65%" }} /></div>
              <span>65%</span>
            </div>
            <div className="nnc-progress-row">
              <span>Logic Skills</span>
              <div className="nnc-bar"><div className="nnc-bar-fill" style={{ width: "48%" }} /></div>
              <span>48%</span>
            </div>
            <div className="nnc-progress-row">
              <span>Speed Skills</span>
              <div className="nnc-bar"><div className="nnc-bar-fill" style={{ width: "42%" }} /></div>
              <span>42%</span>
            </div>
          </div>
          <div className="nnc-activity">
            <h3>Recent Activity</h3>
            <ul>
              <li><FaCheckCircle className="nnc-activity-icon" /> Completed Level 6: Pattern Recognition <span className="nnc-activity-date">June 19, 2025 · 32 stars earned</span></li>
              <li><FaStar className="nnc-activity-icon" /> Earned achievement: Quick Thinker <span className="nnc-activity-date">June 18, 2025 · 50 stars earned</span></li>
              <li><FaRegClock className="nnc-activity-icon" /> Daily Challenge Completed <span className="nnc-activity-date">June 17, 2025 · 25 stars earned</span></li>
            </ul>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="nnc-leaderboard-section">
          <div className="nnc-leaderboard-header">
            <h3>Leaderboard</h3>
            <div className="nnc-leaderboard-tabs">
              <span className="active">Global</span>
              <span>Friends</span>
            </div>
          </div>
          <table className="nnc-leaderboard">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Level</th>
                <th>Stars</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank} className={entry.name === "You" ? "nnc-leaderboard-you" : ""}>
                  <td>{entry.rank}</td>
                  <td>{entry.icon} {entry.name}</td>
                  <td>{entry.level}</td>
                  <td>{entry.stars}</td>
                  <td>{entry.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* Footer */}
      <footer className="nnc-footer">
        <div className="nnc-footer-logo">logo</div>
        <div className="nnc-footer-desc">Train your brain with scientifically designed puzzles that enhance cognitive abilities.</div>
        <div className="nnc-footer-links">
          <div>
            <span>Game</span>
            <ul>
              <li>Levels</li>
              <li>Challenges</li>
              <li>Leaderboard</li>
              <li>Achievements</li>
            </ul>
          </div>
          <div>
            <span>Account</span>
            <ul>
              <li>Profile</li>
              <li>Settings</li>
              <li>Subscription</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <span>Company</span>
            <ul>
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="nnc-footer-copyright">
          © 2025 Neural Nexus. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default NeuralNexusChallenge;
