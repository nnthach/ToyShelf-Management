"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useTheme } from "next-themes";

interface FlyToPayload {
  lat: number;
  lng: number;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

function MapCreate() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style:
        theme === "dark"
          ? "mapbox://styles/mapbox/navigation-night-v1"
          : "mapbox://styles/mapbox/standard",
      center: [106.7009, 10.7769], // default VN
      zoom: 10,
    });

    markerRef.current = new mapboxgl.Marker();

    const handleFlyTo = (e: Event) => {
      const event = e as CustomEvent<FlyToPayload>;
      const { lat, lng } = event.detail;

      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true,
      });

      markerRef.current?.setLngLat([lng, lat]).addTo(mapRef.current!);
    };

    window.addEventListener("map:flyTo", handleFlyTo);

    return () => {
      window.removeEventListener("map:flyTo", handleFlyTo);
      mapRef.current?.remove();
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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
    </div>
  );
}

export default MapCreate;
