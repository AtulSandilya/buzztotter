import * as admin from "firebase-admin";

const SetupAdminDb = (environmentVars?: object, name?: string) => {
  require("dotenv").config();
  const env = environmentVars ? environmentVars : process.env;
  const serviceAccount = {
    auth_provider_x509_cert_url:
      env.FIREBASE_ADMIN_KEY_auth_provider_x509_cert_url,
    auth_uri: env.FIREBASE_ADMIN_KEY_auth_uri,
    client_email: env.FIREBASE_ADMIN_KEY_client_email,
    client_id: env.FIREBASE_ADMIN_KEY_client_id,
    client_x509_cert_url: env.FIREBASE_ADMIN_KEY_client_x509_cert_url,
    private_key: env.FIREBASE_ADMIN_KEY_private_key.replace(/\\n/g, "\n"),
    private_key_id: env.FIREBASE_ADMIN_KEY_private_key_id,
    project_id: env.FIREBASE_ADMIN_KEY_project_id,
    token_uri: env.FIREBASE_ADMIN_KEY_token_uri,
    type: env.FIREBASE_ADMIN_KEY_type,
  };

  // Firebase has a weird way of initializing another admin db after the
  // initial admin db has been created. See:
  // https://firebase.google.com/docs/admin/setup#initialize_multiple_apps
  if (name) {
    const secondaryDb = admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: env.FIREBASE_ADMIN_KEY_firebaseDatabaseURL,
      },
      name,
    );

    return secondaryDb.database();
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: env.FIREBASE_ADMIN_KEY_firebaseDatabaseURL,
    });

    return admin.database();
  }
};

export default SetupAdminDb;
