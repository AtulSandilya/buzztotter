var _classCallCheck2=require("babel-runtime/helpers/classCallCheck");var _classCallCheck3=_interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2=require("babel-runtime/helpers/possibleConstructorReturn");var _possibleConstructorReturn3=_interopRequireDefault(_possibleConstructorReturn2);var _inherits2=require("babel-runtime/helpers/inherits");var _inherits3=_interopRequireDefault(_inherits2);var _regenerator=require("babel-runtime/regenerator");var _regenerator2=_interopRequireDefault(_regenerator);var _extends2=require("babel-runtime/helpers/extends");var _extends3=_interopRequireDefault(_extends2);var _this=this;







var _firebaseQueue=require("firebase-queue");var _firebaseQueue2=_interopRequireDefault(_firebaseQueue);
var _schema=require("../db/schema");var DbSchema=_interopRequireWildcard(_schema);
var _tables=require("../db/tables");
var _theme=require("../theme");var _theme2=_interopRequireDefault(_theme);
var _stripe=require("./stripe");var stripe=_interopRequireWildcard(_stripe);
var _FirebaseServerDb=require("./FirebaseServerDb");var _FirebaseServerDb2=_interopRequireDefault(_FirebaseServerDb);
var _Log=require("./Log");var _Log2=_interopRequireDefault(_Log);
var _CommonUtilities=require("../CommonUtilities");
var _notifications=require("./notifications");
var _SetupAdminDb=require("./SetupAdminDb");var _SetupAdminDb2=_interopRequireDefault(_SetupAdminDb);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}function step(result){result.done?resolve(result.value):new P(function(resolve){resolve(result.value);}).then(fulfilled,rejected);}step((generator=generator.apply(thisArg,_arguments||[])).next());});};
var db=new _FirebaseServerDb2.default((0,_SetupAdminDb2.default)());


var AddCardToCustomerQueueUrl=DbSchema.GetAddCreditCardToCustomerQueueUrl();
_Log2.default.StartQueueMessage(AddCardToCustomerQueueUrl);
var AddCardToCustomerQueue=new _firebaseQueue2.default(db.getRef(AddCardToCustomerQueueUrl),function(data,progress,resolve,reject){
var log=new _Log2.default("ADD_CARD_TO_CUSTOMER");
var process=function process(){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee(){var input,stripeCreditCardToken,userFirebaseId,verificationToken,user,userStripeId,addedCard;return _regenerator2.default.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:
input=data;
stripeCreditCardToken=input.stripeCreditCardToken,userFirebaseId=input.userFirebaseId,verificationToken=input.verificationToken;_context.next=4;return(
db.readNode(DbSchema.GetUserDbUrl(userFirebaseId)));case 4:user=_context.sent;_context.prev=5;_context.next=8;return(





verifyUser(verificationToken,userFirebaseId));case 8:_context.next=10;return(

db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId)));case 10:userStripeId=_context.sent;if(
userStripeId){_context.next=19;break;}_context.next=14;return(
stripe.promiseNewCustomer(user.fullName,user.email));case 14:userStripeId=_context.sent.id;_context.next=17;return(
db.writeNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId),userStripeId));case 17:_context.next=25;break;case 19:if(


user.stripe){_context.next=23;break;}_context.next=22;return(
stripe.promiseCustomer(userStripeId));case 22:user.stripe=_context.sent;case 23:if(!(

user.stripe&&user.stripe.creditCards.length>=_tables.STRIPE_MAX_NUMBER_OF_CREDIT_CARDS)){_context.next=25;break;}throw(
new QueueServerError("Cannot add more than "+_tables.STRIPE_MAX_NUMBER_OF_CREDIT_CARDS+" credit cards"));case 25:_context.next=27;return(


stripe.promiseAddCardToCustomer(userStripeId,stripeCreditCardToken));case 27:addedCard=_context.sent;_context.next=30;return(
stripe.promiseUpdateCustomerDefaultCard(userStripeId,addedCard.metadata.generatedId));case 30:_context.next=32;return(
stripe.promiseCustomer(userStripeId));case 32:user.stripe=_context.sent;_context.next=35;return(
updateUser(input.userFirebaseId,user));case 35:
log.successMessage();
resolve();_context.next=46;break;case 39:_context.prev=39;_context.t0=_context["catch"](5);


user.stripe=(0,_extends3.default)({},user.stripe,{
error:_context.t0});_context.next=44;return(

updateUser(input.userFirebaseId,user));case 44:
log.failMessage(_context.t0);
resolve();case 46:case"end":return _context.stop();}}},_callee,this,[[5,39]]);}));};


process();
});


var RemoveCardFromCustomerQueueUrl=DbSchema.GetRemoveCreditCardFromCustomerQueueUrl();
_Log2.default.StartQueueMessage(RemoveCardFromCustomerQueueUrl);
var RemoveCardFromCustomerQueue=new _firebaseQueue2.default(db.getRef(RemoveCardFromCustomerQueueUrl),function(data,progress,resolve,reject){
var log=new _Log2.default("REMOVE_CARD_FROM_CUSTOMER");
var process=function process(){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee2(){var input,stripeCardId,userFirebaseId,verificationToken,userStripeId,user,_userStripeId,_user;return _regenerator2.default.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:
input=data;
stripeCardId=input.stripeCardId,userFirebaseId=input.userFirebaseId,verificationToken=input.verificationToken;_context2.prev=2;_context2.next=5;return(

verifyUser(verificationToken,userFirebaseId));case 5:_context2.next=7;return(
db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId)));case 7:userStripeId=_context2.sent;_context2.next=10;return(
db.readNode(DbSchema.GetUserDbUrl(userFirebaseId)));case 10:user=_context2.sent;_context2.next=13;return(
stripe.promiseDeleteCustomerCard(userStripeId,stripeCardId));case 13:_context2.next=15;return(
stripe.promiseCustomer(userStripeId));case 15:user.stripe=_context2.sent;
if(!user.stripe){
delete user.stripe;
}_context2.next=19;return(
updateUser(input.userFirebaseId,user));case 19:
log.successMessage();
resolve();_context2.next=40;break;case 23:_context2.prev=23;_context2.t0=_context2["catch"](2);_context2.next=27;return(





db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId)));case 27:_userStripeId=_context2.sent;_context2.next=30;return(
db.readNode(DbSchema.GetUserDbUrl(userFirebaseId)));case 30:_user=_context2.sent;_context2.next=33;return(
stripe.promiseCustomer(_userStripeId));case 33:_user.stripe=_context2.sent;
if(!_user.stripe){
_user.stripe={};
}
_user.stripe.error=_context2.t0;_context2.next=38;return(
updateUser(input.userFirebaseId,_user));case 38:
log.failMessage(_context2.t0);
resolve();case 40:case"end":return _context2.stop();}}},_callee2,this,[[2,23]]);}));};


process();
});


var UpdateDefaultCardUrl=DbSchema.GetUpdateDefaultCreditCardForCustomerUrl();
_Log2.default.StartQueueMessage(UpdateDefaultCardUrl);
var UpdateDefaultCardQueue=new _firebaseQueue2.default(db.getRef(UpdateDefaultCardUrl),function(data,progress,resolve,reject){
var log=new _Log2.default("UPDATE_DEFAULT_CARD");
var process=function process(){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee3(){var input,stripeCardId,userFirebaseId,verificationToken,user,userStripeId;return _regenerator2.default.wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
input=data;
stripeCardId=input.stripeCardId,userFirebaseId=input.userFirebaseId,verificationToken=input.verificationToken;_context3.next=4;return(
db.readNode(DbSchema.GetUserDbUrl(userFirebaseId)));case 4:user=_context3.sent;_context3.prev=5;_context3.next=8;return(

verifyUser(verificationToken,userFirebaseId));case 8:_context3.next=10;return(
db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId)));case 10:userStripeId=_context3.sent;_context3.next=13;return(
stripe.promiseUpdateCustomerDefaultCard(userStripeId,stripeCardId));case 13:_context3.next=15;return(
stripe.promiseCustomer(userStripeId));case 15:user.stripe=_context3.sent;_context3.next=18;return(
updateUser(input.userFirebaseId,user));case 18:
log.successMessage();
resolve();_context3.next=29;break;case 22:_context3.prev=22;_context3.t0=_context3["catch"](5);


user.stripe=(0,_extends3.default)({},user.stripe,{
error:_context3.t0});_context3.next=27;return(

updateUser(input.userFirebaseId,user));case 27:
log.failMessage(_context3.t0);
resolve();case 29:case"end":return _context3.stop();}}},_callee3,this,[[5,22]]);}));};


process();
});


var PurchaseQueueUrl=DbSchema.GetPurchaseQueueUrl();
_Log2.default.StartQueueMessage(PurchaseQueueUrl);
var PurchaseQueue=new _firebaseQueue2.default(db.getRef(PurchaseQueueUrl),function(data,progress,resolve,reject){
var log=new _Log2.default("PURCHASE");
var process=function process(){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee5(){var _this2=this;var input,userFirebaseId,receiverFacebookId,purchaseQuantity,verificationToken,purchasePrice,user,status,updateStatus,userStripeId,receiverFirebaseId,receiver,purchasePackages,matchingPurchasePackage,purchaseDescription,chargeResponse,purchasedBevegram,promoCode,promoCodePack,purchasedBevegramId,sentBevegram,sendId,receivedBevegram,receiverGCMId,notif,notifResult,jsonSpaces;return _regenerator2.default.wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:
input=data;
userFirebaseId=input.userFirebaseId,receiverFacebookId=input.receiverFacebookId,purchaseQuantity=input.purchaseQuantity,verificationToken=input.verificationToken,purchasePrice=input.purchasePrice;_context5.next=4;return(
db.readNode(DbSchema.GetUserDbUrl(userFirebaseId)));case 4:user=_context5.sent;

status={
connectionEstablished:"complete",
creditCardTransaction:"inProgress",
updatingDatabase:"pending",
sendingNotification:"pending"};

updateStatus=function updateStatus(){return __awaiter(_this2,void 0,void 0,_regenerator2.default.mark(function _callee4(){return _regenerator2.default.wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
status.lastModified=(0,_CommonUtilities.GetTimeNow)();_context4.next=3;return(
db.writeNode(DbSchema.GetPurchaseTransactionStatusDbUrl(userFirebaseId),status));case 3:case"end":return _context4.stop();}}},_callee4,this);}));};_context5.prev=7;_context5.next=10;return(








verifyUser(verificationToken,userFirebaseId));case 10:_context5.next=12;return(
db.readNode(DbSchema.GetStripeCustomerIdDbUrl(userFirebaseId)));case 12:userStripeId=_context5.sent;_context5.next=15;return(
updateStatus());case 15:_context5.next=17;return(
db.readNode(DbSchema.GetFirebaseIdDbUrl(receiverFacebookId)));case 17:receiverFirebaseId=_context5.sent;if(
receiverFirebaseId){_context5.next=20;break;}throw(
new QueueServerError("Sender does not exist in our records"));case 20:_context5.next=22;return(

db.readNode(DbSchema.GetUserDbUrl(receiverFirebaseId)));case 22:receiver=_context5.sent;_context5.next=25;return(
db.readNode(DbSchema.GetPurchasePackagesDbUrl()));case 25:purchasePackages=_context5.sent;
matchingPurchasePackage=purchasePackages.filter(function(val){
if(val.quantity===purchaseQuantity&&val.price===purchasePrice){
return true;
}
return false;
});if(!(
matchingPurchasePackage.length!==1)){_context5.next=29;break;}throw(
new QueueServerError("Invalid Purchase Details"));case 29:


purchaseDescription="Sent "+purchaseQuantity+" bevegram"+(purchaseQuantity!==1?"s":"")+" to "+receiver.fullName;_context5.next=32;return(
stripe.promiseCreditCardPurchase(userStripeId,purchasePrice,purchaseDescription));case 32:chargeResponse=_context5.sent;
status.creditCardTransaction="complete";
status.updatingDatabase="inProgress";_context5.next=37;return(
updateStatus());case 37:

purchasedBevegram={
chargeId:chargeResponse.id,
purchaseDate:(0,_CommonUtilities.GetTimeNow)(),
purchasePrice:purchasePrice,
purchasedByFacebookId:user.facebook.id,
purchasedById:user.firebase.uid,
purchasedByName:user.fullName,
quantity:purchaseQuantity};


promoCode=input.promoCode;if(!
promoCode){_context5.next=45;break;}
promoCode=promoCode.toUpperCase();
purchasedBevegram.promoCode=promoCode;
promoCodePack={
purchaseDate:(0,_CommonUtilities.GetTimeNow)(),
purchasedByUserId:user.firebase.uid,
quantity:purchaseQuantity};_context5.next=45;return(

db.addPromoCode(promoCode,promoCodePack));case 45:_context5.next=47;return(

db.addPurchasedBevegramToUser(userFirebaseId,purchasedBevegram));case 47:purchasedBevegramId=_context5.sent;
sentBevegram={
purchasedBevegramId:purchasedBevegramId,
quantity:purchaseQuantity,
receiverName:receiver.fullName,
sendDate:(0,_CommonUtilities.GetTimeNow)()};_context5.next=51;return(

db.addSentBevegramToUser(userFirebaseId,sentBevegram));case 51:sendId=_context5.sent;_context5.next=54;return(
db.updatePurchasedBevegramWithSendId(userFirebaseId,purchasedBevegramId,sendId));case 54:
receivedBevegram={
isRedeemed:false,
quantity:purchaseQuantity,
quantityRedeemed:0,
receivedDate:(0,_CommonUtilities.GetTimeNow)(),
sentFromFacebookId:user.facebook.id,
sentFromName:user.fullName,
sentFromPhotoUrl:user.firebase.photoURL};

if(input.message){
receivedBevegram.message=input.message;
}_context5.next=58;return(
db.addReceivedBevegramToReceiverBevegrams(receiver.firebase.uid,receivedBevegram));case 58:
status.updatingDatabase="complete";
status.sendingNotification="inProgress";_context5.next=62;return(
updateStatus());case 62:_context5.next=64;return(
db.readNode(DbSchema.GetFcmTokenDbUrl(receiver.facebook.id)));case 64:receiverGCMId=_context5.sent;if(!(
!receiverGCMId||receiverGCMId.length===0)){_context5.next=72;break;}
console.log("Could not find receiver fcm token");
status.sendingNotification="complete";_context5.next=70;return(
updateStatus());case 70:_context5.next=79;break;case 72:


notif={
receiverGCMId:receiverGCMId,
action:_tables.NotificationActions.ShowNewReceivedBevegrams,
body:user.fullName+" sent you "+purchaseQuantity+" Bevegram"+(purchaseQuantity!==1?" s":""),
data:{},
icon:_theme2.default.notificationIcons.beverage,
title:"BuzzOtter"};_context5.next=75;return(

(0,_notifications.sendNotification)(notif));case 75:notifResult=_context5.sent;
jsonSpaces=2;
console.log("notifResult: ",notifResult);
setTimeout(function(){
status.sendingNotification="complete";
updateStatus();
},500);case 79:

log.successMessage();_context5.next=88;break;case 82:_context5.prev=82;_context5.t0=_context5["catch"](7);




status.error=_context5.t0.message?_context5.t0.message:_context5.t0;_context5.next=87;return(
updateStatus());case 87:
log.failMessage(_context5.t0);case 88:

resolve();case 89:case"end":return _context5.stop();}}},_callee5,this,[[7,82]]);}));};

process();
});


var RedeemQueueUrl=DbSchema.GetRedeemQueueUrl();
_Log2.default.StartQueueMessage(RedeemQueueUrl);
var RedeemQueue=new _firebaseQueue2.default(db.getRef(RedeemQueueUrl),function(data,progress,resolve,reject){
var log=new _Log2.default("REDEEM");
var process=function process(){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee7(){var _this3=this;var input,userFirebaseId,receivedId,loc,quantity,verificationToken,user,status,updateStatus,vendor,validLatitude,validLongitude,validAddress,receivedBevegram,updatedReceivedBevegram,userRedeemedBevegram,vendorRedeemedBevegram;return _regenerator2.default.wrap(function _callee7$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:
input=data;
userFirebaseId=input.userFirebaseId,receivedId=input.receivedId,loc=input.location,quantity=input.quantity,verificationToken=input.verificationToken;_context7.next=4;return(
db.readNode(DbSchema.GetUserDbUrl(userFirebaseId)));case 4:user=_context7.sent;
status={
connectionEstablished:"complete",
updatingDatabase:"pending"};

updateStatus=function updateStatus(){return __awaiter(_this3,void 0,void 0,_regenerator2.default.mark(function _callee6(){return _regenerator2.default.wrap(function _callee6$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:
status.lastModified=(0,_CommonUtilities.GetTimeNow)();_context6.next=3;return(
db.writeNode(DbSchema.GetRedeemTransactionStatusDbUrl(userFirebaseId),status));case 3:case"end":return _context6.stop();}}},_callee6,this);}));};

updateStatus();_context7.prev=8;_context7.next=11;return(





verifyUser(verificationToken,userFirebaseId));case 11:_context7.next=13;return(
db.readNode(DbSchema.GetVendorDbUrl(loc.vendorId)));case 13:vendor=_context7.sent.metadata;

validLatitude=loc.latitude===vendor.latitude;
validLongitude=loc.longitude===vendor.longitude;
validAddress=loc.address===vendor.address;if(
validLatitude&&validLongitude&&validAddress){_context7.next=19;break;}throw(
new QueueServerError("Unable to verify "+loc.name));case 19:_context7.next=21;return(

db.readNode(DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId)+("/"+receivedId)));case 21:receivedBevegram=_context7.sent;if(!(
quantity>receivedBevegram.quantity-receivedBevegram.quantityRedeemed)){_context7.next=24;break;}throw(
new QueueServerError("You do not have enough bevegrams to redeem!"));case 24:

updatedReceivedBevegram=(0,_extends3.default)({},receivedBevegram,{
quantityRedeemed:receivedBevegram.quantityRedeemed+quantity});

userRedeemedBevegram={
receivedId:receivedId,
redeemedDate:(0,_CommonUtilities.GetTimeNow)(),
vendorName:vendor.name,
vendorId:loc.vendorId,
vendorPin:"1234",
quantity:quantity};

vendorRedeemedBevegram={
receivedId:receivedId,
redeemedByName:user.fullName,
redeemedByUserId:userFirebaseId,
redeemedByPhotoUrl:user.firebase.photoURL,
redeemedDate:(0,_CommonUtilities.GetTimeNow)(),
quantity:quantity};_context7.next=29;return(


db.redeemUserBevegram(userFirebaseId,userRedeemedBevegram,receivedId,updatedReceivedBevegram));case 29:_context7.next=31;return(
db.redeemVendorBevegram(loc.vendorId,vendorRedeemedBevegram));case 31:
setTimeout(function(){

status.updatingDatabase="complete";
updateStatus();
log.successMessage();
},500);_context7.next=37;break;case 34:_context7.prev=34;_context7.t0=_context7["catch"](8);


setTimeout(function(){

status.error=_context7.t0.message;
status.updatingDatabase="failed";
updateStatus();
log.failMessage(_context7.t0);
},500);case 37:

resolve();case 38:case"end":return _context7.stop();}}},_callee7,this,[[8,34]]);}));};

process();
});


var verifyUser=function verifyUser(verificationToken,userFirebaseId){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee8(){var tokenInDb;return _regenerator2.default.wrap(function _callee8$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:_context8.next=2;return(
db.readNode(DbSchema.GetUserVerificationTokenDbUrl(userFirebaseId)));case 2:tokenInDb=_context8.sent;if(!(
tokenInDb!==verificationToken)){_context8.next=6;break;}
console.log(tokenInDb+" != "+verificationToken);throw(
new QueueServerError("Verification tokens do not match!"));case 6:case"end":return _context8.stop();}}},_callee8,this);}));};


var updateUser=function updateUser(userFirebaseId,user){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee9(){var updatedUser;return _regenerator2.default.wrap(function _callee9$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:


updatedUser=(0,_extends3.default)({},user,{
lastModified:(0,_CommonUtilities.GetTimeNow)()});_context9.next=3;return(

db.writeNode(DbSchema.GetUserDbUrl(userFirebaseId),updatedUser));case 3:case"end":return _context9.stop();}}},_callee9,this);}));};var

QueueServerError=function(_Error){(0,_inherits3.default)(QueueServerError,_Error);
function QueueServerError(message){(0,_classCallCheck3.default)(this,QueueServerError);var _this4=(0,_possibleConstructorReturn3.default)(this,(QueueServerError.__proto__||Object.getPrototypeOf(QueueServerError)).call(this,
message));
_this4.message=message;
_this4.name="QueueServerError";return _this4;
}return QueueServerError;}(Error);



process.on("SIGINT",function(){
var shutdownStart=Date.now();
console.log("Gracefully shutting down queue...");
var addCardToCustomerShutdown=AddCardToCustomerQueue.shutdown();
var removeCardFromCustomerShutdown=RemoveCardFromCustomerQueue.shutdown();
var updateDefaultCardShutdown=UpdateDefaultCardQueue.shutdown();
var purchaseShutdown=PurchaseQueue.shutdown();
var redeemShutdown=RedeemQueue.shutdown();
Promise.all([
addCardToCustomerShutdown,
removeCardFromCustomerShutdown,
updateDefaultCardShutdown,
purchaseShutdown,
redeemShutdown]).
then(function(vals){
console.log("Queue shutdown completed in "+(Date.now()-shutdownStart)+"ms!");
});
});