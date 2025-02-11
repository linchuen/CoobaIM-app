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
import {
  setErrorDialogOpen,
  setErrorMessage,
  setTokenInfo,
} from "../common/globalSlice"
import { useAppDispatch } from "../../app/hooks"

const LoginRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [openSignUp, setOpenSignUp] = useState(false)
  const [openForgotPassword, setOpenForgotPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  let request = {
    email: email,
    password: password,
  }
  const handleLogin = async () => {
    const apiResponse = await fetchLogin(request)
    if (apiResponse.code !== 0) {
      dispatch(
        setErrorMessage(apiResponse.errorMessage || "註冊失敗，請稍後再試。"),
      )
      dispatch(setErrorDialogOpen(true))
      return
    }

    if (!apiResponse.data) {
      throw new Error("User ID is required but missing.")
    }
    dispatch(setErrorDialogOpen(false))

    const data = apiResponse.data
    dispatch(
      setTokenInfo({
        userId: data.userId,
        token: data.token,
        platform: data.platform,
        ip: data.ip,
        loginTime: data.loginTime,
        expireTime: data.expireTime,
      }),
    )
    navigate("/chat")
  }

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
          <a
            href="#"
            style={{ color: "#3f51b5", textDecoration: "none" }}
            onClick={() => {
              setOpenForgotPassword(true)
            }}
          >
            Forgot your password?
          </a>
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
