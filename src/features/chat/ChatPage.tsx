import type React from "react";
import { useState } from "react";
import { AppBar, Toolbar, IconButton, InputBase, Paper, List, ListItem, ListItemText, TextField, Button, Box, Avatar, Divider, Typography } from "@mui/material";
import { Search, GroupAdd, AttachFile, InsertEmoticon, Image, VideoCall, Call, Chat } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectFirendInfoList, selectStatus } from "./chatPageSlice";

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const firendInfoList = useAppSelector(selectFirendInfoList)
  const status = useAppSelector(selectStatus)

  const [messages, setMessages] = useState([
    { id: 1, user: "Alice", text: "Hello!", align: "left" },
    { id: 2, user: "Bob", text: "Hi Alice! How are you?", align: "right" },
    { id: 3, user: "Alice", text: "I'm good! How about you?", align: "left" },
  ]);

  return (
      <Box display="flex" height="100vh" bgcolor="#0d1117" color="white">
        {/* Chat List */}
        <Paper sx={{ width: 300, padding: 2, overflow: "auto", bgcolor: "#161b22", color: "white", boxShadow: 3, margin: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Personal Chats
          </Typography>
          <List>
            {firendInfoList.map(item=>)}
            <ListItem sx={{ marginBottom: 1 }}>
              <Avatar sx={{ marginRight: 2 }}>A</Avatar>
              <ListItemText primary="Alice" secondary="Hello!" />
            </ListItem>
            <ListItem sx={{ marginBottom: 1 }}>
              <Avatar sx={{ marginRight: 2 }}>B</Avatar>
              <ListItemText primary="Bob" secondary="How are you?" />
            </ListItem>
          </List>
          <Divider sx={{ my: 2, bgcolor: "#282c34" }} />
          <Typography variant="h6" gutterBottom>
            Group Chats
          </Typography>
          <List>
            <ListItem>
              <Avatar sx={{ marginRight: 2, bgcolor: "#3f51b5" }}>
                <Chat />
              </Avatar>
              <ListItemText primary="Project Team" secondary="Meeting at 3 PM" />
            </ListItem>
          </List>
        </Paper>

        {/* Chat Area */}
        <Box flex={1} display="flex" flexDirection="column" padding={2}>
          {/* Search Bar */}
          <AppBar position="static" color="default" sx={{ mb: 1, bgcolor: "#161b22", borderRadius: 2 }}>
            <Toolbar>
              <InputBase placeholder="Search messages..." fullWidth sx={{ bgcolor: "#0d1117", borderRadius: 2, paddingX: 2, color: "white" }} />
              <IconButton sx={{ color: "white" }}>
                <Search />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <GroupAdd />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Messages */}
          <Box flex={1} padding={2} overflow="auto" display="flex" flexDirection="column" gap={2}>
            {messages.map((msg) => (
                <Box
                    key={msg.id}
                    display="flex"
                    flexDirection="column"
                    alignItems={msg.align === "left" ? "flex-start" : "flex-end"}
                    sx={{ gap: 0.5 }}
                >
                  <Typography variant="caption" color="#b9bbbe">{msg.user}</Typography>
                  <Paper
                      sx={{
                        padding: 1.5,
                        borderRadius: 2,
                        maxWidth: "60%",
                        bgcolor: msg.align === "left" ? "#282c34" : "#3f51b5",
                        color: msg.align === "left" ? "#b9bbbe" : "white",
                        boxShadow: 2,
                      }}
                  >
                    {msg.text}
                  </Paper>
                </Box>
            ))}
          </Box>

          {/* Input Area */}
          <Paper sx={{ padding: 1.5, display: "flex", alignItems: "center", bgcolor: "#161b22", boxShadow: 3, borderRadius: 2, gap: 1 }}>
            <IconButton sx={{ color: "white" }}>
              <Image />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <InsertEmoticon />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <AttachFile />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <VideoCall />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <Call />
            </IconButton>
            <TextField
                fullWidth
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                sx={{ bgcolor: "#0d1117", borderRadius: 2, input: { color: "white" } }}
            />
            <Button variant="contained" sx={{ bgcolor: "#3f51b5", color: "white" }}>
              Send
            </Button>
          </Paper>
        </Box>
      </Box>
  );
};

export default ChatPage;
