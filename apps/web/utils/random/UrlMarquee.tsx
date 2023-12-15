"use client";

import { useCallback, useEffect, useState } from "react";

export function UrlMarquee({
  text,
  interval = 1000,
  loop = false,
  onLoopEnd,
  onInterval,
}: {
  text: string;
  interval?: number;
  loop?: boolean;
  onLoopEnd?: (loopEnd: boolean, loops: number) => void;
  onInterval?: (currentText: string) => void;
}) {
  const [urlText, setUrlText] = useState<string>("");
  const [loops, setLoops] = useState<number>(0);
  const updateText = useCallback(() => {
    if (text.length === 0) {
      return;
    }
    const remainingText = text.replace(urlText, "");
    if (urlText.length !== text.length) {
      setUrlText((urlText) => urlText + remainingText[0]);
      if (onLoopEnd && urlText.length === 0) {
        setLoops((loops) => loops + 1);
        onLoopEnd(false, loops);
      }
    } else {
      if (loop) {
        setUrlText("");
      }
      if (onLoopEnd) {
        onLoopEnd(true, loops);
      }
    }
    if (onInterval) {
      onInterval(
        urlText + (remainingText[0] !== undefined ? remainingText[0] : ""),
      );
    }
  }, [urlText, text, loop, onInterval, onLoopEnd]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateText();
    }, interval);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [urlText, interval, updateText]);

  useEffect(() => {
    window.history.pushState({}, "", `${urlText}`);
  }, [urlText]);

  return null;
}
