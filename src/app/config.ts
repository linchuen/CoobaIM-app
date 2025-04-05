import { RoleType } from "../services/constant"

const globalConfig = {
  apiUrl: import.meta.env.VITE_API_URL ,
  wsUrl:  import.meta.env.VITE_WEBSOCKET ,
  livekitUrl: import.meta.env.VITE_LIVEKIT,
  appName: "Cooba IM App",
  useFake: false,
  testRole: RoleType.USER,
}

export default globalConfig
