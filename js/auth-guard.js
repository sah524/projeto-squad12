import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
  authDomain: "ideia-space.firebaseapp.com",
  projectId: "ideia-space",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const scriptTag = document.currentScript;
const role = scriptTag?.getAttribute("data-role");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/index.html";
    return;
  }

  const email = user.email;

  if (role === "professor" && !email.endsWith("@p.space.com")) {
    alert("Acesso restrito a professores.");
    window.location.href = "/home.html";
  } else if (role === "aluno" && !email.endsWith("@a.space.com")) {
    alert("Acesso restrito a alunos.");
    window.location.href = "/professor/painel.html";
  }
});
