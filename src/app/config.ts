import { RoleType } from "../services/constant"

const globalConfig = {
  apiUrl: "http://127.0.0.1:8080",
  wsUrl: "ws://127.0.0.1:8080",
  livekitUrl: "http://127.0.0.1:7880",
  appName: "Cooba IM App",
  useFake: false,
  testRole: RoleType.USER,
}

export default globalConfig
