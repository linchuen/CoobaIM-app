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
import { setIsLogin, setTokenInfo, setEmail as setGlobaEmail } from "../globalSlice"
import { useAppDispatch } from "../../app/hooks"
import { getDeviceType, handleFetch } from "../../services/common"
import type { LoginResponse } from "../../services/ResponseInterface"
import { reset } from "../chat/ChatPageSlice"
import { reset as friendReset } from "../chat/FriendSlice"
import { RoleType } from "../../services/constant"
import { t } from "i18next"

const LoginRegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [openSignUp, setOpenSignUp] = useState(false)
  const [openForgotPassword, setOpenForgotPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    dispatch(reset())
    dispatch(friendReset())
    handleFetch<LoginResponse>(
      dispatch,
      fetchLogin({
        email: email,
        password: password,
        platform: getDeviceType()
      }),
      data => {
        dispatch(setGlobaEmail(email))
        dispatch(setTokenInfo(data))
        dispatch(setIsLogin(true))
        if (data.role === RoleType.GUEST) {
          navigate("/customer")
        } else if (data.role === RoleType.AGENT || data.role === RoleType.ADMIN) {
          navigate("/agent")
        } else {
          navigate("/chat")
        }
      },
    )
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
           {t("signIn")}
        </Typography>

        <TextField
          fullWidth
          label={t("email")}
          variant="filled"
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#b9bbbe" } }}
          sx={{ bgcolor: "#0d1117", marginBottom: 2 }}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label={t("password")}
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
              {t("rememberMe")}
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
          {t("signIn")}
        </Button>

        <Typography variant="body2" textAlign="center" sx={{ marginBottom: 2 }}>
          <span
            style={{ color: "#3f51b5", textDecoration: "none" }}
            onClick={() => {
              setOpenForgotPassword(true)
            }}
          >
            {t("forgotPassword")}
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

        <Typography variant="body2" textAlign="center" sx={{ color: "white" }}>
          {t("noAccount")}{" "}
          <span
            style={{ color: "#3f51b5", textDecoration: "none" }}
            onClick={() => {
              setOpenSignUp(true)
            }}
          >
            {t("signUp")}
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
