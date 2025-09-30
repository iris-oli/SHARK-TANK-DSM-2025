const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Definição de categorias
const categorias = {
  pizza: { categoria: "catering.restaurant.pizza", palavra: null },
  chinesa: { categoria: "catering.restaurant", palavra: "chinese" },
  sushi: { categoria: "catering.restaurant", palavra: "sushi" },
  feijoada: { categoria: "catering.restaurant", palavra: "brazilian" },
  tacos: { categoria: "catering.restaurant", palavra: "mexican" }
};

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Endpoint para buscar restaurantes
app.get("/restaurantes", async (req, res) => {
  const { lat, lon, tipo } = req.query;

  if (!lat || !lon || !tipo) {
    return res.json({ erro: "Informe lat, lon e tipo nos query params" });
  }

  const config = categorias[tipo];
  if (!config) {
    return res.json({ erro: "Tipo de restaurante inválido." });
  }

  try {
    let url = `https://api.geoapify.com/v2/places?categories=${config.categoria}&filter=circle:${lon},${lat},5000&limit=5&apiKey=b3cc284131eb4f16a070140bd8b5ef50`;

    // Se tiver palavra-chave, adiciona no texto
    if (config.palavra) {
      url += `&text=${config.palavra}`;
    }

    const response = await axios.get(url);

    const restaurantes = response.data.features.map(r => ({
      nome: r.properties.name || "Sem nome",
      endereco: r.properties.address_line1 || "",
      linkMapa: `https://www.google.com/maps/search/?api=1&query=${r.properties.lat},${r.properties.lon}`
    }));

    res.json(restaurantes);
  } catch (err) {
    console.error("Erro Geoapify:", err.response ? err.response.data : err);
    res.json({ erro: "Erro ao buscar restaurantes." });
  }
});

app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
