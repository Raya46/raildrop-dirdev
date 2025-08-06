import { Locker } from "@/types/locker";
import { LockerWithStation } from "@/types/lockerStation";
import { Station } from "@/types/station";
import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const useGetStations = () => {
  return useQuery<Station[], Error>({
    queryKey: ["stations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stations").select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useGetLockersByStation = (stationId: string) => {
  return useQuery<Locker[], Error>({
    queryKey: ["lockers", stationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lockers")
        .select("*")
        .eq("station_id", stationId);
      if (error) throw error;
      return data;
    },
    enabled: !!stationId,
  });
};

export const useGetLockersById = (id: string) => {
  return useQuery<Locker[], Error>({
    queryKey: ["lockers", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lockers")
        .select("*")
        .eq("id", id);
      console.log(data);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useGetLockersWithStations = () => {
  return useQuery<LockerWithStation[], Error>({
    queryKey: ["lockers-with-stations"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("lockers")
        .select("*, station:stations(*)");

      if (error) {
        console.error("Error fetching lockers with stations:", error);
        throw error;
      }

      return data;
    },
  });
};