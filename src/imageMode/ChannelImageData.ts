import File from '../File';
import PSD, { Layer } from '../PSD';

function parseRaw(file: File) {
    const pixels: number[] = [];
    while (file.position < file.length) {
        pixels.push(file.readUByte());
    }
    return pixels;
}

function parseRLE(file: File, lines: number) {
    const pixels: number[] = [];
    const scanLines: number[] = [];
    for (let i = 0; i < lines; i++) {
        scanLines.push(file.readUShort());
    }

    for (const bytes of scanLines) {
        const endPos = file.position + bytes;

        while (file.position < endPos) {
            const len = file.readUByte();
            if (len > 128) {
                const length = 0xff - len + 2
                const val = file.readUByte();
                for (let l = 0; l < length; l++) {
                    pixels.push(val);
                }
            } else {
                const length = len + 1;
                for (let l = 0; l < length; l++) {
                    pixels.push(file.readUByte());
                }
            }
        }
    }
    return pixels;
}

export default function parseChannelImageData(buffer: Buffer, lines = 0) {
    const internalFile = new File(buffer);
    const compression = internalFile.readShort();
    switch (compression) {
        case 0: return parseRaw(internalFile);
        case 1: return parseRLE(internalFile, lines);
    }

    return [];
}