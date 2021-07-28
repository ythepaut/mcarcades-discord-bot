import {Discord, Guard, Guild, Slash} from "@typeit/discord";
import {NotBot} from "../../../guards/NotBot";
import {HasRoles} from "../../../guards/HasRoles";
import config from "../../../config.json";
import {ConfigGuild} from "../../../guards/ConfigGuild";
import {CommandInteraction} from "discord.js";

@Discord()
export abstract class Clear {

    //@Guard(NotBot)
    //@Guard(HasRoles([config.ROLES.ADMINISTRATOR]))
    //@Guard(ConfigGuild)
    @Guild(config.GUILD)
    @Slash("clear")
    private async processCommand(interaction: CommandInteraction) {

        const channel = interaction.channel;
        if (!channel || !channel.isText()) return;

        (await channel.messages.fetch()).forEach((message) => {
            message.delete();
        });
    }
}
