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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const email = user.email;
        let ref;

        if (email.endsWith("@a.space.com")) {
            ref = doc(db, "alunos", email);
        } else if (email.endsWith("@p.space.com")) {
            ref = doc(db, "professores", email);
        }

        const snap = await getDoc(ref);

        if (snap.exists()) {
            const nome = snap.data().nome;
            document.querySelector(".usuario-info span").textContent = nome;
        } else {
            document.querySelector(".usuario-info span").textContent = email;
        }
    }
    if (user.photoURL) {
        avatarImg.src = user.photoURL;
    } else {
        avatarImg.src = "img/avataaars.svg";
    }
});

const avatarImg = document.getElementById("userAvatar");