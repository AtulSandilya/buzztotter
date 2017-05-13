Object.defineProperty(exports,"__esModule",{value:true});exports.promiseCustomer=exports.promiseDeleteCustomerCard=exports.promiseUpdateCustomerDefaultCard=exports.promiseAddCardToCustomer=exports.promiseNewCustomer=exports.promiseCreditCardPurchase=undefined;var _classCallCheck2=require("babel-runtime/helpers/classCallCheck");var _classCallCheck3=_interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2=require("babel-runtime/helpers/possibleConstructorReturn");var _possibleConstructorReturn3=_interopRequireDefault(_possibleConstructorReturn2);var _inherits2=require("babel-runtime/helpers/inherits");var _inherits3=_interopRequireDefault(_inherits2);var _regenerator=require("babel-runtime/regenerator");var _regenerator2=_interopRequireDefault(_regenerator);var _this=this;







var _moment=require("moment");var _moment2=_interopRequireDefault(_moment);
var _nodeFetch=require("node-fetch");var _nodeFetch2=_interopRequireDefault(_nodeFetch);
var _v=require("uuid/v4");var _v2=_interopRequireDefault(_v);
var _dotenv=require("dotenv");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}function step(result){result.done?resolve(result.value):new P(function(resolve){resolve(result.value);}).then(fulfilled,rejected);}step((generator=generator.apply(thisArg,_arguments||[])).next());});};
(0,_dotenv.config)();
var stripeUrl="https://api.stripe.com/v1/";
var stripePrivateApiKey=process.env.STRIPE_PRIVATE_API_KEY;

var uriEncodeObjectToString=function uriEncodeObjectToString(inputObj){var separator=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"&";
var result=[];
Object.keys(inputObj).forEach(function(key){
if(typeof inputObj[key]==="object"){
result.push(uriEncodeNestedObject(inputObj[key],key));
}else
{
result.push(encodeURIComponent(key)+"="+encodeURIComponent(inputObj[key]));
}
});
var strResult=result.join("&");
return strResult;
};





var uriEncodeNestedObject=function uriEncodeNestedObject(inputObj,objName){
var result=[];
var name=encodeURIComponent(objName);
Object.keys(inputObj).forEach(function(key){
result.push(name+"["+encodeURIComponent(key)+"]="+encodeURIComponent(inputObj[key]));
});
return result.join("&");
};
var stripeRequest=function stripeRequest(url,requestDetails){var method=arguments.length>2&&arguments[2]!==undefined?arguments[2]:"POST";return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee(){var body,response,json;return _regenerator2.default.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:
body=uriEncodeObjectToString(requestDetails);_context.next=3;return(
(0,_nodeFetch2.default)(stripeUrl+url,{
body:uriEncodeObjectToString(requestDetails),
headers:{
"Accept":"application/json",
"Authorization":"Bearer "+stripePrivateApiKey,
"Content-Type":"application/x-www-form-urlencoded"},

method:method}).

catch(function(error){
throw Error("Error "+method+"ing "+body+" to "+url+": "+error);
}));case 3:response=_context.sent;_context.next=6;return(
response.json());case 6:json=_context.sent;if(!
json.error){_context.next=9;break;}throw(
new StripeError(json.error.message));case 9:return _context.abrupt("return",

json);case 10:case"end":return _context.stop();}}},_callee,this);}));};


var promiseCreditCardPurchase=exports.promiseCreditCardPurchase=function promiseCreditCardPurchase(customerId,amount,description){
var purchaseDetails={
amount:amount,
currency:"usd",
customer:customerId,
description:description};

return stripeRequest("charges",purchaseDetails);
};
var promiseNewCustomer=exports.promiseNewCustomer=function promiseNewCustomer(fullName,email){
var newCustomerDetails={
description:fullName+": "+email,
metadata:{
creationDate:(0,_moment2.default)().format("MM/DD/YYYY HH:MM:ss Z"),
email:email,
name:fullName}};


return stripeRequest("customers",newCustomerDetails);
};
var promiseAddCardToCustomer=exports.promiseAddCardToCustomer=function promiseAddCardToCustomer(customerId,token){
var customerDetails={
metadata:{

creationDate:Date.now().toString(),
generatedId:(0,_v2.default)()},

source:token};

return stripeRequest("customers/"+customerId+"/sources",customerDetails);
};
var promiseUpdateCustomerDefaultCard=exports.promiseUpdateCustomerDefaultCard=function promiseUpdateCustomerDefaultCard(customerId,newDefaultCardGeneratedId){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee2(){var newDefaultCard,update;return _regenerator2.default.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return(
convertGeneratedIdToStripeCardId(customerId,newDefaultCardGeneratedId));case 2:newDefaultCard=_context2.sent;
update={
default_source:newDefaultCard};return _context2.abrupt("return",

stripeRequest("customers/"+customerId,update));case 5:case"end":return _context2.stop();}}},_callee2,this);}));};

var promiseDeleteCustomerCard=exports.promiseDeleteCustomerCard=function promiseDeleteCustomerCard(customerId,cardToDeleteGeneratedId){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee3(){var cardToDelete;return _regenerator2.default.wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:_context3.next=2;return(
convertGeneratedIdToStripeCardId(customerId,cardToDeleteGeneratedId));case 2:cardToDelete=_context3.sent;return _context3.abrupt("return",
stripeRequest("customers/"+customerId+"/sources/"+cardToDelete,{},"DELETE"));case 4:case"end":return _context3.stop();}}},_callee3,this);}));};

var convertGeneratedIdToStripeCardId=function convertGeneratedIdToStripeCardId(customerId,generatedCardId){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee4(){var rawCustomer;return _regenerator2.default.wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:_context4.next=2;return(
stripeRequest("customers/"+customerId,{}));case 2:rawCustomer=_context4.sent;_context4.prev=3;return _context4.abrupt("return",

rawCustomer.sources.data.filter(function(val){
return val.metadata.generatedId===generatedCardId;
})[0].id);case 7:_context4.prev=7;_context4.t0=_context4["catch"](3);throw(


new StripeError("Could not retrieve your credit card information"));case 10:case"end":return _context4.stop();}}},_callee4,this,[[3,7]]);}));};



var promiseCustomer=exports.promiseCustomer=function promiseCustomer(customerId){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee6(){var _this2=this;return _regenerator2.default.wrap(function _callee6$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:return _context6.abrupt("return",
new Promise(function(resolve){return __awaiter(_this2,void 0,void 0,_regenerator2.default.mark(function _callee5(){var rawCustomer;return _regenerator2.default.wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:_context5.next=2;return(
stripeRequest("customers/"+customerId,{}));case 2:rawCustomer=_context5.sent;
if(rawCustomer.sources.data.length>0){
resolve({

activeCardId:rawCustomer.sources.data.filter(function(val){
return val.id===rawCustomer.default_source;
})[0].metadata.generatedId,
creditCards:rawCustomer.sources.data.sort(function(a,b){
if(!a.metadata||!b.metadata){
return true;
}else
{
return a.metadata.creationDate>b.metadata.creationDate;
}
}).map(function(val){
return{
brand:val.brand,
id:val.metadata.generatedId,
last4:val.last4};

})});

}else
{
resolve();
}case 4:case"end":return _context5.stop();}}},_callee5,this);}));}).

catch(function(error){
throw new StripeError(error);
}));case 1:case"end":return _context6.stop();}}},_callee6,this);}));};var

StripeError=function(_Error){(0,_inherits3.default)(StripeError,_Error);
function StripeError(message){(0,_classCallCheck3.default)(this,StripeError);var _this3=(0,_possibleConstructorReturn3.default)(this,(StripeError.__proto__||Object.getPrototypeOf(StripeError)).call(this,
message));
_this3.message=message;
_this3.name="StripeError";return _this3;
}return StripeError;}(Error);