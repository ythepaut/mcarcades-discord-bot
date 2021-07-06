import {ArgsOf, On} from "@typeit/discord";
import {getClient} from "../../../app";
import config from "../../../config.json";
import {User} from "discord.js";
import {createCanvas, loadImage} from "canvas";
import fs from "fs";

export abstract class Welcome {

    static async createWelcomeImage(member: User): Promise<string> {
        // Creating canvas
        const outPath = "./tmp/bienvenue.png";
        const width = 1024,
            height = 500;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Background image
        const bgPath = "./src/assets/images/welcome/";
        const files = fs.readdirSync(bgPath);
        const background = await loadImage(bgPath + files[Math.floor(Math.random() * files.length)]);
        ctx.drawImage(background, 0, 0, width, height);

        // Adding title
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.font = "bold 48pt Lato";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText("BIENVENUE", width / 2, 0.8 * height);

        // Adding subtitle
        ctx.font = "bold 26pt Lato";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText(member.tag, width / 2, 0.88 * height);

        // Adding avatar
        // Avatar : outer circle
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(width / 2, height / 2.75, 136, 0, 2 * Math.PI);
        ctx.fill();
        // Avatar : inner circle containing the avatar
        ctx.fillStyle = "#fff";
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2.75, 128, 0, 2 * Math.PI);
        ctx.closePath();
        // Avatar : drawing image inside inner circle
        ctx.clip();
        const avatarUri = member.avatarURL({format: "png", size: 256});
        if (avatarUri != null) {
            const avatar = await loadImage(avatarUri);
            ctx.drawImage(avatar, width / 2 - avatar.width / 2, height / 2.75 - avatar.height / 2);
        }
        ctx.restore();

        // Saving image
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(outPath, buffer);

        return outPath;
    }

    @On("guildMemberAdd")
    private async processEvent([member]: ArgsOf<"guildMemberAdd">) {

        const client = getClient();
        if (!client) return;

        const guild = client.guilds.cache.get(config.GUILD);
        if (!guild) return;

        const channel = guild.channels.cache.get(config.CHANNELS.WELCOME);
        if (!channel || !channel.isText()) return;

        await channel.send("", {files: [await Welcome.createWelcomeImage(member.user)]});

        if (config.VERBOSE_LEVEL >= 3)
            console.info(`User ${member.user.tag} joined the guild.`);
    }
}
