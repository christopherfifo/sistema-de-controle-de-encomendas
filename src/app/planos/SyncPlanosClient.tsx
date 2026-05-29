"use client";

import { useEffect } from "react";
import { syncPlanos } from "./syncAction";

export function SyncPlanosClient() {
  useEffect(() => {
    syncPlanos();
  }, []);

  return null;
}
