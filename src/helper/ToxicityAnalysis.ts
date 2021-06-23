import config from "../config.json";

async function getToxicity(content: String): Promise<number> {

    const Perspective = require('perspective-api-client');
    const perspective = new Perspective({
        apiKey: config.PERSPECTIVE_API_TOKEN
    });

    let result = null;

    try {
        result = await perspective.analyze(
            content,
            {
                attributes: ["toxicity"],
                doNotStore: true
            }
        );
    } catch (_) {
    }

    return result ? result.attributeScores.TOXICITY.summaryScore.value : -1;
}

export default getToxicity;
