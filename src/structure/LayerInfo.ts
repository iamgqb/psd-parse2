import File from '../File';
import PSD from '../PSD';
import parseLayerRecord from './LayerRecord';

export default function parseLayerInfo(file: File, psd: PSD) {
    const sectionLength = File.pad2(file.readUInt());
    const tell = file.position + sectionLength;

    const layerCount = file.readShort();
    // TODO:
    // If it is a negative number,
    // its absolute value is the number of layers
    // and the first alpha channel contains the transparency data for the merged result.
    if (layerCount < 0) {
        console.warn(`
            Wow, get a negative layer count case!
            And the first alpha channel contains the transparency data for the merged result;
            It\`s not implemented now;
        `);
    }

    for (let i = 0; i < Math.abs(layerCount); i++) {
        parseLayerRecord(file, psd);
    }

    psd.layers.forEach(layer => {
        layer.channels.forEach(channel => {
            channel.imageData = file.read(channel.size);
        });
    });

    file.seek(tell);
}