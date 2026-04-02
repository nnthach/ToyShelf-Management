"use client";

import { memo, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./StoreMap.css";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { Store } from "@/src/types";
import { getAllStoreAPI } from "@/src/services/store.service";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

function StoreMap({ partnerId }: { partnerId: string }) {
  const { theme } = useTheme();

  const [selectStore, setSelectStore] = useState<Store | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: storeList = [], isLoading } = useQuery({
    queryKey: ["stores", partnerId],
    queryFn: () => getAllStoreAPI({ companyid: partnerId }),
    select: (res) => res.data as Store[],
    enabled: !!partnerId,
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        theme === "dark"
          ? "mapbox://styles/mapbox/navigation-night-v1"
          : "mapbox://styles/mapbox/standard",
      center: [106.7009, 10.7769],
      zoom: 10,
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // map theme
  useEffect(() => {
    if (!mapRef.current) return;

    const style =
      theme === "dark"
        ? "mapbox://styles/mapbox/navigation-night-v1"
        : "mapbox://styles/mapbox/standard";

    mapRef.current.setStyle(style);
  }, [theme]);

  // fetch all store
  useEffect(() => {
    if (!mapRef.current) return;

    const storeMarkers = storeList.map((store) => {
      const storeIcon = document.createElement("div");
      storeIcon.className = "store-marker";

      const marker = new mapboxgl.Marker({ element: storeIcon })
        .setLngLat([store.longitude, store.latitude])
        .addTo(mapRef.current!);

      storeIcon.addEventListener("click", () => {
        setSelectStore(store);
      });

      return marker;
    });

    return () => {
      storeMarkers.forEach((marker) => marker.remove());
    };
  }, [storeList]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      {selectStore && (
        <div
          className="
    absolute left-4 top-4
    w-[300px] max-h-[85%]
    bg-background backdrop-blur-md
    rounded-2xl shadow-xl
    border border-gray-200
    overflow-hidden
  "
        >
          {/* Header */}
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg line-clamp-2">
              {selectStore.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              {selectStore.storeAddress}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              {selectStore.cityName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(StoreMap);
