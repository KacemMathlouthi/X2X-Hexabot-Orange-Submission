
import { HelperService } from '@/helper/helper.service';
import { HelperType } from '@/helper/types';
import { LoggerService } from '@/logger/logger.service';
import { SettingService } from '@/setting/services/setting.service';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import Groq from 'groq-sdk';

import { AttachmentService } from '@/attachment/services/attachment.service';
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
            apiKey: settings.api_key
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

}