import { AttachmentService } from '@/attachment/services/attachment.service';
import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import { OutgoingMessageFormat, StdOutgoingAttachmentEnvelope, StdOutgoingAttachmentMessage, StdOutgoingEnvelope } from '@/chat/schemas/types/message';
import { BlockService } from '@/chat/services/block.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';
import { SettingService } from '@/setting/services/setting.service';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto'; // Import crypto module for generating random IDs
import { ElevenLabsClient } from 'elevenlabs'; // Assuming ElevenLabsClient is a valid class for the API client
import * as fs from 'fs';
import * as path from 'path'; // Added to create a temporary path for the audio file

import { Attachment } from '@/attachment/schemas/attachment.schema';
import { FileType, WithUrl } from '@/chat/schemas/types/attachment';
import SETTINGS from './settings';

@Injectable()
export class TextToSpeechPlugin extends BaseBlockPlugin<typeof SETTINGS> {
  template: PluginBlockTemplate = {
    patterns: ['speech'],  // Trigger by the word 'speech'
    starts_conversation: true,
    name: 'Text to Speech Plugin',
  };

  constructor(
    pluginService: PluginService,
    private readonly blockService: BlockService,
    private readonly settingService: SettingService,
    private readonly attachmentService: AttachmentService
  ) {
    super('text-to-speech-plugin', pluginService);
  }

  getPath(): string {
    return __dirname;
  }

  async process(
    block: Block,
    context: Context,
    _convId: string,
  ): Promise<StdOutgoingEnvelope> {
    const settings = await this.settingService.getSettings();
    const args = this.getArguments(block);

    // Get the text to convert to speech (from block or user input)
    const context_msg = context.text;

    try {
      // Call the textToSpeech function to generate audio and get the uploaded file's URL
      const uploadedFileUrl = await this.textToSpeech(context_msg);
      console.log(uploadedFileUrl)
      // Construct the attachment message envelope
      const attachmentMessage: StdOutgoingAttachmentMessage<WithUrl<Attachment>> = {
      attachment:{
        type: FileType.audio, 
        payload: uploadedFileUrl,
      }
    }
      const attachmentEnvelope: StdOutgoingAttachmentEnvelope = {
        format: OutgoingMessageFormat.attachment,
        message: attachmentMessage,
      };

      return attachmentEnvelope;

    } catch (error) {
      console.error("Error during text-to-speech conversion:", error);
      const errorMessage = "There was an error processing your speech request.";
      return {
        format: OutgoingMessageFormat.text,
        message: {
          text: this.blockService.processText(errorMessage, context, {}, settings),
        },
      };
    }
  }

  private async textToSpeech(text: string): Promise<Attachment> {
    const apiKey = "sk_9333f3ec62d9494d3b5e6e25d57c454e4d10b225d695aa72";  // You should not hardcode this in production
    const voiceId = "9BWtsMINqrJLrRacOk9x";

    if (!apiKey || !voiceId) {
      throw new Error("Missing APIKEY or VOICEID.");
    }

    const client = new ElevenLabsClient({ apiKey });

    try {
      // Request audio stream from the ElevenLabs API
      const audioStream = await client.textToSpeech.convert(voiceId, {
        output_format: "mp3_44100_128",
        text: text,
        model_id: "eleven_multilingual_v2",
      });

      // Create a temporary file path for the audio file to upload it
      const tempFilePath = path.join(__dirname, 'temp_audio.mp3');
      const writeStream = fs.createWriteStream(tempFilePath);

      audioStream.pipe(writeStream);
      const randomId = crypto.randomBytes(8).toString('hex');  // Generates an 8-byte hex string
      const fileName = `speech_${randomId}.mp3`;  // Append the random ID to the file name
  
      return new Promise((resolve, reject) => {
        writeStream.on('finish', async () => {
          try {
            // Once the audio file is written, use the AttachmentService to upload it
            const fileToUpload = [{
              fieldname: 'file',  // The name of the field in the form
              originalname: 'speech.mp3', // The original name of the file
              encoding: '7bit',  // The encoding, commonly '7bit'
              mimetype: 'audio/mpeg',  // MIME type of the file
              size: 4000,  // File size
              destination: __dirname,  // Destination path (this is a mock, not needed by multer)
              filename: fileName,  // File name that will be used on the server
              path: tempFilePath,  // Path to the file
              stream: fs.createReadStream(tempFilePath),  // The readable stream of the file
              buffer: Buffer.alloc(0),  // Mock buffer, empty since the file is already on disk
            }];
  
            const uploadedFiles = await this.attachmentService.uploadFiles({ file: fileToUpload });

            // Clean up the temporary file after upload
            fs.unlinkSync(tempFilePath);

            if (uploadedFiles && uploadedFiles.length > 0) {
              const uploadedFile = uploadedFiles[0];
              resolve(uploadedFile); // Assuming location contains the file URL
            } else {
              reject('File upload failed.');
            }
          } catch (uploadError) {
            console.error("Error during file upload:", uploadError);
            reject(uploadError);
          }
        });

        writeStream.on('error', (error) => {
          console.error("Error writing to file:", error);
          reject(error);
        });
      });
    } catch (error) {
      console.error("Error during text-to-speech conversion:", error);
      throw error; // Re-throw the error to be handled in the process method
    }
  }
}
