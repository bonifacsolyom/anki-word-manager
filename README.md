# Anki Deutsch Helfer

A React application that helps you learn German vocabulary by integrating with Anki. It automatically generates English translations and example sentences for German words using OpenAI's GPT-4.

## Features

- Add German words to your Anki deck with auto-generated translations and examples
- Edit translations and example sentences directly in the interface
- Regenerate translations or examples with custom instructions
- Seamless integration with Anki via AnkiConnect

## Prerequisites

- Node.js and npm
- Anki with [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on installed
- An OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```bash
   OPENAI_API_KEY=your_key_here
   ```
4. Make sure Anki is running and AnkiConnect is properly installed
5. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Enter a German word in the input field
2. The app will automatically generate an English translation and an example sentence
3. Click the refresh button (🔄) to regenerate the translation or example
4. Click any text to edit it manually
5. Click the X button to delete an entry

## Development

Built with:
- React + TypeScript
- OpenAI API
- AnkiConnect

## License

MIT