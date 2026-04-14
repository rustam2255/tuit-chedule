import { useCallback, useEffect, useState } from "react";
import api from "@/shared/api";
import type { StoreData } from "@/shared/types";

const emptyState: StoreData = {
  buildings: [],
  faculties: [],
  departments: [],
  subjects: [],
  rooms: [],
  teachers: [],
  groups: [],
  timeslots: [],
  loads: [],
};

export function useMasterData() {
  const [data, setData] = useState<StoreData>(emptyState);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<StoreData>("/masterdata/full");
      setData(data);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { data, loading, refresh };
}
