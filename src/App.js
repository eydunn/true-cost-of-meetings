import "./MeetingCostCalculator.css";

import React, { useState, useEffect } from "react";

function MeetingCostCalculator() {
  const [participants, setParticipants] = useState([]);
  const [cost, setCost] = useState(0);
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);

  function toggleForm() {
    setIsFormVisible(!isFormVisible);
  }
  function addParticipant(e) {
    e.preventDefault();
    const category = e.target.elements.category.value;
    const number = e.target.elements.number.value;
    const hourlyRate = e.target.elements.hourlyRate.value;
    const newParticipant = { category, number, hourlyRate };
    setParticipants([...participants, newParticipant]);
  }

  function startMeeting() {
    setRunning(true);
    setIsFormVisible(false);
    const id = setInterval(() => {
      setDuration((duration) => duration + 1);
    }, 1000);
    setIntervalId(id);
  }

  function stopMeeting() {
    setRunning(false);
    clearInterval(intervalId);
  }

  function resetMeeting() {
    setCost(0);
    setDuration(0);
    setIsFormVisible(true);
  }

  function removeParticipant(index) {
    setParticipants(participants.filter((_, i) => i !== index));
  }

  function formatDuration(duration) {
    let date = new Date(duration * 1000);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    let time = "";
    if (hours > 0) {
      time += `${hours} hour${hours > 1 ? "s" : ""}, `;
    }
    if (minutes > 0) {
      time += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
    }
    if (seconds > 0) {
      time += `${seconds} second${seconds > 1 ? "s" : ""}`;
    }
    return time;
  }

  useEffect(() => {
    let cost = 0;
    participants.forEach((participant) => {
      cost += participant.hourlyRate * participant.number * (duration / 3600);
    });
    setCost(cost);
  }, [duration, running, participants]);

  return (
    <div className="bg">
      <div className="meeting-cost-calculator">
        <h1>True Cost of Meetings</h1>
        <h2 className="running-time">
          {formatDuration(duration)}
        </h2>
        <div className={`form-container ${isFormVisible ? "" : "hidden"}`}>
          <form className="form" onSubmit={addParticipant}>
            <label>
              Category:
              <input type="text" name="category" />
            </label>
            <label>
              Number:
              <input type="number" name="number" />
            </label>
            <label>
              Hourly Rate:
              <input type="number" name="hourlyRate" />
            </label>
            <button className="add-participant-button" type="submit">
              Add Category
            </button>
          </form>
        </div>
        <ul className="participant-list">
          {participants.map((participant, index) => (
            <li className="participant-item" key={index}>
              <span>{participant.category}</span>
              <span>
                {participant.hourlyRate} *{" "}
                <span className="number-of-participants">
                  {participant.number}
                </span>{" "}
                ={" "}
                {(
                  participant.hourlyRate *
                  participant.number *
                  (duration / 3600)
                ).toFixed(2)}{" "}
                <button
                className={`form-container ${isFormVisible ? "remove-participant-button" : "hidden remove-participant-button"}`}
                  onClick={() => removeParticipant(index)}
                >
                  x
                </button>
              </span>
            </li>
          ))}
        </ul>
        <h2 className="grand-total">Grand Total: {cost.toFixed(2)}</h2>
        <div className="meeting-controls">
          {running ? (
            <button className="stop-meeting-button" onClick={stopMeeting}>
              Stop Meeting
            </button>
          ) : (
            <button className="start-meeting-button" onClick={startMeeting}>
              Start Meeting
            </button>
          )}
          <button className="reset-meeting-button" onClick={resetMeeting}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default MeetingCostCalculator;
