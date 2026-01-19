import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
//import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCPqWDEGjFzMTQZdgAS1lQnAFFSp30n7_4",
  authDomain: "role-based-ecom.firebaseapp.com",
  projectId: "role-based-ecom",
  storageBucket: "role-based-ecom.firebasestorage.app",
  messagingSenderId: "Y466489047562",
  appId: "1:466489047562:web:531be6a86fce537f853df3",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
//export const storage = getStorage(app)



