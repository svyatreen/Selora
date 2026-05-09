import { useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";

function buildOsmStyle(): maplibregl.StyleSpecification {
  return {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "osm",
        type: "raster",
        source: "osm",
        paint: {},
      },
    ],
  };
}

interface HotelLocationMapProps {
  hotelName: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
}

export function HotelLocationMap({
  hotelName,
  address,
  city,
  latitude,
  longitude,
}: HotelLocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const osmStyle = useMemo(() => buildOsmStyle(), []);
  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  useEffect(() => {
    if (!hasCoordinates) return;
    if (!containerRef.current) return;

    const lat = latitude;
    const lng = longitude;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: osmStyle,
        center: [lng, lat],
        zoom: 14,
        attributionControl: true,
        scrollZoom: false,
      });

      mapRef.current = map;

      map.on("load", () => {
        if (!markerRef.current) {
          markerRef.current = new maplibregl.Marker({ color: "#7C3AED" })
            .setLngLat([lng, lat])
            .addTo(map);
        }

        map.easeTo({ center: [lng, lat], zoom: 14, duration: 500 });
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
    } else {
      markerRef.current?.setLngLat([lng, lat]);
      mapRef.current.easeTo({ center: [lng, lat], zoom: 14, duration: 400 });
      mapRef.current.resize();
    }
  }, [hasCoordinates, latitude, longitude, osmStyle]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 bg-card shadow-sm">
      <div className="relative">
        <div ref={containerRef} className="h-[340px] md:h-[420px] w-full" />

        <div className="absolute left-4 right-4 top-4 z-10 pointer-events-none">
          <div className="inline-flex items-start gap-3 bg-black/45 text-white backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
            <MapPin className="h-5 w-5 mt-0.5" />
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{hotelName}</div>
              <div className="text-xs opacity-80 truncate">
                {address}, {city}
              </div>
            </div>
          </div>
        </div>

        {!hasCoordinates && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-background/70">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="mt-3 font-medium text-foreground">Для этого отеля ещё не сохранены координаты.</div>
              <div className="mt-1 text-sm text-muted-foreground">После обновления данных карта появится автоматически.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

