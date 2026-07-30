const QUOTES = [
  "A new story began here.",
  "The world was already moving. Then you arrived.",
  "One place. One moment. An entire life ahead.",
  "The sky held its pattern. The city kept its rhythm. You began.",
  "History was writing itself. Your page opened quietly.",
  "Around you: a region, a nation, a world. Within you: a beginning.",
  "Not the center of the universe — the start of one life.",
  "Coordinates of arrival. Everything after is yours.",
];

export function pickCertificateQuote(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return QUOTES[h % QUOTES.length];
}
