import {ArgsOf, Guard, On} from "@typeit/discord";
import config from "../config.json";
import getToxicity from "../helper/ToxicityAnalysis";
import {ConfigGuild} from "../guards/ConfigGuild";
import {Severity, StaffAlert} from "../helper/StaffAlert";
import {NotBot} from "../guards/NotBot";
import {MessageEmbed} from "discord.js";

export abstract class Chat {

    @On("message")
    @Guard(ConfigGuild)
    @Guard(NotBot)
    private async processEvent([message]: ArgsOf<"message">) {

        if (config.VERBOSE_LEVEL >= 3)
            console.info(`${new Date()} | ${message.author.tag} : ${message.content}`);

        if (config.SERVER_MONITOR_API !== "") {
            const result = await getToxicity(message.content);

            if (result >= 0.9) {
                await message.delete();
                await StaffAlert.triggerAlert(
                    config.ROLES.MODERATOR,
                    "Message modéré",
                    `Le message de ${message.author.tag} a été supprimé automatiquement pour toxicité (${result * 100}%).
                    *${message.content}*`,
                    Severity.MEDIUM);

                // TODO Better warning system
                const dm = await message.author.createDM();
                await dm.send(new MessageEmbed()
                    .setColor("#e74c3c")
                    .setTitle("Avertissement")
                    .setDescription(`
                    Vous avez envoyé un message caractérisé comme toxique sur le serveur Discord de McArcades.\n
                    Nous vous prions de garder un comportement correct sur nos serveurs, sans quoi, une sanction sera appliquée sans délai ni avertissement.
                    `)
                    .setFooter("S'il s'agit d'une erreur, merci de contacter un administrateur.")
                );
            } else if (result >= 0.5) {
                await StaffAlert.triggerAlert(
                    config.ROLES.MODERATOR,
                    "Message suspect",
                    `Le message de ${message.author.tag} semble toxique (${result * 100}%).
                    *${message.content}*\n
                    ${message.url}`,
                    Severity.HIGH);
            }
        }
    }
}
