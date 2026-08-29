"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, Sparkles } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isSynthesizingRef = useRef(false);

  // Celebratory graduation theme synthesizer using Web Audio API (zero external broken MP3 links)
  const playGraduationTheme = () => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      isSynthesizingRef.current = true;
      setIsPlaying(true);

      // Melody notes for Gaudeamus / Celebration (Pomp and Circumstance style fanfare)
      // Frequencies: C4, D4, E4, F4, G4, A4, B4, C5
      const notes = [
        { freq: 261.63, dur: 0.5 }, // C4
        { freq: 329.63, dur: 0.5 }, // E4
        { freq: 392.0, dur: 0.75 }, // G4
        { freq: 523.25, dur: 1.0 }, // C5
        { freq: 493.88, dur: 0.5 }, // B4
        { freq: 440.0, dur: 0.5 }, // A4
        { freq: 392.0, dur: 1.0 }, // G4
        { freq: 349.23, dur: 0.5 }, // F4
        { freq: 329.63, dur: 0.5 }, // E4
        { freq: 293.66, dur: 0.75 }, // D4
        { freq: 261.63, dur: 1.25 }, // C4
      ];

      let startTime = ctx.currentTime + 0.1;

      const scheduleLoop = () => {
        if (!isSynthesizingRef.current) return;

        notes.forEach((note) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(note.freq, startTime);

          // Soft bell-like envelope
          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur - 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + note.dur);

          startTime += note.dur;
        });

        // Loop after melody finishes
        const totalDuration = notes.reduce((sum, n) => sum + n.dur, 0);
        setTimeout(() => {
          if (isSynthesizingRef.current) {
            startTime = ctx.currentTime + 0.2;
            scheduleLoop();
          }
        }, totalDuration * 1000);
      };

      scheduleLoop();
      setAudioLoaded(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const stopMusic = () => {
    isSynthesizingRef.current = false;
    setIsPlaying(false);
    if (audioContextRef.current && audioContextRef.current.state === "running") {
      audioContextRef.current.suspend();
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      playGraduationTheme();
    }
  };

  useEffect(() => {
    return () => {
      isSynthesizingRef.current = false;
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleMusic}
        aria-label="Toggle background music"
        className={`group flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
          isPlaying
            ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/20 ring-2 ring-amber-500/30"
            : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500"
        }`}
      >
        <div className="relative">
          {isPlaying ? (
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-1 bg-amber-400 h-full animate-bounce rounded-full" />
              <span className="w-1 bg-amber-400 h-2/3 animate-bounce [animation-delay:0.2s] rounded-full" />
              <span className="w-1 bg-amber-400 h-4/5 animate-bounce [animation-delay:0.4s] rounded-full" />
            </div>
          ) : (
            <Music className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
          )}
        </div>

        <span className="text-xs font-medium tracking-wide">
          {isPlaying ? "Nhạc Lễ Tốt Nghiệp" : "Bật Nhạc Nền"}
        </span>

        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-amber-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-400" />
        )}
      </button>
    </div>
  );
}
