import { db, auth } from "../../firebase.js";
import {
  ref, push, onValue, remove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const list = document.getElementById("notesList");
const noteRef = ref(db, "notes/" + auth.currentUser.uid);

window.addNote = async function(){
  const text = document.getElementById("noteInput").value;

  if(!text) return;

  await push(noteRef, {
    text,
    time: Date.now()
  });

  noteInput.value = "";
};

onValue(noteRef, snap=>{
  list.innerHTML = "";

  snap.forEach(child=>{
    const data = child.val();

    const div = document.createElement("div");
    div.innerHTML = `
      <p>${data.text}</p>
      <button onclick="delNote('${child.key}')">Hapus</button>
    `;

    list.appendChild(div);
  });
});

window.delNote = (id)=>{
  remove(ref(db, "notes/" + auth.currentUser.uid + "/" + id));
};