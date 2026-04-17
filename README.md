# Voxie - Let Your Notes Speak

Voxie is a lightweight, accessible text-to-speech web application that converts your notes, documents, and text into natural-sounding speech. Perfect for students, professionals, and anyone who prefers listening to reading.

> [!NOTE] This app was 99.9% vibe coded using VSCode (1.98.2), GitHub Copilot, Claude Sonnet 3.7 (Thinking Preview) in Edit & Agent mode - I only wrote 2-3 lines of code XD

## Features

- ✅ **Dual voice engines** - Switch between browser voices and ElevenLabs
- ✅ **Browser voice support** - Use built-in system/browser voices without API keys
- ✅ **ElevenLabs support** - Use natural voices with your API key and voice id
- ✅ **PDF document support** - Upload a PDF and auto-extract readable text
- ✅ **Playback controls** - Play, pause, stop, and adjust speech rate
- ✅ **Improved UX** - Cleaner layout, clearer status, and setup guidance in-app

## Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- npm or yarn

ElevenLabs credentials are optional unless you want ElevenLabs mode.

### Installation

```bash
# Clone the repository
git clone https://github.com/wazeerc/voxie.git

# Navigate to the project directory
cd voxie

# Install dependencies
npm install
```

### Configuration (Optional: ElevenLabs)

1. Copy the example environment file:

  ```bash
  cp .env.example .env
  ```

2. Add your ElevenLabs credentials to `.env`:

  ```env
  VITE_ELEVENLABS_API_KEY=your_api_key_here
  VITE_ELEVENLABS_VOICE_ID=your_voice_id_here
  ```

To get your credentials:

- **API Key**: Sign up at [ElevenLabs](https://elevenlabs.io/) and go to profile settings
- **Voice ID**: Browse [ElevenLabs Voice Library](https://elevenlabs.io/voice-library) and copy the id from the voice URL
- **Docs**: [https://elevenlabs.io/docs/overview/intro](https://elevenlabs.io/docs/overview/intro)

### Start the App

```bash
npm run dev
```

## Usage

1. **Pick provider**: Choose `Browser voices` or `ElevenLabs` in the provider switch
2. **Add content**: Paste/type text or upload a PDF
3. **Choose voice**: If using browser mode, choose a voice from the voice selector
4. **Play audio**: Use play/pause/stop and speed controls

If ElevenLabs mode is selected without credentials, the app shows setup guidance and links to docs in the UI.

## Building for Production

```bash
# Build the app for production
npm run build

# Preview the production build
npm run preview

# OR
npm run prod
```

## Technologies Used

- [Preact](https://preactjs.com/) - Lightweight alternative to React
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF parsing library
- [ElevenLabs](https://elevenlabs.io/) - AI text-to-speech API
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## Browser Support

Voxie works in modern browsers.

- **Browser voices mode** depends on each browser/system voice availability.
- **ElevenLabs mode** requires internet access and valid credentials.

## Development

```bash
# Run development server
npm run dev

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgements

- Icons by [Feather Icons](https://feathericons.com/) & [Vijay](https://3dicons.co/)
- Voice synthesis by [ElevenLabs](https://elevenlabs.io/)
