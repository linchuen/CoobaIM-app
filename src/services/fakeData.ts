

export const previousChats = [
    {
      id: "-20",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "最近我在研究 STOMP 和 WebSocket，有點搞不清楚兩者的關係。",
      type: "TEXT",
      createdTime: "2025-03-30T08:00:00Z"
    },
    {
      id: "-19",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "簡單來說，STOMP 是一種訊息協議，通常會跑在 WebSocket 之上。",
      type: "TEXT",
      createdTime: "2025-03-30T08:01:10Z"
    },
    {
      id: "-18",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "所以 WebSocket 提供連線通道，而 STOMP 負責格式跟控制？",
      type: "TEXT",
      createdTime: "2025-03-30T08:02:20Z"
    },
    {
      id: "-17",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "對，STOMP 像是 WebSocket 上的 HTTP，用來規範訊息如何傳送、訂閱、取消訂閱等。",
      type: "TEXT",
      createdTime: "2025-03-30T08:03:30Z"
    },
    {
      id: "-16",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "那我可以只用原生 WebSocket 而不用 STOMP 嗎？",
      type: "TEXT",
      createdTime: "2025-03-30T08:04:40Z"
    },
    {
      id: "-15",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "可以啊，只是你要自己實作訊息協議和管理連線、訂閱邏輯。",
      type: "TEXT",
      createdTime: "2025-03-30T08:06:00Z"
    },
    {
      id: "-14",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "這樣維護起來可能會比較麻煩吧？",
      type: "TEXT",
      createdTime: "2025-03-30T08:07:10Z"
    },
    {
      id: "-13",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "是啊，尤其在多人聊天室或通知系統，STOMP 提供的 pub/sub 模型很有幫助。",
      type: "TEXT",
      createdTime: "2025-03-30T08:08:25Z"
    },
    {
      id: "-12",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "我看 Spring Boot 有內建 STOMP 支援，好像也不難用？",
      type: "TEXT",
      createdTime: "2025-03-30T08:09:30Z"
    },
    {
      id: "-11",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "對，搭配 `@MessageMapping` 和 `/topic` 訂閱路徑就能實現簡單聊天室。",
      type: "TEXT",
      createdTime: "2025-03-30T08:10:50Z"
    },
    {
      id: "-10",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "那前端要用哪個 library 比較好？",
      type: "TEXT",
      createdTime: "2025-03-30T08:12:00Z"
    },
    {
      id: "-9",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "通常會搭配 `@stomp/stompjs` 和 `sockjs-client`，可以自動處理 fallback 和重連。",
      type: "TEXT",
      createdTime: "2025-03-30T08:13:10Z"
    },
    {
      id: "-8",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "我之前只用過 socket.io，STOMP 跟它有什麼不同？",
      type: "TEXT",
      createdTime: "2025-03-30T08:14:20Z"
    },
    {
      id: "-7",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "socket.io 是一整套解決方案，STOMP 則只是個協議；socket.io 也有自己的訊息格式。",
      type: "TEXT",
      createdTime: "2025-03-30T08:15:40Z"
    },
    {
      id: "-6",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "那你會推薦哪一種用在即時通知系統？",
      type: "TEXT",
      createdTime: "2025-03-30T08:17:00Z"
    },
    {
      id: "-5",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "如果後端是 Java，Spring Boot + STOMP 很方便；如果是 Node.js，就 socket.io 比較搭。",
      type: "TEXT",
      createdTime: "2025-03-30T08:18:30Z"
    },
    {
      id: "-4",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "了解，那 STOMP 可以做到分群廣播嗎？像只通知特定房間的使用者？",
      type: "TEXT",
      createdTime: "2025-03-30T08:19:45Z"
    },
    {
      id: "-3",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "可以啊，每個房間訂閱不同的 topic，例如 `/topic/room/1`，只要推送到該 topic 就行。",
      type: "TEXT",
      createdTime: "2025-03-30T08:20:50Z"
    },
    {
      id: "-2",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "那認證部分怎麼處理？WebSocket 好像沒辦法送 token？",
      type: "TEXT",
      createdTime: "2025-03-30T08:22:00Z"
    },
    {
      id: "-1",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "可以透過連線參數或 header 傳 token，後端用 `HandshakeInterceptor` 做驗證。",
      type: "TEXT",
      createdTime: "2025-03-30T08:23:15Z"
    }
  ];
  
  
  export const defaultChats = [
    {
      "id": "1",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "你有用過 React 嗎？我最近在學習它的 Hooks。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:00:00Z"
    },
    {
      "id": "2",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "當然，Hooks 很好用，尤其是 useState 和 useEffect。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:01:10Z"
    },
    {
      "id": "3",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "useEffect 在什麼情境下應該用？有時候覺得很難掌握。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:02:45Z"
    },
    {
      "id": "4",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "主要用來處理副作用，比如 API 請求、訂閱事件或 DOM 操作。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:03:30Z"
    },
    {
      "id": "5",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "這是 useEffect 和 useLayoutEffect 的比較圖，或許能幫助理解。",
      "type": "IMAGE",
      "url": "https://storage.googleapis.com/zenn-user-upload/fb997d4dae09-20220216.png",
      "createdTime": "2025-03-30T09:04:50Z"
    },
    {
      "id": "6",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "這張圖不錯！有時候 useEffect 和 useLayoutEffect 讓我搞混。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:06:00Z"
    },
    {
      "id": "7",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "我找到一張 Redux 和 Zustand 的比較圖，應該有幫助！",
      "type": "IMAGE",
      "url": "https://storage.googleapis.com/zenn-user-upload/7cc2ba94bae7-20220216.png",
      "createdTime": "2025-03-30T09:07:30Z"
    },
    {
      "id": "8",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "感謝！Redux 似乎比較適合大型應用。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:08:10Z"
    },
    {
      "id": "9",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "沒錯，那後端開發你比較推薦 Node.js 還是 Python？",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:09:20Z"
    },
    {
      "id": "10",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "看需求，如果要做 API 服務，Node.js 很適合，機器學習相關的話 Python 更強。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:10:30Z"
    },
    {
      "id": "11",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "這是 Node.js 和 Python 的性能比較圖，看看哪個更符合你的需求。",
      "type": "IMAGE",
      "url": "https://blog.webcodegenie.com/Node.js-vs-Python-Pros-and-Cons-for-Backend-Development-2048x1365.jpg",
      "createdTime": "2025-03-30T09:11:45Z"
    },
    {
      "id": "12",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "確實，Node.js 的 I/O 性能很強，適合高並發應用。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:13:00Z"
    },
    {
      "id": "13",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "如果用 Node.js，Express 和 NestJS 你會怎麼選？",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:14:10Z"
    },
    {
      "id": "14",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "Express 簡單靈活，NestJS 適合大型專案，因為有 TypeScript 和依賴注入。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:15:00Z"
    },
    {
      "id": "15",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "這是 Express 和 NestJS 的架構比較圖，可以看看差異。",
      "type": "IMAGE",
      "url": "https://www.sphinx-solution.com/blog/wp-content/uploads/2023/11/web-app-development.webp",
      "createdTime": "2025-03-30T09:16:25Z"
    },
    {
      "id": "16",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "很清楚的對比，NestJS 的架構跟 Angular 有點像。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:17:10Z"
    },
    {
      "id": "17",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "沒錯，那如果做即時通訊，WebSocket 還是 Socket.io 比較好？",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:18:20Z"
    },
    {
      "id": "18",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "Socket.io 更方便，內建很多功能，但底層還是基於 WebSocket。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:19:40Z"
    },
    {
      "id": "19",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "這是 WebSocket 和 Socket.io 的比較圖，看看它們的差異。",
      "type": "IMAGE",
      "url": "https://cdn.educba.com/academy/wp-content/uploads/2018/11/WebSocket-vs-Socket.io_-2.png",
      "createdTime": "2025-03-30T09:20:50Z"
    },
    {
      "id": "20",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "清楚多了，Socket.io 確實省掉很多繁瑣的 WebSocket 設置。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:22:00Z"
    },
    {
      "id": "21",
      "userId": 2,
      "name": "Alice",
      "roomId": 1,
      "message": "如果做微服務架構，你會選擇什麼框架？",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:23:10Z"
    },
    {
      "id": "22",
      "userId": 1,
      "name": "Bob",
      "roomId": 1,
      "message": "Spring Boot（Java）或 NestJS（Node.js）都是不錯的選擇，看你的技術棧。",
      "type": "TEXT",
      "createdTime": "2025-03-30T09:24:20Z"
    }
  ];
  
  export const afterChats = [
    {
      id: "23",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "你有沒有想過資深工程師之後的發展？我最近一直在思考技術 vs 管理的路線。",
      type: "TEXT",
      createdTime: "2025-03-30T09:25:30Z"
    },
    {
      id: "24",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "有啊，這幾年就是一直在 IC 跟 tech lead 間拉扯，想寫 code 又怕限制影響力。",
      type: "TEXT",
      createdTime: "2025-03-30T09:26:40Z"
    },
    {
      id: "25",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "我也是，我發現很多公司其實不太清楚怎麼發展 IC ladder，最後都被推去管人。",
      type: "TEXT",
      createdTime: "2025-03-30T09:27:55Z"
    },
    {
      id: "26",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "真的，IC 要有影響力很吃文化。我現在比較想走技術策略、架構師那種角色。",
      type: "TEXT",
      createdTime: "2025-03-30T09:28:50Z"
    },
    {
      id: "27",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "我前同事轉去當 Staff Engineer，他說每天都在做技術決策、Mentor、推動平台化。",
      type: "TEXT",
      createdTime: "2025-03-30T09:29:45Z"
    },
    {
      id: "28",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "這樣聽起來還不錯，不過那種角色好像要非常熟內部脈絡，橫向影響力超重要。",
      type: "TEXT",
      createdTime: "2025-03-30T09:30:30Z"
    },
    {
      id: "29",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "你有沒有考慮過出國或遠端工作？我朋友跳去美國的初創公司，薪資翻倍還 remote。",
      type: "TEXT",
      createdTime: "2025-03-30T09:31:20Z"
    },
    {
      id: "30",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "有研究過，現在 visa 比以前難了，但遠端機會多了不少，只是時差跟溝通要適應。",
      type: "TEXT",
      createdTime: "2025-03-30T09:32:10Z"
    },
    {
      id: "31",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "對，有些人會走 consultant 或 freelancer 路線，專門解決深度技術問題。",
      type: "TEXT",
      createdTime: "2025-03-30T09:33:05Z"
    },
    {
      id: "32",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "我也有朋友做顧問型 CTO，幫多間 startup 搭 MVP 架構，時薪很驚人。",
      type: "TEXT",
      createdTime: "2025-03-30T09:34:00Z"
    },
    {
      id: "33",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "那你有考慮創業嗎？還是繼續深耕技術？",
      type: "TEXT",
      createdTime: "2025-03-30T09:35:10Z"
    },
    {
      id: "34",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "創業蠻吸引人的，但我個性偏穩，我比較想做 internal startup 或技術孵化團隊。",
      type: "TEXT",
      createdTime: "2025-03-30T09:36:20Z"
    },
    {
      id: "35",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "那種 internal startup 模式不錯，像 Google X 或 LINE Dev Lab 那樣的模式。",
      type: "TEXT",
      createdTime: "2025-03-30T09:37:10Z"
    },
    {
      id: "36",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "最近還有想過轉 AI 相關的領域，像 LLM Infra 或 AI Agent 系統整合。",
      type: "TEXT",
      createdTime: "2025-03-30T09:38:05Z"
    },
    {
      id: "37",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "那很有前景欸，我最近在研究 LangChain 跟 vector DB，蠻有趣的。",
      type: "TEXT",
      createdTime: "2025-03-30T09:39:00Z"
    },
    {
      id: "38",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "我覺得 AI 不一定要會模型訓練，搞整合與 infra 更容易落地。",
      type: "TEXT",
      createdTime: "2025-03-30T09:40:00Z"
    },
    {
      id: "39",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "說的沒錯，能把 AI embed 到實際產品中才是王道。",
      type: "TEXT",
      createdTime: "2025-03-30T09:40:45Z"
    },
    {
      id: "40",
      userId: 1,
      name: "Bob",
      roomId: 1,
      message: "總之現在選擇很多，重點是找到有熱情又能長期投入的方向。",
      type: "TEXT",
      createdTime: "2025-03-30T09:41:30Z"
    },
    {
      id: "41",
      userId: 2,
      name: "Alice",
      roomId: 1,
      message: "沒錯，繼續觀察和準備，有機會就果斷出手。",
      type: "TEXT",
      createdTime: "2025-03-30T09:42:10Z"
    }
  ];
  