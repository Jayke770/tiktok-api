import tiktok from './tiktok'
import { Bot, Context, session } from 'grammy'
import { run } from "@grammyjs/runner"
import { apiThrottler } from "@grammyjs/transformer-throttler"
import { type Conversation, type ConversationFlavor, conversations, createConversation, } from "@grammyjs/conversations"
type MyContext = Context & ConversationFlavor
type MyConversation = Conversation<MyContext>
const { BOT_TOKEN } = process.env
const bot = new Bot<MyContext>(BOT_TOKEN as string)
const throttler = apiThrottler()
bot.api.config.use(throttler)
bot.use(session({ initial: () => ({}) }))
bot.use(conversations())
async function start(convo: MyConversation, ctx: MyContext) {
    await ctx.reply("Enter TikTok Username:")
    const { message } = await convo.wait()
    await ctx.reply("Checking Tiktok Username...")
    const { status, data } = await tiktok.fethUser(message?.text)
    if (status) {
        let text = '<b>ℹ️ User Tiktok Information</b>\n\n'
        text += `<b>🔠 Name:</b> ${data.name}\n`
        text += `<b>👤 Username:</b> ${data.username}\n`
        text += `<b>📝 Bio:</b> ${data.bio}\n`
        text += `<b>🔢 Followers:</b> ${data.followers?.toLocaleString()}\n`
        text += `<b>🔢 Following:</b> ${data.following?.toLocaleString()}\n`
        text += `<b>👍 Likes</b> ${data.likes?.toLocaleString()}\n`
        await ctx.replyWithPhoto(data?.profile as string, {
            caption: text,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[
                    { text: "🔗 View on TikTok", web_app: { url: data.link } }
                ]]
            }
        })
        return
    } else {
        await ctx.reply("Tiktok Information Not Found")
        return
    }
}
bot.use(createConversation(start))
bot.command("start", async (ctx) => await ctx.conversation.enter("start"))
const init = async () => {
    await bot.init()
    await bot.api.setMyCommands([
        { command: 'start', description: "Start Bot" }
    ])
    console.log(`> Bot Started ${bot.botInfo.first_name}`)
}
init()
run(bot)