import { hydrate, prerender as ssr } from "preact-iso";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import { NotesUploader } from "./components/NotesUploader";
import { PlaybackControls } from "./components/PlaybackControls";
import { TextInput } from "./components/TextInput";
import { VoiceSelector } from "./components/VoiceSelector";
import "./style.css";
import {
	ELEVENLABS_DOCS_URL,
	cleanNotes,
	getElevenLabsConfig,
	isElevenLabsConfigured,
	synthesizeSpeech,
	textToSpeech,
} from "./utils";

type VoiceProvider = "browser" | "elevenlabs";

export function App() {
	const [notes, setNotes] = useState<string>("");
	const [voiceProvider, setVoiceProvider] = useState<VoiceProvider>("browser");
	const [selectedVoice, setSelectedVoice] =
		useState<SpeechSynthesisVoice | null>(null);
	const [speechRate, setSpeechRate] = useState<number>(1.0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isPaused, setIsPaused] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const audioUrlRef = useRef<string | null>(null);

	const isConfigured = isElevenLabsConfigured();
	const config = getElevenLabsConfig();
	const isPlaybackDisabled = useMemo(() => {
		if (!notes.trim()) {
			return true;
		}

		if (voiceProvider === "elevenlabs") {
			return !isConfigured;
		}

		return !selectedVoice;
	}, [isConfigured, notes, selectedVoice, voiceProvider]);

	const stopBrowserPlayback = useCallback(() => {
		speechSynthesis.cancel();
		utteranceRef.current = null;
	}, []);

	const cleanupAudioUrl = useCallback(() => {
		if (audioUrlRef.current) {
			URL.revokeObjectURL(audioUrlRef.current);
			audioUrlRef.current = null;
		}
	}, []);

	const stopElevenLabsPlayback = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			audioRef.current = null;
		}
		cleanupAudioUrl();
	}, [cleanupAudioUrl]);

	const handleTextChange = useCallback((text: string) => {
		setNotes(text);
	}, []);

	const handleVoiceChange = useCallback((voice: SpeechSynthesisVoice) => {
		setSelectedVoice(voice);
	}, []);

	const handleTextExtracted = useCallback((text: string) => {
		setNotes(text);
	}, []);

	const handlePlay = useCallback(async () => {
		if (isPlaybackDisabled) {
			return;
		}

		setErrorMessage("");

		if (voiceProvider === "browser") {
			if (!selectedVoice) {
				setErrorMessage("Choose a browser voice to continue.");
				return;
			}

			if (isPaused && utteranceRef.current) {
				speechSynthesis.resume();
				setIsPlaying(true);
				setIsPaused(false);
				return;
			}

			setIsLoading(true);
			stopElevenLabsPlayback();
			speechSynthesis.cancel();

			const utterance = textToSpeech(
				cleanNotes(notes),
				selectedVoice,
				speechRate,
			);

			utterance.addEventListener("start", () => {
				setIsLoading(false);
				setIsPlaying(true);
				setIsPaused(false);
			});

			utterance.addEventListener("end", () => {
				setIsPlaying(false);
				setIsPaused(false);
				setIsLoading(false);
			});

			utterance.addEventListener("error", () => {
				setErrorMessage(
					"Browser voice playback failed. Try another voice or switch to ElevenLabs.",
				);
				setIsPlaying(false);
				setIsPaused(false);
				setIsLoading(false);
			});

			utteranceRef.current = utterance;
			speechSynthesis.speak(utterance);
			return;
		}

		if (!config) {
			setErrorMessage(
				"Set ElevenLabs API key and voice id in .env to use this provider.",
			);
			return;
		}

		if (isPaused) {
			if (audioRef.current) {
				await audioRef.current.play();
				setIsPlaying(true);
				setIsPaused(false);
				return;
			}
		}

		setIsLoading(true);
		setIsPlaying(false);
		setIsPaused(false);
		stopBrowserPlayback();
		stopElevenLabsPlayback();

		try {
			const blob = await synthesizeSpeech(
				cleanNotes(notes),
				config.apiKey,
				config.voiceId,
			);
			const audioUrl = URL.createObjectURL(blob);
			audioUrlRef.current = audioUrl;

			const audio = new Audio(audioUrl);
			audio.playbackRate = speechRate;
			audioRef.current = audio;

			audio.onplay = () => {
				setIsLoading(false);
				setIsPlaying(true);
				setIsPaused(false);
			};

			audio.onended = () => {
				setIsPlaying(false);
				setIsPaused(false);
				cleanupAudioUrl();
				audioRef.current = null;
			};

			audio.onerror = () => {
				setErrorMessage("ElevenLabs playback failed. Please try again.");
				setIsPlaying(false);
				setIsPaused(false);
				setIsLoading(false);
				stopElevenLabsPlayback();
			};

			await audio.play();
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"ElevenLabs request failed. Verify your API key, voice id, and network.",
			);
			setIsPlaying(false);
			setIsPaused(false);
			stopElevenLabsPlayback();
		} finally {
			setIsLoading(false);
		}
	}, [
		cleanupAudioUrl,
		config,
		isPaused,
		isPlaybackDisabled,
		notes,
		selectedVoice,
		speechRate,
		stopBrowserPlayback,
		stopElevenLabsPlayback,
		voiceProvider,
	]);

	const handlePause = useCallback(() => {
		if (!isPlaying) {
			return;
		}

		if (voiceProvider === "browser") {
			speechSynthesis.pause();
		} else if (audioRef.current) {
			audioRef.current.pause();
		}

		setIsPlaying(false);
		setIsPaused(true);
	}, [isPlaying, voiceProvider]);

	const handleStop = useCallback(() => {
		stopBrowserPlayback();
		stopElevenLabsPlayback();
		setIsPlaying(false);
		setIsPaused(false);
		setIsLoading(false);
	}, [stopBrowserPlayback, stopElevenLabsPlayback]);

	const handleRateChange = useCallback((rate: number) => {
		setSpeechRate(rate);

		if (audioRef.current) {
			audioRef.current.playbackRate = rate;
		}
	}, []);

	const handleProviderChange = useCallback(
		(provider: VoiceProvider) => {
			if (provider === voiceProvider) {
				return;
			}

			setVoiceProvider(provider);
			setErrorMessage("");
			stopBrowserPlayback();
			stopElevenLabsPlayback();
			setIsPlaying(false);
			setIsPaused(false);
			setIsLoading(false);
		},
		[stopBrowserPlayback, stopElevenLabsPlayback, voiceProvider],
	);

	useEffect(() => {
		return () => {
			stopBrowserPlayback();
			stopElevenLabsPlayback();
		};
	}, [stopBrowserPlayback, stopElevenLabsPlayback]);

	return (
		<div class="app-container">
			<header class="hero">
				<p class="hero-kicker">Voxie</p>
				<h1>Turn reading into listening</h1>
				<p class="hero-subtitle">
					Choose your voice engine, paste text or upload a PDF, and listen with
					full playback control.
				</p>
			</header>

			<section class="provider-switch" aria-label="Voice provider">
				<button
					type="button"
					class={`provider-chip ${voiceProvider === "browser" ? "active" : ""}`}
					onClick={() => handleProviderChange("browser")}
				>
					Browser voices
				</button>
				<button
					type="button"
					class={`provider-chip ${voiceProvider === "elevenlabs" ? "active" : ""}`}
					onClick={() => handleProviderChange("elevenlabs")}
				>
					ElevenLabs
				</button>
			</section>

			{voiceProvider === "elevenlabs" && (
				<section class={`provider-notice ${isConfigured ? "ok" : "warn"}`}>
					<div>
						<strong>ElevenLabs setup:</strong>{" "}
						{isConfigured
							? "API key and voice id detected in .env."
							: "Add VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_VOICE_ID to .env."}
					</div>
					<a href={ELEVENLABS_DOCS_URL} target="_blank" rel="noreferrer">
						Open ElevenLabs docs
					</a>
				</section>
			)}

			{errorMessage && <p class="error-banner">{errorMessage}</p>}

			<div class="main-layout">
				<section class="controls-area">
					<div class="controls-head">
						<h2>Settings</h2>
					</div>
					<PlaybackControls
						onPlay={handlePlay}
						onPause={handlePause}
						onStop={handleStop}
						onRateChange={handleRateChange}
						isPlayingExternally={isPlaying}
						isDisabled={isPlaybackDisabled}
						isLoading={isLoading}
					/>
					{voiceProvider === "browser" && (
						<VoiceSelector onVoiceChange={handleVoiceChange} />
					)}
				</section>

				<section class="content-area">
					<div class="editor-head">
						<h2>Notes</h2>
						<NotesUploader onTextExtracted={handleTextExtracted} />
					</div>
					<TextInput
						onTextChange={handleTextChange}
						placeholder="Paste notes, scripts, or study material here..."
						initialText={notes}
					/>
				</section>
			</div>
		</div>
	);
}

if (typeof window !== "undefined") {
	hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
