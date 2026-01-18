import { db } from "./db";
import {
  enrollments,
  demographicUpdates,
  biometricUpdates,
  type InsertEnrollment,
  type InsertDemographicUpdate,
  type InsertBiometricUpdate,
  type KpiStats,
  type StateStats,
  type DailyTrend
} from "@shared/schema";
import { sql, desc, sum, eq } from "drizzle-orm";

export interface IStorage {
  // Seeding
  createEnrollment(data: InsertEnrollment): Promise<void>;
  createDemographicUpdate(data: InsertDemographicUpdate): Promise<void>;
  createBiometricUpdate(data: InsertBiometricUpdate): Promise<void>;
  
  // Stats
  getKpiStats(): Promise<KpiStats>;
  getStateStats(): Promise<StateStats[]>;
  getDailyTrends(): Promise<DailyTrend[]>;
  
  // Check if seeded
  isSeeded(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async createEnrollment(data: InsertEnrollment): Promise<void> {
    await db.insert(enrollments).values(data);
  }

  async createDemographicUpdate(data: InsertDemographicUpdate): Promise<void> {
    await db.insert(demographicUpdates).values(data);
  }

  async createBiometricUpdate(data: InsertBiometricUpdate): Promise<void> {
    await db.insert(biometricUpdates).values(data);
  }

  async isSeeded(): Promise<boolean> {
    const [count] = await db.select({ count: sql<number>`count(*)` }).from(enrollments);
    return Number(count.count) > 0;
  }

  async getKpiStats(): Promise<KpiStats> {
    // Total Enrollments
    const [enrollmentStats] = await db.select({
      total: sql<number>`sum(age_0_5 + age_5_17 + age_18_greater)`
    }).from(enrollments);

    // Total Demographic Updates
    const [demoStats] = await db.select({
      total: sql<number>`sum(demo_age_5_17 + demo_age_17_)`
    }).from(demographicUpdates);

    // Total Biometric Updates
    const [bioStats] = await db.select({
      total: sql<number>`sum(bio_age_5_17 + bio_age_17_)`
    }).from(biometricUpdates);

    const totalEnrollments = Number(enrollmentStats?.total || 0);
    const totalDemographicUpdates = Number(demoStats?.total || 0);
    const totalBiometricUpdates = Number(bioStats?.total || 0);

    return {
      totalEnrollments,
      totalUpdates: totalDemographicUpdates + totalBiometricUpdates,
      totalDemographicUpdates,
      totalBiometricUpdates,
    };
  }

  async getStateStats(): Promise<StateStats[]> {
    // Aggregate Enrollments by State
    const enrollmentByState = await db.select({
      state: enrollments.state,
      total: sql<number>`sum(age_0_5 + age_5_17 + age_18_greater)`
    })
    .from(enrollments)
    .groupBy(enrollments.state);

    // Aggregate Updates by State (Demographic + Biometric)
    // This is a bit tricky with separate tables. 
    // We can fetch separate lists and merge in memory, or use a UNION query.
    // Given the potential size, separate aggregation and merge in code is safer/easier for now.
    
    const demoByState = await db.select({
      state: demographicUpdates.state,
      total: sql<number>`sum(demo_age_5_17 + demo_age_17_)`
    })
    .from(demographicUpdates)
    .groupBy(demographicUpdates.state);

    const bioByState = await db.select({
      state: biometricUpdates.state,
      total: sql<number>`sum(bio_age_5_17 + bio_age_17_)`
    })
    .from(biometricUpdates)
    .groupBy(biometricUpdates.state);

    // Merge
    const statsMap = new Map<string, StateStats>();

    for (const r of enrollmentByState) {
      if (!r.state) continue;
      statsMap.set(r.state, { state: r.state, enrollments: Number(r.total), updates: 0 });
    }

    for (const r of demoByState) {
      if (!r.state) continue;
      const entry = statsMap.get(r.state) || { state: r.state, enrollments: 0, updates: 0 };
      entry.updates += Number(r.total);
      statsMap.set(r.state, entry);
    }

    for (const r of bioByState) {
      if (!r.state) continue;
      const entry = statsMap.get(r.state) || { state: r.state, enrollments: 0, updates: 0 };
      entry.updates += Number(r.total);
      statsMap.set(r.state, entry);
    }

    return Array.from(statsMap.values()).sort((a, b) => b.enrollments - a.enrollments);
  }

  async getDailyTrends(): Promise<DailyTrend[]> {
    // Similar strategy: Aggregate daily totals separately and merge.
    const enrollmentDaily = await db.select({
      date: enrollments.date,
      total: sql<number>`sum(age_0_5 + age_5_17 + age_18_greater)`
    })
    .from(enrollments)
    .groupBy(enrollments.date);

    const demoDaily = await db.select({
      date: demographicUpdates.date,
      total: sql<number>`sum(demo_age_5_17 + demo_age_17_)`
    })
    .from(demographicUpdates)
    .groupBy(demographicUpdates.date);

    const bioDaily = await db.select({
      date: biometricUpdates.date,
      total: sql<number>`sum(bio_age_5_17 + bio_age_17_)`
    })
    .from(biometricUpdates)
    .groupBy(biometricUpdates.date);

    const trendMap = new Map<string, DailyTrend>();

    for (const r of enrollmentDaily) {
      if (!r.date) continue;
      trendMap.set(r.date, { date: r.date, enrollments: Number(r.total), updates: 0 });
    }

    for (const r of demoDaily) {
      if (!r.date) continue;
      const entry = trendMap.get(r.date) || { date: r.date, enrollments: 0, updates: 0 };
      entry.updates += Number(r.total);
      trendMap.set(r.date, entry);
    }

    for (const r of bioDaily) {
      if (!r.date) continue;
      const entry = trendMap.get(r.date) || { date: r.date, enrollments: 0, updates: 0 };
      entry.updates += Number(r.total);
      trendMap.set(r.date, entry);
    }

    return Array.from(trendMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

export const storage = new DatabaseStorage();
