import { memo } from 'preact/compat';
import { useCallback, useState } from 'preact/hooks';
import { cleanNotes, grabTextFromPDF } from '../utils';
import './NotesUploader.css';

interface NotesUploaderProps {
  onTextExtracted: (text: string) => void;
}

export const NotesUploader = memo(({ onTextExtracted }: NotesUploaderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const text = await grabTextFromPDF(file);
      const cleanedText = cleanNotes(text);
      onTextExtracted(cleanedText);
    } catch (err) {
      setError('Failed to extract text from PDF');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [onTextExtracted]);

  return (
    <div class="notes-uploader">
      <label htmlFor="pdf-upload" class="upload-label" title="Upload PDF">
        {isLoading ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-upload">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        )}
      </label>
      <input
        type="file"
        id="pdf-upload"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isLoading}
        class="file-input"
      />
      {error && <p class="error-message">{error}</p>}
    </div>
  );
});
