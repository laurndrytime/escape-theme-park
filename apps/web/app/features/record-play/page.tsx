"use client";

import {
  useCallback,
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

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
    <div>
      {pageState === 0 ? (
        <div>
          <p>
            {microphoneEnabled
              ? "Your microphone is enabled"
              : "You have disabled your microphone"}
          </p>
          <p>Recording duration (in seconds): {Math.round(duration)}</p>
          <button onClick={start}>
            {state === "inactive" ? "Record" : "Recording..."}
          </button>
          {state === "recording" && <button onClick={stop}>Stop</button>}
        </div>
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
    <div id="appbody">
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
          Close
        </button>
      </div>
      <div id="info">
        <p>Current time: {currentTime}</p>
        <p>Duration: {duration}</p>
      </div>
    </div>
  );
}

export type MicEnabled = boolean | null;
export type AudioFile = Blob | null;

export type Recorder = {
  state: MediaRecorder["state"];
  start: () => void;
  stop: () => void;
  cancel: () => void;
  clear: () => void;
  audio: AudioFile;
  microphoneEnabled: MicEnabled;
  duration: number;
};

export function useRecorder(): Recorder {
  const [state, setState] = useState<MediaRecorder["state"]>("inactive");
  const [audio, setAudio] = useState<AudioFile>(null);
  const [microphoneEnabled, setMicrophoneEnabled] = useState<MicEnabled>(null);
  const [duration, setDuration] = useState<number>(0);
  const [durStart, setDurStart] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioBlobsRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (state === "recording") {
      intervalRef.current;
      intervalRef.current = setInterval(function () {
        setDuration((window.performance.now() - durStart) / 1000);
      }, 100);
    }
    return () => {
      if (!intervalRef.current) {
        return;
      }
      clearInterval(intervalRef.current);
    };
  }, [state, intervalRef.current, durStart]);

  /**
   * Starts the recording, returns a Promise of the microphoneEnabled state
   */
  const start = useCallback(async () => {
    clear();
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      setMicrophoneEnabled(null);
      console.error(
        "mediaDevices API or getUserMedia method is not supported in this browser.",
        "To record audio, use browsers like Chrome and Firefox.",
      );
    } else {
      const userMediaOptions = {
        audio: {
          noiseSuppression: false,
          echoCancellation: true,
        },
      };

      return navigator.mediaDevices
        .getUserMedia(userMediaOptions)
        .then((stream) => {
          streamRef.current = stream;
          setMicrophoneEnabled(true);
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.addEventListener(
            "dataavailable",
            (event) => {
              const _audioBlobs = audioBlobsRef.current;

              _audioBlobs.push(event.data);
              audioBlobsRef.current = _audioBlobs;
            },
          );
          setState("recording");
          setDurStart(window.performance.now());
          mediaRecorderRef.current.start();
        })
        .catch((error) => {
          switch (error.name) {
            case "AbortError": //error from navigator.mediaDevices.getUserMedia
              console.error("An AbortError has occured.");
              break;
            case "NotAllowedError": //error from navigator.mediaDevices.getUserMedia
              setMicrophoneEnabled(false);
              console.error(
                "A NotAllowedError has occured. User might have denied permission.",
              );
              break;
            case "NotFoundError": //error from navigator.mediaDevices.getUserMedia
              setMicrophoneEnabled(false);
              console.error("A NotFoundError has occured.");
              break;
            case "NotReadableError": //error from navigator.mediaDevices.getUserMedia
              console.error("A NotReadableError has occured.");
              break;
            case "SecurityError": //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
              console.error("A SecurityError has occured.");
              break;
            case "TypeError": //error from navigator.mediaDevices.getUserMedia
              console.error("A TypeError has occured.");
              break;
            case "InvalidStateError": //error from the MediaRecorder.start
              console.error("An InvalidStateError has occured.");
              break;
            case "UnknownError": //error from the MediaRecorder.start
              console.error("An UnknownError has occured.");
              break;
            default:
              console.error(
                "An error occured with the error name " + error.name,
              );
          }
        });
    }
  }, []);

  /**
   * Stops the media recorder and stream
   */
  const cancel = useCallback(() => {
    if (mediaRecorderRef.current === null || streamRef.current === null) {
      return;
    }

    // Stops recording and
    mediaRecorderRef.current.stop();
    setState("inactive");

    // Stop all streams
    streamRef.current.getTracks().forEach((track) => track.stop());

    // Reset all the recording properties including the media recorder and stream being captured
    mediaRecorderRef.current = null;
    streamRef.current = null;

    /*No need to remove event listeners attached to mediaRecorder as
        If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
        up by the garbage collector as well as any event handlers/listeners associated with it.
        getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
  }, []);

  /**
   * Stops recording and assign audio file to audio prop
   */
  const stop = useCallback(() => {
    if (mediaRecorderRef.current === null) {
      return;
    }

    let mimeType = mediaRecorderRef.current.mimeType;

    mediaRecorderRef.current.addEventListener("stop", () => {
      //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
      // can be converted to mp3 using 'type': 'audio/mp3'
      let audioBlob = new Blob(audioBlobsRef.current, { type: mimeType });

      setAudio(audioBlob);
    });

    cancel();
  }, []);

  /**
   * Reset recording state, audio file, and duration of recording to default state
   */
  const clear = useCallback(() => {
    audioBlobsRef.current = [];
    setAudio(null);
    setState("inactive");
    setDuration(0);
    setDurStart(0);
  }, []);

  return {
    state,
    start,
    stop,
    cancel,
    clear,
    audio,
    microphoneEnabled,
    duration,
  };
}
export type Player = {
  play: () => void;
  pause: () => void;
  forward: () => void;
  rewind: () => void;
  load: () => void;
  unload: () => void;
  seek: (position: number) => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loaded: boolean;
};

/**
 * Generates an audio element on the dom, exposing control functions
 * @param file - The file to be played. Can be a blob or string (valid url)
 * @param id - Provide a unique id for the player
 * @param options - Configure the hook
 */
export function usePlayer(
  file: Blob | string | null,
  id?: string,
  options: { initialLoaded?: boolean } = { initialLoaded: true },
): Player {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  // load file if initialLoaded is true
  useEffect(() => {
    if (options?.initialLoaded === true) {
      if (file !== null) {
        load();
      }
    }
  }, [file, options?.initialLoaded]);

  // load file if element isn't loaded but play button is clicked
  useEffect(() => {
    if (isPlaying && !loaded) {
      load();
    }
  }, [isPlaying, loaded]);

  // play audio if user clicks play + audio can play + audio element exists + audio is loaded
  useEffect(() => {
    if (canPlay && isPlaying && audioElementRef.current !== null && loaded) {
      audioElementRef.current.play();
    }
  }, [isPlaying, canPlay, loaded]);

  // update current time with each audio tick
  const handleTimeUpdate = useCallback(() => {
    if (!audioElementRef.current) {
      return;
    }
    setCurrentTime(audioElementRef.current.currentTime);
  }, []);

  // make sure audio can play after it's fully loaded
  const handleCanPlay = useCallback(() => {
    if (!audioElementRef.current) {
      return;
    }
    setCanPlay(true);
  }, []);

  // if audio ends, pause the audio
  const handleEnded = useCallback(() => {
    if (!audioElementRef.current) {
      return;
    }
    pause();
  }, []);

  // once duration is updated, set the duration
  const handleDurationChange = useCallback(() => {
    if (!audioElementRef.current) {
      return;
    }

    setDuration(audioElementRef.current.duration);
  }, []);

  /**
   * Play audio
   */
  const play = useCallback(() => {
    // only use state to control playing, as we want to use the canplaythrough event to start playing
    setIsPlaying(true);
  }, []);

  /**
   * Pause audio
   */
  const pause = useCallback(() => {
    if (!audioElementRef.current) {
      return;
    }

    audioElementRef.current.pause();
    setIsPlaying(false);
  }, []);

  /**
   * Rewind audio by 10 seconds
   */
  const rewind = useCallback(() => {
    if (!audioElementRef.current) {
      return;
    }

    const newCurrentTime =
      audioElementRef.current.currentTime - 10 <= 0
        ? 0
        : audioElementRef.current.currentTime - 10;

    audioElementRef.current.currentTime = newCurrentTime;
  }, []);

  /**
   * Forward audio by 10 seconds
   */
  const forward = useCallback(() => {
    if (!audioElementRef.current) {
      return;
    }

    const newCurrentTime =
      audioElementRef.current.currentTime + 10 >= duration
        ? duration
        : audioElementRef.current.currentTime + 10;

    audioElementRef.current.currentTime = newCurrentTime;
  }, [duration]);

  /**
   * Seek audio to the input time (in seconds)
   */
  const seek = useCallback((time: number) => {
    if (!audioElementRef.current) {
      return;
    }

    audioElementRef.current.currentTime = time;
  }, []);

  const getDuration = useCallback(() => {
    if (audioElementRef.current === null) {
      return;
    }
    const audioSrc = audioElementRef.current.src;
    if (audioSrc === null) {
      return;
    }
    const _player = new Audio(audioSrc);

    _player.addEventListener(
      "durationchange",
      () => {
        if (
          _player.duration !== Infinity ||
          _player.duration !== 0 ||
          !isNaN(Number(_player.duration))
        ) {
          var duration = _player.duration;
          _player.remove();

          setDuration(duration);
        }
      },
      false,
    );
    _player.load();
    _player.currentTime = 1e101; //fake big time
    _player.volume = 0;
    _player.play();
  }, []);

  /**
   * Attaches player to the DOM and initialise file reader
   */
  const load = useCallback(() => {
    if (file === null || loaded === true) {
      return;
    }

    // create audio element if not yet exist
    if (audioElementRef.current === null) {
      // use audio if file is string,
      // convert audio file into URL if file is Blob
      const audioSrc =
        typeof file === "string" ? file : URL.createObjectURL(file);

      audioElementRef.current = new Audio(audioSrc);
      const appbody = document.getElementById("appBody");
      if (!appbody) {
        return;
      }

      appbody.appendChild(audioElementRef.current);
      const source = document.createElement("source");
      audioElementRef.current.appendChild(source);
      audioElementRef.current.id = `audio-player${id ? ` ${id}` : ""}`;
      audioElementRef.current.load();
    }

    // activate audio player
    getDuration();
    setLoaded(true);
    audioElementRef.current.addEventListener("pause", pause);
    audioElementRef.current.addEventListener("play", play);
    audioElementRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioElementRef.current.addEventListener("canplaythrough", handleCanPlay);
    audioElementRef.current.addEventListener("ended", handleEnded);
    audioElementRef.current.addEventListener(
      "durationchange",
      handleDurationChange,
    );
  }, [loaded, file]);

  /**
   * Resets the player and remove it from the DOM
   */
  const unload = useCallback(() => {
    pause();
    setDuration(0);
    setCurrentTime(0);
    setCanPlay(false);
    setIsPlaying(false);
    if (audioElementRef.current !== null) {
      audioElementRef.current?.removeEventListener("pause", pause);
      audioElementRef.current?.removeEventListener("play", play);
      audioElementRef.current?.removeEventListener(
        "timeupdate",
        handleTimeUpdate,
      );
      audioElementRef.current?.removeEventListener(
        "canplaythrough",
        handleCanPlay,
      );
      audioElementRef.current?.removeEventListener("ended", handleEnded);
      audioElementRef.current?.removeEventListener(
        "durationchange",
        handleDurationChange,
      );
      audioElementRef.current.remove();
    }

    audioElementRef.current = null;

    setLoaded(() => false);
  }, []);

  return {
    play,
    pause,
    rewind,
    forward,
    seek,
    load,
    isPlaying: isPlaying && canPlay, // isPlaying for user's perspective is when audio actually plays
    currentTime,
    duration,
    unload,
    loaded,
  };
}
