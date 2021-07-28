import {Db} from "mongodb";

export default class Member {

    /**
     * Discord User ID
     */
    private readonly did: string;

    /**
     * Minecraft Unique User ID
     */
    private uuid: string | null;

    constructor(did: string, uuid: string | null) {
        this.did = did;
        this.uuid = uuid;
    }

    /**
     * Gets a user by its Discord ID
     */
    public static async getFromDid(did: string, database: Db): Promise<Member> {
        const res = await database.collection("users").findOne({did: did});
        if (res !== null) {
            return new Member(res.did, res.uuid);
        } else {
            const member = new Member(did, null);
            await this.createMember(member, database);
            return member;
        }
    }

    /**
     * Create a new member
     */
    public static async createMember(member: Member, database: Db): Promise<void> {
        await database.collection("users").insertOne({
            did: member.did,
            uuid: member.uuid
        });
    }

    public async updateMember(database: Db): Promise<void> {
        await database.collection("users").updateOne(
            {did: this.did},
            {$set: {
                uuid: this.uuid
            }});
    }

    public getDid(): string {
        return this.did;
    }

    public getUUID(): string | null {
        return this.uuid;
    }

    public setUUID(uuid: string, database: Db): void {
        this.uuid = uuid;
        this.updateMember(database).then(_ => {});
    }
}
