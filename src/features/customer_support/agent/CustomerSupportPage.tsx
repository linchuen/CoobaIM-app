import type React from "react";
import { useState } from "react";
import { Box, Drawer, ListItem, ListItemText, Typography, Divider, Avatar } from "@mui/material";
import { Chat, Folder, People, Work, Settings, HelpOutline, Route, Directions, SupportAgent } from "@mui/icons-material";
import Dashboard from "./pages/Dashboard";
import ChannelManagement from "./pages/ChannelManagement";
import CustomerSupport from "./pages/CustomerSupport";
import Setting from "./pages/Setting";
import UserManagement from "./pages/UserManagement";
import HelpCenter from "./pages/HelpCenter";
import RecentTicket from "./components/RecentTicket";
import CustomerList from "./components/CutomerList";
import AgentList from "./components/AgentList";
import RoutingManagement from "./pages/RoutingManagement";
import TicketManagement from "./pages/TicketManagement";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { PageType, selectedPage, switchPage } from "../PageSlice";

const CustomerSupportPage: React.FC = () => {
  const dispatch = useAppDispatch()
   const page = useAppSelector(selectedPage)

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
          <ListItem onClick={() => dispatch(switchPage(PageType.channels))}>
            <Folder sx={{ mr: 1 }} />
            <ListItemText primary="頻道管理" />
          </ListItem>
          <Divider />

          {/* 會員管理 */}
          <ListItem onClick={() => dispatch(switchPage(PageType.users))}>
            <People sx={{ mr: 1 }} />
            <ListItemText primary="會員管理" />
          </ListItem>
          <Divider />

          {/* 客服管理 */}
          <ListItem onClick={() => dispatch(switchPage(PageType.support))}>
            <SupportAgent sx={{ mr: 1 }} />
            <ListItemText primary="客服管理" />
          </ListItem>
          <Divider />

          {/* 路由管理 */}
          <ListItem onClick={() => dispatch(switchPage(PageType.routing))}>
            <Directions sx={{ mr: 1 }} />
            <ListItemText primary="路由管理" />
          </ListItem>
          <Divider />

          {/* 工單管理 */}
          <ListItem onClick={() => dispatch(switchPage(PageType.tickets))}>
            <Work sx={{ mr: 1 }} />
            <ListItemText primary="工單管理" />
          </ListItem>
          <Divider />

          {/* 幫助中心 */}
          <ListItem onClick={() => dispatch(switchPage(PageType.help))}>
            <HelpOutline sx={{ mr: 1 }} />
            <ListItemText primary="幫助中心" />
          </ListItem>
          <Divider />

          {/* 系統設定 */}
          <ListItem onClick={() =>  dispatch(switchPage(PageType.setting))}>
            <Settings sx={{ mr: 1 }} />
            <ListItemText primary="系統設定" />
          </ListItem>
          <Divider />
        </Box>
      </Drawer>

      {/* 主要內容區域：根據 selectedPage 渲染不同組件 */}
      <Box flexGrow={1} p={3} bgcolor="#222">
        {page === PageType.dashboard && <Dashboard />}
        {page === PageType.channels && <ChannelManagement />}
        {page === PageType.users && <UserManagement />}
        {page === PageType.support && <CustomerSupport />}
        {page === PageType.routing && <RoutingManagement />}
        {page === PageType.tickets && <TicketManagement />}
        {page === PageType.help && <HelpCenter />}
        {page === PageType.setting && <Setting />}
      </Box>
    </Box>
  );
};

export default CustomerSupportPage;
