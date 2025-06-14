import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
  authDomain: "ideia-space.firebaseapp.com",
  projectId: "ideia-space",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.querySelector(".botao-entrar").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.querySelector('input[type="email"]').value.trim();
  const senha = document.querySelector('input[type="password"]').value;

  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const credenciais = await signInWithEmailAndPassword(auth, email, senha);
    const userEmail = credenciais.user.email;

    if (userEmail.endsWith("@p.space.com")) {
      window.location.href = "/professor/painel.html";
    } else if (userEmail.endsWith("@a.space.com")) {
      window.location.href = "home.html";
    } else {
      alert("E-mail não autorizado.");
    }


  } catch (error) {
    console.error("Erro no login:", error.code);
    if (error.code === "auth/user-not-found") {
      alert("Usuário não encontrado.");
    } else if (error.code === "auth/wrong-password") {
      alert("Senha incorreta.");
    } else {
      alert("Erro ao fazer login.");
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const botaoEntrar = document.querySelector(".botao-entrar");
    if (botaoEntrar) {
      botaoEntrar.click();
    }
  }
});