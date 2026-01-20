"use client";
import { useEffect, useRef, useState } from "react";
import usePlayerStore from "@/store/playerStore";
import { Play, Pause, SkipForward, Download } from "lucide-react";

export default function BottomPlayer() {
  const { currentSong, isPlaying, togglePlay, playNext } = usePlayerStore();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const audioLink = currentSong?.downloadUrl?.[currentSong.downloadUrl.length - 1]?.url;
  const imageLink = currentSong?.image?.[2]?.url || currentSong?.image?.[0]?.url;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(e => console.log(e));
      else audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // Update Progress Bar
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#121212] border-t border-white/5 pb-2">
      <audio 
        ref={audioRef} 
        src={audioLink} 
        onEnded={playNext} 
        onTimeUpdate={handleTimeUpdate}
        autoPlay 
      />
      
      {/* Progress Line */}
      <div className="w-full h-[2px] bg-gray-700 relative mb-2">
         <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex items-center justify-between px-3">
         
         {/* Song Info */}
         <div className="flex items-center gap-3 flex-1 overflow-hidden">
           <img src={imageLink} className={`w-10 h-10 rounded object-cover ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
           <div className="flex flex-col min-w-0">
             <h4 className="text-white font-bold text-sm truncate">{currentSong.name}</h4>
             <p className="text-gray-400 text-xs truncate">{currentSong.artists.primary[0]?.name}</p>
           </div>
         </div>

         {/* Controls */}
         <div className="flex items-center gap-4">
            {/* Download Button */}
            <a href={audioLink} download target="_blank" className="text-gray-400 hover:text-primary">
              <Download size={20} />
            </a>

            <button onClick={togglePlay} className="text-white bg-white/10 p-2 rounded-full">
              {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5"/>}
            </button>
            
            <button onClick={playNext} className="text-gray-300">
              <SkipForward size={24} fill="currentColor" />
            </button>
         </div>

      </div>
    </div>
  );
}
