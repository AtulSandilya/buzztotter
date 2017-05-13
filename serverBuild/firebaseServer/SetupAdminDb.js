Object.defineProperty(exports,"__esModule",{value:true});var _firebaseAdmin=require("firebase-admin");var _firebaseAdmin2=_interopRequireDefault(_firebaseAdmin);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}
var SetupAdminDb=function SetupAdminDb(){
require("dotenv").config();
var serviceAccount={
auth_provider_x509_cert_url:process.env.TEST_FIREBASE_ADMIN_KEY_auth_provider_x509_cert_url,
auth_uri:process.env.TEST_FIREBASE_ADMIN_KEY_auth_uri,
client_email:process.env.TEST_FIREBASE_ADMIN_KEY_client_email,
client_id:process.env.TEST_FIREBASE_ADMIN_KEY_client_id,
client_x509_cert_url:process.env.TEST_FIREBASE_ADMIN_KEY_client_x509_cert_url,
private_key:process.env.TEST_FIREBASE_ADMIN_KEY_private_key.replace(/\\n/g,"\n"),
private_key_id:process.env.TEST_FIREBASE_ADMIN_KEY_private_key_id,
project_id:process.env.TEST_FIREBASE_ADMIN_KEY_project_id,
token_uri:process.env.TEST_FIREBASE_ADMIN_KEY_token_uri,
type:process.env.TEST_FIREBASE_ADMIN_KEY_type};

_firebaseAdmin2.default.initializeApp({
credential:_firebaseAdmin2.default.credential.cert(serviceAccount),
databaseURL:process.env.TEST_FIREBASE_KEY_firebaseDatabaseURL});

return _firebaseAdmin2.default.database();
};exports.default=
SetupAdminDb;