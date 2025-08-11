import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'emergency', 'heart_rate', 'fall_detection', 'test'
  description: text("description").notNull(),
  location: text("location"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  heartRate: integer("heart_rate"),
  resolved: text("resolved").default("false"),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caregiverName: text("caregiver_name").notNull(),
  caregiverPhone: text("caregiver_phone").notNull(),
  minHeartRate: integer("min_heart_rate").default(50),
  maxHeartRate: integer("max_heart_rate").default(120),
  fallSensitivity: text("fall_sensitivity").default("medium"), // 'low', 'medium', 'high'
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
