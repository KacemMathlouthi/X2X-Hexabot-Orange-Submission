import { AttachmentService } from '@/attachment/services/attachment.service';
import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import { OutgoingMessageFormat, StdOutgoingEnvelope } from '@/chat/schemas/types/message';
import { BlockService } from '@/chat/services/block.service';
import SpeechHelper from '@/custom/extensions/helpers/speech-helper/index.helper';
import { HelperService } from '@/helper/helper.service';
import { HelperType } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';
import { SettingService } from '@/setting/services/setting.service';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import Groq from 'groq-sdk';
import SETTINGS from './settings';

@Injectable()
export class VisionPlugin extends BaseBlockPlugin<typeof SETTINGS> {
  template: PluginBlockTemplate = {
    patterns: ['/attachment/'],  
    starts_conversation: true,  
    name: 'Vision Plugin',  
  };

  private groqClient: Groq;

  constructor(
    pluginService: PluginService,
    private readonly blockService: BlockService,
    private readonly settingService: SettingService,
    private readonly attachmentService: AttachmentService,
    private readonly helperService: HelperService,
    private readonly logger: LoggerService
    
  ) {
    super('vision-plugin', pluginService);
  }

  getPath(): string {
    return __dirname;
  }

  // Process method to handle the Speech-to-Text conversion
  async process(
    block: Block,
    context: Context,
    _convId: string,
  ): Promise<StdOutgoingEnvelope> {
    const settings = await this.settingService.getSettings();
    const args = this.getArguments(block);
    const groqClient = new Groq({
      apiKey: args['API Key'],
    })
    const audioBool = 1
    const helper = this.helperService.use(HelperType.UTIL, SpeechHelper)
    
    console.log('Here is my context:', context);

    // Extract file id from context text
    const idRegex = /attachment\/download\/([a-f0-9]{24})/;

    const match = context.text.match(idRegex);

    if (!match) {
      throw new Error('No image id found in the context');
    }

    var ID = match[1];
    console.log('Extracted ID:', ID);

    const attachment = await this.attachmentService.findOne(ID)
    console.log("Here is my attachment", attachment)

    var path = attachment.location
    console.log("MY CURRENT PATH IS",__dirname)

    function encodeImageToBase64(imagePath: string): string {
      const imageBuffer = fs.readFileSync(imagePath);
      return imageBuffer.toString('base64');
    }
    
    const imagePath = "/app/uploads/" + path;
    const base64Image = encodeImageToBase64(imagePath);

    // Determine the MIME type of the image based on its extension
    const mimeType = this.getMimeType(imagePath);

    // Construct the base64 data URL for the image
    const base64ImageUrl = `data:${mimeType};base64,${base64Image}`;

    const chatCompletion = await groqClient.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "What's in this image?"
            },
            {
              "type": "image_url",
              "image_url": {
                "url": base64ImageUrl
              }
            }
          ]
        }
      ],
      "model": "llama-3.2-11b-vision-preview",
      "temperature": 1,
      "max_tokens": 1024,
      "top_p": 1,
      "stream": false,
      "stop": null
    });  
    const output = chatCompletion.choices[0].message.content
    console.log(output);
    if(!audioBool){
      const msg: StdOutgoingEnvelope = {
        format: OutgoingMessageFormat.text,
        message: { text: output },
      };
      return msg;
    }
    const audio = await helper.textToSpeech(output, this.attachmentService)
    return audio
  }

  private getMimeType(imagePath: string): string {
    const ext = imagePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      default:
        return 'application/octet-stream'; // Fallback type
    }
  }
}