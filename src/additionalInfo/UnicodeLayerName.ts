import AdditionalInterface from './AdditionalInterface';
import File from '../File';
import { Layer } from '../PSD';

export const UnicodeLayerName: AdditionalInterface = {
    key: 'luni',
    parse: (file: File, blockSize: number, layer: Layer) => {
        const layerName = file.readUnicodeString();
        layer.additionlInfo.set('luni', layerName)
        layer.name = layerName;
    }
};

export interface luni {
    luni: string;
}