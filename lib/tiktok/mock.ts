import type { AccountDaily, VideoRow } from "./types";

function seededRandom(seed: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

export function mockDaily(brandId: string, from: string, to: string): AccountDaily[] {
  const rand = seededRandom(brandId + from + to + "tt");
  const start = new Date(from);
  const end = new Date(to || from);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) days.push(d.toISOString().slice(0, 10));
  return days.map((date) => ({
    date,
    followers: 1000 + Math.floor(rand() * 50),
    views: 2000 + Math.floor(rand() * 800),
    likes: 300 + Math.floor(rand() * 200),
    comments: 50 + Math.floor(rand() * 40),
    shares: 20 + Math.floor(rand() * 30),
  }));
}

export function mockVideos(brandId: string, from: string, to: string): VideoRow[] {
  const rand = seededRandom(brandId + from + to + "ttv");
  const rows: VideoRow[] = [];
  for (let i = 0; i < 15; i++) {
    const id = `TT_${i}`;
    rows.push({
      video_id: id,
      title: `Mock video ${i}`,
      permalink: `https://www.tiktok.com/@mock/video/${id}`,
      posted_at: new Date(Date.now() - i * 86400000).toISOString(),
      views: 1000 + Math.floor(rand() * 2000),
      likes: 100 + Math.floor(rand() * 500),
      comments: 20 + Math.floor(rand() * 100),
      shares: 10 + Math.floor(rand() * 80),
      avg_watch_time_seconds: Math.round(5 + rand() * 30),
      completion_rate: Math.round((20 + rand() * 60) * 100) / 100,
    });
  }
  return rows;
}


