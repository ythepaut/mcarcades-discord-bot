import {Command, CommandMessage, Guard} from "@typeit/discord";
import {NotBot} from "../guards/NotBot";
import {HasRoles} from "../guards/HasRoles";
import config from "../config.json";
import {ConfigGuild} from "../guards/ConfigGuild";

export abstract class Clear {

    @Command("clear")
    @Guard(NotBot)
    @Guard(HasRoles([config.ROLES.ADMINISTRATOR]))
    @Guard(ConfigGuild)
    private async processCommand(command: CommandMessage) {

        const channel = command.channel;
        if (!channel.isText()) return;

        (await channel.messages.fetch()).forEach(message => {
            message.delete();
        });
    }
}
