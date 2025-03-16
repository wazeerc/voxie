import { memo } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';
import './TextInput.css';

interface TextInputProps {
  onTextChange: (text: string) => void;
  placeholder?: string;
  initialText?: string;
}

export const TextInput = memo(({ onTextChange, placeholder = "Upload your notes or start writing here...", initialText = "" }: TextInputProps) => {
  const [text, setText] = useState<string>(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleChange = useCallback((e: Event) => {
    const newText = (e.target as HTMLTextAreaElement).value;
    setText(newText);
    onTextChange(newText);
  }, [onTextChange]);

  return (
    <div class="text-input-container">
      <label htmlFor="notes-input" class="sr-only">Your Notes</label>
      <textarea
        id="notes-input"
        value={text}
        onInput={handleChange}
        placeholder={placeholder}
        aria-label="Your notes"
        class="notes-textarea"
      />
    </div>
  );
});
