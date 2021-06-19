import * as Path from "path";
import {CommandMessage, CommandNotFound, Discord} from "@typeit/discord";

@Discord("!", {
    import: [
        Path.join(__dirname,  "commands", "*.ts"),
        Path.join(__dirname,  "listeners", "*.ts")
    ]
})
export abstract class DiscordApp {
    @CommandNotFound()
    private processCommand(message: CommandMessage) {
        if (message.author.bot) return;
        message.reply("Commande non reconnue.").then();
    }
}
