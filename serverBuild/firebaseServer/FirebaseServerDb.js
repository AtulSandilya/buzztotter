Object.defineProperty(exports,"__esModule",{value:true});var _extends2=require("babel-runtime/helpers/extends");var _extends3=_interopRequireDefault(_extends2);var _regenerator=require("babel-runtime/regenerator");var _regenerator2=_interopRequireDefault(_regenerator);var _classCallCheck2=require("babel-runtime/helpers/classCallCheck");var _classCallCheck3=_interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2=require("babel-runtime/helpers/possibleConstructorReturn");var _possibleConstructorReturn3=_interopRequireDefault(_possibleConstructorReturn2);var _inherits2=require("babel-runtime/helpers/inherits");var _inherits3=_interopRequireDefault(_inherits2);







var _FirebaseDb2=require("../api/firebase/FirebaseDb");var _FirebaseDb3=_interopRequireDefault(_FirebaseDb2);
var _schema=require("../db/schema");var DbSchema=_interopRequireWildcard(_schema);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}function step(result){result.done?resolve(result.value):new P(function(resolve){resolve(result.value);}).then(fulfilled,rejected);}step((generator=generator.apply(thisArg,_arguments||[])).next());});};var

FirebaseServerDb=function(_FirebaseDb){(0,_inherits3.default)(FirebaseServerDb,_FirebaseDb);
function FirebaseServerDb(db){(0,_classCallCheck3.default)(this,FirebaseServerDb);var _this=(0,_possibleConstructorReturn3.default)(this,(FirebaseServerDb.__proto__||Object.getPrototypeOf(FirebaseServerDb)).call(this,
db));
_this.deleteNode=function(url){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee(){return _regenerator2.default.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return(
this.db.ref(url).remove());case 2:return _context.abrupt("return",_context.sent);case 3:case"end":return _context.stop();}}},_callee,this);}));};


_this.addPurchasedBevegramToUser=function(userFirebaseId,purchasedBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee2(){var id;return _regenerator2.default.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return(
this.pushNode(DbSchema.GetPurchasedBevegramListDbUrl(userFirebaseId),purchasedBevegram));case 2:id=_context2.sent;_context2.next=5;return(
this.incrementPurchaseSummary(userFirebaseId,purchasedBevegram));case 5:_context2.next=7;return(
this.incrementSentSummaryWithPurchasedBevegram(userFirebaseId,purchasedBevegram));case 7:return _context2.abrupt("return",
id);case 8:case"end":return _context2.stop();}}},_callee2,this);}));};

_this.updatePurchasedBevegramWithSendId=function(firebaseId,purchaseId,sentBevegramId){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee3(){var url;return _regenerator2.default.wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:
url=DbSchema.GetPurchasedBevegramListDbUrl(firebaseId)+("/"+purchaseId);_context3.next=3;return(
this.updateNode(url,function(purchasedBevegram){
return(0,_extends3.default)({},purchasedBevegram,{
sentBevegramId:sentBevegramId});

}));case 3:case"end":return _context3.stop();}}},_callee3,this);}));};



_this.incrementPurchaseSummary=function(userFirebaseId,purchasedBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee4(){var url;return _regenerator2.default.wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:
url=DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId);_context4.next=3;return(
this.updateNode(url,function(summary){
return(0,_extends3.default)({},summary,{
availableToSend:_FirebaseDb3.default.SafeAdd(summary.availableToSend,purchasedBevegram.quantity),
quantityPurchased:_FirebaseDb3.default.SafeAdd(summary.quantityPurchased,purchasedBevegram.quantity),
sent:_FirebaseDb3.default.SafeAdd(summary.sent,0)});

}));case 3:case"end":return _context4.stop();}}},_callee4,this);}));};

_this.decrementPurchaseSummary=function(userFirebaseId,sentBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee5(){return _regenerator2.default.wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:_context5.next=2;return(
this.updateNode(DbSchema.GetPurchasedBevegramSummaryDbUrl(userFirebaseId),function(summary){
return(0,_extends3.default)({},summary,{
availableToSend:_FirebaseDb3.default.SafeSubtract(summary.availableToSend,sentBevegram.quantity),
quantityPurchased:_FirebaseDb3.default.SafeAdd(summary.quantityPurchased,0),
sent:_FirebaseDb3.default.SafeAdd(summary.sent,sentBevegram.quantity)});

}));case 2:case"end":return _context5.stop();}}},_callee5,this);}));};



_this.addPromoCode=function(promoCode,promoCodePackage){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee6(){return _regenerator2.default.wrap(function _callee6$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:_context6.next=2;return(
this.incrementPromoCodeSummary(promoCode,promoCodePackage));case 2:_context6.next=4;return(
this.pushNode(DbSchema.GetPromoCodeListDbUrl(promoCode),promoCodePackage));case 4:case"end":return _context6.stop();}}},_callee6,this);}));};

_this.incrementPromoCodeSummary=function(promoCode,promoCodePack){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee7(){return _regenerator2.default.wrap(function _callee7$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:_context7.next=2;return(
this.updateNode(DbSchema.GetPromoCodeSummaryDbUrl(promoCode),function(summary){
return(0,_extends3.default)({},{
total:_FirebaseDb3.default.SafeAdd(promoCodePack.quantity,summary.total)});

}));case 2:case"end":return _context7.stop();}}},_callee7,this);}));};



_this.addSentBevegramToUser=function(userFirebaseId,sentBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee8(){var id;return _regenerator2.default.wrap(function _callee8$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:_context8.next=2;return(
this.pushNode(DbSchema.GetSentBevegramListDbUrl(userFirebaseId),sentBevegram));case 2:id=_context8.sent;_context8.next=5;return(

this.decrementPurchaseSummary(userFirebaseId,sentBevegram));case 5:_context8.next=7;return(
this.decrementSentSummaryWithSentBevegram(userFirebaseId,sentBevegram));case 7:return _context8.abrupt("return",
id);case 8:case"end":return _context8.stop();}}},_callee8,this);}));};



_this.incrementSentSummaryWithPurchasedBevegram=function(userFirebaseId,purchasedBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee9(){var url;return _regenerator2.default.wrap(function _callee9$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:
url=DbSchema.GetSentBevegramSummaryDbUrl(userFirebaseId);_context9.next=3;return(
this.updateNode(url,function(summary){
return(0,_extends3.default)({},summary,{
availableToSend:_FirebaseDb3.default.SafeAdd(summary.availableToSend,0),
sent:_FirebaseDb3.default.SafeAdd(summary.sent,purchasedBevegram.quantity)});

}));case 3:case"end":return _context9.stop();}}},_callee9,this);}));};

_this.decrementSentSummaryWithSentBevegram=function(userFirebaseId,sentBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee10(){var url;return _regenerator2.default.wrap(function _callee10$(_context10){while(1){switch(_context10.prev=_context10.next){case 0:
url=DbSchema.GetSentBevegramSummaryDbUrl(userFirebaseId);
this.updateNode(url,function(summary){
return(0,_extends3.default)({},{
availableToSend:_FirebaseDb3.default.SafeSubtract(summary.availableToSend,sentBevegram.quantity),
sent:_FirebaseDb3.default.SafeAdd(summary.sent,sentBevegram.quantity)});

});case 2:case"end":return _context10.stop();}}},_callee10,this);}));};



_this.addReceivedBevegramToReceiverBevegrams=function(receiverFirebaseId,receivedBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee11(){var id;return _regenerator2.default.wrap(function _callee11$(_context11){while(1){switch(_context11.prev=_context11.next){case 0:_context11.next=2;return(
this.pushNode(DbSchema.GetReceivedBevegramListDbUrl(receiverFirebaseId),receivedBevegram));case 2:id=_context11.sent;_context11.next=5;return(
this.incrementReceivedSummaryWithReceivedBevegram(receiverFirebaseId,receivedBevegram));case 5:return _context11.abrupt("return",
id);case 6:case"end":return _context11.stop();}}},_callee11,this);}));};

_this.updateReceivedBevegramAsRedeemed=function(userFirebaseId,receivedBevegramId){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee12(){var url;return _regenerator2.default.wrap(function _callee12$(_context12){while(1){switch(_context12.prev=_context12.next){case 0:
url=DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId)+("/"+receivedBevegramId);_context12.next=3;return(
this.updateNode(url,function(receivedBevegram){
return(0,_extends3.default)({},receivedBevegram,{
isRedeemed:true});

}));case 3:case"end":return _context12.stop();}}},_callee12,this);}));};



_this.incrementReceivedSummaryWithReceivedBevegram=function(receiverFirebaseId,receivedBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee13(){return _regenerator2.default.wrap(function _callee13$(_context13){while(1){switch(_context13.prev=_context13.next){case 0:_context13.next=2;return(
this.updateNode(DbSchema.GetReceivedBevegramSummaryDbUrl(receiverFirebaseId),function(summary){
return(0,_extends3.default)({},summary,{
availableToRedeem:_FirebaseDb3.default.SafeAdd(summary.availableToRedeem,receivedBevegram.quantity),
redeemed:_FirebaseDb3.default.SafeAdd(summary.redeemed,0),
total:_FirebaseDb3.default.SafeAdd(summary.total,receivedBevegram.quantity)});

}));case 2:case"end":return _context13.stop();}}},_callee13,this);}));};



_this.redeemUserBevegram=function(userFirebaseId,userRedeemedBevegram,receivedId,updatedReceivedBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee14(){var redeemedListUrl,receivedNodeUrl,redeemedSummaryUrl,receivedSummaryUrl,quantity,vendorId,userRedeemId;return _regenerator2.default.wrap(function _callee14$(_context14){while(1){switch(_context14.prev=_context14.next){case 0:
redeemedListUrl=DbSchema.GetRedeemedBevegramListDbUrl(userFirebaseId);
receivedNodeUrl=DbSchema.GetReceivedBevegramListDbUrl(userFirebaseId)+("/"+receivedId);
redeemedSummaryUrl=DbSchema.GetRedeemedBevegramSummaryDbUrl(userFirebaseId);
receivedSummaryUrl=DbSchema.GetReceivedBevegramSummaryDbUrl(userFirebaseId);
quantity=userRedeemedBevegram.quantity;
vendorId=userRedeemedBevegram.vendorId;_context14.next=8;return(
this.pushNode(redeemedListUrl,userRedeemedBevegram));case 8:userRedeemId=_context14.sent;_context14.next=11;return(
this.writeNode(receivedNodeUrl,updatedReceivedBevegram));case 11:_context14.next=13;return(
this.updateReceivedBevegramAsRedeemed(userFirebaseId,receivedId));case 13:_context14.next=15;return(

this.updateNode(redeemedSummaryUrl,function(summary){
var vendorToAdd={};
vendorToAdd[vendorId]=vendorId;
return(0,_extends3.default)({},summary,{
total:_FirebaseDb3.default.SafeAdd(quantity,summary.total),
vendorList:(0,_extends3.default)({},summary.vendorList,vendorToAdd)});

}));case 15:_context14.next=17;return(

this.updateNode(receivedSummaryUrl,function(summary){
return(0,_extends3.default)({},summary,{
availableToRedeem:_FirebaseDb3.default.SafeSubtract(summary.availableToRedeem,quantity),
redeemed:_FirebaseDb3.default.SafeAdd(summary.redeemed,quantity)});

}));case 17:case"end":return _context14.stop();}}},_callee14,this);}));};

_this.redeemVendorBevegram=function(vendorId,vendorRedeemedBevegram){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee15(){var vendorRedeemListUrl;return _regenerator2.default.wrap(function _callee15$(_context15){while(1){switch(_context15.prev=_context15.next){case 0:
vendorRedeemListUrl=DbSchema.GetVendorRedeemListDbUrl(vendorId);
this.pushNode(vendorRedeemListUrl,vendorRedeemedBevegram);case 2:case"end":return _context15.stop();}}},_callee15,this);}));};return _this;


}return FirebaseServerDb;}(_FirebaseDb3.default);exports.default=

FirebaseServerDb;