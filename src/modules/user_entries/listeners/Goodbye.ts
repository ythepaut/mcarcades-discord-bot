import {ArgsOf, On} from "@typeit/discord";
import config from "../../../config.json";

export abstract class Goodbye {

    @On("guildMemberRemove")
    private async processEvent([member]: ArgsOf<"guildMemberRemove">) {
        if (member.user === null) return;
        if (config.VERBOSE_LEVEL >= 3)
            console.info(`User ${member.user.tag} left the guild.`);
    }
}
