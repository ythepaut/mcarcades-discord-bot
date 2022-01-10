import {Command, CommandMessage, Guard} from "@typeit/discord";
import {NotBot} from "../../../guards/NotBot";
import {MessageEmbed} from "discord.js";
import {getSaltedHash} from "../../../utils/Crypto";
import Member from "../../../model/database/Member";
import {getDatabase} from "../../../app";
import getMinecraftUser from "../../../utils/MinecraftUserResolver";

export abstract class Link {

    @Command("link")
    @Guard(NotBot)
    private async processCommand(command: CommandMessage) {

        const dm = await command.author.createDM();

        const member = await Member.getFromDid(command.author.id, getDatabase());

        if (member.getUUID() !== null) {
            const mcUser = await getMinecraftUser(member.getUUID() as string);
            await dm.send(new MessageEmbed()
                .setColor("#f1c40f")
                .setTitle("Déjà lié")
                .setDescription(
                    "Votre compte Discord est déjà lié au compte Minecraft " +
                    `**${mcUser.username}**`)
                .setFooter("S'il s'agit d'une erreur, contactez un administrateur en ouvrant un ticket.")
            );
        } else {
            await dm.send(new MessageEmbed()
                .setColor("#9b59b6")
                .setTitle("Lier le compte minecraft")
                .setDescription(
                    "Pour lier votre compte minecraft avec votre compte discord, connectez-vous sur le serveur et tapez la commande :\n" +
                    `\`/discord ${command.author.tag} ${getSaltedHash(command.author.tag).substring(0, 8)}\``)
                .setFooter("Récompense : 5000 Jetons et 5000 XP")
            );
        }

    }
}
