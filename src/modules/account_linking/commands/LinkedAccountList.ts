import {Discord, Guard, Guild, Slash} from "@typeit/discord";
import {NotBot} from "../../../guards/NotBot";
import {HasRoles} from "../../../guards/HasRoles";
import config from "../../../config.json";
import {getClient, getDatabase} from "../../../app";
import {CommandInteraction, MessageEmbed} from "discord.js";
import getMinecraftUser from "../../../utils/MinecraftUserResolver";

@Discord()
export abstract class LinkedAccountList {

    //@Guard(NotBot)
    //@Guard(HasRoles([config.ROLES.MODERATOR, config.ROLES.ADMINISTRATOR]))
    @Slash("linkedaccountlist")
    private async processCommand(interaction: CommandInteraction) {
        const client = getClient();

        const embed = new MessageEmbed()
            .setColor("#9b59b6")
            .setTitle("Comptes discord liés à un compte minecraft");

        const members = await getDatabase().collection("users").find({uuid: {$ne: null}}).toArray();

        for (const member of members) {
            const user = client.users.cache.find((u) => u.id === member.did);
            const mcUser = await getMinecraftUser(member.uuid);
            embed.addField(
                user?.tag || member.did,
                `Pseudo : \t${mcUser.username}\n` +
                `UUID : \t${member.uuid}`,
                false);
        }

        await interaction.channel?.send({embeds: [embed]});
    }
}
