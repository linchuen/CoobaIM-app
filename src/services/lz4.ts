import lz4 from "lz4js";

export function compress(data: string): Uint8Array {
    const encoder = new TextEncoder();
    const input = encoder.encode(data);
    return lz4.compress(input)
}

export function decompress(compressedData: Uint8Array): string {
    const decompressedData = lz4.decompress(compressedData);

    const decoder = new TextDecoder();
    return decoder.decode(decompressedData);
}
