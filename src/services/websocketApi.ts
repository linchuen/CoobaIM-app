// import SockJS from 'sockjs-client';
import type { IMessage } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import config from '../app/config';
import lz4 from "lz4js";
import LZUTF8 from "lzutf8";

export class WebSocketManager {
    private static instance: WebSocketManager;
    private stompClient: Client | null = null;
    private endpoint: string;
    private onConnectCallback?: () => void;
    private onDisconnectCallback?: () => void;

    private constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    public static getInstance(endpoint: string = "/ws"): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager(endpoint);
        }
        return WebSocketManager.instance;
    }

    public connect(userId: number, token: string, onConnect?: () => void, onDisconnect?: () => void): void {
        this.onConnectCallback = onConnect;
        this.onDisconnectCallback = onDisconnect;

        if (config.useFake) {
            if (this.onConnectCallback) {
                this.onConnectCallback();
            }
            return
        }

        // const socket = new SockJS(config.apiUrl + this.endpoint + "?" + userId);
        this.stompClient = new Client({
            // webSocketFactory: () => socket,
            brokerURL: config.wsUrl + this.endpoint + "?" + userId,
            reconnectDelay: 5000, // 自動重連間隔（5秒）
            connectHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        this.stompClient.onConnect = () => {
            console.log("✅ Connected to WebSocket");
            if (this.onConnectCallback) {
                this.onConnectCallback();
            }
        };

        this.stompClient.onDisconnect = () => {
            console.log("❌ Disconnected from WebSocket");
            if (this.onDisconnectCallback) {
                this.onDisconnectCallback();
            }
        };

        this.stompClient.onStompError = (frame) => {
            console.error("STOMP Error:", this.stompClient?.connected, frame);
        };

        this.stompClient.activate();
    }

    public disconnect(): void {
        if (this.stompClient) {
            this.stompClient.deactivate();
            console.log("🔌 WebSocket connection closed");
        }
    }

    public subscribe<T>(destination: string, callback: (message: T) => void): void {
        if (config.useFake) return

        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ WebSocket is not connected. Cannot subscribe.");
            return;
        }

        this.stompClient.subscribe(destination, (message: IMessage) => {
            try {
                const compressedArrayBuffer = message.binaryBody;
                const compressedData = new Uint8Array(compressedArrayBuffer);
                const decompressedJson = new TextDecoder().decode(compressedData);
                const parsedMessage: T = JSON.parse(decompressedJson);
                // const parsedMessage: T = JSON.parse(message.body);

                console.log("📩 Received:", parsedMessage);

                // 调用泛型 callback
                callback(parsedMessage);
            } catch (error) {
                console.error("❌ Failed to process incoming message:", error);
            }
        });
        console.log(`📩 Subscribed to: ${destination}`);
    }

    public sendMessage(destination: string, message: any): void {
        if (config.useFake) return

        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ WebSocket is not connected. Cannot send message.");
            return;
        }

        const jsonString = JSON.stringify(message)
        console.log("jsonString", jsonString)
        const compressedData = LZUTF8.compress(jsonString);
        console.log("compressedData", compressedData)
        const decompressedJson =  LZUTF8.decompress(compressedData);
        console.log("decompressedJson", decompressedJson)
        this.stompClient.publish({
            destination: destination,
            binaryBody: compressedData,
            headers: { "content-type": "application/lz4-json" },
            // body: JSON.stringify(message),
        });
        console.log(`📤 Sent message to ${destination}:`, message);
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false;
    }
}
