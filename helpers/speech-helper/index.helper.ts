
import { Attachment } from '@/attachment/schemas/attachment.schema';
import { AttachmentService } from '@/attachment/services/attachment.service';
import { AttachmentPayload, FileType, WithUrl } from '@/chat/schemas/types/attachment';
import { OutgoingMessageFormat, StdOutgoingAttachmentEnvelope, StdOutgoingAttachmentMessage } from '@/chat/schemas/types/message';
import { HelperService } from '@/helper/helper.service';
import { HelperType } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { SettingService } from '@/setting/services/setting.service';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ElevenLabsClient } from 'elevenlabs';
import fs from 'fs';

import Groq from 'groq-sdk';
import * as path from 'path';

import BaseHelper from '@/helper/lib/base-helper';
import { SPEECH_HELPER_NAME } from './settings';


@Injectable()
export default class SpeechHelper
    extends BaseHelper<typeof SPEECH_HELPER_NAME> {
    protected readonly type: HelperType = HelperType.UTIL;

    constructor(
        settingService: SettingService,
        helperService: HelperService,
        protected readonly logger: LoggerService,
    ) {
        super('speech-helper', settingService, helperService, logger);
    }

    getPath(): string {
        return __dirname;
    }

    async speechToText(attachmentUrl: string, attachmentService: AttachmentService) {
        const settings = await this.getSettings()
        const groqClient = new Groq({
            apiKey: "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"
        })

        // Extract file id from context text
        const urlRegex = /attachment:audio:http:\/\/localhost:4000\/attachment\/download\/([a-f0-9]{24})/;

        const match = attachmentUrl.match(urlRegex);

        if (!match) {
            throw new Error('No audio id found in the context');
        }

        var ID = match[1];
        console.log('Extracted ID:', ID);

        const attachment = await attachmentService.findOne(ID)
        console.log("Here is my attachment", attachment)

        var path = attachment.location
        console.log("MY CURRENT PATH IS", __dirname)

        const transcription = await groqClient.audio.transcriptions.create({
            file: fs.createReadStream("/app/uploads/" + path),
            model: "distil-whisper-large-v3-en",
            response_format: "verbose_json",
        });
        console.log("Transcribed text", transcription.text);
        return transcription.text
    }

    async textToSpeechHelper(text: string, attachmentService: AttachmentService): Promise<AttachmentPayload<WithUrl<Attachment>>> {
        const settings = await this.getSettings()
        const apiKey = "sk_9333f3ec62d9494d3b5e6e25d57c454e4d10b225d695aa72"
        const voiceId = "9BWtsMINqrJLrRacOk9x"
  
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
            const attachment = await attachmentService.create({
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

    async textToSpeech(text: string, attachmentService: AttachmentService) {
        // Call the textToSpeech function to generate audio and get the uploaded file's URL
        const uploadedFile = await this.textToSpeechHelper(text, attachmentService);
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
    
    };
}