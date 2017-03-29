var _firebaseQueue=require("firebase-queue");var _firebaseQueue2=_interopRequireDefault(_firebaseQueue);
var _schema=require("../db/schema");
var _notifications=require("./notifications");
var _utils=require("./utils");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}
var db=(0,_utils.SetupAdminDb)();

console.log("Starting Firebase Server...");
console.log("Listening for changes on node: ",(0,_schema.GetNotificationQueueUrl)());
var notificationQueue=new _firebaseQueue2.default(db.ref((0,_schema.GetNotificationQueueUrl)()),function(data,progress,resolve,reject){
console.log("New Queue Request, data:",data);
(0,_notifications.sendNotification)(data);
console.log("Completed Queue Request");
resolve();
});