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
import * as crypto from 'crypto';
import { ElevenLabsClient } from 'elevenlabs';
import * as fs from 'fs';
import * as path from 'path';

import { Attachment } from '@/attachment/schemas/attachment.schema';
import { AttachmentPayload, FileType, WithUrl } from '@/chat/schemas/types/attachment';
import SETTINGS from './settings';


@Injectable()
export class TextToSpeechPlugin extends BaseBlockPlugin<typeof SETTINGS> {
  template: PluginBlockTemplate = {
    patterns: ['speech'],
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

    const context_msg = context.text;
    console.log(context_msg);
    
    try {
      // Call the textToSpeech function to generate audio and get the uploaded file's URL
      const uploadedFile = await this.textToSpeech(context_msg, args);
      console.log(uploadedFile);

      // Construct the attachment message envelope
      const attachmentMessage: StdOutgoingAttachmentMessage<WithUrl<Attachment>> = {
        attachment: uploadedFile,
      };

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

  private async textToSpeech(text: string, args: any): Promise<AttachmentPayload<WithUrl<Attachment>>> {
    const apiKey = args['API Key']; 
    const voiceId = args['Voice Id'];
  
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
  
      // Generate unique file and directory names
      const randomId = crypto.randomBytes(8).toString('hex');
      const fileName = `speech_${randomId}.mp3`;
      const uploadDir = '/app/uploads';
      const savefilePath = '/'+fileName;
      const filePath= path.join(uploadDir,fileName)
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const writeStream = fs.createWriteStream(filePath);
      audioStream.pipe(writeStream);
  
      return new Promise((resolve, reject) => {
        writeStream.on('finish', async () => {
          try {
            const stats = fs.statSync(filePath);
  
            // Create Attachment in the database
            const attachment = await this.attachmentService.create({
              name: fileName,
              type: "audio/mp3",
              size: stats.size,
              location: savefilePath, // Full file path saved in DB for storage purposes
            });

            console.log(attachment);
            
            const attachmentPayload: AttachmentPayload<WithUrl<Attachment>> = {
              payload: {
                id: attachment.id, // ID from the database
                name: attachment.name,
                type: attachment.type,
                size: attachment.size,
                url: attachment.url, // URL generated by the virtual getter
                location: attachment.location,
                createdAt: attachment.createdAt,
                updatedAt: attachment.updatedAt,
              },
              type: FileType.audio,
            };
  
            console.log(`Attachment created: ${JSON.stringify(attachmentPayload)}`);
            resolve(attachmentPayload);
          } catch (error) {
            console.error("Error creating attachment:", error);
            reject(error);
          }
        });
  
        writeStream.on('error', (error) => {
          console.error("Error writing audio file:", error);
          reject(error);
        });
      });
    } catch (error) {
      console.error("Error during text-to-speech conversion:", error);
      throw error;
    }
  }
}