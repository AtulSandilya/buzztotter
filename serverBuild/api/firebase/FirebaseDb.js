Object.defineProperty(exports,"__esModule",{value:true});exports.FirebaseDb=undefined;var _possibleConstructorReturn2=require("babel-runtime/helpers/possibleConstructorReturn");var _possibleConstructorReturn3=_interopRequireDefault(_possibleConstructorReturn2);var _inherits2=require("babel-runtime/helpers/inherits");var _inherits3=_interopRequireDefault(_inherits2);var _regenerator=require("babel-runtime/regenerator");var _regenerator2=_interopRequireDefault(_regenerator);var _classCallCheck2=require("babel-runtime/helpers/classCallCheck");var _classCallCheck3=_interopRequireDefault(_classCallCheck2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){
return new(P||(P=Promise))(function(resolve,reject){
function fulfilled(value){try{step(generator.next(value));}catch(e){reject(e);}}
function rejected(value){try{step(generator["throw"](value));}catch(e){reject(e);}}
function step(result){result.done?resolve(result.value):new P(function(resolve){resolve(result.value);}).then(fulfilled,rejected);}
step((generator=generator.apply(thisArg,_arguments||[])).next());
});
};var
FirebaseDb=exports.FirebaseDb=
function FirebaseDb(db){var _this=this;(0,_classCallCheck3.default)(this,FirebaseDb);
this.pushNode=function(url,pushObject){
try{
var sanitizedPushInput=FirebaseDb.SanitizeDbInput(pushObject);
var ref=_this.db.ref(url);
var newNode=ref.push();
newNode.set(sanitizedPushInput);
return newNode.toString().split("/").slice(-1)[0];
}
catch(e){
console.error(e);
}
};
this.writeNode=function(url,data){
try{
var sanitizedData=FirebaseDb.SanitizeDbInput(data);
return _this.db.ref(url).set(sanitizedData);
}
catch(e){
console.error(e);
}
};
this.readNode=function(url){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee(){var ref,response;return _regenerator2.default.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.prev=0;

ref=this.getRef(url);_context.next=4;return(
this.db.ref(url).once("value"));case 4:response=_context.sent;return _context.abrupt("return",
response.val());case 8:_context.prev=8;_context.t0=_context["catch"](0);


console.warn(_context.t0.message);return _context.abrupt("return");case 12:case"end":return _context.stop();}}},_callee,this,[[0,8]]);}));};



this.updateNode=function(url,updateFunction){
_this.db.ref(url).transaction(function(currentData){
return updateFunction(currentData?currentData:{});
});
};
this.getRef=function(url){
var ref=_this.db.ref(url);
if(!ref){
throw new FirebaseUndefinedReferenceError("Cannot read from '"+url+"' because it is undefined");
}else
{
return ref;
}
};
this.queryInList=function(url,key,query){return __awaiter(_this,void 0,void 0,_regenerator2.default.mark(function _callee2(){var result;return _regenerator2.default.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return(
this.db.ref(url).orderByChild(key).equalTo(query).once("value"));case 2:result=_context2.sent;return _context2.abrupt("return",
result.val());case 4:case"end":return _context2.stop();}}},_callee2,this);}));};

this.db=db;
};


FirebaseDb.SafeAdd=function(num1,num2){
return(!num1?0:num1)+(!num2?0:num2);
};

FirebaseDb.SafeSubtract=function(num1,num2){
return(!num1?0:num1)-(!num2?0:num2);
};
FirebaseDb.RemoveUndefinedValues=function(input){
var result=void 0;
var isUndefined=function isUndefined(val){
return!val&&val!==false&&val!==0;
};
try{
if(isUndefined(input)){
throw new FirebaseInvalidInputError("Firebase cannot directly write undefined values");
}
var throwWhenFinished=false;
var undefinedKeys=[];
result=JSON.parse(JSON.stringify(input,function(jsonKey,value){
if(isUndefined(value)){
throwWhenFinished=true;
undefinedKeys.push(jsonKey);
return undefined;
}
return value;
}),function(jsonKey,value){
if(value instanceof Array){
return value.filter(function(x){
if(isUndefined(x)){
throwWhenFinished=true;
undefinedKeys.push("Array: "+jsonKey);
return;
}
return x;
});
}else
if(typeof value==="object"&&value!==null&&Object.keys(value).length===0){
return;
}else
{
return value;
}
});
if(throwWhenFinished){
throw new FirebaseUndefinedInObjectError("Input has undefined value for key(s) '"+undefinedKeys.join(", ")+"'");
}
return input;
}
catch(e){
if(e.name==="FirebaseUndefinedInObjectError"){
if(!result&&result!==false||Object.keys(result).length===0){
throw new FirebaseInvalidInputError("Firebase cannot write an object which stringifies to undefined");
}else
{
console.error(e);
return result;
}
}else
{
throw e;
}
}
};
FirebaseDb.SanitizeDbInput=function(input){
try{
return FirebaseDb.RemoveUndefinedValues(input);
}
catch(e){
throw e;
}
};var

FirebaseInvalidInputError=function(_Error){(0,_inherits3.default)(FirebaseInvalidInputError,_Error);
function FirebaseInvalidInputError(message){(0,_classCallCheck3.default)(this,FirebaseInvalidInputError);var _this2=(0,_possibleConstructorReturn3.default)(this,(FirebaseInvalidInputError.__proto__||Object.getPrototypeOf(FirebaseInvalidInputError)).call(this,
message));
_this2.message=message;
_this2.name="FirebaseInvalidInputError";return _this2;
}return FirebaseInvalidInputError;}(Error);var

FirebaseUndefinedInObjectError=function(_Error2){(0,_inherits3.default)(FirebaseUndefinedInObjectError,_Error2);
function FirebaseUndefinedInObjectError(message){(0,_classCallCheck3.default)(this,FirebaseUndefinedInObjectError);var _this3=(0,_possibleConstructorReturn3.default)(this,(FirebaseUndefinedInObjectError.__proto__||Object.getPrototypeOf(FirebaseUndefinedInObjectError)).call(this,
message));
_this3.message=message;
_this3.name="FirebaseUndefinedInObjectError";return _this3;
}return FirebaseUndefinedInObjectError;}(Error);var

FirebaseUndefinedReferenceError=function(_Error3){(0,_inherits3.default)(FirebaseUndefinedReferenceError,_Error3);
function FirebaseUndefinedReferenceError(message){(0,_classCallCheck3.default)(this,FirebaseUndefinedReferenceError);var _this4=(0,_possibleConstructorReturn3.default)(this,(FirebaseUndefinedReferenceError.__proto__||Object.getPrototypeOf(FirebaseUndefinedReferenceError)).call(this,
message));
_this4.message=message;
_this4.name="FirebaseUndefinedReferenceError";return _this4;
}return FirebaseUndefinedReferenceError;}(Error);exports.default=

FirebaseDb;