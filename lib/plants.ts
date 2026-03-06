import * as FileSystem from "expo-file-system";
import { supabase } from "./supabase";
import type { Plant } from "../types";

// --- Raw DB row type (snake_case) ---
interface PlantRow {
  id: string;
  user_id: string;
  nickname: string;
  common_name: string;
  scientific_name: string;
  confidence: number | null;
  photo_url: string | null;
  notes: string | null;
  last_watered: string | null;
  water_amount_ml: number | null;
  direct_sunlight: boolean | null;
  sunlight_hours: number | null;
  distance_from_window: number | null;
  window_orientation: string | null;
  completion_percent: number | null;
  best_watering: string | null;
  watering_min: number | null;
  watering_max: number | null;
  created_at: string;
  updated_at: string;
}

// --- Mapping: DB row → TypeScript ---
function toPlant(row: PlantRow): Plant {
  return {
    id: row.id,
    userId: row.user_id,
    nickname: row.nickname,
    commonName: row.common_name,
    scientificName: row.scientific_name,
    confidence: row.confidence ?? 0,
    photoUrl: row.photo_url ?? "",
    notes: row.notes ?? undefined,
    lastWatered: row.last_watered ?? undefined,
    waterAmountMl: row.water_amount_ml ?? undefined,
    directSunlight: row.direct_sunlight ?? undefined,
    sunlightHours: row.sunlight_hours ?? undefined,
    distanceFromWindow: row.distance_from_window ?? undefined,
    windowOrientation: row.window_orientation ?? undefined,
    completionPercent: row.completion_percent ?? undefined,
    bestWatering: row.best_watering ?? undefined,
    wateringMin: row.watering_min ?? undefined,
    wateringMax: row.watering_max ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// --- Mapping: TypeScript → DB row ---
function toRow(plant: Partial<Plant>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (plant.userId !== undefined) row.user_id = plant.userId;
  if (plant.nickname !== undefined) row.nickname = plant.nickname;
  if (plant.commonName !== undefined) row.common_name = plant.commonName;
  if (plant.scientificName !== undefined)
    row.scientific_name = plant.scientificName;
  if (plant.confidence !== undefined) row.confidence = plant.confidence;
  if (plant.photoUrl !== undefined) row.photo_url = plant.photoUrl;
  if (plant.notes !== undefined) row.notes = plant.notes;
  if (plant.lastWatered !== undefined) row.last_watered = plant.lastWatered;
  if (plant.waterAmountMl !== undefined)
    row.water_amount_ml = plant.waterAmountMl;
  if (plant.directSunlight !== undefined)
    row.direct_sunlight = plant.directSunlight;
  if (plant.sunlightHours !== undefined)
    row.sunlight_hours = plant.sunlightHours;
  if (plant.distanceFromWindow !== undefined)
    row.distance_from_window = plant.distanceFromWindow;
  if (plant.windowOrientation !== undefined)
    row.window_orientation = plant.windowOrientation;
  if (plant.completionPercent !== undefined)
    row.completion_percent = plant.completionPercent;
  if (plant.bestWatering !== undefined)
    row.best_watering = plant.bestWatering;
  if (plant.wateringMin !== undefined)
    row.watering_min = plant.wateringMin;
  if (plant.wateringMax !== undefined)
    row.watering_max = plant.wateringMax;
  return row;
}

// --- Photo upload ---
export async function uploadPlantPhoto(
  userId: string,
  localUri: string
): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const fileName = `${userId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from("plant-photos")
    .upload(fileName, bytes, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) throw new Error(`Photo upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from("plant-photos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// --- CRUD operations ---
export async function createPlant(
  plant: Omit<Plant, "id" | "createdAt" | "updatedAt">
): Promise<Plant> {
  const row = toRow(plant);
  const { data, error } = await supabase
    .from("plants")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`Failed to save plant: ${error.message}`);
  return toPlant(data as PlantRow);
}

export async function fetchPlants(userId: string): Promise<Plant[]> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch plants: ${error.message}`);
  return (data as PlantRow[]).map(toPlant);
}

export async function fetchPlantById(
  plantId: string
): Promise<Plant | null> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("id", plantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`Failed to fetch plant: ${error.message}`);
  }
  return toPlant(data as PlantRow);
}

export async function updatePlant(
  plantId: string,
  updates: Partial<Plant>
): Promise<Plant> {
  const row = toRow(updates);
  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("plants")
    .update(row)
    .eq("id", plantId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update plant: ${error.message}`);
  return toPlant(data as PlantRow);
}

export async function deletePlant(plantId: string): Promise<void> {
  const { error } = await supabase
    .from("plants")
    .delete()
    .eq("id", plantId);

  if (error) throw new Error(`Failed to delete plant: ${error.message}`);
}
