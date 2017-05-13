Object.defineProperty(exports,"__esModule",{value:true});exports.GetAllGpsCoordNodeUrls=exports.GetGpsCoordNodeFullSummaryUrl=exports.GetLocationByDegreeUrl=exports.GetVendorRedeemListDbUrl=exports.GetVendorMetadataDbUrl=exports.GetVendorDbUrl=exports.GetVendorPushDbUrl=exports.GetRedeemTransactionStatusDbUrl=exports.GetPurchaseTransactionStatusDbUrl=exports.GetPurchasePackagesDbUrl=exports.GetStripeCustomerIdDbUrl=exports.GetPromoCodeSummaryDbUrl=exports.GetPromoCodeListDbUrl=exports.GetRedeemedBevegramSummaryDbUrl=exports.GetRedeemedBevegramListDbUrl=exports.GetReceivedBevegramSummaryDbUrl=exports.GetReceivedBevegramListDbUrl=exports.GetSentBevegramSummaryDbUrl=exports.GetSentBevegramListDbUrl=exports.GetPurchasedBevegramSummaryDbUrl=exports.GetPurchasedBevegramListDbUrl=exports.GetUserVerificationTokenDbUrl=exports.GetRedeemQueueUrl=exports.GetPurchaseQueueUrl=exports.GetUpdateDefaultCreditCardForCustomerUrl=exports.GetRemoveCreditCardFromCustomerQueueUrl=exports.GetAddCreditCardToCustomerQueueUrl=exports.GetFcmTokenDbUrl=exports.GetFirebaseIdDbUrl=exports.GetUserDbUrl=exports.GetSchemaDbUrl=undefined;var _extends2=require("babel-runtime/helpers/extends");var _extends3=_interopRequireDefault(_extends2);var _CommonUtilities=require("../CommonUtilities");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}


var Schema={
root:{
users:{
firebaseId:"User"},

firebaseIds:{
facebookId:"FirebaseId"},

fcmTokens:{
facebookId:"fcmToken"},

addCreditCardToCustomerQueue:{
uniqueId:"AddCreditCardToCustomerPackage"},

removeCreditCardFromCustomerQueue:{
uniqueId:"RemoveCreditCardFromCustomerPackage"},

updateDefaultCreditCardQueue:{
uniqueId:"UpdateDefaultCreditCardForCustomerPackageForQueue"},

purchaseQueue:{
uniqueId:"PurchasePackage"},

redeemQueue:{
uniqueId:"RedeemPackage"},

userVerificationTokens:{
userFirebaseId:"token"},

stripeCustomerIds:{
userFirebaseId:"stripeCustomerId"},

purchasePackages:"ArrayOfPurchasePackages",
promoCodes:{
promotionCode:{
summary:"PromoCodesSummary",
list:{
FirebaseUniqueTimeSortableId:"PromoCodePack"}}},



purchasedBevegrams:{
firebaseId:{
summary:"PurchasedBevegramSummary",
list:{
FirebaseUniqueTimeSortableId:"PurchasedBevegram"}}},



purchaseTransactionStatus:{
userFirebaseId:"PurchaseTransactionStatus"},

redeemTransactionStatus:{
userFirebaseId:"RedeemTransactionStatus"},

sentBevegrams:{
firebaseId:{
summary:"SentBevegramSummary",
list:{
FirebaseUniqueTimeSortableId:"SentBevegram"}}},



receivedBevegrams:{
firebaseId:{
summary:"ReceivedBevegramSummary",
list:{
FirebaseUniqueTimeSortableId:"ReceivedBevegram"}}},



redeemedBevegrams:{
firebaseId:{
summary:"RedeemedBevegramsSummary",
list:{
uniqueId:"RedeemedBevegram"}}},



allLocations:{
summary:{
totalLocations:"number"},

list:{
vendorId:"Location"}},



locationsByDegree:{
summary:{
totalLocations:"number"},

latitudeInDegrees:{
longitudeInDegrees:{
summary:{
totalLocations:"number"},

list:{
vendorId:"Location"}}}},





locationsByTenthOfDegree:{
summary:{
totalLocations:"number"},

latitudeInTenthOfDegrees:{
longitudeInTenthOfDegrees:{
summary:{
totalLocations:"number"},

list:{
id:"Location"}}}},





locationsByHundrethOfDegree:{
summary:{
totalLocations:"number"},

latitudeInHundrethOfDegrees:{
longitudeInHundrethOfDegrees:{
summary:{
totalLocations:"number"},

list:{
vendorId:"Location"}}}},




vendors:{
vendorId:{

name:"string",
address:"string",
latitude:"string",
longitude:"string",
metadata:"Vendor",
list:{
pushId:"RedeemedBevegram"}}}}};





var has=function has(obj,key){
var newObj=(0,_extends3.default)({},obj);
key.split(".").map(function(k){
if(newObj){
newObj=newObj[k];
}
});
return newObj;
};
var GetSchemaDbUrl=exports.GetSchemaDbUrl=function GetSchemaDbUrl(table,keysToReplace){
var urlSeparator="/";
var periodsRe=/\./g;

try{
var tableIsValid=has(Schema,"root."+table);
if(tableIsValid===undefined){
throw Error;
}
}
catch(e){
throw Error("Db Error: Table \""+table+"\" does not exist within the database schema!");
}
if(!keysToReplace){
return table.replace(periodsRe,urlSeparator);
}else
if(typeof keysToReplace==="object"){
var invalidKeyChars={
"\\.":"_",
"\\#":"!",
"\\$":"?",
"\\[":"{",
"\\]":"}"};

var newTable=table.replace(periodsRe,urlSeparator);
Object.keys(keysToReplace).map(function(k){
newTable=newTable.replace(k,keysToReplace[k]);
});
Object.keys(invalidKeyChars).map(function(key){
var regex=new RegExp(key,"g");
newTable=newTable.replace(regex,invalidKeyChars[key]);
});
return newTable;
}else
{
return[table,keysToReplace.replace(periodsRe,urlSeparator)].join(urlSeparator);
}
};
var GetUserDbUrl=exports.GetUserDbUrl=function GetUserDbUrl(firebaseId){
return GetSchemaDbUrl("users",firebaseId);
};
var GetFirebaseIdDbUrl=exports.GetFirebaseIdDbUrl=function GetFirebaseIdDbUrl(facebookId){
return GetSchemaDbUrl("firebaseIds.facebookId",{facebookId:facebookId});
};
var GetFcmTokenDbUrl=exports.GetFcmTokenDbUrl=function GetFcmTokenDbUrl(facebookId){
return GetSchemaDbUrl("fcmTokens.facebookId",{facebookId:facebookId});
};
var GetAddCreditCardToCustomerQueueUrl=exports.GetAddCreditCardToCustomerQueueUrl=function GetAddCreditCardToCustomerQueueUrl(){
return GetSchemaDbUrl("addCreditCardToCustomerQueue");
};
var GetRemoveCreditCardFromCustomerQueueUrl=exports.GetRemoveCreditCardFromCustomerQueueUrl=function GetRemoveCreditCardFromCustomerQueueUrl(){
return GetSchemaDbUrl("removeCreditCardFromCustomerQueue");
};
var GetUpdateDefaultCreditCardForCustomerUrl=exports.GetUpdateDefaultCreditCardForCustomerUrl=function GetUpdateDefaultCreditCardForCustomerUrl(){
return GetSchemaDbUrl("updateDefaultCreditCardQueue");
};
var GetPurchaseQueueUrl=exports.GetPurchaseQueueUrl=function GetPurchaseQueueUrl(){
return GetSchemaDbUrl("purchaseQueue");
};
var GetRedeemQueueUrl=exports.GetRedeemQueueUrl=function GetRedeemQueueUrl(){
return GetSchemaDbUrl("redeemQueue");
};
var GetUserVerificationTokenDbUrl=exports.GetUserVerificationTokenDbUrl=function GetUserVerificationTokenDbUrl(userFirebaseId){
return GetSchemaDbUrl("userVerificationTokens.userFirebaseId",{userFirebaseId:userFirebaseId});
};
var GetPurchasedBevegramListDbUrl=exports.GetPurchasedBevegramListDbUrl=function GetPurchasedBevegramListDbUrl(firebaseId){
return GetSchemaDbUrl("purchasedBevegrams.firebaseId.list",{firebaseId:firebaseId});
};
var GetPurchasedBevegramSummaryDbUrl=exports.GetPurchasedBevegramSummaryDbUrl=function GetPurchasedBevegramSummaryDbUrl(firebaseId){
return GetSchemaDbUrl("purchasedBevegrams.firebaseId.summary",{firebaseId:firebaseId});
};
var GetSentBevegramListDbUrl=exports.GetSentBevegramListDbUrl=function GetSentBevegramListDbUrl(firebaseId){
return GetSchemaDbUrl("sentBevegrams.firebaseId.list",{firebaseId:firebaseId});
};
var GetSentBevegramSummaryDbUrl=exports.GetSentBevegramSummaryDbUrl=function GetSentBevegramSummaryDbUrl(firebaseId){
return GetSchemaDbUrl("sentBevegrams.firebaseId.summary",{firebaseId:firebaseId});
};
var GetReceivedBevegramListDbUrl=exports.GetReceivedBevegramListDbUrl=function GetReceivedBevegramListDbUrl(firebaseId){
return GetSchemaDbUrl("receivedBevegrams.firebaseId.list",{firebaseId:firebaseId});
};
var GetReceivedBevegramSummaryDbUrl=exports.GetReceivedBevegramSummaryDbUrl=function GetReceivedBevegramSummaryDbUrl(firebaseId){
return GetSchemaDbUrl("receivedBevegrams.firebaseId.summary",{firebaseId:firebaseId});
};
var GetRedeemedBevegramListDbUrl=exports.GetRedeemedBevegramListDbUrl=function GetRedeemedBevegramListDbUrl(firebaseId){
return GetSchemaDbUrl("redeemedBevegrams.firebaseId.list",{firebaseId:firebaseId});
};
var GetRedeemedBevegramSummaryDbUrl=exports.GetRedeemedBevegramSummaryDbUrl=function GetRedeemedBevegramSummaryDbUrl(firebaseId){
return GetSchemaDbUrl("redeemedBevegrams.firebaseId.summary",{firebaseId:firebaseId});
};
var GetPromoCodeListDbUrl=exports.GetPromoCodeListDbUrl=function GetPromoCodeListDbUrl(promotionCode){
return GetSchemaDbUrl("promoCodes.promotionCode.list",{promotionCode:promotionCode});
};
var GetPromoCodeSummaryDbUrl=exports.GetPromoCodeSummaryDbUrl=function GetPromoCodeSummaryDbUrl(promotionCode){
return GetSchemaDbUrl("promoCodes.promotionCode.summary",{promotionCode:promotionCode});
};
var GetStripeCustomerIdDbUrl=exports.GetStripeCustomerIdDbUrl=function GetStripeCustomerIdDbUrl(userFirebaseId){
return GetSchemaDbUrl("stripeCustomerIds.userFirebaseId",{userFirebaseId:userFirebaseId});
};
var GetPurchasePackagesDbUrl=exports.GetPurchasePackagesDbUrl=function GetPurchasePackagesDbUrl(){
return GetSchemaDbUrl("purchasePackages");
};
var GetPurchaseTransactionStatusDbUrl=exports.GetPurchaseTransactionStatusDbUrl=function GetPurchaseTransactionStatusDbUrl(userFirebaseId){
return GetSchemaDbUrl("purchaseTransactionStatus.userFirebaseId",{userFirebaseId:userFirebaseId});
};
var GetRedeemTransactionStatusDbUrl=exports.GetRedeemTransactionStatusDbUrl=function GetRedeemTransactionStatusDbUrl(userFirebaseId){
return GetSchemaDbUrl("redeemTransactionStatus.userFirebaseId",{userFirebaseId:userFirebaseId});
};
var GetVendorPushDbUrl=exports.GetVendorPushDbUrl=function GetVendorPushDbUrl(){
return GetSchemaDbUrl("vendors");
};
var GetVendorDbUrl=exports.GetVendorDbUrl=function GetVendorDbUrl(vendorId){
return GetSchemaDbUrl("vendors.vendorId",{vendorId:vendorId});
};
var GetVendorMetadataDbUrl=exports.GetVendorMetadataDbUrl=function GetVendorMetadataDbUrl(vendorId){
return GetSchemaDbUrl("vendors.vendorId.metadata",{vendorId:vendorId});
};
var GetVendorRedeemListDbUrl=exports.GetVendorRedeemListDbUrl=function GetVendorRedeemListDbUrl(vendorId){
return GetSchemaDbUrl("vendors.vendorId.list",{vendorId:vendorId});
};

var GetLocationByDegreeUrl=exports.GetLocationByDegreeUrl=function GetLocationByDegreeUrl(lat,long,listOrSummary,decimalPlaces){
switch(decimalPlaces){
case 0:
return GetSchemaDbUrl("locationsByDegree.latitudeInDegrees.longitudeInDegrees."+listOrSummary,{latitudeInDegrees:lat,longitudeInDegrees:long});
case 1:
return GetSchemaDbUrl("locationsByTenthOfDegree.latitudeInTenthOfDegrees.longitudeInTenthOfDegrees."+listOrSummary,{latitudeInTenthOfDegrees:lat,longitudeInTenthOfDegrees:long});
case 2:
return GetSchemaDbUrl("locationsByHundrethOfDegree.latitudeInHundrethOfDegrees.longitudeInHundrethOfDegrees."+listOrSummary,{latitudeInHundrethOfDegrees:lat,longitudeInHundrethOfDegrees:long});
default:
console.error("Invalid decimal place");}

};
var GetGpsCoordNodeFullSummaryUrl=exports.GetGpsCoordNodeFullSummaryUrl=function GetGpsCoordNodeFullSummaryUrl(decimalPlaces){
switch(decimalPlaces){
default:
case 0:
return GetSchemaDbUrl("locationsByDegree.summary");
case 1:
return GetSchemaDbUrl("locationsByTenthOfDegree.summary");
case 2:
return GetSchemaDbUrl("locationsByHundrethOfDegree.summary");}

};
var GetAllGpsCoordNodeUrls=exports.GetAllGpsCoordNodeUrls=function GetAllGpsCoordNodeUrls(gpsCoords){
var gpsCoordNodeDataList=[
{decimalPlace:0},
{decimalPlace:1},
{decimalPlace:2}];

var list=gpsCoordNodeDataList.map(function(gpsCoordNodeData){
var formattedCoords=(0,_CommonUtilities.FormatGpsCoordinates)(gpsCoords,gpsCoordNodeData.decimalPlace);
return{
listUrl:GetLocationByDegreeUrl(formattedCoords.latitude,formattedCoords.longitude,"list",gpsCoordNodeData.decimalPlace),
summaryUrl:GetLocationByDegreeUrl(formattedCoords.latitude,formattedCoords.longitude,"summary",gpsCoordNodeData.decimalPlace)};

});
list.unshift({
listUrl:GetSchemaDbUrl("allLocations.list"),
summaryUrl:GetSchemaDbUrl("allLocations.summary")});


return list;
};