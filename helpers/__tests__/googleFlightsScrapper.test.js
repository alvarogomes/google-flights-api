const chai = require('chai');
const sinon = require('sinon');
const GoogleFlightScraper = require('../googleFlightsScrapper');

const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('GoogleFlightScraper', () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe('Method: scrapeFlights', () => {
        it('should scrape flights and return flight details', async () => {
            // GIVEN
            const scraper = new GoogleFlightScraper();
            const expectedFlights = [
                {
                    thumbnail: 'https://www.gstatic.com/flights/airline_logos/70px/LA.png',
                    companyName: 'LATAMOperado por Latam Airlines Brasil',
                    description: 'Sai do aeroporto Aeroporto Internacional de São Luís às 16:15 do dia terça-feira, agosto 22 e chega no aeroporto Aeroporto Internacional de Brasília às 18:40 do dia terça-feira, agosto 22.',
                    duration: '2 h 25 min',
                    airportLeave: 'SLZ',
                    airportArive: 'BSB',
                    layover: 'Nonstop',
                    emisions: 'Estimativa das emissões de carbono: 113 quilos. 52% menos emissões. Saiba mais sobre as estimativas de emissão de carbono',
                    price: 'R$ 3.749',
                    priceDescription: '3749 Reais brasileiros'
                }
            ];

            const scrapeFunctionStub = sandbox.stub(scraper, 'scrapeFlights');
            scrapeFunctionStub.resolves(expectedFlights);

            // WHEN
            const result = await scraper.scrapeFlights(1, true, 'SLZ', 'BSB', '22/08/2023', '26/08/2023');

            // THEN
            expect(result).to.deep.equal(expectedFlights);
            sinon.assert.calledOnceWithExactly(scrapeFunctionStub, 1, true, 'SLZ', 'BSB', '22/08/2023', '26/08/2023');
        });
    });
});
