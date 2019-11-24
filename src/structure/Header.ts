import File from '../File';
import PSD, { colorModeMap } from '../PSD';

export default function parseHeaderSection(file: File, psd: PSD) {
    const signature = file.readString(4);
    const version = file.readUShort();

    if (signature !== '8BPS' || version !== 1) {
        throw new Error('It`s not a PSD File');
    }

    file.skip(6); // zero

    psd.channels = file.readUShort();
    psd.height = file.readUInt();
    psd.width = file.readUInt();
    psd.depth = file.readUShort();
    psd.colorMode = colorModeMap[file.readShort()];
}