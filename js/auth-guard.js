import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const app = initializeApp({
    apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
    authDomain: "ideia-space.firebaseapp.com",
    projectId: "ideia-space",
});

const auth = getAuth(app);

onAuthStateChanged(auth, (e) => {
  if (!e) {
    window.location.href = "index.html";
  }
});
