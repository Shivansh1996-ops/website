import type { MusicTrack } from "@/lib/born/types";

export function ListenButtons({ track }: { track: MusicTrack }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={track.spotifySearchUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-[#1DB954]/50 bg-[#1DB954]/10 px-3 py-1.5 text-xs font-medium text-[#7dffa8] transition hover:bg-[#1DB954]/20"
      >
        Listen on Spotify
      </a>
      <a
        href={track.youtubeSearchUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
      >
        Watch on YouTube
      </a>
    </div>
  );
}
