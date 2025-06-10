// INÍCIO DO CÓDIGO JAVASCRIPT DO JOGO DO SISTEMA SOLAR (IDENTIFICADOR JS)
const elements = {
    gameContainer: document.getElementById('gameContainer'),
    planetsGrid: document.getElementById('planetsGrid'), // Novo contêiner para os planetas
    messageBox: document.getElementById('messageBox'),
    // Elementos de quiz e navegação (foguete, botões) foram removidos
};

// Nível atual do usuário (simulado para demonstração)
// Você pode carregar isso de um banco de dados ou localStorage
const userLevel = 3; // Exemplo: Usuário está no nível 3

// Dados dos planetas, incluindo o nível necessário para "desbloqueá-los"
const planetsData = [
    {
        id: 'sun', name: 'Sol', description: 'A estrela central do nosso Sistema Solar.', size: '15vw', levelRequired: 0
    },
    {
        id: 'mercury', name: 'Mercúrio', description: 'O menor e mais próximo planeta do Sol.', size: '4vw', levelRequired: 1
    },
    {
        id: 'venus', name: 'Vênus', description: 'O segundo planeta do Sol, conhecido por sua atmosfera densa.', size: '7vw', levelRequired: 1
    },
    {
        id: 'earth', name: 'Terra', description: 'Nosso lar, o único planeta com vida conhecida.', size: '6vw', levelRequired: 2
    },
    {
        id: 'mars', name: 'Marte', description: 'O "Planeta Vermelho", foco de exploração espacial.', size: '5vw', levelRequired: 2
    },
    {
        id: 'jupiter', name: 'Júpiter', description: 'O maior planeta, um gigante gasoso.', size: '15vw', levelRequired: 3
    },
    {
        id: 'saturn', name: 'Saturno', description: 'Famoso por seus anéis impressionantes.', size: '10vw', levelRequired: 3
    },
    {
        id: 'uranus', name: 'Urano', description: 'Um gigante de gelo com uma atmosfera azul-esverdeada.', size: '7vw', levelRequired: 4
    },
    {
        id: 'neptune', name: 'Netuno', description: 'O planeta mais distante, com ventos extremamente fortes.', size: '6vw', levelRequired: 4
    },
    {
        id: 'pluto', name: 'Plutão', description: 'Um planeta anão no cinturão de Kuiper.', size: '3vw', levelRequired: 5
    }
];

function showMessageBox(message, duration = 3000) {
    elements.messageBox.textContent = message;
    elements.messageBox.classList.add('show');
    setTimeout(() => {
        elements.messageBox.classList.remove('show');
    }, duration);
}

function initializePlanets() {
    planetsData.forEach((planet) => {
        const planetElement = document.getElementById(planet.id);
        if (planetElement) {
            // Define o tamanho (pode ser ajustado individualmente no CSS agora)
            // planetElement.style.width = planet.size;
            // planetElement.style.height = planet.size;

            // Adiciona o nome do planeta (já adicionado no HTML)
            // const planetNameDiv = planetElement.querySelector('.planet-name');
            // if (planetNameDiv) {
            //     planetNameDiv.textContent = planet.name;
            // }

            // Lógica para o indicador de nível
            const levelIndicator = planetElement.querySelector('.level-indicator');
            if (levelIndicator) {
                if (userLevel >= planet.levelRequired) {
                    planetElement.classList.add('unlocked'); // Adiciona classe para estilizar
                    // levelIndicator.textContent = '✔️'; // Exemplo de ícone, pode ser vazio ou outro
                } else {
                    // levelIndicator.textContent = `Nível ${planet.levelRequired}`; // Mostra o nível necessário
                    planetElement.classList.add('locked'); // Opcional: para estilizar planetas bloqueados
                }
            }

            // Adiciona listener para hover para mostrar nome e nível
            planetElement.addEventListener('mouseenter', () => {
                let statusMessage = `Nível necessário: ${planet.levelRequired}`;
                if (userLevel >= planet.levelRequired) {
                    statusMessage = `Desbloqueado! Seu Nível: ${userLevel}`;
                } else {
                    statusMessage = `Bloqueado. Nível necessário: ${planet.levelRequired}`;
                }
                showMessageBox(`${planet.name} - ${statusMessage}`);
            });
            planetElement.addEventListener('mouseleave', () => {
                elements.messageBox.classList.remove('show');
            });

            const planetTema = {
            mercury: "mercurio",
            venus:   "venus",
            earth:   "terra",
            mars:    "marte",
            jupiter: "jupiter",
            saturn:  "saturno",
            uranus:  "urano",
            neptune: "netuno"
            };
            planetElement.addEventListener("click", () => {
            if (userLevel >= planet.levelRequired) {
                const tema = planetTema[planet.id];
                if (tema) {
                window.location.href = `quiz.html?tema=${tema}`;
                } else {
                showMessageBox("Este planeta ainda não tem quiz.");
                }
            } else {
                showMessageBox(`Você precisa do nível ${planet.levelRequired}.`);
              }
            });
        }
    });
}

// Funções de inicialização
function initializeGame() {
    initializePlanets();
    // Não há mais necessidade de highlightPlanet ou ajustes de movimento
}

window.addEventListener('load', initializeGame);
window.addEventListener('resize', initializeGame); // Re-executa para ajustar layout se a tela mudar
// FIM DO CÓDIGO JAVASCRIPT DO JOGO DO SISTEMA SOLAR (IDENTIFICADOR JS)
