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
}
