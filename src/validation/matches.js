import { z } from "zod";

export const MATCH_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
});

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const scoreSchema = z.preprocess((val) => {
  if (
    val === null ||
    typeof val === "boolean" ||
    (typeof val === "string" && val.trim() === "")
  ) {
    return NaN;
  }
  return val;
}, z.coerce.number().int().nonnegative());

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1),
    homeTeam: z.string().trim().min(1),
    awayTeam: z.string().trim().min(1),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    homeScore: scoreSchema.optional(),
    awayScore: scoreSchema.optional(),
  })
  .superRefine(({ startTime, endTime }, ctx) => {
    if (new Date(endTime) <= new Date(startTime)) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "endTime must be chronologically after startTime",
      });
    }
  });

export const updateScoreSchema = z.object({
  homeScore: scoreSchema,
  awayScore: scoreSchema,
});

