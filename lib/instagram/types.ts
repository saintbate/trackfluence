import { z } from "zod";

export const AccountInfoSchema = z.object({
  id: z.string(),
  username: z.string(),
  profile_picture_url: z.string().optional(),
  followers_count: z.number().optional(),
  media_count: z.number().optional(),
});
export type AccountInfo = z.infer<typeof AccountInfoSchema>;

export const AccountDailySchema = z.object({
  date: z.string(), // YYYY-MM-DD
  impressions: z.number(),
  reach: z.number(),
  profile_views: z.number(),
  follower_count: z.number(),
});
export type AccountDaily = z.infer<typeof AccountDailySchema>;

export const MediaRowSchema = z.object({
  media_id: z.string(),
  media_type: z.string().optional(),
  permalink: z.string().optional(),
  caption: z.string().optional(),
  posted_at: z.string().optional(),
  impressions: z.number(),
  reach: z.number(),
  engagement: z.number(),
  likes: z.number(),
  comments: z.number(),
  saves: z.number(),
  video_views: z.number().optional(),
  plays: z.number().optional(),
});
export type MediaRow = z.infer<typeof MediaRowSchema>;


