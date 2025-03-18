import type React from "react";
import { useState } from "react";
import { Modal, Box, Typography, IconButton, Paper, Button } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Import MUI Grid v2
import Draggable from "react-draggable";
import { Close, ChatBubble } from "@mui/icons-material";
import { useAppDispatch } from "../app/hooks";
import { setCallDialogOpen } from "../features/globalSlice";
import { addFriendApply, addFriend } from "../features/chat/FriendSlice";
import { subscribeGroups } from "../features/chat/ChatPageSlice";

const FloatingModal: React.FC = () => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false);
  const addFriendApplyEvent = () => {
    dispatch(addFriendApply({
      id: Math.random() * 1000,
      applyId: Math.random() * 1000,
      name: "test",
    }))
  }
  const addFriendEvent = () => {
    dispatch(addFriend({
      userId: Math.random() * 1000,
      friendUserId: Math.random() * 1000,
      showName: "test",
      roomId: Math.random() * 1000
    }))
  }

  const addPhoneEvent = () => {
    dispatch(setCallDialogOpen(true))
  }

  const addMessageEvent = () => {
    dispatch(subscribeGroups({
      newChat: {
        id: 23,
        name: "Alice",
        roomId: 1,
        userId: 2,
        message: "Hello World",
        type: "TEXT"
      },
      roomId: 1,
      userId: 2,
    }))
  }

  return (
    <>
      {/* Draggable Icon Button */}
      <Draggable>
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            bgcolor: "primary.main",
            borderRadius: "50%",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 4,
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        >
          <ChatBubble sx={{ color: "white" }} />
        </Box>
      </Draggable>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} disableEnforceFocus disableAutoFocus>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2
          }}
        >
          <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", top: 16, right: 16 }}>
            <Close />
          </IconButton>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" component="h2">
              {"事件觸發模擬"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 6, md: 3 }}><Button variant="contained" color="primary" onClick={addFriendApplyEvent}>送出好友</Button></Grid>
              <Grid size={{ xs: 6, md: 3 }}><Button variant="contained" color="secondary" onClick={addFriendEvent}>添加好友</Button> </Grid>
              <Grid size={{ xs: 6, md: 3 }}><Button variant="contained" color="warning">添加成員</Button> </Grid>
              <Grid size={{ xs: 6, md: 3 }}><Button variant="contained" color="success" onClick={addPhoneEvent}>播打電話</Button> </Grid>
              <Grid size={{ xs: 6, md: 3 }}><Button variant="contained" color="info" onClick={addMessageEvent}>新的訊息</Button> </Grid>
            </Grid >
          </Box >
        </Paper >
      </Modal >
    </>
  );
};

export default FloatingModal;
