/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 6.30.1
 * source: Speak .proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export class SpeakRequest extends pb_1.Message {
    #one_of_decls: number[][] = [];
    constructor(data?: any[] | {
        uuid?: string;
        roomId?: number;
        userId?: number;
        message?: string;
        url?: string;
        type?: string;
    }) {
        super();
        pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
        if (!Array.isArray(data) && typeof data == "object") {
            if ("uuid" in data && data.uuid != undefined) {
                this.uuid = data.uuid;
            }
            if ("roomId" in data && data.roomId != undefined) {
                this.roomId = data.roomId;
            }
            if ("userId" in data && data.userId != undefined) {
                this.userId = data.userId;
            }
            if ("message" in data && data.message != undefined) {
                this.message = data.message;
            }
            if ("url" in data && data.url != undefined) {
                this.url = data.url;
            }
            if ("type" in data && data.type != undefined) {
                this.type = data.type;
            }
        }
    }
    get uuid() {
        return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
    }
    set uuid(value: string) {
        pb_1.Message.setField(this, 1, value);
    }
    get roomId() {
        return pb_1.Message.getFieldWithDefault(this, 2, 0) as number;
    }
    set roomId(value: number) {
        pb_1.Message.setField(this, 2, value);
    }
    get userId() {
        return pb_1.Message.getFieldWithDefault(this, 3, 0) as number;
    }
    set userId(value: number) {
        pb_1.Message.setField(this, 3, value);
    }
    get message() {
        return pb_1.Message.getFieldWithDefault(this, 4, "") as string;
    }
    set message(value: string) {
        pb_1.Message.setField(this, 4, value);
    }
    get url() {
        return pb_1.Message.getFieldWithDefault(this, 5, "") as string;
    }
    set url(value: string) {
        pb_1.Message.setField(this, 5, value);
    }
    get type() {
        return pb_1.Message.getFieldWithDefault(this, 6, "") as string;
    }
    set type(value: string) {
        pb_1.Message.setField(this, 6, value);
    }
    static fromObject(data: {
        uuid?: string;
        roomId?: number;
        userId?: number;
        message?: string;
        url?: string;
        type?: string;
    }): SpeakRequest {
        const message = new SpeakRequest({});
        if (data.uuid != null) {
            message.uuid = data.uuid;
        }
        if (data.roomId != null) {
            message.roomId = data.roomId;
        }
        if (data.userId != null) {
            message.userId = data.userId;
        }
        if (data.message != null) {
            message.message = data.message;
        }
        if (data.url != null) {
            message.url = data.url;
        }
        if (data.type != null) {
            message.type = data.type;
        }
        return message;
    }
    toObject() {
        const data: {
            uuid?: string;
            roomId?: number;
            userId?: number;
            message?: string;
            url?: string;
            type?: string;
        } = {};
        if (this.uuid != null) {
            data.uuid = this.uuid;
        }
        if (this.roomId != null) {
            data.roomId = this.roomId;
        }
        if (this.userId != null) {
            data.userId = this.userId;
        }
        if (this.message != null) {
            data.message = this.message;
        }
        if (this.url != null) {
            data.url = this.url;
        }
        if (this.type != null) {
            data.type = this.type;
        }
        return data;
    }
    serialize(): Uint8Array;
    serialize(w: pb_1.BinaryWriter): void;
    serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
        const writer = w || new pb_1.BinaryWriter();
        if (this.uuid.length)
            writer.writeString(1, this.uuid);
        if (this.roomId != 0)
            writer.writeInt64(2, this.roomId);
        if (this.userId != 0)
            writer.writeInt64(3, this.userId);
        if (this.message.length)
            writer.writeString(4, this.message);
        if (this.url.length)
            writer.writeString(5, this.url);
        if (this.type.length)
            writer.writeString(6, this.type);
        if (!w)
            return writer.getResultBuffer();
    }
    static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SpeakRequest {
        const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SpeakRequest();
        while (reader.nextField()) {
            if (reader.isEndGroup())
                break;
            switch (reader.getFieldNumber()) {
                case 1:
                    message.uuid = reader.readString();
                    break;
                case 2:
                    message.roomId = reader.readInt64();
                    break;
                case 3:
                    message.userId = reader.readInt64();
                    break;
                case 4:
                    message.message = reader.readString();
                    break;
                case 5:
                    message.url = reader.readString();
                    break;
                case 6:
                    message.type = reader.readString();
                    break;
                default: reader.skipField();
            }
        }
        return message;
    }
    serializeBinary(): Uint8Array {
        return this.serialize();
    }
    static deserializeBinary(bytes: Uint8Array): SpeakRequest {
        return SpeakRequest.deserialize(bytes);
    }
}
