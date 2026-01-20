"use client";
import { useEffect, useRef, useState } from "react";
import usePlayerStore from "@/store/playerStore";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function BottomPlayer() {
  const { currentSong, isPlaying, togglePlay, playNext, playPrev } = usePlayerStore();
  const audioRef = useRef(null);
  
  // Local states for UI
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();

    // 🔥 Event Listeners for Buffering & Progress
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onTimeUpdate = () => {
        if(audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
        audio.removeEventListener("waiting", onWaiting);
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [isPlaying, currentSong]);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between z-50">
      <audio ref={audioRef} src={currentSong.downloadUrl?.[4]?.url} onEnded={playNext} />

      {/* 1. Now Playing */}
      <div className="flex items-center gap-4 w-[30%]">
        <img src={currentSong.image[2]?.url} className="w-14 h-14 rounded shadow-lg" />
        <div className="hidden sm:block">
          <h4 className="text-white text-sm font-bold truncate">{currentSong.name}</h4>
          <p className="text-[#b3b3b3] text-xs truncate">{currentSong.artists.primary[0]?.name}</p>
        </div>
      </div>

      {/* 2. Controls */}
      <div className="flex flex-col items-center w-[40%]">
        <div className="flex items-center gap-6 mb-2">
          <button onClick={playPrev} className="text-[#b3b3b3] hover:text-white"><SkipBack size={20}/></button>
          
          <button onClick={togglePlay} className="bg-white rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition">
            {/* 🔥 Buffering Logic: Spinner vs Play Icon */}
            {isBuffering ? (
                <div className="loader-spinner border-t-black"></div>
            ) : isPlaying ? (
                <Pause fill="black" size={16} />
            ) : (
                <Play fill="black" size={16} className="ml-0.5" />
            )}
          </button>

          <button onClick={playNext} className="text-[#b3b3b3] hover:text-white"><SkipForward size={20}/></button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md h-1 bg-[#555] rounded-full overflow-hidden cursor-pointer relative group">
            <div className="h-full bg-white rounded-full group-hover:bg-green-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* 3. Right Side (Volume) */}
      <div className="w-[30%] flex justify-end">
        <Volume2 className="text-[#b3b3b3]" size={20} />
      </div>
    </div>
  );
}
