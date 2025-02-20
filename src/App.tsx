import "./App.css"
import ChatPage from "./features/chat/ChatPage"
import LoginRegisterPage from "./features/login/LoginRegisterPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ErrorDialog } from "./components/ErrorDialog"
import config from "./app/config";
import {setTokenInfo} from "./features/common/globalSlice";
import {useAppDispatch} from "./app/hooks";

const App = () => {
    const dispatch = useAppDispatch()
    if(config.useFake){
        dispatch(setTokenInfo({
            userId: 1,
            name: "Bob",
            token: "token",
            platform: "PC",
            loginTime: "string",
            expireTime: "string"
        }))
    }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>

      <ErrorDialog />
    </>
  )
}

export default App
