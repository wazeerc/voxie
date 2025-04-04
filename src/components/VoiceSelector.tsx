import { memo } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import "./VoiceSelector.css";

interface VoiceSelectorProps {
	onVoiceChange: (voice: SpeechSynthesisVoice) => void;
}

const DEFAULT_VOICE_NAME =
	"Microsoft AvaMultilingual Online (Natural) - English (United States)";

const filterNaturalVoices = (
	allVoices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] => {
	const naturalKeywords = [
		"natural",
		"neural",
		"premium",
		"enhanced",
		"wavenet",
		"plus",
	];

	const keywordVoices = allVoices.filter((voice) =>
		naturalKeywords.some((keyword) =>
			voice.name.toLowerCase().includes(keyword),
		),
	);

	if (keywordVoices.length > 0) {
		return keywordVoices;
	}

	const localVoices = allVoices.filter((voice) => voice.localService);

	if (localVoices.length > 0) {
		return localVoices;
	}

	return allVoices;
};

export const VoiceSelector = memo(({ onVoiceChange }: VoiceSelectorProps) => {
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [selectedVoice, setSelectedVoice] = useState<string>("");
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const hasInitializedRef = useRef<boolean>(false);

	const loadVoices = useCallback(() => {
		const availableVoices = window.speechSynthesis.getVoices();

		if (availableVoices.length > 0) {
			const naturalVoices = filterNaturalVoices(availableVoices);
			const voicesToUse =
				naturalVoices.length > 0 ? naturalVoices : availableVoices;

			setVoices(voicesToUse);

			if (!hasInitializedRef.current) {
				const defaultVoice = voicesToUse.find((voice) =>
					voice.name.includes(DEFAULT_VOICE_NAME),
				);

				if (defaultVoice) {
					setSelectedVoice(defaultVoice.name);
					onVoiceChange(defaultVoice);
				} else if (voicesToUse.length > 0) {
					setSelectedVoice(voicesToUse[0].name);
					onVoiceChange(voicesToUse[0]);
				}

				hasInitializedRef.current = true;
			}
		}
	}, [onVoiceChange]);

	useEffect(() => {
		loadVoices();

		window.speechSynthesis.onvoiceschanged = loadVoices;

		return () => {
			window.speechSynthesis.onvoiceschanged = null;
		};
	}, [loadVoices]);

	const filteredVoices = voices.filter(
		(voice) =>
			voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			voice.lang.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleVoiceSelect = useCallback(
		(voice: SpeechSynthesisVoice) => {
			setSelectedVoice(voice.name);
			onVoiceChange(voice);
			setIsDropdownOpen(false);
			setSearchTerm("");
		},
		[onVoiceChange],
	);

	const handleSearchChange = useCallback(
		(e: Event) => {
			setSearchTerm((e.target as HTMLInputElement).value);
			if (!isDropdownOpen) {
				setIsDropdownOpen(true);
			}
		},
		[isDropdownOpen],
	);

	const toggleDropdown = useCallback(() => {
		const newIsOpen = !isDropdownOpen;
		setIsDropdownOpen(newIsOpen);
		if (newIsOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isDropdownOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsDropdownOpen(false);
			} else if (
				e.key === "ArrowDown" &&
				isDropdownOpen &&
				filteredVoices.length > 0
			) {
				e.preventDefault();
				const currentIndex = filteredVoices.findIndex(
					(v) => v.name === selectedVoice,
				);
				const nextIndex = (currentIndex + 1) % filteredVoices.length;
				handleVoiceSelect(filteredVoices[nextIndex]);
			} else if (
				e.key === "ArrowUp" &&
				isDropdownOpen &&
				filteredVoices.length > 0
			) {
				e.preventDefault();
				const currentIndex = filteredVoices.findIndex(
					(v) => v.name === selectedVoice,
				);
				const prevIndex =
					(currentIndex - 1 + filteredVoices.length) % filteredVoices.length;
				handleVoiceSelect(filteredVoices[prevIndex]);
			} else if (e.key === "Enter" && isDropdownOpen) {
				e.preventDefault();
				setIsDropdownOpen(false);
			}
		},
		[isDropdownOpen, filteredVoices, selectedVoice, handleVoiceSelect],
	);

	const selectedVoiceObj = voices.find((v) => v.name === selectedVoice);
	const displayText = selectedVoiceObj
		? `${selectedVoiceObj.name} (${selectedVoiceObj.lang})`
		: "Select a voice";

	return (
		<div class="voice-selector" ref={dropdownRef}>
			<div class="voice-selector-header">
				<label id="voice-dropdown-label">Select Voice:</label>
			</div>

			<div class="dropdown-container">
				<div
					class="dropdown-header"
					onClick={toggleDropdown}
					aria-expanded={isDropdownOpen}
					aria-labelledby="voice-dropdown-label"
					onKeyDown={(e) => e.key === "Enter" && toggleDropdown()}
				>
					<span>{!searchTerm && !isDropdownOpen ? displayText : ""}</span>
					<span class="dropdown-arrow">
						{isDropdownOpen ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="feather feather-chevron-up"
							>
								<polyline points="18 15 12 9 6 15" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="feather feather-chevron-down"
							>
								<polyline points="6 9 12 15 18 9" />
							</svg>
						)}
					</span>
				</div>

				{isDropdownOpen && (
					<div class="dropdown-menu">
						<div class="search-container">
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Search voices..."
								value={searchTerm}
								onInput={handleSearchChange}
								onKeyDown={handleKeyDown}
								class="dropdown-search-input"
								aria-label="Search voices"
								autoComplete="off"
							/>
						</div>
						<div class="dropdown-options">
							{filteredVoices.length > 0 ? (
								filteredVoices.map((voice) => (
									<div
										key={voice.name}
										class={`dropdown-option ${voice.name === selectedVoice ? "selected" : ""}`}
										onClick={() => handleVoiceSelect(voice)}
										onKeyDown={(e) =>
											e.key === "Enter" && handleVoiceSelect(voice)
										}
										tabIndex={0}
										role="option"
										aria-selected={voice.name === selectedVoice}
									>
										{voice.name} ({voice.lang})
										{voice.localService && (
											<span class="local-indicator"> (Local)</span>
										)}
									</div>
								))
							) : (
								<div class="no-results">No voices match your search</div>
							)}
						</div>
					</div>
				)}
			</div>

			{voices.length === 0 && (
				<p class="no-voices-message">
					No voices available. Please try another browser.
				</p>
			)}
		</div>
	);
});
