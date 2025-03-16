# Voxie - Let Your Notes Speak

Voxie is a lightweight, accessible text-to-speech web application that converts your notes, documents, and text into natural-sounding speech. Perfect for students, professionals, and anyone who prefers listening to reading.

> [!NOTE]
> This app was 100% vibe coded using VSCode (1.98.2), GitHub Copilot, Claude Sonnet 3.7 Thinking Preview in Edit mode - I only wrote 2-3 lines of code XD

## Features

- ✅ **Text-to-Speech Conversion** - Convert any text into speech with just a click
- ✅ **PDF Document Support** - Upload and convert PDF documents directly
- ✅ **Voice Selection** - Choose from multiple voices, with preference for natural-sounding options
- ✅ **Playback Controls** - Play, pause, stop, and adjust speech rate
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Clean Interface** - Intuitive, distraction-free user experience

## Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/wazeerc/voxie.git

# Navigate to the project directory
cd voxie

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. **Enter Text**: Type directly into the text area or upload a PDF document
2. **Select Voice**: Choose your preferred voice from the dropdown menu (the app automatically looks for natural-sounding voices)
3. **Adjust Speed**: Use the slider to set your preferred speech rate (0.5x to 2x)
4. **Playback**: Use the play/pause/stop controls to manage speech playback

## Building for Production

```bash
# Build the app for production
npm run build

# Preview the production build
npm run preview
```

## Technologies Used

- [Preact](https://preactjs.com/) - Lightweight alternative to React
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF parsing library
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Browser text-to-speech capabilities
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## Browser Support

Voxie relies on the Web Speech API, which is supported in most modern browsers:

- Chrome/Edge (full support)
- Firefox (partial support)
- Safari (partial support)

Voice selection and quality may vary between browsers. The app works best with Chromium-based browsers that support the latest Web Speech API features, **Microsoft Edge** is preferred.

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
- Uses the SpeechSynthesis API for text-to-speech functionality
