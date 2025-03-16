import { memo } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onRateChange: (rate: number) => void;
  onStop: () => void;
  isPlayingExternally?: boolean;
  isDisabled?: boolean;
}

export const PlaybackControls = memo(({
  onPlay,
  onPause,
  onRateChange,
  onStop,
  isPlayingExternally,
  isDisabled = false
}: PlaybackControlsProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(1.0);

  useEffect(() => {
    if (isPlayingExternally !== undefined) {
      setIsPlaying(isPlayingExternally);
    }
  }, [isPlayingExternally]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, onPause, onPlay]);

  const handleStop = useCallback(() => {
    onStop();
    setIsPlaying(false);
  }, [onStop]);

  const handleRateChange = useCallback((newRate: number) => {
    setRate(newRate);
    onRateChange(newRate);
  }, [onRateChange]);

  return (
    <div class="playback-controls">
      <div class="playback-buttons">
        <button
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          class="control-button"
          disabled={isDisabled}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        <button
          onClick={handleStop}
          aria-label="Stop"
          class="control-button"
          disabled={isDisabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-square">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        </button>
      </div>

      <div class="rate-control">
        <label htmlFor="rate-slider">Speed: {rate.toFixed(1)}x</label>
        <input
          id="rate-slider"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={(e) => handleRateChange(parseFloat((e.target as HTMLInputElement).value))}
        />
      </div>
    </div>
  );
});
