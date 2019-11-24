import AdditionalInterface from './AdditionalInterface';
import File from '../File';
import { Layer } from '../PSD';

export const SectionDividerSetting: AdditionalInterface = {
    key: 'lsct',
    parse: (file: File, blockSize: number, layer: Layer) => {
        const type = file.readUInt();
        const info: Ilsct = { type };
        if (blockSize >= 12) {
            file.skip(4); // 8BIM;
            info.blendMode = file.readString(4);

            if (blockSize >= 16) {
                info.subType = file.readUInt();
            }
        }

        layer.additionlInfo.set('lsct', info);
    }
};

interface Ilsct {
    type: number;
    blendMode?: string;
    subType?: number;
}

export interface lsct {
    lsct: Ilsct;
}