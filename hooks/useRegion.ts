import { createContext, useContext } from "react";

/** Abbreviation → full state name map for all supported states */
export const STATE_LABELS: Record<string, string> = {
  FL: "Florida",
  CA: "California",
  TX: "Texas",
  NY: "New York",
  GA: "Georgia",
};

/** Ordered list of state abbreviations available in the app */
export const US_STATES = Object.keys(STATE_LABELS);

export interface RegionContextType {
  /** Currently selected state abbreviation (e.g. "FL") */
  region: string;
  /** Update the selected region */
  setRegion: (abbrev: string) => void;
  /** Human-readable label, e.g. "Florida (FL)" */
  regionLabel: string;
}

export const RegionContext = createContext<RegionContextType>({
  region: "FL",
  setRegion: () => {},
  regionLabel: "Florida (FL)",
});

export function useRegion() {
  return useContext(RegionContext);
}
