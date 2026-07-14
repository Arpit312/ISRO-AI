"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, ImageOverlay, useMap, useMapEvents, Marker, Popup, LayersControl, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Loader2, Map as MapIcon, CloudOff, MousePointerClick, Crosshair, Navigation, Plus, Minus, Sparkles } from "lucide-react";

const { BaseLayer } = LayersControl;
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { API_BASE_URL, IS_MOCK_MODE } from "@/lib/api";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface OverlayData {
  url: string;
  bounds: L.LatLngBoundsExpression;
  qualityScore: string;
  cloudPct: string;
  lat: number;
  lng: number;
  isAIEnhanced?: boolean;
  aiMetrics?: {
    cloudType: string;
    physicsScore: number;
  };
  groundTruthUrl?: string | null;
}

function MapUpdater({ center }: { center: L.LatLngTuple | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 }); 
    }
  }, [center, map]);
  return null;
}

function BoundsUpdater({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { duration: 1.5, padding: [20, 20] });
    }
  }, [bounds, map]);
  return null;
}

function MapInteractionHandler({ onRightClick }: { onRightClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    contextmenu(e) {
      onRightClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function CoordinateTracker({ onUpdate }: { onUpdate: (lat: number, lng: number) => void }) {
  useMapEvents({
    mousemove(e) {
      onUpdate(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

function CustomMapControls({ onLocate }: { onLocate: () => void }) {
  const map = useMap();

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <div className="bg-[var(--color-surface)]/80 backdrop-blur-md rounded-lg shadow-lg border border-[var(--color-border)] p-1 flex flex-col">
        <button onClick={() => map.zoomIn()} className="p-2 hover:bg-[var(--color-primary-subtle)] text-[var(--color-text-primary)] rounded transition-colors" title="Zoom In">
          <Plus size={18} />
        </button>
        <div className="h-[1px] w-full bg-[var(--color-border)] my-1" />
        <button onClick={() => map.zoomOut()} className="p-2 hover:bg-[var(--color-primary-subtle)] text-[var(--color-text-primary)] rounded transition-colors" title="Zoom Out">
          <Minus size={18} />
        </button>
      </div>

      <button onClick={onLocate} className="bg-[var(--color-surface)]/80 backdrop-blur-md rounded-lg shadow-lg border border-[var(--color-border)] p-2 hover:bg-[var(--color-primary-subtle)] text-[var(--color-text-primary)] transition-colors mt-2" title="Locate Me">
        <Navigation size={18} className="text-[var(--color-primary)]" />
      </button>
    </div>
  );
}

export default function MapExplorer() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [overlay, setOverlay] = useState<OverlayData | null>(null);
  const [mapCenter, setMapCenter] = useState<L.LatLngTuple | null>(null);
  const [defaultCenter] = useState<L.LatLngTuple>([26.14, 91.73]); // Default: Guwahati
  const [mouseCoords, setMouseCoords] = useState<{ lat: number, lng: number } | null>(null);

  const toast = useToast();

  const handleAIEnhance = async () => {
    if (!overlay || !overlay.url) return;

    setIsEnhancing(true);
    toast.info("AI Initialization", "Sending composite to Nova-Sync Engine...");

    try {

      const response = await fetch(overlay.url);
      const blob = await response.blob();

      let data;
      if (IS_MOCK_MODE) {
        await new Promise(r => setTimeout(r, 2000));
        const mockImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        data = {
          status: "success",
          cloud_type_detected: "Thin Cirrus",
          physics_quality_score: 98.5,
          output_image: mockImageBase64
        };
      } else {
        const formData = new FormData();
        formData.append("file", blob, "composite.png");
        formData.append("month", (new Date().getMonth() + 1).toString());

        const aiRes = await fetch(`${API_BASE_URL}/api/v1/process`, {
          method: "POST",
          body: formData,
        });

        if (!aiRes.ok) throw new Error("AI Processing Failed");
        data = await aiRes.json();
      }

      if (data.status === "success") {
        setOverlay(prev => prev ? {
          ...prev,
          url: data.output_image,
          isAIEnhanced: true,
          aiMetrics: {
            cloudType: data.cloud_type_detected,
            physicsScore: data.physics_quality_score
          }
        } : null);
        toast.success("AI Enhancement Complete", "Neural network reconstruction successful.");
      } else {
        throw new Error(data.message || "Unknown AI error");
      }
    } catch (err: any) {
      toast.error("AI Error", err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          toast.success("Location Found", "Moved to your current location");
        },
        (error) => {
          toast.error("Location Error", error.message);
        }
      );
    } else {
      toast.error("Not Supported", "Geolocation is not supported by your browser");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    try {
      let lat, lon, display_name;

      if (IS_MOCK_MODE) {
        await new Promise(r => setTimeout(r, 800)); 
        lat = 26.14;
        lon = 91.73;
        display_name = query + " (Mocked Location)";
      } else {
        const geoRes = await fetch(`${API_BASE_URL}/api/geocode?q=${encodeURIComponent(query)}`);
        if (!geoRes.ok) {
          throw new Error("Location not found");
        }
        const data = await geoRes.json();
        lat = data.lat;
        lon = data.lon;
        display_name = data.display_name;
      }

      setMapCenter([lat, lon]);
      toast.success("Location Found", display_name);
      toast.info("Action Required", "Right-click anywhere on the map to fetch clear imagery.");

    } catch (err: any) {
      toast.error("Error", err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchClearImage = async (lat: number, lon: number) => {
    setIsFetchingImage(true);
    setOverlay(null);

    toast.info("Processing Request", "Initializing AI temporal compositor...");

    try {
      if (IS_MOCK_MODE) {
        await new Promise(r => setTimeout(r, 2000)); 
        const mockImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        const offset = 0.03;
        const bounds: L.LatLngBoundsExpression = [
          [lat - offset, lon - offset],
          [lat + offset, lon + offset],
        ];

        setOverlay({ 
          url: mockImageBase64, 
          bounds, 
          qualityScore: "95.5", 
          cloudPct: "10.2", 
          lat, 
          lng: lon,
          groundTruthUrl: null
        });
        toast.success("Imagery Loaded", "Cloud-free composite successfully generated.");
        setIsFetchingImage(false);
        return;
      }

      const imgRes = await fetch(`${API_BASE_URL}/api/clear-image?lat=${lat}&lon=${lon}`);

      if (!imgRes.ok) {
        const err = await imgRes.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail || "Failed to fetch image");
      }

      const bboxHeader = imgRes.headers.get("X-Bbox");
      const qualityScore = imgRes.headers.get("X-Quality-Score") || "N/A";
      const cloudPct = imgRes.headers.get("X-Latest-Cloud-Pct") || "N/A";
      const groundTruthUrl = imgRes.headers.get("X-Ground-Truth-Url");

      if (!bboxHeader) throw new Error("Missing bounding box data in response");

      const blob = await imgRes.blob();
      const imageUrl = URL.createObjectURL(blob);

      const [minLon, minLat, maxLon, maxLat] = bboxHeader.split(",").map(Number);
      const bounds: L.LatLngBoundsExpression = [
        [minLat, minLon],
        [maxLat, maxLon],
      ];

      setOverlay({ 
        url: imageUrl, 
        bounds, 
        qualityScore, 
        cloudPct, 
        lat, 
        lng: lon,
        groundTruthUrl: groundTruthUrl !== "N/A" ? groundTruthUrl : null
      });
      toast.success("Imagery Loaded", "Cloud-free composite successfully generated.");

    } catch (err: any) {
      toast.error("Generation Failed", err.message);
    } finally {
      setIsFetchingImage(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center text-[var(--color-primary)]">
            <MousePointerClick size={20} />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[var(--color-text-primary)]">Fast Interactive Search</h2>
            <p className="text-[12px] text-[var(--color-text-secondary)]">Search & Right-Click on Map</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex w-full max-w-[400px] gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a place (e.g., Guwahati)..."
              disabled={isSearching || isFetchingImage || isEnhancing}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)]",
                "bg-[var(--color-bg)] border border-[var(--color-border)]",
                "text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]",
                "focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
                "transition-all outline-none disabled:opacity-50"
              )}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={isSearching}
            disabled={!query.trim() || isFetchingImage || isEnhancing}
          >
            Locate
          </Button>
        </form>
      </div>

      {}
      <div className="relative flex-1 rounded-[var(--radius-xl)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg)] min-h-[500px]">
        {}
        {(isSearching || isFetchingImage || isEnhancing) && (
          <div className="absolute inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] flex flex-col items-center gap-4 animate-scale-in">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-[var(--color-surface-elevated)]" />
                <div className="w-12 h-12 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin absolute inset-0" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-bold text-[var(--color-text-primary)]">
                  {isEnhancing ? "Nova-Sync AI Processing" : isFetchingImage ? "Reconstructing Surface" : "Proxying Coordinates"}
                </p>
                <p className="text-[12px] text-[var(--color-text-secondary)] mt-1">
                  {isEnhancing ? "Running Diffusion & Shadow Correction..." : isFetchingImage ? "Fast-path temporal compositing active..." : "Querying Nominatim..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {}
        <MapContainer
          center={defaultCenter}
          zoom={6}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          zoomControl={false}
        >
          <LayersControl position="topleft">
            <BaseLayer checked name="Street Map (OSM)">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            </BaseLayer>
            <BaseLayer name="Satellite View">
              <TileLayer
                attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </BaseLayer>
            <BaseLayer name="Dark Mode">
              <TileLayer
                attribution='&copy; <a href="https://www.carto.com/">CartoDB</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                maxZoom={19}
              />
            </BaseLayer>
          </LayersControl>

          <CoordinateTracker onUpdate={(lat, lng) => setMouseCoords({ lat, lng })} />
          <CustomMapControls onLocate={handleLocateMe} />

          <MapInteractionHandler onRightClick={fetchClearImage} />

          <MapUpdater center={mapCenter} />
          <BoundsUpdater bounds={overlay ? overlay.bounds : null} />

          {overlay && (
            <>
              <ImageOverlay url={overlay.url} bounds={overlay.bounds} opacity={1} />
              <Rectangle bounds={overlay.bounds} pathOptions={{ color: "var(--color-primary)", weight: 2, fill: false, dashArray: "5 5" }} />

              {}
              <Marker position={[overlay.lat, overlay.lng]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold text-[13px] mb-1">Generated Center</p>
                    <p className="text-[11px] text-gray-500">
                      {overlay.lat.toFixed(4)}, {overlay.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>

        {}
        {overlay && (
          <div className="absolute bottom-6 left-6 z-[1000] flex flex-col gap-4">
            <div className="bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)] p-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] animate-fade-in-up min-w-[220px]">
              <div className="flex items-center gap-2 mb-3">
                {overlay.isAIEnhanced ? (
                  <Sparkles size={16} className="text-[#a855f7]" />
                ) : (
                  <CloudOff size={16} className="text-[var(--color-primary)]" />
                )}
                <h3 className="text-[13px] font-bold text-[var(--color-text-primary)]">
                  {overlay.isAIEnhanced ? "Nova-Sync AI Results" : "Composite Quality"}
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                {!overlay.isAIEnhanced ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[12px] text-[var(--color-text-secondary)]">Clear Pixels:</span>
                      <Badge variant="success" size="sm">{overlay.qualityScore}%</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[12px] text-[var(--color-text-secondary)]">Single-date Cloud:</span>
                      <Badge variant="warning" size="sm">{overlay.cloudPct}%</Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[12px] text-[var(--color-text-secondary)]">Physics Score:</span>
                      <Badge variant="success" size="sm">{(overlay.aiMetrics?.physicsScore || 0).toFixed(1)}%</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[12px] text-[var(--color-text-secondary)]">Cloud Type:</span>
                      <Badge variant="default" size="sm" className="truncate max-w-[100px]" title={overlay.aiMetrics?.cloudType}>
                        {overlay.aiMetrics?.cloudType}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>

            {!overlay.isAIEnhanced && (
              <Button
                onClick={handleAIEnhance}
                disabled={isEnhancing}
                style={{
                  background: 'linear-gradient(to right, #6366f1, #a855f7)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)',
                }}
                className="w-full flex items-center justify-center py-2.5 rounded-[var(--radius-md)] animate-fade-in-up hover:opacity-90 transition-opacity"
              >
                <Sparkles size={16} className="mr-2" />
                Enhance with AI
              </Button>
            )}
          </div>
        )}

        {}
        {mouseCoords && (
          <div className="absolute bottom-6 right-6 z-[1000] bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)] px-3 py-2 rounded-full shadow-[var(--shadow-sm)] flex items-center gap-2 pointer-events-none animate-fade-in-up">
            <Crosshair size={14} className="text-[var(--color-primary)]" />
            <span className="text-[12px] font-mono text-[var(--color-text-secondary)]">
              {mouseCoords.lat.toFixed(5)}, {mouseCoords.lng.toFixed(5)}
            </span>
          </div>
        )}

        {}
        <div className="absolute bottom-6 right-1/2 translate-x-1/2 z-[1001] pointer-events-none">
          <AnimatePresence>
            {(overlay || isFetchingImage) && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="flex gap-6 p-4 bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl pointer-events-auto"
              >

                {}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-blue-300 mb-2 tracking-wider uppercase">NOVA-SYNC Output</span>
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-blue-500/50 relative">
                    {isFetchingImage ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-blue-400">
                        <svg className="animate-spin w-8 h-8 mb-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-[9px] font-bold animate-pulse tracking-widest text-center">GENERATING<br/>COMPOSITE...</span>
                      </div>
                    ) : (
                      <>
                        <img src={overlay?.url} alt="Satellite Clear" className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow-md">AI Cleared</div>
                      </>
                    )}
                  </div>
                </div>

                {}
                <div className="w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

                {}
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-bold text-emerald-300 mb-2 tracking-wider uppercase">Ground Truth</span>
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-emerald-500/50 relative group">
                    {isFetchingImage ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 text-emerald-400">
                        <svg className="animate-spin w-8 h-8 mb-3 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-[9px] font-bold animate-pulse tracking-widest text-center">SCANNING<br/>TERRAIN...</span>
                      </div>
                    ) : overlay?.groundTruthUrl ? (
                      <>
                        <img src={overlay.groundTruthUrl} alt="Street View" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        {}
                        <div className="absolute top-1 right-1 bg-emerald-500 flex items-center gap-1 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow-md">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          Verified
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-gray-400 p-2 text-center">
                        <svg className="w-6 h-6 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        <span className="text-[9px]">No street view</span>
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
