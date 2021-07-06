import * as Path from "path";
import * as fs from "fs";
import {Command, CommandMessage, Discord, Guard} from "@typeit/discord";
import config from "../config.json";
import {NotBot} from "../guards/NotBot";

@Discord(config.COMMAND_PREFIX, {
    import: getModulePaths()
})
export abstract class DiscordBot {

    @Command(/.*/)
    @Guard(NotBot)
    private processCommand(message: CommandMessage) {
        if (config.VERBOSE_LEVEL >= 3)
            console.info(`${message.author.tag} executed the command ${message.content}`);
    }
}

/**
 * Returns all paths to the bot's classes (commands, listeners and tasks)
 */
function getModulePaths(): string[] {
    // Getting module list
    const modules = fs.readdirSync(Path.join(__dirname, "../modules/"), {withFileTypes: true})
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    // Getting paths for each module
    const subDirs = ["/commands", "/listeners", "/tasks"];
    let paths: string[] = [];
    for (const module of modules)
        for (const subDir of subDirs)
            if (fs.existsSync(Path.join(__dirname, `../modules/${module}${subDir}`)))
                paths.push(Path.join(__dirname, `../modules/${module}${subDir}`, "*.ts"));
    return paths;
}
