import { useEffect, useState } from "react";
import { OpenMapFeature, PlaceDetail } from "../types/SubType";

export function useMapCreate() {
  const [suggestions, setSuggestions] = useState<OpenMapFeature[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // open map get address
  const fetchSuggestions = async (text: string) => {
    if (text.length < 4) {
      setSuggestions([]);
      return;
    }

    setIsGeocoding(true);

    try {
      const res = await fetch(
        `https://mapapis.openmap.vn/v1/autocomplete?text=${encodeURIComponent(
          text,
        )}&apikey=${process.env.NEXT_PUBLIC_OPEN_MAP_API_KEY}`,
      );

      const data = await res.json();

      setSuggestions(data.features || []);
    } finally {
      setIsGeocoding(false);
    }
  };

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
    suggestions,
    isGeocoding,
    isLoading,
    setIsLoading,
    fetchPlaceDetail,
    fetchSuggestions,
    setSuggestions,
  };
}
