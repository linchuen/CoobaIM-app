import "./App.css"
import ChatPage from "./features/chat/ChatPage"
import LoginRegisterPage from "./features/login/LoginRegisterPage"
import {BrowserRouter, Route, Routes} from "react-router-dom"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
