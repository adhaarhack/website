import { z } from 'zod';
import { insertEnrollmentSchema } from './schema';

export const errorSchemas = {
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  stats: {
    kpi: {
      method: 'GET' as const,
      path: '/api/stats/kpi',
      responses: {
        200: z.object({
          totalEnrollments: z.number(),
          totalUpdates: z.number(),
          totalDemographicUpdates: z.number(),
          totalBiometricUpdates: z.number(),
        }),
      },
    },
    stateWise: {
      method: 'GET' as const,
      path: '/api/stats/state-wise',
      responses: {
        200: z.array(z.object({
          state: z.string(),
          enrollments: z.number(),
          updates: z.number(),
        })),
      },
    },
    trends: {
      method: 'GET' as const,
      path: '/api/stats/trends',
      responses: {
        200: z.array(z.object({
          date: z.string(),
          enrollments: z.number(),
          updates: z.number(),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type KpiStatsResponse = z.infer<typeof api.stats.kpi.responses[200]>;
export type StateWiseStatsResponse = z.infer<typeof api.stats.stateWise.responses[200]>;
export type TrendsStatsResponse = z.infer<typeof api.stats.trends.responses[200]>;
