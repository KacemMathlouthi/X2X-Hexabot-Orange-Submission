import { HelperSetting } from "@/helper/types";
import { SettingType } from "@/setting/schemas/types";

export const SPEECH_HELPER_NAME = "speech-helper";
export const SPEECH_HELPER_NAMESPACE = "speech_helper";

export default [
    {
        label: 'api_key',
        group: SPEECH_HELPER_NAMESPACE,
        type: SettingType.text,
        value: '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',
    },
] as const satisfies HelperSetting<typeof SPEECH_HELPER_NAME>[]