import { hydrate, prerender as ssr } from 'preact-iso';
import { useCallback, useRef, useState } from 'preact/hooks';
import { NotesUploader } from './components/NotesUploader';
import { PlaybackControls } from './components/PlaybackControls';
import { TextInput } from './components/TextInput';
import { VoiceSelector } from './components/VoiceSelector';
import './style.css';
import { textToSpeech } from './utils';

export function App() {
  const [notes, setNotes] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isPlaybackDisabled = !notes.trim() || !selectedVoice;

  const handleTextChange = useCallback((text: string) => {
    setNotes(text);
  }, []);

  const handleVoiceChange = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  const handleTextExtracted = useCallback((text: string) => {
    setNotes(text);
  }, []);

  const handlePlay = useCallback(() => {
    if (!notes.trim() || !selectedVoice) return;

    speechSynthesis.cancel();

    const utterance = textToSpeech(notes, selectedVoice, speechRate);

    utterance.addEventListener('end', () => {
      setIsPlaying(false);
    });

    utterance.addEventListener('error', () => {
      setIsPlaying(false);
      console.error('Speech synthesis error occurred');
    });

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [notes, selectedVoice, speechRate]);

  const handlePause = useCallback(() => {
    speechSynthesis.pause();
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  const handleRateChange = useCallback((rate: number) => {
    setSpeechRate(rate);

    if (utteranceRef.current && speechSynthesis.speaking) {
      const currentText = utteranceRef.current.text;

      const wasSpeaking = !speechSynthesis.paused;

      speechSynthesis.cancel();

      const newUtterance = textToSpeech(currentText, selectedVoice, rate);

      newUtterance.addEventListener('end', () => {
        setIsPlaying(false);
      });

      newUtterance.addEventListener('error', () => {
        setIsPlaying(false);
      });

      utteranceRef.current = newUtterance;
      speechSynthesis.speak(newUtterance);

      if (wasSpeaking) {
        setIsPlaying(true);
      }
    }
  }, [selectedVoice]);

  return (
    <div class="app-container">
      <header>
        <h1>Voxie</h1>
        <h2>Let Your Notes Speak</h2>
      </header>

      <div class="controls-area">
        <PlaybackControls
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onRateChange={handleRateChange}
          isPlayingExternally={isPlaying}
          isDisabled={isPlaybackDisabled}
        />
        <VoiceSelector onVoiceChange={handleVoiceChange} />
      </div>

      <div class="content-area">
        <TextInput
          onTextChange={handleTextChange}
          placeholder="Start writing here or upload a PDF..."
          initialText={notes}
        />

        <div class="upload-button-container">
          <NotesUploader onTextExtracted={handleTextExtracted} />
        </div>
      </div>
    </div>
  );
}

if (typeof window !== 'undefined') {
  hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
