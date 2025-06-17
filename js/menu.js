import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
  authDomain: "ideia-space.firebaseapp.com",
  projectId: "ideia-space",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

const menuEsquerda = document.getElementById("menuEsquerda");
const avatarImg = document.getElementById("userAvatar");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const email = user.email;
    let ref;
    let role;

    if (email.endsWith("@a.space.com")) {
      ref = doc(db, "alunos", email);
      role = "aluno";
    } else if (email.endsWith("@p.space.com")) {
      ref = doc(db, "professores", email);
      role = "professor";
    } else {
      alert("Domínio de e-mail inválido.");
      window.location.href = "/index.html";
      return;
    }

    const snap = await getDoc(ref);
    const nome = snap.exists() ? snap.data().nome : email;
    document.querySelector(".usuario-info span").textContent = nome;

    if (user.photoURL) {
      avatarImg.src = user.photoURL;
    } else {
      avatarImg.src = "img/avataaars.svg";
    }

    if (role === "professor") {
      menuEsquerda.innerHTML = `
        <img src="img/idea-space-logo-branca.png" alt="Logo" class="logo-menu" />
        <a href="/professor/painel.html">PAINEL</a>
        <a href="/professor/ger-quiz.html">GERENCIAR QUIZZES</a>
        <a href="/professor/criar-quiz.html">CRIAR QUIZ</a>
        <a href="/ranking.html">RANKING</a>
      `;
    } else {
      menuEsquerda.innerHTML = `
        <img src="img/idea-space-logo-branca.png" alt="Logo" class="logo-menu" />
        <a href="home.html">HOME</a>
        <a href="quizzes.html">QUIZZES</a>
        <a href="ranking.html">RANKING</a>
      `;
    }
  } else {
    window.location.href = "/index.html";
  }
});
