import * as Path from "path";
import {Command, CommandMessage, Discord, Guard, Once} from "@typeit/discord";
import config from "./config.json";
import {NotBot} from "./guards/NotBot";

@Discord(config.COMMAND_PREFIX, {
    import: [
        Path.join(__dirname, "commands", "*.ts"),
        Path.join(__dirname, "listeners", "*.ts"),
        Path.join(__dirname, "tasks", "*.ts")
    ]
})
export abstract class DiscordApp {

    @Command(/.*/)
    @Guard(NotBot)
    private processCommand(message: CommandMessage) {
        if (config.VERBOSE_LEVEL >= 3)
            console.info(`${message.author.tag} executed the command ${message.content}`);
    }
}
