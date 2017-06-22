import { GpsCoordinates, LocationViewport, UnixTime } from "./db/tables";

export const StringifyDate = (): string => {
  return new Date().toJSON();
};

export const GetTimeNow = (): UnixTime => {
  // Milliseconds elapsed since UNIX epoch
  return Date.now();
};

// FormatFloat(37.682000, 2) => 37.68
// Don't use toFixed because there is no way always round down
const FormatFloat = (input: number, places: number): string => {
  const degreeAsString = input.toString();
  const decimalPos = degreeAsString.indexOf(".");
  if (places > 0) {
    // +1 accounts for the decimal place
    return degreeAsString.slice(0, decimalPos + places + 1);
  } else {
    return degreeAsString.slice(0, decimalPos);
  }
};

export const FormatGpsCoordinates = (
  x: GpsCoordinates,
  places: number,
): { latitude: string; longitude: string } => {
  return {
    latitude: FormatFloat(x.latitude, places),
    longitude: FormatFloat(x.longitude, places),
  };
};

const MetersToFeet = (meters: number): number => {
  const feetPerMeter = 3.28084;
  return meters * feetPerMeter;
};

export const PrettyFormatDistance = (distanceInMeters: number, units: "metric" | "imperial") => {
  switch (units) {
    case "metric":
      const metersPerKilometer = 1000;
      if (distanceInMeters > metersPerKilometer) {
        return `${(distanceInMeters / metersPerKilometer).toFixed(0)} km`;
      } else {
        return `${distanceInMeters.toFixed(0)} m`;
      }
    case "imperial":
      const feet = MetersToFeet(distanceInMeters);
      const feetPerMile = 5280;
      if (feet < feetPerMile) {
        // Prefix the distance with 0.
        return `0.${(feet / feetPerMile).toFixed(1)} miles`;
      } else {
        return `${(feet / feetPerMile).toFixed(1)} miles`;
      }
  }
};

export const CoordsAreWithinViewport = (
  coords: GpsCoordinates,
  viewport: LocationViewport,
): boolean => {
  const withinNortheast =
    coords.latitude < viewport.northeast.latitude &&
    coords.longitude < viewport.northeast.longitude;
  const withinSouthwest =
    coords.latitude > viewport.southwest.latitude &&
    coords.longitude > viewport.southwest.longitude;

  return withinNortheast && withinSouthwest;
};

const SquareFootageToRadius = (squareFootage: number): number => {
  return Math.sqrt(squareFootage) / Math.PI;
};

export const CoordsAreInRadius = (
  a: GpsCoordinates,
  b: GpsCoordinates,
  squareFootage: number,
) => {
  return MetersBetweenCoordinates(a, b) < SquareFootageToRadius(squareFootage);
};

// Returns the distance between two points in kilometers.
// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
/* tslint:disable:no-magic-numbers */
export const MetersBetweenCoordinates = (
  a: GpsCoordinates,
  b: GpsCoordinates,
): number => {
  const RadiusOfTheEarthInMeters = 6371 * 1000;
  const deg2rad = deg => deg * (Math.PI / 180);

  const dLat = deg2rad(b.latitude - a.latitude);
  const dLong = deg2rad(b.longitude - a.longitude);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(a.latitude)) *
      Math.cos(deg2rad(b.latitude)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const z = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return RadiusOfTheEarthInMeters * z;
};

export const Pluralize = (input: number, suffix: string = "s"): string => {
  return input !== 1 ? suffix : "";
};

export const PrettyFormatAddress = (name: string, address: string): string => {
  const splitAddress = address.split(",");
  return [name, splitAddress[0], splitAddress[1]].join("\n");
};
