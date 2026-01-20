import { create } from 'zustand';

const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],
  currentIndex: -1,
  volume: 1,

  setPlaylist: (songs) => set({ playlist: songs }),
  
  playSong: (song, index) => set({ 
    currentSong: song, 
    currentIndex: index, 
    isPlaying: true 
  }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (vol) => set({ volume: vol }),

  playNext: () => {
    const { playlist, currentIndex } = get();
    if (currentIndex < playlist.length - 1) {
      set({ 
        currentSong: playlist[currentIndex + 1], 
        currentIndex: currentIndex + 1, 
        isPlaying: true 
      });
    }
  },

  playPrev: () => {
    const { playlist, currentIndex } = get();
    if (currentIndex > 0) {
      set({ 
        currentSong: playlist[currentIndex - 1], 
        currentIndex: currentIndex - 1, 
        isPlaying: true 
      });
    }
  }
}));

export default usePlayerStore;
