import * as inquirer from "inquirer";
import fetch from "node-fetch";
import * as prompt from "./prompt";

import { config } from "dotenv";
config();

import SetupMultipleAdminDatabases from "./SetupMultipleAdminDatabases";

import { BasicLocation, Location, Vendor } from "../db/tables";

import * as child_process from "child_process";
const exec = child_process.execSync;

let dbs = [];

/* tslint:disable:no-console */
//  Google Maps ---------------------------------------------------------{{{

const buildGoogleMapsUrl = (
  apiName: "geocode" | "place/details",
  values: Array<{ [key: string]: string }>,
): string => {
  let apiKey;

  switch (apiName) {
    case "geocode":
      apiKey = process.env.GOOGLE_MAPS_GEOCODE_API_KEY;
      break;
    case "place/details":
      apiKey = process.env.GOOGLE_MAPS_PLACES_API_KEY;
      break;
    default:
      console.error("Invalid api name");
  }
  const encodedValues = values
    .map(val => {
      const key = Object.keys(val)[0];
      return `${key}=${encodeURIComponent(val[key])}`;
    })
    .join("&");
  return `https://maps.googleapis.com/maps/api/${apiName}/json?&key=${apiKey}&${encodedValues}`;
};

const stringFormatObject = (input: object) => {
  const jsonSpaces = 2;
  return JSON.stringify(input, null, jsonSpaces);
};

const fetchGoogleMapsLocation = async (
  address: string,
  name: string,
): Promise<BasicLocation> => {
  const response = await fetch(
    buildGoogleMapsUrl("geocode", [{ address: `${name} ${address}` }]),
  );
  let googlePlaceId = parseGoogleMapsGeocodeResult(await response.json(), name);

  if (!googlePlaceId) {
    console.log(
      `Could not find location for ${name} and ${address}! Searching by address only. The result may be less accurate!`,
    );
    const justAddressResponse = await fetch(
      buildGoogleMapsUrl("geocode", [{ address }]),
    );
    googlePlaceId = parseGoogleMapsGeocodeResult(
      await justAddressResponse.json(),
      name,
    );
  }

  const placeDetailsResponse = await fetch(
    buildGoogleMapsUrl("place/details", [{ placeid: googlePlaceId }]),
  );
  return parseGoogleMapsPlaceDetailsResult(await placeDetailsResponse.json());
};

interface GoogleMapsCoords {
  lat: number;
  lng: number;
}

interface GoogleMapsApiAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleMapsApiGeocodeLocation {
  address_components: GoogleMapsApiAddressComponent[];
  formatted_address: string;
  geometry: {
    location: GoogleMapsCoords;
    location_type:
      | "ROOFTOP"
      | "RANGE_INTERPOLATED"
      | "GEOMETRIC_CENTER"
      | "APPROXIMATE";
    viewport: {
      northeast: GoogleMapsCoords;
      southwest: GoogleMapsCoords;
    };
  };
  place_id: string;
  types: string[];
}

type GoogleMapsApiStatusResponse =
  | "OK"
  | "ZERO_RESULTS"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "INVALID_REQUEST"
  | "UNKNOWN_ERROR";

interface GoogleMapsApiGeocodeResponse {
  results: GoogleMapsApiGeocodeLocation[];
  status: GoogleMapsApiStatusResponse;
}
interface GoogleMapsApiPlaceReview {
  aspects: Array<{ rating: number; type: string }>;
  author_name: string;
  author_url: string;
  language: string;
  rating: number;
  text: string;
  time: number;
}

interface GoogleMapsApiPlaceDetailLocation extends GoogleMapsApiGeocodeLocation {
  adr_address: string;
  formatted_phone_number: string;
  icon: string;
  id: string;
  international_phone_number: string;
  name: string;
  scope: string;
  alt_ids: Array<{ place_id: string; scope: string }>;
  rating: number;
  reference: string;
  reviews: GoogleMapsApiPlaceReview[];
  types: string[];
  url: string;
  vicinity: string;
  opening_hours: {
    open_now: boolean;
    periods: Array<{
      open: { day: number; time: number };
      close: { day: number; time: number };
    }>;
    weekday_text: string[];
  };
  website: string;
}

interface GoogleMapsApiPlaceDetailResponse {
  html_attributions: any[];
  result: GoogleMapsApiPlaceDetailLocation;
  status: GoogleMapsApiStatusResponse;
}

const parseGoogleMapsGeocodeResult = (
  json: GoogleMapsApiGeocodeResponse,
  name: string,
): string => {
  if (json.status === "OK") {
    const coords = json.results[0].geometry.location;
    const formattedAddress = json.results[0].formatted_address;
    const addressWithoutCountry = formattedAddress
      .split(",")
      .slice(0, -1)
      .join(",");
    return json.results[0].place_id;
  }
};

const parseGoogleMapsPlaceDetailsResult = (
  json: GoogleMapsApiPlaceDetailResponse,
): BasicLocation => {
  if (json.status === "OK") {
    const result = json.result;
    const formattedAddress = result.formatted_address
      .split(",")
      .slice(0, -1)
      .join(",");
    const sundayFirstTypicalHours = result.opening_hours.weekday_text
      .slice(-1)
      .concat(result.opening_hours.weekday_text.slice(0, -1));
    return {
      address: formattedAddress,
      googlePlaceId: result.place_id,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      name: result.name,
      phoneNumber: result.formatted_phone_number,
      typicalHours: sundayFirstTypicalHours,
      url: result.website,
      viewport: {
        northeast: {
          latitude: result.geometry.viewport.northeast.lat,
          longitude: result.geometry.viewport.northeast.lng,
        },
        southwest: {
          latitude: result.geometry.viewport.southwest.lat,
          longitude: result.geometry.viewport.southwest.lng,
        },
      },
    };
  }
};

//  End Google Maps -----------------------------------------------------}}}
//  Basic Location ------------------------------------------------------{{{

const getBasicLocation = async (
  locName?: string,
  locAddress?: string,
): Promise<BasicLocation> => {
  let locationName;
  let locationAddress;
  if (!locName && !locAddress) {
    locationName = await prompt.getStringUntilCorrect(
      "Enter the exact business name",
    );
    locationAddress = await prompt.getStringUntilCorrect(
      `Enter the address of ${locationName}`,
    );
  } else {
    locationName = locName;
    locationAddress = locAddress;
  }

  console.log("Searching for gps coordinates...");
  let basicLocation: BasicLocation;
  try {
    basicLocation = await fetchGoogleMapsLocation(
      locationAddress,
      locationName,
    );
    console.log(
      `Found gps coordinates for ${locationName}! ${basicLocation.latitude}, ${basicLocation.longitude}`,
    );
  } catch (e) {
    console.error("Error fetching basic location:", e);
    console.log(
      `Could not find ${locationName} in google maps. Please check location details and try again!`,
    );
    throw e;
  }
  return basicLocation;
};

//  End Basic Location --------------------------------------------------}}}
//  Add Location -------------------------------------------------------{{{

const promptAmOrPm = async () => {
  return await prompt.getChoice("am or pm", ["am", "pm"]);
};

const buildTypicalHours = (
  openHour: number,
  openPeriodOfDay: string,
  closeHour: number,
  closePeriodOfDay: string,
) => {
  const separator = "-";
  return `${openHour}${openPeriodOfDay} ${separator} ${closeHour}${closePeriodOfDay}`;
};

const promptTypicalHours = async (name: string) => {
  let typicalHours;
  while (true) {
    const openHour = await prompt.getInteger(
      `What time does ${name} typically open?`,
    );
    const openPOD = await promptAmOrPm();
    const closeHour = await prompt.getInteger(
      `What time does ${name} typically close?`,
    );
    const closePOD = await promptAmOrPm();
    typicalHours = buildTypicalHours(openHour, openPOD, closeHour, closePOD);
    const isCorrect = await prompt.confirm(`Is ${typicalHours} correct`);
    if (isCorrect) {
      break;
    }
  }
  return typicalHours;
};

const addLocation = async (basicLocation: BasicLocation) => {
  exec(
    `open "http://maps.google.com/?q=${basicLocation.latitude},${basicLocation.longitude}"`,
  );
  if (!await prompt.confirm("Does this location seem correct")) {
    process.exit();
  }

  for (const db of dbs) {
    const { vendor, vendorId } = await db.getVendorFromBasicLocation(
      basicLocation,
    );
    const loc = basicLocation;

    if (vendor) {
      console.log(
        `Cannot add location! ${loc.name} already exists in the database!`,
      );
    } else {
      await db.addLocation(loc);
      console.log(`'${loc.name}' successfully added to the database!`);
    }
  }
};

//  End Add Location ---------------------------------------------------}}}
//  Update Location ----------------------------------------------------{{{

const updateLocation = async () => {
  for (const db of dbs) {
    console.log("Enter the current (possibly old) business information");
    const basicLoc: BasicLocation = await getBasicLocation();

    const { vendor, vendorId } = await db.getVendorFromBasicLocation(basicLoc);

    if (!vendor) {
      console.log(
        `Cannot update location! ${basicLoc.name} does not exists in the database!`,
      );
    }

    const shouldUpdate = await prompt.confirm(
      `Does ${stringFormatObject(basicLoc)} look correct`,
    );
    if (shouldUpdate) {
      await db.updateLocation(basicLoc, vendor, vendorId, basicLoc);
      console.log("Location update complete!");
    }
  }

  // The code below is for manually updating the vendor location. It may need
  // to be reenabled in the future, thus the commented out code.

  // let loc = db.convertVendorToLocation(vendor);
  // const currentLoc = db.convertVendorToLocation(vendor);

  // if (!loc) {
  //   loc = db.convertVendorToLocation(vendor);
  // }

  // const updatableProps = {
  //   address: "Address",
  //   name: "Business Name",
  //   squareFootage: "Square Footage",
  //   typicalHours: "Typical Hours",
  // };

  // let newLoc: Location;

  // const propValues = Object.keys(updatableProps).map((key) => {
  //   return updatableProps[key];
  // });

  // let shouldUpdate;
  // while (true) {
  //   const propToUpdate = await prompt.getChoice("What would you like to update", propValues);

  //   let newProp = {};
  //   switch (propToUpdate) {
  //     case updatableProps.address:
  //       const newAddress = await prompt.getString("Enter the new address");
  //       const newBasicLocation = await getBasicLocation(loc.name, newAddress);
  //       newProp = Object.assign({}, newBasicLocation);
  //       break;
  //     case updatableProps.name:
  //       const newName = await prompt.getString("Enter new business name");
  //       newProp = Object.assign({}, newProp, {
  //         name: newName,
  //       });
  //       break;
  //     case updatableProps.squareFootage:
  //       const squareFootage = await prompt.getInteger("Enter the approximate square footage");
  //       newProp = Object.assign({}, newProp, {
  //         squareFootage,
  //       });
  //       break;
  //     default:
  //     case updatableProps.typicalHours:
  //       const newTypicalHours = await promptTypicalHours(loc.name);
  //       newProp = Object.assign({}, newProp, {
  //         typicalHours: newTypicalHours,
  //       });
  //       break;
  //   }

  //   newLoc = Object.assign({}, loc, newProp);
  //   shouldUpdate = await prompt.confirm(
  //     `Is ${stringFormatObject(newLoc)} fully updated and ready to write to the database`,
  //   );

  //   if (shouldUpdate) {
  //     break;
  //   }
  // }

  // // Guard against a forced exit
  // if (shouldUpdate) {
  //   await db.updateLocation(currentLoc, vendor, vendorId, newLoc);
  //   console.log("Location update complete!");
  // }
};

//  End Update Location ------------------------------------------------}}}
//  Update Square Footage -----------------------------------------------{{{

const updateSquareFootage = async (basicLocation: BasicLocation) => {
  for (const db of dbs) {
    const { vendor, vendorId } = await db.getVendorFromBasicLocation(
      basicLocation,
    );

    const newSquareFootage: number = await prompt.getIntegerUntilCorrect(
      `Enter the new square footage of ${basicLocation.name}`,
    );

    const updatedLocation = {
      ...basicLocation,
      squareFootage: newSquareFootage,
    };

    const shouldUpdate = await prompt.confirm(
      `Does ${stringFormatObject(updatedLocation)} look correct`,
    );
    if (shouldUpdate) {
      await db.updateLocation(
        updatedLocation,
        vendor,
        vendorId,
        updatedLocation,
      );
      console.log("Location update complete!");
    }
  }
};

//  End Update Square Footage -------------------------------------------}}}
//  Disable Purchasing -------------------------------------------------{{{

const disablePurchasingAtLocation = async (basicLocation: BasicLocation) => {
  for (const db of dbs) {
    const { vendor, vendorId } = await db.getVendorFromBasicLocation(
      basicLocation,
    );
    if (vendor && vendor.allowPurchasing) {
      await db.disablePurchasingAtLocation(vendor, vendorId);
      console.log(`Purchasing disabled @ ${vendor.name}`);
    } else {
      if (vendor && vendor.allowPurchasing === false) {
        console.log(`Purchasing is already disabled at ${basicLocation.name}`);
      } else {
        console.log(
          `Location "${basicLocation.name}" does not exist in the database!`,
        );
      }
    }
  }
};

//  End Disable Purchasing ---------------------------------------------}}}
//  Enable Purchasing --------------------------------------------------{{{

const enablePurchasingAtLocation = async (basicLocation: BasicLocation) => {
  for (const db of dbs) {
    const { vendor, vendorId } = await db.getVendorFromBasicLocation(
      basicLocation,
    );

    if (vendor.allowPurchasing) {
      console.log(
        `Location ${basicLocation.name} is already allowing purchasing`,
      );
      return;
    }

    if (vendor && vendorId) {
      await db.enablePurchasingAtLocation(vendor, vendorId);
      console.log(`Purchasing enabled @ ${vendor.name}`);
    } else {
      console.log(
        `Location at "${basicLocation.address}" does not exist in the database!`,
      );
    }
  }
};

//  End Enable Purchasing ----------------------------------------------}}}
//  Main ---------------------------------------------------------------{{{

const main = async () => {
  /* tslint:disable:object-literal-sort-keys */
  dbs = await SetupMultipleAdminDatabases();

  const locationActions = {
    addLocation: "Add Location",
    updateLocation: "Update Location",
    updateSquareFootage: "Update Square Footage of location",
    disablePurchasing: "Disable purchasing @ location",
    enablePurchasing: "Enable purchasing @ location",
  };

  const action = await prompt.getChoice(
    "Choose Action:",
    Object.keys(locationActions).map(key => {
      return locationActions[key];
    }),
  );

  switch (action) {
    case locationActions.addLocation:
      await addLocation(await getBasicLocation());
      return;
    case locationActions.updateLocation:
      await updateLocation();
      return;
    case locationActions.updateSquareFootage:
      await updateSquareFootage(await getBasicLocation());
      return;
    case locationActions.disablePurchasing:
      await disablePurchasingAtLocation(await getBasicLocation());
      return;
    case locationActions.enablePurchasing:
      await enablePurchasingAtLocation(await getBasicLocation());
      return;
    default:
      return;
  }
};

(async () => {
  await main();
  console.log("Press <C-c> to exit!");
})();

//  End Main -----------------------------------------------------------}}}
