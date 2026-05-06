import { stations, Station } from "@/data/stations";


function getDistanceInKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestStation(userLat: number, userLng: number): Station {
  let nearestStation = stations[0];
  let shortestDistance = Infinity;

  for (const station of stations) {
    const distance = getDistanceInKm(
      userLat,
      userLng,
      station.lat,
      station.lng,
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestStation = station;
    }
  }

  return nearestStation;
}
