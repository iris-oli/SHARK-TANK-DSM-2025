const perguntas = [
  {
    pergunta: "Você prefere comida rápida ou tradicional?",
    opcoes: [
      { texto: "Rápida", pontos: { pizza: 2 } },
      { texto: "Tradicional", pontos: { feijoada: 2 } },
      { texto: "Não sei", pontos: { aleatorio: 1 } }
    ]
  },
  {
    pergunta: "Você gosta de arroz?",
    opcoes: [
      { texto: "Sim", pontos: { sushi: 2 } },
      { texto: "Não", pontos: { pizza: 2, feijoada: 1 } },
      { texto: "Não sei", pontos: { aleatorio: 1 } }
    ]
  },
  {
    pergunta: "Prefere comida doce ou salgada?",
    opcoes: [
      { texto: "Doce", pontos: { pizza: 1, sushi: 1 } },
      { texto: "Salgada", pontos: { pizza: 1, feijoada: 2 } },
      { texto: "Não sei", pontos: { aleatorio: 1 } }
    ]
  },
  {
    pergunta: "Comida bem temperada?",
    opcoes: [
      { texto: "Sim", pontos: { feijoada: 2 } },
      { texto: "Não", pontos: { sushi: 1, pizza: 1 } },
      { texto: "Não sei", pontos: { aleatorio: 1 } }
    ]
  },
  {
    pergunta: "Prefere algo leve à noite?",
    opcoes: [
      { texto: "Sim", pontos: { sushi: 2 } },
      { texto: "Não", pontos: { pizza: 1, feijoada: 1 } },
      { texto: "Não sei", pontos: { aleatorio: 1 } }
    ]
  }
];

let pontosTotais = { pizza: 0, sushi: 0, feijoada: 0, aleatorio: 0 };
let currentIndex = 0;

const perguntaContainer = document.getElementById("pergunta-container");

loadPergunta();

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

function finalizarQuiz() {
  let resultadoFinal;

  if (pontosTotais.aleatorio >= perguntas.length) {
    const opcoes = ["pizza", "sushi", "feijoada"];
    resultadoFinal = opcoes[Math.floor(Math.random() * opcoes.length)];
  } else {
    resultadoFinal = Object.keys(pontosTotais)
      .filter(k => k !== "aleatorio")
      .reduce((a, b) => pontosTotais[a] > pontosTotais[b] ? a : b);
  }

  localStorage.setItem("preferenciaComida", resultadoFinal);

  document.getElementById("quiz").style.display = "none";
  document.getElementById("game").style.display = "flex";
}


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

function buscarRestaurantes() {
  resultadoDiv.textContent = "Buscando restaurantes próximos...";

  const lat = -23.55052;
  const lon = -46.633308;

  const url = `https://api.geoapify.com/v2/places?categories=restaurants&filter=circle:${lon},${lat},5000&limit=5&apiKey=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.features || data.features.length === 0) {
        resultadoDiv.textContent = "Nenhum restaurante encontrado próximo.";
        return;
      }

      resultadoDiv.innerHTML = "<strong>Restaurantes próximos:</strong><br><br>";
      data.features.forEach(r => {
        const nome = r.properties.name || "Sem nome";
        const endereco = r.properties.address_line1 || "";
        resultadoDiv.innerHTML += `<div style="margin-bottom:15px;">${nome} - ${endereco}</div>`;
      });
    })
    .catch(() => {
      resultadoDiv.textContent = "Erro ao buscar restaurantes.";
    });
}

lever.addEventListener("click", () => {
  if (intervaloAnimacao) return;

  iniciarAnimacao();

  setTimeout(() => {
    clearInterval(intervaloAnimacao);
    intervaloAnimacao = null;

    const preferencia = localStorage.getItem("preferenciaComida");
    let imageFinal = imagens.find(img => img.includes(preferencia));

    if (!imageFinal) {
      const aleatorias = ["pizza", "sushi", "feijoada"];
      const escolhida = aleatorias[Math.floor(Math.random() * aleatorias.length)];
      imageFinal = imagens.find(img => img.includes(escolhida));
    }

    slotImage.src = imageFinal;

    buscarRestaurantes();
  }, 2500);

const comidasVoadorasContainer = document.getElementById("comidas-voadoras");

const imagensComidasPequenas = {
  pizza: "imagens/pizza.png",
  sushi: "imagens/sushi.png",
  feijoada: "imagens/feijoada1.png",
  tacos: "imagens/tacos.png"
};

let intervaloComidasVoadoras = null;

function criarComidaVoadora(comida) {
  const comidaImg = document.createElement("img");
  comidaImg.src = imagensComidasPequenas[comida];
  comidaImg.classList.add("comida-voadora");

  const topo = 10 + Math.random() * 60;
  comidaImg.style.top = `${topo}vh`;
  comidaImg.style.left = "-60px";

  const duracao = 7000 + Math.random() * 6000;
  const delay = Math.random() * 5000;

  comidaImg.style.animation = `voar ${duracao}ms linear forwards`;
  comidaImg.style.animationDelay = `${delay}ms`;

  comidasVoadorasContainer.appendChild(comidaImg);
  comidaImg.addEventListener("animationend", () => {
    comidaImg.remove();
  });
}

lever.addEventListener("click", () => {

  setTimeout(() => {
    const preferencia = localStorage.getItem("preferenciaComida") || "pizza";

    if (intervaloComidasVoadoras) {
      clearInterval(intervaloComidasVoadoras);
    }

    criarComidaVoadora(preferencia);
    intervaloComidasVoadoras = setInterval(() => {
      criarComidaVoadora(preferencia);
    }, 1500);

  }, 2500);
});

}

);
