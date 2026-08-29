"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Disc, Play, Pause } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for Nụ Cười 18 20 (Lofi)
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.8;

    audio.addEventListener("canplaythrough", () => {
      setHasLoaded(true);
    });

    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio play blocked by browser autoplay policy:", err);
        });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc Nụ Cười 18 20"}
        className={`group flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
          isPlaying
            ? "bg-[#dfb773]/25 border-[#dfb773]/70 text-[#fef3c7] shadow-[0_0_25px_rgba(223,183,115,0.35)] ring-2 ring-[#dfb773]/40"
            : "bg-[#181c21]/95 border-[#e5d0ac]/25 text-[#eedec2] hover:text-white hover:border-[#dfb773] hover:scale-105"
        }`}
      >
        {/* Vinyl Disc Icon */}
        <div className="relative">
          <div
            className={`w-6 h-6 rounded-full bg-[#1c2228] border border-[#dfb773]/50 flex items-center justify-center text-[#dfb773] shadow-inner ${
              isPlaying ? "animate-spin [animation-duration:3s]" : ""
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
          </div>

          {/* Equalizer Wave Animation while playing */}
          {isPlaying && (
            <div className="absolute -bottom-1 -right-1 flex items-end gap-0.5 h-3 bg-[#111417] px-1 py-0.5 rounded-full border border-[#dfb773]/40">
              <span className="w-0.5 bg-[#dfb773] h-full animate-bounce rounded-full" />
              <span className="w-0.5 bg-[#dfb773] h-2/3 animate-bounce [animation-delay:0.2s] rounded-full" />
              <span className="w-0.5 bg-[#dfb773] h-4/5 animate-bounce [animation-delay:0.4s] rounded-full" />
            </div>
          )}
        </div>

        {/* Track Title & Status */}
        <div className="flex flex-col text-left pr-1">
          <span className="text-[11px] sm:text-xs font-serif-luxury font-bold text-[#fcf8f0] leading-tight">
            Nụ Cười 18 20
          </span>
          <span className="text-[9px] text-[#dfb773] font-medium tracking-wide">
            {isPlaying ? "Đang phát • Lofi" : "Bấm để nghe nhạc"}
          </span>
        </div>

        {/* Play / Pause Toggle Icon */}
        <div className="w-6 h-6 rounded-full bg-[#dfb773]/15 border border-[#dfb773]/30 flex items-center justify-center text-[#dfb773] group-hover:bg-[#dfb773]/30 transition-colors">
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-[#dfb773]" />
          ) : (
            <Play className="w-3 h-3 fill-[#dfb773] translate-x-0.5" />
          )}
        </div>
      </button>
    </div>
  );
}
