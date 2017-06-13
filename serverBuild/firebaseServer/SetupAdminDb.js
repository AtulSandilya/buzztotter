Object.defineProperty(exports,"__esModule",{value:true});var _firebaseAdmin=require("firebase-admin");var admin=_interopRequireWildcard(_firebaseAdmin);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}
var SetupAdminDb=function SetupAdminDb(){
require("dotenv").config();
var serviceAccount={
auth_provider_x509_cert_url:process.env.FIREBASE_ADMIN_KEY_auth_provider_x509_cert_url,
auth_uri:process.env.FIREBASE_ADMIN_KEY_auth_uri,
client_email:process.env.FIREBASE_ADMIN_KEY_client_email,
client_id:process.env.FIREBASE_ADMIN_KEY_client_id,
client_x509_cert_url:process.env.FIREBASE_ADMIN_KEY_client_x509_cert_url,
private_key:process.env.FIREBASE_ADMIN_KEY_private_key.replace(/\\n/g,"\n"),
private_key_id:process.env.FIREBASE_ADMIN_KEY_private_key_id,
project_id:process.env.FIREBASE_ADMIN_KEY_project_id,
token_uri:process.env.FIREBASE_ADMIN_KEY_token_uri,
type:process.env.FIREBASE_ADMIN_KEY_type};

admin.initializeApp({
credential:admin.credential.cert(serviceAccount),
databaseURL:process.env.FIREBASE_KEY_firebaseDatabaseURL});

return admin.database();
};exports.default=
SetupAdminDb;