import {Command, CommandMessage, Guard} from "@typeit/discord";
import {NotBot} from "../../../guards/NotBot";
import {HasRoles} from "../../../guards/HasRoles";
import config from "../../../config.json";
import {ConfigGuild} from "../../../guards/ConfigGuild";
import {MessageEmbed} from "discord.js";

export abstract class InitSelfRole {

    @Command("initselfrole")
    @Guard(NotBot)
    @Guard(HasRoles([config.ROLES.ADMINISTRATOR]))
    @Guard(ConfigGuild)
    private async processCommand(command: CommandMessage) {

        command.delete();

        const embed = new MessageEmbed()
            .setColor("#3498db")
            .setTitle("Réagissez pour vous abonner aux notifications")
            .addField("📣  Annonces", "Messages d'annonce sur des évènnements, nouveaux jeux, giveaways...")
            .addField("📰  Dev Blogs", "Messages d'annonce sur les nouveautés du serveurs.")
            .addField("❓  Sondages", "Sondages pour nous aider à créer un serveur qui vous corresponde le mieux !");

        const message = await command.channel.send(embed);
        await message.react("📣");
        await message.react("📰");
        await message.react("❓");
    }
}
