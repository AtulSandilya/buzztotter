Object.defineProperty(exports,"__esModule",{value:true});exports.GetRedeemedBevegramUserListDbUrl=exports.GetRedeemedBevegramUserDbUrl=exports.GetRedeemedBevegramVendorCustomerDbUrl=exports.GetRedeemedBevegramVendorDbUrl=exports.GetReceivedBevegramSummaryDbUrl=exports.GetReceivedBevegramListDbUrl=exports.GetSentBevegramSummaryDbUrl=exports.GetSentBevegramListDbUrl=exports.GetPurchasedBevegramSummaryDbUrl=exports.GetPurchasedBevegramListDbUrl=exports.GetNotificationQueueUrl=exports.GetFcmTokenDbUrl=exports.GetFirebaseIdDbUrl=exports.GetVendorDbUrl=exports.GetUserDbUrl=exports.GetSchemaDbUrl=undefined;var _lodash=require("lodash");var _lodash2=_interopRequireDefault(_lodash);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}


var Schema={
root:{
users:{
firebaseId:"User"},

firebaseIds:{
facebookId:"FirebaseId"},

fcmTokens:{
facebookId:"fcmToken"},

vendors:{
vendorId:"Vendor"},

queue:{
uniqueId:"NotificationPackage"},

purchasedBevegrams:{
firebaseId:{
summary:"PurchasedBevegramSummary",
list:{
FirebaseUniqueTimeSortableId:"PurchasedBevegram"}}},



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
vendors:{
vendorId:{

ledger:{
bevegramList:{
FirebaseUniqueTimeSortableId:"RedeemedBevegram"},

customerList:{

firebaseId:true}}}},




users:{
firebaseId:{
FirebaseUniqueTimeSortableId:"RedeemedBevegram"}}}}};





var GetSchemaDbUrl=exports.GetSchemaDbUrl=function GetSchemaDbUrl(table,key){
var urlSeparator="/";
var periodsRe=/\./g;

if(_lodash2.default.has(Schema,["root",table].join("."))){
if(!key){
return table.replace(periodsRe,urlSeparator);
}


if(typeof key==="object"){var _ret=function(){
var newTable=table;
Object.keys(key).map(function(k){
newTable=newTable.replace(k,key[k]);
});
return{v:newTable.replace(periodsRe,urlSeparator)};}();if(typeof _ret==="object")return _ret.v;
}
return[table,key.replace(periodsRe,urlSeparator)].join(urlSeparator);
}
throw Error("Db Error: Key \""+JSON.stringify(key)+"\" does not exist within table "+table+"!");
};
var GetUserDbUrl=exports.GetUserDbUrl=function GetUserDbUrl(firebaseId){
return GetSchemaDbUrl("users",firebaseId);
};
var GetVendorDbUrl=exports.GetVendorDbUrl=function GetVendorDbUrl(vendorId){
return GetSchemaDbUrl("vendors",vendorId);
};
var GetFirebaseIdDbUrl=exports.GetFirebaseIdDbUrl=function GetFirebaseIdDbUrl(facebookId){
return GetSchemaDbUrl("firebaseIds.facebookId",{facebookId:facebookId});
};
var GetFcmTokenDbUrl=exports.GetFcmTokenDbUrl=function GetFcmTokenDbUrl(facebookId){
return GetSchemaDbUrl("fcmTokens.facebookId",{facebookId:facebookId});
};
var GetNotificationQueueUrl=exports.GetNotificationQueueUrl=function GetNotificationQueueUrl(){
return GetSchemaDbUrl("queue");
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
var GetRedeemedBevegramVendorDbUrl=exports.GetRedeemedBevegramVendorDbUrl=function GetRedeemedBevegramVendorDbUrl(vendorId){
return GetSchemaDbUrl("redeemedBevegrams.vendorId.ledger.bevegramList",{vendorId:vendorId});
};
var GetRedeemedBevegramVendorCustomerDbUrl=exports.GetRedeemedBevegramVendorCustomerDbUrl=function GetRedeemedBevegramVendorCustomerDbUrl(vendorId){
return GetSchemaDbUrl("redeemedBevegrams.vendorId.ledger.customerList",{vendorId:vendorId});
};
var GetRedeemedBevegramUserDbUrl=exports.GetRedeemedBevegramUserDbUrl=function GetRedeemedBevegramUserDbUrl(firebaseId){
return GetSchemaDbUrl("redeemedBevegrams.users.firebaseId",{firebaseId:firebaseId});
};
var GetRedeemedBevegramUserListDbUrl=exports.GetRedeemedBevegramUserListDbUrl=function GetRedeemedBevegramUserListDbUrl(firebaseId){
return GetSchemaDbUrl("redeemedBevegrams.users.firebaseId",{firebaseId:firebaseId});
};