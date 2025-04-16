import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { createContext, useContext, useState } from "react";
const firebaseConfig = {
  apiKey: "AIzaSyAwHAx-uiNDlP_fdn9_wFVBm2ryG8N0Rb0",
  authDomain: "drawing-canvas-4004e.firebaseapp.com",
  projectId: "drawing-canvas-4004e",
  storageBucket: "drawing-canvas-4004e.firebasestorage.app",
  messagingSenderId: "627720895603",
  appId: "1:627720895603:web:61b0061c10a5fdaa163e06",
  measurementId: "G-C0BPQLSWLG",
  databaseURL: "https://drawing-canvas-4004e-default-rtdb.firebaseio.com/",
};
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = "it";

  const userGoogleSignIn = () => {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(`${errorCode} : ${errorMessage}`);
      });
  };

  function userLogin(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(`${errorCode} : ${errorMessage}`);
      });
  }

  function createNewUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(`${errorCode} : ${errorMessage}`);
      });
  }

  function userSignOut() {
    return signOut(auth);
  }
  const value = {
    user,
    userLogin,
    errorMessage,
    createNewUser,
    userSignOut,
    userGoogleSignIn,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
