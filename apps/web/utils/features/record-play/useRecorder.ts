import { useState, useRef, useCallback, useEffect } from "react";
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

export type RecordingState = MediaRecorder["state"];

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
