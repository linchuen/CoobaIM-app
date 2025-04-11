// import SockJS from 'sockjs-client';
import type { IMessage } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import config from '../app/config';
import type * as pb_1 from "google-protobuf";

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
            brokerURL: config.wsUrl + "?" + userId,
            reconnectDelay: 5000, // 自動重連間隔（5秒）
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000
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
                const parsedMessage: T = JSON.parse(message.body);

                console.log("📩 Received:", parsedMessage);

                // 调用泛型 callback
                callback(parsedMessage);
            } catch (error) {
                console.error("❌ Failed to process incoming message:", error);
            }
        });
        console.log(`📩 Subscribed to: ${destination}`);
    }

    public subscribeBinary(destination: string, callback: (message: Uint8Array) => void): void {
        if (config.useFake) return

        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ WebSocket is not connected. Cannot subscribe.");
            return;
        }

        this.stompClient.subscribe(destination, (message: IMessage) => {
            try {
                callback(message.binaryBody);
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

        this.stompClient.publish({
            destination: destination,
            body: JSON.stringify(message),
        });
        console.log(`📤 Sent message to ${destination}:`, message);
    }

    public sendBinaryMessage(destination: string, message: pb_1.Message): void {
        if (config.useFake) return

        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ WebSocket is not connected. Cannot send message.");
            return;
        }

        this.stompClient.publish({
            destination: destination,
            binaryBody: message.serializeBinary(),
            headers: { "content-type": "application/protobuf" },
        });
        console.log(`📤 Sent message to ${destination}:`, message);
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false;
    }
}
