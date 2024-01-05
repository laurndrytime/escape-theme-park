import React from "react";
import SemiCircleProgressBar from "react-progressbar-semicircle";

interface RangeBarProps {
  value: number;
}
const RangeBar = ({ value }: RangeBarProps) => {
  let roundedValue = value;

  if (-5 <= roundedValue && roundedValue <= 5) {
    roundedValue = 50;
  } else if (roundedValue < 0) {
    roundedValue = 50 - Math.abs(roundedValue);
  } else {
    roundedValue = roundedValue + 50;
  }
  return (
    <div className="container flex flex-col w-1/2 h-600 justify-center items-center relative text-gray-300">
      <p>value: {value}</p>
      <p>roundedValue: {roundedValue}</p>
      {}
      <SemiCircleProgressBar
        percentage={roundedValue}
        background={"#D85050"}
        orientation={"down"}
        diameter={250}
      />
    </div>
  );
};

export default RangeBar;
