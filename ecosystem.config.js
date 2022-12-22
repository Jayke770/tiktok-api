module.exports = {
    apps: [{
        name: "tiktok-info-bot",
        script: "./dist/bot.js",
        env_production: {
            NODE_ENV: "production"
        }
    }, {
        name: "tiktok-info-api",
        script: "./dist/api.js"
    }]
}