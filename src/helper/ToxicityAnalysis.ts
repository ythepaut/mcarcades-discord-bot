import config from "../config.json";

const attributes = [
    "TOXICITY",
    "SEVERE_TOXICITY",
    "IDENTITY_ATTACK_EXPERIMENTAL",
    "INSULT_EXPERIMENTAL",
    "PROFANITY_EXPERIMENTAL",
    "THREAT_EXPERIMENTAL"
];

async function getToxicity(content: String): Promise<object> {

    const Perspective = require("perspective-api-client");
    const perspective = new Perspective({
        apiKey: config.PERSPECTIVE_API_TOKEN
    });

    let rawResult = null;

    try {
        rawResult = await perspective.analyze(
            content,
            {
                attributes: attributes,
                doNotStore: true,
                languages: ["fr"]
            }
        );
    } catch (err) {
        if (config.VERBOSE_LEVEL >= 4)
            console.error(err);
    }


    if (rawResult === null) {
        return [];
    } else {
        let result: any = {};
        for (const attribute of attributes)
            result[attribute] = rawResult.attributeScores[attribute].summaryScore.value;
        return result;
    }
}

export default getToxicity;
