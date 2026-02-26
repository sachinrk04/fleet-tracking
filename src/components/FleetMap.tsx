import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Vehicle } from "../types/models";

export const FleetMap: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
  const center = vehicles.length
    ? [
        vehicles[0].currentLocation?.lat ?? 40.7128,
        vehicles[0].currentLocation?.lng ?? -74.006,
      ]
    : [40.7128, -74.006];

  return (
    <div className="w-full overflow-hidden border h-[60vh] rounded-md">
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {vehicles.map((v) =>
          v.currentLocation ? (
            <Marker
              key={v.id}
              position={[v.currentLocation.lat, v.currentLocation.lng]}
            >
              <Popup>
                <div>
                  <strong>{v.registration}</strong>
                  <div>Type: {v.type}</div>
                  <div>Status: {v.status}</div>
                </div>
              </Popup>
            </Marker>
          ) : null,
        )}
      </MapContainer>
    </div>
  );
};

export default FleetMap;
