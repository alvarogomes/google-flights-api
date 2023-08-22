const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const GoogleFlightScraper = require('../helpers/googleFlightsScrapper');
const main = require('../index');
const app = main.app;

const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('GoogleFlightScraper', () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe('API Endpoint: POST /buscar-passagens', () => {
        it('should return scraped flights', async () => {
            const scraperStub = sandbox.stub(GoogleFlightScraper.prototype, 'scrapeFlights')
                .resolves([{ flight: 'details' }]);

            const response = await supertest(app)
                .post('/buscar-passagens')
                .send({
                    numeroPassagens: 1,
                    tipoPassagem: 'ida',
                    aeroportoOrigem: 'AirportA',
                    aeroportoDestino: 'AirportB',
                    dataInicio: '2023-08-22',
                    dataFim: '2023-08-23'
                });

            expect(response.status).to.equal(200);
            expect(response.body.flights).to.deep.equal([{ flight: 'details' }]);
            sinon.assert.calledOnce(scraperStub);
        });

    });
});
