import { RoleType } from "../services/constant"

const globalConfig = {
  apiUrl: "http://127.0.0.1:8081",
  livekitUrl: "http://127.0.0.1:7880",
  appName: "Cooba IM App",
  useFake: false,
  testRole: RoleType.AGENT,
}

export default globalConfig
