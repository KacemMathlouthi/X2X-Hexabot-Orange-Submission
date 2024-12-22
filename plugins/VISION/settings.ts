import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export default [
  {
    label: 'API Key',
    group: 'textarea',
    type: SettingType.text,
    value: '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', 
  },
] as const satisfies PluginSetting[];


