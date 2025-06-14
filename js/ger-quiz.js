import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, updateDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
  authDomain: "ideia-space.firebaseapp.com",
  projectId: "ideia-space",
  storageBucket: "ideia-space.firebasestorage.app",
  messagingSenderId: "987903785161",
  appId: "1:987903785161:web:b5331c4d5d304d49d43518"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const lista = document.querySelector(".lista-questoes");
const filtroForm = document.querySelector(".filtro-form");
const modal = document.getElementById("modal");
const btnClose = document.getElementById("close-btn");
const modalEnun = document.getElementById("modal-enunciado");
const modalAlt = document.getElementById("modal-alternativas");

async function carregarQuestoes(filtro = {}) {
  lista.innerHTML = "<p style='text-align:center'>⏳ Carregando...</p>";

  let q = collection(db, "perguntas");

  if (filtro.nivel) q = query(q, where("nivel", "==", filtro.nivel));
  if (filtro.tema) q = query(q, where("tema", "==", filtro.tema));

  const snap = await getDocs(q);

  let docs = snap.docs;
  if (filtro.search) {
    const s = filtro.search.toLowerCase();
    docs = docs.filter(d =>
      d.data().pergunta.toLowerCase().includes(s)
    );
  }

  if (!docs.length) {
    lista.innerHTML = "<p style='text-align:center'>Nenhuma questão encontrada.</p>";
    return;
  }

  lista.innerHTML = "";
  docs.forEach(d => renderItem(d));
}

function renderItem(docSnap) {
  const q = docSnap.data();
  const div = document.createElement("div");
  div.className = "questao-item";
  div.dataset.id = docSnap.id;

  div.innerHTML = `
    <p><strong>${q.tema.toUpperCase()} - Nível ${capitalize(q.nivel)}</strong><br/>
      ${q.pergunta}</p>
    <div class="botoes-acoes">
      <button class="visualizar">Visualizar</button>
      <button class="editar">Editar</button>
      <button class="remover">Remover</button>
    </div>
  `;
  lista.appendChild(div);

  div.querySelector(".visualizar").onclick = () => abrirModal(q, docSnap.id);
  div.querySelector(".remover").onclick = () => removerQuestao(docSnap.id, div);
  div.querySelector(".editar").onclick = () => abrirModal(q, docSnap.id);
}

let questaoAtualId = null;

function abrirModal(q, id) {
  questaoAtualId = id;
  document.getElementById("modal-enunciado-input").value = q.pergunta;

  modalAlt.innerHTML = q.opcoes.map((op, i) => `
    <input type="text" class="input-alternativa" value="${op}">
  `).join("");

  modal.classList.add("show");
}

document.querySelector(".btn-editar").onclick = async () => {
  if (!questaoAtualId) return;

  const novaPergunta = document.getElementById("modal-enunciado-input").value;
  const novasOpcoes = Array.from(document.querySelectorAll(".input-alternativa"))
    .map(input => input.value);

  if (!novaPergunta || novasOpcoes.some(op => !op)) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    await updateDoc(doc(db, "perguntas", questaoAtualId), {
      pergunta: novaPergunta,
      opcoes: novasOpcoes
    });
    alert("✅ Questão atualizada!");
    modal.classList.remove("show");
    carregarQuestoes();
  } catch (e) {
    console.error("Erro ao atualizar:", e);
    alert("Erro ao salvar alterações.");
  }
};

document.querySelector(".btn-remover").onclick = async () => {
  if (!questaoAtualId) return;
  if (!confirm("Deseja excluir esta questão?")) return;

  await deleteDoc(doc(db, "perguntas", questaoAtualId));
  alert("❌ Questão removida!");
  modal.classList.remove("show");
  carregarQuestoes();
};

btnClose.onclick = () => modal.classList.remove("show");

async function removerQuestao(id, elemento) {
  if (!confirm("Tem certeza que deseja remover esta questão?")) return;
  await deleteDoc(doc(db, "perguntas", id));
  elemento.remove();
  alert("❌ Questão removida.");
}

filtroForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const [searchInput, temaSel, nivelSel] = filtroForm.elements;
  carregarQuestoes({
    search: searchInput.value.trim(),
    tema: temaSel.value,
    nivel: nivelSel.value
  });
});

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

carregarQuestoes();
