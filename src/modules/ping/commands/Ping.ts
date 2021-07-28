import {Discord, Guild, Slash} from "@typeit/discord";
import config from "../../../config.json";
import {CommandInteraction} from "discord.js";

@Discord()
export abstract class Ping {

    @Slash("ping")
    private async processCommand(interaction: CommandInteraction) {
        await interaction.reply("Pong !");
    }
}
