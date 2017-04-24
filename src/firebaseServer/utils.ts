import Admin from "firebase-admin";

const SetupAdminDb = () => {
  require("dotenv").config();
  const serviceAccount = {
    auth_provider_x509_cert_url: process.env.TEST_FIREBASE_ADMIN_KEY_auth_provider_x509_cert_url,
    auth_uri: process.env.TEST_FIREBASE_ADMIN_KEY_auth_uri,
    client_email: process.env.TEST_FIREBASE_ADMIN_KEY_client_email,
    client_id: process.env.TEST_FIREBASE_ADMIN_KEY_client_id,
    client_x509_cert_url: process.env.TEST_FIREBASE_ADMIN_KEY_client_x509_cert_url,
    private_key: process.env.TEST_FIREBASE_ADMIN_KEY_private_key.replace(/\\n/g, "\n"),
    private_key_id: process.env.TEST_FIREBASE_ADMIN_KEY_private_key_id,
    project_id: process.env.TEST_FIREBASE_ADMIN_KEY_project_id,
    token_uri: process.env.TEST_FIREBASE_ADMIN_KEY_token_uri,
    type: process.env.TEST_FIREBASE_ADMIN_KEY_type,
  };

  Admin.initializeApp({
    credential: Admin.credential.cert(serviceAccount),
    databaseURL: process.env.TEST_FIREBASE_KEY_firebaseDatabaseURL,
  });

  return Admin.database();
};

export default SetupAdminDb;
