import {GuardFunction} from "@typeit/discord";

export const NotSelf: GuardFunction<"message"> = async ([message], client, next) => {
    if (client.user && client.user.id !== message.author.id) {
        await next();
    }
};
