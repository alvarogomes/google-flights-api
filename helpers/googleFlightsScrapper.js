const puppeteer = require('puppeteer');

class GoogleFlightScraper {
    constructor() {
        this.URL = `https://www.google.com/travel/flights?hl=pt-BR&curr=BRL`;
        this.browser = null;
        this.page = null;
    }

    async initialize() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        this.page = await this.browser.newPage();
        this.page.setViewport({
            width: 1280,
            height: 720,
        });
        this.page.setDefaultNavigationTimeout(60000);
        await this.page.goto(this.URL);
        await this.page.waitForSelector('.e5F5td');
    }

    async selectOneWay() {
        await this.page.click('.UGrfjc .VfPpkd-RLmnJb');
        await this.page.waitForTimeout(1000);
        await this.page.click('.VfPpkd-qPzbhe-JNdkSc > li:last-child');
        await this.page.waitForTimeout(1000);
        await this.page.click('.A8nfpe .akjk5c  .VfPpkd-vQzf8d');
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Enter');
    }

    async selectFromTo(from, to) {
        const inputs = await this.page.$$(".e5F5td");

        await inputs[0].click();
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.type(from);
        await this.page.keyboard.press("Enter");

        await inputs[1].click();
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.type(to);
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press("Enter");
        await this.page.waitForTimeout(1000);
    }
    async setStartDate(startDate) {
        // TP4Lpb eoY5cb j0Ppje
        await this.page.waitForTimeout(1000);
        await this.page.type('input[placeholder="Partida"]', startDate);
        await this.page.keyboard.press("Enter");

    }
    async setEndDate(endDate) {
        // TP4Lpb eoY5cb j0Ppje
        await this.page.waitForTimeout(1000);
        await this.page.type('input[placeholder="Volta"]', endDate);
        await this.page.keyboard.press("Enter");
    }

    async searchFlights() {
        await this.page.waitForTimeout(1000);
        await this.page.click('button[aria-label="Pesquisar"]');
        await this.page.waitForSelector('.pIav2d');
        const moreButton = await this.page.$('.XsapA');
        if (moreButton) {
            await moreButton.click();
            await this.page.waitForTimeout(2000);
        }
    }

    async getFlightsFromPage() {
        const flightElements = await this.page.$$(".pIav2d");

        const getElement = async (element, selector) => await element.$(selector);
        const getElementText = async (page, element) => await page.evaluate(el => el.textContent.trim(), element);

        const flights = [];
        for (const el of flightElements) {
            const element = await getElement(el, ".EbY4Pc");
            if (element) {
                const thumbnailString = await this.page.evaluate(el => el.getAttribute('style'), element)                

                const startIndex = thumbnailString.indexOf("url(");
                const endIndex = thumbnailString.indexOf(";");
                const thumbnail = (startIndex !== -1 && endIndex !== -1)
                    ? thumbnailString.slice(startIndex + 4, endIndex - 1).replaceAll("\\", "")
                    : "No thumbnail";
                const layoverElement = await el.$(".BbR8Ec .sSHqwe");
                const layover =  await this.page.evaluate(el => el.getAttribute('aria-label'), layoverElement);
                
                const description = await this.page.evaluate(el => el.getAttribute('aria-label'), await getElement(el, ".mv1WYe"));
                const emisions = await this.page.evaluate(el => el.getAttribute('aria-label'), await getElement(el, ".V1iAHe > div"));
                const priceElement = await getElement(el, ".U3gSDe > div > div.YMlIz > span");
                const priceDescription = await this.page.evaluate(el => el.getAttribute('aria-label'), priceElement);
                
                const companyName = await getElementText(this.page, await getElement(el, ".Ir0Voe .sSHqwe"));
                const duration = await getElementText(this.page, await getElement(el, ".gvkrdb"));

                const airportElements = await this.page.$$('.Ak5kof .sSHqwe > span > span > span');
                const airportNames = await Promise.all(airportElements.map(async el => {
                    const airportName = await this.page.evaluate(airportEl => airportEl.textContent, el);
                    return airportName;
                }));
                const airportLeave = airportNames[0];
                const airportArive = airportNames[1];

                const price = await getElementText(this.page, await getElement(el, ".U3gSDe > div > div.YMlIz > span"))

                flights.push({
                    thumbnail,
                    companyName: companyName,
                    description: description,
                    duration: duration,
                    airportLeave: airportLeave,
                    airportArive: airportArive,
                    layover: layover || "Nonstop",
                    emisions: emisions.replace(". Learn more about this emissions estimate", " "),
                    price: price,
                    priceDescription: priceDescription
                });
            }
        }
        return flights;
    }

    async scrapeFlights(number, oneWay, from, to, startDate, endDate) {
        await this.initialize();
        await this.selectFromTo(from, to);
        await this.setStartDate(startDate);
        if (endDate) {
            await this.setEndDate(endDate);
        }
        if (oneWay) {
            await selectOneWay();
        }
        await this.searchFlights();
        const flights = await this.getFlightsFromPage();
        await this.browser.close();
        return flights;
    }

}

module.exports = GoogleFlightScraper;