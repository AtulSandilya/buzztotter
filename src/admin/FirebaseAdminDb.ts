import FirebaseDb from "../api/firebase/FirebaseDb";

import * as DbSchema from "../db/schema";

import {
  GetTimeNow,
} from "../CommonUtilities";

import {
  BasicLocation,
  Location,
  PurchasePackage,
  Vendor,
} from "../db/tables";

/* tslint:disable:member-ordering */
class FirebaseAdminDb extends FirebaseDb {
  constructor(db) {
    super(db);
  }

  private deleteNode = async (url: string) => {
    return await this.db.ref(url).remove();
  }
//  Location List -------------------------------------------------------{{{

  public addLocation = (inputLoc: Location) => {
    // TODO: ensure location does not already exist
    const vendor: Vendor = Object.assign({}, inputLoc, {
        allowPurchasing: true,
        dateCreated: GetTimeNow(),
        lastModified: GetTimeNow(),
    });

    const vendorId = this.pushNode(DbSchema.GetVendorPushDbUrl(), {
      address: inputLoc.address,
      latitude: inputLoc.latitude,
      longitude: inputLoc.longitude,
      metadata: vendor,
      name: inputLoc.name,
    });

    const loc = Object.assign({}, inputLoc, {
      vendorId,
    });

    const gpsCoordNodeIds = this.addLocationToGpsCoordNodes(loc, vendorId);
  }

  public updateLocation = async (
      currentLoc: Location,
      currentVendor: Vendor,
      vendorId: string,
      updatedLoc: Location,
    ) => {

    const updatedVendor = Object.assign({}, currentVendor, updatedLoc);
    updatedVendor.lastModified = GetTimeNow();

    this.addLocationToGpsCoordNodes(updatedLoc, vendorId, true);

    const vendorDbUrl = DbSchema.GetVendorDbUrl(vendorId);

    this.writeNode(vendorDbUrl + "/metadata", updatedVendor);
    this.writeNode(vendorDbUrl + "/name", updatedLoc.name);
    this.writeNode(vendorDbUrl + "/address", updatedLoc.address);
    this.writeNode(vendorDbUrl + "/latitude", updatedLoc.latitude);
    this.writeNode(vendorDbUrl + "/longitude", updatedLoc.longitude);
  }

  public disablePurchasingAtLocation = async (vendor: Vendor, vendorId: string) => {
    const newVendor = Object.assign({}, vendor);
    newVendor.lastModified = GetTimeNow();

    const gpsCoordNodeUrls = this.getGpsCoordNodeUrls(vendorId, newVendor);
    gpsCoordNodeUrls.map(async (urlList) => {
      await this.deleteNode(urlList.listUrl);
      this.updateNode(urlList.summaryUrl, (currentSummary) => {
        return Object.assign({}, currentSummary, {
          lastModified: GetTimeNow(),
          totalLocations: FirebaseDb.SafeSubtract(currentSummary.totalLocations, 1),
        }) ;
      });
    });

    newVendor.allowPurchasing = false;
    this.writeNode(DbSchema.GetVendorMetadataDbUrl(vendorId), newVendor);
  }

  public enablePurchasingAtLocation = (vendor: Vendor, vendorId: string) => {
    const loc: Location = this.convertVendorToLocation(vendor);
    loc.vendorId = vendorId;

    const gpsCoordNodeUrls = this.addLocationToGpsCoordNodes(loc, vendorId);

    vendor.allowPurchasing = true;
    vendor.lastModified = GetTimeNow();
    this.writeNode(DbSchema.GetVendorMetadataDbUrl(loc.vendorId), vendor);
  }

  public convertVendorToLocation = (vendor: Vendor): Location => {
    const result = Object.assign({}, vendor);
    delete result.allowPurchasing;
    delete result.dateCreated;
    delete result.lastModified;
    return result;
  }

  private getGpsCoordNodeUrls = (
    vendorId: string,
    vendor: Vendor | Location,
  ): Array<{listUrl: string, summaryUrl: string}> => {
    const gpsCoordNodeList = DbSchema.GetAllGpsCoordNodeUrls({
      latitude: vendor.latitude,
      longitude: vendor.longitude,
    });

    return gpsCoordNodeList.map((urlList) => {
      return Object.assign({}, urlList, {
        listUrl: urlList.listUrl +  "/" + vendorId,
      });
    });
  }

  private addLocationToGpsCoordNodes = (loc: Location, vendorId: string, isUpdating: boolean = false) => {
    this.getGpsCoordNodeUrls(vendorId, loc).map((urlList) => {
      this.writeNode(urlList.listUrl, loc);
      this.updateNode(urlList.summaryUrl, (currentSummary) => {
        return Object.assign({}, currentSummary, {
          lastModified: GetTimeNow(),
          totalLocations: FirebaseDb.SafeAdd(isUpdating ? 0 : 1, currentSummary.totalLocations),
        }) ;
      });
    });
  }

  private vendorMatchesBasicLocation = (vendor: Vendor, basicLocation: BasicLocation): boolean => {
    return (vendor.address === basicLocation.address) &&
           (vendor.latitude === basicLocation.latitude) &&
           (vendor.longitude === basicLocation.longitude);
  }

  public getVendorFromBasicLocation = async (
    basicLocation: BasicLocation,
  ): Promise<{vendor: Vendor, vendorId: string}> => {
    const vendorWithKey  = await this.queryInList(DbSchema.GetVendorPushDbUrl(), "address", basicLocation.address);

    if (vendorWithKey) {
      const matchingKeys = Object.keys(vendorWithKey).filter((key) => {
        const vendor: Vendor = vendorWithKey[key].metadata;
        return this.vendorMatchesBasicLocation(vendor, basicLocation);
      });

      if (matchingKeys.length === 1) {
        return {
          vendor: vendorWithKey[matchingKeys[0]].metadata,
          vendorId: matchingKeys[0],
        };
      } else if (matchingKeys.length > 1) {
        throw new Error(`Found multiple results at address ${basicLocation.address} with the same coordinates!`);
      }
    }

    return {
      vendor: undefined,
      vendorId: undefined,
    };
  }

//  End Location List ---------------------------------------------------}}}
//  Purchase Packages ---------------------------------------------------{{{

  public writePurchasePackage = async (purchasePackage: PurchasePackage[]) => {
    await this.writeNode(DbSchema.GetPurchasePackagesDbUrl(), purchasePackage);
  }

//  End Purchase Packages -----------------------------------------------}}}
}

export default FirebaseAdminDb;
