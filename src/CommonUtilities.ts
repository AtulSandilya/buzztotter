import { GpsCoordinates, UnixTime } from "./db/tables";

export const StringifyDate = (): string => {
  return (new Date().toJSON());
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

export const FormatGpsCoordinates = (x: GpsCoordinates, places: number): {latitude: string, longitude: string} => {
  return {
    latitude: FormatFloat(x.latitude, places),
    longitude: FormatFloat(x.longitude, places),
  };
};

/* tslint:disable:no-magic-numbers */
export const LocationsAreCloseToEachOther = (a: GpsCoordinates, b: GpsCoordinates): boolean => {
  // Meters
  const tolerance = 50;
  const metersBetweenPoints = HaversineFormula(a, b) * 1000;

  return tolerance > metersBetweenPoints;
};

// Returns the distance between two points in kilometers.
// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
const HaversineFormula = (a: GpsCoordinates, b: GpsCoordinates): number => {
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

export const PrettyFormatAddress = (name: string, address: string): string => {
  const splitAddress = address.split(",");
  return [name, splitAddress[0], splitAddress[1]].join("\n");
};
