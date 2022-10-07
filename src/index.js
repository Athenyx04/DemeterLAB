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
onSnapshot(q, (snapshot) => {
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

onSnapshot(docRef, (doc) => {
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
