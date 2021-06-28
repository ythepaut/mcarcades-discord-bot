import Task from "./Task";
import config from "../config.json";
import fetch from "node-fetch";
import {Severity, StaffAlert} from "../utils/StaffAlert";

interface ServerStatus {
    online: boolean;
    players: number;
}


export class Monitor extends Task {

    private static instance: Monitor;

    private readonly interval: number = -1;
    private offlineTime: number = 0;
    private lastStatus: ServerStatus | null = null;

    constructor(interval: number) {
        super();
        if (!Monitor.instance) {
            Monitor.instance = this;
            this.interval = interval ? interval : +config.SERVER_MONITOR_API;
            if (interval > 0)
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
                await StaffAlert.triggerAlert(
                    config.ROLES.ADMINISTRATOR,
                    "Serveur hors-ligne",
                    `Serveur hors-ligne depuis **${this.offlineTime / 60} minutes**`,
                    Severity.HIGHEST,
                    true
                );
            }

            if (config.VERBOSE_LEVEL >= 3)
                console.info(`Server has been offline for ${this.offlineTime / 60} minutes.`);
        } else {
            if (this.lastStatus !== null && !this.lastStatus?.online) {
                await StaffAlert.triggerAlert(
                    null,
                    "Serveur de nouveau en ligne",
                    `Il a été inaccessible durant **${this.offlineTime / 60} minutes**`,
                    Severity.LOW,
                    true
                );
            }
            this.offlineTime = 0;
        }

        // TODO: CPU usage verification
        // TODO: RAM usage verification

        this.lastStatus = status;
    }
}
