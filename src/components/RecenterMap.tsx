import { useEffect } from "react";
import { useMap } from "react-leaflet";

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), {
      duration: 1.5,
    });
  }, [lat, lng, map]);

  return null;
};

export default RecenterMap;
