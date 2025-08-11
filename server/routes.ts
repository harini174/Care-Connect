import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlertSchema, insertSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      if (!settings) {
        // Return default settings if none exist
        const defaultSettings = {
          caregiverName: "",
          caregiverPhone: "",
          minHeartRate: 50,
          maxHeartRate: 120,
          fallSensitivity: "medium" as const
        };
        res.json(defaultSettings);
      } else {
        res.json(settings);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Emergency alert endpoint
  app.post("/api/emergency-alert", async (req, res) => {
    try {
      const { location, heartRate } = req.body;
      
      // Create emergency alert
      const alert = await storage.createAlert({
        type: "emergency",
        description: "Emergency SOS button pressed",
        location: location || "Location unavailable",
        heartRate: heartRate || null,
        resolved: "false"
      });

      // In a real implementation, this would send SMS via Twilio
      console.log("Emergency alert created:", alert);
      
      res.json({ success: true, alert });
    } catch (error) {
      res.status(500).json({ message: "Failed to send emergency alert" });
    }
  });

  // Test alert endpoint
  app.post("/api/test-alert", async (req, res) => {
    try {
      const { caregiverPhone } = req.body;
      
      // Create test alert
      const alert = await storage.createAlert({
        type: "test",
        description: "Test SMS sent successfully",
        location: `Phone: ${caregiverPhone}`,
        heartRate: null,
        resolved: "false"
      });

      // In a real implementation, this would send SMS via Twilio
      console.log("Test alert sent to:", caregiverPhone);
      
      res.json({ success: true, alert });
    } catch (error) {
      res.status(500).json({ message: "Failed to send test alert" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
