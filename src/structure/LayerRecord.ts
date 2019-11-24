import File from '../File';
import PSD, { Layer, Channel } from '../PSD';
import parseAdditionalLayerInfo from './LayerAdditionalInfo';

export default function parseLayerRecord(file: File, psd: PSD) {
    const layer = new Layer();
    layer.colorMode = psd.colorMode;

    layer.coord = {
        top: file.readUInt(),
        left: file.readUInt(),
        bottom: file.readUInt(),
        right: file.readUInt(),
    }

    const channels = file.readUShort();

    for (let i = 0; i < channels; i++) {
        const id = file.readShort();
        const size = file.readUInt();
        const channel = new Channel(id, size, layer);
        layer.channels.push(channel);
    }

    file.skip(4); // it`s 8BIM signature
    layer.blendMode = file.readString(4);
    layer.opacity = file.readUByte();
    layer.clipping = file.readUByte();

    const flags = file.readUByte();
    layer.visible = (flags & 2) === 0;
    // layer.transparencyProtected = flags & 1;
    file.skip(1);

    const extraDataLength = file.readUInt();
    const tell = file.position + extraDataLength;

    // skip layer mask
    file.skip(file.readUInt());
    // skip layer blending ranges
    file.skip(file.readUInt());

    layer.name = file.readString(File.pad4(file.readUByte()) - 1); // It`s a legacy name

    parseAdditionalLayerInfo(file, layer, tell);

    // skip others
    file.seek(tell);

    psd.layers.push(layer);
}