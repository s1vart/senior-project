import * as ImageManipulator from "expo-image-manipulator";
import { PlantIdResponse, PlantSearchResult } from "../types";

const API_URL = "https://plant.id/api/v3/identification";
const API_KEY = process.env.EXPO_PUBLIC_PLANT_ID_KEY;
const MAX_DIMENSION = 1024;

export type PlantIdErrorCode = "NOT_PLANT" | "API_ERROR" | "RATE_LIMIT" | "NETWORK";

export class PlantIdError extends Error {
  code: PlantIdErrorCode;
  constructor(message: string, code: PlantIdErrorCode) {
    super(message);
    this.name = "PlantIdError";
    this.code = code;
  }
}

/**
 * Resize image to max 1024px on longest side and return base64 JPEG.
 */
export async function prepareImage(
  uri: string,
  width: number,
  height: number
): Promise<string> {
  const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height, 1);
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: Math.round(width * scale), height: Math.round(height * scale) } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );
  return result.base64!;
}

/**
 * Send image to Plant.id v3 and return mapped results.
 */
export async function identifyPlant(
  uri: string,
  width: number,
  height: number
): Promise<PlantSearchResult[]> {
  if (!API_KEY) {
    throw new PlantIdError("Plant ID API key is not configured.", "API_ERROR");
  }

  const base64 = await prepareImage(uri, width, height);

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Api-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: [`data:image/jpeg;base64,${base64}`],
        similar_images: true,
        classification_level: "species",
        details: ["common_names", "url", "watering", "best_watering"],
      }),
    });
  } catch {
    throw new PlantIdError(
      "Could not connect to identification service. Check your internet connection.",
      "NETWORK"
    );
  }

  if (response.status === 429) {
    throw new PlantIdError(
      "Identification rate limit reached. Please try again in a few minutes.",
      "RATE_LIMIT"
    );
  }

  if (!response.ok) {
    throw new PlantIdError(
      `Identification service error (${response.status}).`,
      "API_ERROR"
    );
  }

  const data: PlantIdResponse = await response.json();

  if (!data.result.is_plant.binary) {
    throw new PlantIdError(
      "This doesn't appear to be a plant. Try taking a clearer photo of the plant.",
      "NOT_PLANT"
    );
  }

  return data.result.classification.suggestions.map((s, index) => ({
    id: s.id || `plant-${index}`,
    commonName: s.details?.common_names?.[0] ?? s.name,
    scientificName: s.name,
    confidence: s.probability,
    imageUrl: s.similar_images?.[0]?.url ?? "",
    wikiUrl: s.details?.url,
    bestWatering: s.details?.best_watering,
    wateringMin: s.details?.watering?.min,
    wateringMax: s.details?.watering?.max,
  }));
}
