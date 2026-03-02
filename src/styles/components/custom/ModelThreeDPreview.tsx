"use client";
import "@google/model-viewer";

export default function ModelThreeDPreview({ url }: { url: string }) {
  return (
    <model-viewer
      src={url}
      camera-controls
      auto-rotate
      style={{ width: "100%", height: "200px" }}
    />
  );
}
