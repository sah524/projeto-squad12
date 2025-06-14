import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";


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

console.log("🔥 Firebase inicializado");

const form = document.querySelector('.form-quiz');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("📥 Formulário enviado");

  const enunciado = document.getElementById('enunciado').value.trim();
  const nivel = document.getElementById('nivel').value;
  const tema = document.getElementById('tema').value;
  const inputs = form.querySelectorAll('input[type="text"]');

  const correta = inputs[0].value.trim();
  const incorretas = [inputs[1].value.trim(), inputs[2].value.trim(), inputs[3].value.trim()];

  const temasValidos = ["mercurio", "venus", "terra", "marte", "jupiter", "saturno", "urano", "netuno"];
  const niveisValidos = ["fundamental", "medio", "superior"];

  if (!enunciado || !correta || incorretas.some(i => !i)) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (!temasValidos.includes(tema)) {
    alert("Selecione um tema válido.");
    return;
  }

  if (!niveisValidos.includes(nivel)) {
    alert("Selecione um nível válido.");
    return;
  }

  const todas = [correta, ...incorretas].map(op => op.toLowerCase());
  const unicas = new Set(todas);
  if (unicas.size < 4) {
    alert("As alternativas devem ser diferentes.");
    return;
  }

  const questao = {
    pergunta: enunciado,
    resposta: correta,
    opcoes: [correta, ...incorretas],
    nivel: nivel,
    tema: tema,
    imagem: null
  };

  try {
    await addDoc(collection(db, "perguntas"), questao);
    alert("✅ Questão adicionada!");
    form.reset();
    document.getElementById('previewImagem').innerHTML = "";
  } catch (error) {
    console.error("❌ Erro ao salvar:", error);
    alert("Erro ao salvar a questão.");
  }
});