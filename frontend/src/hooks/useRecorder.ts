import { useState, useRef, useEffect, useCallback } from "react";

export function useRecorder(onStop: (blobUrl: string, blob: Blob) => void) {
  const [status, setStatus] = useState<"idle" | "recording">("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const onStopRef = useRef(onStop);
  onStopRef.current = onStop;

  // Acquire mic once on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
      })
      .catch((err) => console.error("Mic access denied:", err));

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    if (recorderRef.current?.state === "recording") return;

    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setStatus("idle");
      onStopRef.current(url, blob);
    };

    recorderRef.current = recorder;
    recorder.start();
    setStatus("recording");
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  return { status, startRecording, stopRecording };
}
