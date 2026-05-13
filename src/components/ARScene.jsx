import { useEffect } from "react";

export default function ARScene({ onMarkerFound }) {
  useEffect(() => {
    const handler = (e) => onMarkerFound(e.detail);
    window.addEventListener("arMarkerFound", handler);
    return () => window.removeEventListener("arMarkerFound", handler);
  }, [onMarkerFound]);

  return null;
}
