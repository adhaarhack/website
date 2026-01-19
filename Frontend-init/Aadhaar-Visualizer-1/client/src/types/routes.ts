// Define types locally to match shared/routes.ts schemas
// This avoids Vite import issues with type-only exports from @shared

export type KpiStatsResponse = {
  totalEnrollments: number;
  totalUpdates: number;
  totalDemographicUpdates: number;
  totalBiometricUpdates: number;
};

export type StateWiseStatsResponse = Array<{
  state: string;
  enrollments: number;
  updates: number;
}>;

export type TrendsStatsResponse = Array<{
  date: string;
  enrollments: number;
  updates: number;
}>;
