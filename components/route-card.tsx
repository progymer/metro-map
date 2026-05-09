import { Station, } from "@/data/stations"
import { findRoute, getStation } from "@/lib/bfs";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CircleDot, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import Pricing from "@/lib/pricing";
import calculateTime from "@/lib/timing";

interface RouteCardProps {
    from: Station | null;
    to: Station | null;
}

const RouteCard = ({from, to}: RouteCardProps) => {
    if(!from && !to){
        return (
          <Card className="w-full shadow-md">
            <CardHeader className="flex flex-row items-start space-x-4">
              <div className="grid gap-3 w-full">
                <div className="grid gap-1">
                  <CardTitle className="text-base font-bold">
                    Route Information Incomplete
                  </CardTitle>
                  <CardDescription className="text-sm">
                    We need both a starting point and a destination to plan your
                    trip.
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 py-2 border-t border-gray-300/50 mt-1">
                  <div className="flex items-center gap-3 text-sm text-slate-500 italic">
                    <CircleDot className="h-3 w-3" />
                    Starting point not set...
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 italic">
                    <MapPin className="h-3 w-3" />
                    Final destination not set...
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
    }
    
    if(!from){
        return (
          <Card className="w-full shadow-sm transition-all">
            <CardHeader className="flex flex-row items-start space-x-4">
              <div className="grid gap-1.5">
                <CardTitle className="text-base font-semibold leading-none">
                  Starting Point Required
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Please provide a starting location to calculate the route for
                  your trip.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        );
    }

    if(!to){
        return (
          <Card className="w-full shadow-sm">
            <CardHeader className="flex flex-row items-start space-x-4">
              <div className="grid gap-1">
                <CardTitle className="text-base font-semibold">
                  Destination Required
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Please specify a final destination to calculate your trip
                  itinerary.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        );
    }
    
    const route = findRoute(from.id, to.id)
    const ticketPrice = Pricing(route.totalStops)
    const duration = calculateTime(route.segments, route.transfers)

    const LINE_COLORS: Record<string, string> = {
      line1: "#2980b9",
      line2: "#c0392b",
      line3: "#27ae60",
    };

    return (
      <Card className="w-full shadow-sm mx-auto pb-0">
        <CardHeader>
          <CardAction>
            <Badge variant="secondary">{ticketPrice} EGP</Badge>
          </CardAction>
          <CardTitle>Destination: {to.name_en}</CardTitle>
          <CardDescription>trip details from: {from.name_en}</CardDescription>
        </CardHeader>
        <CardContent>
          {route.segments.map((segment, index) => {
            const direction = route.directions[index];
            const lineColor = LINE_COLORS[segment.line];
            const isTransfer = index > 0;

            return (
              <div key={index}>
                <div className="w-full">
                  {isTransfer && (
                    <div className="flex items-center gap-2 my-3">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        Transfer
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}
                  <span
                    className="border p-1 rounded-sm text-white text-xs"
                    style={{ backgroundColor: lineColor }}
                  >
                    {segment.line === "line1"
                      ? "Line 1"
                      : segment.line === "line2"
                        ? "Line 2"
                        : "Line 3"}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-sm mt-1">
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-70" />
                  <span className="text-muted-foreground">Direction:</span>
                  <span>{direction.toward}</span>
                </div>
                {segment.stations.map((stationId, stIdx) => {
                  const fullstation = getStation(stationId);
                  const isFirst = stIdx === 0;
                  const isLast = stIdx === segment.stations.length - 1;
                  const isEndpoint = isFirst || isLast;

                  return (
                    <div
                      key={stationId}
                      className="flex items-start gap-2 relative pl-6 min-h-7"
                    >
                      {/* Vertical track */}
                      {!isLast && (
                        <div
                          className="absolute left-2 top-2.5 h-full w-0.5 -translate-x-1/2"
                          style={{ backgroundColor: lineColor }}
                        />
                      )}

                      {/* Dot */}
                      <div
                        className="absolute top-1.5 left-2 -translate-x-1/2 rounded-full bg-background z-10 flex items-center justify-center"
                        style={{
                          width: isEndpoint ? 10 : 8,
                          height: isEndpoint ? 10 : 8,
                          border: `2px solid ${lineColor}`,
                        }}
                      />

                      <div className="flex items-center gap-1 leading-5 py-0.5">
                        <span
                          className={
                            isEndpoint
                              ? "font-medium text-sm"
                              : "text-sm text-muted-foreground"
                          }
                        >
                          {fullstation?.name_en}
                        </span>

                        {isFirst && index === 0 && (
                          <span className="text-[11px] text-muted-foreground/60">
                            • Start
                          </span>
                        )}

                        {isLast && index === route.segments.length - 1 && (
                          <span className="text-[11px] text-muted-foreground/60">
                            • Destination
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t bg-muted/50 px-6 py-3">
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Duration:
            </p>
            <div className="flex items-center font-semibold">
              {duration >= 60 ? (
                <span>
                  {duration >= 60 && `${Math.floor(duration / 60)}h `}
                  {duration % 60 > 0 && `${duration % 60}m`}
                </span>
              ) : (
                <span>{duration}m</span>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 pb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Stations:
            </p>
            <p className="font-semibold">{route.totalStops} Stations</p>
          </div>
        </CardFooter>
      </Card>
    );
}

export default RouteCard