import { type User, type InsertUser, type Alert, type InsertAlert, type Settings, type InsertSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Alert methods
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlerts(): Promise<Alert[]>;
  getAlertById(id: string): Promise<Alert | undefined>;
  
  // Settings methods
  getSettings(): Promise<Settings | undefined>;
  createOrUpdateSettings(settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private alerts: Map<string, Alert>;
  private settings: Settings | undefined;

  constructor() {
    this.users = new Map();
    this.alerts = new Map();
    this.settings = undefined;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...insertAlert, 
      id, 
      timestamp: new Date()
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getAlertById(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }

  async createOrUpdateSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = this.settings?.id || randomUUID();
    const settings: Settings = {
      ...insertSettings,
      id,
      updatedAt: new Date()
    };
    this.settings = settings;
    return settings;
  }
}

export const storage = new MemStorage();
