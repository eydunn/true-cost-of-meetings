import "./AdvancedMeetingCostCalculator.css";

import React, { useState, useEffect } from "react";

function AdvancedMeetingCostCalculator({isFormVisible, setIsFormVisible}) {
  let initParticipants = []; 
  const storedParticipantsString = localStorage.getItem("participants");
  if(storedParticipantsString){
    initParticipants = JSON.parse(storedParticipantsString);
    initParticipants.forEach((participant) => {
      participant.chargePerStarted = participant.chargePerStarted || 1;
    });
  }
  const [participants, setParticipants] = useState(initParticipants);
  const [cost, setCost] = useState(0);
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  function addParticipant(e) {
    e.preventDefault();
    const category = e.target.elements.category.value;
    const number = e.target.elements.number.value;
    const hourlyRate = e.target.elements.hourlyRate.value;
    const chargePerStarted = e.target.elements.chargePerStarted.value;
    const newParticipant = { category, number, hourlyRate, chargePerStarted };
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
    if (hours > 0 || minutes > 0) {
      time += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
    }
//    if (hours > 0 || minutes > 0 || seconds > 0) {
      time += `${seconds} second${seconds > 1 ? "s" : ""}`;
//    }
    return time;
  }

  useEffect(() => {
    const storedParticipantsString = localStorage.getItem("participants");
    if(storedParticipantsString){
      setParticipants(JSON.parse(storedParticipantsString));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("participants", JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    let cost = 0;
    participants.forEach((participant) => {
      cost += participant.hourlyRate * participant.number * ( (Math.ceil(duration / participant.chargePerStarted) * participant.chargePerStarted) / 3600 );
    });
    setCost(cost);
  }, [duration, running, participants]);

  useEffect(() => {
    let remainingTime = 3601;
    participants.forEach((participant) => {
        let nextCostUpdate = Math.ceil(duration / participant.chargePerStarted) * participant.chargePerStarted;
        remainingTime = Math.min(remainingTime, nextCostUpdate - duration);
    });
    setRemainingTime(remainingTime);
  }, [duration, participants]);


  return (
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
            <label>
              Charge per started: 
              <select name="chargePerStarted">
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
                <option value="600">10 minutes</option>
                <option value="900">15 minutes</option>
                <option value="1800">30 minutes</option>
                <option value="3600">60 minutes</option>
              </select>
            </label>
            <button className="add-participant-button" type="submit">
              Add Category
            </button>
          </form>
        </div>
        <ul className="participant-list">
          {participants.map((participant, index) => (
            <li className="participant-item" key={index}>
              <span>{participant.category}{" "}
                {running ? 
                  "(" + formatDuration((Math.ceil(duration / participant.chargePerStarted) * participant.chargePerStarted) - duration) + ")"
                : participant.chargePerStarted === 1 ? "(charged per started second)" :
                  "(charged per started " + Math.ceil(participant.chargePerStarted / 60) + " minute" + (Math.ceil(participant.chargePerStarted/60) > 1 ? "s" : "") + ")"
                }
              </span>
              
              <span>
                {participant.hourlyRate} *{" "}
                <span className="number-of-participants">
                  {participant.number}
                </span>{" "}
                ={" "}
                {(
                  participant.hourlyRate *
                  participant.number *
                  ( (Math.ceil(duration / participant.chargePerStarted) * participant.chargePerStarted) / 3600 )
                ).toFixed(2)}{" "}
                <button
                className={`form-container remove-participant-button ${isFormVisible ? "" : "hidden"}`}
                  onClick={() => removeParticipant(index)}
                >
                  x
                </button>
              </span>
            </li>
          ))}
        </ul>
        <h2 className="grand-total">Grand Total: {cost.toFixed(2)}</h2>
        <h3 className="countdown">Next update in {formatDuration(remainingTime)}</h3>
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
          <button className="reset-meeting-button" disabled={running} onClick={resetMeeting}>
            Reset
          </button>
        </div>
      </div>
  );
}

export default AdvancedMeetingCostCalculator;
