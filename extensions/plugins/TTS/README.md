# Text to Speech Plugin

## Plugin Description:
The **Text to Speech Plugin** converts text into speech using the Eleven Labs API. It processes text input, generates an audio file, and returns a downloadable MP3 file containing the speech.

## Features:
- Converts text into audio (MP3 format).
- Saves the audio file as an attachment.
- Supports customization with API Key and Voice ID for Eleven Labs.

## Prerequisites:
- **Node.js** (version 14 or higher recommended).
- **NestJS** (familiarity with NestJS is helpful).
- **Eleven Labs API Key** and **Voice ID**.
- **File system access** to store audio files.

## Installation Instructions:
1. **Clone the repository** or add the plugin files to your project.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Add Plugin to NestJS**: Import the plugin into your main NestJS module (`app.module.ts`).

4. **Set Up Upload Directory**: Ensure an `uploads` directory exists or the app can create it to store audio files.

## Configuration:
- **API Key and Voice ID**: Provide your **Eleven Labs API Key** and **Voice ID** for the plugin to convert text to speech.
- **Audio Format**: The plugin outputs audio in MP3 format by default.

## Usage Guide:
1. **Text-to-Speech Process**:
   - The plugin listens for messages with the pattern `speech`.
   - It converts the text to speech using Eleven Labs and returns an audio file.
   
2. **Parameters**: The API Key and Voice ID are passed to the plugin to configure the speech generation.

3. **Response**: 
   - On success, the plugin returns a link to the generated audio file.
   - If an error occurs, a fallback text message is returned.


## License:
MIT License. See the LICENSE file for more details.
