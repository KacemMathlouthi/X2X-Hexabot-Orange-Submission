import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export default [
  {
    label: 'API Key',
    group: 'textarea',
    type: SettingType.text,
    value: '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', 
  },
  {
    label: 'AudioOutput',
    group: 'text',
    type: SettingType.text,
    value: '1', 
  },
  {
    label: 'prompt',
    group: 'text',
    type: SettingType.text,
    value: "What's in this image?", 
  },
] as const satisfies PluginSetting[];


