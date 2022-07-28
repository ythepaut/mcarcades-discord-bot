import fetch from "node-fetch";

export interface MinecraftUser {
    uuid: string,
    username: string
}

async function getMinecraftUser(uuid: string): Promise<MinecraftUser> {

    const response = await fetch("https://api.mojang.com/user/profiles/" + uuid + "/names");
    const json: any[] = await response.json() as any[];

    return {
        uuid: uuid,
        username: json[json.length - 1].name
    }
}

export default getMinecraftUser;
