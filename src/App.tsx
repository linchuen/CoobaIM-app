import "./App.css"
import ChatPage from "./features/chat/ChatPage"
import LoginRegisterPage from "./features/login/LoginRegisterPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ErrorDialog } from "./components/ErrorDialog"
import config from "./app/config";
import { setTokenInfo } from "./features/globalSlice";
import { useAppDispatch } from "./app/hooks";
import FloatingModal from "./components/EventFloatDialog"
import CallDialoag from "./components/CallDiaLog"
import CustomerSupportPage from "./features/customer_support/agent/CustomerSupportPage"
import CustomerPage from "./features/customer_support/customer/CustomerPage"
import CustomerChatBox from "./features/customer_support/customer/CustomerChatBox"

const App = () => {
  const dispatch = useAppDispatch()
  if (config.useFake) {
    dispatch(setTokenInfo({
      userId: 1,
      name: "Bob",
      token: "token",
      role: "USER",
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
          <Route path="/agent" element={<CustomerSupportPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/customer/chat" element={<CustomerChatBox />} />
        </Routes>
      </BrowserRouter>

      <ErrorDialog />
      <CallDialoag />
      {config.useFake ? <FloatingModal /> : <></>}
    </>
  )
}

export default App
