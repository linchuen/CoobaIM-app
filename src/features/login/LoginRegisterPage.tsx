import type React from "react"
import { useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { Facebook, Google } from "@mui/icons-material"
import { useNavigate } from "react-router"
import { RegisterDiaLog } from "./components/RegisterDiaLog"
import { ForgetPasswordDialog } from "./components/ForgetPasswordDialog"
import { fetchLogin } from "../../services/UserAPI"
import { setTokenInfo } from "../common/globalSlice"
import { useAppDispatch } from "../../app/hooks"
import { handleFetch } from "../../services/common"
import type { LoginResponse } from "../../services/ResponseInterface"
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

const LoginRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [openSignUp, setOpenSignUp] = useState(false)
  const [openForgotPassword, setOpenForgotPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () =>
    handleFetch<LoginResponse>(
      dispatch,
      fetchLogin({
        email: email,
        password: password,
      }),
      data => {
        const socket = new SockJS('http://localhost:8080/ws'); // 連接到 Spring Boot WebSocket 端點
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // 重新連接間隔（5 秒）
        });
        
        // 連接 WebSocket
        stompClient.onConnect = () => {
            console.log('Connected to WebSocket');
        
            // 訂閱 "/topic/greetings"
            stompClient.subscribe('/topic/greetings', (message) => {
                console.log('收到訊息:', message.body);
            });
        
            // 發送測試消息
            stompClient.publish({ destination: '/app/hello', body: 'John Doe' });
        };
        
        // 監聽錯誤
        stompClient.onStompError = (frame) => {
            console.error('STOMP Error:', frame);
        };
        
        // 啟動 STOMP 客戶端
        stompClient.activate();

        dispatch(setTokenInfo(data))
        navigate("/chat")
      },
    )

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#0d1117"
      color="white"
    >
      <Paper
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          bgcolor: "#161b22",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          sx={{ color: "white" }}
        >
          Sign in
        </Typography>

        <TextField
          fullWidth
          label="Email"
          variant="filled"
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#b9bbbe" } }}
          sx={{ bgcolor: "#0d1117", marginBottom: 2 }}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="filled"
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#b9bbbe" } }}
          sx={{ bgcolor: "#0d1117", marginBottom: 2 }}
          onChange={e => setPassword(e.target.value)}
        />

        <FormControlLabel
          control={<Checkbox sx={{ color: "#b9bbbe" }} />}
          label={
            <Typography variant="body2" color="#b9bbbe">
              Remember me
            </Typography>
          }
          sx={{ marginBottom: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#3f51b5", color: "white", marginBottom: 2 }}
          onClick={() => handleLogin()}
        >
          Sign in
        </Button>

        <Typography variant="body2" textAlign="center" sx={{ marginBottom: 2 }}>
          <span
            style={{ color: "#3f51b5", textDecoration: "none" }}
            onClick={() => {
              setOpenForgotPassword(true)
            }}
          >
            Forgot your password?
          </span>
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google />}
          sx={{ borderColor: "#3f51b5", color: "white", marginBottom: 2 }}
        >
          Sign in with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Facebook />}
          sx={{ borderColor: "#3f51b5", color: "white", marginBottom: 2 }}
        >
          Sign in with Facebook
        </Button>

        <Typography variant="body2" textAlign="center" sx={{ color: "white" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#3f51b5", textDecoration: "none" }}
            onClick={() => {
              setOpenSignUp(true)
            }}
          >
            Sign up
          </span>
        </Typography>
      </Paper>

      <RegisterDiaLog open={openSignUp} onClose={() => setOpenSignUp(false)} />

      <ForgetPasswordDialog
        open={openForgotPassword}
        onClose={() => setOpenForgotPassword(false)}
      />
    </Box>
  )
}

export default LoginRegisterPage
