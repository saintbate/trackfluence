import type { AccountDaily, MediaRow } from "./types";

function seededRandom(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h += h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

export function mockDaily(brandId: string, from: string, to: string): AccountDaily[] {
  const rand = seededRandom(brandId + from + to);
  const start = new Date(from);
  const end = new Date(to || from);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days.map((date) => {
    const base = 1000 + Math.floor(rand() * 500);
    return {
      date,
      impressions: base + Math.floor(rand() * 400),
      reach: base + Math.floor(rand() * 300),
      profile_views: 50 + Math.floor(rand() * 50),
      follower_count: 10000 + Math.floor(rand() * 100),
    };
  });
}

export function mockMedia(brandId: string, from: string, to: string): MediaRow[] {
  const rand = seededRandom(brandId + from + to + "media");
  const rows: MediaRow[] = [];
  for (let i = 0; i < 20; i++) {
    const id = `MOCK_${i}`;
    rows.push({
      media_id: id,
      media_type: i % 2 === 0 ? "IMAGE" : "VIDEO",
      permalink: `https://instagram.com/p/${id}`,
      caption: `Mock post ${i}`,
      posted_at: new Date(Date.now() - i * 86400000).toISOString(),
      impressions: 500 + Math.floor(rand() * 500),
      reach: 400 + Math.floor(rand() * 400),
      engagement: 50 + Math.floor(rand() * 150),
      likes: 30 + Math.floor(rand() * 120),
      comments: 5 + Math.floor(rand() * 20),
      saves: 3 + Math.floor(rand() * 15),
      video_views: i % 2 === 0 ? 0 : 100 + Math.floor(rand() * 200),
      plays: i % 2 === 0 ? 0 : 150 + Math.floor(rand() * 250),
    });
  }
  return rows;
}


