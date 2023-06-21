const pup = require('puppeteer-core')
const {BROWSERLESS_KEY} = process.env
const executablePath = `C:/Users/Prince/.cache/puppeteer/chrome/win64-113.0.5672.63/chrome-win64/chrome.exe`


const defaultTimeout = 60 * 1000
const viewportWidth = 375
const viewportHeight = 667
const connToPuppeteer = async () => {
    // const browser = await pup.launch({
    //     headless: 'new',
    //     executablePath: executablePath,
    //     defaultViewport: { width: viewportWidth, height: viewportHeight }
    // })

    const browser = await pup.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_KEY}`,
        defaultViewport: { width: viewportWidth, height: viewportHeight },
    }, {timeout: 0})

    const page = await browser.newPage()
    await page.setDefaultTimeout(defaultTimeout)
    // await page.setExtraHTTPHeaders({
    //     'X-Forwarded-For': ip,
    // })
    // await page.setRequestInterception(true);

    // page.on('request', (request) => {
    //   if (request.resourceType() === 'image') {
    //     request.abort();
    //   } else {
    //     request.continue();
    //   }
    // });



    return {
        browser: browser,
        page: page
    }
}


module.exports = connToPuppeteer