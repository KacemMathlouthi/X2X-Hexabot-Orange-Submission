/*
 * Copyright © 2024 Hexastack. All rights reserved.
 *
 * Licensed under the GNU Affero General Public License v3.0 (AGPLv3) with the following additional terms:
 * 1. The name "Hexabot" is a trademark of Hexastack. You may not use this name in derivative works without express written permission.
 * 2. All derivative works must include clear attribution to the original creator and software, Hexastack and Hexabot, in a prominent location (e.g., in the software's "About" section, documentation, and README file).
 */

import { PluginSetting } from '@/plugins/types';
import { SettingType } from '@/setting/schemas/types';

export default [
  {
    label: 'API Key',
    group: 'textarea',
    type: SettingType.text,
    value: 'sk_9333f3ec62d9494d3b5e6e25d57c454e4d10b225d695aa72', 
  },
  {
    label: 'Voice Id',
    group: 'textarea',
    type: SettingType.text,
    value: '9BWtsMINqrJLrRacOk9x', 
  },
] as const satisfies PluginSetting[];
