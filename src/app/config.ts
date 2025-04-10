import { RoleType } from "../services/constant"

const globalConfig = {
  apiUrl: "/api",
  wsUrl:  "/ws" ,
  livekitUrl: import.meta.env.VITE_LIVEKIT,
  appName: "Cooba IM App",
  useFake: false,
  testRole: RoleType.USER,
}

export default globalConfig
