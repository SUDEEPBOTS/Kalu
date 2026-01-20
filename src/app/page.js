"use client";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer"; // Infinite Scroll Library
import usePlayerStore from "@/store/playerStore";
import BottomPlayer from "@/components/BottomPlayer";
import { Search, MoreVertical, Play } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("trending");
  const [songs, setSongs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Check if more songs exist
  
  const { playSong, setPlaylist, currentSong } = usePlayerStore();
  
  // Infinite Scroll Trigger
  const { ref, inView } = useInView({ threshold: 0.5 });

  // 🔥 Fetch Function (Infinite Scroll Logic)
  const fetchSongs = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);

    try {
      const currentPage = reset ? 1 : page;
      // Note: Teri API URL
      const res = await fetch(`https://saavn.sumit.co/api/search/songs?query=${query}&page=${currentPage}&limit=20`);
      const data = await res.json();

      if (data.success && data.data.results.length > 0) {
        const newSongs = data.data.results;
        
        if (reset) {
          setSongs(newSongs);
          setPlaylist(newSongs);
          setPage(2);
        } else {
          // Purane gaano mein naye gaane jod do (Append)
          setSongs((prev) => [...prev, ...newSongs]);
          setPlaylist((prev) => [...prev, ...newSongs]);
          setPage((prev) => prev + 1);
        }
      } else {
        setHasMore(false); // Gaane khatam
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Search Handle
  const handleSearch = (e) => {
    e.preventDefault();
    setHasMore(true);
    fetchSongs(true); // Reset list
  };

  // Trigger when scrolling to bottom
  useEffect(() => {
    if (inView) fetchSongs();
  }, [inView]);

  // Initial Load
  useEffect(() => { fetchSongs(true); }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-28 font-sans">
      
      {/* 🟢 HEADER (Fixed) */}
      <div className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Play fill="black" size={14} className="text-black ml-0.5" />
             </div>
             <h1 className="text-xl font-bold tracking-wide">VibeFlow</h1>
           </div>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists..."
            className="w-full bg-[#1f1f1f] text-white rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-500"
          />
        </form>
      </div>

      {/* 🎵 SONG LIST (Lark Style) */}
      <div className="px-2 pt-2 flex flex-col gap-1">
        {songs.map((song, index) => {
           const img = song.image[1]?.url || song.image[0]?.url;
           const isCurrent = currentSong?.id === song.id;

           return (
            <div 
              key={`${song.id}-${index}`} // Unique Key needed for infinite list
              onClick={() => playSong(song, index)}
              className={`flex items-center gap-3 p-2 rounded-lg active:scale-[0.98] transition cursor-pointer ${isCurrent ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              {/* Thumbnail */}
              <div className="relative w-14 h-14 flex-shrink-0">
                <img src={img} alt={song.name} className="w-full h-full object-cover rounded-md" loading="lazy" />
                {isCurrent && (
                   <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                     <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                   </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0 border-b border-white/5 pb-2">
                <h3 className={`font-medium text-[15px] truncate ${isCurrent ? 'text-primary' : 'text-white'}`}>
                  {song.name}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-1">
                  {song.artists.primary[0]?.name}
                </p>
              </div>

              {/* Menu Dot */}
              <MoreVertical size={18} className="text-gray-600" />
            </div>
           );
        })}

        {/* 🟢 LOADING SKELETON (Bottom Trigger) */}
        {hasMore && (
          <div ref={ref} className="flex flex-col gap-2 p-2">
             {[1,2,3].map(i => (
               <div key={i} className="flex items-center gap-3">
                 <div className="w-14 h-14 rounded-md skeleton flex-shrink-0"></div>
                 <div className="flex-1">
                   <div className="h-4 w-3/4 skeleton rounded mb-2"></div>
                   <div className="h-3 w-1/2 skeleton rounded"></div>
                 </div>
               </div>
             ))}
          </div>
        )}
        
        {!hasMore && <div className="text-center text-gray-500 py-4 text-xs">No more songs</div>}
      </div>

      {/* Player Component */}
      <BottomPlayer />
    </div>
  );
}
