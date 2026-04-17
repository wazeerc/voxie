export const ELEVENLABS_DOCS_URL = "https://elevenlabs.io/docs/overview/intro";

export async function synthesizeSpeech(
	text: string,
	apiKey: string,
	voiceId: string,
): Promise<Blob> {
	const response = await fetch(
		`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "audio/mpeg",
				"xi-api-key": apiKey,
			},
			body: JSON.stringify({
				text,
				model_id: "eleven_multilingual_v2",
				output_format: "mp3_44100_128",
			}),
		},
	);

	if (!response.ok) {
		const details = await response.text();
		throw new Error(
			`ElevenLabs API ${response.status}: ${details || response.statusText}`,
		);
	}

	return response.blob();
}

export function getElevenLabsConfig(): {
	apiKey: string;
	voiceId: string;
} | null {
	const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
	const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

	if (!apiKey || !voiceId) {
		return null;
	}

	return { apiKey, voiceId };
}

export function isElevenLabsConfigured(): boolean {
	return getElevenLabsConfig() !== null;
}
