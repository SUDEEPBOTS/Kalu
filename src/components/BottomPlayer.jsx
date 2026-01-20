@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground: #ffffff;
  --background: #000000;
}

body {
  color: var(--foreground);
  background: var(--background);
  overflow-x: hidden; /* Side scroll rokne ke liye */
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

/* Skeleton Class */
.skeleton {
  background: linear-gradient(90deg, #222 25%, #333 50%, #222 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
