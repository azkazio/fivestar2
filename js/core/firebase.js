// firebase.js - Konfigurasi dan Inisialisasi Firebase (Compat Mode)

const firebaseConfig = {
  apiKey: "AIzaSyAsINtnmVQthClAReXRk09k-AsDo9VIqDQ",
  authDomain: "five-star-2404.firebaseapp.com",
  databaseURL: "https://five-star-2404-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "five-star-2404",
  storageBucket: "five-star-2404.firebasestorage.app",
  messagingSenderId: "778881784522",
  appId: "1:778881784522:web:6d6d43d6213fdaf4b43233",
  measurementId: "G-Y71EN3MHVW"
};

// Pastikan Firebase belum diinisialisasi sebelumnya untuk mencegah error
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Jadikan variabel global agar bisa dipanggil di login.js, storage.js, register.js, dan main.js
// Menggunakan .database() untuk Realtime Database, BUKAN .firestore()
window.db = firebase.database();
window.auth = firebase.auth();

console.log("Firebase Realtime Database & Auth berhasil terhubung! 🔥");
