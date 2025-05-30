import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6F-lJsk6km_boR2El7MwPw6foDCA0pAE",
  authDomain: "crud-opr-82cc1.firebaseapp.com",
  databaseURL: "https://crud-opr-82cc1-default-rtdb.firebaseio.com",
  projectId: "crud-opr-82cc1",
  storageBucket: "crud-opr-82cc1.firebasestorage.app",
  messagingSenderId: "1095705596129",
  appId: "1:1095705596129:web:9ad8f99b3929dfaadd67a0",
  measurementId: "G-1XGE3DXY55",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
