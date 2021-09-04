import {ArgsOf, Guard, On} from "@typeit/discord";
import config from "../../../config.json";
import getToxicity from "../ToxicityAnalysis";
import {ConfigGuild} from "../../../guards/ConfigGuild";
import {Severity, StaffAlert} from "../../../utils/StaffAlert";
import {NotBot} from "../../../guards/NotBot";
import {MessageEmbed} from "discord.js";

export abstract class Chat {

    @On("message")
    @Guard(ConfigGuild)
    @Guard(NotBot)
    private async processEvent([message]: ArgsOf<"message">) {


        if (config.SERVER_MONITOR_API !== "") {
            const toxicityLevels: any = await getToxicity(message.content);

            let severityScore = 0;
            let toxicityDetails = [];
            for (const attribute in toxicityLevels) {
                if (toxicityLevels.hasOwnProperty(attribute)) {
                    if (toxicityLevels[attribute] >= 0.5)
                        toxicityDetails.push(`${attribute.replace("_EXPERIMENTAL", "")}=${Math.round(toxicityLevels[attribute] * 100)}%`);
                    if (toxicityLevels[attribute] > severityScore)
                        severityScore = toxicityLevels[attribute];
                }
            }

            if (severityScore >= 0.9) {
                await message.delete();
                await StaffAlert.triggerAlert(
                    config.ROLES.MODERATOR,
                    "Message modéré",
                    `Le message de ${message.author.tag} a été supprimé pour toxicité.` +
                    `"*${message.content}*"\n
                    ${toxicityDetails.join(", ")}`,
                    Severity.MEDIUM,
                    false);

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
            } else if (severityScore >= 0.5) {
                await StaffAlert.triggerAlert(
                    config.ROLES.MODERATOR,
                    "Message suspect",
                    `Le message de ${message.author.tag} semble toxique.
                    "*${message.content}*"\n
                    ${message.url}\n
                    ${toxicityDetails.join(", ")}`,
                    Severity.HIGH,
                    false);
            }

            if (config.VERBOSE_LEVEL >= 3) {
                console.info(`${new Date().toLocaleDateString("fr-FR")} ${new Date().toLocaleTimeString("fr-FR")} | ${message.author.tag} : ${message.content}\n` +
                    `    └ Toxicity analysis result : ${toxicityDetails.length > 0 ? toxicityDetails.join(", ") : "None"}`);
            }

        } else {
            if (config.VERBOSE_LEVEL >= 3)
                console.info(`${new Date()} | ${message.author.tag} : ${message.content}`);
        }

    }
}
