import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const app = initializeApp({
    apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
    authDomain: "ideia-space.firebaseapp.com",
    projectId: "ideia-space",
});

const auth = getAuth(app);

// Botão de sair no menu
const sairBtn = document.querySelector("a[href='index.html']");
if (sairBtn) {
  sairBtn.addEventListener("click", (e) => {
    e.preventDefault(); // impede redirecionamento imediato
    signOut(auth).then(() => {
      window.location.href = "index.html";
    }).catch((error) => {
      console.error("Erro ao sair:", error);
    });
  });
}