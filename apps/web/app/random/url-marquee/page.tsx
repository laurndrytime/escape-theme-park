"use client";

import { useCallback, useState } from "react";
import { UrlMarquee } from "../../../utils/random/UrlMarquee";

export default function Home() {
  const [text, setText] = useState<string>("Hello World");
  const [displayText, setDisplayText] = useState<string>("");
  const [loop, setLoop] = useState<boolean>(true);

  const loopEnd = useCallback((loopEnd: boolean, loops: number) => {
    if (loopEnd) {
      if (loops === 1) {
        setText("I am watching you");
      }
      if (loops === 2) {
        setText("lol");
        setLoop(false);
      }
      if (loops === 3) {
        window.location.assign("/");
      }
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 justify-center p-24">
      <h1>{displayText}</h1>
      <UrlMarquee
        text={text}
        interval={300}
        onInterval={(currentText) => {
          setDisplayText(currentText);
        }}
        loop={loop}
        onLoopEnd={loopEnd}
      />
      {/* <div>
        <p>Enter text here</p>
        <input
          className="text-black"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div> */}
    </main>
  );
}
