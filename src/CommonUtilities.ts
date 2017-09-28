import {
  DEFAULT_SQUARE_FOOTAGE,
  GpsCoordinates,
  LocationViewport,
  UnixTime,
} from "./db/tables";

export const assertNever = (x?: never): never => {
  if (x) {
    throw new Error("Unexpected object: " + x);
  } else {
    throw new Error("Unexpected never");
  }
};

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

type DistanceUnits = "metric" | "imperial";

export const PrettyFormatDistance = (
  distanceInMeters: number,
  units: DistanceUnits,
  squareFootage: number = DEFAULT_SQUARE_FOOTAGE,
  youAreHereText?: string,
): string => {
  if (distanceInMeters === undefined) {
    return "?";
  }

  let prettyDistance: string;
  let prettyUnit: string;
  const postfix = "away";

  const squareFootageRadius = SquareFootageToRadius(squareFootage);
  if (distanceInMeters < squareFootageRadius) {
    return youAreHereText !== undefined ? youAreHereText : "You are here";
  }

  switch (units) {
    case "metric":
      const metersPerKilometer = 1000;
      if (distanceInMeters > metersPerKilometer) {
        prettyUnit = "km";
        prettyDistance = (distanceInMeters / metersPerKilometer).toFixed(0);
      } else {
        prettyUnit = "m";
        prettyDistance = distanceInMeters.toFixed(0);
      }

      return `${prettyDistance} ${prettyUnit} ${postfix}`;
    case "imperial":
      const feet = MetersToFeet(distanceInMeters);
      const feetPerMile = 5280;
      const feetDetailThreshold = 10;
      const showAsFeet = feetPerMile / feetDetailThreshold;
      const showWithOneDecimal = feetPerMile * feetDetailThreshold;
      if (feet < showAsFeet) {
        prettyDistance = feet.toFixed(0);
        prettyUnit = prettyDistance === "1" ? "foot" : "feet";
      } else if (feet < showWithOneDecimal) {
        prettyDistance = (feet / feetPerMile).toFixed(1);
        prettyDistance = prettyDistance === "1.0" ? "1" : prettyDistance;
        prettyUnit = prettyDistance === "1" ? "mile" : "miles";
      } else {
        prettyUnit = "miles";
        prettyDistance = (feet / feetPerMile).toFixed(0);
      }

      return `${prettyDistance} ${prettyUnit} ${postfix}`;
  }

  return "?";
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

export const SquareFootageToRadius = (squareFootage: number): number => {
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
  const deg2rad = (deg: number) => deg * (Math.PI / 180);

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

export const Capitalize = (input: string): string => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const PrettyFormatAddress = (
  address: string,
  businessName?: string,
): string => {
  const splitAddress = address.split(",");
  const firstPart = splitAddress[0];
  const remaining = splitAddress.slice(1).join(",");
  return `${businessName ? businessName + "\n" : ""}${firstPart}\n${remaining}`;
};

export const ParseIntAsDecimal = (input: string): number => {
  const decimalBase = 10;
  return parseInt(input, decimalBase);
};

export const PrettyFormatCentsToDollars = (cents: number): string => {
  const centsPerDollar = 100;
  const decimalPlaces = 2;
  return `$${(cents / centsPerDollar).toFixed(decimalPlaces)}`;
};

export const PrettyFormatFullName = (fullName: string) => {
  const nameParts = fullName.split(" ");

  if (nameParts.length === 2) {
    return fullName;
  }

  if (nameParts[0].length <= 1) {
    return `${nameParts[0]} ${nameParts[1]} ${nameParts.slice(-1)}`;
  } else {
    return `${nameParts[0]} ${nameParts.slice(-1)}`;
  }
};
