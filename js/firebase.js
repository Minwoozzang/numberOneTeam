// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js';

// 아래 데이터는 본인의 Firebase 프로젝트 설정에서 확인할 수 있습니다.
const firebaseConfig = {
  apiKey: "AIzaSyCMoLsI3xRU9iQNp-wha7u8-0hOJOU9AT8",
  authDomain: "crud-prac-70017.firebaseapp.com",
  databaseURL:
    "https://crud-prac-70017-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crud-prac-70017",
  storageBucket: "crud-prac-70017.appspot.com",
  messagingSenderId: "658511754696",
  appId: "1:658511754696:web:e543dcb8ea9a46c08bbcfd",
};

// const firebaseConfig = {
//   apiKey: 'AIzaSyD6ipaFLKbzCuJacJ0eBnjxSz7mdu5_WaE',
//   authDomain: 'b1project-ce77d.firebaseapp.com',
//   projectId: 'b1project-ce77d',
//   storageBucket: 'b1project-ce77d.appspot.com',
//   messagingSenderId: '180474355993',
//   appId: '1:180474355993:web:5c3c47d2bb57d8c92e2588',
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const dbService = getFirestore(app);
export const authService = getAuth(app);
export const storageService = getStorage(app);
//
//
//회수
// apiKey: "AIzaSyD6ipaFLKbzCuJacJ0eBnjxSz7mdu5_WaE",
// authDomain: "b1project-ce77d.firebaseapp.com",
// projectId: "b1project-ce77d",
// storageBucket: "b1project-ce77d.appspot.com",
// messagingSenderId: "180474355993",
// appId: "1:180474355993:web:5c3c47d2bb57d8c92e2588"

// 이전

// apiKey: 'AIzaSyAcvSIMog42rQqtuNk3ZnttD8VNDthDIPk',
// authDomain: 'testno1-a12da.firebaseapp.com',
// projectId: 'testno1-a12da',
// storageBucket: 'testno1-a12da.appspot.com',
// messagingSenderId: '636720579252',
// appId: '1:636720579252:web:38002fe747e3804a320de1',
