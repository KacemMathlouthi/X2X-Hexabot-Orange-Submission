import { HelperSetting } from "@/helper/types";
import { SettingType } from "@/setting/schemas/types";

export const SPEECH_HELPER_NAME = "speech-helper";
export const SPEECH_HELPER_NAMESPACE = "speech_helper";

export default [
    {
        label: 'api_key_groq',
        group: SPEECH_HELPER_NAMESPACE,
        type: SettingType.text,
        value: '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',
    },
    {
        label: 'api_key_elevenlabs',
        group: SPEECH_HELPER_NAMESPACE,
        type: SettingType.text,
        value: 'sk_9333f3ec62d9494d3b5e6e25d57c454e4d10b225d695aa72', 
    },
    {
        label: 'Voice_Id',
        group: SPEECH_HELPER_NAMESPACE,
        type: SettingType.text,
        value: '9BWtsMINqrJLrRacOk9x', 
    },
] as const satisfies HelperSetting<typeof SPEECH_HELPER_NAME>[]