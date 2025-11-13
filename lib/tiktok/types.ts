import { z } from "zod";

export const AccountDailySchema = z.object({
  date: z.string(),
  followers: z.number(),
  views: z.number(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
});
export type AccountDaily = z.infer<typeof AccountDailySchema>;

export const VideoRowSchema = z.object({
  video_id: z.string(),
  title: z.string().optional(),
  permalink: z.string().optional(),
  posted_at: z.string().optional(),
  views: z.number(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
  avg_watch_time_seconds: z.number().optional(),
  completion_rate: z.number().optional(),
});
export type VideoRow = z.infer<typeof VideoRowSchema>;


