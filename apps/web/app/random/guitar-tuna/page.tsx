import React from "react";
import KeyGrid from "./KeyGrid";
import Scale from "./Scale";
import Tuner from "./Tuner";

const page = () => {
  return (
    <div>
      {/* <Scale /> */}
      <Tuner noteName="" octave="" freq={0} />
      <KeyGrid />
    </div>
  );
};

export default page;
