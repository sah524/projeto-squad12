import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
  authDomain: "ideia-space.firebaseapp.com",
  projectId: "ideia-space",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const listaGrupos = document.querySelector("#ranking-grupos");
const listaIndiv = document.querySelector("#ranking-individual");

async function carregarRanking() {
  const snap = await getDocs(query(collection(db, "ranking"), orderBy("pontuacao", "desc")));

  const dados = snap.docs.map(d => d.data());

  const grupos = {};
  dados.forEach(d => {
    if (!grupos[d.grupo]) grupos[d.grupo] = 0;
    grupos[d.grupo] += d.pontuacao;
  });

  const topGrupos = Object.entries(grupos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  listaGrupos.innerHTML = topGrupos.map(([grupo, pontos]) => `
    <li><span>${grupo}</span><strong>${pontos.toLocaleString()} pts</strong></li>
  `).join("");

  const topAlunos = dados.slice(0, 5);
  listaIndiv.innerHTML = topAlunos.map(d => `
    <li><span>${d.nome}</span><strong>${d.pontuacao.toLocaleString()} pts</strong></li>
  `).join("");
}

carregarRanking();
