import { RoleType } from "../services/constant"

const globalConfig = {
  apiUrl: process.env.REACT_APP_API_URL || "http://127.0.0.1:8080",
  wsUrl:  process.env.REACT_APP_WEBSOCKET || "ws://127.0.0.1:8080",
  livekitUrl: process.env.REACT_APP_LIVEKIT || "http://127.0.0.1:7880",
  appName: "Cooba IM App",
  useFake: false,
  testRole: RoleType.USER,
}

export default globalConfig
