import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  Api,
  appIdmessaging,
  authDomain,
  projectId,
  storageBucket,
} from './Config.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Api,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appIdmessaging,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
