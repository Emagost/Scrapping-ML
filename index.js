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
    await page.waitForSelector("li.ui-search-layout__item");

    /* Here push the info of the article on empty array  */
    const href = await page.evaluate(()=>{
        const elements = document.querySelectorAll(".ui-search-item__group--title a.ui-search-item__group__element");

        const links = [];

        for (let element of elements){
                links.push(element.href);
        }
        return links;
    });
        /* Created an array to put the information inside  */
        const iPhoneInfo = [];

        /* Here wait for charge selector (title) and move around links */
        for (let hrefs of href){
            await page.goto(hrefs);
            await page.waitForSelector(".ui-pdp-header__title-container");
             /* Extract the information of article (title and price) and return */
            const phone = await page.evaluate(()=>{
                const tpm = {};
                try{
                        tpm.title = document.querySelector(".ui-pdp-title").innerText.includes("iPhone 11") && !document.querySelector(".ui-pdp-title").innerText.includes("Pro") ? document.querySelector(".ui-pdp-title").innerText : null;
                        tpm.price = parseFloat(document.querySelector(".price-tag-fraction").innerText) * 1000;
                    return tpm;
                }catch(error){
                    console.log (error);
                }
            });

        phone.link = href;

        if (phone.title && phone.price > 170000) iPhoneInfo.push(phone);
        }

        console.log (iPhoneInfo, iPhoneInfo.length);
    /* close browser */
    await browser.close();
})();
