import { ReactMediaRecorder } from "react-media-recorder";
import RecordIcon from "./RecordIcon";

type Props = {
  handleStop: (blobUrl: string, blob: Blob) => void;
};

const RecordMessage = ({ handleStop }: Props) => {
  return (
    <ReactMediaRecorder
      audio
      onStop={handleStop}
      render={({ status, startRecording, stopRecording }) => {
        const isRecording = status === "recording";

        return (
          <div className="flex flex-col items-center justify-center select-none">
            <div className="relative flex items-center justify-center">
              {isRecording && (
                <>
                  <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping"></div>
                  <div className="absolute w-32 h-32 rounded-full border border-rose-500/30 animate-pulse-ring"></div>
                  <div className="absolute w-40 h-40 rounded-full border border-rose-500/10 animate-pulse"></div>
                </>
              )}

              {!isRecording && (
                <div className="absolute w-20 h-20 rounded-full bg-cyan-500/15 blur-xl transition-all duration-500"></div>
              )}

              <button
                id="btn-voice-record"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                title={isRecording ? "Release to send" : "Hold to speak"}
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer select-none ${
                  isRecording
                    ? "bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 shadow-rose-500/50 scale-110"
                    : "bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-slate-950/30 backdrop-blur-sm flex items-center justify-center text-white">
                  <RecordIcon
                    isRecording={isRecording}
                    classText={
                      isRecording
                        ? "text-white animate-pulse"
                        : "text-white"
                    }
                  />
                </div>
              </button>
            </div>

            {isRecording ? (
              <div className="mt-3 flex items-center gap-1.5 h-6">
                <span className="w-1 bg-rose-400 rounded-full animate-[wave-bar_0.8s_ease-in-out_infinite_0.1s]"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[wave-bar_0.8s_ease-in-out_infinite_0.25s]"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[wave-bar_0.8s_ease-in-out_infinite_0.4s]"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[wave-bar_0.8s_ease-in-out_infinite_0.15s]"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[wave-bar_0.8s_ease-in-out_infinite_0.35s]"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[wave-bar_0.8s_ease-in-out_infinite_0.2s]"></span>
              </div>
            ) : null}

            <div className="mt-2.5 flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isRecording ? "bg-rose-500 animate-ping" : "bg-cyan-400/80"
                }`}
              ></span>
              <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-300">
                {isRecording ? (
                  <span className="text-rose-400 font-semibold">
                    Listening... Release to send
                  </span>
                ) : (
                  <span className="text-slate-400">Press &amp; hold to talk</span>
                )}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
};

export default RecordMessage;
