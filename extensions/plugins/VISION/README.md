## **Vision Plugin**

**Plugin Description**:  
The Vision Plugin enables Hexabot to analyze and interpret image attachments by sending them to a vision model. This allows chatbots to process image input, enabling image-based queries and description generation.

**Features**:  
- Analyzes images using a vision model (e.g., Llama-3.2 with vision capabilities).  
- Supports image attachments in common formats (JPEG, PNG, etc.).  
- Converts images into base64 encoding for compatibility with external models.  
- Provides detailed analysis or description of the content in the image.
- Easy integration into Hexabot’s chatbot workflow using the visual editor.

**Prerequisites**:  
- API key for the vision model (currently Groq for the Llama-3.2 vision model).  
- Hexabot installation with the necessary permissions to handle image attachments.  
- Access the vision model with the plugin's API key.

**Installation Instructions**:  
1. Clone or download the Vision Plugin repository.  
2. Place the plugin folder in the `/extensions/plugins/` directory of your Hexabot project.  
3. Run `npm install` to install any required dependencies.  
4. Add the necessary API key in the plugin's `settings.ts` file or through the plugin settings interface.

**Configuration**:  
1. Configure the API key for Groq's Llama vision model in `settings.ts` or via the plugin settings interface.  
2. Ensure proper configuration of the image attachment handling in Hexabot's visual editor.  

**Usage Guide**:  
1. Add the Vision block to your Hexabot chatbot workflow using the visual editor.  
2. Once an image file is received, the plugin automatically sends it to the vision model and returns a description or analysis of the content.  
3. You can then use the returned analysis or description in subsequent chatbot actions or responses, such as answering user questions about the image.
