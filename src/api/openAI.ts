import axios from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export interface WordData {
	germanWord: string;
	englishTranslation: string;
	exampleSentence: string;
}

export const fetchWordData = async (word: string, instructions?: string): Promise<WordData | null> => {
	const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
	if (!apiKey) {
		console.error("OpenAI API key is not set.");
		return null;
	}

	const prompt = `
Please provide the following information for the German word "${word}":
1. The word in its dictionary form, including its article if applicable (e.g., "die Katze").
2. The English translation of the word.
3. An example sentence in German using the word.

${instructions ? `Additional instructions: ${instructions}` : ''}

Format your response in JSON as follows:
{
    "germanWord": "...",
    "englishTranslation": "...",
    "exampleSentence": "..."
}
`;

	try {
		const response = await axios.post(
			OPENAI_API_URL,
			{
				model: "gpt-4o-mini",
				messages: [{ role: "user", content: prompt }],
				response_format: { type: "json_object" },
				max_tokens: 150,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
			}
		);

		const content = response.data.choices[0].message.content;
		const wordData: WordData = JSON.parse(content);
		return wordData;
	} catch (error) {
		console.error("Error fetching data from OpenAI API:", error);
		return null;
	}
};
