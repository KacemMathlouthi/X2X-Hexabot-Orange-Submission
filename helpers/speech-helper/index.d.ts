
import SPEECH_HELPER_SETTINGS, { SPEECH_HELPER_NAMESPACE } from './settings';

declare global {
    interface Settings extends SettingTree<typeof SPEECH_HELPER_SETTINGS> { }
}

declare module '@nestjs/event-emitter' {
    interface IHookExtensionsOperationMap {
        [SPEECH_HELPER_NAMESPACE]: TDefinition<
            object,
            SettingMapByType<typeof SPEECH_HELPER_SETTINGS>
        >;
    }
}