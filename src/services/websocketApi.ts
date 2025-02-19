import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import config from '../app/config';

export function connectWebsokcet(endpoint: string, onConnect?: () => void, onDisconnect?: () => void): Client {
    const socket = new SockJS(config.apiUrl + endpoint);
    const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // 重新連接間隔（5 秒）
    });

    stompClient.onConnect = () => {
        console.log("✅ Connected to WebSocket");
        if (onConnect) {
            onConnect();
        }

    };

    stompClient.onDisconnect = () => {
        console.log("❌ Disconnected from WebSocket");
        if (onDisconnect) {
            onDisconnect();
        }
    };

    stompClient.onStompError = (frame) => {
        console.error("STOMP Error:", frame);
    };

    stompClient.activate();
    return stompClient;
}
