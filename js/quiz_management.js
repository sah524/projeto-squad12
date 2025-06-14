document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('close-btn');

    function openModal(questaoId) {
        console.log('Abrindo modal para a questão', questaoId);

        let questao = {};
        if (questaoId === "1") {
            questao = {
                enunciado: "O que é o vácuo espacial?",
                alternativas: ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"]
            };
        } else if (questaoId === "2") {
            questao = {
                enunciado: "Para que serve um satélite geoestacionário?",
                alternativas: ["Alternativa 1", "Alternativa 2", "Alternativa 3", "Alternativa 4"]
            };
        }

        document.getElementById('modal-enunciado').textContent = questao.enunciado;

        const alternativasDiv = document.getElementById('modal-alternativas');
        alternativasDiv.innerHTML = "";
        questao.alternativas.forEach(function (alternativa, index) {
            alternativasDiv.innerHTML += `<p>Alternativa ${index + 1}: ${alternativa}</p>`;
        });

        console.log('Conteúdo do modal:', questao);

        modal.classList.add('show');
    }

    closeBtn.addEventListener('click', function () {
        modal.classList.remove('show');
    });

    const botoesVisualizar = document.querySelectorAll('.visualizar');
    botoesVisualizar.forEach(button => {
        button.addEventListener('click', function () {
            const questaoId = this.getAttribute('data-id');
            openModal(questaoId);
            console.log('Modal aberto para a questão', questaoId);
        });
    });
});