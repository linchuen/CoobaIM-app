import type React from "react";
import { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemText, Typography, Divider, Avatar, IconButton, Collapse } from "@mui/material";
import { ChevronRight, ChevronLeft, Close, ExpandLess, ExpandMore, Chat, Folder, People, Work, Assignment, Business, SupervisedUserCircle, Settings, HelpOutline } from "@mui/icons-material";
import Dashboard from "./Dashboard";

const CustomerSupportDashboard: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState<null | "tickets" | "users" | "colleagues">(null);
  const [openTickets, setOpenTickets] = useState(true);

  const toggleDrawer = (section: "tickets" | "users" | "colleagues") => {
    setOpenDrawer(openDrawer === section ? null : section);
  };


  return (
    <Box display="flex" height="100vh" bgcolor="#333" color="#fff">
      {/* Left Sidebar with Customer Info */}
      <Drawer variant="permanent" sx={{ width: 260, flexShrink: 0, bgcolor: "#1e1e1e" }}>
        <Box sx={{ width: 260, p: 2, textAlign: "center" }}>
          <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1 }} src="/path/to/avatar.jpg" />
          <Typography variant="h6">客服人員</Typography>
          <Typography variant="body2">support@example.com</Typography>
          <Divider sx={{ my: 2 }} />

          {/* 最近工單 - 可收合 */}
          <ListItem onClick={() => setOpenTickets(!openTickets)}>
            <Assignment sx={{ mr: 1 }} />
            <ListItemText primary="最近工單" />
            {openTickets ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openTickets} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {["工單 #12345", "工單 #12346", "工單 #12347"].map((text) => (
                <ListItem key={text} sx={{ pl: 4 }}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          <Divider />

          {/* 用戶列表 */}
          <ListItem onClick={() => toggleDrawer("users")}>
            <SupervisedUserCircle sx={{ mr: 1 }} />
            <ListItemText primary="用戶列表" />
            <IconButton>
              <ChevronRight />
            </IconButton>
          </ListItem>
          <Divider />

          {/* 同事列表 */}
          <ListItem onClick={() => toggleDrawer("colleagues")}>
            <Business sx={{ mr: 1 }} />
            <ListItemText primary="同事列表" />
            <IconButton>
              <ChevronRight />
            </IconButton>
          </ListItem>

          {/* 頻道管理 */}
          <ListItem >
            <Folder sx={{ mr: 1 }} />
            <ListItemText primary="頻道管理" />
          </ListItem>
          <Divider />

          {/* 會員管理 */}
          <ListItem >
            <People sx={{ mr: 1 }} />
            <ListItemText primary="會員管理" />
          </ListItem>
          <Divider />

          {/* 客服管理 */}
          <ListItem >
            <Chat sx={{ mr: 1 }} />
            <ListItemText primary="客服管理" />
          </ListItem>
          <Divider />

          {/* 工單管理 */}
          <ListItem >
            <Work sx={{ mr: 1 }} />
            <ListItemText primary="工單管理" />
          </ListItem>
          <Divider />

          {/* 幫助中心 */}
          <ListItem >
            <HelpOutline sx={{ mr: 1 }} />
            <ListItemText primary="幫助中心" />
          </ListItem>
          <Divider />

          {/* 系統設定 */}
          <ListItem >
            <Settings sx={{ mr: 1 }} />
            <ListItemText primary="系統設定" />
          </ListItem>
          <Divider />
        </Box>
      </Drawer>

      {/* Dynamic Right Drawer with Close Button */}
      <Drawer anchor="left" open={Boolean(openDrawer)} onClose={() => setOpenDrawer(null)} sx={{ width: 260 }}>
        <Box sx={{ width: 260, height:"100%", p: 2, bgcolor: "#333", color: "#fff" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {openDrawer === "tickets" ? "最近工單" : openDrawer === "users" ? "用戶列表" : "同事列表"}
            </Typography>
          </Box>
          <List>
            {openDrawer === "users" && ["用戶 A", "用戶 B", "用戶 C"].map((text) => (
              <ListItem key={text}><ListItemText primary={text} /></ListItem>
            ))}
            {openDrawer === "colleagues" && ["同事 X", "同事 Y", "同事 Z"].map((text) => (
              <ListItem key={text}><ListItemText primary={text} /></ListItem>
            ))}
          </List>
          <IconButton onClick={() => setOpenDrawer(null)} sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}>
            <ChevronLeft />
          </IconButton>
        </Box>
      </Drawer>
      <Dashboard />
    </Box>
  );
};

export default CustomerSupportDashboard;
