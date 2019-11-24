import PSD from '../PSD';
import File from '../File';
import parseLayerInfo from './LayerInfo';

export function parseLayerMaskInfo(file: File, psd: PSD) {
    const sectionLength = file.readUInt();
    const tell = file.position + sectionLength;

    parseLayerInfo(file, psd);

    file.seek(tell);
}