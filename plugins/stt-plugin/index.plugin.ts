import { AttachmentService } from '@/attachment/services/attachment.service';
import { Block } from '@/chat/schemas/block.schema';
import { Context } from '@/chat/schemas/types/context';
import { OutgoingMessageFormat, StdOutgoingEnvelope } from '@/chat/schemas/types/message';
import { BlockService } from '@/chat/services/block.service';
import GeminiLlmHelper from '@/contrib/extensions/helpers/hexabot-helper-gemini/index.helper';
import SpeechHelper from '@/custom/extensions/helpers/speech-helper/index.helper';
import { HelperService } from '@/helper/helper.service';
import { HelperType } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { BaseBlockPlugin } from '@/plugins/base-block-plugin';
import { PluginService } from '@/plugins/plugins.service';
import { PluginBlockTemplate } from '@/plugins/types';
import { SettingService } from '@/setting/services/setting.service';
import { Injectable } from '@nestjs/common';
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
    private readonly attachmentService: AttachmentService,
    private readonly helperService: HelperService,
    private readonly logger: LoggerService
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
    try {
      const audioBool = 1;
      const helper = this.helperService.use(HelperType.UTIL, SpeechHelper)
      const transcription = await helper.speechToText(context.text, this.attachmentService);

      const ollama = this.helperService.use(HelperType.LLM, GeminiLlmHelper);

      const text = await ollama.generateChatCompletion(transcription, 'gemini-1.5-flash', 'You are an AI assistant that answers briefly, 2-3 phrases maximum', [])

      const audio = await helper.textToSpeech(text, this.attachmentService)
      if (audioBool)
        return audio
      const msg: StdOutgoingEnvelope = {
        format: OutgoingMessageFormat.text,
        message: { text },
      };

      /**
       * 
       */
      return msg;
    } catch (err) {
      this.logger.error(err);
      const msg: StdOutgoingEnvelope = {
        format: OutgoingMessageFormat.text,
        message: { text: 'Something went wrong' },
      };
      return msg;
    }
  }
}