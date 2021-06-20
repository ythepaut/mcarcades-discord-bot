import Task from "./Task";
import config from "../config.json";
import getClient from "../main";
import {Message, MessageEmbed} from "discord.js";
import fetch from "node-fetch";

interface ServerStatus {
    online: boolean;
    players: number;
}

interface SeverityProperties {
    colour: string;
    image: string | null;
}

enum Severity {
    LOWEST, LOW, MEDIUM, HIGH, HIGHEST
}

export class Monitor extends Task {

    private static instance: Monitor;

    private readonly interval: number = 150;
    private offlineTime: number = 0;
    private lastMessage: Message | null = null;
    private lastStatus: ServerStatus | null = null;

    constructor(interval: number) {
        super();
        if (!Monitor.instance) {
            Monitor.instance = this;
            this.interval = interval ? interval : this.interval;
            setInterval(() => this.tick(), this.interval * 1000);
        }
    }

    /**
     * Fetches the server status from OMGServ API
     * @private
     */
    private async fetchServerStatus(): Promise<ServerStatus> {

        const response = await fetch(config.SERVER_MONITOR_API);
        const rawString = await response.text();
        const rawJSON = JSON.parse(rawString);

        return {
            online: rawJSON.online,
            players: rawJSON.online === true ? rawJSON.players.online : 0
        };
    }

    /**
     * Sends an alert message in the "alert" channel
     * @private
     */
    private async triggerAlert(targetGroupId: string | null, title: string, message: string, severity: Severity): Promise<void> {

        const client = getClient();
        if (!client) return;

        const guild = client.guilds.cache.get(config.GUILD);
        if (!guild) return;

        const channel = guild.channels.cache.get(config.CHANNELS.ALERTS);
        if (!channel || !channel.isText()) return;

        const colours = ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"];

        let description = message;
        if (targetGroupId !== null) {
            description += `\n\n<@&${targetGroupId}>`;
        }

        if (this.lastMessage && Date.now() - (this.lastMessage.editedTimestamp || this.lastMessage.createdTimestamp) < 3 * this.interval * 1000) {
            const lastEmbed = this.lastMessage?.embeds[0];
            if (lastEmbed && lastEmbed.title === title) {
                lastEmbed.setDescription(description);
                await this.lastMessage.edit(lastEmbed);
            } else {
                this.lastMessage = await channel.send(new MessageEmbed()
                    .setColor(colours[severity])
                    .setTitle(title)
                    .setDescription(description)
                );
            }
        } else {
            this.lastMessage = await channel.send(new MessageEmbed()
                .setColor(colours[severity])
                .setTitle(title)
                .setDescription(description)
            );
        }
    }

    /**
     * Periodic task : server status check
     * @override
     * @protected
     */
    protected async tick(): Promise<void> {

        const status = await this.fetchServerStatus();

        // Online server verification
        if (!status.online) {
            this.offlineTime += this.interval;

            if (this.offlineTime >= 2 * this.interval) {
                await this.triggerAlert(
                    config.ROLES.ADMINISTRATOR,
                    "Serveur hors-ligne",
                    `Serveur hors-ligne depuis **${this.offlineTime / 60} minutes**`,
                    Severity.HIGHEST
                );
            }

            if (config.VERBOSE_LEVEL >= 3)
                console.info(`Server has been offline for ${this.offlineTime / 60} minutes.`);
        } else {
            if (this.lastStatus !== null && !this.lastStatus?.online) {
                await this.triggerAlert(
                    null,
                    "Serveur de nouveau en ligne",
                    `Il a été inaccessible durant **${this.offlineTime / 60} minutes**`,
                    Severity.LOW
                );
            }
            this.offlineTime = 0;
        }

        // TODO: CPU usage verification
        // TODO: RAM usage verification

        this.lastStatus = status;
    }
}
