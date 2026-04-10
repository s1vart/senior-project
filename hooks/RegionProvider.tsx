import React, { useState, useMemo } from "react";
import { RegionContext, STATE_LABELS } from "./useRegion";

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState("FL");

  const regionLabel = useMemo(
    () => `${STATE_LABELS[region] ?? region} (${region})`,
    [region],
  );

  const value = useMemo(
    () => ({ region, setRegion, regionLabel }),
    [region, regionLabel],
  );

  return (
    <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
  );
}
