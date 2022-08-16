import React from "react";
import "./switch.css";

const Switch = ({ isOn, handleToggle, onColor }) => {
  return (
    <div style={{ background: isOn && onColor }} className="react-switch">
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        type="checkbox"
      />
      <div className="react-switch-button" />
      <div className="react-switch-labels">
        <span>PT</span>
        <span>EN</span>
      </div>
    </div>
  );
};

export default Switch;
