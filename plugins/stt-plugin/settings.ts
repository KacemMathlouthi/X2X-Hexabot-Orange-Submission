import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export default [  
    {
    label: 'AudioOutput',
    group: 'text',
    type: SettingType.text,
    value: '1', 
    },
] as const satisfies PluginSetting[];


