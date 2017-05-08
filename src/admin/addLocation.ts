import * as inquirer from "inquirer";
import fetch from "node-fetch";
import * as prompt from "./prompt";

import {config} from "dotenv";
config();

import SetupAdminDb from "../firebaseServer/SetupAdminDb";
import FirebaseAdminDb from "./FirebaseAdminDb";

import {
  BasicLocation,
  Location,
  Vendor,
} from "../db/tables";

import * as child_process from "child_process";
const exec = child_process.execSync;

const db = new FirebaseAdminDb(SetupAdminDb());

/* tslint:disable:no-console */
//  Google Maps ---------------------------------------------------------{{{

const buildGoogleMapsUrl = (address: string, name?: string) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";
  return `${baseUrl}?address=${encodeURIComponent((name ? name + " " : "") + address)}&key=${apiKey}`;
};

const stringFormatObject = (input: object) => {
  const jsonSpaces = 2;
  return JSON.stringify(input, null, jsonSpaces);
};

const fetchGoogleMapsLocation = async (address: string, name: string): Promise<BasicLocation> => {
  const response = await fetch(buildGoogleMapsUrl(address, name));
  const locationByNameAndAddress = parseGoogleMapsLocation(await response.json(), name);

  if (locationByNameAndAddress) {
    return locationByNameAndAddress;
  } else {
    console.log(
      `Could not find location for ${name} and ${address}! Searching by address only. The result may be less accurate!`,
    );
    const justAddressResponse = await fetch(buildGoogleMapsUrl(address));
    const justAddressLocation = parseGoogleMapsLocation(await justAddressResponse.json(), name);

    if (justAddressLocation) {
      return justAddressLocation;
    }
  }

};

const parseGoogleMapsLocation = (json: any, name: string): BasicLocation => {
  if (json.status === "OK") {
    const coords = json.results[0].geometry.location;
    const formattedAddress = json.results[0].formatted_address;
    const addressWithoutCountry = formattedAddress.split(",").slice(0, -1).join(",");
    return {
      address: addressWithoutCountry,
      latitude: coords.lat,
      longitude: coords.lng,
      name,
    };
  }
};

//  End Google Maps -----------------------------------------------------}}}
//  Basic Location ------------------------------------------------------{{{

const getBasicLocation = async (locName?: string, locAddress?: string): Promise<BasicLocation> => {
  let locationName;
  let locationAddress;
  if (!locName && !locAddress) {
    locationName = await prompt.getStringUntilCorrect("Enter the exact business name");
    locationAddress = await prompt.getStringUntilCorrect(`Enter the address of ${locationName}`);
  } else {
    locationName = locName;
    locationAddress = locAddress;
  }

  console.log("Searching for gps coordinates...");
  let basicLocation: BasicLocation;
  try {
    basicLocation = await fetchGoogleMapsLocation(locationAddress, locationName);
    console.log(`Found gps coordinates for ${locationName}! ${basicLocation.latitude}, ${basicLocation.longitude}`);
  } catch (e) {
    console.log(`Could not find ${locationName} in google maps. Please check location details and try again!`);
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
    const openHour = await prompt.getInteger(`What time does ${name} typically open?`);
    const openPOD = await promptAmOrPm();
    const closeHour = await prompt.getInteger(`What time does ${name} typically close?`);
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
  exec(`open "http://maps.google.com/?q=${basicLocation.latitude},${basicLocation.longitude}"`);
  if (!await prompt.confirm("Does this location seem correct")) {
    process.exit();
  }

  const typicalHours = await promptTypicalHours(basicLocation.name);

  const loc: Location = Object.assign({}, basicLocation, {
    typicalHours,
  });

  const {vendor, vendorId} = await db.getVendorFromBasicLocation(basicLocation);

  if (vendor) {
    console.log(`Cannot add location! ${loc.name} already exists in the database!`);
  } else {
    await db.addLocation(loc);
    console.log(`'${loc.name}' successfully added to the database!`);
  }
};

//  End Add Location ---------------------------------------------------}}}
//  Update Location ----------------------------------------------------{{{

const updateLocation = async () => {
  console.log("Enter the current (possibly old) business information");
  const basicLoc: BasicLocation = await getBasicLocation();

  const {vendor, vendorId} = await db.getVendorFromBasicLocation(basicLoc);

  if (!vendor) {
    console.log(`Cannot update location! ${basicLoc.name} does not exists in the database!`);
  }

  let loc = db.convertVendorToLocation(vendor);
  const currentLoc = db.convertVendorToLocation(vendor);

  if (!loc) {
    loc = db.convertVendorToLocation(vendor);
  }

  const updatableProps = {
    address: "Address",
    name: "Business Name",
    squareFootage: "Square Footage",
    typicalHours: "Typical Hours",
  };

  let newLoc: Location;

  const propValues = Object.keys(updatableProps).map((key) => {
    return updatableProps[key];
  });

  let shouldUpdate;
  while (true) {
    const propToUpdate = await prompt.getChoice("What would you like to update", propValues);

    let newProp = {};
    switch (propToUpdate) {
      case updatableProps.address:
        const newAddress = await prompt.getString("Enter the new address");
        const newBasicLocation = await getBasicLocation(loc.name, newAddress);
        newProp = Object.assign({}, newBasicLocation);
        break;
      case updatableProps.name:
        const newName = await prompt.getString("Enter new business name");
        newProp = Object.assign({}, newProp, {
          name: newName,
        });
        break;
      case updatableProps.squareFootage:
        const squareFootage = await prompt.getInteger("Enter the approximate square footage");
        newProp = Object.assign({}, newProp, {
          squareFootage,
        });
        break;
      default:
      case updatableProps.typicalHours:
        const newTypicalHours = await promptTypicalHours(loc.name);
        newProp = Object.assign({}, newProp, {
          typicalHours: newTypicalHours,
        });
        break;
    }

    newLoc = Object.assign({}, loc, newProp);
    shouldUpdate = await prompt.confirm(
      `Is ${stringFormatObject(newLoc)} fully updated and ready to write to the database`,
    );

    if (shouldUpdate) {
      break;
    }
  }

  // Guard against a forced exit
  if (shouldUpdate) {
    await db.updateLocation(currentLoc, vendor, vendorId, newLoc);
    console.log("Location update complete!");
  }
};

//  End Update Location ------------------------------------------------}}}
//  Disable Purchasing -------------------------------------------------{{{

const disablePurchasingAtLocation = async (basicLocation: BasicLocation) => {
  const {vendor, vendorId} = await db.getVendorFromBasicLocation(basicLocation);
  if (vendor && vendor.allowPurchasing) {
    await db.disablePurchasingAtLocation(vendor, vendorId);
    console.log(`Purchasing disabled @ ${vendor.name}`);
  } else {
    if (vendor && (vendor.allowPurchasing === false)) {
      console.log(`Purchasing is already disabled at ${basicLocation.name}`);
    } else {
      console.log(`Location "${basicLocation.name}" does not exist in the database!`);
    }
  }
};

//  End Disable Purchasing ---------------------------------------------}}}
//  Enable Purchasing --------------------------------------------------{{{

const enablePurchasingAtLocation = async (basicLocation: BasicLocation) => {
  const {vendor, vendorId} = await db.getVendorFromBasicLocation(basicLocation);

  if (vendor.allowPurchasing) {
    console.log(`Location ${basicLocation.name} is already allowing purchasing`);
    return;
  }

  if (vendor && vendorId) {
    await db.enablePurchasingAtLocation(vendor, vendorId);
    console.log(`Purchasing enabled @ ${vendor.name}`);
  } else {
    console.log(`Location at "${basicLocation.address}" does not exist in the database!`);
  }
};

//  End Enable Purchasing ----------------------------------------------}}}
//  Main ---------------------------------------------------------------{{{

const main = async () => {
  /* tslint:disable:object-literal-sort-keys */
  const locationActions = {
    addLocation: "Add Location",
    updateLocation: "Update Location",
    disablePurchasing: "Disable purchasing @ location",
    enablePurchasing: "Enable purchasing @ location",
  };

  const action = await prompt.getChoice("Choose Action:", Object.keys(locationActions).map((key) => {
    return locationActions[key];
  }));

  switch (action) {
    case locationActions.addLocation:
      await addLocation(await getBasicLocation());
      return;
    case locationActions.updateLocation:
      await updateLocation();
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
