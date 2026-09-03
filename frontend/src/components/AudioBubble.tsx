import { useState, useRef, useEffect } from "react";

type Props = {
  sender: "me" | "john" | string;
  blobUrl: string;
  index: number;
};

export default function AudioBubble({ sender, blobUrl, index }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isJohn =
    sender.toLowerCase() === "john" || sender.toLowerCase() === "rachel";

  useEffect(() => {
    let isMounted = true;
    let audioCtx: AudioContext | null = null;

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtx = new AudioCtxClass();

      fetch(blobUrl)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => audioCtx!.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          if (
            isMounted &&
            audioBuffer &&
            audioBuffer.duration &&
            !isNaN(audioBuffer.duration)
          ) {
            setDuration(audioBuffer.duration);
          }
        })
        .catch(() => {});
    } catch {}

    return () => {
      isMounted = false;
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close().catch(() => {});
      }
    };
  }, [blobUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        audio.duration !== Infinity &&
        audio.duration > 0
      ) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        audio.duration !== Infinity &&
        audio.duration > 0
      ) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Playback error:", err));
    }
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const waveformPattern = [
    30, 65, 45, 80, 55, 90, 75, 40, 85, 95, 60, 70, 45, 80, 50, 75, 35, 60,
  ];

  return (
    <div
      className={`flex w-full mb-5 ${isJohn ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`relative max-w-md w-full sm:w-[380px] rounded-2xl p-4 transition-all duration-300 backdrop-blur-xl border shadow-xl ${
          isJohn
            ? "bg-slate-900/70 border-slate-800/80 shadow-indigo-950/20 hover:border-slate-700/80"
            : "bg-slate-900/70 border-cyan-500/30 shadow-cyan-950/20 hover:border-cyan-500/50"
        }`}
      >
        <audio ref={audioRef} src={blobUrl} preload="auto" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                isJohn
                  ? "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-indigo-500/30"
                  : "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30"
              }`}
            >
              {isJohn ? "J" : "YOU"}
            </div>
            <div>
              <span
                className={`text-xs font-semibold tracking-wide flex items-center gap-1.5 ${
                  isJohn ? "text-indigo-300" : "text-cyan-300"
                }`}
              >
                {isJohn ? "John" : "You"}
                <span className="text-[10px] text-slate-400 font-normal">
                  #{index + 1}
                </span>
              </span>
            </div>
          </div>

          <span className="text-[11px] font-mono text-slate-300 px-2 py-0.5 rounded-full bg-slate-800/70 border border-slate-700/60">
            {formatTime(currentTime)} /{" "}
            {duration > 0 ? formatTime(duration) : "0:00"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            id={`btn-play-${index}`}
            title={isPlaying ? "Pause audio" : "Play audio"}
            className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 shadow-md active:scale-95 cursor-pointer ${
              isJohn
                ? "bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/30"
                : "bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/30"
            }`}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 ml-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 flex items-center justify-between gap-1 h-9 px-3 rounded-xl bg-slate-950/60 border border-slate-800/60 overflow-hidden">
            {waveformPattern.map((baseHeight, barIdx) => {
              const progress =
                duration > 0 ? (currentTime / duration) * 100 : 0;
              const barProgress = (barIdx / waveformPattern.length) * 100;
              const hasPlayed = barProgress <= progress;

              return (
                <span
                  key={barIdx}
                  style={{
                    height: isPlaying
                      ? `${Math.max(20, baseHeight * (0.5 + Math.random() * 0.5))}%`
                      : `${baseHeight}%`,
                    transition: "height 0.15s ease",
                  }}
                  className={`w-1 rounded-full ${
                    hasPlayed
                      ? isJohn
                        ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                        : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                      : "bg-slate-700/60"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
