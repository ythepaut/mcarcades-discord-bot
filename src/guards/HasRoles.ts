import {GuardFunction} from "@typeit/discord";
import config from "../config.json";

export enum RoleOperation {
    UNION, INTERSECTION
}

export function HasRoles(roles: string[], operation: RoleOperation = RoleOperation.UNION) {
    const guard: GuardFunction<"message"> = async ([message], client, next) => {

        const member = client.guilds.cache.get(config.GUILD)?.member(message.author);

        if (operation === RoleOperation.UNION && roles.some(r => member?.roles.cache.has(r))) {
            await next();
        } else if (operation === RoleOperation.INTERSECTION && roles.every(r => member?.roles.cache.has(r))) {
            await next();
        } else if (config.VERBOSE_LEVEL >= 4) {
            console.info(`Command ${message.content} denied for user ${message.author.tag}`);
        }
    };
    return guard;
}
