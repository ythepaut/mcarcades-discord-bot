import {Client} from "@typeit/discord";
import config from "./config.json";

let client: Client;

async function start() {
    client = new Client({
        classes: [
            `${__dirname}/../src/DiscordApp.ts`
        ],
        silent: false,
        variablesChar: ":"
    });
    await client.login(config.BOT_TOKEN);
}

start().then(() => {
    if (config.VERBOSE_LEVEL >= 2)
        console.info(`Bot started at ${new Date()}.`);
});

export default function () {
    return client;
};
