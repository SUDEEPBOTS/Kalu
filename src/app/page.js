"use client";
import { useState } from "react";
import usePlayerStore from "@/store/playerStore";
import BottomPlayer from "@/components/BottomPlayer";
import { Home, Search, Library, PlusSquare, Heart, User, LogOut } from "lucide-react"; // Icons

export default function Page() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playSong, currentSong } = usePlayerStore();

  const handleSearch = async (e) => {
    if(e.key !== "Enter" || !query) return;
    
    setLoading(true);
    setSongs([]); // Clear previous to show skeleton

    try {
      // Direct API call (Your API)
      const res = await fetch(`https://saavn.sumit.co/api/search/songs?query=${query}&limit=10`);
      const data = await res.json();
      if (data.success) setSongs(data.data.results);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden pb-[90px]">
      
      {/* 🟢 SIDEBAR (Hidden on Mobile) */}
      <div className="hidden md:flex w-[240px] flex-col gap-6 p-6 bg-black">
        <div className="text-2xl font-bold flex items-center gap-2">
            <span className="text-green-500 text-3xl">♪</span> VibeFlow
        </div>
        <nav className="flex flex-col gap-4 font-bold text-[#b3b3b3]">
            <div className="flex items-center gap-4 hover:text-white cursor-pointer text-white"><Home size={24}/> Home</div>
            <div className="flex items-center gap-4 hover:text-white cursor-pointer"><Search size={24}/> Search</div>
            <div className="flex items-center gap-4 hover:text-white cursor-pointer"><Library size={24}/> Your Library</div>
            <br/>
            <div className="flex items-center gap-4 hover:text-white cursor-pointer"><PlusSquare size={24}/> Create Playlist</div>
            <div className="flex items-center gap-4 hover:text-white cursor-pointer"><Heart size={24}/> Liked Songs</div>
        </nav>
      </div>

      {/* 🟢 MAIN CONTENT */}
      <div className="flex-1 bg-gradient-to-b from-[#1f1f1f] to-[#121212] m-2 rounded-lg overflow-y-auto relative">
        
        {/* Top Bar */}
        <div className="sticky top-0 bg-[#101010]/90 backdrop-blur-md p-4 flex justify-between items-center z-10">
            <div className="bg-white rounded-full px-4 py-2 flex items-center w-[300px]">
                <Search className="text-black mr-2" size={20} />
                <input 
                    className="bg-transparent border-none outline-none text-black w-full"
                    placeholder="Search songs..."
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
            <div className="flex items-center gap-3 bg-black/40 p-1 pr-3 rounded-full cursor-pointer hover:bg-black/60">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-black">U</div>
                <span className="font-bold text-sm">User</span>
            </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Results</h2>

            {/* 🔥 SKELETON LOADER (Shows when loading) */}
            {loading && Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center p-2 mb-2">
                    <div className="w-12 h-12 skeleton rounded mr-4"></div>
                    <div className="flex-1">
                        <div className="h-4 w-[60%] skeleton mb-2 rounded"></div>
                        <div className="h-3 w-[40%] skeleton rounded"></div>
                    </div>
                </div>
            ))}

            {/* SONG LIST */}
            <div className="flex flex-col gap-2">
                {songs.map((song, idx) => (
                    <div 
                        key={song.id}
                        onClick={() => playSong(song, idx)}
                        className={`flex items-center p-2 rounded-md hover:bg-white/10 transition cursor-pointer group ${currentSong?.id === song.id ? 'bg-white/10' : ''}`}
                    >
                        <img src={song.image[1]?.url} className="w-12 h-12 rounded mr-4 object-cover" />
                        <div className="flex-1">
                            <h4 className={`font-bold ${currentSong?.id === song.id ? 'text-green-500' : 'text-white'}`}>{song.name}</h4>
                            <p className="text-sm text-[#b3b3b3]">{song.artists.primary[0]?.name}</p>
                        </div>
                        <span className="hidden group-hover:block text-green-500 mr-4">▶</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <BottomPlayer />
    </div>
  );
}
