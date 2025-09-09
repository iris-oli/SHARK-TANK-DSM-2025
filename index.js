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
        .then((res) => res.json())
        .then((data) => {
          if (!data.features || data.features.length === 0) {
            resultadoDiv.textContent = "Nenhum restaurante encontrado próximo.";
            return;
          }
          const restaurantesFiltrados = data.features.filter((feature) => {
            const nome = feature.properties.name?.toLowerCase() || "";
            return nome.includes(comida.toLowerCase());
          });
          const lista = restaurantesFiltrados.length ? restaurantesFiltrados : data.features;
          resultadoDiv.innerHTML = "<strong>Restaurantes próximos:</strong><br><br>";
          lista.forEach((restaurante) => {
            const nome = restaurante.properties.name || "Sem nome";
            const endereco = restaurante.properties.address_line1 || "";
            resultadoDiv.innerHTML += `<div style="margin-bottom: 15px;">${nome} - ${endereco}</div>`;
          });
        })
        .catch(() => {
          resultadoDiv.textContent = "Erro ao buscar restaurantes.";
        });
    },
    () => {
      resultadoDiv.textContent = "Permissão de localização negada.";
    }
  );
}

lever.addEventListener("click", () => {
  if (intervaloAnimacao) return;
  iniciarAnimacao();

  setTimeout(() => {
    clearInterval(intervaloAnimacao);
    intervaloAnimacao = null;

    const imageFinal = imagens[Math.floor(Math.random() * imagens.length)];
    slotImage.src = imageFinal;

    let comida = "";
    if (imageFinal.includes("chinesa")) comida = "chinesa";
    else if (imageFinal.includes("feijoada")) comida = "feijoada";
    else if (imageFinal.includes("pizza")) comida = "pizza";
    else if (imageFinal.includes("sushi")) comida = "sushi";
    else if (imageFinal.includes("tacos")) comida = "tacos";

    buscarRestaurantes(comida);
  }, 2500);
});
