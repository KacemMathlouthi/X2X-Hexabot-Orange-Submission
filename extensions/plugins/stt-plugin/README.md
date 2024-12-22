## **Speech-to-Text Plugin**

**Plugin Description**:  
The Speech-to-Text Plugin enables Hexabot to convert audio attachments into text using a third-party API for transcription. This allows chatbots to process audio input, adding audio modality to Hexabot.

**Features**:  
- Converts audio files to text using a speech-to-text API.  
- Supports audio attachments in various formats (any audio format supported by Hexabot).  
- Easy integration with Hexabot’s existing workflow, plugins, and building blocks.

**Prerequisites**:  
- API key for the transcription service (currently, [Groq](https://console.groq.com/docs/speech-text) is supported, a free service with high limit rates).  
- Hexabot installation with the necessary permissions to handle audio attachments.  

**Installation Instructions**:  
1. Clone or download the Speech-to-Text Plugin repository.  
2. Place the plugin folder in the `/extensions/plugins/` directory of your Hexabot project.  
3. Run `npm install` to install any required dependencies.  
4. Add the necessary API key in the plugin's `settings.ts` file or through the plugin settings interface.

**Configuration**:  
1. Configure the API key for the transcription service in `settings.ts` or via the plugin settings interface.  
2. Set up audio file recording and attachment handling within the Hexabot visual editor.

**Usage Guide**:  
1. Add the Speech-to-Text block to your Hexabot chatbot workflow using the visual editor.  
2. Ensure the block is connected to a flow that handles incoming audio files.  
3. Once an audio file is received, the plugin will convert it to text and return the transcription.  
4. You can use the transcribed text in subsequent chatbot actions or responses.
