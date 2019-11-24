import AdditionalInterface from './AdditionalInterface';
import { UnicodeLayerName, luni } from './UnicodeLayerName';
import { SectionDividerSetting, lsct } from './SectionDividerSetting';

export const AdditionalParserMap: Map<AdditionalInterface['key'], AdditionalInterface['parse']> = new Map();
[
    UnicodeLayerName,
    SectionDividerSetting
].forEach(addition => {
    AdditionalParserMap.set(addition.key, addition.parse);
});

export type AdditionalInfoInterface = luni & lsct;