import type React from "react";
import { Box, Drawer, List, ListItem, ListItemText, Typography, Divider, Avatar, Button } from "@mui/material";
import ChatBox from "../chat/ChatBox";

const CustomerSupportDashboard: React.FC = () => {
  return (
    <Box display="flex" height="100vh" bgcolor="#121212" color="#fff">
      {/* Left Sidebar with Customer Info */}
      <Drawer variant="permanent" sx={{ width: 260, flexShrink: 0, bgcolor: "#1e1e1e" }}>
        <Box sx={{ width: 260, p: 2, textAlign: "center" }}>
          <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1 }} src="/path/to/avatar.jpg" />
          <Typography variant="h6">客服人員</Typography>
          <Typography variant="body2">support@example.com</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">最近工單</Typography>
          <List>
            <ListItem>
              <ListItemText primary="工單 #12345" />
            </ListItem>
          </List>
          <Divider />
          <Typography variant="h6">用戶列表</Typography>
          <List>
            <ListItem>
              <ListItemText primary="用戶 A" />
            </ListItem>
          </List>
          <Divider />
          <Typography variant="h6">同事列表</Typography>
          <List>
            <ListItem>
              <ListItemText primary="同事 B" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Chat Section */}
      <ChatBox />

      {/* User Info Sidebar */}
      <Drawer variant="permanent" anchor="right" sx={{ width: 260, flexShrink: 0, bgcolor: "#1e1e1e" }}>
        <Box sx={{ width: 260, p: 2 }}>
          <Typography variant="h6">用戶資訊</Typography>
          <Typography variant="body1">名稱: 用戶 A</Typography>
          <Typography variant="body1">郵箱: user@example.com</Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CustomerSupportDashboard;
