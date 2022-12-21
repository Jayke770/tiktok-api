import puppeteer from 'puppeteer'
const tiktokurl = `https://www.tiktok.com/`
const api = {
    fethUser: async (username) => {
        let data = { following: 0, name: '', followers: 0, likes: 0, username: username, bio: '', profile: '' }
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(`${tiktokurl}${username}`)
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
        data.profile = await page.$eval(".tiktok-1zpj2q-ImgAvatar", e => e.getAttribute('src'))
        await browser.close()
        return data
    },
    convertNumberAbbreviation: (str) => {
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
console.log(await api.fethUser("@jayke770"))