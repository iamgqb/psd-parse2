import * as iconv from 'iconv-lite';

function Stepping(staticLen?: number) {
    return function(target: File, name: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const oldVal: Function = descriptor.value;
        descriptor.value = function(dynamicLen?: number) {
            const val = oldVal.call(this, dynamicLen);
            if (staticLen) {
                this._position += staticLen;
            } else if (dynamicLen) {
                this._position += dynamicLen;
            }
            return val;
        }
        return descriptor;
    }
}

export default class File {
    private _position = 0;
    private _length = 0;

    constructor(private buffer: Buffer) {
        this._length = buffer.length;
    }

    get length() {
        return this._length;
    }

    get position() {
        return this._position
    }

    skip(length: number) {
        return this._position += length;
    }

    seek(position: number) {
        if (position > this.length) {
            throw new Error('Out Of Range');
        }
        this._position = position;
    }

    @Stepping()
    read(length: number) {
        return this.buffer.subarray(this.position, this.position + length);
    }

    @Stepping(1)
    readUByte() {
        return this.buffer.readUInt8(this.position);
    }

    @Stepping(2)
    readShort() {
        return this.buffer.readInt16BE(this.position);
    }

    @Stepping(2)
    readUShort() {
        return this.buffer.readUInt16BE(this.position);
    }

    @Stepping(4)
    readUInt() {
        return this.buffer.readUInt32BE(this.position);
    }

    @Stepping()
    readString(length: number) {
        return this.buffer.toString('utf8', this.position, this.position + length);
    }

    /**
     * All values defined as Unicode string consist of:
     * A 4-byte length field, representing the number of characters in the string (not bytes).
     * The string of Unicode values, two bytes per character.
     */
    readUnicodeString() {
        const len = this.readUInt() * 2;
        return iconv.decode(this.buffer.slice(this.position, this.skip(len)), 'utf16-be');
    }

    static pad2(num: number) {
        return (num + 1) & ~0x01;
    }

    static pad4(num: number) {
        return (num + 4) & ~0x03;
    }
}
