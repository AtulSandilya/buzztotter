import { DeviceLocation } from "./reducers/redeemView";

export const StringifyDate = (): string => {
  return (new Date().toJSON());
};

export const GetTimeNow = (): UnixTime => {
  // Milliseconds elapsed since UNIX epoch
  return Date.now();
};

export const LocationsMatch = (a: DeviceLocation, b: DeviceLocation, name: string): boolean => {
  // Meters
  const tolerance = 50;
  const metersBetweenPoints = HaversineFormula(a, b) * 1000;

  return tolerance > metersBetweenPoints;
};

// Returns the distance between two points in kilometers.
// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
const HaversineFormula = (a: DeviceLocation, b: DeviceLocation) => {
  const R = 6371; // Radius of the earth
  const deg2rad = (deg) => deg * (Math.PI / 180);

  const dLat = deg2rad(b.latitude - a.latitude);
  const dLong = deg2rad(b.longitude - a.longitude);

  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(a.latitude)) * Math.cos(deg2rad(b.latitude)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const z = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * z;
};

export const Pluralize = (input: number, suffix: string = "s"): string => {
  return input !== 1 ? suffix : "";
};
