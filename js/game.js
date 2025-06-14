import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBjc740shFmvEvOM_iTMaPVJHsV3xtpa_8",
    authDomain: "ideia-space.firebaseapp.com",
    projectId: "ideia-space",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userLevel = 0;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const ref = doc(db, "alunos", user.email);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            const dados = snap.data();
            userLevel = dados.nivel || 0;
            initializeGame();
        } else {
            alert("⚠️ Aluno não encontrado no banco.");
        }
    } else {
        window.location.href = "index.html";
    }
});

const elements = {
    messageBox: document.getElementById("messageBox"),
};

const planetsData = [
    { id: 'sun', name: 'Sol', levelRequired: 0 },
    { id: 'mercury', name: 'Mercúrio', levelRequired: 0 },
    { id: 'venus', name: 'Vênus', levelRequired: 1 },
    { id: 'earth', name: 'Terra', levelRequired: 2 },
    { id: 'mars', name: 'Marte', levelRequired: 3 },
    { id: 'jupiter', name: 'Júpiter', levelRequired: 4 },
    { id: 'saturn', name: 'Saturno', levelRequired: 5 },
    { id: 'uranus', name: 'Urano', levelRequired: 6 },
    { id: 'neptune', name: 'Netuno', levelRequired: 7 },
];

function showMessageBox(message, duration = 5000) {
    const msg = elements.messageBox;
    msg.textContent = message;
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), duration);
}

function initializePlanets() {
    planetsData.forEach(planet => {
        const planetElement = document.getElementById(planet.id);
        if (!planetElement) return;

        if (userLevel >= planet.levelRequired) {
            planetElement.classList.add('unlocked');
            planetElement.classList.remove('locked');
        } else {
            planetElement.classList.add('locked');
            planetElement.classList.remove('unlocked');
        }

        planetElement.addEventListener('mouseenter', () => {
            const msg = (userLevel >= planet.levelRequired)
                ? `✅ ${planet.name} desbloqueado!`
                : `🔒 ${planet.name} bloqueado - Nível ${planet.levelRequired}`;
            showMessageBox(msg);
        });

        planetElement.addEventListener('mouseleave', () => {
            elements.messageBox.classList.remove('show');
        });

        const planetTema = {
            mercury: "mercurio",
            venus: "venus",
            earth: "terra",
            mars: "marte",
            jupiter: "jupiter",
            saturn: "saturno",
            uranus: "urano",
            neptune: "netuno"
        };

        planetElement.addEventListener('click', () => {
            if (userLevel >= planet.levelRequired) {
                const tema = planetTema[planet.id];
                if (tema) {
                    window.location.href = `quiz.html?tema=${tema}`;
                } else {
                    showMessageBox(`❌ ${planet.name} ainda não tem quiz.`);
                }
            } else {
                showMessageBox(`🔒 Nível ${planet.levelRequired} necessário para acessar ${planet.name}.`);
            }
        });
    });
}

function initializeGame() {
    initializePlanets();
}