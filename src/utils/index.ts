import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.mjs",
	import.meta.url,
).toString();

function cleanNotes(text: string): string {
	let cleaned = text.replace(/Page\s+\d+\s+of\s+\d+/gi, "");

	cleaned = cleaned.replace(/\s+/g, " ");

	cleaned = cleaned.replace(/^\s*|\s*$/g, "");
	cleaned = cleaned.replace(/\f/g, "");

	return cleaned;
}

function textToSpeech(
	text: string,
	voice: SpeechSynthesisVoice | null,
	rate = 1.0,
): SpeechSynthesisUtterance {
	const utterance = new SpeechSynthesisUtterance(removeEmojis(text));

	if (voice) {
		utterance.voice = voice;
	}

	utterance.rate = rate;
	return utterance;
}

async function grabTextFromPDF(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = async (event) => {
			try {
				if (!event.target?.result) {
					throw new Error("Failed to read file");
				}

				const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
				const loadingTask = pdfjs.getDocument(typedArray);
				const pdf = await loadingTask.promise;

				let fullText = "";

				for (let i = 1; i <= pdf.numPages; i++) {
					const page = await pdf.getPage(i);
					const textContent = await page.getTextContent();
					const pageText = textContent.items
						.map((item: any) => ("str" in item ? item.str : ""))
						.join(" ");

					fullText += `${pageText}\n`;
				}

				resolve(fullText);
			} catch (error) {
				console.error("PDF parsing error:", error);
				reject(error);
			}
		};

		reader.onerror = (error) => {
			console.error("FileReader error:", error);
			reject(error);
		};
		reader.readAsArrayBuffer(file);
	});
}

function removeEmojis(text: string): string {
	return text.replace(/[\p{Emoji}]/gu, "");
}

export { cleanNotes, grabTextFromPDF, removeEmojis, textToSpeech };

