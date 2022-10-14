import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  //  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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
const db = getFirestore();
const auth = getAuth();

// Collection reference
const colRef = collection(db, 'animals');

// Queries
const q = query(colRef, orderBy('createdAt'));

// Get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     let animals = [];
//     snapshot.docs.forEach((doc) => {
//       animals.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(animals);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// Get Realtime collection data
const unsubCollection = onSnapshot(q, (snapshot) => {
  let animals = [];
  snapshot.docs.forEach((doc) => {
    animals.push({ ...doc.data(), id: doc.id });
  });
  console.log(animals);
});

// Adding documents
const addAnimalForm = document.querySelector('.add');
addAnimalForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevents refresh of the page when submitting the form
  addDoc(colRef, {
    type: addAnimalForm.type.value,
    owner: addAnimalForm.owner.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addAnimalForm.reset();
  });
});

// Deleting documents
const deleteAnimalForm = document.querySelector('.delete');
deleteAnimalForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'animals', deleteAnimalForm.id.value);
  deleteDoc(docRef).then(() => {
    deleteAnimalForm.reset();
  });
});

// Get a document
const docRef = doc(db, 'animals', '1ytuNJKwoUpbNO8cLDFg');

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// Update a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'animals', updateForm.id.value);
  updateDoc(docRef, {
    owner: updateForm.owner.value,
  }).then(() => {
    updateForm.reset();
  });
});

// Sign Up Users
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //console.log('User created:', cred.user);
      signupForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Logging In Users
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //console.log('User logged in:', cred.user);
      loginForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Logging Out Users
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', (e) => {
  signOut(auth)
    .then(() => {
      //console.log('The user signed out');
    })
    .catch(() => {
      console.log(err.message);
    });
});

// Subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('User status changed:', user);
});

// Unsubscribing from changes (DB & Auth)
const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', () => {
  console.log('Unsubscribing...');
  unsubCollection();
  unsubDoc();
  unsubAuth();
});
