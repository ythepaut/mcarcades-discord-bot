import {Command, CommandMessage, Guard} from "@typeit/discord";
import {NotBot} from "../../../guards/NotBot";
import {HasRoles} from "../../../guards/HasRoles";
import config from "../../../config.json";
import {MessageEmbed} from "discord.js";
import {getSaltedHash} from "../../../utils/Crypto";

export abstract class Link {

    @Command("link")
    @Guard(NotBot)
    @Guard(HasRoles([config.ROLES.PLAYER, config.ROLES.ADMINISTRATOR]))
    private async processCommand(command: CommandMessage) {

        const dm = await command.author.createDM();
        await dm.send(new MessageEmbed()
            .setColor("#9b59b6")
            .setTitle("Lier le compte minecraft")
            .setDescription(`
                    Pour lier votre compte minecraft avec votre compte discord, connectez-vous sur le serveur et tapez la commande :\n
                    \`/discord ${command.author.tag} ${getSaltedHash(command.author.tag).substring(0, 8)}\`
                    `)
            .setFooter("Récompense : 5000 Jetons et 5000 XP")
        );

    }
}
