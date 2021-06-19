import { Client } from "@typeit/discord";
import config from "./config.json";

async function start() {
    const client = new Client({
        classes: [
            `${__dirname}/../src/DiscordApp.ts`
        ],
        silent: false,
        variablesChar: ":"
    });
    await client.login(config.BOT_TOKEN);
}

start().then(() => {
    console.info("Bot started.");
});
