"use client";

import React, { useState } from "react";
import KeyButton from "./KeyButton";

const KeyGrid = () => {
  const [key, setKey] = useState<string>("");

  return (
    <div>
      <p>current key: {key}</p>
      <div className="grid grid-row-3 grid-cols-2 p-4">
        <KeyButton value="E" onClick={() => setKey("E")}></KeyButton>
        <KeyButton value="A" onClick={() => setKey("A")}></KeyButton>
        <KeyButton value="D" onClick={() => setKey("D")}></KeyButton>
        <KeyButton value="G" onClick={() => setKey("G")}></KeyButton>
        <KeyButton value="B" onClick={() => setKey("B")}></KeyButton>
        <KeyButton value="E" onClick={() => setKey("E")}></KeyButton>
      </div>
    </div>
  );
};

export default KeyGrid;
