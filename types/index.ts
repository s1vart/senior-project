export interface Profile {
  id: string;
  email: string;
  displayName?: string;
  stateRegion?: string;
  pushToken?: string;
  createdAt: string;
}

export interface Plant {
  id: string;
  userId: string;
  nickname: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  photoUrl: string;
  notes?: string;
  lastWatered?: string;
  waterAmountMl?: number;
  directSunlight?: boolean;
  sunlightHours?: number;
  distanceFromWindow?: number;
  windowOrientation?: string;
  completionPercent?: number;
  bestWatering?: string;
  wateringMin?: number;
  wateringMax?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  plantId: string;
  userId: string;
  careType: "water" | "fertilize" | "rotate" | "prune";
  frequencyDays: number;
  timeOfDay: string;
  nextDue: string;
  isActive: boolean;
  createdAt: string;
}

export interface ReminderLog {
  id: string;
  reminderId: string;
  action: "completed" | "skipped" | "snoozed";
  actedAt: string;
}

export interface ExtensionResource {
  id: string;
  state: string;
  name: string;
  url: string;
  description: string;
}

export interface PlantSearchResult {
  id: string;
  commonName: string;
  scientificName: string;
  confidence: number;
  imageUrl: string;
  wikiUrl?: string;
  bestWatering?: string;
  wateringMin?: number;
  wateringMax?: number;
}

// Plant.id v3 API response types
export interface PlantIdSuggestion {
  id: string;
  name: string;
  probability: number;
  details: {
    common_names?: string[];
    taxonomy?: {
      genus: string;
      family: string;
    };
    url?: string;
    image?: {
      value: string;
    };
    watering?: {
      min: number;
      max: number;
    };
    best_watering?: string;
  };
  similar_images?: {
    id: string;
    url: string;
    similarity: number;
  }[];
}

export interface PlantIdResponse {
  access_token: string;
  model_version: string;
  input: {
    images: string[];
  };
  result: {
    is_plant: {
      probability: number;
      binary: boolean;
    };
    classification: {
      suggestions: PlantIdSuggestion[];
    };
  };
  status: string;
}
