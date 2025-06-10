import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

/* config */
const firebaseConfig = {
    apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
    authDomain: "ideia-space.firebaseapp.com",
    projectId: "ideia-space",
};
initializeApp(firebaseConfig);
const db = getFirestore();

/* pega tema da URL */
const params = new URLSearchParams(location.search);
const tema   = params.get("tema");

document.getElementById("tituloQuiz").textContent = `Quiz – ${tema.toUpperCase()}`;

/* carrega perguntas do tema */
const snap = await getDocs(
  query(collection(db, "perguntas"), where("tema","==",tema))
);
const perguntas = snap.docs.map(d => d.data());

/* estados */
let idx = 0;
let acertos = 0;

/* elementos */
const elPerg   = document.getElementById("pergunta");
const elOps    = document.getElementById("opcoes");
const btnNext  = document.getElementById("btnProximo");

mostrarPergunta();

/* mostra a pergunta atual --------------------------- */
function mostrarPergunta() {
  if (idx >= perguntas.length) return fim();
  const q = perguntas[idx];
  elPerg.textContent = q.pergunta;
  elOps.innerHTML = "";
  const alternativasEmbaralhadas = shuffle([...q.opcoes]);
  alternativasEmbaralhadas.forEach(op => {
    const div = document.createElement("div");
    div.className = "opcao";
    div.textContent = op;
    div.onclick = () => verificar(op, q.resposta);
    elOps.appendChild(div);
  });
}

/* verifica resposta --------------------------------- */
function verificar(escolha, correta) {
  [...document.querySelectorAll(".opcao")].forEach(div => {
    div.style.background = div.textContent === correta ? "#2e7d32" : "#7b1e1e";
    div.onclick = null;           // desativa clique
  });
  if (escolha === correta) acertos++;
  btnNext.classList.remove("hidden");
}

/* próximo ------------------------------------------- */
btnNext.onclick = () => {
  idx++;
  btnNext.classList.add("hidden");
  mostrarPergunta();
};

/* fim ---------------------------------------------- */
function fim() {
  elPerg.textContent  = `Fim! Você acertou ${acertos} de ${perguntas.length}.`;
  elOps.innerHTML     = "";
  btnNext.classList.add("hidden");
}

// Randomizar alternativas
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}