import {Command, CommandMessage, Guard} from "@typeit/discord";
import {NotBot} from "../guards/NotBot";

export abstract class Ping {

    @Command("ping")
    @Guard(NotBot)
    private async processCommand(command: CommandMessage) {
        await command.reply("Pong !");
    }
}
