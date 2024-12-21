import { AttachmentService } from '@/attachment/services/attachment.service';
import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import { OutgoingMessageFormat, StdOutgoingEnvelope } from '@/chat/schemas/types/message';
import { BlockService } from '@/chat/services/block.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';
import { SettingService } from '@/setting/services/setting.service';
import { Injectable } from '@nestjs/common';
import fs from "fs";
import Groq from 'groq-sdk';
import SETTINGS from './settings';

@Injectable()
export class SpeechToTextPlugin extends BaseBlockPlugin<typeof SETTINGS> {
  template: PluginBlockTemplate = {
    patterns: ['/attachment/'],  
    starts_conversation: true,  
    name: 'Speech-to-Text Plugin',  
  };

  private groqClient: Groq;

  constructor(
    pluginService: PluginService,
    private readonly blockService: BlockService,
    private readonly settingService: SettingService,
    private readonly attachmentService: AttachmentService
  ) {
    super('stt-plugin', pluginService);
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
    
    console.log('Here is my context:', context);

    // Extract file id from context text
    const urlRegex = /attachment:audio:http:\/\/localhost:4000\/attachment\/download\/([a-f0-9]{24})/;

    const match = context.text.match(urlRegex);

    if (!match) {
      throw new Error('No audio id found in the context');
    }

    var ID = match[1];
    console.log('Extracted ID:', ID);

    const attachment = await this.attachmentService.findOne(ID)
    console.log("Here is my attachment", attachment)

    var path = attachment.location
    console.log("MY CURRENT PATH IS",__dirname)

    const transcription = await groqClient.audio.transcriptions.create({
      file: fs.createReadStream("/app/uploads/"+path),
      model: "distil-whisper-large-v3-en",
      response_format: "verbose_json",
    });
    console.log("Transcribed text",transcription.text);

    const msg: StdOutgoingEnvelope = {
      format: OutgoingMessageFormat.text,
      message: { text: transcription.text },
    };
    return msg;
  }
}