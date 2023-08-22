const express = require('express');
const GoogleFlightScraper = require("./helpers/googleFlightsScrapper")
require('dotenv').config()

const main = {}

main.app = express();
main.app.use(express.json());

main.app.post('/buscar-passagens', async (req, res) => {
    const { numeroPassagens, tipoPassagem, aeroportoOrigem, aeroportoDestino, dataInicio, dataFim } = req.body;
    const scraper = new GoogleFlightScraper();
    const oneWay = (tipoPassagem != "ida e volta");
    const flights = await scraper.scrapeFlights(numeroPassagens, oneWay, aeroportoOrigem, aeroportoDestino, dataInicio, dataFim);
    res.json({ flights: flights });
});

const PORT = process.env.PORT || 3000;

main.app.listen(PORT, () => {
    console.log(`Google Flights Scrapper rodando na porta ${PORT}`);
});

module.exports = main