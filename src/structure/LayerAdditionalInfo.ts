import File from '../File';
import { Layer } from '../PSD';
import AdditionalInterface from '../additionalInfo/AdditionalInterface';
import { UnicodeLayerName } from '../additionalInfo/UnicodeLayerName';
import { SectionDividerSetting } from '../additionalInfo/SectionDividerSetting';

const AdditionalMap: Map<AdditionalInterface['key'], AdditionalInterface['parse']> = new Map();
[
    UnicodeLayerName,
    SectionDividerSetting
].forEach(addition => {
    AdditionalMap.set(addition.key, addition.parse);
})

export default function parseAdditionalLayerInfo(file: File, layer: Layer, end: number) {
    while (file.position < end) {
        const sig = file.readString(4);
        if (sig === '8BIM' || sig === '8M64') {
            const key = file.readString(4);
            const length = file.readUInt();
            const tell = file.position + length;
            console.log(key)
            if (AdditionalMap.get(key)) {
                AdditionalMap.get(key)(file, length, layer);
            }
            file.seek(tell);
        } else {
            console.error('Get Error Signature When Parse Additional Layer Info');
            break;
        }
    }
}