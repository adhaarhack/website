import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { db } from "./db";
import { enrollments, demographicUpdates, biometricUpdates } from "@shared/schema";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import readline from "readline";

// Helper to parse date dd-mm-yyyy to yyyy-mm-dd
function parseDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
}

async function processGzCsv(filePath: string, onRow: (row: any) => Promise<void>) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const fileStream = fs.createReadStream(filePath);
  const unzipStream = zlib.createGunzip();
  const rl = readline.createInterface({
    input: fileStream.pipe(unzipStream),
    crlfDelay: Infinity,
  });

  let header: string[] = [];
  let isHeader = true;

  for await (const line of rl) {
    if (isHeader) {
      header = line.split(',');
      isHeader = false;
      continue;
    }

    const values = line.split(',');
    const row: any = {};
    header.forEach((col, index) => {
      row[col] = values[index];
    });

    await onRow(row);
  }
}

async function seedData() {
  // Check specifically if demographic or biometric updates are missing even if enrollment is there
  const [enrollCount] = await db.select({ count: sql<number>`count(*)` }).from(enrollments);
  const [demoCount] = await db.select({ count: sql<number>`count(*)` }).from(demographicUpdates);
  const [bioCount] = await db.select({ count: sql<number>`count(*)` }).from(biometricUpdates);

  if (Number(enrollCount.count) > 0 && Number(demoCount.count) > 0 && Number(bioCount.count) > 0) {
    console.log("Database already fully seeded. Skipping.");
    return;
  }

  console.log("Starting seeding process (missing demographic/biometric data)...");
  
  // Find files in attached_assets
  const assetsDir = path.resolve("attached_assets");
  if (!fs.existsSync(assetsDir)) return;

  const files = fs.readdirSync(assetsDir);
  
  // Process Enrollments
  const enrollmentFiles = files.filter(f => f.toLowerCase().includes("aadhar_enrolment") && f.endsWith(".gz"));
  for (const file of enrollmentFiles) {
    if (Number(enrollCount.count) > 0) continue; // Skip if already have enrollments
    console.log(`Processing ${file}...`);
    await processGzCsv(path.join(assetsDir, file), async (row) => {
      await storage.createEnrollment({
        date: parseDate(row.date),
        state: row.state,
        district: row.district,
        pincode: row.pincode,
        age_0_5: Number(row.age_0_5 || 0),
        age_5_17: Number(row.age_5_17 || 0),
        age_18_greater: Number(row.age_18_greater || 0),
      });
    });
  }

  // Process Demographic Updates
  const demoFiles = files.filter(f => f.toLowerCase().includes("aadhar_demographic") && f.endsWith(".gz"));
  for (const file of demoFiles) {
    if (Number(demoCount.count) > 0) continue; // Skip if already have demographic data
    console.log(`Processing ${file}...`);
    await processGzCsv(path.join(assetsDir, file), async (row) => {
      // Handle the case where the header might be "demo_age_17_" or "demo_age_17_plus"
      // Based on previous head output, it was "demo_age_17_"
      const demo17 = row.demo_age_17_ || row.demo_age_17_plus || 0;
      await storage.createDemographicUpdate({
        date: parseDate(row.date),
        state: row.state,
        district: row.district,
        pincode: row.pincode,
        demo_age_5_17: Number(row.demo_age_5_17 || 0),
        demo_age_17_plus: Number(demo17),
      });
    });
  }

  // Process Biometric Updates
  const bioFiles = files.filter(f => f.toLowerCase().includes("aadhar_biometric") && f.endsWith(".gz"));
  for (const file of bioFiles) {
    if (Number(bioCount.count) > 0) continue; // Skip if already have biometric data
    console.log(`Processing ${file}...`);
    await processGzCsv(path.join(assetsDir, file), async (row) => {
      // The head output showed 'bio_age_5_17' and 'bio_age_17_'
      const bio5_17 = Number(row.bio_age_5_17 || 0);
      const bio17Plus = Number(row.bio_age_17_ || row.bio_age_17_plus || 0);
      
      await storage.createBiometricUpdate({
        date: parseDate(row.date),
        state: row.state,
        district: row.district,
        pincode: row.pincode,
        bio_age_5_17: bio5_17,
        bio_age_17_plus: bio17Plus,
      });
    });
  }

  console.log("Seeding complete.");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Stats Endpoints
  app.get(api.stats.kpi.path, async (_req, res) => {
    const stats = await storage.getKpiStats();
    res.json(stats);
  });

  app.get(api.stats.stateWise.path, async (_req, res) => {
    const stats = await storage.getStateStats();
    res.json(stats);
  });

  app.get(api.stats.trends.path, async (_req, res) => {
    const stats = await storage.getDailyTrends();
    res.json(stats);
  });

  // Start seeding in background
  seedData().catch(console.error);

  return httpServer;
}
