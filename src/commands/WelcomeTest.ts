import {Command, CommandMessage, Guard} from "@typeit/discord";
import {NotBot} from "../guards/NotBot";
import getClient from "../main";
import config from "../config.json";
import {Welcome} from "../listeners/Welcome";

export abstract class WelcomeTest {

    @Command("testwelcome")
    @Guard(NotBot)
    private async processCommand(command: CommandMessage) {

        const client = getClient();
        if (!client) return;

        const guild = client.guilds.cache.get(config.GUILD);
        if (!guild) return;

        const channel = guild.channels.cache.get(config.CHANNELS.WELCOME);
        if (!channel || !channel.isText()) return;

        await channel.send("", {files: [await Welcome.createWelcomeImage(command.author)]});
    }
}