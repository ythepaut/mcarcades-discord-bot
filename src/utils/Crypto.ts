import CryptoJS from "crypto-js";
import config from "../config.json";

export function getSaltedHash(text: string): string {
    return CryptoJS.SHA256(text + config.SALT).toString(CryptoJS.enc.Base64);
}
