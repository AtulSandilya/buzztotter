Object.defineProperty(exports,"__esModule",{value:true});var _firebaseAdmin=require("firebase-admin");var admin=_interopRequireWildcard(_firebaseAdmin);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}
var SetupAdminDb=function SetupAdminDb(environmentVars,name){
require("dotenv").config();
var env=environmentVars?environmentVars:process.env;
var serviceAccount={
auth_provider_x509_cert_url:env.FIREBASE_ADMIN_KEY_auth_provider_x509_cert_url,
auth_uri:env.FIREBASE_ADMIN_KEY_auth_uri,
client_email:env.FIREBASE_ADMIN_KEY_client_email,
client_id:env.FIREBASE_ADMIN_KEY_client_id,
client_x509_cert_url:env.FIREBASE_ADMIN_KEY_client_x509_cert_url,
private_key:env.FIREBASE_ADMIN_KEY_private_key.replace(/\\n/g,"\n"),
private_key_id:env.FIREBASE_ADMIN_KEY_private_key_id,
project_id:env.FIREBASE_ADMIN_KEY_project_id,
token_uri:env.FIREBASE_ADMIN_KEY_token_uri,
type:env.FIREBASE_ADMIN_KEY_type};




if(name){
var secondaryDb=admin.initializeApp({
credential:admin.credential.cert(serviceAccount),
databaseURL:env.FIREBASE_ADMIN_KEY_firebaseDatabaseURL},
name);
return secondaryDb.database();
}else
{
admin.initializeApp({
credential:admin.credential.cert(serviceAccount),
databaseURL:env.FIREBASE_ADMIN_KEY_firebaseDatabaseURL});

return admin.database();
}
};exports.default=
SetupAdminDb;