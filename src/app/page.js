"use client";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import usePlayerStore from "@/store/playerStore";
import { Search, MoreVertical, Play } from "lucide-react"; // Lark Icons
import BottomPlayer from "@/components/BottomPlayer";

export default function Home() {
  const [query, setQuery] = useState("trending");
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { playSong, setPlaylist, currentSong } = usePlayerStore();
  const { ref, inView } = useInView();

  const fetchSongs = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const res = await fetch(`https://saavn.sumit.co/api/search/songs?query=${query}&page=${currentPage}&limit=20`);
      const data = await res.json();
      if (data.success && data.data.results) {
        const newSongs = data.data.results;
        if (reset) {
          setSongs(newSongs);
          setPlaylist(newSongs);
          setPage(2);
        } else {
          setSongs(prev => [...prev, ...newSongs]);
          setPlaylist(prev => [...prev, ...newSongs]);
          setPage(prev => prev + 1);
        }
      }
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSongs(true);
  };

  useEffect(() => { if (inView) fetchSongs(); }, [inView]);
  useEffect(() => { fetchSongs(true); }, []);

  return (
    <div className="min-h-screen font-sans">
      
      {/* 🟢 HEADER (Lark Style) */}
      <div className="sticky top-0 z-50 px-4 py-4 bg-[#0f0f1a]/50 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
           {/* Lark Logo / Title */}
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <Play fill="white" size={14} />
             </div>
             <h1 className="text-xl font-bold text-white tracking-wide">Lark Player</h1>
           </div>
           <MoreVertical className="text-white" />
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search music..."
            className="w-full bg-white/10 text-white rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-gray-400"
          />
        </form>
      </div>

      {/* 🎵 SONG LIST (Lark Style Rows) */}
      <div className="px-4 pb-4 flex flex-col gap-3">
        {songs.map((song, index) => {
           const img = song.image[1]?.url || song.image[0]?.url; // Chhota Image
           const isCurrent = currentSong?.id === song.id;

           return (
            <div 
              key={song.id} 
              onClick={() => playSong(song, index)}
              // Glass Effect Row
              className={`flex items-center gap-4 p-2 rounded-xl active:bg-white/10 transition cursor-pointer ${isCurrent ? "bg-white/10 border border-blue-500/30" : "bg-transparent"}`}
            >
              {/* Thumbnail (Rounded Square) */}
              <div className="relative w-14 h-14 flex-shrink-0">
                <img 
                  src={img} 
                  alt={song.name} 
                  className="w-full h-full object-cover rounded-lg shadow-md" 
                />
                {/* Playing Indicator */}
                {isCurrent && (
                   <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                     <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                   </div>
                )}
              </div>
              
              {/* Text Info */}
              <div className="flex-1 min-w-0 border-b border-white/5 pb-2">
                <h3 className={`font-medium text-[15px] truncate ${isCurrent ? 'text-blue-400' : 'text-white'}`}>
                  {song.name}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-1">
                  {song.artists.primary[0]?.name}
                </p>
              </div>

              {/* Action Dot */}
              <MoreVertical size={16} className="text-gray-500" />
            </div>
           );
        })}
      </div>

      {/* Loading Spinner */}
      <div ref={ref} className="h-20 flex justify-center items-center">
        {loading && <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
      </div>

      {/* Fixed Player */}
      <BottomPlayer />
    </div>
  );
}
