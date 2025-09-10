// QUIZ PERGUNTAS
const perguntas = [
  {
    pergunta: "Você prefere comida rápida ou tradicional?",
    opcoes: [
      { texto: "Rápida", pontos: { pizza: 2, sushi: 0, feijoada: 0 } },
      { texto: "Tradicional", pontos: { pizza: 0, sushi: 0, feijoada: 2 } },
      { texto: "Leve", pontos: { pizza: 0, sushi: 2, feijoada: 0 } },
    ]
  },
  {
    pergunta: "Você gosta de arroz?",
    opcoes: [
      { texto: "Sim", pontos: { sushi: 2 } },
      { texto: "Não", pontos: { pizza: 2, feijoada: 1 } },
    ]
  },
  {
    pergunta: "Prefere comida doce ou salgada?",
    opcoes: [
      { texto: "Doce", pontos: { pizza: 1, feijoada: 0, sushi: 1 } },
      { texto: "Salgada", pontos: { pizza: 1, feijoada: 2, sushi: 0 } },
    ]
  },
  {
    pergunta: "Comida bem temperada?",
    opcoes: [
      { texto: "Sim", pontos: { feijoada: 2 } },
      { texto: "Não", pontos: { sushi: 1, pizza: 1 } },
    ]
  },
  {
    pergunta: "Prefere algo leve à noite?",
    opcoes: [
      { texto: "Sim", pontos: { sushi: 2 } },
      { texto: "Não", pontos: { pizza: 1, feijoada: 1 } },
    ]
  }
];

let pontosTotais = { pizza: 0, sushi: 0, feijoada: 0 };
let currentIndex = 0;

const perguntaContainer = document.getElementById("pergunta-container");
const nextBtn = document.getElementById("next-btn");


//INICIA AS PERGUNTAS
loadPergunta();


// CARREGA PERGUNTA
function loadPergunta() {
  const current = perguntas[currentIndex];
  perguntaContainer.innerHTML = `<p>${current.pergunta}</p>`;
  current.opcoes.forEach(op => {
    const btn = document.createElement("button");
    btn.textContent = op.texto;
    btn.onclick = () => escolherResposta(op.pontos);
    perguntaContainer.appendChild(btn);
  });
}


// SOMA OS PONTOS
function escolherResposta(pontos) {
  for (let key in pontos) {
    pontosTotais[key] += pontos[key] || 0;
  }
  currentIndex++;
  if (currentIndex < perguntas.length) {
    loadPergunta();
  } else {
    finalizarQuiz();
  }
}


// FINALIZA O QUIS E MOSTRA A MÁQUINA
function finalizarQuiz() {
  const resultadoFinal = Object.keys(pontosTotais).reduce((a,b) => pontosTotais[a] > pontosTotais[b] ? a : b);
  localStorage.setItem("preferenciaComida", resultadoFinal);

  document.getElementById("quiz").style.display = "none";
  document.getElementById("game").style.display = "flex";
}

// --- CÓDIGO DAS MENINAS ---
const imagens = [
  "imagens/chinesa.jpg",
  "imagens/feijoada.jpg",
  "imagens/pizza.jpg",
  "imagens/sushi.jpg",
  "imagens/tacos.jpg"
];

const slotImage = document.getElementById("slotImg");
const lever = document.getElementById("lever");
const resultadoDiv = document.getElementById("resultado");

const apiKey = "0a9ea7f11f704b10831a9ac1d7ee5472";

let intervaloAnimacao = null;

function iniciarAnimacao() {
  let contador = 0;
  intervaloAnimacao = setInterval(() => {
    slotImage.src = imagens[contador % imagens.length];
    contador++;
  }, 80);
}

function buscarRestaurantes(comida) {
  if (!navigator.geolocation) {
    resultadoDiv.textContent = "Geolocalização não suportada pelo navegador.";
    return;
  }

  resultadoDiv.textContent = "Buscando restaurantes próximos...";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const url = `https://api.geoapify.com/v2/places?categories=restaurants&filter=circle:${lon},${lat},5000&limit=5&apiKey=${apiKey}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (!data.features || data.features.length === 0) {
            resultadoDiv.textContent = "Nenhum restaurante encontrado próximo.";
            return;
          }

          const restaurantesFiltrados = data.features.filter(f => (f.properties.name?.toLowerCase() || "").includes(comida.toLowerCase()));
          const lista = restaurantesFiltrados.length ? restaurantesFiltrados : data.features;

          resultadoDiv.innerHTML = "<strong>Restaurantes próximos:</strong><br><br>";
          lista.forEach(r => {
            const nome = r.properties.name || "Sem nome";
            const endereco = r.properties.address_line1 || "";
            resultadoDiv.innerHTML += `<div style="margin-bottom:15px;">${nome} - ${endereco}</div>`;
          });
        })
        .catch(() => { resultadoDiv.textContent = "Erro ao buscar restaurantes."; });
    },
    () => { resultadoDiv.textContent = "Permissão de localização negada."; }
  );
}

lever.addEventListener("click", () => {
  if (intervaloAnimacao) return;

  iniciarAnimacao();

  setTimeout(() => {
    clearInterval(intervaloAnimacao);
    intervaloAnimacao = null;

    const preferencia = localStorage.getItem("preferenciaComida");
    const imageFinal = imagens.find(img => img.includes(preferencia)) || imagens[Math.floor(Math.random()*imagens.length)];
    slotImage.src = imageFinal;

    buscarRestaurantes(preferencia);
  }, 2500);
});
