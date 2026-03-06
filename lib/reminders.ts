import { supabase } from "./supabase";
import type { Reminder } from "../types";

// --- Raw DB row type (snake_case) ---
interface ReminderRow {
  id: string;
  plant_id: string;
  user_id: string;
  care_type: string;
  frequency_days: number;
  time_of_day: string;
  next_due: string;
  is_active: boolean;
  created_at: string;
}

// --- Mapping helpers ---
function toReminder(row: ReminderRow): Reminder {
  return {
    id: row.id,
    plantId: row.plant_id,
    userId: row.user_id,
    careType: row.care_type as Reminder["careType"],
    frequencyDays: row.frequency_days,
    timeOfDay: row.time_of_day,
    nextDue: row.next_due,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function toRow(
  reminder: Partial<Omit<Reminder, "id" | "createdAt">>
): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (reminder.plantId !== undefined) row.plant_id = reminder.plantId;
  if (reminder.userId !== undefined) row.user_id = reminder.userId;
  if (reminder.careType !== undefined) row.care_type = reminder.careType;
  if (reminder.frequencyDays !== undefined)
    row.frequency_days = reminder.frequencyDays;
  if (reminder.timeOfDay !== undefined) row.time_of_day = reminder.timeOfDay;
  if (reminder.nextDue !== undefined) row.next_due = reminder.nextDue;
  if (reminder.isActive !== undefined) row.is_active = reminder.isActive;
  return row;
}

/**
 * Derive a suggested watering frequency (in days) from Plant.id moisture levels.
 *
 * The `watering` detail returns { min, max } representing preferred soil
 * moisture percentage. Higher values = the plant likes more moisture = water
 * more often.
 *
 * Returns a sensible default (7) when no data is available.
 */
export function suggestWateringFrequency(
  wateringMin?: number,
  wateringMax?: number
): number {
  if (wateringMin == null || wateringMax == null) return 7;

  const avg = (wateringMin + wateringMax) / 2;

  if (avg >= 60) return 3; // high moisture — every 3 days
  if (avg >= 40) return 5; // moderate — every 5 days
  if (avg >= 20) return 7; // average — weekly
  return 14; // low / drought-tolerant — every 2 weeks
}

// --- CRUD ---

export async function createReminder(
  reminder: Omit<Reminder, "id" | "createdAt">
): Promise<Reminder> {
  const row = toRow(reminder);
  const { data, error } = await supabase
    .from("reminders")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`Failed to create reminder: ${error.message}`);
  return toReminder(data as ReminderRow);
}

export async function fetchRemindersForPlant(
  plantId: string
): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("plant_id", plantId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch reminders: ${error.message}`);
  return (data as ReminderRow[]).map(toReminder);
}

export async function fetchRemindersForUser(
  userId: string
): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("next_due", { ascending: true });

  if (error) throw new Error(`Failed to fetch reminders: ${error.message}`);
  return (data as ReminderRow[]).map(toReminder);
}

export async function updateReminder(
  reminderId: string,
  updates: Partial<Omit<Reminder, "id" | "createdAt">>
): Promise<Reminder> {
  const row = toRow(updates);
  const { data, error } = await supabase
    .from("reminders")
    .update(row)
    .eq("id", reminderId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update reminder: ${error.message}`);
  return toReminder(data as ReminderRow);
}

export async function deleteReminder(reminderId: string): Promise<void> {
  const { error } = await supabase
    .from("reminders")
    .delete()
    .eq("id", reminderId);

  if (error) throw new Error(`Failed to delete reminder: ${error.message}`);
}
