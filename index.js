/* invoke the library */
const { tmpdir } = require('os');
const puppeteer = require('puppeteer');

(async () => {
    /* Created a 'const browser' for use in the 'const page' and use for created a algorytm */
    const browser = await puppeteer.launch({ headless: false }); /* If you dont want to launch browser change "headless: false" to "headless: true" */
    const page = await browser.newPage();
    await page.goto('https://www.mercadolibre.com.ar');

    /* Enter to page,search IPhone 11 and take screenshot */
    await page.type('.nav-search-input', 'IPhone 11');
    await page.click('.nav-search-btn');
    await page.waitForXPath('//*[@id="root-app"]/div/div/section/ol/li[1]/div/div');

    /* Here push the info of the article on empty array  */
    const href = await page.evaluate(()=>{
        const elements = document.querySelectorAll('.ui-search-item__group__element');
        const links = [];
        for (let element of elements){
                links.push(element.href);
        }
        return links;
    });
    console.log (href);
        /* Created an array to put the information inside  */
        const iPhoneInfo = [];

        /* Here wait for charge selector (title) and move around links */
        for (let hrefs of href){
            await page.goto(hrefs);
            await page.waitForTimeout(3000);
             /* Extract the information of article (title and price) and return */
            const phone = await page.evaluate(()=>{
                const tpm = {};
                    tpm.title = document.getElementsByClassName('ui-pdp-title').innerText;
                    tpm.price = document.getElementsByClassName('.price-tag-fraction').innerText;
                return tpm;
            });
            /* push information */
            if (phone.title === undefined){
                console.log ('null')
            }
            else{
                iPhoneInfo.push(phone);
            }
        }

        console.log (iPhoneInfo);
    /* close browser */
    await browser.close();
})();
