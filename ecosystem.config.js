module.exports = {
    apps: [{
        name: "bot",
        script: "./dist/bot.js",
        env_production: {
            NODE_ENV: "production"
        }
    }, {
        name: "api",
        script: "./dist/api.js"
    }]
}