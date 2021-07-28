import {Client, Discord, Guard, Guild, Slash} from "@typeit/discord";
import {NotBot} from "../../../guards/NotBot";
import {ConfigGuild} from "../../../guards/ConfigGuild";
import {HasRoles} from "../../../guards/HasRoles";
import {getClient} from "../../../app";
import config from "../../../config.json";
import {Welcome} from "../listeners/Welcome";
import {CommandInteraction, Snowflake} from "discord.js";

@Discord()
export abstract class WelcomeTest {

    //@Guard(NotBot)
    //@Guard(HasRoles([config.ROLES.ADMINISTRATOR]))
    //@Guard(ConfigGuild)
    @Slash("welcometest")
    private async processCommand(interaction: CommandInteraction, client: Client) {

        const guild = client.guilds.cache.get(config.GUILD as Snowflake);
        if (!guild) return;

        const channel = guild.channels.cache.get(config.CHANNELS.WELCOME as Snowflake);
        if (!channel || !channel.isText()) return;

        await channel.send({files: [await Welcome.createWelcomeImage(interaction.user)]});
    }
}
