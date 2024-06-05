import { useCallback, useState, useEffect, useRef } from "react";

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
