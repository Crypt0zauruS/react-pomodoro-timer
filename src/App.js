import "./App.css";

import React, { useState, useEffect } from "react";

const App = () => {
  const [breakCount, setBreakCount] = useState(5);
  const [sessionCount, setSessionCount] = useState(25);
  const [clockCount, setClockCount] = useState(25 * 60);
  const [currentTimer, setCurrentTimer] = useState("Session");
  const [isPlaying, setIsPlaying] = useState(false);
  const audio = document.getElementById("beep");
  let loop = undefined;

  useEffect(() => {
    return () => {
      clearInterval(loop);
    };
  });

  useEffect(() => {
    if (clockCount === 0) {
      audio.play();
    }
    // eslint-disable-next-line
  }, [clockCount]);

  useEffect(() => {
    if (isPlaying) {
      // eslint-disable-next-line
      loop = setInterval(() => {
        if (clockCount === 0) {
          setCurrentTimer(currentTimer === "Session" ? "Break" : "Session");

          setClockCount(
            currentTimer === "Session" ? breakCount * 60 : sessionCount * 60
          );
        } else {
          setClockCount(clockCount - 1);
        }
      }, 1000);
    }
  }, [isPlaying, clockCount, currentTimer, breakCount, sessionCount]);

  const handlePlayPause = () => {
    if (isPlaying) {
      clearInterval(loop);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setBreakCount(5);
    setSessionCount(25);
    setClockCount(25 * 60);
    setCurrentTimer("Session");
    setIsPlaying(false);

    clearInterval(loop);

    audio.pause();
    audio.currentTime = 0;
  };

  const convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
  };

  const handleLengthChange = (count, timerType) => {
    let newCount;

    if (timerType === "session") {
      newCount = sessionCount + count;
    } else {
      newCount = breakCount + count;
    }

    if (newCount > 0 && newCount < 61 && !isPlaying) {
      if (timerType === "session") {
        setSessionCount(newCount);
      } else {
        setBreakCount(newCount);
      }

      if (currentTimer.toLowerCase() === timerType) {
        setClockCount(newCount * 60);
      }
    }
  };

  const breakProps = {
    title: "Break",
    count: breakCount,
    handleDecrease: () => handleLengthChange(-1, "break"),
    handleIncrease: () => handleLengthChange(1, "break"),
  };

  const sessionProps = {
    title: "Session",
    count: sessionCount,
    handleDecrease: () => handleLengthChange(-1, "session"),
    handleIncrease: () => handleLengthChange(1, "session"),
  };

  return (
    <div>
      <h1 id="title">25 + 5 Clock</h1>
      <div className="flex">
        <SetTimer {...breakProps} />
        <SetTimer {...sessionProps} />
      </div>

      <div className="clock-container">
        <h1 id="timer-label">{currentTimer}</h1>
        <span id="time-left">{convertToTime(clockCount)}</span>

        <div className="flex">
          <button id="start_stop" onClick={handlePlayPause}>
            <i className={`fas fa-${isPlaying ? "pause" : "play"}`} />
          </button>
          <button id="reset" onClick={handleReset}>
            <i className="fas fa-sync" />
          </button>
        </div>
      </div>
      <div className="footer">
        &copy; Copyright by Crypt0zauruS
        <h1>
          Follow me on{" "}
          <a
            className="twitter"
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/CryptosaurusRe4"
          >
            <i className="fab fa-twitter"></i>
          </a>{" "}
          and{" "}
          <a
            className="github"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Crypt0zauruS"
          >
            <i className="fab fa-github"></i>
          </a>
        </h1>
      </div>
    </div>
  );
};

const SetTimer = (props) => {
  const id = props.title.toLowerCase();

  return (
    <div className="timer-container">
      <h2 id={`${id}-label`}>{props.title} Length</h2>
      <div className="flex actions-wrapper">
        <button id={`${id}-decrement`} onClick={props.handleDecrease}>
          <i className="fas fa-minus" />
        </button>

        <span id={`${id}-length`}>{props.count}</span>

        <button id={`${id}-increment`} onClick={props.handleIncrease}>
          <i className="fas fa-plus" />
        </button>
      </div>
    </div>
  );
};

export default App;
