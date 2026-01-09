"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { StoreFakeData } from "@/shared/constants/fakeData";
import "./StoreMap.css";
import { Store } from "@/shared/types";
import { set } from "zod";
import { Button } from "@/shared/styles/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

function StoreMap() {
  const [selectStore, setSelectStore] = useState<Store | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const tButton = useTranslations("admin.button");
  const router = useRouter();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [106.7009, 10.7769],
      zoom: 10,
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // fetch all store
  useEffect(() => {
    if (!mapRef.current) return;

    const storeMarkers = StoreFakeData.map((store) => {
      const storeIcon = document.createElement("div");
      storeIcon.className = "store-marker";

      // render icon store location
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
  }, [StoreFakeData]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      {selectStore && (
        <div
          className="
    absolute left-4 top-4
    w-[260px] max-h-[85%]
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
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
              {selectStore.address}
            </p>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-base">★</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectStore.rating}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoreMap;
