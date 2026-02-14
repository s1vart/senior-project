# Plant OS — Product Requirements Document

## 1. Overview

Plant OS is a mobile app that helps home plant owners identify, catalog, and care for their plants. Users photograph a plant, verify its species through an external identification service, save it to a personal catalog, and receive push-notification reminders for watering and care. The app also surfaces credible, region-specific extension resources.

**Target release:** Beta — end of March 2026 (deployed via Expo/EAS, testable on physical devices)

## 2. Target Users

- Plant owners who struggle to keep plants alive due to misidentification or inconsistent care
- Users who want a single place to track all their plants and care schedules
- Users who want science-based guidance rather than unreliable internet advice

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Mobile app | Expo (React Native) + TypeScript |
| Navigation | Expo Router (file-based) |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password) |
| File storage | Supabase Storage (plant photos) |
| Plant identification | Plant.id API (REST) |
| Push notifications | Expo Notifications |
| Builds / deployment | EAS Build, Expo Go for dev |

## 4. Core Features

### 4.1 Authentication

**Description:** Users create an account and log in with email and password.

| Requirement | Details |
|---|---|
| Sign up | Email + password, stored via Supabase Auth |
| Log in | Email + password, returns session token |
| Session persistence | User stays logged in across app restarts until explicit logout |
| Log out | Clears session, returns to login screen |
| Password reset | Supabase Auth password reset email flow |

**Screens:** Sign Up, Log In, Forgot Password

---

### 4.2 Plant Onboarding (Verified Identification)

**Description:** The core workflow. User photographs a plant, the app identifies it via Plant.id, and the user confirms the result before saving.

**Flow:**

```
User taps "Add Plant"
  → Camera / photo library picker
  → Photo uploaded to Supabase Storage (temp bucket)
  → App sends image to Plant.id API
  → API returns top matches with confidence scores
  → App displays results (species name, common name, confidence %)
  → User selects correct match OR rejects all and retries
  → On confirm: plant entry created in DB with verified species data
  → Photo moved from temp to permanent storage bucket
```

| Requirement | Details |
|---|---|
| Photo source | Device camera or photo library (via `expo-image-picker`) |
| Image constraints | JPEG/PNG, max 5 MB, resized client-side before upload if needed |
| Plant.id request | Send base64-encoded image, receive top 3-5 suggestions |
| Display results | Common name, scientific name, confidence percentage, reference image |
| Confidence threshold | If top result < 40% confidence, show a warning that ID may be unreliable |
| User confirmation | User must explicitly tap to confirm a match before the plant is saved |
| Retry | User can retake/re-upload photo if results are unsatisfactory |
| Nickname | User can assign a custom nickname when confirming (e.g. "Kitchen Fern") |

---

### 4.3 Plant Catalog

**Description:** A personal collection of the user's verified plants. Supports full CRUD.

| Requirement | Details |
|---|---|
| List view | Scrollable list/grid of all plants, showing photo thumbnail, nickname, and species |
| Plant detail | Full-size photo, verified species info (common + scientific name), nickname, date added, care info, reminder status |
| Edit | Update nickname, photo, or notes |
| Delete | Remove plant from catalog (with confirmation prompt) |
| Empty state | Helpful message + CTA to add first plant when catalog is empty |

**Screens:** Plant List, Plant Detail, Edit Plant

---

### 4.4 Care Reminders

**Description:** Per-plant push notification reminders for watering and care tasks.

| Requirement | Details |
|---|---|
| Create reminder | User sets reminder for a specific plant (e.g. "Water every 3 days at 9 AM") |
| Frequency options | Daily, every X days, weekly, custom interval |
| Time of day | User picks the time for the notification |
| Push notifications | Delivered via Expo Notifications, even when app is backgrounded |
| Notification content | Includes plant nickname and care action (e.g. "Time to water Kitchen Fern!") |
| Mark as done | User can mark a reminder as completed; next occurrence is scheduled automatically |
| Snooze/skip | User can snooze (reschedule) or skip a single occurrence |
| Multiple reminders | A plant can have multiple reminders (e.g. watering + fertilizing) |
| Manage reminders | View/edit/delete reminders from the plant detail screen |

**Screens:** Add/Edit Reminder (modal or sheet), Reminders list on Plant Detail

---

### 4.5 Extension Resources

**Description:** Curated links to credible, region-specific plant care resources from the Cooperative Extension System.

| Requirement | Details |
|---|---|
| Region selection | User selects their US state (stored in profile) |
| Resource display | List of relevant extension office links for the selected state |
| Resource data | Stored in DB or static JSON — name, URL, state, description |
| Tap to open | Opens link in an in-app browser (`expo-web-browser`) |
| Update region | User can change their state in settings |

**Screens:** Resources screen (tab), Region selector in Settings

---

## 5. Data Model

### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | References `auth.users.id` |
| email | text | From auth |
| display_name | text | Optional |
| state_region | text | US state for extension resources |
| push_token | text | Expo push notification token |
| created_at | timestamptz | |

### `plants`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| user_id | uuid (FK) | References `profiles.id` |
| nickname | text | User-assigned name |
| common_name | text | From Plant.id |
| scientific_name | text | From Plant.id |
| confidence | float | Identification confidence (0-1) |
| photo_url | text | Path in Supabase Storage |
| plant_id_response | jsonb | Raw Plant.id API response for reference |
| notes | text | User notes |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `reminders`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| plant_id | uuid (FK) | References `plants.id` |
| user_id | uuid (FK) | References `profiles.id` |
| care_type | text | "water", "fertilize", "rotate", etc. |
| frequency_days | int | Interval in days |
| time_of_day | time | When to send notification |
| next_due | timestamptz | Next scheduled occurrence |
| is_active | boolean | Defaults true |
| created_at | timestamptz | |

### `reminder_logs`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| reminder_id | uuid (FK) | References `reminders.id` |
| action | text | "completed", "skipped", "snoozed" |
| acted_at | timestamptz | When the user acted |

### `extension_resources`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| state | text | US state code (e.g. "FL") |
| name | text | e.g. "UF/IFAS Extension" |
| url | text | Link |
| description | text | Short description |

## 6. Row-Level Security (Supabase RLS)

All user-facing tables must have RLS enabled:

- `profiles`: Users can read/update only their own row
- `plants`: Users can CRUD only their own plants
- `reminders`: Users can CRUD only reminders on their own plants
- `reminder_logs`: Users can insert/read only their own logs
- `extension_resources`: Read-only for all authenticated users

## 7. API Integration — Plant.id

| Item | Details |
|---|---|
| Endpoint | `https://api.plant.id/v3/identification` |
| Method | POST |
| Auth | API key in header (`Api-Key: <key>`) |
| Request body | `{ "images": ["base64..."], "similar_images": true }` |
| Response | Array of suggestions with `name`, `probability`, `similar_images` |
| Rate limit | Free tier: 100 identifications/day |
| Error handling | Show user-friendly message on timeout, rate limit, or API error |

The API key must be kept server-side or in environment variables — never hardcoded or bundled in the app binary. Consider proxying requests through a Supabase Edge Function to keep the key secure.

## 8. Navigation Structure

```
(auth)                    ← unauthenticated stack
  ├── login
  └── signup

(tabs)                    ← authenticated tab navigator
  ├── catalog             ← Plant list (home tab)
  │   ├── [id]            ← Plant detail
  │   └── [id]/edit       ← Edit plant
  ├── add                 ← Add plant / onboarding flow
  ├── resources           ← Extension resources
  └── settings            ← Profile, region, logout
```

## 9. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Platform support | iOS and Android via Expo |
| Min OS versions | iOS 15+, Android 12+ (API 31+) |
| Offline behavior | App should display cached catalog when offline; queue reminder actions for sync |
| Image size | Client-side resize to max 1024px before upload to save bandwidth/storage |
| Response time | Plant.id identification should complete within 10 seconds including upload |
| Push notification permission | Request on first reminder creation, not on app launch |

## 10. Out of Scope (Beta)

These are explicitly **not** included in the beta deliverable:

- Social features (sharing plants, community feed)
- In-app chat or messaging
- Plant health diagnosis (disease detection)
- E-commerce / purchasing
- Multi-language / i18n
- Offline plant identification
- Web version
- Apple/Google sign-in (email + password only for beta)

## 11. Milestones

| Date Range | Milestone | Deliverable |
|---|---|---|
| Feb 2 - Feb 7 | Requirements + UI draft | Finalized beta scope + wireframes |
| Feb 8 - Feb 14 | Backend foundation | DB schema + auth + storage + RLS policies |
| Feb 15 - Feb 21 | Onboarding | Photo upload + Plant.id integration + create plant flow |
| Feb 22 - Feb 28 | Plant ID integration | API integrated + confirmation UI |
| Mar 1 - Mar 7 | Catalog core | CRUD catalog + plant detail screens |
| Mar 8 - Mar 14 | Reminders v1 | Push notification scheduling + reminder management |
| Mar 15 - Mar 21 | Resources section | Region selection + extension links |
| Mar 22 - Mar 28 | Beta release | Deployed beta + demo walkthrough |
| Mar 29 - Apr 12 | Testing + polish | Bug fixes + usability improvements |
| Apr 13 - Apr 20 | Final packaging | Docs + final demo + submission materials |
