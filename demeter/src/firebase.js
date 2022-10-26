import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  where,
  getDocs,
  query,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDKZmXaTxjQ8H5obf6dz7PlhdiqC9Hz898',
  authDomain: 'demeterlab.firebaseapp.com',
  projectId: 'demeterlab',
  storageBucket: 'demeterlab.appspot.com',
  messagingSenderId: '1054593608090',
  appId: '1:1054593608090:web:df1458a27f94763ca8f223',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Sign In with Google
const googleProvider = new GoogleAuthProvider();
const signInGoogle = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    const user = response.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

// Log In with Email/Password
const logInEmailPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err.message);
  }
};

// Register with Email/Password
const registerEmailPassword = async (name, email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = response.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
  } catch (err) {
    console.log(err.message);
  }
};

// Need checking of same email address

// Send password reset
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset link sent to email!');
  } catch (err) {
    console.log(err.message);
  }
};

// Log-out user
const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInGoogle,
  logInEmailPassword,
  registerEmailPassword,
  sendPasswordReset,
  logout,
};
