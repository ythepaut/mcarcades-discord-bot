import "reflect-metadata";
import {Client} from "@typeit/discord";
import config from "./config.json";
import {Api} from "./helper/Api";
import {connect} from "./helper/Database";
import {Db} from "mongodb";
import {Intents, Interaction} from "discord.js";

let client: Client;
let api: Api = new Api();
let database: Db;

/**
 * Start the bot client
 */
async function start() {
    client = new Client({
        intents: [
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.GUILD_INTEGRATIONS,
            Intents.FLAGS.GUILD_INVITES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGE_TYPING,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_WEBHOOKS
        ],
        classes: [
            `${__dirname}/../src/helper/DiscordBot.ts`
        ],
        silent: false,
        slashGuilds: [config.GUILD]
    });

    // Slash commands init
    client.once("ready", async () => {
        await client.clearSlashes();
        await client.clearSlashes(config.GUILD);
        await client.initSlashes();
    });

    // Slash command listener
    client.on("interactionCreate", (interaction: Interaction) => {
        client.executeSlash(interaction);
    });

    //
    await client.login(
        config.BOT_TOKEN,
        `${__dirname}/modules/**/*.ts`
    );
}

if (config.VERBOSE_LEVEL >= 2)
    console.info("Initializing bot...");
start().then(() => {
    if (config.VERBOSE_LEVEL >= 2)
        console.info(`\nDiscord bot started.`);
    api.startExpressApp().then(() => {
        if (config.VERBOSE_LEVEL >= 2)
            console.info(`Api listening on port ${config.API_PORT}.`);
    });
    connect(config.MONGODB_CONNECTION_URI).then((db) => {
        database = db;
        console.info(`Connected to MongoDB database ${db.databaseName}.`);
    });
});

export function getClient() {
    return client;
}

export function getApi() {
    return api;
}

export function getDatabase() {
    return database;
}
