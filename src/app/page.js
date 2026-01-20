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
      // Note: Teri API URL
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
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-fixed pb-32">
      {/* Overlay to darken background */}
      <div className="fixed inset-0 bg-black/90 z-0"></div>

      <div className="relative z-10">
        
        {/* 🔥 HEADER & LOGO */}
        <div className="sticky top-0 z-40 glass border-b-0 border-b-white/5 p-4 mb-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                <Music size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                KaluSong
              </h1>
            </div>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search songs..."
                className="w-full glass bg-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 transition"
              />
            </form>
          </div>
        </div>

        {/* 🎵 SONG GRID */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {songs.map((song, index) => (
            <div 
              key={song.id} 
              onClick={() => playSong(song, index)}
              className={`group relative glass rounded-xl p-3 cursor-pointer hover:bg-white/10 transition duration-300 ${currentSong?.id === song.id ? "border-green-500/50" : ""}`}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-3 shadow-lg">
                <img 
                  src={song.image[2]?.url} 
                  alt={song.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                  <div className="bg-green-500 rounded-full p-3 shadow-xl transform scale-50 group-hover:scale-100 transition">
                    <Play fill="white" size={20} />
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-sm truncate text-white/90">{song.name}</h3>
              <p className="text-xs text-gray-400 truncate">{song.artists.primary[0]?.name}</p>
            </div>
          ))}
        </div>

        {/* Loading Spinner */}
        <div ref={ref} className="h-20 flex justify-center items-center">
          {loading && <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>}
        </div>
      </div>

      {/* 🎹 PLAYER */}
      <BottomPlayer />
    </div>
  );
}
