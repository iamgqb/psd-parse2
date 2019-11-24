import File from '../File';
import { Layer } from '../PSD';

export default interface AdditionalInterface {
    key: string;
    parse(file: File, blockSize: number, layer: Layer): void;
}