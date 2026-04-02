"use client";

import { memo, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./WarehouseMap.css";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { Warehouse } from "@/src/types";
import { getAllWarehouseAPI } from "@/src/services/warehouse.service";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

function WarehouseMap() {
  const { theme } = useTheme();

  const [selectWarehouse, setSelectWarehouse] = useState<Warehouse | null>(
    null,
  );
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: warehouseList = [], isLoading } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getAllWarehouseAPI({}),
    select: (res) => res.data as Warehouse[],
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

    const warehouseMarkers = warehouseList.map((warehouse) => {
      const warehouseIcon = document.createElement("div");
      warehouseIcon.className = "warehouse-marker";

      // render icon warehouse location
      const marker = new mapboxgl.Marker({ element: warehouseIcon })
        .setLngLat([warehouse.longitude, warehouse.latitude])
        .addTo(mapRef.current!);

      warehouseIcon.addEventListener("click", () => {
        setSelectWarehouse(warehouse);
      });

      return marker;
    });

    return () => {
      warehouseMarkers.forEach((marker) => marker.remove());
    };
  }, [warehouseList]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
      {selectWarehouse && (
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
              {selectWarehouse.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              {selectWarehouse.address}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              {selectWarehouse.cityName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(WarehouseMap);
