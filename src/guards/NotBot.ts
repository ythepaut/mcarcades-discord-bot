import {ArgsOf, GuardFunction} from "@typeit/discord";

export const NotBot: GuardFunction<ArgsOf<"message">> = async ([message], client, next) => {
    if (!message.author.bot) {
        await next();
    }
};
