Object.defineProperty(exports,"__esModule",{value:true});exports.sendNotification=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _nodeFetch=require("node-fetch");var _nodeFetch2=_interopRequireDefault(_nodeFetch);
var _theme=require("../theme");var _theme2=_interopRequireDefault(_theme);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}
var sendNotification=exports.sendNotification=function sendNotification(notif){
var fullNotif={
body:notif.body,
click_action:"fcm.ACTION.HELLO",



color:_theme2.default.colors.bevSecondary,
icon:notif.icon,
title:notif.title};

return(0,_nodeFetch2.default)("https://fcm.googleapis.com/fcm/send",{


body:JSON.stringify({
data:_extends({},notif.data,{
action:notif.action}),

notification:fullNotif,
to:notif.receiverGCMId}),

headers:{
"Authorization":"key="+process.env.TEST_FIREBASE_GCM_KEY,
"Content-Type":"application/json"},

method:"POST"}).
then(function(response){
return response.json();
});
};