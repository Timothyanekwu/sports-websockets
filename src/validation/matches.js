import { z } from "zod";

export const MATCH_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
});

const isoDateTimeValidator = z.iso.datetime({ offset: true });

const isIsoDateString = (value) =>
  isoDateTimeValidator.safeParse(value).success;

const isoDateString = z.string().refine(isIsoDateString, {
  message: "Must be a valid ISO date string",
});

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1),
    homeTeam: z.string().trim().min(1),
    awayTeam: z.string().trim().min(1),
    startTime: isoDateString,
    endTime: isoDateString,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
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
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
