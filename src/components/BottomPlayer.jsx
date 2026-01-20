"use client";
import { useEffect, useRef } from "react";
import usePlayerStore from "@/store/playerStore";
import { Play, Pause, SkipForward, Download } from "lucide-react"; // Icons

export default function BottomPlayer() {
  const { currentSong, isPlaying, togglePlay, playNext } = usePlayerStore();
  const audioRef = useRef(null);

  const audioLink = currentSong?.downloadUrl?.[currentSong.downloadUrl.length - 1]?.url;
  const imageLink = currentSong?.image?.[2]?.url || currentSong?.image?.[0]?.url;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(e => console.log(e));
      else audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100]">
      {/* 🎵 Player Bar (Lark Style Dark Blue) */}
      <div className="bg-[#18162e] border-t border-white/5 p-2 pb-3">
        
        <audio ref={audioRef} src={audioLink} onEnded={playNext} autoPlay />
        
        {/* Progress Bar (Top Line) */}
        <div className="w-full h-[2px] bg-gray-700 mb-2 relative">
             <div className="absolute top-0 left-0 h-full bg-blue-500 w-1/3 animate-pulse"></div>
        </div>

        <div className="flex items-center justify-between px-2">
           
           {/* Left: Image & Text */}
           <div className="flex items-center gap-3 flex-1 overflow-hidden">
             {/* Spinning Disc Effect */}
             <div className={`w-10 h-10 rounded-full overflow-hidden border border-white/10 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                <img src={imageLink} className="w-full h-full object-cover" />
             </div>
             
             <div className="flex flex-col min-w-0">
               <h4 className="text-white font-semibold text-sm truncate">{currentSong.name}</h4>
               <p className="text-gray-400 text-xs truncate">{currentSong.artists.primary[0]?.name}</p>
             </div>
           </div>

           {/* Right: Controls */}
           <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:scale-110 transition">
                {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
              </button>
              
              <button onClick={playNext} className="text-gray-300 hover:text-white">
                <SkipForward size={24} fill="currentColor" />
              </button>
           </div>

        </div>
      </div>
    </div>
  );
}
