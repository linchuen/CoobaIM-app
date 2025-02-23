import SockJS from 'sockjs-client';
import type { IMessage } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import config from '../app/config';

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

    public connect(onConnect?: () => void, onDisconnect?: () => void): void {
        this.onConnectCallback = onConnect;
        this.onDisconnectCallback = onDisconnect;

        const socket = new SockJS(config.apiUrl + this.endpoint);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // 自動重連間隔（5秒）
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
            console.error("STOMP Error:", frame);
        };

        this.stompClient.activate();
    }

    public disconnect(): void {
        if (this.stompClient) {
            this.stompClient.deactivate();
            console.log("🔌 WebSocket connection closed");
        }
    }

    public subscribe(destination: string, callback: (message: IMessage) => void): void {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ WebSocket is not connected. Cannot subscribe.");
            return;
        }

        this.stompClient.subscribe(destination, callback);
        console.log(`📩 Subscribed to: ${destination}`);
    }

    public sendMessage(destination: string, message: any): void {
        if (!this.stompClient || !this.stompClient.connected) {
            console.warn("⚠️ WebSocket is not connected. Cannot send message.");
            return;
        }

        this.stompClient.publish({ destination, body: JSON.stringify(message) });
        console.log(`📤 Sent message to ${destination}:`, message);
    }

    public isConnected(): boolean {
        return this.stompClient?.connected || false;
    }
}
