import {getClient} from "../app";
import config from "../config.json";
import {HexColorString, Message, MessageEmbed, Snowflake} from "discord.js";

export interface SeverityProperties {
    colour: string;
    image: string | null;
}

export enum Severity {
    LOWEST, LOW, MEDIUM, HIGH, HIGHEST
}

export abstract class StaffAlert {

    private static lastMessage: Message | null = null;

    public static async triggerAlert(targetGroupId: string | null, title: string, message: string, severity: Severity, replace: boolean): Promise<void> {

        const client = getClient();
        if (!client) return;

        const guild = client.guilds.cache.get(config.GUILD as Snowflake);
        if (!guild) return;

        const channel = guild.channels.cache.get(config.CHANNELS.ALERTS as Snowflake);
        if (!channel || !channel.isText()) return;

        const colours: HexColorString[] = ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"];

        let description = message;
        if (targetGroupId !== null) {
            description += `\n\n<@&${targetGroupId}>`;
        }

        if (replace && this.lastMessage && Date.now() - (this.lastMessage.editedTimestamp || this.lastMessage.createdTimestamp) < 300000) {
            const lastEmbed = this.lastMessage?.embeds[0];
            if (lastEmbed && lastEmbed.title === title) {
                lastEmbed.setDescription(description);
                await this.lastMessage.edit({embeds: [lastEmbed]});
            } else {
                const embed = new MessageEmbed()
                    .setColor(colours[severity])
                    .setTitle(title)
                    .setDescription(description);
                this.lastMessage = await channel.send({embeds: [embed]});
            }
        } else {
            const embed = new MessageEmbed()
                .setColor(colours[severity])
                .setTitle(title)
                .setDescription(description);
            this.lastMessage = await channel.send({embeds: [embed]});
        }
    }
}
