import type React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

const messages = [
  {
    id: 1,
    name: "在線客服 (開戶...)",
    message: "阿吉: 新年快樂，萬事大吉~",
    unreadCount: 99,
    level: "V",
  },
  {
    id: 2,
    name: "禮賓客服",
    message: "阿吉: 新年快樂，萬事大吉~",
    unreadCount: 1,
    level: null,
  },
  {
    id: 3,
    name: "專屬客維 9D-Gia",
    message: "大哥，小妹在此祝您: 新年快樂，財源廣進~",
    unreadCount: 1,
    level: "1",
  },
];

const CustomerServiceChat: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 400, bgcolor: "background.paper", p: 2, borderRadius: 2, boxShadow: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">消息</Typography>
        <IconButton>
          <PhoneIcon color="primary" />
        </IconButton>
      </Box>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        聊天
      </Typography>

      {/* Message List */}
      <List>
        {messages.map((chat) => (
          <ListItem key={chat.id} sx={{ bgcolor: "#f5f5f5", borderRadius: 2, mb: 1 }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "gray" }}>ND</Avatar>
            </ListItemAvatar>
            <ListItemText primary={chat.name} secondary={chat.message} />
            {chat.level && (
              <Badge badgeContent={chat.level} color="primary" sx={{ mr: 1 }} />
            )}
            {chat.unreadCount > 0 && (
              <Badge badgeContent={chat.unreadCount > 99 ? "99+" : chat.unreadCount} color="error" />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CustomerServiceChat;
