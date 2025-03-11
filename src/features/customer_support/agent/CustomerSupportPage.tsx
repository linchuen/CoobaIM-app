import type React from "react";
import { useState } from "react";
import { Box, Drawer, ListItem, ListItemText, Typography, Divider, Avatar } from "@mui/material";
import { Chat, Folder, People, Work, Settings, HelpOutline, Route, Directions, SupportAgent } from "@mui/icons-material";
import Dashboard from "./Dashboard";
import ChannelManagement from "./ChannelManagement";
import CustomerSupport from "./CustomerSupport";
import Setting from "./Setting";
import UserManagement from "./UserManagement";
import HelpCenter from "./HelpCenter";
import RecentTicket from "./components/RecentTicket";
import CustomerList from "./components/CutomerList";
import AgentList from "./components/AgentList";
import RoutingManagement from "./RoutingManagement";
import TicketManagement from "./TicketManagement";

const CustomerSupportPage: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<"dashboard" | "channels" | "tickets" | "routing" | "users" | "support" | "help" | "setting">("dashboard");

  return (
    <Box display="flex" height="100vh" bgcolor="#333" color="#fff">
      {/* Left Sidebar with Customer Info */}
      <Drawer variant="permanent" sx={{ width: 260, flexShrink: 0, bgcolor: "#1e1e1e" }}>
        <Box sx={{ width: 260, p: 2, textAlign: "center" }}>
          <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1 }} src="/path/to/avatar.jpg" />
          <Typography variant="h6">客服人員</Typography>
          <Typography variant="body2">support@example.com</Typography>
          <Divider sx={{ my: 2 }} />

          <RecentTicket />
          <Divider />

          <CustomerList />
          <Divider />

          <AgentList />
          <Divider />

          {/* 頻道管理 */}
          <ListItem onClick={() => setSelectedPage("channels")}>
            <Folder sx={{ mr: 1 }} />
            <ListItemText primary="頻道管理" />
          </ListItem>
          <Divider />

          {/* 會員管理 */}
          <ListItem onClick={() => setSelectedPage("users")}>
            <People sx={{ mr: 1 }} />
            <ListItemText primary="會員管理" />
          </ListItem>
          <Divider />

          {/* 客服管理 */}
          <ListItem onClick={() => setSelectedPage("support")}>
            <SupportAgent sx={{ mr: 1 }} />
            <ListItemText primary="客服管理" />
          </ListItem>
          <Divider />

          {/* 路由管理 */}
          <ListItem onClick={() => setSelectedPage("routing")}>
            <Directions sx={{ mr: 1 }} />
            <ListItemText primary="路由管理" />
          </ListItem>
          <Divider />

          {/* 工單管理 */}
          <ListItem onClick={() => setSelectedPage("tickets")}>
            <Work sx={{ mr: 1 }} />
            <ListItemText primary="工單管理" />
          </ListItem>
          <Divider />

          {/* 幫助中心 */}
          <ListItem onClick={() => setSelectedPage("help")}>
            <HelpOutline sx={{ mr: 1 }} />
            <ListItemText primary="幫助中心" />
          </ListItem>
          <Divider />

          {/* 系統設定 */}
          <ListItem onClick={() => setSelectedPage("setting")}>
            <Settings sx={{ mr: 1 }} />
            <ListItemText primary="系統設定" />
          </ListItem>
          <Divider />
        </Box>
      </Drawer>

      {/* 主要內容區域：根據 selectedPage 渲染不同組件 */}
      <Box flexGrow={1} p={3} bgcolor="#222">
        {selectedPage === "dashboard" && <Dashboard />}
        {selectedPage === "channels" && <ChannelManagement />}
        {selectedPage === "users" && <UserManagement />}
        {selectedPage === "support" && <CustomerSupport />}
        {selectedPage === "routing" && <RoutingManagement />}
        {selectedPage === "tickets" && <TicketManagement />}
        {selectedPage === "help" && <HelpCenter />}
        {selectedPage === "setting" && <Setting />}
      </Box>
    </Box>
  );
};

export default CustomerSupportPage;
