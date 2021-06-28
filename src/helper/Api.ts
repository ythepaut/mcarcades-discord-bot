import express, {Express, Request, Response} from "express";
import config from "../config.json";
import {Server} from "http";
import {getSaltedHash} from "../utils/Crypto";
import {getClient, getDatabase} from "../app";
import Member from "../model/Member";
import {MessageEmbed} from "discord.js";

export class Api {

    private expressApp: Express;

    constructor() {
        this.expressApp = express();
        this.initializeRoutes();
    }

    public async startExpressApp() : Promise<Server> {
        return this.expressApp.listen(config.API_PORT);
    }

    private initializeRoutes(): void {

        // Test route
        this.expressApp.get("/", (req: Request, res: Response) => {
            res.status(200).send("McArcades Discord Bot API");
        });

        // Minecraft account link
        this.expressApp.get("/link-account/:tag/:hash/:uuid", async (req: Request, res: Response) => {

            const tag = req.params.tag.replace("@", "#"),
                hash = req.params.hash.replace("-", "/").replace("_", "+"),
                uuid = req.params.uuid;

            if (getSaltedHash(tag).substring(0, 8) != hash) {
                res.status(403).send("Invalid hash.");
                return;
            }

            const guildMember = getClient().guilds.cache.get(config.GUILD)?.members.cache.find((member) => member.user.tag === tag);

            if (!guildMember) {
                res.status(400).send("Member is not in the guild.");
                return;
            }

            const member = await Member.getFromDid(guildMember.user.id, getDatabase());

            if (member.getUUID() !== null) {
                res.status(400).send("Discord account already linked.");
                return;
            }

            member.setUUID(uuid, getDatabase());

            if (config.VERBOSE_LEVEL >= 3)
                console.log("Linked discord account " + tag + " to minecraft UUID " + uuid);

            const dm = await guildMember.createDM();
            dm.send(new MessageEmbed()
                .setColor("#2ecc71")
                .setTitle("Compte minecraft lié !")
                .setDescription("Votre compte minecraft a bien été lié a votre compte discord.")
            ).then();

            res.status(200).send("User linked successfully.");
        });

    }

}

