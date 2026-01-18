import { pgTable, text, serial, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  pincode: text("pincode").notNull(),
  age_0_5: integer("age_0_5").default(0),
  age_5_17: integer("age_5_17").default(0),
  age_18_greater: integer("age_18_greater").default(0),
});

export const demographicUpdates = pgTable("demographic_updates", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  pincode: text("pincode").notNull(),
  demo_age_5_17: integer("demo_age_5_17").default(0),
  demo_age_17_plus: integer("demo_age_17_").default(0),
});

export const biometricUpdates = pgTable("biometric_updates", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  state: text("state").notNull(),
  district: text("district").notNull(),
  pincode: text("pincode").notNull(),
  bio_age_5_17: integer("bio_age_5_17").default(0),
  bio_age_17_plus: integer("bio_age_17_").default(0),
});

// === SCHEMAS ===

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true });
export const insertDemographicUpdateSchema = createInsertSchema(demographicUpdates).omit({ id: true });
export const insertBiometricUpdateSchema = createInsertSchema(biometricUpdates).omit({ id: true });

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertDemographicUpdate = z.infer<typeof insertDemographicUpdateSchema>;
export type InsertBiometricUpdate = z.infer<typeof insertBiometricUpdateSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type DemographicUpdate = typeof demographicUpdates.$inferSelect;
export type BiometricUpdate = typeof biometricUpdates.$inferSelect;

// === API TYPES ===

export interface KpiStats {
  totalEnrollments: number;
  totalUpdates: number;
  totalDemographicUpdates: number;
  totalBiometricUpdates: number;
}

export interface StateStats {
  state: string;
  enrollments: number;
  updates: number;
}

export interface DailyTrend {
  date: string;
  enrollments: number;
  updates: number;
}
