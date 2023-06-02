import "./App.css";

import React, { useState } from "react";

import ForkMe from './ForkMe/ForkMe';
import MeetingCostCalculator from "./MeetingCostCalculator/MeetingCostCalculator";
import AdvancedMeetingCostCalculator from "./AdvancedMeetingCostCalculator/AdvancedMeetingCostCalculator";

function App() {

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [calculationMode, setCalculationMode] = useState("basic");

  function handleCalculationModeChange(e) {
    setCalculationMode(e.target.value);
  }

  return (
    <div>
      <div className="bg">
        <ForkMe />
        {calculationMode === "basic" ? (
          <MeetingCostCalculator 
            isFormVisible={isFormVisible} 
            setIsFormVisible={setIsFormVisible} 
          />
        ) : (
          <AdvancedMeetingCostCalculator 
            isFormVisible={isFormVisible} 
            setIsFormVisible={setIsFormVisible}
          />
      )}
      </div>
      <div className={`calculation-mode ${isFormVisible ? "" : "hidden"}`}>
        <input
            type="radio"
            id="basic"
            name="calculationMode"
            value="basic"
            checked={calculationMode === "basic"}
            onChange={handleCalculationModeChange}
        />
        <label for="basic">Basic</label>
        <input
            type="radio"
            id="advanced"
            name="calculationMode"
            value="advanced"
            checked={calculationMode === "advanced"}
            onChange={handleCalculationModeChange}
        />
        <label for="advanced">Advanced</label>
      </div>
    </div>
  );
}

export default App;
