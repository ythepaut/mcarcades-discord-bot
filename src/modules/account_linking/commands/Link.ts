import {Choice, Discord, Guard, Guild, Slash} from "@typeit/discord";
import {NotBot} from "../../../guards/NotBot";
import {HasRoles} from "../../../guards/HasRoles";
import config from "../../../config.json";
import {CommandInteraction, MessageEmbed, MessagePayload} from "discord.js";
import {getSaltedHash} from "../../../utils/Crypto";

@Discord()
export abstract class Link {

    //@Guard(NotBot)
    //@Guard(HasRoles([config.ROLES.PLAYER, config.ROLES.ADMINISTRATOR]))
    @Slash("link")
    private async processCommand(interaction: CommandInteraction) {

        const dm = await interaction.user.createDM();
        const embed = new MessageEmbed()
            .setColor("#9b59b6")
            .setTitle("Lier le compte minecraft")
            .setDescription(`
                    Pour lier votre compte minecraft avec votre compte discord, connectez-vous sur le serveur et tapez la commande :\n
                    \`/discord ${interaction.user.tag} ${getSaltedHash(interaction.user.tag).substring(0, 8)}\`
                    `)
            .setFooter("Récompense : 5000 Jetons et 5000 XP")
        await dm.send({embeds: [embed]});

    }
}
