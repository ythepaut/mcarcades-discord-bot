import {Command, CommandMessage} from "@typeit/discord";

export abstract class Ping {

    @Command("ping")
    private processCommand(message: CommandMessage) {
        if (message.author.bot) return;
        message.reply("Pong !").then();
    }
}
