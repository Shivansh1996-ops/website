function randomChunk(len = 6): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/** Non-sensitive certificate number — never a database ID. */
export function createCertificateNumber(year = new Date().getFullYear()): string {
  return `BORN-${year}-${randomChunk(6)}`;
}

export function createPublicId(): string {
  return randomChunk(8);
}

export function createCapsuleId(): string {
  return `cap_${randomChunk(10).toLowerCase()}`;
}

export function createPublicToken(): string {
  return randomChunk(12);
}
