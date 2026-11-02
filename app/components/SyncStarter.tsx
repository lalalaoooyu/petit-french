"use client";

import { useEffect } from "react";
import { startSync } from "@/lib/sync";

export default function SyncStarter() {
  useEffect(() => startSync(), []);
  return null;
}
