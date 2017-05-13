Object.defineProperty(exports,"__esModule",{value:true});var _classCallCheck2=require("babel-runtime/helpers/classCallCheck");var _classCallCheck3=_interopRequireDefault(_classCallCheck2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var
Log=
function Log(action){var _this=this;(0,_classCallCheck3.default)(this,Log);
this.successMessage=function(){
console.log("Successfully completed "+_this.action+" in "+_this.getTimeElapsed()+" ms");
};
this.failMessage=function(error){
console.log("Failed "+_this.action+" in "+_this.getTimeElapsed()+" ms");
console.error("Error executing "+_this.action+": "+error+"\n Stacktrace: "+error.stack);
};
this.getUnixTime=function(){
return Date.now();
};
this.getTimeElapsed=function(){
return _this.getUnixTime()-_this.start;
};
this.action=action;
this.start=this.getUnixTime();
};

Log.StartQueueMessage=function(url){
console.log("Listening for changes on node: ",url);
};exports.default=
Log;