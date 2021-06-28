import {Command, CommandMessage, Guard} from "@typeit/discord";
import {NotBot} from "../guards/NotBot";
import {HasRoles} from "../guards/HasRoles";
import config from "../config.json";
import {getClient, getDatabase} from "../app";
import {MessageEmbed} from "discord.js";
import getMinecraftUser from "../utils/MinecraftUserResolver";

export abstract class LinkedAccountList {

    @Command("linkedaccountlist")
    @Guard(NotBot)
    @Guard(HasRoles([config.ROLES.MODERATOR, config.ROLES.ADMINISTRATOR]))
    private async processCommand(command: CommandMessage) {
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

        await command.channel.send(embed);
    }
}
