import Task from "../../../model/Task";
import {getClient} from "../../../app";
import config from "../../../config.json";
import {ClientUser} from "discord.js";

export class ChangeStatus extends Task {

    private index: number = 0;
    private statuses = [
        "McArcades",
        "PLAY.MCARCADES.FR"
    ];

    constructor() {
        super();
        setInterval(() => this.tick(), 10000);
    }

    protected tick(): void {
        getClient().guilds.cache.get(config.GUILD)?.member(getClient().user as ClientUser)?.setNickname("Bob");
        getClient().user?.setActivity(
            this.statuses[this.index++ % this.statuses.length],
            {type: "PLAYING"}
        );
    }

}
