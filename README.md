# x2x: From Any Modality to Any Modality

**x2x** is a set of plugins and helpers for the [Hexastack](https://github.com/Hexastack/hexabot) platform that enables seamless conversion between different modalities. Whether it's speech, text, or vision, x2x makes it easy to transform and integrate various forms of input and output for enhanced communication and accessibility. Our mission is to bridge the gap between multiple channels and modalities, making it easier for AI to understand and interact with users in a variety of ways.

![Project Image](/x2x.png)

## Features

- **Speech-to-Text**: Convert audio input to text using powerful speech recognition APIs.
- **Text-to-Speech**: Convert text responses into audio, providing audio output to users.
- **Vision Plugin**: Upload an image and receive either a text description or an audio response, depending on your configuration.
- **Multimodal Integration**: Easily integrate these helpers into Hexabot or any other plugin system for AI chatbots.
- **Accessibility**: Enhance accessibility for users with visual impairments or those unable to type easily.
- **Commercial Applications**: Expand functionality for a variety of business needs (customer support, content delivery, etc.).

## Plugins

### **Speech to (Text/Speech) Plugin**

The **Speech to (Text/Speech)** plugin handles both speech-to-text and text-to-speech functionalities, making it easy to integrate voice interaction with Hexabot. 

- **Speech-to-Text**: Converts user speech into text.
- **Text-to-Speech**: Converts generated text responses into spoken words.

### **Vision Plugin**

The **Vision Plugin** enables Hexabot to analyze images and provide detailed descriptions or responses based on the image content. Users can send images as attachments, and depending on configuration, they will receive either a text description of the image or an audio file that describes it. This plugin helps bridge the gap between visual inputs and text/audio outputs, enhancing accessibility and user interaction.

## Helpers

### **Speech Helper**

The **Speech Helper** provides backend functionality for converting speech (audio input) into text and vice versa. It forms the core of the Speech-to-Text/Speech plugin by leveraging external APIs like **Groq** for transcribing audio to text and **ElevenLabs** for generating audio from text.

By integrating the **Speech Helper** into your workflow, the system can interpret spoken words, process them, and take actions based on the transcribed text.

These helpers can be seamlessly integrated into any Hexabot block or other future plugin, allowing businesses to create sophisticated multimodal workflows that process voice, text, and visual inputs.

## Business Use Cases

### **Customer Support**
By combining the Speech-to-Text, Text-to-Speech, and Vision plugins, businesses can create more engaging and accessible customer support systems. For example:
- **Voice Interactions**: Customers can speak directly to the chatbot (via speech-to-text), and the bot can respond in audio or text format, depending on user preferences.
- **Image Analysis**: Customers can upload images of damaged products, and the chatbot can either describe the damage or provide an audio explanation of the next steps.
- **Hands-Free Support**: Speech-to-text functionality makes it easier for customers to dictate queries, reducing the need to type.

### **Improved Communication for Visually Impaired Users**
With the Vision Plugin, users can upload images, and the system will provide either a text or audio description, making it easier for visually impaired individuals to understand the content.

### **Speech-to-Text for Users Who Cannot Type**
The Speech-to-Text plugin allows individuals with motor impairments or other disabilities to speak their queries. This eliminates the need for typing and ensures users can easily communicate with the system.

### **Text-to-Speech for Enhanced Interaction**
For individuals with reading difficulties or cognitive impairments, the Text-to-Speech plugin enables the chatbot to read out text responses, offering better comprehension through auditory delivery.

## Prerequisites

Before using x2x, make sure you have the following set up:

- **Node.js**: Version 14 or higher.
- **Hexabot**: A compatible installation for integrating the plugins.
- **API Keys**: For services like Groq (speech-to-text) and ElevenLabs (text-to-speech).
- **Storage**: Either local or cloud-based storage for handling attachments like images.

## Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/KacemMathlouthi/Hexabot-Orange-Submission.git
   cd Hexabot-Orange-Submission
   ```

2. **Set Up API Keys**:  
   In the `settings.ts` file, configure the required API keys for speech-to-text and text-to-speech services.

3. **Add Plugins to Hexabot**:  
   Place the plugins into the `/extensions/plugins/` directory of your Hexabot project, and helpers into the `/extensions/helpers/` directory.

4. **Install Hexabot Dependencies**:  
   Navigate to your Hexabot project and install dependencies by running:
   ```bash
   npm install
   ```

## Usage Guide
### 1. **Integrating with Hexabot**
- In the Hexabot visual editor, add the necessary blocks for speech-to-text, text-to-speech, and vision plugins.
- Configure the blocks to handle incoming audio or image inputs.

### 2. **Speech-to-Text/Speech**
- Upload an audio file or record a voice message.
- The plugin will convert the audio into text, which can then be processed further within the Hexabot workflow.
- You can choose to receive the response as text or audio.

### 3. **Vision Plugin**
- Upload an image for processing.
- You can choose to receive either a text description or an audio file describing the image.

## Configuration
The main configuration is handled through the `settings.ts` file and Hexabot's visual editor. Here’s an overview of key configuration options:

### **Settings Configuration**
- **API Keys**: Define keys for external services like Groq and ElevenLabs.
- **Output Preferences**: Configure whether the Vision plugin should return text descriptions or audio files.
