import {ArgsOf, GuardFunction} from "@typeit/discord";
import { Snowflake } from "discord.js";
import config from "../config.json";

export enum RoleOperation {
    UNION, INTERSECTION
}

export function HasRoles(roles: string[], operation: RoleOperation = RoleOperation.UNION) {
    const guard: GuardFunction<ArgsOf<"message">> = async ([message], client, next) => {

        //const member = client.guilds.cache.get(config.GUILD as Snowflake)?.member(message.author);
        const member = client.guilds.cache.get(config.GUILD as Snowflake)?.members.cache.get(message.author.id);

        if (operation === RoleOperation.UNION && roles.some((r) => member?.roles.cache.has(r as Snowflake))) {
            await next();
        } else if (operation === RoleOperation.INTERSECTION && roles.every((r) => member?.roles.cache.has(r as Snowflake))) {
            await next();
        } else if (config.VERBOSE_LEVEL >= 4) {
            console.info(`Command ${message.content} denied for user ${message.author.tag}`);
        }
    };
    return guard;
}
