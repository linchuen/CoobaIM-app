import config from "../app/config"
import { callFetch } from "./common"
import { FakeSuccessResponse } from "./FakeSuccessResponse"
import type { LiveBuildRequest } from "./RequestInterface"
import type { ApiResponse, LiveCall } from "./ResponseInterface"

export const fetchCreateLiveRoom = async (
    data: LiveBuildRequest,
    token: string,
  ): Promise<ApiResponse<LiveCall>> => {
    return config.useFake
      ? new FakeSuccessResponse({
        roomId: 0,
        roomName: "test",
        passcode: "",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsaXZla2l0X2FwaV9rZXkiLCJleHAiOjE3NDA5NTY4OTgsInN1YiI6IjEiLCJqdGkiOiIxIiwibmFtZSI6InRlc3QiLCJtZXRhZGF0YSI6IiIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoidGVzdCJ9LCJzaXAiOnt9fQ.2o2DGSX9JxwHmnyx_JI8p3I9KM4nWtl4b4CqsXELv60",
        type: "video",
      })
      : callFetch("/live/build", "POST", token, data)
  }