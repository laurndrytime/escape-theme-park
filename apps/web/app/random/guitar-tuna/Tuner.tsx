import { AbsoluteString } from "next/dist/lib/metadata/types/metadata-types";
import React from "react";
import RangeBar from "./RangeBar";

// note object
interface TunerProps {
  noteName: string;
  octave: string;
  freq: number;
  cents: number;
}

const Tuner = ({
  noteName = "",
  octave = "",
  freq = 0,
  cents = 0,
}: TunerProps) => {
  return (
    <div className="container flex flex-col w-1/2 h-600 justify-center items-center relative text-gray-300">
      <div className="result-container flex flex-col w-200 h-200 rounded-full bg-gray-800 justify-center items-center shadow-lg ${tuned ? `text-green-500` : `text-gray-300`}">
        {/* ${tuned ? `text-green-500` : `text-gray-300`} */}
        <div className="note-name text-5xl font-semibold uppercase">
          noteName: {noteName}
          <div className="octave text-base font-normal uppercase">
            octave: {octave}
          </div>
        </div>
        <div className="cents text-4xl font-semibold uppercase"></div>
        <div className="freq mt-5 text-base font-normal ">
          freq: {Math.round(freq)}Hz
        </div>
      </div>
      <RangeBar value={cents} />
      <div>{`Tuner Note: ${noteName}`}</div>
    </div>
  );
};

export default Tuner;
