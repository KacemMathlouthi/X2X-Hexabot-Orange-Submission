import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export default [  
    {
    label: 'AudioOutput',
    group: 'text',
    type: SettingType.text,
    value: '1', 
    },
    {
     label: 'GeminiPrompt',
     group: 'text',
     type: SettingType.text,
     value: 'You are an AI assistant that answers briefly, 2-3 phrases maximum', 
    },
] as const satisfies PluginSetting[];


