import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, addDoc, query, where, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
  authDomain: "ideia-space.firebaseapp.com",
  projectId: "ideia-space",
};
initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

const params = new URLSearchParams(location.search);
const tema = params.get("tema");

document.getElementById("tituloQuiz").textContent = `Quiz – ${tema.toUpperCase()}`;

const snap = await getDocs(
  query(collection(db, "perguntas"), where("tema", "==", tema))
);
const perguntas = snap.docs.map(d => d.data());

let idx = 0;
let acertos = 0;

const elPerg = document.getElementById("pergunta");
const elOps = document.getElementById("opcoes");
const btnNext = document.getElementById("btnProximo");

mostrarPergunta();

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

function verificar(escolha, correta) {
  [...document.querySelectorAll(".opcao")].forEach(div => {
    div.style.background = div.textContent === correta ? "#2e7d32" : "#7b1e1e";
    div.onclick = null;
  });
  if (escolha === correta) acertos++;
  btnNext.classList.remove("hidden");
}

btnNext.onclick = () => {
  idx++;
  btnNext.classList.add("hidden");
  mostrarPergunta();
};

async function fim() {
  const total = perguntas.length;

  const pontuacaoAtual = total > 0 ? Math.round((1000 / total) * acertos) : 0;

  const user = auth.currentUser;

  if (user) {
    let nomeToSave = user.email ? user.email.split("@")[0] : 'Anonymous';

    if (user.email) {
      let userRef;
      if (user.email.endsWith("@a.space.com")) {
        userRef = doc(db, "alunos", user.email);
      } else if (user.email.endsWith("@p.space.com")) {
        userRef = doc(db, "professores", user.email);
      }

      if (userRef) {
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            nomeToSave = snap.data().nome;
          }
        } catch (error) {
          console.error("Erro ao buscar nome do usuário para ranking:", error);
        }
      }
    }

    try {

      const rankingQuery = query(
        collection(db, "ranking"),
        where("email", "==", user.email),
        where("tema", "==", tema)
      );
      const existingRankingSnap = await getDocs(rankingQuery);

      if (!existingRankingSnap.empty) {

        const existingDoc = existingRankingSnap.docs[0];
        const oldPontuacao = existingDoc.data().pontuacao || 0;
        const novaPontuacaoTotal = oldPontuacao + pontuacaoAtual;

        await updateDoc(doc(db, "ranking", existingDoc.id), {
          pontuacao: novaPontuacaoTotal,
          data: new Date().toISOString()
        });
        console.log("Pontuação atualizada com sucesso no ranking.");
      } else {

        await addDoc(collection(db, "ranking"), {
          nome: nomeToSave,
          email: user.email || 'anonymous',
          tema: tema,
          pontuacao: pontuacaoAtual,
          data: new Date().toISOString()
        });
        console.log("Nova pontuação adicionada com sucesso ao ranking.");
      }
    } catch (error) {
      console.error("Erro ao salvar pontuação no ranking:", error);
    }
  } else {
    console.log("Usuário não autenticado, pontuação não salva no ranking.");
  }

  const nivelDoTema = {
    mercurio: 1,
    venus: 2,
    terra: 3,
    marte: 4,
    jupiter: 5,
    saturno: 6,
    urano: 7,
    netuno: 8
  }[tema] || 0;

  const alunoRef = doc(db, "alunos", user.email);
  const snapAluno = await getDoc(alunoRef);

  if (snapAluno.exists()) {
    const dados = snapAluno.data();
    const nivelAtual = dados.nivel || 0;

    if (nivelDoTema > nivelAtual) {
      await updateDoc(alunoRef, { nivel: nivelDoTema });
      alert(`🎉 Você desbloqueou o nível ${nivelDoTema}!`);
    }
  }

  elPerg.textContent = `Fim do Quiz! Você acertou ${acertos} de ${total} perguntas, com uma pontuação de ${pontuacaoAtual} Pts.`;
  elOps.innerHTML = "";
  btnNext.classList.add("hidden");
  elUserId.classList.add("hidden");
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}