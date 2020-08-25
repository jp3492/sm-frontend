import { subgs } from "./../utils/rxGlobal";
import { getProfile } from "./../stores/profile";
import * as firebase from "firebase/app";
import "firebase/auth";

import { sgs } from "../utils/rxGlobal";

export const AUTH = "AUTH";

sgs(AUTH, false);

const firebaseConfig = {
  apiKey: "AIzaSyB6BP4nchauDnzgyP02JY8w4HlKq-Hn0Co",
  authDomain: "streaming-manager-dc49e.firebaseapp.com",
  databaseURL: "https://streaming-manager-dc49e.firebaseio.com",
  projectId: "streaming-manager-dc49e",
  storageBucket: "streaming-manager-dc49e.appspot.com",
  messagingSenderId: "1020740834639",
  appId: "1:1020740834639:web:d1f9d9f36f771d1c97213a",
  measurementId: "G-G26G4NTPC7"
};

export const getUser = () => firebase.auth().currentUser;

export const setAuthObserver = () => {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      // @ts-ignore
      const idToken = await firebase.auth().currentUser.getIdToken(false);
      localStorage.setItem("ID_TOKEN", idToken);
      sgs(AUTH, true);
      getProfile();
    } else {
      localStorage.removeItem("ID_TOKEN");
      sgs(AUTH, false);
    }
  });
};

export const initFirebase = async () => {
  try {
    // @ts-ignore
    await firebase.initializeApp(firebaseConfig);
  } catch (error) {
    console.log(error);
  }
};

export const register = async ({ email, password }) => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.log(error);
  }
};

export const login = async ({ email, password }) => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    sgs(AUTH, true);
  } catch (error) {
    sgs(AUTH, false);
    throw error;
  }
};

export const logout = async () => {
  try {
    await firebase.auth().signOut();
    localStorage.removeItem("ID_TOKEN");
    sgs(AUTH, false);
  } catch (error) {
    console.log(error);
  }
};

export default {
  register,
  login,
  logout
};
