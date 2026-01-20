import "./globals.css";

export const metadata = {
  title: "KaluSong",
  description: "Best Music Player by Kaito",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
