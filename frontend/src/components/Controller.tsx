import { useState, useRef, useEffect } from "react";
import Title from "./Title";
import axios from "axios";
import RecordMessage from "./RecordMessage";
import AudioBubble from "./AudioBubble";

type Message = {
  sender: "me" | "john" | string;
  blobUrl: string;
};

const Controller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLElement | null>(null);

  function createBlobURL(data: ArrayBuffer) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    return window.URL.createObjectURL(blob);
  }

  useEffect(() => {
    if (!errorMessage) return;
    const t = setTimeout(() => setErrorMessage(null), 6000);
    return () => clearTimeout(t);
  }, [errorMessage]);

  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleStop = async (blobUrl: string, blob: Blob) => {
    setErrorMessage(null);
    setIsLoading(true);

    setMessages((prev) => [...prev, { sender: "me", blobUrl }]);

    try {
      const formData = new FormData();
      formData.append("file", blob, "myFile.wav");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const response = await axios.post(`${apiUrl}/post-audio`, formData, {
        responseType: "arraybuffer",
      });

      const audioUrl = createBlobURL(response.data);
      const audio = new Audio(audioUrl);

      setMessages((prev) => [...prev, { sender: "john", blobUrl: audioUrl }]);
      audio.play().catch(() => {});
    } catch (err: any) {
      let detail =
        "Failed to process audio. Check your microphone and try again.";
      if (err.response?.data) {
        try {
          const text = new TextDecoder().decode(err.response.data);
          const parsed = JSON.parse(text);
          if (parsed.detail) detail = parsed.detail;
        } catch {}
      } else if (err.message) {
        detail = err.message;
      }
      setErrorMessage(detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#07090e] text-slate-100 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px]" />

      <Title setMessages={setMessages} />

      {errorMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] px-4 py-3 rounded-2xl bg-rose-950/90 border border-rose-500/60 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-rose-200 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-rose-400 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium leading-snug">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white p-1 rounded-lg hover:bg-rose-900/50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <main
        ref={messagesContainerRef}
        className="relative flex-1 overflow-y-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-48 max-w-4xl w-full mx-auto flex flex-col"
      >
        {messages.length === 0 && !isLoading && (
          <div className="my-auto flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="relative my-4 mb-8 flex items-center justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 animate-pulse blur-md" />
              <div className="absolute w-20 h-20 rounded-full border border-cyan-500/40 animate-pulse-ring" />
              <div className="absolute w-16 h-16 rounded-full bg-slate-900/90 border border-indigo-500/50 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-cyan-400 animate-float"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-2">
              Ready for Your Practice Interview?
            </h2>
            <p className="text-sm text-slate-400 max-w-md mb-8 font-light leading-relaxed">
              I'm John, your AI interviewer. Press and hold the microphone at
              the bottom to answer or ask questions.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-lg">
              {[
                {
                  color: "bg-cyan-400",
                  text: `"Hi John, I'm ready for the interview!"`,
                },
                {
                  color: "bg-indigo-400",
                  text: `"What position are we discussing?"`,
                },
                {
                  color: "bg-purple-400",
                  text: `"How would I handle customer disputes?"`,
                },
              ].map(({ color, text }) => (
                <div
                  key={text}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-sm flex items-center gap-2"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((audio, index) => (
          <AudioBubble
            key={`${index}-${audio.sender}`}
            sender={audio.sender}
            blobUrl={audio.blobUrl}
            index={index}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start w-full my-4">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/70 border border-indigo-500/30 backdrop-blur-xl shadow-lg">
              <div className="w-6 h-6 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-indigo-300">
                  John is thinking...
                </span>
                <span className="text-[11px] text-slate-400 font-light">
                  Transcribing &amp; generating voice response
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 inset-x-0 z-40 p-4 sm:p-6 pointer-events-none flex justify-center">
        <div className="pointer-events-auto max-w-md w-full rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-slate-800/80 shadow-2xl shadow-black/80 px-6 py-4 flex flex-col items-center">
          <RecordMessage handleStop={handleStop} />
        </div>
      </footer>
    </div>
  );
};

export default Controller;
