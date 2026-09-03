import { useState } from "react";
import axios from "axios";

type Props = {
  setMessages: (messages: any[]) => void;
};

function Title({ setMessages }: Props) {
  const [isResetting, setIsResetting] = useState(false);

  const resetConversation = async () => {
    setIsResetting(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

    try {
      const res = await axios.get(`${apiUrl}/reset`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-lg flex items-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-sm shadow-emerald-500/50">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                John
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI Interviewer
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80"></span>
              Groq Whisper &bull; Llama 3 &bull; ElevenLabs
            </p>
          </div>
        </div>

        <button
          onClick={resetConversation}
          disabled={isResetting}
          id="btn-reset-conversation"
          title="Reset conversation memory"
          className="group relative flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className={`w-4 h-4 text-cyan-400 transition-transform duration-500 ${
              isResetting
                ? "animate-spin text-pink-400"
                : "group-hover:rotate-180"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <span className="hidden sm:inline">
            {isResetting ? "Resetting..." : "Reset Chat"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Title;
