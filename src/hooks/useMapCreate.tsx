import { useEffect, useRef, useState } from "react";
import { OpenMapFeature, PlaceDetail } from "../types/SubType";
import { useDebounce } from "./useDebounce";

export function useMapCreate() {
  const [suggestions, setSuggestions] = useState<OpenMapFeature[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  const abortRef = useRef<AbortController | null>(null);
  const debouncedInput = useDebounce(input, 500);

  // open map get address
  const fetchSuggestions = async () => {
    setIsGeocoding(true);

    try {
      const res = await fetch(
        `https://mapapis.openmap.vn/v1/autocomplete?text=${encodeURIComponent(
          debouncedInput,
        )}&apikey=${process.env.NEXT_PUBLIC_OPEN_MAP_API_KEY}`,
      );

      const data = await res.json();

      setSuggestions(data.features || []);
    } catch (err) {
      console.error("Fetch suggestion failed:", err);
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    if (debouncedInput.length < 4) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    abortRef.current?.abort(); // cancel request cũ
    abortRef.current = controller;

    fetchSuggestions();

    return () => controller.abort();
  }, [debouncedInput]);

  // open map get lat long
  const fetchPlaceDetail = async (id: string): Promise<PlaceDetail | null> => {
    if (!id) return null;

    setIsGeocoding(true);

    try {
      const res = await fetch(
        `https://mapapis.openmap.vn/v1/place?ids=${id}&apikey=${process.env.NEXT_PUBLIC_OPEN_MAP_API_KEY}`,
      );

      if (!res.ok) throw new Error("Fetch place detail failed");

      const data = await res.json();
      const feature = data?.features?.[0];

      if (!feature?.geometry?.coordinates) return null;

      const [lng, lat] = feature.geometry.coordinates;

      return {
        lat,
        lng,
        address: feature.properties?.label ?? "",
      };
    } finally {
      setIsGeocoding(false);
    }
  };

  // support loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isLoading]);

  return {
    input,
    setInput,
    suggestions,
    isGeocoding,
    isLoading,
    setIsLoading,
    fetchPlaceDetail,
    fetchSuggestions,
    setSuggestions,
  };
}
