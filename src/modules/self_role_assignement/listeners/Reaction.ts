import {ArgsOf, On} from "@typeit/discord";

export abstract class Reaction {

    @On("messageReactionAdd")
    private async processEvent([reaction, user]: ArgsOf<"messageReactionAdd">) {


        if (user.bot)
            return;
        console.log("**REACTION**", reaction.emoji.name);

        if (reaction.message.embeds.length !== 1 || reaction.message.embeds[0].title !== "Réagissez pour vous abonner aux notifications")
            return;

        if (reaction.emoji.name.startsWith("📣")) {



        } else if (reaction.emoji.name.startsWith("📰")) {

        } else if (reaction.emoji.name.startsWith("❓")) {

        } else {
            reaction.remove()
        }

    }
}
