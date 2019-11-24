import PSD, { Layer } from '../PSD';
import parseChannelImageData from './ChannelImageData';

function parseLayerRGB(layer: Layer) {
    const pixels: number[] = new Array(layer.width * layer.height * 4).fill(0);
    layer.channels.forEach(channel => {
        let offset;
        switch (channel.id) {
            case -1: offset = 3; break; // alpha
            case  0: offset = 0; break; // red
            case  1: offset = 1; break; // green
            case  2: offset = 2; break; // blue
            case -2: return; // user supplied layer mask
        }
        channel.pixelData.forEach((pixel, idx) => {
            pixels[idx * 4 + offset] = pixel;
        });
    });
    return pixels;
}

export function parseLayerImage(layer: Layer) {
    switch (layer.colorMode) {
        case 'RGB': return parseLayerRGB(layer);
    }
}

function parsePsdRGB(data: number[], pixels: number) {
    const pixelData: number[] = [];
    for (let i = 0; i < pixels; i++) {
        pixelData[i * 3] = data[i];
        pixelData[i * 3 + 1] = data[i + pixels];
        pixelData[i * 3 + 2] = data[i + pixels * 2];
    }
    return pixelData;
}

export function parsePsdImage(psd: PSD) {
    const imageData = parseChannelImageData(psd.imageData, psd.channels * psd.height);
    const pixels = psd.width * psd.height;
    console.log(imageData.length)
    switch (psd.colorMode) {
        case 'RGB': return parsePsdRGB(imageData, pixels);
    }
    return [];
}