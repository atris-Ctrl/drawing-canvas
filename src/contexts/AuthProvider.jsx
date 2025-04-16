import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
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

  const userGoogleSignIn = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      setUser(user);
    } catch (error) {
      const credential = GoogleAuthProvider.credentialFromError(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(`${errorCode} : ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  async function userLogin(email, password, displayName) {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ).then(async (userCredential) => {
        const user = userCredential.user;
        await updateProfile(user, { displayName });
        setUser(user);
      });
      // Signed in
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(`${errorCode} : ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function createNewUser(email, password) {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(`${errorCode} : ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function userSignOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = {
    user,
    isLoading,
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
