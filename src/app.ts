import {Client} from "@typeit/discord";
import config from "./config.json";
import {Api} from "./helper/Api";
import {connect} from "./helper/Database";
import {Db} from "mongodb";

let client: Client;
let api: Api = new Api();
let database: Db;

/**
 * Start the bot client
 */
async function start() {
    client = new Client({
        classes: [
            `${__dirname}/../src/helper/DiscordBot.ts`
        ],
        silent: false,
        variablesChar: ":"
    });
    await client.login(config.BOT_TOKEN);
}

if (config.VERBOSE_LEVEL >= 2)
    console.info("Initializing bot...");
start().then(() => {
    if (config.VERBOSE_LEVEL >= 2)
        console.info(`  Discord bot started.`);
    api.startExpressApp().then(() => {
        if (config.VERBOSE_LEVEL >= 2)
            console.info(`  Api listening on port ${config.API_PORT}.`);
    });
    connect(config.MONGODB_CONNECTION_URI).then((db) => {
        database = db;
        console.info(`  Connected to MongoDB database ${db.databaseName}.`);
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
