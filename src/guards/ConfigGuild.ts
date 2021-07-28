import {ArgsOf, GuardFunction} from "@typeit/discord";
import config from "../config.json";

export const ConfigGuild: GuardFunction<ArgsOf<"message">> = async ([message], client, next) => {
    if (message.guild?.id === config.GUILD) {
        await next();
    }
};
