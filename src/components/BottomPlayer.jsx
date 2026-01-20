"use client";
import { useEffect, useRef } from "react";
import usePlayerStore from "@/store/playerStore";
import { Play, Pause, SkipBack, SkipForward, Download, Volume2 } from "lucide-react";

export default function BottomPlayer() {
  const { currentSong, isPlaying, togglePlay, playNext, playPrev, volume, setVolume } = usePlayerStore();
  const audioRef = useRef(null);

  const getAudioUrl = (song) => song?.downloadUrl?.[song.downloadUrl.length - 1]?.url;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(e => console.log(e));
      else audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      {/* Glass Player Container */}
      <div className="glass rounded-2xl p-3 flex items-center justify-between shadow-2xl max-w-5xl mx-auto">
        <audio ref={audioRef} src={getAudioUrl(currentSong)} onEnded={playNext} autoPlay />

        {/* 1. Song Info */}
        <div className="flex items-center gap-3 w-[35%] overflow-hidden">
          <img 
            src={currentSong.image[2]?.url} 
            alt="art" 
            className={`w-12 h-12 rounded-full border-2 border-white/20 object-cover ${isPlaying ? "animate-spin-slow" : ""}`} 
          />
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-white truncate">{currentSong.name}</h4>
            <p className="text-xs text-gray-300 truncate">{currentSong.artists.primary[0]?.name}</p>
          </div>
        </div>

        {/* 2. Controls */}
        <div className="flex items-center gap-4">
          <button onClick={playPrev} className="text-gray-300 hover:text-white"><SkipBack size={20} /></button>
          
          <button onClick={togglePlay} className="glass-btn p-3 rounded-full text-white bg-green-500/20">
            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-0.5"/>}
          </button>
          
          <button onClick={playNext} className="text-gray-300 hover:text-white"><SkipForward size={20} /></button>
        </div>

        {/* 3. Actions */}
        <div className="flex items-center justify-end gap-3 w-[30%]">
          <a href={getAudioUrl(currentSong)} download target="_blank" className="text-gray-300 hover:text-green-400">
            <Download size={20} />
          </a>
          <div className="hidden sm:flex items-center gap-2">
             <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e)=>setVolume(parseFloat(e.target.value))} className="w-16 h-1 bg-gray-600 rounded-lg accent-green-400 cursor-pointer"/>
          </div>
        </div>
      </div>
    </div>
  );
}
