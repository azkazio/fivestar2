import { db, auth } from "../../firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const el = document.getElementById("data");

const userRef = ref(db, "users/" + auth.currentUser.uid);

onValue(userRef, snap=>{
  el.innerHTML = JSON.stringify(snap.val());
});