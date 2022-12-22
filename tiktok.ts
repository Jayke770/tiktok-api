//@ts-nocheck
import puppeteer from 'puppeteer'
const tiktokurl = `https://www.tiktok.com/`
type UserData = {
    following?: number,
    name?: string | null,
    followers?: number,
    likes?: number,
    username?: string | null,
    bio?: string,
    profile?: string,
    link: string
}
const api = {
    fethUser: async (username?: string): Promise<{ status: boolean, data: UserData }> => {
        let data: UserData = {}
        console.log('fas', process.env.CHROME_PATH)
        const browser = await puppeteer.launch({
            executablePath: process.env.CHROME_PATH
        })
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0)
        await page.goto(`${tiktokurl}${username}`)
        const body = await page.$("body")
        const bodyText = await (await body?.getProperty("innerText")).jsonValue()
        if (bodyText.includes("Couldn't find this account")) {
            await browser.close()
            return { status: false, data: data }
        } else {
            //link 
            data.link = `${tiktokurl}${username}`
            //username 
            data.username = username
            //name
            const name = await page.$("[data-e2e='user-subtitle']")
            data.name = await (await name.getProperty("textContent")).jsonValue()
            //following
            const following = await page.$("[data-e2e='following-count']")
            data.following = api.convertNumberAbbreviation(await (await following.getProperty("textContent")).jsonValue())
            //followers
            const followers = await page.$("[data-e2e='followers-count']")
            data.followers = api.convertNumberAbbreviation(await (await followers.getProperty("textContent")).jsonValue())
            //likes
            const likes = await page.$("[data-e2e='likes-count']")
            data.likes = api.convertNumberAbbreviation(await (await likes.getProperty("textContent")).jsonValue())
            //bio 
            const bio = await page.$("[data-e2e='user-bio']")
            data.bio = await (await bio.getProperty("textContent")).jsonValue()
            //profile 
            data.profile = await page.$eval("#app > div.tiktok-ywuvyb-DivBodyContainer.e1irlpdw0 > div.tiktok-w4ewjk-DivShareLayoutV2.enm41490 > div > div.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2.enm41492 > div.tiktok-1gk89rh-DivShareInfo.ekmpd5l2 > div.tiktok-uha12h-DivContainer.e1vl87hj1 > span > img", e => e.getAttribute('src'))
            await browser.close()
            return { status: true, data: data }
        }
    },
    convertNumberAbbreviation: (str: string) => {
        const regex = /^([\d.]+)([a-z]+)$/i;
        const match = regex.exec(str);

        if (!match) {
            return parseInt(str);
        }

        const value = parseFloat(match[1]);
        const abbreviation = match[2].toLowerCase();

        switch (abbreviation) {
            case 'k':
                return value * 1000;
            case 'm':
                return value * 1000000;
            case 'b':
                return value * 1000000000;
            default:
                return parseInt(str);
        }
    }
}
export default api