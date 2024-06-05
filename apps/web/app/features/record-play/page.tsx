"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  useRecorder,
  usePlayer,
  MicEnabled,
  RecordingState,
} from "@escape-theme-park/web/utils/features/record-play";
export default function Page() {
  const [pageState, setPageState] = useState<0 | 1>(0);
  const { start, stop, audio, duration, state, microphoneEnabled, clear } =
    useRecorder();

  useEffect(() => {
    if (audio !== null) {
      setPageState(1);
    }
  }, [audio]);

  return (
    <div id="appBody">
      {pageState === 0 ? (
        <AudioRecorder
          microphoneEnabled={microphoneEnabled}
          state={state}
          start={start}
          stop={stop}
          duration={duration}
        />
      ) : (
        <AudioPlayer
          clearRecording={clear}
          setPageState={setPageState}
          audio={audio}
        />
      )}
    </div>
  );
}

function AudioRecorder({
  microphoneEnabled,
  duration,
  start,
  state,
  stop,
}: {
  microphoneEnabled: MicEnabled;
  duration: number;
  start: () => void;
  state: RecordingState;
  stop: () => void;
}) {
  return (
    <div>
      <p>
        Note that there is a few seconds lag in audio when starting a recording
      </p>
      <p>
        {microphoneEnabled
          ? "Your microphone is enabled"
          : "You have disabled your microphone"}
      </p>
      <p>Recording duration (in seconds): {Math.round(duration)}</p>
      <button onClick={state === "inactive" ? start : stop}>
        {state === "inactive" ? "Record" : "Stop"}
      </button>
      {state === "recording" && <p>Recording...</p>}
    </div>
  );
}

function AudioPlayer({
  audio,
  setPageState,
  clearRecording,
}: {
  audio: string | Blob | null;
  setPageState: Dispatch<SetStateAction<0 | 1>>;
  clearRecording: () => void;
}) {
  const { forward, rewind, play, pause, isPlaying, currentTime, duration } =
    usePlayer(audio, "my-special-player", { initialLoaded: true });
  return (
    <div>
      <div id="controls" className="flex gap-4">
        <button onClick={forward}>Forward</button>
        <button onClick={isPlaying ? pause : play}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={rewind}>Rewind</button>
        <button
          onClick={() => {
            clearRecording();
            setPageState(0);
          }}
        >
          Restart
        </button>
      </div>
      <div id="info">
        <p>Current time: {currentTime}</p>
        <p>Duration: {duration}</p>
      </div>
    </div>
  );
}
