//Firebase_Config.ts


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth,  getReactNativePersistence} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { APIKEY
,AUTHDOMAIN
,PROJECTID
,STORAGEBUCKET
,MESSAGINGSENDERID
,APPID} from "@env"
// Your web app's Firebase configuration
const Firebase_Config = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID
  };


// Initialize Firebase
const FIREBASE_APP = initializeApp(Firebase_Config);
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);



export {FIREBASE_APP,FIREBASE_AUTH,FIREBASE_DB,FIREBASE_STORAGE};