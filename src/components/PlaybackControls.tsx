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
  isLoading?: boolean;
}

export const PlaybackControls = memo(({
  onPlay,
  onPause,
  onRateChange,
  onStop,
  isPlayingExternally,
  isDisabled = false,
  isLoading = false
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
          disabled={isDisabled || isLoading}
        >
          {isLoading ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader loading-spinner">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
          ) : isPlaying ? (
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
          disabled={isDisabled || isLoading}
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
