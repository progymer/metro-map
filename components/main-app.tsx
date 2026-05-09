"use client";

import StationInput from "@/components/intput-area";
import RouteCard from "@/components/route-card";
import { Button } from "@/components/ui/button";
import { Station } from "@/data/stations";
import { findNearestStation } from "@/lib/nearest-station";
import { Navigation } from "lucide-react";
import { useState } from "react";

const MainApp = () => {
  const [from, setFrom] = useState<Station | null>(null);
  const [to, setTo] = useState<Station | null>(null);
  const [loadingGps, setLoadingGps] = useState(false);
  const [gpsSuggestion, setGpsSuggestion] = useState<Station | null>(null);
  const [showresult, setShowresult] = useState(false);

  const handleGps = () => {
    setLoadingGps(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestStation(
          pos.coords.latitude,
          pos.coords.longitude,
        );

        setGpsSuggestion(nearest);
        setLoadingGps(false);
      },
      () => setLoadingGps(false),
    );
  };

  const handleNearestStation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestStation(
          pos.coords.latitude,
          pos.coords.longitude,
        );

        // افتح Google Maps directions لأقرب محطة
        const url = `https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lng}&travelmode=walking`;
        window.open(url, "_blank");
      },
      (error) => {
        console.error("GPS Error:", error.message);
      },
    );
  };

  return (
    <div className="flex min-h-screen max-w-2xl w-full flex-col px-5 py-6">
      {/* CENTER AREA */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full flex flex-col gap-3">
          {/* FROM */}
          <StationInput
            label="from"
            value={from}
            onChange={setFrom}
            suggestion={gpsSuggestion}
          />

          <Button
            onClick={handleGps}
            disabled={loadingGps}
            variant="outline"
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {loadingGps ? "Getting location..." : "Use My Location"}
          </Button>

          {/* TO */}
          <StationInput label="to" value={to} onChange={setTo} />

          {/* ROUTE BUTTON */}
          <Button
            className="w-full"
            onClick={() => setShowresult((prev) => !prev)}
          >
            {showresult ? "hide" : "show"} route
          </Button>

          {/* RESULT */}
          {showresult && (
            <div className="mt-4">
              <RouteCard from={from} to={to} />
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM BUTTON */}
      <div className="mt-auto pt-4">
        <Button className="w-full" onClick={handleNearestStation}>
          take me to the nearest station
        </Button>
      </div>
    </div>
  );
};

export default MainApp;
