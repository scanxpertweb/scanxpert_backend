import admin, { ServiceAccount } from 'firebase-admin';
import path from 'path';
import { serviceAccount } from './service';


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

export default admin;
