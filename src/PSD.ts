import parseChannelImageData from './imageMode/ChannelImageData';
import { parseLayerImage, parsePsdImage } from './imageMode';
import parseHeaderSection from './structure/Header';
import { parseLayerMaskInfo } from './structure/LayerMaskInfo';
import File from './File';
import { AdditionalInfoInterface } from './additionalInfo';

type AdditionalInfoKey = keyof AdditionalInfoInterface;

export type ColorMode = 'Bitmap' | 'Grayscale' | 'Indexed' | 'RGB' | 'CMYK' | 'Multichannel' | 'Duotone' | 'Lab';

export const colorModeMap = {
    0: 'Bitmap',
    1: 'Grayscale',
    2: 'Indexed',
    3: 'RGB',
    4: 'CMYK',
    7: 'Multichannel',
    8: 'Duotone',
    9: 'Lab',
};

export class Channel {
    private _pixelData?: number[];
    private _channelImageData?: Buffer;

    constructor(
        readonly id: number,
        readonly size: number,
        readonly layer: Layer, // The layer that belongs to the channel
    ) {

    }

    get pixelData() {
        if (this._pixelData) {
            return this._pixelData;
        }
        if (!this._channelImageData) {
            throw new Error('This Channel Inexistence Image Data');
        }
        this._pixelData = parseChannelImageData(this._channelImageData, this.layer.height);
        return this._pixelData;
    }

    set imageData(data: Buffer) {
        if (data.length !== this.size) {
            throw new Error('The Buffer Size Not Match');
        }
        if (this._channelImageData) {
            throw new Error('The Image Data Is already Existence');
        }
        this._channelImageData = data;
    }
}

export class Layer {
    private _pixelData?: number[]; // [r, b, g, a, r, g, b, a...]
    

    name: string;

    coord: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }

    channels: Channel[] = [];

    blendMode: string;

    colorMode: ColorMode; // same sa Psd

    opacity: number;

    clipping: number; // 0 base | 1 non-base

    visible: boolean;

    additionlInfo: Map<AdditionalInfoKey, AdditionalInfoInterface[AdditionalInfoKey]>;

    imageData: Buffer;

    get width() {
        return this.coord.right - this.coord.left;
    }

    get height() {
        return this.coord.bottom - this.coord.top;
    }

    get pixelData() {
        if (this._pixelData) {
            return this._pixelData;
        }
        this._pixelData = parseLayerImage(this);
        return this._pixelData;
    }
    
}

export default class PSD {
    constructor(buffer: Buffer) {
        const file = new File(buffer);

        parseHeaderSection(file, this);
        // skip Color Mode Data Section
        file.skip(file.readUInt());
        // skip Image Resource Blocks
        file.skip(file.readUInt());
        parseLayerMaskInfo(file, this);
        this.imageData = file.read(file.length - file.position);

    }

    private _pixelData?: number[]; // [r, g, b, r, g, b....]

    width: number;

    height: number;

    channels: number;

    depth: number;

    colorMode: ColorMode;

    layers: Layer[] = [];

    imageData: Buffer;

    get pixelData() {
        if (this._pixelData) {
            return this._pixelData;
        }
        this._pixelData = parsePsdImage(this);
        return this._pixelData;
    }
}