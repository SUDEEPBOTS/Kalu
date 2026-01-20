"use client";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import usePlayerStore from "@/store/playerStore";
import { Search, Play, Music } from "lucide-react";
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
    <div className="min-h-screen bg-black text-white pb-32 font-sans">
      {/* Background Image with Blur Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=2574')] bg-cover bg-center opacity-30 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/60"></div>
      </div>

      <div className="relative z-10">
        
        {/* 🔥 HEADER (Mobile Friendly) */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 p-3 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            
            {/* Logo Row */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="p-1.5 bg-green-500 rounded-lg shadow-lg shadow-green-500/30">
                <Music size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                KaluSong
              </h1>
            </div>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search songs, artists..."
                className="w-full bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-green-500 focus:bg-white/20 transition-all placeholder-gray-400"
              />
            </form>
          </div>
        </div>

        {/* 🎵 SONG GRID (Fixed Layout) */}
        <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-7xl mx-auto mt-2">
          {songs.map((song, index) => (
            <div 
              key={song.id} 
              onClick={() => playSong(song, index)}
              className={`group relative bg-white/5 rounded-lg p-2 cursor-pointer hover:bg-white/10 transition active:scale-95 ${currentSong?.id === song.id ? "ring-1 ring-green-500 bg-white/10" : ""}`}
            >
              {/* Image Container */}
              <div className="relative aspect-square rounded-md overflow-hidden mb-2 shadow-md bg-zinc-800">
                <img 
                  src={song.image[2]?.url || song.image[1]?.url} 
                  alt={song.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  loading="lazy"
                />
                
                {/* Play Button Overlay (Visible on Hover) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                  <div className="bg-green-500 rounded-full p-2.5 shadow-xl transform scale-75 group-hover:scale-100 transition">
                    <Play fill="white" size={18} className="ml-0.5" />
                  </div>
                </div>
              </div>
              
              {/* Song Details */}
              <div className="px-1">
                <h3 className={`font-semibold text-xs sm:text-sm truncate leading-tight ${currentSong?.id === song.id ? "text-green-400" : "text-gray-100"}`}>
                  {song.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate mt-0.5">
                  {song.artists.primary[0]?.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Spinner */}
        <div ref={ref} className="h-24 flex justify-center items-center">
          {loading && <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-green-500 border-white/20"></div>}
        </div>
      </div>

      {/* 🎹 PLAYER */}
      <BottomPlayer />
    </div>
  );
                                             }
                    
